const express = require("express");
const { auth } = require("../middleware/authmiddleware");
const { createTask, acceptTask, rejectTask, updateTaskProgress, getTask, updateTask, deleteTask } = require("../controllers/taskController");


const taskRouter = express.Router();

taskRouter.post('/',auth,createTask)
taskRouter.get('/',auth,getTask)
taskRouter.patch('/:id/accept',auth,acceptTask)
taskRouter.patch('/:id/reject',auth,rejectTask)
taskRouter.patch('/:id/progress',auth,updateTaskProgress)
taskRouter.patch('/:id/update',auth,updateTask)
taskRouter.delete('/:id',auth,deleteTask)

module.exports = {taskRouter}