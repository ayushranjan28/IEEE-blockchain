/**
 * services/ipfsService.js
 *
 * Uploads forensic evidence files and metadata JSON to IPFS via Pinata.
 * The CID returned here is stored as `metadataCid` in EvidenceManager.sol.
 */

const axios    = require("axios");
const FormData = require("form-data");

const BASE = "https://api.pinata.cloud";

// ─────────────────────────────────────────────────────────────────────────────
// uploadFile
//   Pins a raw file buffer to IPFS and returns its CID.
//
//   @param {Buffer} fileBuffer
//   @param {string} fileName     original filename
//   @param {object} keyvalues    extra metadata shown in Pinata dashboard
//   @returns {string} cid
// ─────────────────────────────────────────────────────────────────────────────
async function uploadFile(fileBuffer, fileName, keyvalues = {}) {
  const form = new FormData();
  form.append("file", fileBuffer, { filename: fileName });
  form.append(
    "pinataMetadata",
    JSON.stringify({ name: fileName, keyvalues })
  );

  const { data } = await axios.post(`${BASE}/pinning/pinFileToIPFS`, form, {
    maxContentLength: Infinity,
    maxBodyLength:    Infinity,
    headers: {
      ...form.getHeaders(),
      pinata_api_key:        process.env.PINATA_API_KEY,
      pinata_secret_api_key: process.env.PINATA_SECRET_KEY,
    },
  });

  return data.IpfsHash; // CID
}

// ─────────────────────────────────────────────────────────────────────────────
// uploadJSON
//   Pins a JSON object to IPFS. Useful for storing structured metadata
//   (investigator, location, timestamp) alongside the file CID.
//
//   @param {object} body
//   @param {string} name  label in Pinata dashboard
//   @returns {string} cid
// ─────────────────────────────────────────────────────────────────────────────
async function uploadJSON(body, name = "evidence-metadata") {
  const { data } = await axios.post(
    `${BASE}/pinning/pinJSONToIPFS`,
    { pinataContent: body, pinataMetadata: { name } },
    {
      headers: {
        "Content-Type":        "application/json",
        pinata_api_key:        process.env.PINATA_API_KEY,
        pinata_secret_api_key: process.env.PINATA_SECRET_KEY,
      },
    }
  );

  return data.IpfsHash;
}

/**
 * Build a Pinata gateway URL for a CID.
 * Frontend can use this to preview/download the file.
 */
function gatewayUrl(cid) {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}

module.exports = { uploadFile, uploadJSON, gatewayUrl };
