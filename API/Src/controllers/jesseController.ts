import { Request, Response } from 'express';
import { JesseM } from '../dbcontext/dbContext.js';
import { v4 as uuidv4 } from 'uuid'
import { dbclose, dbconnect } from '../Configs/dbConnect.js';
interface Ijesse{
    _id:String,
    name: String,
    createOn: Date,
    age:Number,
}

export const jesseGet = async (req: Request, res: Response) => {
    try {
        await dbconnect()
        
        const jesseData:Ijesse = await JesseM.find().sort({ createOn:1, name: 1 }).limit(10).exec();
    
        await dbclose()

        res.status(200).json({ data: jesseData })
    } catch (error:any) {
        res.status(500).json({ error: error.message })
    }
}

export const jesseInsert = async (req: Request, res: Response) => {
    const jessedata = req.body
    console.log(jessedata)
    const jzee: Ijesse = {
        _id:uuidv4(),
        name: jessedata.name,
        createOn: new Date(),
        age:30,
    }
    console.log(jzee)
    const jesseInstance = new JesseM(jzee);

    try {
        await dbconnect();
    await jesseInstance.save();
        res.status(200).json('Data saved successfully!');
        await dbclose();
  } catch (error) {
    console.error(error);
    res.status(500).json('Error saving data!');
  }
}