import express from 'express'
import { postEntity } from '../controllers/entityController.js'

export const entityRoute = express.Router()

entityRoute.get('/',)
entityRoute.post('/',postEntity)
entityRoute.put('/',)