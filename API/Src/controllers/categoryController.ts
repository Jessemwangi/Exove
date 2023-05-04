import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Category } from "../dbcontext/dbContext.js";
import { ILdapAuth, IQCategory } from "../dbcontext/Interfaces.js";
import { checkUserRoles } from "../utilities/functions.js";

export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await dbconnect();
    const category: IQCategory = await Category.find({}).select("-__v").lean();
    await dbclose();
    return res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: ILdapAuth = req.body.user;
  const userId: string = user.uid;
  const rolelevel = await checkUserRoles(userId, 2);
  if (!rolelevel) {
    res.status(200).json("Not authorized to peform this transaction");
    return;
  }
  try {
    const httpData = req.body;
    const data: IQCategory = {
      _id: uuidv4(),
      categoryName: httpData.name,
      description: httpData.description,
      questions: httpData.questions,
      createdBy: userId,
      categoryStatus: true,
      createdOn: new Date(),
    };

    await dbconnect();
    const q = await new Category(data).save();
    if (q) {
      return res.status(200).json("saved");
    } else {
      return res.status(501).json("failed to save");
    }
    await dbclose();
  } catch (error) {
    next(error);
  }
};
