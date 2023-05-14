import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { IEntityName } from "../dbcontext/Interfaces.js";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { Entity } from "../dbcontext/dbContext.js";

export const postEntity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const httpData: IEntityName = req.body;

  if (!httpData) next(new Error("No Post data supplied"));

  try {
    const newEntity: IEntityName = {
      _id: uuidv4(),
      name: httpData.name,
      approverRoleLevel: 2,
      description: httpData.description,
    };

    await dbconnect();

    await new Entity.save(newEntity);
    await dbclose();

    res.status(200).json("entity added successful");
    return;
  } catch (error: any) {
    next(error.message);
  }
};
