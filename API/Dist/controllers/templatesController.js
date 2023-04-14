import { Template } from '../dbcontext/dbContext.js';
import { dbclose, dbconnect } from '../Configs/dbConnect.js';
import { v4 as uuidv4 } from "uuid";
export const getTemplates = async (req, res) => {
    try {
        await dbconnect();
        const templates = await Template.find({});
        await dbclose();
        res.status(200).json(templates);
    }
    catch (error) {
        console.log(error);
        res.status(500).json("server responded with an error");
    }
};
export const getTemplate = async (req, res) => {
    try {
        await dbconnect();
        const template = await Template.find({ active: true })
            .populate({
            path: 'categories.category',
            select: '-__v',
        })
            .populate({
            path: 'categories.questions',
            select: '-__v',
        })
            .exec();
        await dbclose();
        res.status(200).json(template);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
export const addTemplate = async (req, res) => {
    const httpData = req.body;
    const primaryKey = uuidv4();
    if (!httpData) {
        res.status(404).json("Post data not found or empty");
        return;
    }
    const newTemplate = {
        _id: primaryKey,
        ...httpData,
        createdOn: new Date,
        createdBy: "Hr Jesse",
        active: true,
    };
    console.log("template data .......", newTemplate);
    try {
        await dbconnect();
        const template = await new Template(newTemplate).save();
        await dbclose();
        if (template) {
            res.status(200).json('saved');
        }
        else {
            res.status(501).send('saving failed');
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
//# sourceMappingURL=templatesController.js.map