import express, { Request, Response } from 'express';
import { serverConfig } from './Configs/serverConfig.js';
import cookieParser from 'cookie-parser';
import  {questionRoute}  from "./routes/questionRoute.js";
import { authRoutes } from './routes/authRoutes.js';
import { reportRoutes } from './routes/reportRoutes.js';
import { feedsRoutes } from './routes/feedBackRoute.js';
import { employeeRoutes } from './routes/employeeeRoute.js';
import { defaultRoutes } from './routes/defaultRoute.js';
import mongoose from 'mongoose';
import { usersSchema } from './models/usersModel.js';

const app = express()
app.use(express.json())
app.use(cookieParser())

const apiRouter = express.Router();

// Mount existing routers as sub-routers
apiRouter.use('/questions', questionRoute);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/feeds', feedsRoutes);
apiRouter.use('/reports', reportRoutes);
apiRouter.use('/employee', employeeRoutes);
apiRouter.use('/approvals', feedsRoutes);
apiRouter.use('/', defaultRoutes);

// Mount the apiRouter as a middleware
app.use('/api', apiRouter);

const Users = mongoose.model('Users', usersSchema);


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(serverConfig.port, serverConfig.host, () => console.log(`Collegue feedback Server app listening on port ${serverConfig.port}! and host ${serverConfig.host}!`))