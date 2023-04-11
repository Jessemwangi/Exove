import { Request, Response } from "express";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { IRequestPicks } from "../dbcontext/Interfaces.js";
import { RequestPicks } from "../dbcontext/dbContext.js";


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
    // const selectedLists: ISelectedList[][] =
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



/// TO START ON FEEDBACK 