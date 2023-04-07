import mongoose from "mongoose";

const notisettingSchema = new mongoose.Schema({
    _id: { type: String, unique: true, required: true },
    userid: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    entityname: [{ type: String, required: true }], // this will get model name eg, question, category etc so that to enable or disable notification from this entinty
    notisettingstatus: Boolean, //enable or disable notification from this entity
    email:String, // this will be used as alternative email if the found
})

const notifierSchema = new mongoose.Schema({
    _id: { type: String, unique: true, required: true },
    applicationid:{ type: String, unique: true, required: true }, // primary key from the model
    entityname: String,  // this will get model name eg, question, category etc and from it get the notification message and activity namee
    message: String,
    from: { type: mongoose.Schema.Types.ObjectId }, // from 
    to: { type: mongoose.Schema.Types.ObjectId }, // notification will be send to user, and this user must have enabled notification in 'notisetting'
    notifierstatus:Boolean,
})

//during insert the system will check if the users involve in the transaction should recieve notificationSchema, hence if yes then insert into notifier