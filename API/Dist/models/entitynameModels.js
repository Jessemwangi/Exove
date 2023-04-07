import mongoose from "mongoose";
// a list of activities based on the model that will get affected, it will help in notification and approvals
export const entitySchema = new mongoose.Schema({
    _id: String,
    name: String,
    description: String,
    approverRole: { type: mongoose.Schema.Types.ObjectId, ref: 'Roles' }, // set the level that can approve if approval is required
});
/// during insert we will be checking if the post falls within the approval entity then insert into 
//# sourceMappingURL=entitynameModels.js.map