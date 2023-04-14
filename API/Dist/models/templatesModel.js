import mongoose from "mongoose";
export const templateSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    templateTitle: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    createdBy: String,
    categories: [{
            category: { type: String, ref: 'Category_c' },
            questions: [{ type: String, ref: 'Question_c' }],
        }],
    active: Boolean,
});
//# sourceMappingURL=templatesModel.js.map