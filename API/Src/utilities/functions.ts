import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { run } from "../Ldap/ldapTest.js";
import jwt from "jsonwebtoken";
import { Document, Model } from 'mongoose';
import {
  IApprovals,
  ILdapAuth,
  INotificationsSetting,
  INotifier,
  IRequestPicks,
  IRoles,
  IUser,
  userSearch,
} from "../dbcontext/Interfaces.js";
import {
  Approvals,
  FeedBacks,
  Notifer,
  NotificationSetting,
  Reports,
  RequestPicks,
  Roles,
  Template,
  Users,
} from "../dbcontext/dbContext.js";
import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { cookieExpiresIn, securityKey } from "../Configs/serverConfig.js";

interface RequestWithUser extends Request {
  user?: ILdapAuth;
}
export interface IUserTemplateInPicks {
  count: number,
  _id:_id
}

interface _id {
  _id:string
}

/// user functions  *************************************************************************************

export const addUserReportTo = async (_id:string) => {

    // const user =await Users.findOne({_id:_id})
    // const totalWorkId:number = user.WorkId.length
    // if (totalWorkId > 0) {
      await Users.updateOne(
        { _id: _id },
        {
          $set: {
            'workId.$[elem].workReportStatus': false,
            'workId.$[elem].deactivatedOn': new Date(),
          },
        },
        { arrayFilters: [{ 'elem.workReportStatus': { $exists: true } }] }
      );

      // await Users.updateOne(
      //   { _id: _id },
      //   {
      //     $set: {
      //       'workId.$[].workReportStatus': false,
      //       'workId.$[].deactivatedOn': new Date()
      //     }
      //   }
      // )

    
  } 
 

export const checkUserRoles = async (
  userId: string,
  roleLevel: Number
): Promise<Boolean> => {
  const user: IUser | null = await getUserF({ ldapUid: userId });

  await dbconnect();
  const roleData: IRoles  | null= await Roles.findOne({
    users: user?._id,
    roleStatus: true,
  }).lean();

  if (roleData && roleData.roleLevel <= roleLevel) {
    return true;
  }
  return false;
};

export const addUserToRole = async (userId: string, roleId: string) => {
  await Roles.updateOne({ _id: roleId }, { $push: { users: userId } }).exec();
};


// get user by name or ID
export const getUserF = async ({ ldapUid, _id }: userSearch) => {
  await dbconnect();
  const usersResult = await Users.findOne({
    $or: [{ ldapUid: ldapUid }, { _id: _id }],
  }).select('-__v')
    .populate({
      path: "rolesId",
      model: Roles,
    })
    .lean()
    .exec();
  await dbclose();
  return usersResult;
};

export const getUserReportTo = async (userId: string): Promise<string> => {
  await dbconnect()
  const user = await Users.findOne({
    'ldapUid': userId,
    'workId.workReportStatus': true
  })
  .select({ 'workId.reportsTo': 1 })
  .exec();
await dbclose()
  const userReportTo = user?.workId[0].reportsTo || '';
 return userReportTo;
}

// end of user function
//Approvals functions *************************************************************************************
export const addApprovals = async (approval: IApprovals) => {
  await new Approvals(approval).save();
};

//notification  *************************************************************************************
export const addToNotification = async (newNotification: INotifier) => {
  if (newNotification.to.length > 0 && newNotification.entityname !== "") {
    const promises = newNotification.to.map(async (userId) => {
      const notificationStatus = await userEnabledNotification(
        userId,
        newNotification.entityname
      ); // check if the user has enable notification
      if (notificationStatus) {
        // send notification
        // update notification status
        await Notifer.updateOne(
          { _id: newNotification._id },
          { notifierstatus: true }
        );
      }
    });
    await Promise.all(promises);
  }
};

// chck if the user has enabled notification in the dashboard setting
export const userEnabledNotification = async (
  userId: string,
  entityName: string
): Promise<boolean> => {
  const notiSettingsData: INotificationsSetting | null =
    await NotificationSetting.findOne({ userId, notisettingstatus: true }).lean();
  if (notiSettingsData && notiSettingsData.entityname.length > 0)  {
    return notiSettingsData.entityname.includes(entityName);
  }
  else {
    return false;
  }
};

