'use client';

import React from 'react';
import { useWallet } from '@/src/contexts/WalletContext';

export function WalletConnector() {
  const { account, isConnected, connectWallet, disconnectWallet, error } = useWallet();

  const handleConnect = async () => {
    await connectWallet();
  };

  return (
    <div className="flex items-center gap-4">
      {error && (
        <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded border border-red-200">
          {error}
        </div>
      )}
      
      {isConnected ? (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
            ✓ Connected
          </span>
          <span className="text-xs font-mono text-gray-600 bg-gray-100 px-3 py-2 rounded">
            {account?.slice(0, 6)}...{account?.slice(-4)}
          </span>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
        >
          Connect MetaMask
        </button>
      )}
    </div>
  );
}
