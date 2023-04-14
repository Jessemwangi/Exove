import mongoose from "mongoose";
export const templateSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    templateTitle: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
    categories: [{
            category: { type: String, ref: 'Category' },
            questions: [{ type: String, ref: 'Question' }],
        }],
    active: Boolean,
});
//# sourceMappingURL=templatesModel.js.map