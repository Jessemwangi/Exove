import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { Category, Question, Template } from "../dbcontext/dbContext.js";
import { Request, Response } from 'express';
import { v4 as uuidv4 } from "uuid";

// get active template

  













// POST /answer
// Submit feedback
export const answer = async (req:Request, res:Response) => {
  try {
    const { answers } = req.body;

    // Save the answers to the database
    // ...

    res.status(200).send('Feedback submitted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


