import { v4 as uuidv4 } from "uuid";
import { Entity, Notifer } from '../dbcontext/dbContext.js';
import { dbclose, dbconnect } from '../Configs/dbConnect.js';
export const postNotification = async (req, res, next) => {
    const httpData = req.body;
    const user = req.body.user;
    const userId = user.uid;
    try {
        const newNotification = {
            _id: uuidv4(),
            applicationid: httpData.applicationid,
            entityname: httpData.entityname,
            messageBody: httpData.messageBody,
            link: httpData.link,
            from: httpData.from,
            to: httpData.to,
            notifierstatus: httpData.notifierstatus,
            sendOn: httpData.sendOn,
            createdBy: userId
        };
        const notiInstance = new new Notifer(newNotification);
        const validationError = notiInstance.validateSync();
        if (validationError) {
            res.status(400).json(validationError.message);
            return;
        }
        const notification = await notiInstance.save();
        if (notification) {
            res.status(200).json('saved, you can view notifivation in https://exove.vercel.app/api/notify');
            return;
        }
    }
    catch (error) {
        next(error.message);
    }
};
export const getNotifications = async (req, res, next) => {
    let allNotifications = [];
    try {
        await dbconnect();
        const allModelName = await Entity.find({}).select('_id name').exec();
        for (const entity of allModelName) {
            const notifications = await Notifer.find({ 'entityname': entity.name })
                .populate({
                path: 'applicationid',
                model: entity.name,
                select: '-__v'
            });
            allNotifications = allNotifications.concat(notifications);
        }
        await dbclose();
        res.status(200).json(allNotifications);
    }
    catch (error) {
        next(error.message);
    }
};
export const getNotification = async (req, res, next) => {
    const notificationId = req.params.id;
    if (!notificationId)
        next(new Error("body cannot be empty"));
    try {
        await dbconnect();
        const entityName = await Notifer.findOne({ '_id': notificationId }).select('entityname');
        const notification = await Notifer.findOne({ '_id': notificationId })
            .populate({
            path: 'applicationid',
            model: entityName.entityname,
            select: '-__v'
        });
        await dbclose();
        res.status(200).json(notification);
    }
    catch (error) {
        next(error.message);
    }
};
//# sourceMappingURL=notificationController.js.map