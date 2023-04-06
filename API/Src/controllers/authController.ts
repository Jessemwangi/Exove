import { Request, Response } from 'express';

export const getAuthRoutes = (req:Request, res:Response) => {
    res.status(200).json({message:"this is authentication response"})
}