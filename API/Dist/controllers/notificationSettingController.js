'use strict';
import { NotificationSetting } from "../dbcontext/dbContext.js";
import { v4 as uuidv4 } from "uuid";
import { dbclose, dbconnect } from "../Configs/dbConnect.js";
export const postNotiSetting = async (req, res, next) => {
    const user = req.body.user;
    const userId = user.uid;
    try {
        const httpData = req.body;
        const notisetting = {
            _id: uuidv4(),
            userid: userId,
            entityname: httpData.entityname,
            notisettingstatus: httpData.notisettingstatus,
            email: httpData.email,
            enableReminder: httpData.enableReminder
        };
        const notisettingInstance = new NotificationSetting(notisetting);
        const validationError = notisettingInstance.validateSync();
        if (validationError) {
            res.status(400).json(validationError.message);
            return;
        }
        await dbconnect();
        await notisettingInstance.save();
        await dbclose();
        res.status(201).json(notisetting);
    }
    catch (error) {
        next(error);
    }
};
export const getNotiSetting = async (req, res, next) => {
    try {
        const { id } = req.params;
        const notisetting = await NotificationSetting.findById({ _id: id });
        if (!notisetting) {
            throw new Error("Notisetting not found");
        }
        res.status(200).json(notisetting);
    }
    catch (error) {
        next(error.message);
    }
};
export const getNotiSettings = async (req, res, next) => {
    try {
        const notisettings = await NotificationSetting.find();
        res.status(200).json(notisettings);
    }
    catch (error) {
        next(error);
    }
};
export const updatedNotisetting = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userid, entityname, notisettingstatus, email, enableReminder } = req.body;
        const updatedNotisetting = await NotificationSetting.findByIdAndUpdate({ _id: id }, {
            userid,
            entityname,
            notisettingstatus,
            email,
            enableReminder,
        }, { new: true });
        if (!updatedNotisetting) {
            next(new Error("Notification setting not found"));
        }
        res.status(200).json(updatedNotisetting);
    }
    catch (error) {
        next(error.message);
    }
};
export const patchNotiSetting = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { entityname, notisettingstatus, email, enableReminder } = req.body;
        const updatedNotisetting = await NotificationSetting.findByIdAndUpdate({ _id: id }, {
            $set: {
                entityname,
                notisettingstatus,
                email,
                enableReminder,
            },
        }, { new: true });
        if (!updatedNotisetting) {
            next(new Error("Notification setting not found"));
        }
        res.status(200).json('nofication updated successful');
    }
    catch (error) {
        next(error.message);
    }
};
//# sourceMappingURL=notificationSettingController.js.map