export const getAuthRoutes = (req, res) => {
    const token = req.cookies.access_token;
    console.log(token);
    return res.status(200).json({ message: "this is authentication response" });
};
//# sourceMappingURL=authController.js.map