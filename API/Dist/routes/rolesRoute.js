import express from 'express';
import { createRole, getRoles } from '../controllers/rolesController.js';
export const rolesRoutes = express.Router();
rolesRoutes.get('/', getRoles);
rolesRoutes.get('/:id');
rolesRoutes.post('/', createRole);
rolesRoutes.delete('/:id');
rolesRoutes.put('/');
rolesRoutes.patch('/');
//# sourceMappingURL=rolesRoute.js.map