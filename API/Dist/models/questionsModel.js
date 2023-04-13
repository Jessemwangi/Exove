import mongoose from "mongoose";
export const questionsSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    question_en: { type: Number, required: true },
    question_fi: { type: Number, required: true },
    questionType: String,
    questionStatus: Boolean,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    createdOn: Date
});
//# sourceMappingURL=questionsModel.js.map