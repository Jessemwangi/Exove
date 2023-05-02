import * as dotenv from 'dotenv';
dotenv.config();
export const securityKey = process.env.API_KEY;
export const cookieExpiresIn = new Date(Date.now() + parseInt(process.env.JWT_COOKIES_EXP) * 24 * 60 * 60 * 1000);
export const cookieSecure = process.env.NODE_ENV === 'production' ? true : false;
export const serverConfig = {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
    host: 'localhost',
};
//# sourceMappingURL=serverConfig.js.map