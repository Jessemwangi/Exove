import express from 'express';
import { addTemplate, getTemplate } from '../controllers/templatesController.js';
const templateRoute = express.Router();
templateRoute.get('/');
templateRoute.get('/tmpt', getTemplate);
templateRoute.post('/tmpt', addTemplate);
//# sourceMappingURL=templateRoute.js.map