import mongoose from "mongoose";

// log application that require approval and await approvals, during fetching we will join this
// schema with applicationiD the check approval status, and join with entitymodel to check approved by who
export const approvalsSchema = new mongoose.Schema({
  _id: { type: String, required: true},
  createdOn: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId,ref:'Users' }, // from which user, automatically selects current user
  applicationId: { type: mongoose.Schema.Types.ObjectId, required:true}, // will get the primary key of the activity awaiting approval
  entityname: { type: mongoose.Schema.Types.ObjectId, required: true },
  // this will come from entitynamemodel, so as to identify what activity this approval belong to and who can approved it
  approverLevel: Number,
  ApprovalStatus: Boolean,
  approvedBy: { type: mongoose.Schema.Types.String },
  ApprovedOn: Date,
  sendNotification: Boolean,
});

// this entity has one pending approval or completion