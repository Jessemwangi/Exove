import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import JsonWebTokenError from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { Roles } from "../dbcontext/dbContext.js";
export const getRoles = async (req, res) => {
    try {
        await dbconnect();
        const roleData = await Roles.find({}).lean();
        await dbclose();
        res.status(200).json(roleData);
    }
    catch (error) {
        res.status(500).json("server responded with an error");
    }
};
export const createRole = async (req, res) => {
    const rolesHttpBody = req.body;
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjgwOTYzMjQ5fQ.LKF3KPknCu-YKDeuCIgpT7LuclYusn9E0UN-SMqgT2c';
    if (!token)
        return res.status(401).json("Not Authenticated!");
    JsonWebTokenError.verify(token, "s3cr3t", async (err, userInfo) => {
        if (err)
            return res.status(403).json("Authentication token Not Valid");
        try {
            if (rolesHttpBody) {
                const rolesPost = {
                    _id: uuidv4(),
                    roleName: rolesHttpBody.roleName,
                    roleLevel: rolesHttpBody.roleLevel,
                    roleStatus: rolesHttpBody.roleStatus,
                    createdOn: new Date(),
                    createBy: '1',
                };
                console.log(rolesPost);
                const rolesInstance = new Roles(rolesPost);
                const validationError = rolesInstance.validateSync();
                if (validationError) {
                    res.status(400).json({ message: validationError.message });
                    return;
                }
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
            console.log(error);
        }
    });
};
//# sourceMappingURL=rolesController.js.map