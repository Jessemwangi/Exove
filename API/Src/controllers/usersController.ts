import mongoose from "mongoose";
import { Request, Response } from "express";
import { Roles, Users } from "../dbcontext/dbContext.js";
import { IUser, IWorksReport, userSearch } from "../dbcontext/Interfaces.js";
import { v4 as uuidv4 } from "uuid";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { addUserToRole, getUserF } from "../utilities/functions.js";

export const getUser = async (req: Request, res: Response) => {
  if(!req.params) return res.status(404).json("user infomation not found")
  try {
    const user =await getUserF( {ldapUid:req.params.name} as userSearch )
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json(error)
  }
 }


export const getUsers = async (req: Request, res: Response) => {
  try {
    await dbconnect()
 const users:IUser =await Users.find({})
    .populate({
      path: "rolesId",
      model: Roles,
    }).lean()
   .exec()
  await dbclose()
res.status(200).json(users)
      console.log(users);
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  } 
};

export const postUser = async (req: Request, res: Response) => {
  try {
    const userhttpData: IUser = req.body
    const workReport: IWorksReport[] = userhttpData.workId
    const primaryKey = uuidv4()

    const newUser: IUser = {
      _id: primaryKey,
      ldapUid:userhttpData.ldapUid,
      firstName: userhttpData.firstName,
      surname: userhttpData.surname,
      email: userhttpData.email,
      displayName: userhttpData.displayName,
      workId: workReport,
      title: userhttpData.title,
      phone: userhttpData.phone,
      userStatus: true,
      rolesId: userhttpData.rolesId
    }

    await dbconnect()
    const q = await new Users(newUser).save()
    if (q) {
      await addUserToRole(primaryKey,newUser.rolesId)
      res.status(200).json('User saved')
      await dbclose()
      return
    }
    else {
      res.status(501).json('failed to save')
      await dbclose()
      return
    }
   
  }
  catch(error) {
    res.status(500).json(error)
    console.log(error)
  }
}