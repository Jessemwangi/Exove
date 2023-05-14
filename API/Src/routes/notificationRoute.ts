import express from 'express'
import { getNotification, postNotification } from '../controllers/notificationController.js';
export const notificationRoute = express.Router()

notificationRoute.post('/', postNotification);
notificationRoute.get('/',getNotification)
notificationRoute.get('/:id',getNotification);
