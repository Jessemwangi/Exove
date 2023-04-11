import { Templates } from '../dbcontext/dbContext.js';
import { dbclose, dbconnect } from '../Configs/dbConnect.js';
export const getTemplates = async (req, res) => {
    try {
        await dbconnect();
        const templates = await Templates.findasync({});
        await dbclose();
        res.status(200).json(templates);
    }
    catch (error) {
        console.log(error);
        res.status(500).json("server responded with an error");
    }
};
//# sourceMappingURL=templatesController.js.map