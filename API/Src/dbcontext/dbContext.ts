import mongoose from "mongoose";
import { usersSchema } from "../models/usersModel.js";

export const Users = mongoose.model('Users', usersSchema);