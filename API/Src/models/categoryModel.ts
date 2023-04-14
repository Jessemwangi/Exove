import mongoose from "mongoose";

export const CategorySchema = new mongoose.Schema({
  _id: { type: String, required: true }, // your custom ID field
  categoryName: { type: String, required: true },
  description: { type: String },
  questions: { type: [mongoose.Schema.Types.String], ref: "Question" },
  createdOn: Date,
  createdBy: { type: mongoose.Schema.Types.String, required: true },
  categoryStatus: Boolean,
});