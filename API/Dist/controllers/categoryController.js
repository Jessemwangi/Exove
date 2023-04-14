import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { v4 as uuidv4 } from "uuid";
import { Category } from "../dbcontext/dbContext.js";
export const getCategory = async (req, res) => {
    try {
        await dbconnect();
        const q = await Category.find({}).select('-__v').lean();
        console.log(q);
        await dbclose();
        res.status(200).json(q);
    }
    catch (error) {
        res.status(500).json('error');
        console.log(error);
    }
};
export const addCategory = async (req, res) => {
    try {
        const httpData = req.body;
        const data = {
            _id: uuidv4(),
            name: httpData.name,
            description: httpData.description,
            questions: httpData.questions,
            createdBy: httpData.createdBy,
            categoryStatus: true,
            createdOn: new Date
        };
        await dbconnect();
        const q = await new Category(data).save();
        console.log(q);
        if (q) {
            res.status(200).json('saved');
        }
        else {
            res.status(501).json('failed to save');
        }
        await dbclose();
    }
    catch (error) {
        res.status(500).json('error');
        console.log(error);
    }
};
//# sourceMappingURL=categoryController.js.map