import express from 'express';
import { addFeedBack, getFeed, getFeeds, getUserFeedReq, submitFeedBack } from '../controllers/feedBackController.js';
export const feedsRoutes = express.Router()



feedsRoutes.get('/', getFeeds);
feedsRoutes.get('/:id', getFeed);
feedsRoutes.get('/name/:name',getUserFeedReq);
feedsRoutes.post('/:id',addFeedBack); //id will be requestpick id
feedsRoutes.delete('/:id',);
feedsRoutes.put('/',);
feedsRoutes.patch('/submit/:id',submitFeedBack);