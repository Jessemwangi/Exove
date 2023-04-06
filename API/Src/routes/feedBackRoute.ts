import express from 'express';
import { getFeeds } from '../controllers/feedBackController.js';
export const feedsRoutes = express.Router()



feedsRoutes.get('/', getFeeds);
feedsRoutes.get('/:id',);
feedsRoutes.post('/',);
feedsRoutes.delete('/:id',);
feedsRoutes.put('/',);
feedsRoutes.patch('/',);