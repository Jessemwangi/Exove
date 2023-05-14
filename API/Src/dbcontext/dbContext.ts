import mongoose from "mongoose";
import { usersSchema } from "../models/usersModel.js";
import { logsSchema } from "../models/logsModel.js";
import { approvalsSchema } from "../models/approvalsModels.js";
import { jesseSchema } from "../models/testingModel.js";
import { rolesSchema } from "../models/rolesModel.js";
// import { userRolesSchema } from "../models/userRoles.js";
import { requestpicksSchema } from "../models/requestpicksModel.js";
import { templateSchema } from "../models/templatesModel.js";
import { questionsSchema } from "../models/questionsModel.js";
import { feedbackSchema } from "../models/feedBackModel.js";
import { CategorySchema } from "../models/categoryModel.js";
import { IApprovals, IEntityName, IFeedBacks, ILogs, INotifier, IQCategory, IQuestion, IReports, IRequestPicks, IRoles, ITemplates, IUser } from "./Interfaces.js";
import { reportSchema } from "../models/reportsModel.js";
import { NotifierSchema, NotisettingSchema } from "../models/notificationsettingModel.js";
import { EntitySchema } from "../models/entitynameModels.js";

export const Entity = mongoose.model<IEntityName>('Entity',EntitySchema)
export const Approvals = mongoose.model<IApprovals>('Approvals', approvalsSchema);
export const Reports = mongoose.model<IReports>('Reports', reportSchema);
export const FeedBacks = mongoose.model<IFeedBacks>('FeedBacks', feedbackSchema);
export const Logs = mongoose.model<ILogs>('Logs', logsSchema);
export const NotificationSetting = mongoose.model('Notificationsetting', NotisettingSchema); // setting to receive notification
export const Notifer = mongoose.model<INotifier>('Notifer', NotifierSchema); // sent notification
export const Category = mongoose.model<IQCategory>('Category', CategorySchema);
export const Question = mongoose.model<IQuestion>('Question', questionsSchema);
export const RequestPicks = mongoose.model<IRequestPicks>('RequestPicks', requestpicksSchema);
export const Roles = mongoose.model<IRoles>('Roles', rolesSchema);
export const Template = mongoose.model<ITemplates>('Template', templateSchema);
// export const UserRoles = mongoose.model('UserRoles',userRolesSchema)
export const Users = mongoose.model<IUser>('Users', usersSchema);
export const JesseM = mongoose.model('Jesse', jesseSchema); // for personal testing