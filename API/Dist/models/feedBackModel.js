import mongoose from "mongoose";
export const feedbackSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    template: { type: String, ref: 'Template', required: true },
    userId: { type: String, required: true },
    requestpicksId: { type: String, required: true, ref: "RequestPicks" },
    feedbackTo: {
        type: mongoose.Schema.Types.String,
        ref: "Users",
        required: true,
    },
    progress: String,
    responseByDate: Date,
    responseDateLog: [Date],
    categories: [{
            category: { type: String, ref: 'Category', required: true },
            questions: [{
                    _id: { type: String, ref: 'Question', required: true },
                    lang: String,
                    question: String,
                    answer: { type: String, required: true },
                    answeredOn: { type: Date, default: Date.now },
                }],
        }],
    createdOn: Date,
    submitted: Boolean,
    submittedOn: Date,
});
//# sourceMappingURL=feedBackModel.js.map