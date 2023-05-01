import { Request, Response } from "express";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { ILdapAuth, IRoles } from "../dbcontext/Interfaces.js";
import { v4 as uuidv4 } from 'uuid'
import { Roles } from "../dbcontext/dbContext.js";
import {  checkUserRoles } from "../utilities/functions.js";

export const getRoles = async (req: Request, res: Response) => {
  try {
    await dbconnect();
    const roleData: IRoles[] = await Roles.find({}).lean().sort({createdOn:1}).exec();
   
    await dbclose();
    res.status(200).json(roleData);
  } catch (error) {
    res.status(500).json("server responded with an error");
  }
};


export const createRole = async (req:Request, res:Response) => {

    try {
      const rolesHttpBody: IRoles = req.body;
      const user: ILdapAuth = req.body.user
      const userId: string = user.uid;
          const rolelevel = await checkUserRoles(userId,2);
          if (!rolelevel) {
            res.status(200).json("Not authorized to peform this transaction");
            return;
          }
          if (!rolesHttpBody) return res.status(404).json("Roles not found or empty")
const primaryKey =uuidv4()
              const rolesPost: IRoles = {
                  _id: primaryKey,
                  roleName: rolesHttpBody.roleName,
                  roleLevel: rolesHttpBody.roleLevel,
                  roleStatus: rolesHttpBody.roleStatus,
                  createdOn: new Date(),
                  createBy: userId,
              }
            
            const rolesInstance = new Roles(rolesPost);
            const validationError = rolesInstance.validateSync();

            if (validationError) {
              res.status(400).json(validationError.message );
              return;
            }
              await dbconnect()
      await rolesInstance.save()
              res.status(200).json('Data saved successfully!');
      await dbclose();
      return;      
    } catch (error) {
          res.status(500).json("server responded with an error")
          console.log(error)
      }
 
}