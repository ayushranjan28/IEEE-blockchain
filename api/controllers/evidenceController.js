const blockchain = require("../services/blockchainService");
const hashService = require("../services/hashService");
const ipfsService = require("../services/ipfsService");

// POST /register
exports.register = async (req, res) => {
  try {
    if (!req.file) throw new Error("Evidence file is required.");
    
    const { investigator, location, sampleType, notes } = req.body;

    // 1. Generate SHA-256 hash natively via hashService
    const fileHash = hashService.hashBuffer(req.file.buffer);

    // 2. Upload file & metadata to IPFS
    const fileCid = await ipfsService.uploadFile(req.file.buffer, req.file.originalname, { investigator, location, sampleType });
    const jsonCid = await ipfsService.uploadJSON({
      investigator,
      location,
      sampleType,
      notes,
      fileCid,
      timestamp: new Date().toISOString()
    }, `Metadata-${req.file.originalname}`);

    // 3. Store CID & hash on blockchain
    const txHash = await blockchain.registerEvidence(fileHash, jsonCid);

    res.status(201).json({
      message: "Stored securely on IPFS and Blockchain",
      fileHash,
      ipfsCid: fileCid,
      metadataCid: jsonCid,
      ipfsGateway: ipfsService.gatewayUrl(fileCid),
      txHash,
      metadata: { location, investigator }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /:id/verify
exports.verify = async (req, res) => {
  try {
    if (!req.file) throw new Error("Verification file is required.");
    const { id } = req.params;

    // 1. Fetch blockchain record
    const evidenceDetails = await blockchain.getEvidence(id);
    if (!evidenceDetails || !evidenceDetails.fileHash) throw new Error("Evidence not found on-chain");

    const onChainHash = evidenceDetails.fileHash;

    // 2. Compute the integrity natively using hashService
    const isIntact = hashService.verifyIntegrity(req.file.buffer, onChainHash);
    const computedHash = hashService.hashBuffer(req.file.buffer);

    res.json({
      verified: isIntact,
      verdict: isIntact ? "✅ INTACT — file matches the on-chain record." : "❌ ALTERED — file does not match.",
      computedHash,
      storedHash: onChainHash
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};