import mongoose from "mongoose";
export const entitySchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    approverRole: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Roles', required: true }],
    transacteOn: {
        type: Date,
        default: Date.now,
        required: true,
    },
});
//# sourceMappingURL=entitynameModels.js.map