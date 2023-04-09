import mongoose from "mongoose"

export const feedBacksSchema = new mongoose.Schema({
    _id: { type: Number, required: true, },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, // session logged in user
    templateId: { type: String, required: true, ref: 'Templates' },
    requestpicksId: { type: String, required: true, ref: "Templates" },
    feedbackTo:  { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, // feedback to from the dashboard
    createdOn: String,
    responseByDate: String,
    progress: String,
 
  responseDateLog: [Date], // any time and update is made the date will be logged here
  questionSections:[
    {
        category:
        {
            categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionCats' },
            questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Questions' }], // hold an array of questions
               
        },
    }],
    submitted: Boolean,
    submittedOn:Date,
});
