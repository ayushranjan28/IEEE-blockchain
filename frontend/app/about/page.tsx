'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">About the System</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">📋 Overview</h2>
              <p className="mb-3">
                The Forensic Evidence System is a blockchain-based chain of custody tracking solution
                designed to ensure the integrity and immutability of digital forensic evidence. This system
                leverages Ethereum smart contracts and IPFS storage to create a transparent, tamper-proof
                record of evidence throughout its lifecycle.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">🎯 Key Features</h2>
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span><strong>Evidence Registration:</strong> Upload files with metadata for secure storage</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span><strong>Integrity Verification:</strong> Verify file authenticity against blockchain records</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span><strong>Immutable Records:</strong> Permanent chain of custody on Ethereum</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span><strong>Decentralized Storage:</strong> Evidence files pinned to IPFS via Pinata</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span><strong>SHA-256 Hashing:</strong> Cryptographic fingerprinting for each file</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">🏗️ Architecture</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
                <p className="font-mono text-sm mb-3 font-bold">System Components:</p>
                <ul className="space-y-2 text-sm font-mono">
                  <li><strong>Frontend:</strong> Next.js + React with Tailwind CSS</li>
                  <li><strong>Backend API:</strong> Node.js/Express with Multer for uploads</li>
                  <li><strong>Blockchain:</strong> Ethereum Sepolia Testnet</li>
                  <li><strong>Smart Contracts:</strong> Solidity EvidenceManager contract</li>
                  <li><strong>IPFS Storage:</strong> Pinata API for decentralized storage</li>
                  <li><strong>Hashing:</strong> SHA-256 algorithm for file fingerprinting</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">📊 Data Flow</h2>
              
              <h3 className="text-lg font-bold text-blue-600 mb-2">Registration Flow:</h3>
              <ol className="space-y-2 ml-4 mb-4">
                <li>1. User uploads evidence file with metadata</li>
                <li>2. Backend generates SHA-256 hash of the file</li>
                <li>3. File and metadata are pinned to IPFS</li>
                <li>4. Hash and CID are recorded on Ethereum blockchain</li>
                <li>5. Transaction hash and CID returned to user</li>
              </ol>

              <h3 className="text-lg font-bold text-blue-600 mb-2">Verification Flow:</h3>
              <ol className="space-y-2 ml-4">
                <li>1. User uploads file for verification</li>
                <li>2. Backend generates new SHA-256 hash</li>
                <li>3. Query blockchain for stored hash</li>
                <li>4. Compare hashes for integrity</li>
                <li>5. Return verification result</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">🔐 Security Features</h2>
              <ul className="space-y-2">
                <li>• <strong>Immutability:</strong> Blockchain ensures records cannot be modified</li>
                <li>• <strong>Decentralization:</strong> No single point of failure with IPFS storage</li>
                <li>• <strong>Cryptographic Hashing:</strong> SHA-256 provides strong collision resistance</li>
                <li>• <strong>Access Control:</strong> MetaMask wallet authentication</li>
                <li>• <strong>Tamper Detection:</strong> Hash mismatch immediately indicates tampering</li>
                <li>• <strong>Audit Trail:</strong> Complete transaction history on blockchain</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">📝 Supported Metadata</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <ul className="space-y-1 text-sm">
                  <li><strong>Case Number:</strong> Unique case identifier</li>
                  <li><strong>Officer Name:</strong> Investigating officer name</li>
                  <li><strong>Location:</strong> Where evidence was collected</li>
                  <li><strong>Date/Time:</strong> When evidence was collected</li>
                  <li><strong>Description:</strong> Detailed description of evidence</li>
                  <li><strong>Submitter Address:</strong> Connected wallet address</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">🎓 Technology Stack</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-blue-900 mb-2">Frontend</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Next.js 14</li>
                    <li>• TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• ethers.js v6</li>
                    <li>• web3modal</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-bold text-green-900 mb-2">Backend</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Node.js</li>
                    <li>• Express.js</li>
                    <li>• Multer</li>
                    <li>• ethers.js</li>
                    <li>• Pinata API</li>
                  </ul>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-bold text-purple-900 mb-2">Blockchain</h4>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• Ethereum</li>
                    <li>• Sepolia Testnet</li>
                    <li>• Solidity</li>
                    <li>• Hardhat</li>
                    <li>• Chai/Mocha</li>
                  </ul>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-bold text-orange-900 mb-2">Storage</h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• IPFS</li>
                    <li>• Pinata API</li>
                    <li>• SHA-256</li>
                    <li>• CID v1</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">👥 User Roles</h2>
              <ul className="space-y-2">
                <li>• <strong>Forensic Officer:</strong> Registers new evidence with metadata</li>
                <li>• <strong>Verifier/Auditor:</strong> Verifies evidence integrity</li>
                <li>• <strong>System Admin:</strong> Manages contracts and configurations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">📚 Network Information</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>Network:</strong> Ethereum Sepolia Testnet</p>
                <p className="mb-2"><strong>Chain ID:</strong> 11155111</p>
                <p className="mb-2"><strong>RPC Endpoint:</strong> https://sepolia.infura.io/v3/YOUR_KEY</p>
                <p><strong>Faucet:</strong> https://sepoliafaucet.com</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">🚀 Getting Started</h2>
              <p className="mb-3">Ready to use the system? Follow these steps:</p>
              <ol className="space-y-2 ml-4 mb-4">
                <li>1. Install MetaMask browser extension</li>
                <li>2. Add Ethereum Sepolia network to MetaMask</li>
                <li>3. Get test ETH from Sepolia faucet</li>
                <li>4. Connect your wallet on this website</li>
                <li>5. Register or verify evidence</li>
              </ol>
              <div className="flex gap-4">
                <Link
                  href="/register"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Register Evidence
                </Link>
                <Link
                  href="/verify"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Verify Evidence
                </Link>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">📞 Support</h2>
              <p className="text-gray-600">
                For technical support or questions, please refer to the project documentation in the docs/ folder
                or contact the development team.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
