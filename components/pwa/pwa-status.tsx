'use client';

import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PWAStatusProps {
  className?: string;
}

export default function PWAStatus({ className }: PWAStatusProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  const [showOnlineToast, setShowOnlineToast] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      const online = navigator.onLine;
      const wasOffline = !isOnline;
      
      setIsOnline(online);
      
      if (!online) {
        setShowOfflineToast(true);
        setTimeout(() => setShowOfflineToast(false), 5000);
      } else if (wasOffline) {
        setShowOnlineToast(true);
        setTimeout(() => setShowOnlineToast(false), 3000);
      }
    };

    // Set initial state
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [isOnline]);

  return (
    <>
      {/* Connection Status Indicator */}
      <div className={`fixed top-4 right-4 z-40 ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-2 rounded-full transition-colors ${
            isOnline 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}
          title={isOnline ? 'Online' : 'Offline - Using cached content'}
        >
          {isOnline ? (
            <Wifi className="w-4 h-4" />
          ) : (
            <WifiOff className="w-4 h-4" />
          )}
        </motion.div>
      </div>

      {/* Offline Toast */}
      <AnimatePresence>
        {showOfflineToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-4 left-1/2 transform z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">You're offline</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Online Toast */}
      <AnimatePresence>
        {showOnlineToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-4 left-1/2 transform z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2"
          >
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Back online</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Hook for monitoring online status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    setIsOnline(navigator.onLine);

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return isOnline;
}

// Component that shows when service worker is updating
export function ServiceWorkerUpdatePrompt() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        // Listen for waiting service worker
        if (reg.waiting) {
          setShowUpdatePrompt(true);
        }

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowUpdatePrompt(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdatePrompt(false);
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
  };

  return (
    <AnimatePresence>
      {showUpdatePrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto"
        >
          <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Download className="w-5 h-5" />
              <h3 className="font-semibold">Update Available</h3>
            </div>
            <p className="text-sm mb-3 opacity-90">
              A new version of the app is available. Update now to get the latest features.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="bg-white text-blue-500 px-4 py-2 rounded font-medium text-sm hover:bg-gray-100 transition-colors"
              >
                Update
              </button>
              <button
                onClick={handleDismiss}
                className="text-white px-4 py-2 text-sm hover:bg-white/20 rounded transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}