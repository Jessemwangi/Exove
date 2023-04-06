import { Request, Response } from 'express';

export const getFeeds = (req:Request, res:Response) => {
    res.status(200).json("Hi, see you want feedback")
    }