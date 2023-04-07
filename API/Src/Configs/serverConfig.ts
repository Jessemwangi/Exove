import { ServerConfigs } from "../types.js";
import * as dotenv from 'dotenv';
dotenv.config();

export const serverConfig: ServerConfigs = {
    port: process.env.PORT ? parseInt(process.env.PORT)  : 3001,
    host:'localhost',
}