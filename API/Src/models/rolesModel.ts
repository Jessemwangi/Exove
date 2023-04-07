import mongoose from "mongoose";

export const rolesModel = new mongoose.Schema({
    _id: { type: String, unique: true, required: true },
    roleName: String,
    roleLevel: Number,
    roleStatus: Boolean,
    createBy: { type: mongoose.Schema.Types.ObjectId },
    createdOn:Date,
})