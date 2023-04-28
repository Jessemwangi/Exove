import { Request, Response, NextFunction } from "express"

export const defaultGet = (req:Request, res:Response, next:NextFunction) => {
   return res.cookie('jesse', 'valtesting value for cookie', {
      sameSite: "none",
      httpOnly: true,
      secure:true
   }).send('Thank for testing our app, hurray it works!!!')
} 