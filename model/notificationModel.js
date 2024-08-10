const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
},{
    versionKey : false
});

const NotificationModule = mongoose.model("notification" , NotificationSchema)


module.exports = {NotificationModule}