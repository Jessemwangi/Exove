import mongoose from "mongoose";

// log application that require approval and await approvals
export const approvalsSchema = new mongoose.Schema({
  _id: String,
  createdOn: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId }, // from which user, automatically selects current user
  applicationId: { type: mongoose.Schema.Types.ObjectId }, // will get the primary key of the activity awaiting approval
  entityname: { type: mongoose.Schema.Types.ObjectId }, // this will come from entitynamemodel, so as to identify what activity this approval belong to
  ApprovalStatus: Boolean,
  approvedBy: { type: mongoose.Schema.Types.ObjectId },
  ApprovedOn: Date,
  sendNotification: Boolean,
});
