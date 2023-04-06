import mongoose from "mongoose";
export const feedBacksSchema = new mongoose.Schema({
    _id: { type: Number, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    templateId: { type: String, required: true, ref: "Templates" },
    requestpicksId: { type: String, required: true, ref: "Templates" },
    feedbackTo: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    createdOn: String,
    responseByDate: String,
    progress: String,
    responseDateLog: [Date],
    questionSections: [
        {
            category: {
                categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
                questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Questions" }], // hold an array of questions
            },
        }
    ],
    submitted: Boolean,
    submittedOn: Date,
});
//# sourceMappingURL=feedBackModel.js.map