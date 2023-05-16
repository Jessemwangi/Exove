import { ServerConfigs } from "../types.js";
import * as dotenv from 'dotenv';
dotenv.config();

export const securityKey: string = process.env.API_KEY!
const expireValue = parseInt(process.env.JWT_COOKIES_EXP!);

const jwtCookiesExp = isNaN(expireValue) ? 10 : expireValue
export const cookieExpiresIn: Date = new Date(Date.now() + jwtCookiesExp * 24 * 60 * 60 * 1000);

 export const frontEnd:string = process.env.FRONT_END!

export const cookieSecure:boolean = process.env.NODE_ENV ==='production' ? true : false

export const serverConfig: ServerConfigs = {
    port: process.env.PORT ? parseInt(process.env.PORT)  : 3001,
    host:'localhost',
}

export const unAuthorize: string = 'Apologies, but you are not authorized to perform this transaction. Please contact support for assistance.'

export const savedSuccess = (transaction:string) => {
    return `Success! New ${transaction} has been saved successfully.`
}
export const updateSuccess = (transaction:string) => {
    return `Success! New ${transaction} has been updated successfully.`
}
export const failedToSave = 'Oops! We encountered an issue while trying to save your data. Please try again later or contact support for further assistance.'
