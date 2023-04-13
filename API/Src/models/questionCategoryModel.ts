import mongoose from "mongoose";
import { QuestionCats } from "../dbcontext/dbContext.js";

//interface IQuestionCats

export const questionCategorySchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  name: { type: Number, required: true },
  questions: [
    {
      questionId: { type: Number, required: true },
      language: [
        {
        name: { type: String, required: true },
        question:String,
        }
      ],
      questionType: String,
      questionStatus: Boolean,
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
      qCreatedOn: Date,
    },
  ],
  createdOn: Date,
  createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
  categoryStatus: Boolean,
});


QuestionCats.path('language').validate(function (value:any) { // force the user to enter atleast one question language
  return value && value.length >= 1;
}, 'At least one language entry is required.');