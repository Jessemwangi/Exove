import mongoose from "mongoose";
const notisettingSchema = new mongoose.Schema({
    _id: { type: String, unique: true, required: true },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    entityname: [{ type: String, required: true }],
    notisettingstatus: Boolean,
    email: String, // this will be used as alternative email if the found
});
const notifierSchema = new mongoose.Schema({
    _id: { type: String, unique: true, required: true },
    applicationid: { type: String, unique: true, required: true },
    entityname: String,
    message: String,
    from: { type: mongoose.Schema.Types.ObjectId },
    to: { type: mongoose.Schema.Types.ObjectId },
    notifierstatus: Boolean,
});
//during insert the system will check if the users involve in the transaction should recieve notificationSchema, hence if yes then insert into notifier
//# sourceMappingURL=notificationsettingModel.js.map