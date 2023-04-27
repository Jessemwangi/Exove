import { Request, Response, NextFunction } from "express"

export const defaultGet = (req:Request, res:Response, next:NextFunction) => {
   return res.send('Thank for testing our app, hurray it works!!!')
} 