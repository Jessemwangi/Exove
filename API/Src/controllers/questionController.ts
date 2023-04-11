import { Request, Response } from 'express';

export const getQuestions = (req:Request, res:Response) => {
//   const { id } = req.params;
  res.send(`get question land here`);
};

const addQuestion =async (req:Request,res:Response) => {
  const questionHttpData = req.body

  if (!questionHttpData) {
    res.status(404).json("Post data not found or empty");
    return;
  }
  
}