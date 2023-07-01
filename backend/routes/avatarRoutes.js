const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

router.get("/", (req, res) => {
  const avatarsDir = path.join(__dirname, "../avatars");
  fs.readdir(avatarsDir, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error reading avatars directory" });
    } else {
      res.json(files);
    }
  });
});

router.get("/:name", (req, res) => {
  const filePath = path.join(__dirname, "../avatars/", req.params.name);
  res.sendFile(filePath);
});

module.exports = router;
