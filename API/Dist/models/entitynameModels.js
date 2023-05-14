import mongoose from "mongoose";
export const EntitySchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    approverRoleLevel: Number,
    transacteOn: {
        type: Date,
        default: Date.now,
        required: true,
    },
    createdBy: String,
});
//# sourceMappingURL=entitynameModels.js.map