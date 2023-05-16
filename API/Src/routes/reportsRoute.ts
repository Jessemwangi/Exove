import express from 'express';
import { getReport, getReports, postReports } from '../controllers/reportsController.js';

export const reportsRoutes = express.Router()



reportsRoutes.get('/',getReports);
reportsRoutes.get('/:id',getReport);
reportsRoutes.post('/',postReports);
reportsRoutes.delete('/:id',);
reportsRoutes.put('/',);
reportsRoutes.patch('/',);