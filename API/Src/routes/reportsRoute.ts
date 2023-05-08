import express from 'express';
import { postReports } from '../controllers/reportsController.js';

export const reportsRoutes = express.Router()



reportsRoutes.get('/',);
reportsRoutes.get('/:id',);
reportsRoutes.post('/',postReports);
reportsRoutes.delete('/:id',);
reportsRoutes.put('/',);
reportsRoutes.patch('/',);