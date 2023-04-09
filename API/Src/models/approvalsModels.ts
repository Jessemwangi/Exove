import mongoose from "mongoose";

// log application that require approval and await approvals, during fetching we will join this schema with applicationiD the check approval status, and join with entitymodel to check approved by who
export const approvalsSchema = new mongoose.Schema({
  _id: String,
  createdOn: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId,ref:'Users' }, // from which user, automatically selects current user
  applicationId: { type: mongoose.Schema.Types.ObjectId }, // will get the primary key of the activity awaiting approval
  entityname: { type: mongoose.Schema.Types.ObjectId }, // this will come from entitynamemodel, so as to identify what activity this approval belong to and who can approved it
  ApprovalStatus: Boolean,
  approvedBy: { type: mongoose.Schema.Types.ObjectId },
  ApprovedOn: Date,
  sendNotification: Boolean,
});

// tyhis entity has one pending approval or completion