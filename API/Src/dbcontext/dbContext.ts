import mongoose from "mongoose";
import { usersSchema, worksReportSchema } from "../models/usersModel.js";
import { feedBacksSchema } from "../models/feedBackModel.js";
import { logsSchema } from "../models/logsModel.js";
import { approvalsSchema } from "../models/approvalsModels.js";
import { jesseSchema } from "../models/testingModel.js";
import { rolesSchema } from "../models/rolesModel.js";
import { userRolesSchema } from "../models/userRoles.js";
import { notifierSchema, notisettingSchema } from "../models/notificationsettingModel.js";


export const Approvals = mongoose.model('Approvals',approvalsSchema)
export const FeedBacks = mongoose.model('feedBacks', feedBacksSchema);
export const Logs = mongoose.model('Logs', logsSchema);

export const NotificationSetting = mongoose.model('Notificationsetting', notisettingSchema); // setting to receive notification
export const Notifer = mongoose.model('Notifer', notifierSchema); // sent notification
export const Notifications = mongoose.model('Notifications', notificationSchema);
export const Notifications = mongoose.model('Notifications', notificationSchema);
export const Notifications = mongoose.model('Notifications', notificationSchema);


export const WorksReport = mongoose.model('WorksReport', worksReportSchema);
export const Roles = mongoose.model('Roles', rolesSchema);
export const UserRoles = mongoose.model('UserRoles',userRolesSchema)
export const Users = mongoose.model('Users', usersSchema);
export const JesseM = mongoose.model('Jesse', jesseSchema); // for personal testing