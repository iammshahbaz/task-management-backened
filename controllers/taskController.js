const { NotificationModule } = require("../model/notificationModel");
const { TaskModule } = require("../model/taskModel");


const createTask = async (req, res) => {
    const { title, description, assignedTo } = req.body;

    try {
        const task = new TaskModule({ title, description, assignedTo })
        await task.save();

        const notification = new NotificationModule({
            taskId: task._id,
            userId: assignedTo,
            message: `New task assigned: ${title}`
        })
        await notification.save();

        const io = req.app.get('io');
        io.to(assignedTo.toString()).emit('taskAssigned', notification);

        // io.to(assignedTo.toString()).emit('taskAssigned', {
        //     message: `New task assigned: ${title}`,
        //     taskId: task._id,
        //     title,
        //     description
        // });

        res.status(201).json(task);

    } catch (error) {
        console.log(`error,${error}`)
        res.status(500).json({ message: error.message });
    }
}


const getTask = async (req, res) => {
    try {
        const { sort, search, status } = req.query;
        let sortCriteria = {};

        // Handle sorting
        if (sort) {
            const [field, order] = sort.split(':');
            sortCriteria[field] = order === 'desc' ? -1 : 1;
        }


        let query = {};

        if (status) {
            query.status = status;
        }

        // Apply search filter
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { title: searchRegex },
                { status: searchRegex },
                { description: searchRegex },
                { 'assignedTo.name': searchRegex }
            ];
        }


        const userId = req.user.userId;
        const userRole = req.user.role;


        if (userRole !== 'Admin') {
            query.assignedTo = userId;
        }

        console.log(`Fetching tasks for user ID: ${userId} with filters:`, query);


        let tasks = await TaskModule.find(query)
            .populate('assignedTo', 'name')
            .sort(sortCriteria);

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




const acceptTask = async (req, res) => {
    const taskId = req.params.id;

    try {
        const task = await TaskModule.findByIdAndUpdate(taskId, { status: 'Accepted' }, { new: true });

        const notification = new NotificationModule({
            taskId: task._id,
            userId: task.assignedTo,
            message: `Task accepted: ${task.title}`,
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
const updateTask = async (req, res) => {
    const { id } = req.params;
    const userRole = req.user.role;

    if (userRole !== 'Admin') {
        return res.status(403).send({ error: 'You do not have permission to update tasks.' });
    }
    try {
        const task = await TaskModule.findByIdAndUpdate(id, req.body, { new: true });

        if (!task) {
            return res.status(404).send({ error: 'Task not found' });
        }
        res.send(task);

    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

//delete 
const deleteTask = async (req, res) => {
    const { id } = req.params;
    const userRole = req.user.role;

    if (userRole !== 'Admin') {
        return res.status(403).send({ error: 'You do not have permission to delete tasks.' });
    }
    try {
        const task = await TaskModule.findByIdAndDelete(id);
        if (!task) return res.status(404).send({ error: 'Task not found' });
        res.send({ msg: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

module.exports = { createTask, acceptTask, rejectTask, updateTaskProgress, getTask ,updateTask ,deleteTask }