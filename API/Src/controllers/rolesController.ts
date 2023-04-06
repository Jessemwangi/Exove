import { Request, Response } from 'express';

export const getRoles = (req:Request, res:Response) => {
res.status(200).json("This is the roles center")
}