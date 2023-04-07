import mongoose from "mongoose";
import { usersSchema, worksReportSchema } from "../models/usersModel.js";
import { feedBacksSchema } from "../models/feedBackModel.js";
import { logsSchema } from "../models/logsModel.js";
import { approvalsSchema } from "../models/approvalsModels.js";
import { notificationSchema } from "../models/notificationModel.js";
export const Approvals = mongoose.model('Approvals', approvalsSchema);
export const FeedBacks = mongoose.model('feedBacks', feedBacksSchema);
export const Logs = mongoose.model('Logs', logsSchema);
export const Notifications = mongoose.model('Notifications', notificationSchema);
export const Users = mongoose.model('Users', usersSchema);
export const WorksReport = mongoose.model('WorksReport', worksReportSchema);
//# sourceMappingURL=dbContext.js.map