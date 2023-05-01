import { Router } from "express"

import express from 'express';
import { getUser, getUserId, getUsers, postUser, putUser } from "../controllers/usersController.js";
export const usersRoutes = express.Router()


usersRoutes.post('/',postUser);
usersRoutes.get('/', getUsers);
usersRoutes.get('/:name', getUser);
 usersRoutes.get('/id/:id', getUserId);
usersRoutes.put('/:id', putUser);



