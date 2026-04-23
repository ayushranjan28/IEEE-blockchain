/**
 * middleware/errorHandler.js
 *
 * Catches anything passed to next(err) in controllers and
 * returns a consistent JSON error response.
 */

function errorHandler(err, req, res, _next) {
  console.error(`[${new Date().toISOString()}] ❌  ${err.message}`);

  // Ethers.js transaction revert (e.g. onlyCustodian, invalid hash)
  if (err.code === "CALL_EXCEPTION" || err.code === "ACTION_REJECTED") {
    return res.status(400).json({
      error:   "Blockchain transaction failed.",
      details: err.reason || err.message,
    });
  }

  // Invalid Ethereum address
  if (err.message && err.message.includes("Invalid Ethereum address")) {
    return res.status(400).json({ error: err.message });
  }

  // Pinata / IPFS upstream error
  if (err.response?.data) {
    return res.status(502).json({
      error:   "IPFS upload failed.",
      details: err.response.data,
    });
  }

  // Multer file size exceeded
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "File too large. Maximum size is 20 MB." });
  }

  return res.status(500).json({
    error:   "Internal server error.",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
}

module.exports = errorHandler;
