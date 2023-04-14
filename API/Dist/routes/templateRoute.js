import express from 'express';
import { addTemplate, getTemplate } from '../controllers/templatesController.js';
export const templateRoute = express.Router();
templateRoute.get('/', getTemplate);
templateRoute.post('/', addTemplate);
//# sourceMappingURL=templateRoute.js.map