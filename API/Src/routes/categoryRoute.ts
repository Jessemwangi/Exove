import express from 'express';
import { addCategory, getCategory } from '../controllers/categoryController.js';
export const categoryRoute = express.Router()

categoryRoute.get('/',getCategory);
categoryRoute.post('/',addCategory);