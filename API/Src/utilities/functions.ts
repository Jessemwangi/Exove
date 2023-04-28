import { dbclose, dbconnect, securityKey } from "../Configs/dbConnect.js";
import { run } from "../Ldap/ldapTest.js";
import jwt from 'jsonwebtoken';
import { IApprovals, ILdapAuth, INotificationsSetting, INotifier, IRoles, IUser, userSearch } from "../dbcontext/Interfaces.js";
import { Approvals, Notifer, NotificationSetting, Roles, Template, Users } from "../dbcontext/dbContext.js";
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

interface RequestWithUser extends Request {
  user?: ILdapAuth;
}



export const checkUserRoles = async (userId: String,roleLevel:Number): Promise<Boolean> => {

    await dbconnect();
    const roleData: IRoles = await Roles.findOne({ userId, roleStatus: true  }).lean();
    await dbclose();
      if (roleData && roleData.roleLevel <= roleLevel){
      return true;
      }
      return false;
      
};

export const addUserToRole = async (userId:String, roleId:String) => {
  
  const result = await Roles.updateOne(
    { _id: roleId }, { $push :{userId}}).exec()

}

export const getUserF = async ({ ldapUid, _id }: userSearch) => {

    await dbconnect()
    const usersResult: IUser = await Users.findOne({ $or: [{ ldapUid: ldapUid }, { _id: _id }] })
      .populate({
        path: "rolesId",
        model: Roles,
      }).lean()
      .exec()
    await dbclose()
    return usersResult
 
}
  

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
    // api/logout
  if (req.path === '/api/logout') {
    res.clearCookie("access_token",{
      sameSite:"none",
      secure:true,
      httpOnly:true,
  
    }).status(200).json("user logout")
    return;
    };

        // Api/login
  if (req.path === '/api/login') { 
    const username: string = req.body.username
    const password: string = req.body.password
 
    const Luser: ILdapAuth = await run(username, password);
    
    const user = await getUserF({ ldapUid: Luser.uid } as userSearch)
    
    const settoken = jwt.sign({user},securityKey);

    console.log('ldap user', Luser, "db user", user)

   return res.cookie("access_token",settoken,{
      httpOnly:true,
      secure:true, 
   }).status(200).json(user)
    
  }
    
  const token = req.cookies.access_token;
    if (token) {
      jwt.verify(token, securityKey, (err: any, userInfo: any) => {
        if (err) {
          console.log(err)
          return res.status(401).json("Authentication token Not Valid");
        }
        const user: ILdapAuth = userInfo;
    
        req.body = {
          ...req.body, ...user
        }
        return next();
      });
    }
    else {
      return res.status(403).json('Not authenticated')
    }

  } catch (error) {
   return res.status(401).send({ error: 'Invalid username or password' });
  }
};

export const errorMiddleware: ErrorRequestHandler = async (err, req:Request, res:Response, next) => {

  console.error(err.message);
  if (err.name === 'ValidationError') {
    res.status(400);
  } else {
    res.status(500);
  }

  res.json( err.message,
  );
};