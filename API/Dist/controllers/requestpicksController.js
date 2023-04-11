import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { RequestPicks } from "../dbcontext/dbContext.js";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { addToNotification, checkUserRoles, } from "../utilities/functions.js";
export const getAllRequestPicks = async (req, res) => {
    try {
        await dbconnect();
        const requestPicks = await RequestPicks.find({}).sort({ requestedOn: 1 }).exec();
        await dbclose();
        res.status(200).json(requestPicks);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getUserRequestPick = async (req, res) => {
    const httpData = req.body;
    if (!httpData) {
        res.status(404).json("Post data not found or empty");
        return;
    }
    try {
        await dbconnect();
        const userRequestPicks = await RequestPicks.find({ 'requestedTo': httpData }).lean().sort({ 'requestedOn': 1 }).exec();
        await dbclose();
        res.status(200).json(userRequestPicks);
    }
    catch (error) {
        res.status(500).json("Internal server error");
    }
};
export const createRequestPicks = async (req, res) => {
    const requestHttpData = req.body;
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjgwOTYzMjQ5fQ.LKF3KPknCu-YKDeuCIgpT7LuclYusn9E0UN-SMqgT2c";
    if (!token)
        return res.status(401).json("Not Authenticated!");
    jwt.verify(token, "s3cr3t", async (err, userInfo) => {
        if (err)
            return res.status(403).json("Authentication token Not Valid");
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
                const requestData = {
                    _id: primaryKey,
                    requestedTo: requestHttpData.requestedTo,
                    requestedBy: requestHttpData.requestedBy,
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
                const newNotification = {
                    _id: uuidv4(),
                    message: "",
                    applicationid: primaryKey,
                    entityname: "",
                    link: "",
                    from: requestHttpData.requestedBy,
                    to: [requestHttpData.requestedTo],
                    notifierstatus: false,
                    sendOn: null,
                    transacteOn: new Date(),
                };
                console.log(newNotification);
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
    });
};
export const submitRequestPicks = async (req, res) => {
    const requestHttpData = req.body;
    const id = req.params.id;
    console.log('requestHttpData', requestHttpData, 'ID NUMEBER ', id);
    try {
        if (!requestHttpData) {
            res.status(404).json("Post data not found or empty");
            return;
        }
        const approvalData = {
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
        const result = await RequestPicks.updateOne({ _id: id }, { $push: { SelectedList: requestHttpData } });
        if (result.nModified === 0) {
            res.status(404).json("No document was updated");
            return;
        }
        await dbclose();
        res.status(200).json("Data saved successfully!");
    }
    catch (error) {
        res.status(500).json("server responded with an error");
        console.log(error);
    }
};
export const hrApprovesPicks = async (req, res) => {
    try {
        if (!req.body && !req.params.id) {
            res.status(404).json("Post data not found or empty");
            return;
        }
        const requestPicksId = req.params.id;
        const userId = req.body.userId;
        const selectionStatus = req.body.selectionStatus;
        const selectedBy = req.body.selectedBy;
        console.log(req.body, req.params.id);
        await dbconnect();
        const result = await RequestPicks.updateOne({ _id: requestPicksId, 'SelectedList.userId': userId }, { $set: { 'SelectedList.$.selectionStatus': selectionStatus, 'SelectedList.$.selectedBy': selectedBy } });
        if (result.nModified === 0) {
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
    try {
        if (!req.body) {
            res.status(404).json("Post data not found or empty");
            return;
        }
        const requestPicksId = req.body.requestPicksId;
        const selectedList = req.body.SelectedList;
        await dbconnect();
        const updatePromises = selectedList.map(({ userId, selectionStatus }) => RequestPicks.updateOne({ _id: requestPicksId, 'SelectedList.userId': userId }, { $set: { 'SelectedList.$.selectionStatus': selectionStatus } }));
        const results = await Promise.all(updatePromises);
        const nModified = results.reduce((total, { nModified }) => total + nModified, 0);
        if (nModified === 0) {
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
//# sourceMappingURL=requestpicksController.js.map