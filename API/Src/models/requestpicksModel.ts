import mongoose from "mongoose";

export const requestpicksSchema= new mongoose.Schema({
  _id:  { type: String, required: true },
  requestedTo: { type: String, required: true }, // the person who will recieve and select five individual to give  him /her feedback.
  requestedBy: { type: String, required: true }, // user in the role of Hr or higher level
  requestedOn: { type: Boolean, default: new Date, required: true },
  SelectedList: [
    {
      userId: { type: String, required: true },
      selectionStatus: { type: Boolean, required: true }, // allow the HR to approve or disapprove,
      selectedBy: { type: String, required: true },
      feedBackSubmitted:{ type: Boolean, default:false, required: true }, // when the feedback is submmitted we update to true
    },
    ], // an array of user select to give feedback, Hr can increase this number endless,
    submitted: Boolean,
  submittedOn:Date,
});

