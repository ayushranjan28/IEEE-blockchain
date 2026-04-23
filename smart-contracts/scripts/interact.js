const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Starting interaction...");

    // 🔗 Your deployed contract address
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // 📦 Get contract factory
    const EvidenceManager = await ethers.getContractFactory("EvidenceManager");

    // 🔌 Connect to deployed contract
    const contract = await EvidenceManager.attach(contractAddress);

    console.log("🔗 Connected to contract:", contractAddress);

    // 🧾 Dummy data (you can change later)
    const fileHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    const cid = "QmFakeCID123";

    // 📝 Register evidence
    console.log("📝 Registering evidence...");
    const tx1 = await contract.registerEvidence(fileHash, cid);

    await tx1.wait();

    console.log("✅ Evidence registered!");

    // 🔄 Transfer custody to another account
    const newCustodian = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

    console.log("🔄 Transferring custody...");
    const tx2 = await contract.transferCustody(1, newCustodian);

    await tx2.wait();

    console.log("✅ Custody transferred!");
}

main().catch((error) => {
    console.error("❌ Error:", error);
    process.exitCode = 1;
});