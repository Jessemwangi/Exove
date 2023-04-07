import mongoose from "mongoose";
// log application that require approval and await approvals
export const approvalsSchema = new mongoose.Schema({
    _id: String,
    createdOn: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId },
    applicationId: { type: mongoose.Schema.Types.ObjectId },
    entityname: { type: mongoose.Schema.Types.ObjectId },
    ApprovalStatus: Boolean,
    approvedBy: { type: mongoose.Schema.Types.ObjectId },
    ApprovedOn: Date,
    sendNotification: Boolean,
});
// tyhis entity has one pending approval or completion
//# sourceMappingURL=approvalsModels.js.map