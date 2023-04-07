import mongoose from "mongoose";
// a list of activities based on the model that will get affected, it will help in notification and approvals
export const entitySchema = new mongoose.Schema({
    _id: String,
    name: String,
    description: String,
    approverRole: { type: mongoose.Schema.Types.ObjectId, ref: 'Roles' },
});
//# sourceMappingURL=entitynameModels.js.map