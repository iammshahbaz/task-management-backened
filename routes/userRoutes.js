const express = require("express");
const { registerUser, loginUser, getAllUsers, logoutUser } = require("../controllers/userController");

userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/",getAllUsers)
userRouter.post("/logout" , logoutUser)

module.exports = {userRouter}