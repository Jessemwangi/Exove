import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { IEntityName, ILdapAuth } from "../dbcontext/Interfaces.js";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { Entity } from "../dbcontext/dbContext.js";
import { checkUserRoles } from "../utilities/functions.js";

export const postEntity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const httpData: IEntityName = req.body;
  const user: ILdapAuth = req.body.user;
    const userId: string = user.uid;
    const id: string = req.params.id
    
  console.log(id)
    const newEntity: IEntityName = {
        _id: id ? id : uuidv4(),
        name: httpData.name,
        approverRoleLevel: 2,
        description: httpData.description,
        createdBy: userId,
      };
console.log(newEntity)
  try {
    const rolelevel = await checkUserRoles(userId, 4);
    if (!rolelevel) {
      res.status(200).json("Apologies, but you are not authorized to perform this transaction. Please contact support for assistance.");
      return;
    }
    const entityInstance = new Entity(newEntity);
    const validationError = entityInstance.validateSync();

    if (validationError) {
      res.status(400).json(validationError.message);
      return;
    }

    await dbconnect();
      if (id) {
          const putEntity = await Entity.findByIdAndUpdate({ _id: id }, entityInstance.toObject(), { new: true }).exec()
          console.log(putEntity)
          if(!putEntity) return next (res.status(500).json('not updated'))
      }
      else {
        await entityInstance.save();
      }

    await dbclose();

    res.status(200).json("Success! New entity has been saved successfully.");
    return;
  } catch (error: any) {
    next(error.message);
  }
};

export const getEntities = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
    await dbconnect()
        const entities: IEntityName = await Entity.find({}).select('-__v') .lean()
        await dbclose()
	res.status(200).json(entities)
    } catch (error: any) {
        console.log(error)
	next(error.message)
}
}

// export const putEntity =async (req:Request, res:Response, next:NextFunction) => {
//     const httpData: IEntityName = req.body;
//     const id:string = req.params.id
//     const user: ILdapAuth = req.body.user;
//     const userId: string = user.uid;

//     const newEntity: IEntityName = {
//         _id: id,
//         name: httpData.name,
//         approverRoleLevel: 2,
//         description: httpData.description,
//         createdBy: userId,
//     };
    
//     const entityInstance = new Entity(newEntity);
//     const validationError = entityInstance.validateSync();
// }
