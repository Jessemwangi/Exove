import { dbclose, dbconnect } from "../Configs/dbConnect.js";
import { run } from "../Ldap/ldapTest.js";
import jwt from "jsonwebtoken";
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
  Notifer,
  NotificationSetting,
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

/// user functions

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
  const user: IUser = await getUserF({ ldapUid: userId });

  await dbconnect();
  const roleData: IRoles = await Roles.findOne({
    users: user._id,
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
  const usersResult: IUser = await Users.findOne({
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

export const addApprovals = async (approval: IApprovals) => {
  await new Approvals(approval).save();
};

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

export const userEnabledNotification = async (
  userId: string,
  entityName: string
): Promise<boolean> => {
  const notiSettingsData: INotificationsSetting =
    await NotificationSetting.find({ userId, notisettingstatus: true }).lean();
  console.log(notiSettingsData);
  if (notiSettingsData) {
    return notiSettingsData.entityname.includes(entityName);
  }
  return false;
};

// Check user request pick
export const isUserInRequestPick = async (
  requestedTo: string
): Promise<IRequestPicks> => {
  const data: IRequestPicks = await RequestPicks.findOne({
    requestedTo: requestedTo,
    submitted: false,
  })
    .lean()
    .sort({ requestedOn: 1 })
    .exec();

  return data;
};

export const searchTemplate = async (template: string): Promise<number> => {
  const data = await Template.find({}).lean();

  return data.length;
};

// middleware for authentication
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
          return res.status(401).json("Authentication token Not Valid");
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

// middleware for general error

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
