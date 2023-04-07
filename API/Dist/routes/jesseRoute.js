import express from 'express';
import { jesseGet, jesseInsert } from '../controllers/jesseController.js';
export const jesseRoutes = express.Router();
jesseRoutes.get('/', jesseGet);
jesseRoutes.post('/', jesseInsert);
//# sourceMappingURL=jesseRoute.js.map