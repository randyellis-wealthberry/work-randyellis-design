'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { X, Download, Smartphone, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface InstallPromptProps {
  onInstall?: () => void;
  onDismiss?: () => void;
  className?: string;
}

const STORAGE_KEY = 'pwa-install-dismissed';
const DISMISSAL_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export default function InstallPrompt({ onInstall, onDismiss, className }: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Check if app is already installed or in standalone mode
  const checkInstallationStatus = useCallback(() => {
    if (typeof window === 'undefined') return;

    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    
    setIsStandalone(standalone);
    
    if (standalone) {
      setIsInstalled(true);
      setShowPrompt(false);
    }
  }, []);

  // Check if user previously dismissed the prompt
  const checkDismissalStatus = useCallback(() => {
    if (typeof window === 'undefined') return false;

    const dismissedTime = localStorage.getItem(STORAGE_KEY);
    if (dismissedTime) {
      const dismissedTimestamp = parseInt(dismissedTime, 10);
      const now = Date.now();
      return (now - dismissedTimestamp) < DISMISSAL_DURATION;
    }
    return false;
  }, []);

  // Detect iOS devices
  const detectIOSDevice = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    return /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as any).MSStream;
  }, []);

  useEffect(() => {
    checkInstallationStatus();
    setIsIOSDevice(detectIOSDevice());

    if (isInstalled || checkDismissalStatus()) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem(STORAGE_KEY);
      onInstall?.();
    };

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For iOS devices, show manual install instructions after a delay
    if (isIOSDevice && !isStandalone) {
      const timer = setTimeout(() => {
        if (!checkDismissalStatus()) {
          setShowPrompt(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled, isIOSDevice, isStandalone, checkDismissalStatus, checkInstallationStatus, detectIOSDevice, onInstall]);

  const handleInstall = async () => {
    if (!deferredPrompt && !isIOSDevice) return;

    setIsInstalling(true);

    try {
      if (deferredPrompt) {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          setIsInstalled(true);
          onInstall?.();
        }
        
        setDeferredPrompt(null);
        setShowPrompt(false);
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
    onDismiss?.();
  };

  // Don't show if already installed or dismissed recently
  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={`fixed bottom-4 left-4 right-4 z-50 ${className}`}
        role="dialog"
        aria-labelledby="install-title"
        aria-describedby="install-description"
        data-testid="install-prompt"
      >
        <div className="bg-black border border-gray-800 rounded-lg p-4 shadow-2xl max-w-sm mx-auto">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 id="install-title" className="text-white font-semibold text-sm">
                  Install Randy Ellis Portfolio
                </h3>
                <p className="text-gray-400 text-xs">
                  {isIOSDevice ? 'Add to Home Screen' : 'Install as app'}
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Dismiss install prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p id="install-description" className="text-gray-300 text-sm mb-4">
            {isIOSDevice
              ? `Tap the Share button ${String.fromCharCode(0x1F4E4)} below and select "Add to Home Screen"`
              : 'Get quick access with offline support and app-like experience'
            }
          </p>

          {isIOSDevice ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300 p-2 bg-gray-900 rounded">
                <Share className="w-4 h-4" />
                <span>1. Tap the Share button</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300 p-2 bg-gray-900 rounded">
                <Download className="w-4 h-4" />
                <span>2. Select "Add to Home Screen"</span>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="flex-1 bg-white text-black py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                aria-label="Install app"
              >
                {isInstalling ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Download className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {isInstalling ? 'Installing...' : 'Install'}
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Not now"
              >
                Not now
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook for using PWA install functionality
export function usePWAInstall() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstallStatus = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsInstalled(standalone);
    };

    checkInstallStatus();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return { canInstall, isInstalled };
}