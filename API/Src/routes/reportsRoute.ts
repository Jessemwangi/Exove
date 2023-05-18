import express from 'express';
import { getReport, getReports, getuserTotal, postReports, summaryById, summaryByName } from '../controllers/reportsController.js';

export const reportsRoutes = express.Router()



reportsRoutes.get('/',getReports);
reportsRoutes.get('/:id',getReport);
reportsRoutes.post('/',postReports);
reportsRoutes.delete('/:id',);
reportsRoutes.get('/summary/:id', summaryById)
reportsRoutes.get('/name/:name', summaryByName)
reportsRoutes.get('/totals/all/:name',getuserTotal) // still needs more adjustedments