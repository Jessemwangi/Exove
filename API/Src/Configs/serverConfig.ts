import { ServerConfigs } from "../types.js";

export const serverConfig: ServerConfigs = {
    port: process.env.PORT ? parseInt(process.env.PORT)  : 3001,
    host:'localhost',
}