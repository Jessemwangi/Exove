import { Request, Response } from 'express';
import { dbclose, dbconnect } from '../Configs/dbConnect.js';
import JsonWebTokenError  from 'jsonwebtoken';
import { IRoles } from '../dbcontext/Interfaces.js';
import { randomUUID } from 'crypto';
import { Roles } from '../dbcontext/dbContext.js';

export const getRoles = (req:Request, res:Response) => {
res.status(200).json("This is the roles center")
}


export const createRole = async (req:Request, res:Response) => {
    const rolesBody:IRoles = req.body
    const token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjgwOTYzMjQ5fQ.LKF3KPknCu-YKDeuCIgpT7LuclYusn9E0UN-SMqgT2c' // req.cookies.access_token;
    if (!token) return res.status(401).json("Not Authenticated!");
    JsonWebTokenError.verify(token, "s3cr3t", async (err:JsonWebTokenError.VerifyErrors | null, userInfo:string | JsonWebTokenError.JwtPayload | undefined) => {
        console.log(userInfo)
        if (err) return res.status(403).json("Authentication token Not Valid");
        console.log(err)
        try {
            if (rolesBody) {
              
            
                const roles: IRoles = {
                    _id: randomUUID(),
                    roleName: rolesBody.roleName,
                    roleLevel: rolesBody.roleLevel,
                    roleStatus: rolesBody.roleStatus,
                    createdOn: new Date(),
                    createBy: '1',
                }
                console.log(roles)
                const rolesInstance = new Roles(roles);
                await dbconnect()
                await rolesInstance.save()
                res.status(200).json('Data saved successfully!');
        await dbclose();
            }
            else {
                res.status(404).json("Roles not found or empty")
            }
        
        } catch (error) {
        res.status(500).json("server responded with an error")
        }
    }
    )
}