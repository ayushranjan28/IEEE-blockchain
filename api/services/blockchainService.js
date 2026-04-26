const { ethers } = require("ethers");

// 🔗 Connect to blockchain using RPC from env
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:8545");

// 🧠 Use private key from env
const signer = new ethers.Wallet(
  process.env.PRIVATE_KEY || "0x59c6995e998f97a5a004497e5daefc5c1a5b3e1d5b3b0b3d0f8c6d6e4e3e3e3e",
  provider
);

// 📦 Contract details
const contractAddress = process.env.CONTRACT_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// ABI (copy from artifacts)
const contractABI = require("../../smart-contracts/artifacts/contracts/EvidenceManager.sol/EvidenceManager.json").abi;

// 🔌 Connect contract
const contract = new ethers.Contract(contractAddress, contractABI, signer);

// 🚀 Function to register evidence
async function registerEvidence(fileHash, cid) {
  const tx = await contract.registerEvidence(fileHash, cid);
  await tx.wait();
  return tx.hash;
}

// 🔄 Transfer custody
async function transferCustody(evidenceId, newCustodian) {
  const tx = await contract.transferCustody(evidenceId, newCustodian);
  await tx.wait();
  return tx.hash;
}

// 🔍 Get evidence
async function getEvidence(evidenceId) {
  return await contract.getEvidenceDetails(evidenceId);
}

module.exports = {
  registerEvidence,
  transferCustody,
  getEvidence
};