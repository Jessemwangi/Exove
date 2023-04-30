import mongoose from "mongoose";

    const usersSchema = new mongoose.Schema({
        stationId: Number,
        members: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        }], // contain a list of users in that station
        deptId: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "Department",
        }], // allow a station location to have multiple departments
        stationTitle: String,
        location: String,
      });
      