import { v4 as uuidv4 } from "uuid";
import { RequestPicks } from "../dbcontext/dbContext.js";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { addToNotification, checkUserRoles, isUserInRequestPick, } from "../utilities/functions.js";
import { SelectedListModel } from "../models/requestpicksModel.js";
export const getAllRequestPicks = async (req, res) => {
    try {
        await dbconnect();
        const requestPicks = await RequestPicks.find({})
            .select("-__v")
            .sort({ requestedOn: 1 })
            .exec();
        await dbclose();
        res.status(200).json(requestPicks);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getUserRequestPick = async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
        res.status(404).json("Post data not found or empty");
        return;
    }
    try {
        await dbconnect();
        const userRequestPicks = await RequestPicks.find({
            requestedTo: userId,
        })
            .lean()
            .sort({ requestedOn: 1 })
            .exec();
        await dbclose();
        res.status(200).json(userRequestPicks);
    }
    catch (error) {
        res.status(500).json("Internal server error");
    }
};
export const getIdRequestPick = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(404).json("Post data not found or empty");
        return;
    }
    try {
        await dbconnect();
        const userRequestPicks = await RequestPicks.findOne({
            _id: id,
        })
            .lean()
            .sort({ requestedOn: 1 })
            .exec();
        await dbclose();
        res.status(200).json(userRequestPicks);
    }
    catch (error) {
        res.status(500).json("Internal server error");
    }
};
export const createRequestPicks = async (req, res, next) => {
    try {
        const requestHttpData = req.body;
        const user = req.body.user;
        const userId = user.uid;
        const rolelevel = await checkUserRoles(userId, 2);
        if (!rolelevel) {
            res.status(200).json("Not authorized to peform this transaction");
            return;
        }
        const defaultList = {
            userId: requestHttpData.requestedTo,
            selectionStatus: true,
            roleLevel: 5,
            selectedBy: userId,
            feedBackSubmitted: true,
        };
        if (requestHttpData) {
            const primaryKey = uuidv4();
            const requestData = {
                _id: primaryKey,
                requestedTo: requestHttpData.requestedTo,
                requestedBy: userId,
                requestedOn: new Date(),
                SelectedList: [defaultList],
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
            const newNotification = {
                _id: uuidv4(),
                message: "",
                applicationid: primaryKey,
                entityname: "RequestPicks",
                link: `https://exove.vercel.app/api/picks/pick-id/${primaryKey}`,
                from: userId,
                to: [requestHttpData.requestedTo],
                notifierstatus: false,
                sendOn: null,
                transacteOn: new Date(),
                createdBy: userId,
            };
            await addToNotification(newNotification);
            res.status(200).json("Data saved successfully!");
            await dbclose();
        }
        else {
            res.status(404).json("Post data not found or empty");
            return;
        }
    }
    catch (error) {
        res.status(500).json("server responded with an error");
        console.log(error);
    }
};
export const submitRequestPicks = async (req, res) => {
    const requestHttpData = req.body;
    const user = req.body.user;
    const userId = user.uid;
    await dbconnect();
    const rolelevel = await checkUserRoles(userId, 2);
    const requestPickData = await isUserInRequestPick(userId);
    if (!rolelevel && requestPickData === null) {
        res.status(200).json("Not authorized to peform this transaction");
        return;
    }
    const newPick = new SelectedListModel({
        roleLevel: requestHttpData.roleLevel,
        selectionStatus: requestHttpData.selectionStatus,
        userId: requestHttpData.userId,
        feedBackSubmitted: false,
        selectedBy: userId,
    });
    const validationError = newPick.validateSync();
    if (validationError) {
        res.status(400).json(validationError.message);
        return;
    }
    const id = req.params.id;
    try {
        if (!requestHttpData) {
            res.status(404).json("Post data not found or empty");
            return;
        }
        const approvalData = {
            _id: "",
            createdBy: userId,
            applicationId: "",
            entityname: "",
            approverLevel: 3,
            ApprovalStatus: false,
            approvedBy: "",
            ApprovedOn: null,
            sendNotification: true,
            createdOn: new Date(),
        };
        const result = await RequestPicks.findByIdAndUpdate({ _id: id, submitted: false }, { $push: { SelectedList: newPick } }, { new: true });
        console.log("update result ...", result);
        if (result.modifiedCount === 0) {
            res.status(404).json("No document was updated");
            return;
        }
        else {
            res.status(200).json("Data saved successfully!");
        }
        await dbclose();
    }
    catch (error) {
        res.status(500).json("server responded with an error");
        console.log(error);
    }
};
export const hrApprovesPicks = async (req, res) => {
    const user = req.body.user;
    const selectedBy = user.uid;
    const rolelevel = await checkUserRoles(selectedBy, 2);
    if (!rolelevel) {
        res.status(200).json("Not authorized to peform this transaction");
        return;
    }
    try {
        if (!req.body && !req.params.id) {
            res.status(404).json("Post data not found or empty");
            return;
        }
        const requestPicksId = req.params.id;
        const userId = req.body.userId;
        const selectionStatus = req.body.selectionStatus;
        await dbconnect();
        const result = await RequestPicks.updateOne({ _id: requestPicksId, "SelectedList.userId": userId }, {
            $set: {
                "SelectedList.$.selectionStatus": selectionStatus,
                "SelectedList.$.selectedBy": selectedBy,
            },
        });
        if (result.modifiedCount === 0) {
            res.status(404).json("No document was updated");
            return;
        }
        await dbclose();
        res.status(200).json("Data updated successfully!");
    }
    catch (error) {
        res.status(500).json("server responded with an error");
    }
};
export const hrMassApprovesPicks = async (req, res) => {
    const user = req.body.user;
    const selectedBy = user.uid;
    const rolelevel = await checkUserRoles(selectedBy, 2);
    if (!rolelevel) {
        res.status(200).json("Not authorized to peform this transaction");
        return;
    }
    try {
        if (!req.body) {
            res.status(404).json("Data not found or empty");
            return;
        }
        const requestPicksId = req.body.requestPicksId;
        const selectedList = req.body.SelectedList;
        console.log("selectedList .....", selectedList);
        await dbconnect();
        const updatePromises = selectedList.map(async (n) => await RequestPicks.updateOne({ _id: requestPicksId, "SelectedList.userId": n.userId }, {
            $set: {
                "SelectedList.$.selectionStatus": n.selectionStatus,
                "SelectedList.$.selectedBy": selectedBy,
            },
        }));
        const results = await Promise.all(updatePromises);
        const nModified = results.reduce((acc, result) => acc + result.modifiedCount, 0);
        await dbclose();
        if (nModified === 0) {
            res.status(404).json("No document was updated");
            return;
        }
        res.status(200).json("Data updated successfully!");
    }
    catch (error) {
        await dbclose();
        console.log(error);
        res.status(500).json("server responded with an error");
    }
};
export const finalPickSubmit = async (req, res, next) => {
    const pickId = req.params.id;
    console.log(pickId);
    try {
        await dbconnect();
        const submit = await RequestPicks.findOneAndUpdate({
            _id: pickId,
            submitted: false,
        }, {
            submitted: true,
            submittedOn: new Date(),
        }, { new: true }).exec();
        await dbclose();
        console.log(submit);
        if (!submit) {
            return res.status(200).json("failed to submit");
        }
        else {
            res.status(200).json("Request submitted successful");
            return;
        }
    }
    catch (error) {
        next(error.message);
    }
};
//# sourceMappingURL=requestpicksController.js.map