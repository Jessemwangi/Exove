import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { RequestPicks } from "../dbcontext/dbContext.js";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { addApprovals, checkUserRoles } from "../utilities/functions.js";
export const getFeeds = (req, res) => {
    res.status(200).json("Hi, see you want feedback");
};
// will be executed by the hr
export const requestPicks = async (req, res) => {
    const requestHttpData = req.body;
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjgwOTYzMjQ5fQ.LKF3KPknCu-YKDeuCIgpT7LuclYusn9E0UN-SMqgT2c"; // req.cookies.access_token;
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
                const requestData = {
                    _id: uuidv4(),
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
                res.status(200).json("Data saved successfully!");
                await dbclose();
            }
            else {
                res.status(404).json("Post data not found or empty");
            }
        }
        catch (error) {
            res.status(500).json("server responded with an error");
            console.log(error);
        }
    });
};
export const submitRequestPicks = async (req, res) => {
    // check if user is authenticated and also we will check if current user is the same as requestedTo
    const requestHttpData = req.body;
    try {
        if (!requestHttpData) {
            res.status(404).json("Post data not found or empty");
            return;
        }
        const requestInstance = new RequestPicks(requestHttpData);
        const validationError = requestInstance.validateSync();
        if (validationError) {
            res.status(400).json(validationError.message);
            return;
        }
        const approvalData = {
            _id: "",
            createdBy: "",
            applicationId: "",
            entityname: "",
            ApprovalStatus: false,
            approvedBy: "",
            ApprovedOn: null,
            sendNotification: true,
            createdOn: new Date(),
        };
        await dbconnect();
        await requestInstance.save();
        await addApprovals(approvalData);
        await dbclose();
        res.status(200).json("Data saved successfully!");
    }
    catch (error) {
        res.status(500).json("server responded with an error");
        console.log(error);
    }
};
//# sourceMappingURL=feedBackController.js.map