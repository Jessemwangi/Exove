import { Router } from "express"

import express from 'express';
import { getUser, getUsers, postUser } from "../controllers/usersController.js";
export const usersRoutes = express.Router()


usersRoutes.post('/',postUser);
usersRoutes.get('/', getUsers);
usersRoutes.get('/:name', getUser);
usersRoutes.get('/:id',getUsers);