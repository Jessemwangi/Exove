import mongoose from "mongoose";
export const userRolesSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    roleId: { type: mongoose.Schema.Types.ObjectId, required: true },
});
//# sourceMappingURL=userRoles.js.map