import { Request, Response } from 'express';
import {
    IApprovals,
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
  
// get Request Picks

export const getAllRequestPicks =async (req:Request,res:Response) => {
  
    //check authenticatication then retrieve user
    // will be used to retrieve request
    try {
        await dbconnect();
        const requestPicks: IRequestPicks[] = await RequestPicks.find({}).sort({ requestedOn: 1 }).exec();
        await dbclose()
        res.status(200).json(requestPicks);
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
}

export const getUserRequestPick = async  (req:Request,  res:Response) => {
    const httpData: String = req.body
    
    if (!httpData) {
        res.status(404).json("Post data not found or empty");
        return;
    }
    // get only the from the selectedlist
    // const selectedLists: ISelectedList[][] =
    //     await RequestPicks.find({ 'SelectedList.userId': httpData, 'SelectedList.selectionStatus': true }, { 'SelectedList.$': 1 }).lean().exec();
    try {
        await dbconnect();
    const userRequestPicks: IRequestPicks[] =
    await RequestPicks.find({ 'requestedTo': httpData}).lean().sort({ 'requestedOn': 1}).exec();
        await dbclose();
        res.status(200).json(userRequestPicks)
} catch (error) {
    res.status(500).json("Internal server error" );
}

}

// will be executed by the hr
export const createRequestPicks = async (req: Request, res: Response) => {
    const requestHttpData: IRequestPicks = req.body;
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjgwOTYzMjQ5fQ.LKF3KPknCu-YKDeuCIgpT7LuclYusn9E0UN-SMqgT2c"; // req.cookies.access_token;
    if (!token) return res.status(401).json("Not Authenticated!");
    jwt.verify(
      token,
      "s3cr3t",
      async (
        err: jwt.VerifyErrors | null,
        userInfo: string | jwt.JwtPayload | undefined
      ) => {
        if (err) return res.status(403).json("Authentication token Not Valid");
  
        try {
          if (requestHttpData) {
            const rolelevel = await checkUserRoles(requestHttpData.requestedBy);
            if (typeof rolelevel === "string") {
              res.status(200).json(rolelevel);
              return;
            }
            if (typeof rolelevel === "number" && rolelevel < 3) {
              res.status(200).json("Not authorised");
              return;
            }
            const primaryKey = uuidv4();
            const requestData: IRequestPicks = {
              _id: primaryKey,
              requestedTo: requestHttpData.requestedTo,
              requestedBy: requestHttpData.requestedBy, // will will get this info from token when we encrypt
              requestedOn: new Date(),
              SelectedList: [],
              submitted: false,
              submittedOn: null,
            };
            console.log(requestData);
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
      }
    );
};

  
export const submitRequestPicks = async (req: Request, res: Response) => {
    // check if user is authenticated and also we will check if current user is the same as requestedTo or in the role of hr
  const requestHttpData: ISelectedList = req.body;
  const id = req.params.id;
  console.log('requestHttpData', requestHttpData , 'ID NUMEBER ' , id)
  
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
        { _id: id },
        { $push: { SelectedList: requestHttpData } }
      );
      if (result.nModified === 0) {
        res.status(404).json("No document was updated");
        return;
      }
      // await addApprovals(approvalData);
      await dbclose();
      res.status(200).json("Data saved successfully!");
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
      const result = await RequestPicks.updateOne(
        { _id: requestPicksId, 'SelectedList.userId': userId },
        { $set: { 'SelectedList.$.selectionStatus': selectionStatus, 'SelectedList.$.selectedBy': selectedBy} },
      );
      if (result.nModified === 0) {
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
      const nModified = results.reduce((total, { nModified }) => total + nModified, 0);
      if (nModified === 0) {
        res.status(404).json("No document was updated");
        return;
      }
      await dbclose();
      res.status(200).json("Data updated successfully!");
    } catch (error:any) {
      res.status(500).json("server responded with an error");
    }
  };
  