import mongoose from "mongoose";

// user enables a list of notification that he can receive, this notification should be availble base on the user level
export const NotisettingSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    userid: { type: mongoose.Schema.Types.String, ref: "Users", required: true },
    entityname: [{ type: String, required: true }], // this will get model name eg, question, category etc so that to enable or disable notification from this entinty
    notisettingstatus: Boolean, //enable or disable notification for this user
    email: String, // this will be used as alternative email if the found
    enableReminder: Boolean, // if set to true automatic reminder will be send
    
})

export const NotifierSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    applicationid:{ type: String, unique: true, required: true }, // primary key from the model
    entityname: String,  // this will get model name eg, question, category etc and from it get the notification message and activity namee
    message: String,
    link:String,
    from: { type: mongoose.Schema.Types.String }, // from 
    to: { type: [mongoose.Schema.Types.String], required: true }, // notification will be send to user, and this user must have enabled notification in 'notisetting'
    notifierstatus: Boolean,
    transacteOn: {
        type: Date,
        default: Date.now,
        required: true,
    },
    sendOn:Date,
})

//during insert the system will check if the users involve in the transaction should recieve notificationSchema, hence if yes then insert into notifier