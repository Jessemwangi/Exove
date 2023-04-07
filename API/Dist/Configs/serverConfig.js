import * as dotenv from 'dotenv';
dotenv.config();
export const serverConfig = {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
    host: 'localhost',
};
//# sourceMappingURL=serverConfig.js.map