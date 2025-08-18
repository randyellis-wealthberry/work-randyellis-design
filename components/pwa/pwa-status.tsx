"use client";

import React, { useEffect, useState } from "react";
import { Wifi, WifiOff, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, [isOnline]);

  return (
    <>
      {/* Connection Status Indicator */}
      <div className={`fixed top-4 right-4 z-40 ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-full p-2 transition-colors ${
            isOnline
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
          title={isOnline ? "Online" : "Offline - Using cached content"}
        >
          {isOnline ? (
            <Wifi className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4" />
          )}
        </motion.div>
      </div>

      {/* Offline Toast */}
      <AnimatePresence>
        {showOfflineToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-4 left-1/2 z-50 flex transform items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white shadow-lg"
          >
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">You&apos;re offline</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Online Toast */}
      <AnimatePresence>
        {showOnlineToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-4 left-1/2 z-50 flex transform items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white shadow-lg"
          >
            <Wifi className="h-4 w-4" />
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

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  return isOnline;
}

// Component that shows when service worker is updating
export function ServiceWorkerUpdatePrompt() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        // Listen for waiting service worker
        if (reg.waiting) {
          setShowUpdatePrompt(true);
        }

        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
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
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
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
          className="fixed right-4 bottom-4 left-4 z-50 mx-auto max-w-sm"
        >
          <div className="rounded-lg bg-blue-500 p-4 text-white shadow-lg">
            <div className="mb-2 flex items-center gap-3">
              <Download className="h-5 w-5" />
              <h3 className="font-semibold">Update Available</h3>
            </div>
            <p className="mb-3 text-sm opacity-90">
              A new version of the app is available. Update now to get the
              latest features.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="rounded bg-white px-4 py-2 text-sm font-medium text-blue-500 transition-colors hover:bg-gray-100"
              >
                Update
              </button>
              <button
                onClick={handleDismiss}
                className="rounded px-4 py-2 text-sm text-white transition-colors hover:bg-white/20"
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

ServiceWorkerUpdatePrompt.displayName = "ServiceWorkerUpdatePrompt";
PWAStatus.displayName = "PWAStatus";
