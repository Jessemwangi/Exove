import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { IApprovals, IRoles } from "../dbcontext/Interfaces.js";
import { Approvals, Roles } from "../dbcontext/dbContext.js";

export const checkUserRoles = async (userId: String): Promise<Number | String> => {
  try {
    await dbconnect();
    const roleData: IRoles = await Roles.find({ userId, roleStatus: true  }).lean();
    await dbclose();
    if (roleData) {
      return roleData.roleLevel;
    } else {
      return `Active role for this user is not defined`;
    }
  } catch (error) {
    return "server responded with an error";
  }
};

export const addApprovals = async (approval:IApprovals) => {
    await new Approvals(approval).save()     
}

export const addToNotfication =async (params:IApprovals) => {
  
}