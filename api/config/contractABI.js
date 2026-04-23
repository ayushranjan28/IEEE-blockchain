/**
 * config/contractABI.js
 *
 * Reads the ABI directly from Hardhat's compiled artifact so the backend
 * is always in sync with the deployed contract — no manual copy-paste needed.
 *
 * Artifact path (relative to this file):
 *   ../../smart-contracts/artifacts/contracts/EvidenceManager.sol/EvidenceManager.json
 *
 * Run  `npx hardhat compile`  inside smart-contracts/ before starting the server.
 */

const path = require("path");
const fs   = require("fs");

const ARTIFACT_PATH = path.resolve(
  __dirname,
  "../../smart-contracts/artifacts/contracts/EvidenceManager.sol/EvidenceManager.json"
);

let EvidenceManagerABI;

try {
  const artifact = JSON.parse(fs.readFileSync(ARTIFACT_PATH, "utf8"));
  EvidenceManagerABI = artifact.abi;
  console.log("✅  ABI loaded from Hardhat artifact");
} catch (_err) {
  // Fallback: hardcoded ABI so the server still starts when artifact is missing
  // (e.g. during CI or before first compile)
  console.warn("⚠️   Hardhat artifact not found — using fallback ABI");
  EvidenceManagerABI = [
    // ── Write functions ─────────────────────────────────────────
    {
      inputs: [
        { internalType: "bytes32", name: "_fileHash",    type: "bytes32" },
        { internalType: "string",  name: "_metadataCid", type: "string"  }
      ],
      name: "registerEvidence",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        { internalType: "uint256", name: "_evidenceId",   type: "uint256" },
        { internalType: "address", name: "_newCustodian", type: "address" }
      ],
      name: "transferCustody",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    // ── Read functions ───────────────────────────────────────────
    {
      inputs: [{ internalType: "uint256", name: "_evidenceId", type: "uint256" }],
      name: "getEvidenceDetails",
      outputs: [
        { internalType: "bytes32", name: "fileHash",              type: "bytes32" },
        { internalType: "string",  name: "metadataCid",           type: "string"  },
        { internalType: "address", name: "currentCustodian",      type: "address" },
        { internalType: "uint256", name: "registrationTimestamp", type: "uint256" }
      ],
      stateMutability: "view",
      type: "function"
    },
    // ── Public mapping getter ────────────────────────────────────
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "evidenceRegistry",
      outputs: [
        { internalType: "bytes32", name: "fileHash",              type: "bytes32" },
        { internalType: "string",  name: "metadataCid",           type: "string"  },
        { internalType: "address", name: "currentCustodian",      type: "address" },
        { internalType: "uint256", name: "registrationTimestamp", type: "uint256" }
      ],
      stateMutability: "view",
      type: "function"
    },
    // ── Events ──────────────────────────────────────────────────
    {
      anonymous: false,
      inputs: [
        { indexed: true,  internalType: "uint256", name: "evidenceId", type: "uint256" },
        { indexed: true,  internalType: "address", name: "custodian",  type: "address" },
        { indexed: false, internalType: "bytes32", name: "fileHash",   type: "bytes32" }
      ],
      name: "EvidenceRegistered",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, internalType: "uint256", name: "evidenceId",   type: "uint256" },
        { indexed: true, internalType: "address", name: "previousOwner",type: "address" },
        { indexed: true, internalType: "address", name: "newCustodian", type: "address" }
      ],
      name: "CustodyTransferred",
      type: "event"
    }
  ];
}

module.exports = EvidenceManagerABI;
