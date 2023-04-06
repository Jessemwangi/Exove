import { Request, Response } from 'express';

export const getEmployees = (req:Request, res:Response) => {
    res.status(200).json({message:"Hi, i see you snooping around"})
    }