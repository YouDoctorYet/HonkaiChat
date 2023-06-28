const express = require("express");
const {
  getNotifications,
  createNotification,
} = require("../controllers/notificationControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createNotification);
router.route("/:userId").get(protect, getNotifications);

module.exports = router;
