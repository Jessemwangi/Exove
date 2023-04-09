import mongoose from "mongoose"

export const questionTemplatesSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    templateTitle: String,
    questionSections:[
    {
        category:
        {
            categoryId: { type: mongoose.Schema.Types.ObjectId},
            questions: [{ type: mongoose.Schema.Types.ObjectId }], // hold an array of questions
               
        },
    }],
    templateStatus: Boolean,
    transacteOn: {
        type: Date,
        default: Date.now,
        required: true,
    },
});
      

  