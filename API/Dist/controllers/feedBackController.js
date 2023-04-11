import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { RequestPicks } from "../dbcontext/dbContext.js";
export const getFeeds = (req, res) => {
    res.status(200).json("Hi, see you want feedback");
};
export const getUserFeedReq = async (req, res) => {
    const httpData = req.body;
    if (!httpData) {
        res.status(404).json("Post data not found or empty");
        return;
    }
    try {
        await dbconnect();
        const userRequestPicks = await RequestPicks.find({ 'SelectedList.userId': httpData, 'SelectedList.selectionStatus': true }).lean().sort({ 'requestedOn': 1 }).exec();
        await dbclose();
        res.status(200).json(userRequestPicks);
    }
    catch (error) {
        res.status(500).json("Internal server error");
    }
};
//# sourceMappingURL=feedBackController.js.map