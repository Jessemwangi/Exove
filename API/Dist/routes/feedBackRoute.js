import express from 'express';
import { addFeedBack, getFeeds, getUserFeedReq, getUserTotalAnsFeed, submitFeedBack } from '../controllers/feedBackController.js';
export const feedsRoutes = express.Router();
feedsRoutes.get('/', getFeeds);
feedsRoutes.get('/:id');
feedsRoutes.get('name/:name', getUserFeedReq);
feedsRoutes.get('feed/:name', getUserTotalAnsFeed);
feedsRoutes.post('/:id', addFeedBack);
feedsRoutes.delete('/:id');
feedsRoutes.put('/');
feedsRoutes.patch('/submit/:id', submitFeedBack);
//# sourceMappingURL=feedBackRoute.js.map