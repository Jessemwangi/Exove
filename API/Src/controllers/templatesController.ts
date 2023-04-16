import { Request, Response } from "express";
import { Template } from "../dbcontext/dbContext.js";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { ITemplates } from "../dbcontext/Interfaces.js";
import { v4 as uuidv4 } from "uuid";

export const getTemplates = async (req: Request, res: Response) => {
  try {
    await dbconnect();
    const templates: ITemplates[] = await Template.find({})
    .populate({
      path: "categories",
      select:'-__v -_id',
      populate: {
        path: "questions",
        select:'-__v',
      },
    })
      .exec();
    await dbclose();
    res.status(200).json(templates);
  } catch (error) {
    console.log(error);
    res.status(500).json("server responded with an error");
  }
};

export const getTemplate = async (req: Request, res: Response) => {
  try {
    // Find the active template
    await dbconnect();
    const template: ITemplates = await Template.findOne({ active: true }). select("-__v")
    .populate({
      path: "categories",
      select:'-__v -_id',
      populate: {
        path: "questions",
        select:'-__v',
         match: {"question.active":true },
      },
    })
      .exec();
    await dbclose();
    // Send the template data in the response
    res.status(200).json(template);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

export const addTemplate = async (req: Request, res: Response) => {
  const httpData = req.body;
  const primaryKey = uuidv4();
  if (!httpData) {
    res.status(404).json("Post data not found or empty");
    return;
  }

  const newTemplate: ITemplates = {
    _id: primaryKey,
    templateTitle: httpData.templateTitle,
    createdOn: new Date(),
    categories: httpData.categories,
    createdBy: "Hr Jesse",
    active: true,
  };

  try {
    // Find the active template
    await dbconnect();
    const template = await new Template(newTemplate).save();
    if (template) {
      const setDefault = await Template.updateMany(
        { _id: { $ne: primaryKey } },
        { active: false }
      );

      if (setDefault.nModified === 0) {
        res.status(403).json("failed to set template as default");
      } else {
        res.status(200).json("saved");
      }
    } else {
      res.status(501).send("saving failed");
    }
    // Send the template data in the response
    await dbclose();
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

/// set default template

export const setDefaultTemplate = async (req: Request, res: Response) => {
  const httpData: String = req.params.id;
  console.log(httpData)
  if (!httpData) {
    res.status(404).json("Post data not found or empty");
    return;
  }

  try {
    // Find the active template
    await dbconnect();
    const template = await Template.updateOne(
      { _id: httpData },
      { active: true }
    );
    if (template.nModified !== 0) {
      const result = await Template.updateMany({ _id: { $ne: httpData } }, { active: false });
    
      await dbclose();
      if (result.nModified === 0) {
        res.status(403).json("failed to remove other template as default");
      } else {
        res.status(200).json("template set as default");
      }
    }
    
    // Send the template data in the response
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
