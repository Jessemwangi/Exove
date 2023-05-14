import { v4 as uuidv4 } from "uuid";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { Entity } from "../dbcontext/dbContext.js";
export const postEntity = async (req, res, next) => {
    const httpData = req.body;
    if (!httpData)
        next(new Error("No Post data supplied"));
    try {
        const newEntity = {
            _id: uuidv4(),
            name: httpData.name,
            approverRoleLevel: 2,
            description: httpData.description,
        };
        await dbconnect();
        await new Entity.save(newEntity);
        await dbclose();
        res.status(200).json("entity added successful");
        return;
    }
    catch (error) {
        next(error.message);
    }
};
//# sourceMappingURL=entityController.js.map