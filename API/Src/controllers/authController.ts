import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ILdapAuth } from '../dbcontext/Interfaces.js';

export const getAuthRoutes = (req: Request, res: Response) => {
    const token = req.cookies.access_token;
    console.log(token)
    res.status(200).json({message:"this is authentication response"})
}


// export const authenticate = async (req: Request, res: Response) => {
//     const { username, password } = req.body
  
//     try {
//         const user: any = await authenticateUser(username, password)
//         const cn: string = user.cn
//         const mail:string =user.mail
    
//       res.status(200).json({cn, mail})
    
//     } catch (error) {
//       res.status(401).send({ message: 'Authentication failed' })
//     }
// }