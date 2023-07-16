const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

router.get("/", (req, res) => {
  const backgroundDir = path.join(__dirname, "../backgrounds");
  fs.readdir(backgroundDir, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Error reading backgrounds directory" });
    } else {
      res.json(files);
    }
  });
});

router.get("/:name", (req, res) => {
  const filePath = path.join(__dirname, "../backgrounds/", req.params.name);
  res.sendFile(filePath);
});

module.exports = router;
