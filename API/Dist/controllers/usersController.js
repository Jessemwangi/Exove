import { Roles, Users } from "../dbcontext/dbContext.js";
import { v4 as uuidv4 } from "uuid";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { addUserReportTo, addUserToRole, getUserF } from "../utilities/functions.js";
export const getUser = async (req, res) => {
    if (!req.params)
        return res.status(404).json("user infomation not found");
    try {
        const user = await getUserF({ ldapUid: req.params.name });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
export const getUserId = async (req, res) => {
    if (!req.params)
        return res.status(404).json("user infomation not found");
    try {
        const user = await getUserF({ _id: req.params.id });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
export const getUsers = async (req, res) => {
    try {
        await dbconnect();
        const users = await Users.find({}).select('-__v')
            .populate({
            path: "rolesId",
            model: Roles,
            select: '-__v',
        }).lean()
            .exec();
        await dbclose();
        res.status(200).json(users);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
export const postUser = async (req, res) => {
    try {
        const userhttpData = req.body;
        const workReport = userhttpData.workId;
        const primaryKey = uuidv4();
        const newUser = {
            _id: primaryKey,
            ldapUid: userhttpData.ldapUid,
            firstName: userhttpData.firstName,
            surname: userhttpData.surname,
            email: userhttpData.email,
            imageUrl: userhttpData.imageUrl,
            displayName: userhttpData.displayName,
            workId: workReport,
            title: userhttpData.title,
            phone: userhttpData.phone,
            userStatus: true,
            rolesId: userhttpData.rolesId
        };
        await dbconnect();
        const q = await new Users(newUser).save();
        if (q) {
            await addUserToRole(primaryKey, newUser.rolesId);
            res.status(200).json('User saved');
            await dbclose();
            return;
        }
        else {
            res.status(501).json('failed to save');
            await dbclose();
            return;
        }
    }
    catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};
export const putUser = async (req, res) => {
    try {
        const userhttpData = req.body;
        const workReport = userhttpData.workId;
        const primaryKey = req.params.id;
        const newUser = {
            ldapUid: userhttpData.ldapUid,
            firstName: userhttpData.firstName,
            surname: userhttpData.surname,
            email: userhttpData.email,
            displayName: userhttpData.displayName,
            workId: workReport,
            imageUrl: userhttpData.imageUrl,
            title: userhttpData.title,
            phone: userhttpData.phone,
            userStatus: true,
            rolesId: userhttpData.rolesId
        };
        await dbconnect();
        const q = await Users.findByIdAndUpdate(primaryKey, newUser, { new: true }).exec();
        if (q) {
            await addUserToRole(primaryKey, newUser.rolesId);
            res.status(200).json('User saved');
            await dbclose();
            return;
        }
        else {
            res.status(501).json('failed to save');
            await dbclose();
            return;
        }
    }
    catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
};
export const addWorkId = async (req, res) => {
    const primaryKey = req.params.id;
    const httpData = req.body;
    if (!httpData)
        return res.status(404).json('invalid data');
    try {
        const reportTo = {
            reportsTo: httpData.reportsTo,
            workReportStatus: true,
            createdOn: new Date(),
        };
        await dbconnect();
        await addUserReportTo(primaryKey);
        const addWorkId = await Users.updateOne({ _id: primaryKey }, {
            $push: {
                'workId': reportTo
            }
        });
        await dbclose();
        if (addWorkId.modifiedCount !== 0) {
            return res.status(200).json('User reporting status changed');
        }
        else {
            return res.status(200).json('No Changes where made');
        }
    }
    catch (error) {
        res.status(500).json(error.message);
        console.log(error);
        return;
    }
};
//# sourceMappingURL=usersController.js.map