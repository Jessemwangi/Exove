import { v4 as uuidv4 } from "uuid";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { Entity } from "../dbcontext/dbContext.js";
import { checkUserRoles } from "../utilities/functions.js";
export const postEntity = async (req, res, next) => {
    const httpData = req.body;
    const user = req.body.user;
    const userId = user.uid;
    const id = req.params.id;
    console.log(id);
    const newEntity = {
        _id: id ? id : uuidv4(),
        name: httpData.name,
        approverRoleLevel: 2,
        description: httpData.description,
        createdBy: userId,
    };
    console.log(newEntity);
    try {
        const rolelevel = await checkUserRoles(userId, 4);
        if (!rolelevel) {
            res.status(200).json("Not authorized to peform this transaction");
            return;
        }
        const entityInstance = new Entity(newEntity);
        const validationError = entityInstance.validateSync();
        if (validationError) {
            res.status(400).json(validationError.message);
            return;
        }
        await dbconnect();
        if (id) {
            const putEntity = await Entity.findByIdAndUpdate({ _id: id }, entityInstance.toObject(), { new: true }).exec();
            console.log(putEntity);
            if (!putEntity)
                return next(res.status(500).json('not updated'));
        }
        else {
            await entityInstance.save();
        }
        await dbclose();
        res.status(200).json("Entity transacted successfully");
        return;
    }
    catch (error) {
        next(error.message);
    }
};
export const getEntities = async (req, res, next) => {
    try {
        await dbconnect();
        const entities = await Entity.find({}).select('-__v').lean();
        await dbclose();
        res.status(200).json(entities);
    }
    catch (error) {
        console.log(error);
        next(error.message);
    }
};
//# sourceMappingURL=entityController.js.map