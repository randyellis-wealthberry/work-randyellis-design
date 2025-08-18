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
            className="fixed right-0 bottom-0 left-0 z-50 border-t border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mx-auto max-w-6xl">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Cookie Preferences
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    We use cookies to enhance your experience, analyze website
                    performance, and remember your preferences. You can
                    customize your choices or accept all cookies to continue.{" "}
                    <a
                      href="/privacy-policy"
                      className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400"
                    >
                      Learn more
                    </a>
                  </p>
                </div>

                <div className="flex min-w-fit flex-col gap-2 sm:flex-row">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Customize
                  </Button>
                  <Button variant="outline" size="sm" onClick={acceptNecessary}>
                    Necessary Only
                  </Button>
                  <Button
                    size="sm"
                    onClick={acceptAll}
                    className="bg-blue-600 text-white hover:bg-blue-700"
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
              className="fixed inset-0 z-50 bg-black/50"
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
              className="fixed top-1/2 left-1/2 z-50 mx-4 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Cookie Settings
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Necessary Cookies */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" />
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
                      <div className="relative h-6 w-10 rounded-full bg-green-600">
                        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-white shadow-sm" />
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <div className="mb-2 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
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
                        className={`relative h-6 w-10 rounded-full transition-colors ${
                          preferences.analytics
                            ? "bg-blue-600"
                            : "bg-zinc-300 dark:bg-zinc-600"
                        }`}
                      >
                        <div
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                            preferences.analytics ? "right-1" : "left-1"
                          }`}
                        />
                      </div>
                    </button>
                  </div>

                  {/* Functional Cookies */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Settings className="h-4 w-4 text-purple-600" />
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
                        className={`relative h-6 w-10 rounded-full transition-colors ${
                          preferences.functional
                            ? "bg-purple-600"
                            : "bg-zinc-300 dark:bg-zinc-600"
                        }`}
                      >
                        <div
                          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                            preferences.functional ? "right-1" : "left-1"
                          }`}
                        />
                      </div>
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
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

                <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
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
