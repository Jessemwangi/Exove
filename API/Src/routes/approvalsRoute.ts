import express from 'express';
import { getApps } from '../controllers/approvalsController.js';
export const approvalsRoutes = express.Router()

approvalsRoutes.get('/', getApps);