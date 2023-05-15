'use strict'

import { ILdapAuth, INotificationsSetting } from "../dbcontext/Interfaces.js";
import { NextFunction, Request, Response } from 'express'
import { NotificationSetting } from "../dbcontext/dbContext.js";
import { v4 as uuidv4 } from "uuid";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";

export const postNotiSetting = async (req: Request, res: Response, next: NextFunction) => {
    const user: ILdapAuth = req.body.user;
    const userId: string =  user.uid;
    try {
      // Retrieve the request body data
      const httpData:INotificationsSetting= req.body;
  
      const notisetting:INotificationsSetting = {
        _id: uuidv4(),
        userid:userId,
        entityname:httpData.entityname,
        notisettingstatus:httpData.notisettingstatus,
        email:httpData.email,
        enableReminder:httpData.enableReminder
      };
        const notisettingInstance = new NotificationSetting (notisetting)
      const validationError = notisettingInstance.validateSync();
        
      if (validationError) {
        res.status(400).json(validationError.message);
        return;
      }
        await dbconnect()
        await notisettingInstance.save();
        await dbclose()
      res.status(201).json(notisetting);
    } catch (error) {
      // Handle any errors that occur during the process
      next(error);
    }
  };

  export const getNotiSetting = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const notisetting = await NotificationSetting.findById({_id:id});
      if (!notisetting) {
        throw new Error("Notisetting not found");
      }
      res.status(200).json(notisetting);
    } catch (error:any) {
      // Handle any errors that occur during the process
      next(error.message);
    }
  };
  
  export const getNotiSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Retrieve all documents
      const notisettings = await NotificationSetting.find();
      res.status(200).json(notisettings);
    } catch (error) {
      next(error);
    }
  };
  
  
  export const updatedNotisetting = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { userid, entityname, notisettingstatus, email, enableReminder } = req.body;
      const updatedNotisetting = await NotificationSetting.findByIdAndUpdate(
        {_id:id},
        {
          userid,
          entityname,
          notisettingstatus,
          email,
          enableReminder,
        },
        { new: true }
      );
  
      if (!updatedNotisetting) {
        next(new Error("Notification setting not found"));
      }

      res.status(200).json(updatedNotisetting);
    } catch (error:any) {
      // Handle any errors that occur during the process
      next(error.message);
    }
  };
  
  export const patchNotiSetting = async (req: Request, res: Response, next: NextFunction) => { // to change this code not to lool like put
    try {
      const { id } = req.params;
      const { entityname, notisettingstatus, email, enableReminder } = req.body;
  
      const updatedNotisetting = await NotificationSetting.findByIdAndUpdate(
        {_id:id},
        {
          $set: {
            entityname,
            notisettingstatus,
            email,
            enableReminder,
          },
        },
        { new: true }
      );
  
      if (!updatedNotisetting) {
        next(new Error("Notification setting not found"));
      }
      res.status(200).json('nofication updated successful');
    } catch (error:any) {
      next(error.message);
    }
  };
  

  export const addEntityNametoNotisetting = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
  
      // Retrieve the entity name to be added from the request body once the user add the entitiy
      const { entityName } = req.body;
  
      // Find the document by ID
      const notisetting = await NotificationSetting.findById({_id:id});
      if (!notisetting) {
        throw new Error("Notisetting not found");
      }
      notisetting.entityname.push(entityName);
      await notisetting.save();
      res.status(200).json(notisetting);
    } catch (error:any) {
      next(error.message);
    }
  };
  
  export const deleteEntityNameToNotiSetting = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { entityName } = req.body;

      const notisetting = await NotificationSetting.findById({_id:id});

      if (!notisetting) {
        throw new Error("Notisetting not found");
      }
      notisetting.entityname = notisetting.entityname.filter((name: string) => name !== entityName);

      await notisetting.save();
  
      res.json(notisetting);
    } catch (error:any) {
      // Handle any errors that occur during the process
      next(error.message);
    }
  };
  