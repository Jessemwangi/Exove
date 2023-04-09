import mongoose from "mongoose";
import { Request, Response } from 'express';
import { Roles, Users, WorksReports } from "../dbcontext/dbContext.js";
import { IUser } from "../dbcontext/Interfaces.js";
const getUser = async (req:Request,res:Response) => {

// retrieve all users and their roles
Users.find({})
  .populate({
    path: 'workId',
    model: WorksReports,
    populate: {
      path: 'userId',
      model: Users,
      populate: {
        path: 'roleId',
        model: Roles
      }
    }
  })
  .exec((err:any, users:IUser) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(users);
  });

}