import express from 'express'
import { getNotification, getNotifications, postNotification } from '../controllers/notificationController.js';
export const notificationRoute = express.Router()

notificationRoute.post('/', postNotification);
notificationRoute.get('/',getNotifications)
notificationRoute.get('/:id',getNotification);
