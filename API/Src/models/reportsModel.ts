import mongoose from "mongoose";

export const reportSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    feedbacks: { type: [mongoose.Schema.Types.String], ref: "FeedBacks" },
    templates: { type: [mongoose.Schema.Types.String], ref: "Template" },
    createdBy: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    userId: { type: String, required: true },
    requestPicks: { type: String, required: true },
    
})


