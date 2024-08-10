const express = require("express");
const { auth } = require("../middleware/authmiddleware");
const { createTask, acceptTask, rejectTask, updateTaskProgress } = require("../controllers/taskController");


const taskRouter = express.Router();

taskRouter.post('/',auth,createTask)
taskRouter.patch('/:id/accept',auth,acceptTask)
taskRouter.patch('/:id/reject',auth,rejectTask)
taskRouter.patch('/:id/progress',auth,updateTaskProgress)

module.exports = {taskRouter}