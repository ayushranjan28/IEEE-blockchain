/**
 * controllers/evidenceController.js
 *
 * Orchestrates the three services for each API endpoint.
 *
 * Full flow for registration:
 *   Frontend (multipart) → hashFile → uploadIPFS → registerOnChain → respond
 */

const blockchain = require("../services/blockchainService");
const ipfs       = require("../services/ipfsService");
const hash       = require("../services/hashService");

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/evidence/register
//
// Multipart form fields:
//   file         (required) — the forensic report / lab result
//   location     (required) — crime scene location
//   investigator (required) — investigator name or badge number
//   sampleType   (optional) — e.g. "GC-MS", "Raman spectroscopy"
//   notes        (optional)
//
// Steps:
//   1. Compute SHA-256 hash of file  → bytes32 for contract
//   2. Upload file to IPFS via Pinata → CID (metadataCid for contract)
//   3. Call EvidenceManager.registerEvidence(hash, CID)
//   4. Return evidenceId + txHash + CID
// ─────────────────────────────────────────────────────────────────────────────
async function registerEvidence(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "A file upload is required." });
    }

    const { location, investigator, sampleType = "", notes = "" } = req.body;

    if (!location || !investigator) {
      return res
        .status(400)
        .json({ error: "Fields 'location' and 'investigator' are required." });
    }

    // 1. Hash the file — produces bytes32-compatible hex
    const fileHashHex = hash.hashBuffer(req.file.buffer);

    // 2. Upload to IPFS
    //    keyvalues stored as Pinata metadata for dashboard search
    const keyvalues = {
      location,
      investigator,
      sampleType,
      notes,
      originalName: req.file.originalname,
      uploadedAt:   new Date().toISOString(),
    };
    const cid = await ipfs.uploadFile(
      req.file.buffer,
      req.file.originalname,
      keyvalues
    );

    // 3. Register on blockchain
    //    Contract: registerEvidence(bytes32 _fileHash, string _metadataCid)
    //    Reverts if _fileHash == bytes32(0) — impossible here for valid files
    const { evidenceId, txHash, blockNumber } =
      await blockchain.registerEvidence(fileHashHex, cid);

    return res.status(201).json({
      message:     "Evidence registered successfully on blockchain.",
      evidenceId,              // auto-assigned by nextEvidenceId counter
      fileHash:    fileHashHex,
      ipfsCid:     cid,
      ipfsGateway: ipfs.gatewayUrl(cid),
      txHash,
      blockNumber,
      metadata:    keyvalues,
    });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/evidence/:id
//
// Reads evidenceRegistry[id] from the blockchain.
// No wallet signing needed — this is a view call.
// ─────────────────────────────────────────────────────────────────────────────
async function getEvidence(req, res, next) {
  try {
    const evidenceId = req.params.id;
    const details    = await blockchain.getEvidenceDetails(evidenceId);

    // currentCustodian == address(0) means the ID was never registered
    if (details.currentCustodian === "0x0000000000000000000000000000000000000000") {
      return res.status(404).json({ error: `Evidence ID ${evidenceId} not found.` });
    }

    return res.status(200).json({
      evidenceId,
      fileHash:         details.fileHash,
      ipfsCid:          details.metadataCid,
      ipfsGateway:      ipfs.gatewayUrl(details.metadataCid),
      currentCustodian: details.currentCustodian,
      registeredAt:     new Date(details.registrationTimestamp * 1000).toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/evidence/:id/transfer
//
// JSON body: { "newCustodian": "0x..." }
//
// Contract modifier: onlyCustodian
//   → reverts (403) if the signing wallet isn't the current custodian
// ─────────────────────────────────────────────────────────────────────────────
async function transferCustody(req, res, next) {
  try {
    const evidenceId     = req.params.id;
    const { newCustodian } = req.body;

    if (!newCustodian) {
      return res.status(400).json({ error: "'newCustodian' is required." });
    }

    const { txHash, blockNumber } =
      await blockchain.transferCustody(evidenceId, newCustodian);

    return res.status(200).json({
      message:      "Custody transferred successfully.",
      evidenceId,
      newCustodian,
      txHash,
      blockNumber,
    });
  } catch (err) {
    // onlyCustodian modifier revert
    if (
      err.code === "CALL_EXCEPTION" ||
      (err.message && err.message.toLowerCase().includes("revert"))
    ) {
      return res.status(403).json({
        error:
          "Transfer rejected by smart contract. " +
          "Only the current custodian can transfer this evidence.",
      });
    }
    next(err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/evidence/:id/verify
//
// Multipart form: { file }
//
// Re-hashes the uploaded file and compares with the bytes32 stored on-chain.
// Returns { verified: true } if they match — meaning the file is INTACT.
// ─────────────────────────────────────────────────────────────────────────────
async function verifyEvidence(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "A file is required for verification." });
    }

    const evidenceId = req.params.id;
    const details    = await blockchain.getEvidenceDetails(evidenceId);

    if (details.currentCustodian === "0x0000000000000000000000000000000000000000") {
      return res.status(404).json({ error: `Evidence ID ${evidenceId} not found.` });
    }

    const computedHash = hash.hashBuffer(req.file.buffer);
    const verified     = hash.verifyIntegrity(req.file.buffer, details.fileHash);

    return res.status(200).json({
      evidenceId,
      verified,
      verdict: verified
        ? "✅ INTACT — file matches the on-chain record."
        : "❌ TAMPERED — hash mismatch. File does not match blockchain record.",
      computedHash,
      storedHash:       details.fileHash,
      currentCustodian: details.currentCustodian,
      registeredAt:     new Date(details.registrationTimestamp * 1000).toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { registerEvidence, getEvidence, transferCustody, verifyEvidence };
