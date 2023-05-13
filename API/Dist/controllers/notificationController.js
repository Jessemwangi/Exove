import { v4 as uuidv4 } from "uuid";
import { Notifer } from '../dbcontext/dbContext.js';
export const postNotificaation = async (req, res, next) => {
    const httpData = req.body;
    if (!httpData)
        next(new Error("body cannot be empty"));
    try {
        const newNotification = {
            _id: uuidv4(),
            applicationid: httpData.applicationid,
            entityname: httpData.entityname,
            message: httpData.message,
            link: httpData.link,
            from: httpData.from,
            to: httpData.to,
            notifierstatus: httpData.notifierstatus,
            sendOn: httpData.sendOn,
            transacteOn: httpData.transacteOn
        };
        const notification = await new Notifer(newNotification).save();
        if (notification) {
            res.status(200).json('saved, you can view notifivation in https://exove.vercel.app/api/notify');
            return;
        }
    }
    catch (error) {
        next(error.message);
    }
};
export const getNotification = (req, res, next) => {
};
//# sourceMappingURL=notificationController.js.map