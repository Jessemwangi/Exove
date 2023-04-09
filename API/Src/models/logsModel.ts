import mongoose from "mongoose"

export const logsSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
    activity: String,
    transacteOn:{
      type: Date,
      default: Date.now,
      required: true,
  },
})
  