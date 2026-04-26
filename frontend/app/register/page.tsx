'use client';

import React from 'react';
import { RegisterEvidence } from '@/src/components/RegisterEvidence';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Evidence</h1>
          <p className="text-gray-600">
            Upload evidence files with metadata. The system will hash the file with SHA-256,
            pin it to IPFS, and record the details on the Ethereum blockchain.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <RegisterEvidence />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Instructions</h3>
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                  <span>Connect your MetaMask wallet</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                  <span>Select the evidence file to upload</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                  <span>Fill in the required metadata fields</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">4.</span>
                  <span>Click "Register Evidence" to submit</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">5.</span>
                  <span>Wait for confirmation and record the transaction hash</span>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4">ℹ️ What Happens</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <p>✓ File is hashed using SHA-256 algorithm</p>
                <p>✓ File and metadata are pinned to IPFS (Pinata)</p>
                <p>✓ Hash and IPFS CID are stored on Ethereum blockchain</p>
                <p>✓ Transaction hash is returned for your records</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-green-900 mb-4">✓ Benefits</h3>
              <div className="space-y-2 text-sm text-green-800">
                <p>• Immutable chain of custody</p>
                <p>• Tamper-proof evidence storage</p>
                <p>• Decentralized backup on IPFS</p>
                <p>• Transparent audit trail</p>
                <p>• Compliant with forensic standards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
