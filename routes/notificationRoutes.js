const express = require("express");
const { auth } = require("../middleware/authmiddleware");
const { getNotifications, markAsRead } = require("../controllers/notificationController");

const notificationRouter = express.Router();

notificationRouter.get("/",auth,getNotifications)
notificationRouter.patch("/:id/read",auth, markAsRead);

module.exports = {notificationRouter}