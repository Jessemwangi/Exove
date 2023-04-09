import mongoose from "mongoose";
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
//# sourceMappingURL=approvalsModels.js.map