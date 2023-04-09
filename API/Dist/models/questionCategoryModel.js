import mongoose from "mongoose";
export const questionCategorySchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    name: { type: Number, required: true },
    transacteOn: {
        type: Date,
        default: Date.now,
        required: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    categoryStatus: Boolean,
});
//# sourceMappingURL=questionCategoryModel.js.map