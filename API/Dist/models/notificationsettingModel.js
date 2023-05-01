import mongoose from "mongoose";
export const notisettingSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    userid: { type: mongoose.Schema.Types.String, ref: "Users", required: true },
    entityname: [{ type: String, required: true }],
    notisettingstatus: Boolean,
    email: String,
    enableReminder: Boolean,
});
export const notifierSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    applicationid: { type: String, unique: true, required: true },
    entityname: String,
    message: String,
    link: String,
    from: { type: mongoose.Schema.Types.String },
    to: { type: [mongoose.Schema.Types.String], required: true },
    notifierstatus: Boolean,
    transacteOn: {
        type: Date,
        default: Date.now,
        required: true,
    },
    sendOn: Date,
});
//# sourceMappingURL=notificationsettingModel.js.map