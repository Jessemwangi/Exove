import { NextFunction, Request, Response } from "express";
import {
  IApprovals,
  ILdapAuth,
  INotifier,
  IRequestPicks,
  ISelectedList,
} from "../dbcontext/Interfaces.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Approvals, RequestPicks } from "../dbcontext/dbContext.js";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import {
  IUserTemplateInPicks,
  addApprovals,
  addToNotification,
  checkUserRoles,
  getUserPrevPicksAndTemplate,
  getUserReportTo,
  isUserInRequestPick,
} from "../utilities/functions.js";
import { UpdateWriteOpResult } from "mongoose";
import { frontEnd } from "../Configs/serverConfig.js";
import { SelectedListModel } from "../models/requestpicksModel.js";

// get Request Picks

export const getAllRequestPicks = async (req: Request, res: Response) => {
  //check authenticatication then retrieve user
  // will be used to retrieve request
  try {
    await dbconnect();
    const requestPicks: IRequestPicks[] = await RequestPicks.find({})
      .select("-__v")
      .sort({ requestedOn: 1 })
      .exec();
    await dbclose();
    res.status(200).json(requestPicks);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserRequestPick = async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    res.status(404).json("Post data not found or empty");
    return;
  }
  // get only the from the selectedlist
  // const selectedLists: ISelectedList[][] =
  //     await RequestPicks.find({ 'SelectedList.userId': httpData, 'SelectedList.selectionStatus': true }, { 'SelectedList.$': 1 }).lean().exec();
  try {
    await dbconnect();
    const userRequestPicks: IRequestPicks[] = await RequestPicks.find({
      requestedTo: userId,
    })
      .lean()
      .sort({ requestedOn: 1 })
      .exec();
    await dbclose();
    res.status(200).json(userRequestPicks);
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

export const getIdRequestPick = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(404).json("Post data not found or empty");
    return;
  }
  // get only the from the selectedlist
  // const selectedLists: ISelectedList[][] =
  //     await RequestPicks.find({ 'SelectedList.userId': httpData, 'SelectedList.selectionStatus': true }, { 'SelectedList.$': 1 }).lean().exec();
  try {
    await dbconnect();
    const userRequestPicks: IRequestPicks | null = await RequestPicks.findOne({
      _id: id,
    })
      .lean()
      .sort({ requestedOn: 1 })
      .exec();
    await dbclose();
    res.status(200).json(userRequestPicks);
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

export const WhoToGiveFeedbackTo = async (req: Request, res: Response) => {
  const userId = req.params.name;
  if (!userId) {
    res.status(404).json("Post data not found or empty");
    return;
  }
  // get only the from the selectedlist
  try {
    await dbconnect();
    
    const selectedLists = await RequestPicks.aggregate([
      { $match: { "SelectedList.userId": userId } },
      {
        $project: {
          SelectedList: {
            $filter: {
              input: "$SelectedList",
              as: "selected",
              cond: { $and: [{ $eq: ["$$selected.userId", userId] }, { $eq: ["$$selected.selectionStatus", true] }] }
            }
          },
          requestedTo: 1,
          _id: 1
        }
      }
    ]);
    

    await dbclose();
    res.status(200).json(selectedLists);
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

// will be executed by the hr
export const createRequestPicks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestHttpData: IRequestPicks = req.body;
    const user: ILdapAuth = req.body.user;
    const userId: string = user.uid;

    const rolelevel = await checkUserRoles(userId, 2);
    if (!rolelevel) {
      res.status(403).json("Not authorized to peform this transaction");
      return;
    }

    const requestedTo: string = requestHttpData.requestedTo;
    const template: string = requestHttpData.template;

    const activePick: IUserTemplateInPicks = await getUserPrevPicksAndTemplate(
      template,
      requestedTo
    );

    if (activePick.count !== 0) {
      return next(
        new Error(
          `Cannot request more than one pick against current template please view the pick https://exove.vercel.app/api/picks/pick-id/${activePick._id._id}`
        )
      );
    }

    const reportTo = await getUserReportTo(requestHttpData.requestedTo);

    const defaultReportTo: ISelectedList = {
      userId: reportTo,
      selectionStatus: true,
      roleLevel: 3,
      selectedBy: userId,
      feedBackSubmitted: false,
    };

    const defaultList: ISelectedList = {
      userId: requestedTo,
      selectionStatus: true,
      roleLevel: 5,
      selectedBy: userId,
      feedBackSubmitted: false,
    };

    if (requestHttpData) {
      const primaryKey = uuidv4();
      const requestData: IRequestPicks = {
        _id: primaryKey,
        template: template,
        requestedTo: requestedTo,
        requestedBy: userId, // will will get this info from token when we encrypt
        requestedOn: new Date(),
        SelectedList: [defaultList, defaultReportTo],
        submitted: false,
        submittedOn: null,
      };

      const requestInstance = new RequestPicks(requestData);
      const validationError = requestInstance.validateSync();

      if (validationError) {
        res.status(400).json(validationError.message);
        return;
      }
      await dbconnect();
      await requestInstance.save();

      const newNotification: INotifier = {
        _id: uuidv4(),
        messageBody: "",
        applicationid: primaryKey,
        entityname: "RequestPicks",
        link: `https://exove.vercel.app/api/picks/pick-id/${primaryKey}`,
        from: userId, // from
        to: [requestHttpData.requestedTo], // notification will be send to user, and this user must have enabled notification in 'notisetting'
        notifierstatus: false, // false not send
        sendOn: null,
        transacteOn: new Date(),
        createdBy: userId,
      };
      await addToNotification(newNotification);
      res.status(200).json("Data saved successfully!");
      await dbclose();
    } else {
      res.status(404).json("Post data not found or empty");
      return;
    }
  } catch (error) {
    res.status(500).json("server responded with an error");
    console.log(error);
  }
};

export const submitRequestPicks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // check if user is authenticated and also we will check if current user is the same as requestedTo or in the role of hr
  const requestHttpData: ISelectedList = req.body;
  const user: ILdapAuth = req.body.user;
  const userId: string = user.uid;
  await dbconnect();
  const rolelevel = await checkUserRoles(userId, 2);
  const requestPickData = await isUserInRequestPick(userId);

  if (!rolelevel && requestPickData === null) {
    res.status(200).json("Not authorized to peform this transaction");
    return;
  }

  const newPick = new SelectedListModel({
    roleLevel: requestHttpData.roleLevel,
    selectionStatus: requestHttpData.selectionStatus,
    userId: requestHttpData.userId,
    feedBackSubmitted: false,
    selectedBy: userId,
  });

  const validationError = newPick.validateSync();
  if (validationError) {
    res.status(400).json(validationError.message);
    return;
  }

  const id = req.params.id;

  try {
    if (!requestHttpData) {
      res.status(404).json("Post data not found or empty");
      return;
    }
    const approvalData: IApprovals = {
      _id: "",
      createdBy: userId,
      applicationId: "",
      entityname: "",
      approverLevel: 3,
      ApprovalStatus: false,
      approvedBy: "",
      ApprovedOn: null,
      sendNotification: true,
      createdOn: new Date(),
    };

    const result = await RequestPicks.updateOne(
      { _id: id, submitted: false },
      { $push: { SelectedList: newPick } },
      { new: true }
    );
    if (result?.modifiedCount === 0) {
      res.status(404).json("No document was updated");
      return;
    } else {
      res.status(200).json("Data saved successfully!");
    }
    // await addApprovals(approvalData);
    await dbclose();
  } catch (error) {
    res.status(500).json("server responded with an error");
    console.log(error);
  }
};

export const hrApprovesPicks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: ILdapAuth = req.body.user;
  const selectedBy: string = user.uid;
  const rolelevel = await checkUserRoles(selectedBy, 2);
  if (!rolelevel) {
    res.status(200).json("Not authorized to peform this transaction");
    return;
  }
  try {
    if (!req.body && !req.params.id) {
      res.status(404).json("Post data not found or empty");
      return;
    }
    const requestPicksId: string = req.params.id;
    const userId: string = req.body.userId;
    const roleLevel: number = req.body.roleLevel;
    const selectionStatus: Boolean = req.body.selectionStatus;

    if (!requestPicksId && !userId && !roleLevel && !selectionStatus)
      return next(
        new Error(
          `Please provide the following, requestPicksId,selectionStatus, roleLevel and userId.`
        )
      );

    await dbconnect();
    const result: UpdateWriteOpResult = await RequestPicks.updateOne(
      {
        _id: requestPicksId,
        "SelectedList.userId": userId,
        "SelectedList.roleLevel": roleLevel,
      },
      {
        $set: {
          "SelectedList.$.selectionStatus": selectionStatus,
          "SelectedList.$.selectedBy": selectedBy,
        },
      }
    );

    if (result.modifiedCount === 0) {
      res.status(404).json("No document was updated");
      return;
    }
    await dbclose();
    res.status(200).json("Data updated successfully!");
  } catch (error: any) {
    res.status(500).json("server responded with an error");
  }
};

