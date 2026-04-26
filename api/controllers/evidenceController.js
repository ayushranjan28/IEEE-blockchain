const blockchain = require("../services/blockchainService");

// POST /register
exports.register = async (req, res) => {
  try {
    const { hash, cid } = req.body;

    const txHash = await blockchain.registerEvidence(hash, cid);

    res.json({
      message: "Stored on blockchain",
      txHash
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};