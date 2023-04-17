import mongoose from "mongoose";
export const questionsSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    category: { type: String, ref: 'Category', required: true },
    createdBy: {
        type: String,
        ref: "Users",
        required: true,
    },
    createdOn: Date,
    active: Boolean,
    type: { type: String, required: true, default: "String" },
    question: [
        {
            lang: { type: String, required: true },
            question: { type: String, required: true },
        },
    ]
});
//# sourceMappingURL=questionsModel.js.map