// work from here
export const hrMassApprovesPicks = async (req: Request, res: Response) => {
  const user: ILdapAuth = req.body.user;
  const selectedBy: string = user.uid;
  const rolelevel = await checkUserRoles(selectedBy, 2);
  if (!rolelevel) {
    res.status(200).json("Not authorized to peform this transaction");
    return;
  }
  try {
    if (!req.body) {
      res.status(404).json("Data not found or empty");
      return;
    }
    const requestPicksId: String = req.params.id;
    const selectedList: ISelectedList[] = req.body.SelectedList;
    await dbconnect();
    const updatePromises = selectedList.map(
      async (n) =>
        await RequestPicks.updateOne(
          { _id: requestPicksId, "SelectedList.userId": n.userId },
          {
            $set: {
              "SelectedList.$.selectionStatus": n.selectionStatus,
              "SelectedList.$.selectedBy": selectedBy,
            },
          }
        )
    );
    const results = await Promise.all(updatePromises);
    const nModified = results.reduce(
      (acc: number, result: UpdateWriteOpResult) => acc + result.modifiedCount,
      0
    );
    await dbclose();
    if (nModified === 0) {
      res.status(404).json("No document was updated");
      return;
    }
    res.status(200).json("Data updated successfully!");
  } catch (error: any) {
    await dbclose();
    console.log(error);
    res.status(500).json("server responded with an error");
  }
};

export const finalPickSubmit = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pickId: string = req.params.id;
  try {
    await dbconnect();
    const submit = await RequestPicks.findOneAndUpdate(
      {
        _id: pickId,
        submitted: false,
      },
      {
        submitted: true,
        submittedOn: new Date(),
      },
      { new: true }
    ).exec();
    await dbclose();
    if (!submit) {
      return res.status(200).json("failed to submit");
    } else {
      res.status(200).json("Request submitted successful");
      return;
    }
  } catch (error: any) {
    next(error.message);
  }
};
