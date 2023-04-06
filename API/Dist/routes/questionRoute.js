import express from 'express';
import { getQuestions } from '../controllers/questionController.js';
export const questionRoute = express.Router();
questionRoute.get('/', getQuestions);
questionRoute.get('/:id');
questionRoute.post('/');
questionRoute.delete('/:id');
questionRoute.put('/');
questionRoute.patch('/');
//# sourceMappingURL=questionRoute.js.map