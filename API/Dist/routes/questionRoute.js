import express from 'express';
import { addQuestion, getQuestion } from '../controllers/questionController.js';
export const questionRoute = express.Router();
questionRoute.post('/', addQuestion);
questionRoute.get('/', getQuestion);
questionRoute.get('/:id');
questionRoute.delete('/:id');
questionRoute.put('/');
questionRoute.patch('/');
//# sourceMappingURL=questionRoute.js.map