import { Request, Response } from "express";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { IFeedBacks, IRequestPicks } from "../dbcontext/Interfaces.js";
import { FeedBacks, RequestPicks } from "../dbcontext/dbContext.js";
import { v4 as uuidv4 } from "uuid";


export const getFeeds = async (req: Request, res: Response) => {
  await dbconnect()
  const feedBacks:IFeedBacks[] = await FeedBacks.find({}).sort({"createdOn":1}).lean()
  res.status(200).json(feedBacks);
  await dbclose()
};

export const getUserFeedReq = async (req:Request, res:Response) => {
  const httpData: String = req.body
    
    if (!httpData) {
        res.status(404).json("Post data not found or empty");
        return;
    }
    // get only the from the selectedlist
    //  const selectedLists: ISelectedList[][] =
    //     await RequestPicks.find({ 'SelectedList.userId': httpData, 'SelectedList.selectionStatus': true }, { 'SelectedList.$': 1 }).lean().exec();
    try {
        await dbconnect();
    const userRequestPicks: IRequestPicks[] =
    await RequestPicks.find({ 'SelectedList.userId': httpData, 'SelectedList.selectionStatus': true }).lean().sort({ 'requestedOn': 1 }).exec();
        await dbclose();
        res.status(200).json(userRequestPicks)
} catch (error) {
    res.status(500).json("Internal server error" );
}
}

const verifiyFeedbackFrom  = async (requestpicksId: String,feedbackTo:String, userId:String ):Promise<IRequestPicks> => {

  const feedback = await RequestPicks.findOne(
    {
      _id: requestpicksId,
      requestedTo: feedbackTo,
      'SelectedList.userId': userId,
      'SelectedList.selectionStatus': true,
       'SelectedList.feedBackSubmitted':false,
    }
  ).lean().sort({ 'requestedOn': 1 }).exec();

  return feedback;
  // return interface type IRequestPicks
}

 const addFeedbackToDatabase = async (newFeedback:IFeedBacks) => {
//    code to add feedback to database
   
 }

export const submitFeedBack = async (req: Request, res: Response) => {
  const { id } = req.params
  const { feedbackTo, userId } = req.body
  console.log(feedbackTo, userId )
  if (feedbackTo && userId && id) {
    await dbconnect();
    const feedback = await verifiyFeedbackFrom( id,feedbackTo,  userId)
       
    if (!feedback) {
      res.status(405).json("Not authorized to Modify this feedback");
      await dbclose()
    return;
  }
    const result:Number = await updateRequestPicks(id, userId)
    console.log('result for submitt update', result)
    if (result !== 0) {
      res.status(403).json('feedback submitted successful')
      // The update was successful
    } else {
      res.status(400).json('Failed to submit Feedback')
    }
  }
  else {
    res.status(404).json("Post data Incomplete post or not found or empty");
  }
  await dbclose()
  // code to check if feedback is submitted
}

const updateRequestPicks = async (requestpicksId:String,userId:String ):Promise<Number> => {
  // code to update RequestPicks collection after submitted
  const result = await RequestPicks.updateOne(
    { _id: requestpicksId, 'SelectedList.userId': userId, },
    { $set: { 'SelectedList.$.feedBackSubmitted': true} },
  );
  return result.modifiedCount;
}

export const addFeedBack = async (req: Request, res: Response) => {
  
  const httpData:IFeedBacks = req.body
    try {
      if (!httpData) {
        res.status(404).json("Post data not found or empty");
        return;
      }
      const newFeedback: IFeedBacks = {
        _id: uuidv4(),
        template: httpData.template,
        userId: httpData.userId,
        requestpicksId: httpData.requestpicksId,
        feedbackTo: httpData.feedbackTo,
        progress: httpData.progress,
        responseDateLog: [new Date],
        categories: httpData.categories,
        createdOn: new Date,
        submitted: false,               
    }
      
    await dbconnect();
    const feedback = await verifiyFeedbackFrom( httpData.requestpicksId, httpData.feedbackTo,  httpData.userId)
       
      if (!feedback) {
      console.log('feebackfailed')
      res.status(405).json("Not authorized to give this feedback");
      return;
    }

      const setFeedBack = await new FeedBacks(newFeedback).save()
      console.log('setFeedBack result' , setFeedBack)
      if (!setFeedBack) {
        res.status(405).json('failed to save feedback')
       await  dbclose()
        return;
      }
      console.log('newFeedback.submitted....', newFeedback.submitted)
    if ( newFeedback.submitted===true) {
      const result:Number = await updateRequestPicks(newFeedback.requestpicksId, newFeedback.userId)
      console.log('result for submitt update', result)
      if (result !== 0) {
        res.status(403).json('feedback submitted successful')
        // The update was successful
      } else {
        res.status(400).json('Failed to submit Feedback')
      }
    }
    else {
      res.status(400).json('Feedback save, untill you submit the feedback it wont be valid')
    }
      await dbclose();
    } catch (error) {
      res.status(500).json("Internal server error");
      console.log(error)
    }
}




/// TO START ON FEEDBACK 


    