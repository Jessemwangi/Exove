import mongoose from "mongoose";
const notisetting = new mongoose.Schema({
    _id: { type: String, unique: true, required: true },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    notificMessage: [{ type: String, required: true }],
    notisettingstatus: Boolean,
});
const notifier = new mongoose.Schema({
    _id: { type: String, unique: true, required: true },
    entityid: { type: String, unique: true, required: true },
    entityname: String,
    message: String,
    from: { type: mongoose.Schema.Types.ObjectId },
    to: { type: mongoose.Schema.Types.ObjectId },
    notifierstatus: Boolean,
});
//# sourceMappingURL=notificationsettingModel.js.map