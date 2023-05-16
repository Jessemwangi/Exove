'use strict'
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
    res.status(200).json("Apologies, but you are not authorized to perform this transaction. Please contact support for assistance.");
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
      return res.status(200).json("Success! Your data has been saved successfully.");
    } else {
      return res.status(501).json("Oops! We encountered an issue while trying to save your data. Please try again later or contact support for further assistance.");
    }
    await dbclose();
  } catch (error) {
    next(error);
  }
};
