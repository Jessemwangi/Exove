import express from 'express';
import { addQuestion, getQuestion, getQuestionId } from '../controllers/questionController.js';

export const questionRoute = express.Router()


questionRoute.post('/', addQuestion);
questionRoute.get('/', getQuestion);
questionRoute.get('/:id',getQuestionId);
questionRoute.delete('/:id',);
questionRoute.put('/',);
questionRoute.patch('/',);


