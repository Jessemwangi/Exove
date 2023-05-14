import * as dotenv from 'dotenv';
dotenv.config();
export const securityKey = process.env.API_KEY;
const expireValue = parseInt(process.env.JWT_COOKIES_EXP);
const jwtCookiesExp = isNaN(expireValue) ? 10 : expireValue;
export const cookieExpiresIn = new Date(Date.now() + jwtCookiesExp * 24 * 60 * 60 * 1000);
export const frontEnd = process.env.FRONT_END;
export const cookieSecure = process.env.NODE_ENV === 'production' ? true : false;
export const serverConfig = {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
    host: 'localhost',
};
//# sourceMappingURL=serverConfig.js.map