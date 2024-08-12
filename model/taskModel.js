const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'In Progress', 'Completed'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
},{
    versionKey : false
});

const TaskModule = mongoose.model("tasks",taskSchema)

module.exports = {TaskModule}