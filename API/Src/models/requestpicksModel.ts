import mongoose from "mongoose";

const requestpicksModel = new mongoose.Schema({
  _id: String,
  requestedTo: { type: mongoose.Schema.Types.ObjectId }, // the person who will recieve and select five individual to give  him /her feedback.
  requestedBy: { type: mongoose.Schema.Types.ObjectId }, // user in the role of Hr or higher level
  requestedOn: Date,
  SelectedList: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      selectionStatus: Boolean, // allow the HR to approve or disapprove,
      selectedBy: { userId: mongoose.Schema.Types.ObjectId },
    },
    ], // an array of user select to give feedback, Hr can increase this number endless,
    submitted: Boolean,
  submittedOn:Date,
});
