import mongoose from "mongoose";
import { Category } from "../dbcontext/dbContext.js";

export const reportSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    feedbackId: { type: [mongoose.Schema.Types.String], ref: "FeedBacks" },
    templateId: { type: [mongoose.Schema.Types.String], ref: "Template" },
    createdBy: { type:String, required:true },
    userId: { type: String, required: true },
    requestPickId:{type:String, required: true},
})


