import { NextFunction, Request, Response } from "express";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import {
  IFCategory,
  IFeedBacks,
  ILdapAuth,
  IRequestPicks,
  IVerifyFeedRole,
} from "../dbcontext/Interfaces.js";
import { FeedBacks, RequestPicks } from "../dbcontext/dbContext.js";
import { v4 as uuidv4 } from "uuid";



export const getFeeds = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await dbconnect();
    const feedBacks: IFeedBacks[] = await FeedBacks.find({}).select('-__v')
      .sort({ createdOn: 1 })
      .lean();
    await dbclose();
    return res.status(200).json(feedBacks);
  }
  catch (error) {
    next(error)
  }
};

export const getFeed = async (req: Request, res: Response , next: NextFunction) => {
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(404).json("Post data not found or empty");
    }
    await dbconnect();
    const feedBacks: IFeedBacks | null = await FeedBacks.findOne({ _id: id })
      .lean();
    await dbclose();
    return res.status(200).json(feedBacks);
  }
  catch (err)
  {
    next(err)
  }
};

export const getUserFeedReq = async (req: Request, res: Response, next: NextFunction) => {
  const name: string = req.params.name;
  if (!name) {
     res.status(404).json("Post data not found or empty");
    return;
  }
  // get only the from the selectedlist
  //  const selectedLists: ISelectedList[][] =
  //     await RequestPicks.find({ 'SelectedList.userId': httpData, 
//   'SelectedList.selectionStatus': true
// }, { 'SelectedList.$': 1 }).lean().exec();
  
  try {
    await dbconnect();
    const userFeedback: IFeedBacks[] = await FeedBacks.find({
      "feedbackTo": name
    })
    .select('-__v')
    .lean()
    .sort({ createdOn: 1 })
    .exec();
    
    
    await dbclose();
    return res.status(200).json(userFeedback);
  } catch (error) {
    next(error)
  }
};

export const getUserTotalAnsFeed = async (req: Request, res: Response, next: NextFunction) => {
  const name: string = req.params.name;
  if (!name) {
    return res.status(404).json("Post data not found or empty");
    return;
  }
  
  try {
    await dbconnect();
    const requestPicksCount = await RequestPicks.countDocuments({
      "SelectedList.userId": name
    });
    
    const feedbacksCount = await FeedBacks.countDocuments({
      userId: name
    });
    const userFeedback: IFeedBacks[] = await FeedBacks.find({
      "feedbackTo": name
    })
    .select('-__v')
    .lean()
    .sort({ createdOn: 1 })
    .exec();
    
    
    await dbclose();
    return res.status(200).json({ ...userFeedback, feedbacksCount, requestPicksCount });
  } catch (error) {
    next(error)
  }
};

const updateRequestPicks = async (
  requestpicksId: string,
  userId: string
): Promise<Number> => {
  // code to update RequestPicks collection after submitted
  const result = await RequestPicks.updateOne(
    { _id: requestpicksId, "SelectedList.userId": userId },
    { $set: { "SelectedList.$.feedBackSubmitted": true } }
  );
  return result.modifiedCount;
};

const verifiyFeedbackFrom = async (
  { requestpicksId,
    feedbackTo,
    userId,
    roleLevel }:IVerifyFeedRole
): Promise<IRequestPicks | null> => {
  console.log(requestpicksId,
    feedbackTo,
    userId,
    roleLevel) 
  const feedback:IRequestPicks | null = await RequestPicks.findOne({
    _id: requestpicksId,
     requestedTo: feedbackTo,
     "SelectedList.roleLevel":roleLevel,
      "SelectedList.userId": userId,
     "SelectedList.selectionStatus": true,
     "SelectedList.feedBackSubmitted": false,
  }).select('-__v')
    .lean()
    .sort({ requestedOn: 1 })
    .exec();
  return feedback;
  // return interface type IRequestPicks
};

const addFeedbackToDatabase = async (newFeedback: IFeedBacks) => {
  //    code to add feedback to database
};

export const submitFeedBack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: ILdapAuth = req.body.user;
    const userId: string = user.uid;
    const requestpicksId: string = req.params.id;
    const { id } = req.params;
    const { feedbackTo, roleLevel } = req.body;
    if (feedbackTo && userId && id) {
      await dbconnect();
      const verifyFeedFrom: IVerifyFeedRole = {
        requestpicksId: id,
        feedbackTo: feedbackTo,
        userId: userId,
        roleLevel: roleLevel
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
  }
  catch (err) {
    next(err)
  }
};

export const addFeedBack = async (req: Request, res: Response, next: NextFunction) => {
  const user: ILdapAuth = req.body.user;
  const userId: string = user.uid;
  const requestpicksId: string = req.params.id;

  const httpData: IFeedBacks = req.body;
  
  const httpCategories: IFCategory[] = httpData.categories
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
      categories: httpCategories,
      createdOn: new Date(),
      submitted: false,
    };
    const newFeedback = new FeedBacks(newFeedbackInstance);
    const validationError = newFeedback.validateSync();

    if (validationError) {
     return next(validationError);
     
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
      res.status(405).json("Not authorized to give this feedback");
      await dbclose();
      return;
    }

    const setFeedBack = await new FeedBacks(newFeedback).save();
  
    if (!setFeedBack) {
      res.status(405).json("failed to save feedback");
      await dbclose();
      return;
    }
   
      const result: Number = await updateRequestPicks(
        newFeedback.requestpicksId,
        newFeedback.userId
      );
      await dbclose();
      if (result !== 0) {
        return res.status(200).json("Success! Your data has been saved successfully.");
        // The update was successful
      } else {
        return res.status(200).json("Success! Your data has been saved successfully. But not submitted");
      }
  } catch (error) {
  next(error)
  }
};



/// TO START ON FEEDBACK
