import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { IApprovals, INotificationsSetting, INotifier, IRoles } from "../dbcontext/Interfaces.js";
import { Approvals, Notifer, NotificationSetting, Roles } from "../dbcontext/dbContext.js";

export const checkUserRoles = async (userId: String): Promise<Number | String> => {
  try {
    await dbconnect();
    const roleData: IRoles = await Roles.find({ userId, roleStatus: true  }).lean();
    await dbclose();
    if (roleData) {
      return roleData.roleLevel;
    } else {
      return `Active role for this user is not defined`;
    }
  } catch (error) {
    return "server responded with an error";
  }
};

export const addApprovals = async (approval:IApprovals) => {
    await new Approvals(approval).save()     
}

export const addToNotfication = async (newNotification: INotifier) => {
  if (newNotification) {
    const promises = newNotification.to.map(async (userId) => {
      const notificationStatus = await userEnabledNotification(userId, newNotification.entityname); // check if the user has enable notification
      if (notificationStatus) {
        // send notification
        // update notification status
        await Notifer.updateOne({ _id: newNotification._id }, { notifierstatus: true });
      }
    });
    await Promise.all(promises);
  }
};


export const userEnabledNotification = async (userId: String, entityName:String): Promise<boolean> => {
  const notiSettingsData: INotificationsSetting = await NotificationSetting.find({ userId, notisettingstatus: true }).lean();
  if (notiSettingsData) {
    return notiSettingsData.entityname.includes(entityName);
  }
  return false;
}


