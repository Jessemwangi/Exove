import mongoose from "mongoose";

export const feedBacksSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  }, // session logged in user
  templateId: { type: String, required: true, ref: "Templates" },
  requestpicksId: { type: String, required: true, ref: "Templates" },
  feedbackTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  }, // feedback to from the dashboard
  createdOn: {
    type: Date,
    default: Date.now,
    required: true,
  },
  responseByDate: Date,
  progress: String,
  responseDateLog: [Date], // any time and update is made the date will be logged here
  questionSections: [
    {
      categoryId: { type: String, required: true },
      categoryName: { type: String, required: true },
      questions:[ {
        questionId: { type: String, required: true },
        question: { type: String, required: true },
        questionsAnswer: { type: String, required: true }, // hold an array of questions
      }],
    },
  ],
  submitted: Boolean,
  submittedOn: Date,
});
