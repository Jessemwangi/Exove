import express from 'express'
import { getEntities, postEntity } from '../controllers/entityController.js'

export const entityRoute = express.Router()

entityRoute.get('/',getEntities)
entityRoute.post('/:id?',postEntity)
entityRoute.put('/',)