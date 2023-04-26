import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { run } from "../Ldap/ldapTest.js";
import jwt from 'jsonwebtoken';
import { IApprovals, ILdapAuth, INotificationsSetting, INotifier, IRoles, ITemplates } from "../dbcontext/Interfaces.js";
import { Approvals, Notifer, NotificationSetting, Roles, Template } from "../dbcontext/dbContext.js";
import { Request, Response, NextFunction } from "express";

interface RequestWithUser extends Request {
  user?: ILdapAuth;
}

export const checkUserRoles = async (userId: String,roleLevel:Number): Promise<Boolean> => {

    await dbconnect();
    const roleData: IRoles = await Roles.findOne({ userId, roleStatus: true  }).lean();
    await dbclose();
      if (roleData && roleData.roleLevel >= roleLevel){
      return true;
      }
      return false;
      
};

export const addApprovals = async (approval:IApprovals) => {
    await new Approvals(approval).save()     
}

export const addToNotification = async (newNotification: INotifier) => {
  if (newNotification.to.length > 0 && newNotification.entityname !== '') {
    const promises = newNotification.to.map(async (userId) => {
      const notificationStatus = await userEnabledNotification(userId, newNotification.entityname); // check if the user has enable notification
      if (notificationStatus) {
        // send notification
        // update notification status
        await Notifer.updateOne({ _id: newNotification._id }, { notifierstatus: true });
       
      }
    });
    await Promise.all(promises);
  }
};


export const userEnabledNotification = async (userId: String, entityName:String): Promise<boolean> => {
  const notiSettingsData: INotificationsSetting = await NotificationSetting.find({ userId, notisettingstatus: true }).lean();
  console.log(notiSettingsData);
  if (notiSettingsData) {
    return notiSettingsData.entityname.includes(entityName);
  }
  return false;
}


export const searchTemplate = async (template: string): Promise<number> => {
  const data = await Template.find({}).lean();
  console.log(data)
  return data.length
}


export const ldapAuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
  const token = req.cookies.access_token;
  if (token)
  {
    jwt.verify(token, "s3cr3t", (err:any, userInfo:any) => {
      if (err){
    console.log(err)
      return res.status(403).json("Authentication token Not Valid");
      }
      const user: ILdapAuth = userInfo; 
      console.log(user)
      req.body = {
        ...req.body,user
      }
    });
    return next();
  }  
 
    const username: string = req.body.username
    const password: string = req.body.password
 
    const user = await run(username, password);
    console.log(user)
    const settoken = jwt.sign({user},"s3cr3t");

    console.log(user)

   return res.cookie("access_token",settoken,{
      httpOnly:true,
      secure:true, 
  }).status(200).json(user)
  } catch (error) {
   return res.status(401).send({ error: 'Invalid username or password' });
  }
};

