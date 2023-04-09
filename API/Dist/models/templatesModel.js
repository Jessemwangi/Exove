import mongoose from "mongoose";
export const questionTemplatesSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    templateTitle: String,
    questionSections: [
        {
            categoryId: { type: String, required: true },
            categoryName: { type: String, required: true },
            questions: [{
                    questionId: { type: String, required: true },
                    question: { type: String, required: true },
                }],
        },
    ],
    templateStatus: Boolean,
    transacteOn: {
        type: Date,
        default: Date.now,
        required: true,
    },
});
//# sourceMappingURL=templatesModel.js.map