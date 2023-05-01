import { Request, Response } from 'express';
import { v4 as uuidv4 } from "uuid";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { Category, Question } from '../dbcontext/dbContext.js';
import { ILdapAuth, IQuestion } from '../dbcontext/Interfaces.js';
import { checkUserRoles } from '../utilities/functions.js';

export const getQuestion =async (req:Request, res:Response) => {
  try {
     
      await dbconnect()
      const qusetions:IQuestion = await Question.find({}).select('-__v').lean();
      await dbclose()
      res.status(200).json(qusetions)
  } catch (error) {
      res.status(500).json('error')
      console.log(error)
  }
 
}

export const getQuestionId = async (req: Request, res: Response) => {
  const {id} = req.params
  try {
     
      await dbconnect()
      const qusetions:IQuestion = await Question.findOne({"_id":id}).select('-__v').lean();
      await dbclose()
      res.status(200).json(qusetions)
  } catch (error) {
      res.status(500).json('error')
      console.log(error)
  }
 
}

export const addQuestion = async (req: Request, res: Response) => {
  const user: ILdapAuth = req.body.user
  const userId: string = user.uid;
      const rolelevel = await checkUserRoles(userId,2);
      if (!rolelevel) {
        res.status(200).json("Not authorized to peform this transaction");
        return;
      }
  try {
    
      const httpData = req.body
    const primaryKey = uuidv4()
    
      const data:IQuestion = {
        _id: primaryKey,
        category: httpData.category,
        question:httpData.question,
        createdBy: userId,
        type: httpData.type,
        active: true,
        createdOn:new Date,
      }
    
      await dbconnect()
      const q = await new Question(data).save()
      if (q) {
          const updateResult = await Category.updateOne(
              { "_id": httpData.category },
              { $push: {'questions': primaryKey } },
            ).exec();
          
      }
    
      await dbclose()
      res.status(200).json('saved')
  } catch (error) {
      res.status(500).json('error')
      console.log(error)
  }
 
}

