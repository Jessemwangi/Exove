import express, { application } from "express";
import { serverConfig } from "./Configs/serverConfig.js";
import cookieParser from "cookie-parser";
import { questionRoute } from "./routes/questionRoute.js";
import { authRoutes } from "./routes/authRoutes.js";
import { feedsRoutes } from "./routes/feedBackRoute.js";
import { defaultRoutes } from "./routes/defaultRoute.js";
import { jesseRoutes } from "./routes/jesseRoute.js";
import { rolesRoutes } from "./routes/rolesRoute.js";
import { reqPicksRoutes } from "./routes/picksRoute.js";
import { reportsRoutes } from "./routes/reportsRoute.js";
import { approvalsRoutes } from "./routes/approvalsRoute.js";
import { categoryRoute } from "./routes/categoryRoute.js";
import { templateRoute } from "./routes/templateRoute.js";
import { errorMiddleware, ldapAuthMiddleware } from "./utilities/functions.js";
import { usersRoutes } from "./routes/usersRoutes.js";
import cors from "cors";

const app = express();

const allowedOrigins = [
    "http://localhost:3001",
    "https://exove.vercel.app",
    "http://localhost:3000",
    "http://localhost:3003",
    "https://exove-colleaguefeedback-client.vercel.app",
  ];
  
  const options: cors.CorsOptions = {
    origin: allowedOrigins,
    credentials: true,
  };
  
  app.use(cors(options));
app.use(express.json());
app.use(cookieParser());

const apiRouter = express.Router();
apiRouter.use(cors());
app.use(ldapAuthMiddleware); // authentication

// routes
apiRouter.use("/auth", authRoutes);
apiRouter.use("/", defaultRoutes);
apiRouter.use("/question", questionRoute);
apiRouter.use("/feedback", feedsRoutes);
apiRouter.use("/template", templateRoute);
apiRouter.use("/category", categoryRoute);
apiRouter.use("/picks", reqPicksRoutes);
apiRouter.use("/report", reportsRoutes);
apiRouter.use("/roles", rolesRoutes);
apiRouter.use("/jesse", jesseRoutes);
apiRouter.use("/users", usersRoutes);
apiRouter.use("/approval", approvalsRoutes);

//map all path to /api
app.use("/api", apiRouter);
//error handling
app.use(errorMiddleware);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(serverConfig.port, serverConfig.host, () =>
  console.log(
    `Colleague feedback Server app listening on port ${serverConfig.port}! and host ${serverConfig.host}!`
  )
);
