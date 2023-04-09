import mongoose from "mongoose";
// log application that require approval and await approvals, during fetching we will join this schema with applicationiD the check approval status, and join with entitymodel to check approved by who
export const approvalsSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    createdOn: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    applicationId: { type: mongoose.Schema.Types.ObjectId, required: true },
    entityname: { type: mongoose.Schema.Types.ObjectId, required: true },
    ApprovalStatus: Boolean,
    approvedBy: { type: mongoose.Schema.Types.ObjectId },
    ApprovedOn: Date,
    sendNotification: Boolean,
});
// tyhis entity has one pending approval or completion
//# sourceMappingURL=approvalsModels.js.map