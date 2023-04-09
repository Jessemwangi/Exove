import mongoose from "mongoose";
export const feedBacksSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    templateId: { type: String, required: true, ref: "Templates" },
    requestpicksId: { type: String, required: true, ref: "Templates" },
    feedbackTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
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
            categoryId: { type: String, required: true },
            categoryName: { type: String, required: true },
            questions: [{
                    questionId: { type: String, required: true },
                    question: { type: String, required: true },
                    questionsAnswer: { type: String, required: true }, // hold an array of questions
                }],
        },
    ],
    submitted: Boolean,
    submittedOn: Date,
});
//# sourceMappingURL=feedBackModel.js.map