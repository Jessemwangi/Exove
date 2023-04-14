import { Request, Response } from 'express';
import { Template } from '../dbcontext/dbContext.js';
import { dbclose, dbconnect } from '../Configs/dbConnect.js';
import { ITemplates } from '../dbcontext/Interfaces.js';
import { v4 as uuidv4 } from "uuid";

export const getTemplates = async (req:Request, res:Response) => {
    try {
        await dbconnect()
        const templates: ITemplates = await Template.find({})
        await dbclose()
        res.status(200).json(templates)
    } catch (error) {
        console.log(error)
        res.status(500).json("server responded with an error");
    }}

export const getTemplate = async (req:Request, res:Response) => {
    try {
      // Find the active template
      await dbconnect();
      const template:ITemplates = await Template.find({ active: true })
      .populate({
        path: 'categories.category',
        select: '-__v',
      })
      .populate({
        path: 'categories.questions',
        select: '-__v',
      })
      .exec();
      await dbclose();
      // Send the template data in the response
      res.status(200).json(template);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
}


export const addTemplate = async (req: Request, res: Response) => {
    const httpData = req.body
    const primaryKey = uuidv4()
    if (!httpData) {
        res.status(404).json("Post data not found or empty");
        return;
    }

    const newTemplate:ITemplates = {
        _id: primaryKey,
        templateTitle:httpData.templateTitle,
        createdOn: new Date,
        categories:httpData.categories,
        createdBy: "Hr Jesse",
        active:true,
    }
  
    try {
        // Find the active template
        await dbconnect()
        const template = await new Template(newTemplate).save();
        await dbclose()
        if (template) {
            res.status(200).json('saved');
        }
        else {
            res.status(501).send('saving failed');
        }
        // Send the template data in the response
      
      } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
      }
}