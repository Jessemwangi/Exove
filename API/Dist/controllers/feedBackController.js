import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { FeedBacks, RequestPicks } from "../dbcontext/dbContext.js";
import { v4 as uuidv4 } from "uuid";
export const getFeeds = async (req, res) => {
    await dbconnect();
    const feedBacks = await FeedBacks.find({}).select('-__v')
        .sort({ createdOn: 1 })
        .lean();
    await dbclose();
    return res.status(200).json(feedBacks);
};
export const getFeed = async (req, res) => {
    const id = req.params.id;
    if (id) {
        return res.status(404).json("Post data not found or empty");
    }
    await dbconnect();
    const feedBacks = await FeedBacks.findOne({ _id: id })
        .lean();
    await dbclose();
    return res.status(200).json(feedBacks);
};
export const getUserFeedReq = async (req, res) => {
    const httpData = req.body;
    if (!httpData) {
        return res.status(404).json("Post data not found or empty");
        return;
    }
    try {
        await dbconnect();
        const userRequestPicks = await RequestPicks.find({
            "SelectedList.userId": httpData,
            "SelectedList.selectionStatus": true,
        })
            .lean()
            .sort({ requestedOn: 1 })
            .exec();
        await dbclose();
        return res.status(200).json(userRequestPicks);
    }
    catch (error) {
        return res.status(500).json("Internal server error");
    }
};
const verifiyFeedbackFrom = async ({ requestpicksId, feedbackTo, userId, roleLevel }) => {
    const feedback = await RequestPicks.findOne({
        _id: requestpicksId,
        requestedTo: feedbackTo,
        "SelectedList.roleLevel": roleLevel,
        "SelectedList.userId": userId,
        "SelectedList.selectionStatus": true,
        "SelectedList.feedBackSubmitted": false,
    }).select('-__v')
        .lean()
        .sort({ requestedOn: 1 })
        .exec();
    return feedback;
};
const addFeedbackToDatabase = async (newFeedback) => {
};
export const submitFeedBack = async (req, res) => {
    const user = req.body.user;
    const userId = user.uid;
    const requestpicksId = req.params.id;
    const { id } = req.params;
    const { feedbackTo, roleLevel } = req.body;
    console.log(feedbackTo, userId);
    if (feedbackTo && userId && id) {
        await dbconnect();
        const verifyFeedFrom = {
            requestpicksId: id,
            feedbackTo: feedbackTo,
            userId: userId,
            roleLevel: roleLevel
        };
        const feedback = await verifiyFeedbackFrom(verifyFeedFrom);
        if (!feedback) {
            res.status(405).json("Not authorized to Modify this feedback");
            await dbclose();
            return;
        }
        const result = await updateRequestPicks(id, userId);
        console.log("result for submitt update", result);
        await dbclose();
        if (result !== 0) {
            return res.status(200).json("feedback submitted successful");
        }
        else {
            return res.status(200).json("Failed to submit Feedback");
        }
    }
    else {
        return res
            .status(404)
            .json("Post data Incomplete post or not found or empty");
    }
};
export const addFeedBack = async (req, res) => {
    const user = req.body.user;
    const userId = user.uid;
    const requestpicksId = req.params.id;
    const httpData = req.body;
    try {
        if (!requestpicksId || requestpicksId === "") {
            res.status(404).json("Post data not found or empty");
            return;
        }
        const newFeedbackInstance = {
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
        const verifyFeedFrom = {
            requestpicksId: requestpicksId,
            feedbackTo: httpData.feedbackTo,
            userId: userId,
            roleLevel: httpData.roleLevel
        };
        const feedback = await verifiyFeedbackFrom(verifyFeedFrom);
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
        const result = await updateRequestPicks(newFeedback.requestpicksId, newFeedback.userId);
        console.log("result for submitt update", result);
        await dbclose();
        if (result !== 0) {
            return res.status(200).json("feedback submitted successful");
        }
        else {
            return res.status(200).json("Feedback saved successfully but not submitted");
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json("Internal server error");
    }
};
const updateRequestPicks = async (requestpicksId, userId) => {
    const result = await RequestPicks.updateOne({ _id: requestpicksId, "SelectedList.userId": userId }, { $set: { "SelectedList.$.feedBackSubmitted": true } });
    return result.modifiedCount;
};
//# sourceMappingURL=feedBackController.js.map