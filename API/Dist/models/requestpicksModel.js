import mongoose, { Schema } from "mongoose";
export const ModelSelectedList = new Schema({
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
export const requestpicksSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    requestedTo: { type: String, required: true },
    requestedBy: { type: String, required: true },
    requestedOn: { type: Date, default: new Date(), required: true },
    SelectedList: { type: [ModelSelectedList] },
    submitted: Boolean,
    submittedOn: Date,
});
export const SelectedListModel = mongoose.model("SelectedList", ModelSelectedList);
//# sourceMappingURL=requestpicksModel.js.map