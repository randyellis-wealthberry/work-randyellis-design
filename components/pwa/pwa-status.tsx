"use client";

import React, { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
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

PWAStatus.displayName = "PWAStatus";
