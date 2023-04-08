import mongoose from "mongoose";

export const usersSchema = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  surname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function(v: string) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid email!`,
    },
  },
  displayName: String,
//   personal:  { type: String, required: true },
//   about: [{ type: mongoose.Schema.Types.ObjectId, ref: "About" }],
  workId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorksReport",
    },
  ],
  title: String,
  department: String,
  site: String,
  startDate: Date,
  phone: String,
  userStatus: Boolean,
});

//  worker report to who, this schema has all the reporting channel and allow connecting and disconnecting
export const worksReportSchema = new mongoose.Schema({
  _id: { type: Number, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  reportsTo: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
  workReportStatus: Boolean,
  createdOn: Date,
  deactivatedOn: Date,
});
