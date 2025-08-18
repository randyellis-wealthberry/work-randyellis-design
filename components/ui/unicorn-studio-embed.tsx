"use client";

import { useEffect, useRef, useState } from "react";
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
  height = 1080,
  className,
}: UnicornStudioEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Prevent multiple script loads
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    const loadUnicornStudio = () => {
      try {
        // Check if UnicornStudio is already loaded and initialized
        if (window.UnicornStudio?.isInitialized) {
          setIsLoaded(true);
          return;
        }

        // Check if script already exists
        const existingScript = document.querySelector(
          'script[src*="unicornStudio.umd.js"]',
        );
        if (existingScript) {
          existingScript.addEventListener("load", () => {
            setTimeout(() => setIsLoaded(true), 1000); // Give it time to render
          });
          return;
        }

        // Create and load the UnicornStudio script
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
        script.onload = () => {
          try {
            if (!window.UnicornStudio?.isInitialized) {
              if (window.UnicornStudio?.init) {
                window.UnicornStudio.init();
              }
              if (window.UnicornStudio) {
                window.UnicornStudio.isInitialized = true;
              }
            }
            // Give UnicornStudio time to render the content
            setTimeout(() => setIsLoaded(true), 1500);
          } catch (error) {
            console.error("Error initializing UnicornStudio:", error);
            setHasError(true);
          }
        };
        script.onerror = () => {
          console.error("Failed to load UnicornStudio script");
          setHasError(true);
          isLoadingRef.current = false;
        };

        (document.head || document.body).appendChild(script);
      } catch (error) {
        console.error("Error loading UnicornStudio:", error);
        setHasError(true);
      }
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

  // If there's an error, return null to let parent handle fallback
  if (hasError) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20",
        className,
      )}
      style={{
        aspectRatio: `${width}/${height}`,
        maxHeight: "inherit",
      }}
    >
      {/* UnicornStudio Embed */}
      <div
        data-us-project={projectId}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          transform: "scale(1.1) translateY(-10%)",
          transformOrigin: "center top",
        }}
        className="unicorn-studio-embed absolute inset-0"
      />

      {/* Loading fallback - only show when not loaded */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-800/30 dark:to-emerald-800/30">
          <div className="space-y-2 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
            <p className="text-sm text-green-600 dark:text-green-400">
              Loading interactive content...
            </p>
          </div>
        </div>
      )}

      {/* Hide vendor badge with CSS */}
      <style jsx>{`
        .unicorn-studio-embed :global([data-badge*="unicorn"]),
        .unicorn-studio-embed :global([class*="badge"]),
        .unicorn-studio-embed :global([class*="branding"]),
        .unicorn-studio-embed :global([class*="watermark"]),
        .unicorn-studio-embed :global(a[href*="unicorn.studio"]) {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
      `}</style>
    </div>
  );
}
