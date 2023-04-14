import mongoose from "mongoose";

//interface IQuestionCats

// export const questionCategorySchema = new mongoose.Schema({
//   _id: { type: Number, required: true },
//   name: { type: Number, required: true },
//   questions: [
//     {
//       questionId: { type: Number, required: true },
//       question: [
//         {
//         lang: { type: String, required: true }, //can be eng,fin,swd language
//         question:String, // question string eg how old are you
//         }
//       ],
//       questionType: String,
//       questionStatus: Boolean,
//       createdBy: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Users",
//         required: true,
//       },
//       qCreatedOn: Date,
//     },
//   ],
//   createdOn: Date,
//   createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
//   categoryStatus: Boolean,
// });


// // QuestionCats.path('language').validate(function (value:any) { // force the user to enter atleast one question language
// //   return value && value.length >= 1;
// // }, 'At least one language entry is required.');

export const CategorySchema = new mongoose.Schema({
  _id: { type: String, required: true }, // your custom ID field
  name: { type: String, required: true },
  description: { type: String },
  questions: { type: [mongoose.Schema.Types.String], ref: "Question" },
  createdOn: Date,
  createdBy: { type: mongoose.Schema.Types.String, required: true },
  categoryStatus: Boolean,
});