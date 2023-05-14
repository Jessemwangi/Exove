import mongoose from "mongoose";
// a list of activities based on the model that will get affected, it will help in notification and approvals
export const EntitySchema = new mongoose.Schema({
  _id: { type: String, required: true},
  name: { type: String, required: true}, // the name here represent the model name, eg for Uses, Roles etc
  description: { type: String, required: true}, // describes  the entity, eg selected five person to get feed, approve selected feedback, report generated, etc
  approverRoleLevel: Number, // set the level that can approve if approval is required
  transacteOn: {
        type: Date,
        default: Date.now,
        required: true,
  },
  createdBy:String,
});

/// during insert we will be checking if the post falls within the approval entity then insert into

//eg 1, meeting, there will be a meeting on ...., '',

// and for the request picks we can add the entity and set approvals to the hr
