import mongoose from "mongoose";

// gets feedback from users
export const questionsSchema = new mongoose.Schema({
  _id: { type: Number, required: true, unique: true },
  question: String,
  questionType: String,
  questionStatus: Boolean,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  createdOn:Date
});