import mongoose from "mongoose";
export const reportSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    feedbacks: { type: [mongoose.Schema.Types.String], ref: "FeedBacks" },
    template: { type: String, ref: "Template" },
    createdBy: { type: String, required: true },
    userId: { type: String, required: true },
    requestPicks: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
});
export const reportsStepSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    reportId: { type: String, required: true },
    reportLevel: { type: Number, required: true },
});
//# sourceMappingURL=reportsModel.js.map