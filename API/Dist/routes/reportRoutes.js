import express from 'express';
import { getReports } from '../controllers/reportsController.js';
export const reportRoutes = express.Router();
reportRoutes.get('/', getReports);
reportRoutes.get('/:id');
reportRoutes.post('/');
reportRoutes.delete('/:id');
reportRoutes.put('/');
reportRoutes.patch('/');
//# sourceMappingURL=reportRoutes.js.map