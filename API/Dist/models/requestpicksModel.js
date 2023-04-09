import mongoose from "mongoose";
export const requestpicksSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    requestedTo: { type: mongoose.Schema.Types.ObjectId },
    requestedBy: { type: mongoose.Schema.Types.ObjectId },
    requestedOn: Date,
    SelectedList: [
        {
            userId: mongoose.Schema.Types.ObjectId,
            selectionStatus: Boolean,
            selectedBy: { userId: mongoose.Schema.Types.ObjectId },
        },
    ],
    submitted: Boolean,
    submittedOn: Date,
});
//# sourceMappingURL=requestpicksModel.js.map