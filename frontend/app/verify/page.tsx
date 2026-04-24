'use client';

import React from 'react';
import { VerifyEvidence } from '@/src/components/VerifyEvidence';

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Evidence</h1>
          <p className="text-gray-600">
            Verify the integrity of evidence files by uploading them and comparing their SHA-256 hash
            against the blockchain record. This ensures no tampering has occurred.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <VerifyEvidence />
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
                  <span>Enter the Evidence ID from the registration transaction</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                  <span>Upload or drag-and-drop the evidence file</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">4.</span>
                  <span>Click "Verify Evidence" to check integrity</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0">5.</span>
                  <span>Review the verification result</span>
                </li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-blue-900 mb-4">✅ Verification Process</h3>
              <div className="space-y-3 text-sm text-blue-800">
                <p>1. Generates SHA-256 hash of uploaded file</p>
                <p>2. Retrieves stored hash from blockchain</p>
                <p>3. Compares the two hashes</p>
                <p>4. Returns verification result</p>
                <p className="font-semibold">✓ Match = File is authentic</p>
                <p className="font-semibold">✗ No Match = File has been tampered with</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-yellow-900 mb-4">⚠️ Important Notes</h3>
              <div className="space-y-2 text-sm text-yellow-800">
                <p>• Use the exact file that was originally registered</p>
                <p>• File must not be modified in any way</p>
                <p>• Keep transaction hash for audit purposes</p>
                <p>• Verification is performed server-side for accuracy</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-green-900 mb-4">🎯 Use Cases</h3>
              <div className="space-y-2 text-sm text-green-800">
                <p>• Court evidence verification</p>
                <p>• Chain of custody audits</p>
                <p>• Forensic integrity checks</p>
                <p>• Legal compliance verification</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
