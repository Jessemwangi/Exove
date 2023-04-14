import mongoose from "mongoose";
export const questionsSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    category: { type: String, ref: 'Category', required: true },
    createdBy: {
        type: String,
        ref: "Users",
        required: true,
        CreatedOn: Date,
        questionStatus: Boolean,
    },
    question: [
        {
            lang: { type: String, required: true },
            text: String,
            active: Boolean,
        },
    ]
});
//# sourceMappingURL=questionsModel.js.map