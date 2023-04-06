import express from 'express';
import { getAuthRoutes } from '../controllers/authController.js';
export const authRoutes = express.Router();
authRoutes.get('/', getAuthRoutes);
authRoutes.get('/:id');
authRoutes.post('/');
authRoutes.delete('/:id');
authRoutes.put('/');
authRoutes.patch('/');
//# sourceMappingURL=authRoutes.js.map