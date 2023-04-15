import express from 'express';
import { addTemplate, getTemplate, getTemplates, setDefaultTemplate } from '../controllers/templatesController.js';
export const templateRoute = express.Router()

templateRoute.get('/', getTemplates); //Get all templates
templateRoute.get('/active', getTemplate); // get current active template
templateRoute.post('/', addTemplate);
templateRoute.patch('/:id', setDefaultTemplate); // set template as default setting all other not default