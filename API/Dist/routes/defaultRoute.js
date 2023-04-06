import express from 'express';
import { defaultGet } from '../controllers/defaultController.js';
import { testDb, testDb2 } from '../controllers/testConnection.js';
export const defaultRoutes = express.Router();
defaultRoutes.get('/', defaultGet);
defaultRoutes.get('/testdb', testDb);
defaultRoutes.get('/test2', testDb2);
//# sourceMappingURL=defaultRoute.js.map