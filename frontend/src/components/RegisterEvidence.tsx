'use client';

import React, { useState, useRef } from 'react';
import { useWallet } from '@/src/contexts/WalletContext';

interface RegisterResponse {
  success: boolean;
  txHash?: string;
  cid?: string;
  error?: string;
  message?: string;
}

export function RegisterEvidence() {
  const { account, isConnected } = useWallet();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    caseNumber: '',
    officer: '',
    description: '',
    location: '',
    dateTime: new Date().toISOString().split('T')[0],
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RegisterResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setErrorMsg(null);
    }
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      setErrorMsg('Please connect your wallet first');
      return;
    }

    if (!file) {
      setErrorMsg('Please select a file');
      return;
    }

    if (!metadata.caseNumber || !metadata.officer || !metadata.description) {
      setErrorMsg('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify({
        ...metadata,
        submittedBy: account,
      }));

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/evidence/register`, {
        method: 'POST',
        body: formData,
      });

      const data: RegisterResponse = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          txHash: data.txHash,
          cid: data.cid,
        });
        setFile(null);
        setMetadata({
          caseNumber: '',
          officer: '',
          description: '',
          location: '',
          dateTime: new Date().toISOString().split('T')[0],
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setErrorMsg(data.error || 'Failed to register evidence');
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'An error occurred while registering evidence');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Register Evidence</h2>

      {!isConnected && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-medium">Please connect your wallet to register evidence</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Evidence File <span className="text-red-600">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={!isConnected || loading}
              className="hidden"
            />
            {file ? (
              <div className="text-center">
                <p className="text-green-600 font-medium">✓ {file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 font-medium">Click to select a file</p>
                <p className="text-sm text-gray-500">or drag and drop</p>
              </div>
            )}
          </div>
        </div>

        {/* Metadata Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Case Number <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="caseNumber"
              value={metadata.caseNumber}
              onChange={handleMetadataChange}
              disabled={!isConnected || loading}
              placeholder="e.g., CASE-2024-001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Officer Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="officer"
              value={metadata.officer}
              onChange={handleMetadataChange}
              disabled={!isConnected || loading}
              placeholder="e.g., John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={metadata.location}
              onChange={handleMetadataChange}
              disabled={!isConnected || loading}
              placeholder="e.g., Building A, Room 101"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              name="dateTime"
              value={metadata.dateTime}
              onChange={handleMetadataChange}
              disabled={!isConnected || loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-600">*</span>
          </label>
          <textarea
            name="description"
            value={metadata.description}
            onChange={handleMetadataChange}
            disabled={!isConnected || loading}
            placeholder="Describe the evidence..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error: {errorMsg}</p>
          </div>
        )}

        {/* Success Result */}
        {result?.success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
            <p className="text-green-800 font-bold">✓ Evidence registered successfully!</p>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">Transaction Hash:</span>
                <code className="block bg-gray-100 p-2 rounded mt-1 break-all text-xs">{result.txHash}</code>
              </div>
              <div>
                <span className="font-medium text-gray-700">IPFS CID:</span>
                <code className="block bg-gray-100 p-2 rounded mt-1 break-all text-xs">{result.cid}</code>
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
          {loading ? 'Registering Evidence...' : 'Register Evidence'}
        </button>
      </form>
    </div>
  );
}
