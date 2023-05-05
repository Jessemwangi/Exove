import { FeedBacks, Reports, RequestPicks } from "../dbcontext/dbContext.js";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
export const getReports = (req, res) => {
    const id = req.params.id;
};
export const postReports = async (req, res, next) => {
    const httpData = req.body;
    const newReport = {
        _id: httpData._id,
        feedbacks: httpData.feedbacks,
        templates: httpData.templates,
        createBy: httpData.createBy,
        userId: httpData.userId,
        requestPicks: httpData.requestPicks,
    };
    try {
        await dbconnect();
        await new Reports(newReport).save();
        await dbclose();
        res.status(200).json('Report saved successfully');
        return;
    }
    catch (error) {
        next(error);
    }
};
export const putReports = (req, res, next) => {
};
export const getuserTotal = async (name) => {
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
const reportData = async (reportId) => {
    const report = await Reports.findById(reportId)
        .populate('feedbacks')
        .populate('requestPicks')
        .exec();
    if (!report) {
        throw new Error('Report not found');
    }
    const totalCategories = new Set();
    const totalQuestions = new Set();
    const questionsPerCategory = {};
    let categoryNames = [];
    let questions = [];
    let answers = [];
    report.feedbacks.forEach((feedback) => {
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
    const requestPick = await RequestPicks.findById(report.requestPicks);
    const totalSelectedList = requestPick.SelectedList.filter(item => item.selectionStatus).length;
    const userIds = requestPick.SelectedList.map(item => item.userId);
    return {
        userId: userIds,
        ...report,
        requestPicksSelectedList: requestPick.SelectedList,
        totalCategories: totalCategories.size,
        totalQuestions: totalQuestions.size,
        categories: Object.entries(questionsPerCategory).map(([categoryName, totalQuestions]) => ({
            _id: categoryName,
            categoryName,
            totalQuestions,
            questions: []
        })),
        feedbacks: report.feedbacks,
        totalSelectedList
    };
};
//# sourceMappingURL=reportsController.js.map