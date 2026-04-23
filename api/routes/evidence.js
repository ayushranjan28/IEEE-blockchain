/**
 * routes/evidence.js
 *
 * All /api/evidence/* routes.
 * Multer is scoped to this router — memory storage, 20 MB limit.
 */

const express    = require("express");
const multer     = require("multer");
const controller = require("../controllers/evidenceController");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (_req, file, cb) => {
    // Accept PDF, images, and common forensic report formats
    const ALLOWED = /pdf|jpeg|jpg|png|csv|txt|xml/i;
    cb(null, ALLOWED.test(file.mimetype) || ALLOWED.test(file.originalname));
  },
});

// POST   /api/evidence/register    — upload + hash + IPFS + blockchain
router.post("/register",        upload.single("file"), controller.registerEvidence);

// GET    /api/evidence/:id         — read on-chain record (view call)
router.get( "/:id",                                    controller.getEvidence);

// POST   /api/evidence/:id/transfer — transfer custody (signed tx)
router.post("/:id/transfer",                           controller.transferCustody);

// POST   /api/evidence/:id/verify  — re-hash uploaded file vs on-chain
router.post("/:id/verify",      upload.single("file"), controller.verifyEvidence);

module.exports = router;
