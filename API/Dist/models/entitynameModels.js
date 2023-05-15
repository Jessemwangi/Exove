import mongoose from "mongoose";
export const EntitySchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    approverRoleLevel: {
        type: Number,
        required: true,
        min: [1, "Role level must be at least 1"],
        max: [7, "Role level cannot be greater than 7"]
    },
    transacteOn: {
        type: Date,
        default: Date.now,
        required: true,
    },
    createdBy: String,
});
//# sourceMappingURL=entitynameModels.js.map