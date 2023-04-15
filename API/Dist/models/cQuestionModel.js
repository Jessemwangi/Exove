import mongoose from "mongoose";
export const templateSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    createdBy: String,
    categories: [{
            category: { type: String, ref: 'Category_c' },
            questions: [{ type: String, ref: 'Question_c' }],
        }],
    active: Boolean,
});
export const Template_c = mongoose.model('Template_c', templateSchema);
export const feedbackSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    template: { type: String, ref: 'Template', required: true },
    user: String,
    categories: [{
            category: { type: String, ref: 'Category' },
            questions: [{
                    _id: { type: String, ref: 'Question', required: true },
                    lang: String,
                    answer: { type: String, required: true },
                    CreatedOn: { type: Date, default: Date.now },
                }],
        }],
    responses: [{
            question: { type: String, ref: 'Question_c', required: true },
            answer: { type: String, required: true },
        }],
    submittedOn: { type: Date, default: Date.now },
});
export const Feedback_c = mongoose.model('Feedback_c', feedbackSchema);
//# sourceMappingURL=cQuestionModel.js.map