import { NextFunction, Request, Response } from "express";
import { FeedBacks, Reports } from "../dbcontext/dbContext.js";
import { IReports } from "../dbcontext/Interfaces.js";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";

export const getReports = (req: Request, res: Response) => {
  const name = req.params.name;
};

export const postReports = async (req: Request, res: Response, next: NextFunction) => {
  const httpData: IReports = req.body;

  const newReport: IReports = {
    _id: httpData._id,
    feedbacks: httpData.feedbacks,
    templates: httpData.templates,
    createBy: httpData.createBy,
    userId: httpData.userId,
    requestPicks: httpData.requestPicks,
  };
    try {
        await dbconnect()
        await new Reports(newReport).save()
        await dbclose()
        res.status(200).json('Report saved successfully')
        return
    } catch (error) {
        next(error)
    }
    
};

export const putReports = (req: Request, res: Response, next: NextFunction) => {
    
};

// Report functions
export const getuserTotal = async (name: String) => {
  
        const feeds = await FeedBacks.aggregate([
            { $match: { _id: name } },
            {
              $lookup: {
                from: "categories",
                localField: "categories.category",
                foreignField: "_id",
                as: "categoryInfo",
              },
            },
            { $unwind: "$categories" },
            {
              $lookup: {
                from: "questions",
                localField: "categories.questions._id",
                foreignField: "_id",
                as: "questionInfo",
              },
            },
            { $unwind: "$categories.questions" },
            {
              $group: {
                _id: "$categories.category",
                categoryName: { $first: "$categoryInfo.name" },
                numQuestions: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: false,
                categoryName: true,
                numQuestions: true,
              },
            },
            {
              $group: {
                _id: null,
                categories: {
                  $push: { name: "$categoryName", numQuestions: "$numQuestions" },
                },
                feedbackInfo: { $first: "$_id" },
              },
            },
          ]);

};
