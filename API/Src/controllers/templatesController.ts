import { Request, Response } from 'express';
import { QuestionCats, Questions, Templates } from '../dbcontext/dbContext.js';
import { dbclose, dbconnect } from '../Configs/dbConnect.js';
import { ITemplates } from '../dbcontext/Interfaces.js';

export const getTemplates = async (req:Request, res:Response) => {
    try {
        await dbconnect()
        const templates: ITemplates = await Templates.find({})
        await dbclose()
        res.status(200).json(templates)
    } catch (error) {
        console.log(error)
        res.status(500).json("server responded with an error");
    }
    

}