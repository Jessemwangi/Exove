import mongoose from "mongoose";
export const CategorySchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    questions: { type: [mongoose.Schema.Types.String], ref: "Question" },
    createdOn: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    categoryStatus: Boolean,
});
//# sourceMappingURL=questionCategoryModel.js.map