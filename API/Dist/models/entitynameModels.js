import mongoose from "mongoose";
// a list of activities based on the model that will get affected, it will help in notification and approvals
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
/// during insert we will be checking if the post falls within the approval entity then insert into
//eg 1, meeting, there will be a meeting on ...., '',
// and for the request picks we can add the entity and set approvals to the hr
//# sourceMappingURL=entitynameModels.js.map