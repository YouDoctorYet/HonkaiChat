const express = require("express");
const { getNotifications } = require("../controllers/notificationControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:userId").get(protect, getNotifications);

module.exports = router;
