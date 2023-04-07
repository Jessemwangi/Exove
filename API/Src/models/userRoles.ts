import mongoose from "mongoose";

export const userRoles =new  mongoose.Schema({
    _id: { type: String, unique: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    roleId:{ type: mongoose.Schema.Types.ObjectId, required: true },
})