export const getAuthRoutes = (req, res) => {
    res.status(200).json({ message: "this is authentication response" });
};
// const login = (req, res) => {
//     const q = "select * from users where username = ?";
//     const params = [req.body.username];
//     db.query(q,[params], (err,data) =>{
//       if (err) return res.status(500).json(err)
//       if (data.length === 0) return res.status(404).json('user not found');
//       // Checking for matching hashed passsword
//       const isValidPassword = bcrypt.compareSync(req.body.password, data[0].password);
//       if (!isValidPassword) return res.status(400).json('Wrong username or password');
//   const token = jwt.sign({id:data[0].id},"s3cr3t");
//   const {password,...other} = data[0];
//   res.cookie("access_token",token,{
//       httpOnly:true,
//       Secure:true,
//   }).status(200).json(other)
//     })
//   };
//# sourceMappingURL=authController.js.map