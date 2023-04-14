import mongoose from "mongoose";
export const requestpicksSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    requestedTo: String,
    requestedBy: String,
    requestedOn: Date,
    SelectedList: [
        {
            userId: String,
            selectionStatus: Boolean,
            selectedBy: String,
            feedBackSubmitted: Boolean,
        },
    ],
    submitted: Boolean,
    submittedOn: Date,
});
//# sourceMappingURL=requestpicksModel.js.map