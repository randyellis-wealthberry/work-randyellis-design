"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface UnicornWebGLProps {
  projectId?: string;
  width?: number;
  height?: number;
  className?: string;
  onError?: () => void;
}

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized?: boolean;
      init?: () => void;
    };
  }
}

export const UnicornWebGL = ({
  projectId = "OQ9gv4FdRe0mGlhPlBAz",
  width = 1440,
  height = 900,
  className,
  onError,
}: UnicornWebGLProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    // Intersection Observer for performance optimization
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "50px" },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const loadUnicornStudio = () => {
      try {
        // Check if UnicornStudio is already loaded
        if (window.UnicornStudio?.isInitialized) {
          setIsLoaded(true);
          return;
        }

        // Check if script is already being loaded
        const existingScript = document.querySelector(
          'script[src*="unicornStudio.umd.js"]',
        );
        if (existingScript) {
          existingScript.addEventListener("load", () => {
            if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
              window.UnicornStudio.init?.();
              window.UnicornStudio.isInitialized = true;
            }
            setIsLoaded(true);
          });
          return;
        }

        // Initialize UnicornStudio object if it doesn't exist
        if (!window.UnicornStudio) {
          window.UnicornStudio = { isInitialized: false };
        }

        // Create and load the script
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.28/dist/unicornStudio.umd.js";
        script.async = true;

        script.onload = () => {
          try {
            if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
              window.UnicornStudio.init?.();
              window.UnicornStudio.isInitialized = true;
            }
            setIsLoaded(true);
          } catch (error) {
            console.error("Error initializing UnicornStudio:", error);
            setHasError(true);
            onError?.();
          }
        };

        script.onerror = () => {
          console.error("Failed to load UnicornStudio script");
          setHasError(true);
          onError?.();
        };

        (document.head || document.body).appendChild(script);
      } catch (error) {
        console.error("Error loading UnicornStudio:", error);
        setHasError(true);
        onError?.();
      }
    };

    // Add a small delay to ensure smooth loading
    const timeoutId = setTimeout(loadUnicornStudio, 100);
    return () => clearTimeout(timeoutId);
  }, [isInView, onError]);

  if (hasError) {
    return null; // Return null to let parent handle fallback
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      style={{
        width: "100%",
        height: "100%",
        aspectRatio: `${width} / ${height}`,
      }}
    >
      {isInView && (
        <div
          data-us-project={projectId}
          style={{
            width: "100%",
            height: "100%",
            minHeight: "300px", // Ensure minimum height for proper display
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="unicorn-studio-embed"
        />
      )}

      {/* Loading state */}
      {isInView && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-100"></div>
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
};
