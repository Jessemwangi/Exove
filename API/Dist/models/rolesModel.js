import mongoose from "mongoose";
export const rolesSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    roleName: { type: String, required: true },
    roleLevel: { type: Number, required: true },
    roleStatus: Boolean,
    createBy: { type: String, required: true },
    users: { type: [mongoose.Schema.Types.String], ref: "Users" },
    createdOn: Date,
});
//# sourceMappingURL=rolesModel.js.map