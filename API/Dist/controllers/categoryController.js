import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { v4 as uuidv4 } from "uuid";
import { Category } from "../dbcontext/dbContext.js";
export const getCategory = async (req, res) => {
    try {
        await dbconnect();
        const category = await Category.find({}).select('-__v').lean();
        await dbclose();
        return res.status(200).json(category);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('error');
    }
};
export const addCategory = async (req, res) => {
    try {
        const httpData = req.body;
        const data = {
            _id: uuidv4(),
            categoryName: httpData.name,
            description: httpData.description,
            questions: httpData.questions,
            createdBy: httpData.createdBy,
            categoryStatus: true,
            createdOn: new Date
        };
        await dbconnect();
        const q = await new Category(data).save();
        if (q) {
            return res.status(200).json('saved');
        }
        else {
            return res.status(501).json('failed to save');
        }
        await dbclose();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('error');
    }
};
//# sourceMappingURL=categoryController.js.map