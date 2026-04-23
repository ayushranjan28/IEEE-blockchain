const { ethers } = require("hardhat");

async function main() {
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    const EvidenceManager = await ethers.getContractFactory("EvidenceManager");
    const contract = await EvidenceManager.attach(contractAddress);

    console.log("🔍 Fetching evidence...");

    // We registered first record → ID = 1
    const result = await contract.getEvidenceDetails(1);

    console.log("✅ Evidence Data:");
    console.log("File Hash:", result[0]);
    console.log("CID:", result[1]);
    console.log("Owner:", result[2]);
    console.log("Timestamp:", result[3].toString());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});