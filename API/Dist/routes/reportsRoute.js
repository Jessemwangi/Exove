import express from 'express';
import { getReports, postReports } from '../controllers/reportsController.js';
export const reportsRoutes = express.Router();
reportsRoutes.get('/');
reportsRoutes.get('/:id', getReports);
reportsRoutes.post('/', postReports);
reportsRoutes.delete('/:id');
reportsRoutes.put('/');
reportsRoutes.patch('/');
//# sourceMappingURL=reportsRoute.js.map