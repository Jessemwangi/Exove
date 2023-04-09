import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { randomUUID } from "crypto";
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
    const rolesBody = req.body;
    try {
        if (rolesBody) {
            const rolesPost = {
                _id: randomUUID(),
                roleName: rolesBody.roleName,
                roleLevel: rolesBody.roleLevel,
                roleStatus: rolesBody.roleStatus,
                createdOn: new Date(),
                createBy: "1",
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
            res.status(200).json("Data saved successfully!");
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
};
//# sourceMappingURL=rolesController.js.map