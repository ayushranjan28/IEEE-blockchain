const express = require("express");
const router = express.Router();
const controller = require("../controllers/evidenceController");

router.post("/register", controller.register);

module.exports = router;