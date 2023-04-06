import express from 'express';
import { getEmployees } from '../controllers/employeeeController.js';
export const employeeRoutes = express.Router();
employeeRoutes.get('/', getEmployees);
employeeRoutes.get('/:id');
employeeRoutes.post('/');
employeeRoutes.delete('/:id');
employeeRoutes.put('/');
employeeRoutes.patch('/');
//# sourceMappingURL=employeeeRoute.js.map