/**
 * Performance monitoring component to track lazy loading improvements
 */
"use client";

import { useEffect, useRef } from "react";

interface PerformanceMetrics {
  lazyLoadCount: number;
  totalLoadTime: number;
  averageLoadTime: number;
  connectionType: string;
  largestContentfulPaint?: number;
  firstContentfulPaint?: number;
}

interface Connection {
  effectiveType: string;
}

interface NavigatorWithConnection extends Navigator {
  connection?: Connection;
  mozConnection?: Connection;
  webkitConnection?: Connection;
}

export function PerformanceMonitor() {
  const metricsRef = useRef<PerformanceMetrics>({
    lazyLoadCount: 0,
    totalLoadTime: 0,
    averageLoadTime: 0,
    connectionType: "unknown",
  });

  useEffect(() => {
    // Track connection type
    const connection =
      (navigator as NavigatorWithConnection).connection ||
      (navigator as NavigatorWithConnection).mozConnection ||
      (navigator as NavigatorWithConnection).webkitConnection;
    if (connection) {
      metricsRef.current.connectionType = connection.effectiveType;
    }

    // Track Core Web Vitals
    const trackCoreWebVitals = () => {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          metricsRef.current.firstContentfulPaint = entries[0].startTime;
          console.debug("First Contentful Paint:", entries[0].startTime);
        }
      });
      fcpObserver.observe({ entryTypes: ["paint"] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metricsRef.current.largestContentfulPaint = lastEntry.startTime;
        console.debug("Largest Contentful Paint:", lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
    };

    // Track lazy loading performance
    const trackLazyLoading = () => {
      const lazyLoadObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (
            entry.name.includes("lazy-load") ||
            entry.entryType === "measure"
          ) {
            metricsRef.current.lazyLoadCount++;
            metricsRef.current.totalLoadTime += entry.duration || 0;
            metricsRef.current.averageLoadTime =
              metricsRef.current.totalLoadTime /
              metricsRef.current.lazyLoadCount;

            console.debug("Lazy load metric:", {
              name: entry.name,
              duration: entry.duration,
              average: metricsRef.current.averageLoadTime,
            });
          }
        });
      });
      lazyLoadObserver.observe({ entryTypes: ["measure", "navigation"] });
    };

    // Initialize tracking
    trackCoreWebVitals();
    trackLazyLoading();

    // Report metrics after page load
    const reportMetrics = () => {
      setTimeout(() => {
        const metrics = metricsRef.current;
        console.group("🚀 Lazy Loading Performance Report");
        console.log("Connection Type:", metrics.connectionType);
        console.log("Lazy Loads:", metrics.lazyLoadCount);
        console.log(
          "Average Load Time:",
          metrics.averageLoadTime.toFixed(2) + "ms",
        );
        console.log(
          "First Contentful Paint:",
          metrics.firstContentfulPaint?.toFixed(2) + "ms",
        );
        console.log(
          "Largest Contentful Paint:",
          metrics.largestContentfulPaint?.toFixed(2) + "ms",
        );
        console.groupEnd();

        // Send to analytics (optional)
        if (
          typeof window !== "undefined" &&
          typeof window.gtag === "function"
        ) {
          window.gtag("event", "lazy_loading_performance", {
            event_category: "Performance",
            connection_type: metrics.connectionType,
            lazy_load_count: metrics.lazyLoadCount,
            average_load_time: metrics.averageLoadTime,
            fcp: metrics.firstContentfulPaint,
            lcp: metrics.largestContentfulPaint,
          });
        }
      }, 5000); // Report after 5 seconds
    };

    if (document.readyState === "complete") {
      reportMetrics();
    } else {
      window.addEventListener("load", reportMetrics);
    }

    return () => {
      window.removeEventListener("load", reportMetrics);
    };
  }, []);

  // Development-only performance panel
  if (process.env.NODE_ENV === "development") {
    return (
      <div className="fixed right-4 bottom-4 z-50">
        <details className="rounded bg-black/80 p-2 text-xs text-white backdrop-blur">
          <summary className="cursor-pointer">📊 Performance</summary>
          <div className="mt-2 min-w-48 space-y-1">
            <div>Connection: {metricsRef.current.connectionType}</div>
            <div>Lazy Loads: {metricsRef.current.lazyLoadCount}</div>
            <div>
              Avg Load: {metricsRef.current.averageLoadTime.toFixed(1)}ms
            </div>
            {metricsRef.current.firstContentfulPaint && (
              <div>
                FCP: {metricsRef.current.firstContentfulPaint.toFixed(1)}ms
              </div>
            )}
            {metricsRef.current.largestContentfulPaint && (
              <div>
                LCP: {metricsRef.current.largestContentfulPaint.toFixed(1)}ms
              </div>
            )}
          </div>
        </details>
      </div>
    );
  }

  return null;
}

// Hook for tracking individual component performance
export function usePerformanceTracking(componentName: string) {
  const startTimeRef = useRef<number | undefined>(undefined);

  const markStart = () => {
    startTimeRef.current = performance.now();
  };

  const markEnd = () => {
    if (startTimeRef.current) {
      const duration = performance.now() - startTimeRef.current;
      performance.mark(`${componentName}-end`);
      performance.measure(`lazy-load-${componentName}`, {
        start: startTimeRef.current,
        end: performance.now(),
      });
      return duration;
    }
    return 0;
  };

  return { markStart, markEnd };
}
