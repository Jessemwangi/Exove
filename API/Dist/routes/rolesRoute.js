import express from 'express';
import { getRoles } from '../controllers/rolesController.js';
export const rolesRoutes = express.Router();
rolesRoutes.get('/', getRoles);
rolesRoutes.get('/:id');
rolesRoutes.post('/');
rolesRoutes.delete('/:id');
rolesRoutes.put('/');
rolesRoutes.patch('/');
//# sourceMappingURL=rolesRoute.js.map