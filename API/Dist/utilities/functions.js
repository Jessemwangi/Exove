import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { Approvals, Notifer, NotificationSetting, Roles } from "../dbcontext/dbContext.js";
export const checkUserRoles = async (userId) => {
    try {
        await dbconnect();
        const roleData = await Roles.find({ userId, roleStatus: true }).lean();
        await dbclose();
        if (roleData) {
            return roleData.roleLevel;
        }
        else {
            return `Active role for this user is not defined`;
        }
    }
    catch (error) {
        return "server responded with an error";
    }
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
//# sourceMappingURL=functions.js.map