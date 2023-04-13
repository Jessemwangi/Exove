import express, { Request, Response } from 'express';
import { serverConfig } from './Configs/serverConfig.js';
import cookieParser from 'cookie-parser';
import  {questionRoute}  from "./routes/questionRoute.js";
import { authRoutes } from './routes/authRoutes.js';
import { feedsRoutes } from './routes/feedBackRoute.js';
import { defaultRoutes } from './routes/defaultRoute.js';
import { jesseRoutes } from './routes/jesseRoute.js';
import { rolesRoutes } from './routes/rolesRoute.js';
import { reqPicksRoutes } from './routes/picksRoute.js';
import { reportsRoutes } from './routes/reportsRoute.js';
import { approvalsRoutes } from './routes/approvalsRoute.js';

const app = express()
app.use(express.json())
app.use(cookieParser())

const apiRouter = express.Router();

// Mount existing routers as sub-routers
apiRouter.use('/auth', authRoutes);
apiRouter.use('/', defaultRoutes);
apiRouter.use('/questions', questionRoute);
apiRouter.use('/feeds', feedsRoutes);
apiRouter.use('/picks', reqPicksRoutes);
apiRouter.use('/reports', reportsRoutes);
apiRouter.use('/roles', rolesRoutes);
apiRouter.use('/jesse', jesseRoutes);
apiRouter.use('/approvals',approvalsRoutes)

// Mount the apiRouter as a middleware
app.use('/api', apiRouter);




app.get('/', (req, res) => res.send('Hello World!'))
app.listen(serverConfig.port, serverConfig.host, () => console.log(`Collegue feedback Server app listening on port ${serverConfig.port}! and host ${serverConfig.host}!`))