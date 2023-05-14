import mongoose from "mongoose";
export const EntitySchema = new mongoose.Schema({
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
//# sourceMappingURL=entitynameModels.js.map