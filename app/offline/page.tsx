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
    <div className="flex min-h-screen items-center justify-center bg-white px-4 text-zinc-900 dark:bg-zinc-950 dark:text-white">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8">
          <Wifi
            className="mx-auto mb-4 h-16 w-16 text-zinc-400 dark:text-zinc-500"
            strokeDasharray="4 4"
          />
          <h1 className="mb-2 text-2xl font-bold">You&apos;re offline</h1>
          <p className="mb-6 text-zinc-600 dark:text-zinc-400">
            It looks like you&apos;ve lost your internet connection. Don&apos;t
            worry, you can still browse previously visited pages.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleRefresh}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            aria-label="Try again"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>

          <button
            onClick={handleGoHome}
            className="w-full rounded-lg border border-zinc-300 px-6 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:text-white dark:hover:bg-zinc-900"
            aria-label="Go to homepage"
          >
            Go to homepage
          </button>
        </div>

        <div className="mt-8 rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
          <h2 className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Offline features
          </h2>
          <ul className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <li>• Browse previously visited pages</li>
            <li>• View cached project details</li>
            <li>• Access offline-ready content</li>
          </ul>
        </div>

        <div className="mt-6 text-xs text-zinc-500">
          <p>This app works offline thanks to Progressive Web App technology</p>
        </div>
      </div>
    </div>
  );
}
