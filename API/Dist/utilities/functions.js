import { dbclose, dbconnect, securityKey } from "../Configs/dbConnect.js";
import { run } from "../Ldap/ldapTest.js";
import jwt from 'jsonwebtoken';
import { Approvals, Notifer, NotificationSetting, Roles, Template, Users } from "../dbcontext/dbContext.js";
export const checkUserRoles = async (userId, roleLevel) => {
    await dbconnect();
    const roleData = await Roles.findOne({ userId, roleStatus: true }).lean();
    await dbclose();
    if (roleData && roleData.roleLevel <= roleLevel) {
        return true;
    }
    return false;
};
export const addUserToRole = async (userId, roleId) => {
    const result = await Roles.updateOne({ _id: roleId }, { $push: { userId } }).exec();
};
export const getUserF = async ({ ldapUid, _id }) => {
    await dbconnect();
    const usersResult = await Users.findOne({ $or: [{ ldapUid: ldapUid }, { _id: _id }] })
        .populate({
        path: "rolesId",
        model: Roles,
    }).lean()
        .exec();
    await dbclose();
    return usersResult;
};
export const addApprovals = async (approval) => {
    await new Approvals(approval).save();
};
export const addToNotification = async (newNotification) => {
    if (newNotification.to.length > 0 && newNotification.entityname !== '') {
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
    const notiSettingsData = await NotificationSetting.find({ userId, notisettingstatus: true }).lean();
    console.log(notiSettingsData);
    if (notiSettingsData) {
        return notiSettingsData.entityname.includes(entityName);
    }
    return false;
};
export const searchTemplate = async (template) => {
    const data = await Template.find({}).lean();
    console.log(data);
    return data.length;
};
export const ldapAuthMiddleware = async (req, res, next) => {
    try {
        if (req.path === '/api/logout') {
            res.clearCookie("access_token", {
                sameSite: "none",
                secure: true,
                httpOnly: true,
            }).status(200).json("user logout");
            return;
        }
        ;
        if (req.path === '/api/login') {
            const username = req.body.username;
            const password = req.body.password;
            const Luser = await run(username, password);
            const user = await getUserF({ ldapUid: Luser.uid });
            const settoken = jwt.sign({ user }, securityKey);
            console.log('ldap user', Luser, "db user", user);
            return res.cookie("access_token", settoken, {
                httpOnly: true,
                sameSite: "none"
            }).status(200).json(user);
        }
        const token = req.cookies.access_token;
        if (token) {
            jwt.verify(token, securityKey, (err, userInfo) => {
                if (err) {
                    console.log(err);
                    return res.status(401).json("Authentication token Not Valid");
                }
                const user = userInfo;
                req.body = {
                    ...req.body, ...user
                };
                return next();
            });
        }
        else {
            return res.status(403).json('Not authenticated');
        }
    }
    catch (error) {
        return res.status(401).send({ error: 'Invalid username or password' });
    }
};
export const errorMiddleware = async (err, req, res, next) => {
    console.error(err.message);
    if (err.name === 'ValidationError') {
        res.status(400);
    }
    else {
        res.status(500);
    }
    res.json(err.message);
};
//# sourceMappingURL=functions.js.map