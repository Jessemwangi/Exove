import mongoose from "mongoose";
export const requestpicksSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    requestedTo: { type: String, required: true },
    requestedBy: { type: String, required: true },
    requestedOn: { type: Boolean, default: new Date, required: true },
    SelectedList: [
        {
            userId: String,
            selectionStatus: Boolean,
            selectedBy: { type: String, required: true },
            feedBackSubmitted: { type: Boolean, default: false, required: true },
        },
    ],
    submitted: Boolean,
    submittedOn: Date,
});
//# sourceMappingURL=requestpicksModel.js.map