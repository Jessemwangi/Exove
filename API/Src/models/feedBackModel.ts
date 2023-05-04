import mongoose from "mongoose";

export const feedbackSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // your custom ID field
  template: { type: String, ref: 'Template', required: true },
  userId: { type: String,  required: true },  // session logged in user
  requestpicksId: { type: String, required: true, ref: "RequestPicks" }, // get user giving feedback in this pic, during complete on clicked by the hr update the user as submmitted
  roleLevel:{type:Number,required:true},
  feedbackTo: {
    type: mongoose.Schema.Types.String,
    ref: "Users",
    required: true,
  }, // feedback to from the dashboard 
  progress: String,
  responseByDate: Date,
  responseDateLog: [Date], 
  categories: [
    {
    category: { type: String, ref: 'Category' , required: true},
    questions: [
      {
      _id: { type: String, ref: 'Question', required: true },
      type: { type: String, ref: 'Question', required: true },
      question:String,
      answer: { type: String, required: true },
      answeredOn:{ type: Date, default: Date.now },
      }
    ],
  }
  ],
  createdOn:Date,
  submitted: Boolean,
  submittedOn: Date,
});

///  once feedback is submitted this will happen

 // 1. get info of the person giving feedback, and the person receiving feedback from RequestPicks and update feedBackSubmitted to true.
 // set progress to Complete