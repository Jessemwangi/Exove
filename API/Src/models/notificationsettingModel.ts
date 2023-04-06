import mongoose from "mongoose";

const notisetting = new mongoose.Schema({
    _id: { type: String, unique: true, required: true },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    notificMessage: [{ type: String, required: true }], // this will get model name eg, question, category etc
    notisettingstatus:Boolean,
})

const notifier = new mongoose.Schema({
    _id: { type: String, unique: true, required: true },
    entityid:{ type: String, unique: true, required: true }, // primary key from the model
    entityname: String,  // this will get model name eg, question, category etc
    message: String,
    from: { type: mongoose.Schema.Types.ObjectId },
    to: { type: mongoose.Schema.Types.ObjectId },
    notifierstatus:Boolean,
})