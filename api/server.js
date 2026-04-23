/**
 * server.js  —  Entry point
 *
 * Start:  npm run dev   (nodemon)
 *         npm start     (production)
 *
 * Requires the smart contract to be deployed first:
 *   cd ../smart-contracts
 *   npx hardhat run scripts/deploy.js --network localhost
 *   → copy printed address to CONTRACT_ADDRESS in api/.env
 */

require("dotenv").config();

const express        = require("express");
const cors           = require("cors");
const morgan         = require("morgan");
const evidenceRoutes = require("./routes/evidence");
const errorHandler   = require("./middleware/errorHandler");
const blockchain     = require("./services/blockchainService");

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// ── Health check ───────────────────────────────────────────────────────────
app.get("/health", (_req, res) =>
  res.json({ status: "ok", timestamp: new Date().toISOString() })
);

// ── API Routes ─────────────────────────────────────────────────────────────
app.use("/api/evidence", evidenceRoutes);

// ── 404 ────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: "Route not found." }));

// ── Central error handler (must be last) ──────────────────────────────────
app.use(errorHandler);

// ── Start ──────────────────────────────────────────────────────────────────
function start() {
  try {
    blockchain.init(); // connects provider + signer + contract

    app.listen(PORT, () => {
      console.log(`\n🚀  IEEE Evidence API  →  http://localhost:${PORT}`);
      console.log("─".repeat(50));
      console.log("  POST   /api/evidence/register");
      console.log("  GET    /api/evidence/:id");
      console.log("  POST   /api/evidence/:id/transfer");
      console.log("  POST   /api/evidence/:id/verify");
      console.log("  GET    /health");
      console.log("─".repeat(50) + "\n");
    });
  } catch (err) {
    console.error("❌  Startup failed:", err.message);
    process.exit(1);
  }
}

start();

// Export for supertest (tests import app directly)
module.exports = app;
