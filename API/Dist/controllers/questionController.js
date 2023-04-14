import { v4 as uuidv4 } from "uuid";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { Category, Question } from '../dbcontext/dbContext.js';
export const getQuestion = async (req, res) => {
    try {
        await dbconnect();
        const q = await Question.find({}).select('-__v').lean();
        console.log(q);
        await dbclose();
        res.status(200).json(q);
    }
    catch (error) {
        res.status(500).json('error');
        console.log(error);
    }
};
export const addQuestion = async (req, res) => {
    try {
        const httpData = req.body;
        const primaryKey = uuidv4();
        const data = {
            _id: primaryKey,
            category: httpData.category,
            question: httpData.question,
            createdBy: httpData.createdBy,
        };
        await dbconnect();
        const q = await new Question(data).save();
        if (q) {
            const updateResult = await Category.updateOne({ "_id": httpData.category }, { $push: { 'questions': primaryKey } }).exec();
            console.log('Update result:', updateResult);
        }
        console.log(q);
        await dbclose();
        res.status(200).json('saved');
    }
    catch (error) {
        res.status(500).json('error');
        console.log(error);
    }
};
//# sourceMappingURL=questionController.js.map