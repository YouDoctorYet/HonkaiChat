const Notification = require("../models/notificationModel");

const getNotifications = async (req, res) => {
  const notifications = await Notification.find({
    recipient: req.params.userId,
  })
    .populate("sender")
    .populate("chat");
  res.json(notifications);
};

module.exports = { getNotifications };
