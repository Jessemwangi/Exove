import express from 'express';
import { addTemplate, getTemplate, getTemplates, setDefaultTemplate } from '../controllers/templatesController.js';
export const templateRoute = express.Router();
templateRoute.get('/', getTemplates);
templateRoute.get('/active', getTemplate);
templateRoute.post('/', addTemplate);
templateRoute.patch('/:id', setDefaultTemplate);
//# sourceMappingURL=templateRoute.js.map