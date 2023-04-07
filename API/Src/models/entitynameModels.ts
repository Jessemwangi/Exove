import mongoose from "mongoose";
// a list of activities based on the model that will get affected, it will help in notification and approvals
export const entitySchema = new mongoose.Schema({
    _id:String,
        name:String, // the name here represent the model name, eg for Uses, Roles etc
    description: String, // describes  the entity, eg selected five person to get feed, approve selected feedback, report generated, etc
    approverRole:{type:mongoose.Schema.Types.ObjectId, ref:'Roles'}, // set the level that can approve if approval is required
})

/// during insert we will be checking if the post falls within the approval entity then insert into 