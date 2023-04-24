import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { Request, Response } from 'express';
import { v4 as uuidv4 } from "uuid";
import { Category } from "../dbcontext/dbContext.js";
import { IQCategory } from "../dbcontext/Interfaces.js";


export const getCategory = async (req: Request, res: Response) => {
    try {
       
        await dbconnect()
        const category:IQCategory = await Category.find({}).select('-__v').lean();
        await dbclose()
        res.status(200).json(category)
    } catch (error) {
        res.status(500).json('error')
        console.log(error)
    }
   
}

export const addCategory =async (req:Request, res:Response) => {
    try {
 const httpData = req.body
        const data:IQCategory = {
            _id: uuidv4(),
            categoryName: httpData.name,
            description: httpData.description,
            questions: httpData.questions,
            createdBy: httpData.createdBy,
            categoryStatus: true,
            createdOn:new Date
        }

        await dbconnect()
        const q = await new Category(data).save()
        if (q) {
            res.status(200).json('saved')
        }
        else {
            res.status(501).json('failed to save')
        }
        await dbclose()
       
    } catch (error) {
        res.status(500).json('error')
        console.log(error)
    }
   
}