import { QuestionCats, Questions, Templates } from '../dbcontext/dbContext.js';
import { dbclose, dbconnect } from '../Configs/dbConnect.js';
export const getTemplates = async (req, res) => {
    try {
        await dbconnect();
        const templates = await Templates.findasync({}).populate({
            path: 'categoryId',
            model: QuestionCats,
            populate: [{
                    path: 'questions',
                    model: Questions,
                }]
        });
        await dbclose();
        res.status(200).json(templates);
    }
    catch (error) {
        console.log(error);
    }
};
//# sourceMappingURL=templatesController.js.map