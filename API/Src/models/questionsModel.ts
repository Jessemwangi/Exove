import mongoose from "mongoose";

export const questionsSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // your custom ID field
  category: { type: String, ref: 'Category', required: true },
  createdBy: {
    type: String,
    ref: "Users",
    required: true,
  },
  createdOn: Date,
  active: Boolean,
  type: { type: String, required: true, default:"String"},
  question: [
    {
    lang: { type: String, required: true }, //can be eng,fin,swd language
    question:{ type: String, required: true }, // question string eg how old are you
  },
]
});


