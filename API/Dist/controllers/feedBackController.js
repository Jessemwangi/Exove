import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { FeedBacks, RequestPicks } from "../dbcontext/dbContext.js";
import { v4 as uuidv4 } from "uuid";
export const getFeeds = async (req, res) => {
    await dbconnect();
    const feedBacks = await FeedBacks.find({}).sort({ "createdOn": 1 }).lean();
    res.status(200).json(feedBacks);
    await dbclose();
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
const verifiyFeedbackFrom = async (requestpicksId, feedbackTo, userId) => {
    const feedback = await RequestPicks.findOne({
        _id: requestpicksId,
        requestedTo: feedbackTo,
        'SelectedList.userId': userId,
        'SelectedList.selectionStatus': true,
    }).lean().sort({ 'requestedOn': 1 }).exec();
    return feedback;
};
const addFeedbackToDatabase = async (newFeedback) => {
};
export const submitFeedBack = async (req, res) => {
    const { id } = req.params;
    const { feedbackTo, userId, requestpicksId } = req.body;
    console.log(feedbackTo, userId);
    if (feedbackTo && userId && requestpicksId && id) {
        await dbconnect();
        const feedback = await verifiyFeedbackFrom(requestpicksId, feedbackTo, userId);
        if (!feedback) {
            res.status(405).json("Not authorized to Modify this feedback");
            await dbclose();
            return;
        }
        const result = await updateRequestPicks(id, userId);
        console.log('result for submitt update', result);
        if (result !== 0) {
            res.status(403).json('feedback submitted successful');
        }
        else {
            res.status(400).json('Failed to submit Feedback');
        }
    }
    else {
        res.status(404).json("Post data Incomplete post or not found or empty");
    }
    await dbclose();
};
const updateRequestPicks = async (requestpicksId, userId) => {
    const result = await RequestPicks.updateOne({ _id: requestpicksId, 'SelectedList.userId': userId, }, { $set: { 'SelectedList.$.feedBackSubmitted': true } });
    return result.nModified;
};
export const addFeedBack = async (req, res) => {
    const httpData = req.body;
    try {
        if (!httpData) {
            res.status(404).json("Post data not found or empty");
            return;
        }
        const newFeedback = {
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
        };
        await dbconnect();
        const feedback = await verifiyFeedbackFrom(httpData.requestpicksId, httpData.feedbackTo, httpData.userId);
        if (!feedback) {
            console.log('feebackfailed');
            res.status(405).json("Not authorized to give this feedback");
            return;
        }
        const setFeedBack = await new FeedBacks(newFeedback).save();
        console.log('setFeedBack result', setFeedBack);
        if (!setFeedBack) {
            res.status(405).json('failed to save feedback');
            await dbclose();
            return;
        }
        console.log('newFeedback.submitted....', newFeedback.submitted);
        if (newFeedback.submitted === true) {
            const result = await updateRequestPicks(newFeedback.requestpicksId, newFeedback.userId);
            console.log('result for submitt update', result);
            if (result !== 0) {
                res.status(403).json('feedback submitted successful');
            }
            else {
                res.status(400).json('Failed to submit Feedback');
            }
        }
        else {
            res.status(400).json('Feedback save, untill you submit the feedback it wont be valid');
        }
        await dbclose();
    }
    catch (error) {
        res.status(500).json("Internal server error");
        console.log(error);
    }
};
//# sourceMappingURL=feedBackController.js.map