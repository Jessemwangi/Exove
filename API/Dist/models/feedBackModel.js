import mongoose from "mongoose";
export const feedbackSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    template: { type: String, ref: 'Template', required: true },
    userId: { type: String, required: true },
    requestpicksId: { type: String, required: true, ref: "RequestPicks" },
    feedbackTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    progress: String,
    responseByDate: Date,
    responseDateLog: [Date],
    categories: [{
            category: { type: String, ref: 'Category' },
            questions: [{
                    _id: { type: String, ref: 'Question', required: true },
                    lang: String,
                    answer: { type: String, required: true },
                    CreatedOn: { type: Date, default: Date.now },
                }],
        }],
    submitted: Boolean,
    submittedOn: Date,
});
//# sourceMappingURL=feedBackModel.js.map