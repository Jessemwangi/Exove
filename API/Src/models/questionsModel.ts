import mongoose from "mongoose";

export const questionsSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // your custom ID field
  category: { type: String, ref: 'Category', required: true },
  createdBy: {
    type: String,
    ref: "Users",
    required: true,
    CreatedOn: Date,
    questionStatus: Boolean,
  },
  question: [
    {
    lang: { type: String, required: true }, //can be eng,fin,swd language
    text:String, // question string eg how old are you
      active: Boolean,
    },
  ]
});


