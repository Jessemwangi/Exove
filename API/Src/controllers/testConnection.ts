import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { Request, Response } from 'express';

export const testDb = async (req: Request, res: Response) => {
    try {
       const testresult = await dbconnect();
      
        // perform actions on the collection object
        res.status(200).json(testresult)
    } catch (error) {
        console.log(error)
        res.status(200).json(error)
    }
   
    await dbclose();
}

export const testDb2 = async (req: Request, res: Response) => { 
    res.status(200).json("test2");
}
