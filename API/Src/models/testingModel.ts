import mongoose from "mongoose";

export const jesseSchema = new mongoose.Schema({
    _id: String,
    name: String,
    createOn: Date,
    age:Number,
})