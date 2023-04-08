import { dbclose, dbconnect } from '../Configs/dbConnect.js';
import JsonWebTokenError from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { Roles } from '../dbcontext/dbContext.js';
export const getRoles = (req, res) => {
    res.status(200).json("This is the roles center");
};
export const createRole = async (req, res) => {
    const rolesBody = req.body;
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjgwOTYzMjQ5fQ.LKF3KPknCu-YKDeuCIgpT7LuclYusn9E0UN-SMqgT2c'; // req.cookies.access_token;
    if (!token)
        return res.status(401).json("Not Authenticated!");
    JsonWebTokenError.verify(token, "s3cr3t", async (err, userInfo) => {
        console.log(userInfo);
        if (err)
            return res.status(403).json("Authentication token Not Valid");
        console.log(err);
        try {
            if (rolesBody) {
                const roles = {
                    _id: randomUUID(),
                    roleName: rolesBody.roleName,
                    roleLevel: rolesBody.roleLevel,
                    roleStatus: rolesBody.roleStatus,
                    createdOn: new Date(),
                    createBy: '1',
                };
                console.log(roles);
                const rolesInstance = new Roles(roles);
                await dbconnect();
                await rolesInstance.save();
                res.status(200).json('Data saved successfully!');
                await dbclose();
            }
            else {
                res.status(404).json("Roles not found or empty");
            }
        }
        catch (error) {
            res.status(500).json("server responded with an error");
        }
    });
};
//# sourceMappingURL=rolesController.js.map