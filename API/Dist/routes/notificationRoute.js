import express from 'express';
import { getNotification, postNotificaation } from '../controllers/notificationController.js';
export const notificationRoute = express.Router();
notificationRoute.get('/', getNotification);
notificationRoute.post('/', postNotificaation);
//# sourceMappingURL=notificationRoute.js.map