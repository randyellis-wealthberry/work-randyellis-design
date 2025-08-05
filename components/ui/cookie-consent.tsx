"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { X, Settings, Shield, BarChart3 } from "lucide-react";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
}

const COOKIE_CONSENT_KEY = "cookie-consent";
const COOKIE_PREFERENCES_KEY = "cookie-preferences";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true
    analytics: false,
    functional: true,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

    if (!hasConsent) {
      // Delay showing banner slightly for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }

    if (savedPreferences) {
      const parsed = JSON.parse(savedPreferences);
      setPreferences(parsed);

      // Enable/disable analytics based on saved preferences
      if (parsed.analytics && typeof window !== "undefined" && window.gtag) {
        window.gtag("consent", "update", {
          analytics_storage: "granted",
        });
      }
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setPreferences(prefs);

    // Update Google Analytics consent
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: prefs.analytics ? "granted" : "denied",
        functionality_storage: prefs.functional ? "granted" : "denied",
      });
    }

    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      functional: true,
    });
  };

  const acceptNecessary = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      functional: false,
    });
  };

  const handleCustomSave = () => {
    savePreferences(preferences);
  };

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: key === "necessary" ? true : value, // Necessary cookies can't be disabled
    }));
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: "spring" as const,
              damping: 25,
              stiffness: 200,
            }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shadow-2xl"
          >
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Cookie Preferences
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    We use cookies to enhance your experience, analyze website
                    performance, and remember your preferences. You can
                    customize your choices or accept all cookies to continue.{" "}
                    <a
                      href="/privacy-policy"
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 underline"
                    >
                      Learn more
                    </a>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                    className="flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Customize
                  </Button>
                  <Button variant="outline" size="sm" onClick={acceptNecessary}>
                    Necessary Only
                  </Button>
                  <Button
                    size="sm"
                    onClick={acceptAll}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowSettings(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{
                type: "spring" as const,
                damping: 25,
                stiffness: 200,
              }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg mx-4 bg-white dark:bg-zinc-900 rounded-lg shadow-2xl z-50 border border-zinc-200 dark:border-zinc-800"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Cookie Settings
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Necessary Cookies */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                          Necessary Cookies
                        </h3>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Essential for website functionality, security, and
                        remembering your preferences.
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-6 bg-green-600 rounded-full relative">
                        <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                          Analytics Cookies
                        </h3>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Help us understand how visitors use our website to
                        improve content and user experience.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updatePreference("analytics", !preferences.analytics)
                      }
                      className="flex items-center"
                    >
                      <div
                        className={`w-10 h-6 rounded-full relative transition-colors ${
                          preferences.analytics
                            ? "bg-blue-600"
                            : "bg-zinc-300 dark:bg-zinc-600"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${
                            preferences.analytics ? "right-1" : "left-1"
                          }`}
                        />
                      </div>
                    </button>
                  </div>

                  {/* Functional Cookies */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Settings className="w-4 h-4 text-purple-600" />
                        <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                          Functional Cookies
                        </h3>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Remember your preferences like theme selection and
                        improve website functionality.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        updatePreference("functional", !preferences.functional)
                      }
                      className="flex items-center"
                    >
                      <div
                        className={`w-10 h-6 rounded-full relative transition-colors ${
                          preferences.functional
                            ? "bg-purple-600"
                            : "bg-zinc-300 dark:bg-zinc-600"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${
                            preferences.functional ? "right-1" : "left-1"
                          }`}
                        />
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <Button
                    variant="outline"
                    onClick={acceptNecessary}
                    className="flex-1"
                  >
                    Necessary Only
                  </Button>
                  <Button
                    onClick={handleCustomSave}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Save Preferences
                  </Button>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4 text-center">
                  You can change these settings anytime in your browser or by
                  revisiting this page.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Use existing gtag interface from Google Analytics
