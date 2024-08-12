const { NotificationModule } = require("../model/notificationModel");




// const getNotifications = async (req, res) => {
//     try {
//         const notifications = await NotificationModule.find({ userId: req.user.userId });
//         res.json(notifications);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

const getNotifications = async (req, res) => {
    try {
        let notifications;
        if (req.user.role === 'Admin') {
            // Admin sees all notifications
            notifications = await NotificationModule.find({});
        } else {
            // Employees see only their notifications
            notifications = await NotificationModule.find({ userId: req.user.userId });
        }

        // Debug: Log the notifications fetched
        console.log(`Fetched Notifications for ${req.user.role}:`, notifications);

        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};





const markAsRead = async(req,res)=>{
    const notificationId = req.params.id;

    try {
        const notification = await NotificationModule.findByIdAndUpdate(notificationId, {read: true} , {new: true});
        res.json(notification)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {getNotifications , markAsRead}