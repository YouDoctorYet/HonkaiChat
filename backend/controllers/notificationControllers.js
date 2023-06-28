const asyncHandler = require("express-async-handler");
const Notification = require("../models/notificationModel");

const getNotifications = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.params.userId,
    })
      .populate("sender")
      .populate("chat");
    res.json(notifications);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createNotification = asyncHandler(async (req, res) => {
  const { sender, recipient, chat } = req.body;

  const newNotification = new Notification({
    sender,
    recipient,
    chat,
  });

  await newNotification.save();

  res.status(201).json({
    message: "Notification created successfully",
    notification: newNotification,
  });
});

module.exports = { getNotifications, createNotification };
