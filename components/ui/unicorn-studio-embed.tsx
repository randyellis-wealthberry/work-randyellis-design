"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface UnicornStudioEmbedProps {
  projectId: string;
  width?: number;
  height?: number;
  className?: string;
}

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized?: boolean;
      init?: () => void;
    };
  }
}

export function UnicornStudioEmbed({
  projectId,
  width = 1440,
  height = 900,
  className,
}: UnicornStudioEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    // Prevent multiple script loads
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    const loadUnicornStudio = () => {
      // Check if UnicornStudio is already loaded and initialized
      if (window.UnicornStudio?.isInitialized) {
        return;
      }

      // Check if script already exists
      const existingScript = document.querySelector(
        'script[src*="unicornStudio.umd.js"]',
      );
      if (existingScript) {
        return;
      }

      // Create and load the UnicornStudio script
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.28/dist/unicornStudio.umd.js";
      script.onload = () => {
        if (!window.UnicornStudio?.isInitialized) {
          if (window.UnicornStudio?.init) {
            window.UnicornStudio.init();
          }
          if (window.UnicornStudio) {
            window.UnicornStudio.isInitialized = true;
          }
        }
      };
      script.onerror = () => {
        console.error("Failed to load UnicornStudio script");
        isLoadingRef.current = false;
      };

      (document.head || document.body).appendChild(script);
    };

    // Initialize UnicornStudio if not already done
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false, init: () => {} };
    }

    loadUnicornStudio();

    // Cleanup function
    return () => {
      isLoadingRef.current = false;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20",
        className,
      )}
      style={{
        aspectRatio: `${width}/${height}`,
      }}
    >
      {/* UnicornStudio Embed */}
      <div
        data-us-project={projectId}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "200px",
        }}
        className="absolute inset-0"
      />

      {/* Loading fallback */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-800/30 dark:to-emerald-800/30">
        <div className="text-center space-y-2">
          <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm text-green-600 dark:text-green-400">
            Loading interactive content...
          </p>
        </div>
      </div>
    </div>
  );
}
