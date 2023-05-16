import { Request, Response, NextFunction } from "express"
import { cookieExpiresIn } from "../Configs/serverConfig.js"
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { Users } from "../dbcontext/dbContext.js";

export const defaultGet = (req:Request, res:Response, next:NextFunction) => {
   return res.cookie('jesse', 'valtesting value for cookie', {
      expires: cookieExpiresIn,
      sameSite: "none",
      httpOnly: true,
      secure: true
      
   }).send('Thank for testing our app, hurray it works!!!')
} 