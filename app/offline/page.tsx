import React from 'react';
import { Metadata } from 'next';
import { Wifi, RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Offline - Randy Ellis',
  description: 'You are currently offline. Please check your internet connection.',
  robots: 'noindex'
};

export default function OfflinePage() {
  const handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <Wifi 
            className="w-16 h-16 mx-auto text-gray-400 mb-4" 
            strokeDasharray="4 4"
          />
          <h1 className="text-2xl font-bold mb-2">You're offline</h1>
          <p className="text-gray-400 mb-6">
            It looks like you've lost your internet connection. Don't worry, you can still browse previously visited pages.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleRefresh}
            className="w-full bg-white text-black py-3 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            aria-label="Try again"
          >
            <RefreshCw className="w-4 h-4" />
            Try again
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full border border-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-900 transition-colors"
            aria-label="Go to homepage"
          >
            Go to homepage
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-900 rounded-lg">
          <h2 className="text-sm font-medium mb-2 text-gray-300">Offline features</h2>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Browse previously visited pages</li>
            <li>• View cached project details</li>
            <li>• Access offline-ready content</li>
          </ul>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          <p>This app works offline thanks to Progressive Web App technology</p>
        </div>
      </div>
    </div>
  );
}