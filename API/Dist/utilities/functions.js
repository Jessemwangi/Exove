import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { run } from "../Ldap/ldapTest.js";
import jwt from "jsonwebtoken";
import { Approvals, Notifer, NotificationSetting, RequestPicks, Roles, Template, Users, } from "../dbcontext/dbContext.js";
import { cookieExpiresIn, securityKey } from "../Configs/serverConfig.js";
export const addUserReportTo = async (_id) => {
    await Users.updateOne({ _id: _id }, {
        $set: {
            'workId.$[elem].workReportStatus': false,
            'workId.$[elem].deactivatedOn': new Date(),
        },
    }, { arrayFilters: [{ 'elem.workReportStatus': { $exists: true } }] });
};
export const checkUserRoles = async (userId, roleLevel) => {
    const user = await getUserF({ ldapUid: userId });
    await dbconnect();
    const roleData = await Roles.findOne({
        users: user._id,
        roleStatus: true,
    }).lean();
    if (roleData && roleData.roleLevel <= roleLevel) {
        return true;
    }
    return false;
};
export const addUserToRole = async (userId, roleId) => {
    await Roles.updateOne({ _id: roleId }, { $push: { users: userId } }).exec();
};
export const getUserF = async ({ ldapUid, _id }) => {
    await dbconnect();
    const usersResult = await Users.findOne({
        $or: [{ ldapUid: ldapUid }, { _id: _id }],
    }).select('-__v')
        .populate({
        path: "rolesId",
        model: Roles,
    })
        .lean()
        .exec();
    await dbclose();
    return usersResult;
};
export const getUserReportTo = async (userId) => {
    await dbconnect();
    const user = await Users.findOne({
        'ldapUid': userId,
        'workId.workReportStatus': true
    })
        .select({ 'workId.reportsTo': 1 })
        .exec();
    await dbclose();
    const userReportTo = user?.workId[0].reportsTo;
    return userReportTo;
};
export const addApprovals = async (approval) => {
    await new Approvals(approval).save();
};
export const addToNotification = async (newNotification) => {
    if (newNotification.to.length > 0 && newNotification.entityname !== "") {
        const promises = newNotification.to.map(async (userId) => {
            const notificationStatus = await userEnabledNotification(userId, newNotification.entityname);
            if (notificationStatus) {
                await Notifer.updateOne({ _id: newNotification._id }, { notifierstatus: true });
            }
        });
        await Promise.all(promises);
    }
};
export const userEnabledNotification = async (userId, entityName) => {
    const notiSettingsData = await NotificationSetting.findOne({ userId, notisettingstatus: true }).lean();
    if (notiSettingsData && notiSettingsData.entityname.length > 0) {
        return notiSettingsData.entityname.includes(entityName);
    }
    else {
        return false;
    }
};
export const isUserInRequestPick = async (requestedTo) => {
    const data = await RequestPicks.findOne({
        requestedTo: requestedTo,
        submitted: false,
    })
        .lean()
        .sort({ requestedOn: 1 })
        .exec();
    return data;
};
export const getUserPrevPicksAndTemplate = async (template, requestedTo) => {
    await dbconnect();
    const count = await RequestPicks.countDocuments({
        template: template,
        requestedTo: requestedTo
    });
    if (count === 0)
        return { count, _id: { _id: '' } };
    const _id = await RequestPicks.findOne({
        template: template,
        requestedTo: requestedTo
    }, '_id').exec();
    await dbclose();
    const result = { count, _id };
    console.log(_id._id);
    return result;
};
export const searchTemplate = async (template) => {
    const data = await Template.find({}).lean();
    return data.length;
};
export const ldapAuthMiddleware = async (req, res, next) => {
    try {
        if (req.path === "/api/logout") {
            res
                .clearCookie("access_token", {
                sameSite: "none",
                secure: true,
                httpOnly: true,
            })
                .status(200)
                .json("user logout");
            return;
        }
        if (req.path === "/api/login") {
            const username = req.body.username;
            const password = req.body.password;
            if (!username && !password)
                return next(new Error('Please provide both a username and a password.'));
            const user = await run(username, password);
            const dbUser = await getUserF({ ldapUid: user.uid });
            const settoken = jwt.sign({ user }, securityKey);
            return res
                .cookie("access_token", settoken, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                expires: cookieExpiresIn
            })
                .status(200)
                .json({ ...user, ...dbUser });
        }
        const token = req.cookies.access_token;
        if (token) {
            jwt.verify(token, securityKey, (err, userInfo) => {
                if (err) {
                    console.log(err);
                    return res.status(401).json("Sorry, the authentication token you provided is not valid. Please check your token and try again.");
                }
                const user = userInfo;
                req.body = {
                    ...req.body,
                    ...user,
                };
                return next();
            });
        }
        else {
            return res.status(403).json("Not authenticated");
        }
    }
    catch (error) {
        return res.status(401).send({ error: "Invalid username or password" });
    }
};
export const errorMiddleware = async (err, req, res, next) => {
    console.error(err.message);
    if (err.name === "ValidationError") {
        res.status(400);
    }
    else {
        res.status(500);
    }
    res.json(err.message);
};
//# sourceMappingURL=functions.js.map