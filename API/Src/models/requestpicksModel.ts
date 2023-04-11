import mongoose from "mongoose";

export const requestpicksSchema= new mongoose.Schema({
  _id:  { type: String, required: true },
  requestedTo: String, // the person who will recieve and select five individual to give  him /her feedback.
  requestedBy: String, // user in the role of Hr or higher level
  requestedOn: Date,
  SelectedList: [
    {
      userId: String,
      selectionStatus: Boolean, // allow the HR to approve or disapprove,
      selectedBy: String,
    },
    ], // an array of user select to give feedback, Hr can increase this number endless,
    submitted: Boolean,
  submittedOn:Date,
});

