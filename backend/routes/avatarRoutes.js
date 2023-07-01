const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/:name", (req, res) => {
  const filePath = path.join(__dirname, "../avatars/", req.params.name);
  console.log("File path:", filePath);
  res.sendFile(filePath);
});

module.exports = router;
