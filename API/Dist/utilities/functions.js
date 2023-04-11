import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { Approvals, Roles } from "../dbcontext/dbContext.js";
export const checkUserRoles = async (userId) => {
    try {
        await dbconnect();
        const roleData = await Roles.find({ userId, roleStatus: true }).lean();
        await dbclose();
        if (roleData) {
            return roleData.roleLevel;
        }
        else {
            return `Active role for this user is not defined`;
        }
    }
    catch (error) {
        return "server responded with an error";
    }
};
export const addApprovals = async (approval) => {
    await new Approvals(approval).save();
};
export const addToNotfication = async (params) => {
};
//# sourceMappingURL=functions.js.map