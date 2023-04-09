import mongoose from "mongoose";
export const questionCategorySchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    name: { type: Number, required: true },
    questions: [
        {
            questionId: { type: Number, required: true },
            question: { type: Number, required: true },
            questionType: String,
            questionStatus: Boolean,
            createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users",
                required: true,
            },
            qCreatedOn: Date,
        },
    ],
    createdOn: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    categoryStatus: Boolean,
});
//# sourceMappingURL=questionCategoryModel.js.map