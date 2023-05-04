import mongoose from "mongoose";
import { usersSchema } from "../models/usersModel.js";
import { logsSchema } from "../models/logsModel.js";
import { approvalsSchema } from "../models/approvalsModels.js";
import { jesseSchema } from "../models/testingModel.js";
import { rolesSchema } from "../models/rolesModel.js";
import { notifierSchema, notisettingSchema } from "../models/notificationsettingModel.js";
import { requestpicksSchema } from "../models/requestpicksModel.js";
import { templateSchema } from "../models/templatesModel.js";
import { questionsSchema } from "../models/questionsModel.js";
import { feedbackSchema } from "../models/feedBackModel.js";
import { CategorySchema } from "../models/categoryModel.js";
import { reportSchema } from "../models/reportsModel.js";
export const Approvals = mongoose.model('Approvals', approvalsSchema);
export const Reports = mongoose.model('Reports', reportSchema);
export const FeedBacks = mongoose.model('feedBacks', feedbackSchema);
export const Logs = mongoose.model('Logs', logsSchema);
export const NotificationSetting = mongoose.model('Notificationsetting', notisettingSchema);
export const Notifer = mongoose.model('Notifer', notifierSchema);
export const Category = mongoose.model('Category', CategorySchema);
export const Question = mongoose.model('Question', questionsSchema);
export const RequestPicks = mongoose.model('RequestPicks', requestpicksSchema);
export const Roles = mongoose.model('Roles', rolesSchema);
export const Template = mongoose.model('Template', templateSchema);
export const Users = mongoose.model('Users', usersSchema);
export const JesseM = mongoose.model('Jesse', jesseSchema);
//# sourceMappingURL=dbContext.js.map