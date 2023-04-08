import mongoose from "mongoose";
export const questionTemplatesSchema = new mongoose.Schema({
    _id: { type: String, required: true, unique: true },
    templateTitle: String,
    questionSections: [
        {
            category: {
                categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
                questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Questions" }], // hold an array of questions
            },
        }
    ],
    templateStatus: Boolean,
});
//# sourceMappingURL=templates.js.map