import express from 'express';
import { defaultGet } from '../controllers/defaultController.js';
export const defaultRoutes = express.Router();
defaultRoutes.get('/', defaultGet);
//# sourceMappingURL=defaultRoute.js.map