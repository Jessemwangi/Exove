import { NextFunction, Request, Response } from "express";
import { FeedBacks, Reports, RequestPicks } from "../dbcontext/dbContext.js";
import { IFeedBacks, ILdapAuth, IReports, IRequestPicks, ReportWithDetails } from "../dbcontext/Interfaces.js";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { v4 as uuidv4 } from "uuid";
import { savedSuccess } from "../Configs/serverConfig.js";
import { model } from "mongoose";

export const getReports = async (req: Request, res: Response, next: NextFunction) => {
  // get all report without fetching the adjusted collections
  try {
    await dbconnect()

    const reportsData: IReports[] = await Reports.find({}).select('-__v').lean()
    await dbclose()
    res.status(200).json(reportsData)
  } catch (error) {
    next(error)
  }
};

export const getReport = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id; // to get a user report you send the report id
  try {
    await dbconnect()
    const reportsData: ReportWithDetails = await reportData(id)
    res.status(200).json(reportsData)
    await dbclose()
  } catch (error) {
    next(error)
  }
};

export const postReports = async (req: Request, res: Response, next: NextFunction) => {
  const httpData: IReports = req.body;

  const user: ILdapAuth = req.body.user;
  const userId: string = user.uid;

  const newReport: IReports = {
    _id: uuidv4(),
    feedbacks: httpData.feedbacks,
    template: httpData.template,
    createdBy: userId,
    userId: httpData.userId,
    requestPicks: httpData.requestPicks,
  };

  const reportInstance = new Reports(newReport)
  const validationError = reportInstance.validateSync()
  if (validationError) {
   return next(validationError);
   
  }
    try {
        await dbconnect()
        await new Reports(newReport).save()
        await dbclose()
        res.status(200).json(savedSuccess.toString())
        return
    } catch (error:any) {
        next(error.message)
    }
    
};

export const putReports = (req: Request, res: Response, next: NextFunction) => {
    
};

// Report functions
export const getuserTotal = async (req: Request, res: Response, next: NextFunction) => {
  await dbconnect()
        const feeds = await FeedBacks.aggregate([
            { $match: { _id: req.params.name } },
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
  await dbclose()
res.send(feeds)
};


export const reportData = async (reportId: string):Promise<ReportWithDetails> => {
 
  const report = await Reports.findById(reportId)
    .populate(
      'feedbacks'
    )
      .populate('requestPicks').lean()
      .exec();
  
    if (!report) {
      throw new Error('Report not found');
    }
  
    const totalCategories = new Set<string>();
    const totalQuestions = new Set<string>();
    const questionsPerCategory: Record<string, number> = {};
    let categoryNames: string[] = [];
    let questions: string[] = [];
    let answers: String[] = [];
  
    report.feedbacks.forEach((feedback: IFeedBacks) => {
      feedback.categories.forEach(category => {
        totalCategories.add(category.category);
        categoryNames.push(category.category);
        if (!questionsPerCategory[category.category]) {
          questionsPerCategory[category.category] = 0;
        }
        category.questions.forEach(question => {
          totalQuestions.add(question._id);
          questionsPerCategory[category.category]++;
          questions.push(question.question);
          answers.push(question.answer);
        });
      });
    });
  
    const requestPick:IRequestPicks | null = await RequestPicks.findById(report.requestPicks);
    const totalSelectedList = requestPick?.SelectedList.filter(
      item => item.selectionStatus
    ).length || 0;
    const userIds = requestPick?.SelectedList.map(item => item.userId);
  
  return {
  
      ...report,
      requestPicksSelectedList: requestPick!.SelectedList,
      totalCategories: totalCategories.size,
      totalQuestions: totalQuestions.size,
      categories: Object.entries(questionsPerCategory).map(([categoryName, totalQuestions]) => ({
        _id: categoryName,
        categoryName,
        totalQuestions,
        questions: []
      })),
      feedbacks: report.feedbacks,
      totalSelectedList // Add this line
    };

}

export const summaryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
  await dbconnect()
  const reports = await Reports.findOne({_id:req.params.id})
  .select('_id userId createdBy')
  .populate({
  path: 'feedbacks',
  select: '_id userId roleLevel categories',
    populate: {
      path: 'categories.category',
      model: 'Category',
      select: '_id categoryName',
      
        // path: 'categories.questions',
        // model: 'Question',
        // select:'_id '
      }

  }).populate({
    path: 'requestPicks',
    model: 'RequestPicks',
    select:'SelectedList _id'
  }).
    populate(
      {
      path: 'template',
      model: 'Template',
      select: '_id template active'
      // match: { active: true }
      }
      )
  
    ;
    const summary = await FeedBacks.aggregate([
      { $unwind: '$categories' },
      {
        $group: {
          _id: '$_id',
          totalCategories: { $sum: 1 },
          questionsPerCategory: {
            $push: {
              category: '$categories.category',
              totalQuestions: { $size: '$categories.questions' },
            },
          },
        },
      },
    ]);
    await dbclose()
    res.json({ reports, summary });
} catch (err: any) {
  console.log(err)
    res.status(500).json(err.message );
  }

}

export const summaryByName = async (req: Request, res: Response, next: NextFunction) => {
  try {
  await dbconnect()
  const reports:IReports[] = await Reports.find({userId:req.params.name})
  .select('_id userId createdBy')
  .populate({
  path: 'feedbacks',
  select: '_id userId roleLevel categories',
    populate: {
      path: 'categories.category',
      model: 'Category',
      select: '_id categoryName',
      
        // path: 'categories.questions',
        // model: 'Question',
        // select:'_id '
      }

  }).populate({
    path: 'requestPicks',
    model: 'RequestPicks',
    select:'SelectedList _id'
  }).
    populate(
      {
      path: 'template',
      model: 'Template',
      select: '_id template active',
       match: { active: true }
      }
      );

    await dbclose()
    res.status(200).json({ reports });
} catch (err: any) {
  console.log(err)
    res.status(500).json(err.message );
  }

}