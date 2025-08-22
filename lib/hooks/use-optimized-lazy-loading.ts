/**
 * Optimized lazy loading hook with aggressive preloading and performance optimizations
 */
"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

interface NavigatorExtended extends Navigator {
  connection?: {
    effectiveType?: "4g" | "3g" | "2g" | "slow-2g";
    saveData?: boolean;
    downlink?: number;
  };
  mozConnection?: {
    effectiveType?: "4g" | "3g" | "2g" | "slow-2g";
    saveData?: boolean;
    downlink?: number;
  };
  webkitConnection?: {
    effectiveType?: "4g" | "3g" | "2g" | "slow-2g";
    saveData?: boolean;
    downlink?: number;
  };
}

interface LazyLoadingOptions {
  rootMargin?: string;
  threshold?: number;
  preloadDistance?: number;
  enablePreloading?: boolean;
  connectionAware?: boolean;
  priority?: "high" | "medium" | "low";
}

interface ConnectionType {
  effectiveType: "4g" | "3g" | "2g" | "slow-2g";
  saveData: boolean;
  downlink: number;
}

export function useOptimizedLazyLoading({
  rootMargin = "150px", // Increased from 50px for earlier loading
  threshold = 0.01, // Reduced threshold for earlier trigger
  preloadDistance = 300, // Distance in pixels to start preloading
  enablePreloading = true,
  connectionAware = true,
  priority = "medium",
}: LazyLoadingOptions = {}) {
  const [isInView, setIsInView] = useState(false);
  const [shouldPreload, setShouldPreload] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Connection-aware optimization
  const connectionInfo = useMemo(() => {
    if (!connectionAware || typeof navigator === "undefined") {
      return { effectiveType: "4g", saveData: false, downlink: 10 };
    }

    const connection =
      (navigator as NavigatorExtended).connection ||
      (navigator as NavigatorExtended).mozConnection ||
      (navigator as NavigatorExtended).webkitConnection;

    return {
      effectiveType: connection?.effectiveType || "4g",
      saveData: connection?.saveData || false,
      downlink: connection?.downlink || 10,
    } as ConnectionType;
  }, [connectionAware]);

  // Adjust loading strategy based on connection
  const loadingStrategy = useMemo(() => {
    const isFastConnection =
      connectionInfo.effectiveType === "4g" && connectionInfo.downlink > 5;
    const isSlowConnection =
      connectionInfo.effectiveType === "2g" ||
      connectionInfo.effectiveType === "slow-2g" ||
      connectionInfo.saveData;

    return {
      aggressivePreload: isFastConnection && priority === "high",
      earlyLoad: isFastConnection || (!isSlowConnection && priority !== "low"),
      deferLoad: isSlowConnection && priority === "low",
      adaptiveMargin: isFastConnection
        ? "200px"
        : isSlowConnection
          ? "50px"
          : rootMargin,
      adaptiveThreshold: isFastConnection
        ? 0.001
        : isSlowConnection
          ? 0.1
          : threshold,
    };
  }, [connectionInfo, priority, rootMargin, threshold]);

  // Enhanced intersection observer with preloading
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    // Create main observer for visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setIsInView(isIntersecting);

        // Progressive loading based on intersection ratio
        if (isIntersecting) {
          const ratio = entry.intersectionRatio;
          setLoadingProgress(Math.min(ratio * 100, 100));
        }
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: loadingStrategy.adaptiveMargin,
      },
    );

    // Create preload observer for earlier asset loading
    let preloadObserver: IntersectionObserver | null = null;

    if (enablePreloading && loadingStrategy.aggressivePreload) {
      preloadObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldPreload(true);
            preloadObserver?.disconnect();
          }
        },
        {
          threshold: 0,
          rootMargin: `${preloadDistance}px`,
        },
      );
      preloadObserver.observe(element);
    }

    observer.observe(element);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
      preloadObserver?.disconnect();
    };
  }, [elementRef, loadingStrategy, preloadDistance, enablePreloading]);

  // Prefetch resources when should preload
  const prefetchResource = useCallback(
    (url: string, type: "image" | "video" | "script" | "style" = "image") => {
      if (!shouldPreload && !loadingStrategy.aggressivePreload) return;

      const link = document.createElement("link");

      switch (type) {
        case "image":
          link.rel = "prefetch";
          link.as = "image";
          break;
        case "video":
          link.rel = "prefetch";
          link.as = "video";
          break;
        case "script":
          link.rel = "modulepreload";
          break;
        case "style":
          link.rel = "prefetch";
          link.as = "style";
          break;
      }

      link.href = url;

      // Add only if not already present
      if (!document.querySelector(`link[href="${url}"]`)) {
        document.head.appendChild(link);
      }
    },
    [shouldPreload, loadingStrategy.aggressivePreload],
  );

  // Optimized resource loader with progress tracking
  const loadResource = useCallback(
    async (url: string, type: "image" | "video" = "image"): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (type === "image") {
          const img = new Image();
          img.onload = () => {
            setIsLoaded(true);
            setLoadingProgress(100);
            resolve();
          };
          img.onerror = reject;
          img.src = url;
        } else if (type === "video") {
          const video = document.createElement("video");
          video.onloadeddata = () => {
            setIsLoaded(true);
            setLoadingProgress(100);
            resolve();
          };
          video.onerror = reject;
          video.src = url;
          video.load();
        }
      });
    },
    [],
  );

  // Reset loading state
  const resetLoading = useCallback(() => {
    setIsLoaded(false);
    setLoadingProgress(0);
    setShouldPreload(false);
  }, []);

  return {
    elementRef,
    isInView,
    shouldPreload,
    isLoaded,
    loadingProgress,
    connectionInfo,
    loadingStrategy,
    prefetchResource,
    loadResource,
    resetLoading,
    // Helper flags
    shouldLoad: isInView || shouldPreload,
    shouldShowSkeleton: !isLoaded && (isInView || shouldPreload),
    canStartLoading: !loadingStrategy.deferLoad || isInView,
  };
}
