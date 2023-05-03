import mongoose from "mongoose";
import { Request, Response } from "express";
import { Roles, Users } from "../dbcontext/dbContext.js";
import { IUser, IWorksReport, userSearch } from "../dbcontext/Interfaces.js";
import { v4 as uuidv4 } from "uuid";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { addUserReportTo, addUserToRole, getUserF } from "../utilities/functions.js";

export const getUser = async (req: Request, res: Response) => {
  if(!req.params) return res.status(404).json("user infomation not found")
  try {
    const user =await getUserF( {ldapUid:req.params.name} as userSearch )
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json(error)
  }
 }

 export const getUserId = async (req: Request, res: Response) => {
  if(!req.params) return res.status(404).json("user infomation not found")
  try {
    const user =await getUserF( {_id:req.params.id} as userSearch )
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json(error)
  }
 }

export const getUsers = async (req: Request, res: Response) => {
  try {
    await dbconnect()
 const users:IUser =await Users.find({}).select('-__v')
    .populate({
      path: "rolesId",
      model: Roles,
      select:'-__v',
    }).lean()
   .exec()
  await dbclose()
res.status(200).json(users)
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
      imageUrl:userhttpData.imageUrl,
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


export const putUser = async (req: Request, res: Response) => {
  try {
    const userhttpData: IUser = req.body
    const workReport: IWorksReport[] = userhttpData.workId
    const primaryKey = req.params.id

    const newUser:any  = {
      ldapUid:userhttpData.ldapUid,
      firstName: userhttpData.firstName,
      surname: userhttpData.surname,
      email: userhttpData.email,
      displayName: userhttpData.displayName,
      workId: workReport,
      imageUrl:userhttpData.imageUrl,
      title: userhttpData.title,
      phone: userhttpData.phone,
      userStatus: true,
      rolesId: userhttpData.rolesId
    }

    await dbconnect()
    // const q = await new Users(newUser).save()
    const q = await Users.findByIdAndUpdate(primaryKey, newUser, { new: true }).exec();

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

export const addWorkId = async (req: Request, res: Response) => {
  const primaryKey = req.params.id
  const httpData =req.body
  if (!httpData) return res.status(404).json('invalid data')

  try {
    
    const reportTo: IWorksReport = {
      reportsTo: httpData.reportsTo,
      workReportStatus: true,
      createdOn: new Date(), 
    }
await dbconnect()
    await addUserReportTo(primaryKey)
    const addWorkId = await Users.updateOne(
      { _id: primaryKey },
      {
        $push: {
          'workId':reportTo
        }
      })
    await dbclose()
    if (addWorkId.modifiedCount !== 0) {
     return res.status(200).json('User reporting status changed')
    }
    else {
     return res.status(200).json('No Changes where made')
    }

  } catch (error:any) {
    res.status(500).json(error.message)
    console.log(error)
    return
  }

  

}