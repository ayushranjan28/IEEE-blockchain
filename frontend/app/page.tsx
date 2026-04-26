'use client';

import React from 'react';
import Link from 'next/link';
import { WalletConnector } from '@/src/components/WalletConnector';
import { useWallet } from '@/src/contexts/WalletContext';

export default function Home() {
  const { isConnected, account } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">⛓️</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Forensic Evidence System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A blockchain-based chain of custody tracking system for forensic evidence.
            Ensure evidence integrity and maintain immutable records on Ethereum.
          </p>
          <div className="flex justify-center">
            <WalletConnector />
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Register Evidence</h3>
            <p className="text-gray-600 mb-4">
              Upload forensic evidence files with metadata. Files are hashed with SHA-256,
              pinned to IPFS, and recorded on the Ethereum blockchain.
            </p>
            <Link
              href="/register"
              className={`inline-block px-6 py-2 rounded-lg font-medium transition-colors ${
                isConnected
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              Start Registering
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Verify Evidence</h3>
            <p className="text-gray-600 mb-4">
              Verify the integrity of evidence files by comparing their SHA-256 hash
              against the blockchain record. Detects any tampering or modifications.
            </p>
            <Link
              href="/verify"
              className={`inline-block px-6 py-2 rounded-lg font-medium transition-colors ${
                isConnected
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              Verify Now
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-4">🔗</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Blockchain Storage</h3>
            <p className="text-gray-600 mb-4">
              All evidence records are stored immutably on the Ethereum Sepolia testnet.
              Metadata is stored on IPFS for decentralized, tamper-proof tracking.
            </p>
            <Link
              href="/about"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-lg p-8 my-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <span className="text-sm font-medium text-gray-600">Wallet Connection</span>
              <div className="mt-2 flex items-center">
                <div className={`h-3 w-3 rounded-full mr-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`font-semibold ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
                  {isConnected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              {isConnected && account && (
                <p className="text-xs text-gray-500 mt-2 font-mono">{account}</p>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <span className="text-sm font-medium text-gray-600">Network</span>
              <div className="mt-2 flex items-center">
                <div className="h-3 w-3 rounded-full mr-3 bg-green-500"></div>
                <span className="font-semibold text-green-700">Ethereum Sepolia</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Testnet</p>
            </div>
          </div>
        </div>

        {/* Architecture Overview */}
        <div className="bg-white rounded-lg shadow-lg p-8 my-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Architecture Overview</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 overflow-x-auto">
            <div className="text-sm text-gray-700 font-mono">
              <div className="text-blue-600 font-bold mb-3">Evidence Flow:</div>
              <div className="mb-2">1. User uploads evidence file + metadata</div>
              <div className="mb-2">2. Backend generates SHA-256 hash</div>
              <div className="mb-2">3. File &amp; metadata pinned to IPFS (Pinata)</div>
              <div className="mb-2">4. CID &amp; hash stored on blockchain</div>
              <div className="mb-2">5. Transaction hash returned to user</div>
              <div className="mt-4 text-blue-600 font-bold mb-3">Verification Flow:</div>
              <div className="mb-2">1. User uploads file to verify</div>
              <div className="mb-2">2. Backend generates new SHA-256 hash</div>
              <div className="mb-2">3. Query blockchain for stored hash</div>
              <div className="mb-2">4. Compare hashes for integrity check</div>
              <div className="mb-2">5. Return verification result</div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white my-12">
          <h2 className="text-2xl font-bold mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/register"
              className="block bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              📝 Register Evidence
            </Link>
            <Link
              href="/verify"
              className="block bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              ✅ Verify Evidence
            </Link>
            <Link
              href="/about"
              className="block bg-blue-700 hover:bg-blue-800 px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              ℹ️ About System
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
