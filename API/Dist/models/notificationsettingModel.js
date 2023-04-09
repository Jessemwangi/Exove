import mongoose from "mongoose";
// user enables a list of notification that he can receive, this notification should be availble base on the user level
export const notisettingSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    entityname: [{ type: String, required: true }],
    notisettingstatus: Boolean,
    email: String,
    enableReminder: Boolean, // if set to true automatic reminder will be send
});
export const notifierSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    applicationid: { type: String, unique: true, required: true },
    entityname: String,
    message: String,
    link: String,
    from: { type: mongoose.Schema.Types.ObjectId },
    to: [{ type: mongoose.Schema.Types.ObjectId }],
    notifierstatus: Boolean,
    createdOn: Date,
});
//during insert the system will check if the users involve in the transaction should recieve notificationSchema, hence if yes then insert into notifier
//# sourceMappingURL=notificationsettingModel.js.map