export const countIdNotfication = async (applicationid:string):Promise<number>  => { //pass request pick Id to verify no duplication of application id before insert
  const totalNotification:number = await Notifer.countDocuments({ 'applicationid': applicationid })
              return totalNotification
}

export const applicationIdValidation = async (
  id: string,
  entityName:string
): Promise<number> => {
  const models:{ [key: string]: Model<Document> } = {
    Approvals: Approvals as unknown as Model<Document>,
  Notifer:Notifer as unknown as Model<Document>,
  NotificationSetting:NotificationSetting as unknown as Model<Document>,
  RequestPicks:RequestPicks as unknown as Model<Document>,
  Roles:Roles as unknown as Model<Document>,
  Template:Template as unknown as Model<Document>,
    Users:Users as unknown as Model<Document>,
    FeedBacks:FeedBacks as unknown as Model<Document>,
    Reports:Reports as unknown as Model<Document>,
  };
  const Model = models[entityName];
  console.log('Model',Model, 'id',id)
  if (!Model) {
    throw new Error(`Invalid model name: ${entityName}`);
  }
  const appCounts: number = await Model.countDocuments({
    _id: id,
  })
    .exec();

  return appCounts;
}
// End of notification
// Check user request pick  *************************************************************************************
export const isUserInRequestPick = async (
  requestedTo: string
): Promise<IRequestPicks | null> => {
  const data: IRequestPicks | null = await RequestPicks.findOne({
    requestedTo: requestedTo,
    submitted: false,
  })
    .lean()
    .sort({ requestedOn: 1 })
    .exec();

  return data;
};

export const getUserPrevPicksAndTemplate = async (template: string, requestedTo: string): Promise<IUserTemplateInPicks> => {
  await dbconnect()
  const count:number = await RequestPicks.countDocuments({
    template: template,
    requestedTo: requestedTo
   });
   if (count === 0) return    { count, _id:{_id:''} };
   const _id:_id = await RequestPicks.findOne(
    {
    template: template,
    requestedTo: requestedTo
    },
    '_id'
   ).exec() || ''
   await dbclose()
  const result: IUserTemplateInPicks = { count, _id };
  return result
}

// validate requestpickID

export const RequestPickCount = async (
  id: string
): Promise<number> => {
  const picksCount: number = await RequestPicks.countDocuments({
    _id: id,
  })
    .exec();

  return picksCount;
};

export const searchTemplate = async (template: string): Promise<number> => {
  const data = await Template.find({}).lean();

  return data.length;
};

// middleware for authentication  *************************************************************************************
export const ldapAuthMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    // api/logout
    if (req.path === "/api/logout") {
      res
        .clearCookie("access_token", {
          sameSite: "none",
          secure: true,
          httpOnly: true,
        })
        .status(200)
        .json("user logout");
      return;
    }

    // Api/login
    if (req.path === "/api/login") {
      const username: string = req.body.username;
      const password: string = req.body.password;
      if (!username && !password) return next(new Error ('Please provide both a username and a password.'))
      const user: ILdapAuth = await run(username, password);

      const dbUser = await getUserF({ ldapUid: user.uid } as userSearch);

      const settoken = jwt.sign({ user }, securityKey);

      return res
        .cookie("access_token", settoken, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          expires: cookieExpiresIn
        })
        .status(200)
        .json({ ...user, ...dbUser });
    }

    const token = req.cookies.access_token;

    if (token) {
      jwt.verify(token, securityKey, (err: any, userInfo: any) => {
        if (err) {
          console.log(err);
          return res.status(401).json("Sorry, the authentication token you provided is not valid. Please check your token and try again.");
        }

        const user: ILdapAuth = userInfo;

        req.body = {
          ...req.body,
          ...user,
        };
        return next();
      });
    } else {
      return res.status(403).json("Not authenticated");
    }
  } catch (error) {
    return res.status(401).send({ error: "Invalid username or password" });
  }
};

// middleware for general error  *************************************************************************************

export const errorMiddleware: ErrorRequestHandler = async (
  err,
  req: Request,
  res: Response,
  next
) => {
  console.error(err.message);
  if (err.name === "ValidationError") {
    res.status(400);
  } else {
    res.status(500);
  }

  res.json(err.message);
};

