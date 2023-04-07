import mongoose from "mongoose";

export const questionCategorySchema = new mongoose.Schema({
    _id: { type: Number, required: true, unique: true },
    name: String,
    createdOn: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    categoryStatus:Boolean,
})