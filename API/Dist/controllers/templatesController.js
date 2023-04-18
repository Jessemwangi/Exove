import { Template } from "../dbcontext/dbContext.js";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { v4 as uuidv4 } from "uuid";
export const getTemplates = async (req, res) => {
    try {
        await dbconnect();
        const templates = await Template.find({})
            .populate({
            path: "categories",
            select: '-__v -_id',
            populate: {
                path: "questions",
                select: '-__v',
            },
        })
            .exec();
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
        const template = await Template.findOne({ active: true }).select("-__v")
            .populate({
            path: "categories",
            select: '-__v -_id',
            populate: {
                path: "questions",
                select: '-__v',
            },
        })
            .exec();
        await dbclose();
        res.status(200).json(template);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server error");
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
        templateTitle: httpData.templateTitle,
        instructions: httpData.instructions,
        createdOn: new Date(),
        categories: httpData.categories,
        createdBy: httpData.createBy,
        active: true,
    };
    try {
        await dbconnect();
        const template = await new Template(newTemplate).save();
        if (template) {
            const setDefault = await Template.updateMany({ _id: { $ne: primaryKey } }, { active: false });
            if (setDefault.modifiedCount === 0) {
                res.status(403).json("failed to set template as default");
            }
            else {
                res.status(200).json("saved");
            }
        }
        else {
            res.status(501).send("saving failed");
        }
        await dbclose();
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};
export const setDefaultTemplate = async (req, res) => {
    const httpData = req.params.id;
    console.log(httpData);
    if (!httpData) {
        res.status(404).json("Post data not found or empty");
        return;
    }
    try {
        await dbconnect();
        const template = await Template.updateOne({ _id: httpData }, { active: true });
        if (template.modifiedCount !== 0) {
            const result = await Template.updateMany({ _id: { $ne: httpData } }, { active: false });
            await dbclose();
            if (result.modifiedCount === 0) {
                res.status(403).json("failed to remove other template as default");
            }
            else {
                res.status(200).json("template set as default");
            }
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};
//# sourceMappingURL=templatesController.js.map