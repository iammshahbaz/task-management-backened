const { NotificationModule } = require("../model/notificationModel");




const getNotifications = async (req, res) => {
    try {
        const notifications = await NotificationModule.find({ userId: req.user._id });
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