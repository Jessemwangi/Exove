import mongoose from "mongoose";

// Store all question allows CRUD
export const questionsSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  question:  { type: Number, required: true },
  questionType: String,
  questionStatus: Boolean,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  createdOn:Date
});