import { Request, Response } from "express";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import {
  IFeedBacks,
  ILdapAuth,
  IRequestPicks,
  IVerifyFeedRole,
} from "../dbcontext/Interfaces.js";
import { FeedBacks, RequestPicks } from "../dbcontext/dbContext.js";
import { v4 as uuidv4 } from "uuid";



export const getFeeds = async (req: Request, res: Response) => {
  await dbconnect();
  const feedBacks: IFeedBacks[] = await FeedBacks.find({})
    .sort({ createdOn: 1 })
    .lean();
  await dbclose();
  return res.status(200).json(feedBacks);
};

export const getFeed = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (id) {
    return res.status(404).json("Post data not found or empty");
  }
  await dbconnect();
  const feedBacks: IFeedBacks[] = await FeedBacks.findOne({ _id: id })
    .lean();
  await dbclose();
  return res.status(200).json(feedBacks);
};

export const getUserFeedReq = async (req: Request, res: Response) => {
  const httpData: String = req.body;

  if (!httpData) {
    return res.status(404).json("Post data not found or empty");
    return;
  }
  // get only the from the selectedlist
  //  const selectedLists: ISelectedList[][] =
  //     await RequestPicks.find({ 'SelectedList.userId': httpData, 'SelectedList.selectionStatus': true }, { 'SelectedList.$': 1 }).lean().exec();
  try {
    await dbconnect();
    const userRequestPicks: IRequestPicks[] = await RequestPicks.find({
      "SelectedList.userId": httpData,
      "SelectedList.selectionStatus": true,
    })
      .lean()
      .sort({ requestedOn: 1 })
      .exec();
    await dbclose();
    return res.status(200).json(userRequestPicks);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
};

const verifiyFeedbackFrom = async (
  { requestpicksId,
    feedbackTo,
    userId,
    roleLevel }:IVerifyFeedRole
): Promise<IRequestPicks> => {
  const feedback = await RequestPicks.findOne({
    _id: requestpicksId,
    requestedTo: feedbackTo,
    "SelectedList.roleLevel":roleLevel,
    "SelectedList.userId": userId,
    "SelectedList.selectionStatus": true,
    "SelectedList.feedBackSubmitted": false,
  })
    .lean()
    .sort({ requestedOn: 1 })
    .exec();

  return feedback;
  // return interface type IRequestPicks
};

const addFeedbackToDatabase = async (newFeedback: IFeedBacks) => {
  //    code to add feedback to database
};

export const submitFeedBack = async (req: Request, res: Response) => {
  const user: ILdapAuth = req.body.user;
  const userId: String = user.uid;
  const requestpicksId: String = req.params.id;
  const { id } = req.params;
  const { feedbackTo,roleLevel } = req.body;
  console.log(feedbackTo, userId);
  if (feedbackTo && userId && id) {
    await dbconnect();
    const verifyFeedFrom: IVerifyFeedRole = {
      requestpicksId: id,
      feedbackTo:feedbackTo,
      userId:userId,
        roleLevel:roleLevel
    }
    const feedback = await verifiyFeedbackFrom(verifyFeedFrom);

    if (!feedback) {
      res.status(405).json("Not authorized to Modify this feedback");
      await dbclose();
      return;
    }

    const result: Number = await updateRequestPicks(id, userId);
    console.log("result for submitt update", result);
    await dbclose();
    if (result !== 0) {
      return res.status(200).json("feedback submitted successful");
      // The update was successful
    } else {
      return res.status(200).json("Failed to submit Feedback");
    }
  } else {
    return res
      .status(404)
      .json("Post data Incomplete post or not found or empty");
  }
};

export const addFeedBack = async (req: Request, res: Response) => {
  const user: ILdapAuth = req.body.user;
  const userId: String = user.uid;
  const requestpicksId: String = req.params.id;

  const httpData: IFeedBacks = req.body;
  try {
    if (!requestpicksId || requestpicksId === "") {
      res.status(404).json("Post data not found or empty");
      return;
    }
    const newFeedbackInstance: IFeedBacks = {
      _id: uuidv4(),
      template: httpData.template,
      userId: userId,
      requestpicksId: requestpicksId,
      roleLevel: httpData.roleLevel,
      feedbackTo: httpData.feedbackTo,
      progress: httpData.progress,
      responseDateLog: [new Date()],
      categories: httpData.categories,
      createdOn: new Date(),
      submitted: false,
    };
    const newFeedback = new FeedBacks(newFeedbackInstance);
    const validationError = newFeedback.validateSync();

    if (validationError) {
      res.status(400).json(validationError.message);
      return;
    }

    await dbconnect();
    const verifyFeedFrom: IVerifyFeedRole = {
      requestpicksId: requestpicksId,
      feedbackTo:httpData.feedbackTo,
      userId:userId,
        roleLevel:httpData.roleLevel
    }
    const feedback = await verifiyFeedbackFrom(
      verifyFeedFrom
    );

    if (!feedback) {
      console.log("feebackfailed");
      res.status(405).json("Not authorized to give this feedback");
      await dbclose();
      return;
    }

    const setFeedBack = await new FeedBacks(newFeedback).save();
    console.log("setFeedBack result", setFeedBack);
    if (!setFeedBack) {
      res.status(405).json("failed to save feedback");
      await dbclose();
      return;
    }

    console.log("newFeedback.submitted....", newFeedback.submitted);
   
      const result: Number = await updateRequestPicks(
        newFeedback.requestpicksId,
        newFeedback.userId
      );
      console.log("result for submitt update", result);
      await dbclose();
      if (result !== 0) {
        return res.status(200).json("feedback submitted successful");
        // The update was successful
      } else {
        return res.status(200).json("Feedback saved successfully but not submitted");
      }
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};

const updateRequestPicks = async (
  requestpicksId: String,
  userId: String
): Promise<Number> => {
  // code to update RequestPicks collection after submitted
  const result = await RequestPicks.updateOne(
    { _id: requestpicksId, "SelectedList.userId": userId },
    { $set: { "SelectedList.$.feedBackSubmitted": true } }
  );
  return result.modifiedCount;
};

/// TO START ON FEEDBACK
