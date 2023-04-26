import { Request, Response } from 'express';
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
    addApprovals,
    addToNotification,
    checkUserRoles,
} from "../utilities/functions.js";
import { UpdateWriteOpResult } from 'mongoose';
  
// get Request Picks

export const getAllRequestPicks =async (req:Request,res:Response) => {
  
    //check authenticatication then retrieve user
    // will be used to retrieve request
    try {
        await dbconnect();
        const requestPicks: IRequestPicks[] = await RequestPicks.find({}).select('-__v').sort({ requestedOn: 1 }).exec();
        await dbclose()
        res.status(200).json(requestPicks);
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
}

export const getUserRequestPick = async  (req:Request,  res:Response) => {
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
    const userRequestPicks: IRequestPicks[] =
    await RequestPicks.find({ 'requestedTo': userId}).lean().sort({ requestedOn: 1}).exec();
        await dbclose();
        res.status(200).json(userRequestPicks)
} catch (error) {
    res.status(500).json("Internal server error" );
}

}

export const getIdRequestPick = async  (req:Request,  res:Response) => {
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
  const userRequestPicks: IRequestPicks =
  await RequestPicks.findOne({ '_id': id}).lean().sort({ 'requestedOn': 1}).exec();
      await dbclose();
      res.status(200).json(userRequestPicks)
} catch (error) {
  res.status(500).json("Internal server error" );
}

}

// will be executed by the hr
export const createRequestPicks = async (req: Request, res: Response) => {
  try {
      const requestHttpData: IRequestPicks = req.body;
      const user:ILdapAuth =req.body.user
      const userId: string = user.uid;
          const rolelevel = await checkUserRoles(userId,2);
          if (!rolelevel) {
            res.status(200).json("Not authorized to peform this transaction");
            return;
          }
          if (requestHttpData) {
            const primaryKey = uuidv4();
            const requestData: IRequestPicks = {
              _id: primaryKey,
              requestedTo: requestHttpData.requestedTo,
              requestedBy: userId, // will will get this info from token when we encrypt
              requestedOn: new Date(),
              SelectedList: [],
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
              message: "",
              applicationid: primaryKey,
              entityname: "",
              link: "",
              from: requestHttpData.requestedBy, // from
              to: [requestHttpData.requestedTo], // notification will be send to user, and this user must have enabled notification in 'notisetting'
              notifierstatus: false, // false not send
              sendOn: null,
              transacteOn: new Date(),
            };
            console.log(newNotification)
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

  
export const submitRequestPicks = async (req: Request, res: Response) => {
    // check if user is authenticated and also we will check if current user is the same as requestedTo or in the role of hr
  const requestHttpData: ISelectedList = req.body;
 
  const id = req.params.id;
  
    try {
      if (!requestHttpData) {
        res.status(404).json("Post data not found or empty");
        return;
      }
      const approvalData: IApprovals = {
        _id: "",
        createdBy: "",
        applicationId: "",
        entityname: "",
        approverLevel: 3,
        ApprovalStatus: false,
        approvedBy: "",
        ApprovedOn: null,
        sendNotification: true,
        createdOn: new Date(),
      };
      await dbconnect();
      const result = await RequestPicks.updateOne(
        { "_id": id },
        { $push: { SelectedList: requestHttpData } }
      );
      console.log('update result ...', result)
      if (result.modifiedCount === 0) {
        res.status(404).json("No document was updated");
        return;
      }
      else {
        res.status(200).json("Data saved successfully!");
      }
      // await addApprovals(approvalData);
      await dbclose();
    } catch (error) {
      res.status(500).json("server responded with an error");
      console.log(error);
    }
  };
  
  
  export const hrApprovesPicks = async (req: Request, res: Response) => {
    try {
      if (!req.body && !req.params.id) {
        res.status(404).json("Post data not found or empty");
        return;
      }
      const requestPicksId: String = req.params.id;
      const userId: String = req.body.userId;
      const selectionStatus: Boolean = req.body.selectionStatus;
      const selectedBy: String = req.body.selectedBy;

      console.log(req.body,req.params.id);
      
      await dbconnect();
      const result:UpdateWriteOpResult = await RequestPicks.updateOne(
        { _id: requestPicksId, 'SelectedList.userId': userId },
        { $set: { 'SelectedList.$.selectionStatus': selectionStatus, 'SelectedList.$.selectedBy': selectedBy} },
      );
      if (result.modifiedCount === 0) {
        res.status(404).json("No document was updated");
        return;
      }
      await dbclose();
      res.status(200).json("Data updated successfully!");
    } catch (error:any) {
      res.status(500).json("server responded with an error");
    }
  };


  export const hrMassApprovesPicks = async (req: Request, res: Response) => {
    try {
      if (!req.body) {
        res.status(404).json("Post data not found or empty");
        return;
      }
      const requestPicksId: number = req.body.requestPicksId;
      const selectedList: ISelectedList[] = req.body.SelectedList;
      await dbconnect();
      const updatePromises = selectedList.map(({ userId, selectionStatus }) =>
        RequestPicks.updateOne(
          { _id: requestPicksId, 'SelectedList.userId': userId },
          { $set: { 'SelectedList.$.selectionStatus': selectionStatus } },
        )
      );
      const results = await Promise.all(updatePromises);
      const nModified = results.reduce((acc:number, result:UpdateWriteOpResult) => acc + result.modifiedCount, 0);
      await dbclose();
      if (nModified === 0) {
        res.status(404).json("No document was updated");
        return;
      }
      res.status(200).json("Data updated successfully!");
    } catch (error:any) {
      await dbclose();
      res.status(500).json("server responded with an error");
    }
  };
  