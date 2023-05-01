import mongoose from "mongoose";
export const entitySchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    approverRoleLevel: Number,
    transacteOn: {
        type: Date,
        default: Date.now,
        required: true,
    },
});
//# sourceMappingURL=entityNameModels.js.map