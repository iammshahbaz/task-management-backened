const { NotificationModule } = require("../model/notificationModel");
const { TaskModule } = require("../model/taskModel");


const createTask = async(req,res)=>{
    const {title , description , assignedTo} = req.body;
    
    try {
        const task = new TaskModule({title,description,assignedTo})
        await task.save();

        const notification = new NotificationModule({
            taskId: task._id,
            userId: assignedTo,
            message: `New task assigned: ${title}`
        })
        await notification.save();

        const io = req.app.get('io');
        io.to(assignedTo.toString()).emit('taskAssigned',notification);

        res.status(201).json(task);

    } catch (error) {
        console.log(`error,${error}`)
        res.status(500).json({ message: err.message });
    }
}

const acceptTask = async(req,res)=>{
    const taskId = req.params.id;

    try {
        const task = await TaskModule.findByIdAndUpdate(taskId, {status: 'Accepted'},{new:true});

        const notification = new NotificationModule({
            taskId : task._id,
            userId: task.assignedTo,
            message : `Task accepted: ${task.title}`,
        })
        await notification.save();
        res.json(task);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const rejectTask = async (req, res) => {
    const taskId = req.params.id;

    try {
        const task = await TaskModule.findByIdAndUpdate(taskId, { status: 'Rejected' }, { new: true });

        const notification = new NotificationModule({
            taskId: task._id,
            userId: task.assignedTo,
            message: `Task rejected: ${task.title}`,
        });
        await notification.save();

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateTaskProgress = async (req, res) => {
    const taskId = req.params.id;
    const { status } = req.body;

    try {
        const task = await TaskModule.findByIdAndUpdate(taskId, { status }, { new: true });

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {createTask,acceptTask,rejectTask,updateTaskProgress}