import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { run } from "../Ldap/ldapTest.js";
import jwt from 'jsonwebtoken';
import { Approvals, Notifer, NotificationSetting, Roles, Template } from "../dbcontext/dbContext.js";
export const checkUserRoles = async (userId, roleLevel) => {
    await dbconnect();
    const roleData = await Roles.findOne({ userId, roleStatus: true }).lean();
    await dbclose();
    if (roleData && roleData.roleLevel >= roleLevel) {
        return true;
    }
    return false;
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
        const token = req.cookies.access_token;
        if (token) {
            jwt.verify(token, "s3cr3t", (err, userInfo) => {
                if (err) {
                    console.log(err);
                    return res.status(403).json("Authentication token Not Valid");
                }
                const user = userInfo;
                console.log(user);
                req.body = {
                    ...req.body, user
                };
            });
            return next();
        }
        const username = req.body.username;
        const password = req.body.password;
        const user = await run(username, password);
        console.log(user);
        const settoken = jwt.sign({ user }, "s3cr3t");
        console.log(user);
        return res.cookie("access_token", settoken, {
            httpOnly: true,
            secure: true,
        }).status(200).json(user);
    }
    catch (error) {
        return res.status(401).send({ error: 'Invalid username or password' });
    }
};
//# sourceMappingURL=functions.js.map