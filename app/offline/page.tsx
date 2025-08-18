"use client";

import React, { useEffect } from "react";
import { Wifi, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  useEffect(() => {
    document.title = "Offline - Randy Ellis";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "You are currently offline. Please check your internet connection.",
      );
    }
    const metaRobots = document.querySelector('meta[name="robots"]');
    if (metaRobots) {
      metaRobots.setAttribute("content", "noindex");
    }
  }, []);
  const handleRefresh = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8">
          <Wifi
            className="mx-auto mb-4 h-16 w-16 text-gray-400"
            strokeDasharray="4 4"
          />
          <h1 className="mb-2 text-2xl font-bold">You&apos;re offline</h1>
          <p className="mb-6 text-gray-400">
            It looks like you&apos;ve lost your internet connection. Don&apos;t
            worry, you can still browse previously visited pages.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleRefresh}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-black transition-colors hover:bg-gray-100"
            aria-label="Try again"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>

          <button
            onClick={handleGoHome}
            className="w-full rounded-lg border border-gray-600 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-900"
            aria-label="Go to homepage"
          >
            Go to homepage
          </button>
        </div>

        <div className="mt-8 rounded-lg bg-gray-900 p-4">
          <h2 className="mb-2 text-sm font-medium text-gray-300">
            Offline features
          </h2>
          <ul className="space-y-1 text-sm text-gray-400">
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
