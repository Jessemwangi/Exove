import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { v4 as uuidv4 } from 'uuid';
import { Roles } from "../dbcontext/dbContext.js";
import { checkUserRoles } from "../utilities/functions.js";
export const getRoles = async (req, res) => {
    try {
        await dbconnect();
        const roleData = await Roles.find({}).lean().sort({ createdOn: 1 }).exec();
        await dbclose();
        res.status(200).json(roleData);
    }
    catch (error) {
        res.status(500).json("server responded with an error");
    }
};
export const createRole = async (req, res) => {
    try {
        const rolesHttpBody = req.body;
        const user = req.body.user;
        const userId = user.uid;
        const rolelevel = await checkUserRoles(userId, 2);
        if (!rolelevel) {
            res.status(200).json("Not authorized to peform this transaction");
            return;
        }
        if (!rolesHttpBody)
            return res.status(404).json("Roles not found or empty");
        const rolesPost = {
            _id: uuidv4(),
            roleName: rolesHttpBody.roleName,
            roleLevel: rolesHttpBody.roleLevel,
            roleStatus: rolesHttpBody.roleStatus,
            createdOn: new Date(),
            createBy: userId,
        };
        console.log(rolesPost);
        const rolesInstance = new Roles(rolesPost);
        const validationError = rolesInstance.validateSync();
        if (validationError) {
            res.status(400).json(validationError.message);
            return;
        }
        await dbconnect();
        await rolesInstance.save();
        res.status(200).json('Data saved successfully!');
        await dbclose();
        return;
    }
    catch (error) {
        res.status(500).json("server responded with an error");
        console.log(error);
    }
};
//# sourceMappingURL=rolesController.js.map