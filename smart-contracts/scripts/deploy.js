const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Starting deployment...");

    const EvidenceManager = await ethers.getContractFactory("EvidenceManager");

    console.log("📦 Deploying contract...");

    const contract = await EvidenceManager.deploy();

    console.log("⏳ Waiting for deployment...");

    await contract.waitForDeployment();

    const address = await contract.getAddress();

    console.log("✅ Contract deployed at:", address);
}

main().catch((error) => {
    console.error("❌ Error:", error);
    process.exitCode = 1;
});