import mongoose from "mongoose";
export const categorySchema = new mongoose.Schema({
    _id: { type: Number, required: true, unique: true },
    name: String,
    createdOn: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Users" }
});
//# sourceMappingURL=categoryModel.js.map