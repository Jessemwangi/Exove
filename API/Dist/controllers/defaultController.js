import { cookieExpiresIn } from "../Configs/serverConfig.js";
export const defaultGet = (req, res, next) => {
    return res.cookie('jesse', 'valtesting value for cookie', {
        expires: cookieExpiresIn,
        sameSite: "none",
        httpOnly: true,
        secure: true
    }).send('Thank for testing our app, hurray it works!!!');
};
//# sourceMappingURL=defaultController.js.map