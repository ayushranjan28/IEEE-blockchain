'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl">⛓️</div>
            <div>
              <h1 className="text-xl font-bold">Forensic Evidence System</h1>
              <p className="text-xs text-blue-100">Blockchain-Based Chain of Custody</p>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-blue-500 text-white' 
                  : 'text-blue-100 hover:bg-blue-700'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/register"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/register') 
                  ? 'bg-blue-500 text-white' 
                  : 'text-blue-100 hover:bg-blue-700'
              }`}
            >
              Register Evidence
            </Link>
            <Link
              href="/verify"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/verify') 
                  ? 'bg-blue-500 text-white' 
                  : 'text-blue-100 hover:bg-blue-700'
              }`}
            >
              Verify Evidence
            </Link>
            <Link
              href="/about"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/about') 
                  ? 'bg-blue-500 text-white' 
                  : 'text-blue-100 hover:bg-blue-700'
              }`}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
