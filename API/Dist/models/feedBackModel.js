import mongoose from "mongoose";
export const feedBacksSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    templateId: { type: String, required: true, ref: 'Templates' },
    requestpicksId: { type: String, required: true, ref: "Templates" },
    feedbackTo: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    createdOn: {
        type: Date,
        default: Date.now,
        required: true,
    },
    responseByDate: Date,
    progress: String,
    responseDateLog: [Date],
    questionSections: [
        {
            category: {
                categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuestionCats' },
                questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Questions' }], // hold an array of questions
            },
        }
    ],
    submitted: Boolean,
    submittedOn: Date,
});
//# sourceMappingURL=feedBackModel.js.map