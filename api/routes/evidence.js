const express = require("express");
const multer = require("multer");
const router = express.Router();
const controller = require("../controllers/evidenceController");

// Use memory storage to process buffers without saving to disk unnecessarily
const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", upload.single("file"), controller.register);
router.post("/:id/verify", upload.single("file"), controller.verify);

module.exports = router;