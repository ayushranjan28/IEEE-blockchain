'use client';

import React, { useState, useRef } from 'react';
import { useWallet } from '@/src/contexts/WalletContext';

interface VerifyResponse {
  success: boolean;
  verified?: boolean;
  message?: string;
  hash?: string;
  storedHash?: string;
  error?: string;
}

export function VerifyEvidence() {
  const { account, isConnected } = useWallet();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [evidenceId, setEvidenceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      setFile(e.dataTransfer.files[0]);
      setErrorMsg(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setErrorMsg(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      setErrorMsg('Please connect your wallet first');
      return;
    }

    if (!file) {
      setErrorMsg('Please select a file to verify');
      return;
    }

    if (!evidenceId) {
      setErrorMsg('Please enter the evidence ID');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('evidenceId', evidenceId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/evidence/${evidenceId}/verify`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data: VerifyResponse = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          verified: data.verified,
          message: data.verified 
            ? '✓ Evidence verified! File matches blockchain record.' 
            : '✗ Evidence verification failed! File does not match blockchain record.',
          hash: data.hash,
          storedHash: data.storedHash,
        });
      } else {
        setErrorMsg(data.error || 'Failed to verify evidence');
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'An error occurred while verifying evidence');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Verify Evidence</h2>

      {!isConnected && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium">Please connect your wallet to verify evidence</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Evidence ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Evidence ID <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={evidenceId}
            onChange={(e) => setEvidenceId(e.target.value)}
            disabled={!isConnected || loading}
            placeholder="Enter the evidence ID from blockchain transaction"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        {/* Drag and Drop Zone */}
        <div
          ref={dropZoneRef}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-400'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={!isConnected || loading}
            className="hidden"
          />
          
          {file ? (
            <div className="text-center">
              <div className="text-4xl mb-2">📄</div>
              <p className="text-green-600 font-bold text-lg mb-1">✓ {file.name}</p>
              <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
              <p className="text-xs text-gray-500 mt-2">Ready to verify</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-4xl mb-3">📤</div>
              <p className="text-gray-700 font-bold text-lg mb-1">Drop your evidence file here</p>
              <p className="text-sm text-gray-600">or click to select</p>
              <p className="text-xs text-gray-500 mt-3">Verify the integrity of evidence files against blockchain records</p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error: {errorMsg}</p>
          </div>
        )}

        {/* Verification Result */}
        {result?.success && (
          <div className={`p-4 rounded-lg border ${
            result.verified
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`font-bold text-lg mb-3 ${
              result.verified ? 'text-green-800' : 'text-red-800'
            }`}>
              {result.message}
            </p>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">File Hash:</span>
                <code className="block bg-gray-100 p-2 rounded mt-1 break-all text-xs font-mono">
                  {result.hash}
                </code>
              </div>
              <div>
                <span className="font-medium text-gray-700">Blockchain Hash:</span>
                <code className="block bg-gray-100 p-2 rounded mt-1 break-all text-xs font-mono">
                  {result.storedHash}
                </code>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isConnected || loading || !file}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Verifying Evidence...' : 'Verify Evidence'}
        </button>
      </form>
    </div>
  );
}
