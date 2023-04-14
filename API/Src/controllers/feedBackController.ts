import { Request, Response } from "express";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { IFeedBacks, IRequestPicks } from "../dbcontext/Interfaces.js";
import { FeedBacks, RequestPicks } from "../dbcontext/dbContext.js";


export const getFeeds =  (req: Request, res: Response) => {
  res.status(200).json("Hi, see you want feedback");
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

export const addFeedBack =async (req:Request, res:Response) => {
  
  const httpData: IFeedBacks = req.body
    try {
      if (!httpData) {
        res.status(404).json("Post data not found or empty");
        return;
    }
    await dbconnect();
    const feedback = await RequestPicks.findOne(
      {_id:httpData.requestpicksId,
        requestedTo: httpData.feedbackTo,
        'SelectedList.userId': httpData.userId,
        'SelectedList.selectionStatus': true,
        'SelectedList.feedBackSubmitted':false,
      }
    ).lean().sort({ 'requestedOn': 1 }).exec();
       
    if (!feedback) {
      res.status(405).json("Not authorized to give this feedback");
      return;
    }
  
    const setFeedBack =await  new FeedBacks(httpData).save()
    if (setFeedBack) {
      const result = await RequestPicks.updateOne(
        { _id: httpData.requestpicksId, 'SelectedList.userId': httpData.userId, },
        { $set: { 'SelectedList.$.feedBackSubmitted': true} },
      );
      if (result.nModified > 0) {
        res.status(403).json('feedback submitted successful')
        // The update was successful
      } else {
        res.status(400).json('failed to save feedback submission status')
      }
    }
    else {
      res.status(405).json('failed to save feedback')
    }
    } catch (error) {
      res.status(500).json("Internal server error");
      console.log(error)
    }


}


/// TO START ON FEEDBACK 