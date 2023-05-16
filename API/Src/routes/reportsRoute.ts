import express from 'express';
import { getReport, getReports, getuserTotal, postReports, summaryById } from '../controllers/reportsController.js';

export const reportsRoutes = express.Router()



reportsRoutes.get('/',getReports);
reportsRoutes.get('/:id',getReport);
reportsRoutes.post('/',postReports);
reportsRoutes.delete('/:id',);
reportsRoutes.get('/summary/:id', summaryById)
reportsRoutes.get('/totals/all/:name',getuserTotal)