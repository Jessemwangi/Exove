export const defaultGet = (req, res, next) => {
    return res.cookie('jesse', 'valtesting value for cookie', {
        sameSite: "none",
        httpOnly: true,
        secure: true
    }).send('Thank for testing our app, hurray it works!!!');
};
//# sourceMappingURL=defaultController.js.map