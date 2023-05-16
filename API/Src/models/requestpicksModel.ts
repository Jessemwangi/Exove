import mongoose, { Schema } from "mongoose";
import { IRequestPicks, ISelectedList } from "../dbcontext/Interfaces.js";

export const ModelSelectedList = new Schema<ISelectedList>({
  userId: {
    type: String,
    required: true,
  },
  roleLevel: {
    type: Number,
    required: true,
    min: [1, "Role level must be at least 1"],
    max: [7, "Role level cannot be greater than 7"],
  },
  selectionStatus: {
    type: Boolean,
    required: true,
  },
  selectedBy: String,
  feedBackSubmitted: Boolean,
});

export const requestpicksSchema = new mongoose.Schema<IRequestPicks>({
  _id: { type: String, required: true },
  template: { type: String, required: true },
  requestedTo: { type: String, required: true }, // the person who will recieve and select five individual to give  him /her feedback.
  requestedBy: { type: String, required: true }, // user in the role of Hr or higher level
  requestedOn: { type: Date, default: new Date(), required: true },
  SelectedList: { type: [ModelSelectedList] }, // an array of user select to give feedback, Hr can increase this number endless,
  submitted: Boolean,
  submittedOn: Date,
});

export const SelectedListModel = mongoose.model<ISelectedList>(
  "SelectedList",
  ModelSelectedList
);
