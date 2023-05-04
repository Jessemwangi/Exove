import { Approvals } from '../dbcontext/dbContext.js';
import { dbclose, dbconnect } from '../Configs/dbConnect.js';
export const getApps = async (req, res, next) => {
    try {
        await dbconnect();
        const approvals = await Approvals.find({}).lean().sort({ 'createdOn': 1 }).exec();
        await dbclose();
        return res.status(200).json(approvals);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json('Server responded with an error');
    }
};
//# sourceMappingURL=approvalsController.js.map