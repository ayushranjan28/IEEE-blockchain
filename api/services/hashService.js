/**
 * services/hashService.js
 *
 * SHA-256 helpers.
 * All outputs are "0x"-prefixed 64-char hex strings so they can be passed
 * directly to Solidity's bytes32 parameter without conversion.
 *
 * Solidity enforces:  require(_fileHash != bytes32(0), "Invalid file hash")
 * This is guaranteed as long as the input is a non-empty file.
 */

const crypto = require("crypto");

/**
 * Hash a Buffer (raw file bytes).
 * @param {Buffer} buffer
 * @returns {string}  e.g. "0xabc123...64chars"
 */
function hashBuffer(buffer) {
  return "0x" + crypto.createHash("sha256").update(buffer).digest("hex");
}

/**
 * Hash a plain string (JSON metadata, etc.).
 * @param {string} str
 * @returns {string}
 */
function hashString(str) {
  return "0x" + crypto.createHash("sha256").update(str, "utf8").digest("hex");
}

/**
 * Re-hash an uploaded file and compare to the bytes32 stored on-chain.
 * Handles both "0x"-prefixed and bare hex strings from the contract.
 *
 * @param {Buffer} fileBuffer
 * @param {string} storedHashHex   from blockchainService.getEvidenceDetails()
 * @returns {boolean}
 */
function verifyIntegrity(fileBuffer, storedHashHex) {
  const computed = hashBuffer(fileBuffer).toLowerCase();
  const stored   = storedHashHex.startsWith("0x")
    ? storedHashHex.toLowerCase()
    : ("0x" + storedHashHex).toLowerCase();

  return computed === stored;
}

module.exports = { hashBuffer, hashString, verifyIntegrity };
