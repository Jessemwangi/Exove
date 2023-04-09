import mongoose from "mongoose";

export const questionCategorySchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    name: String,
    createdOn: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId },
    categoryStatus:Boolean,
})