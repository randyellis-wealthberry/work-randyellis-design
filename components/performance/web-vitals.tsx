"use client";

import { useEffect } from "react";
import { useReportWebVitals } from "next/web-vitals";

// Use existing va interface from Vercel Analytics

// Web Vitals reporting for performance monitoring
export function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    // Log metrics in development
    if (process.env.NODE_ENV === "development") {
      console.log("Web Vital:", metric);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === "production") {
      // Send to Vercel Analytics
      if (typeof window !== "undefined" && "va" in window) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).va?.("track", "Web Vital", {
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
        });
      }

      // Send to Google Analytics
      if (window.gtag) {
        window.gtag("event", metric.name, {
          event_category: "Web Vitals",
          event_label: metric.id,
          value: Math.round(
            metric.name === "CLS" ? metric.value * 1000 : metric.value,
          ),
          non_interaction: true,
          custom_map: {
            metric_rating: metric.rating,
            metric_delta: metric.delta,
          },
        });
      }

      // Send to custom analytics endpoint
      fetch("/api/analytics/web-vitals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...metric,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
        }),
      }).catch((err) => console.warn("Failed to send web vitals:", err));
    }
  });

  return null;
}

// Component for tracking specific performance metrics
export function PerformanceMetrics() {
  useEffect(() => {
    // Track custom performance metrics
    const trackCustomMetrics = () => {
      // Time to First Byte (TTFB)
      const navigationTiming = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      if (navigationTiming) {
        const ttfb =
          navigationTiming.responseStart - navigationTiming.requestStart;

        if (window.va) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).va?.("track", "TTFB", {
            value: Math.round(ttfb),
            rating:
              ttfb <= 800
                ? "good"
                : ttfb <= 1800
                  ? "needs-improvement"
                  : "poor",
          });
        }
      }

      // Resource loading metrics
      const resources = performance.getEntriesByType("resource");
      const totalResourceSize = resources.reduce((total, resource) => {
        return (
          total + ((resource as PerformanceResourceTiming).transferSize || 0)
        );
      }, 0);

      if (window.va) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).va?.("track", "Resource Size", {
          value: Math.round(totalResourceSize / 1024), // KB
          count: resources.length,
        });
      }

      // Memory usage (if available)
      if ("memory" in performance) {
        const memory = (
          performance as Performance & {
            memory?: {
              usedJSHeapSize: number;
              totalJSHeapSize: number;
              jsHeapSizeLimit: number;
            };
          }
        ).memory;
        if (window.va && memory) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).va?.("track", "Memory Usage", {
            used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
            total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
            limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024), // MB
          });
        }
      }

      // Connection information
      interface Connection {
        effectiveType: string;
        downlink: number;
        rtt: number;
        saveData: boolean;
      }

      interface NavigatorWithConnection extends Navigator {
        connection?: Connection;
        mozConnection?: Connection;
        webkitConnection?: Connection;
      }

      const nav = navigator as NavigatorWithConnection;
      const connection =
        nav.connection || nav.mozConnection || nav.webkitConnection;

      if (connection && window.va) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).va?.("track", "Connection", {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData,
        });
      }
    };

    // Track metrics when page is fully loaded
    if (document.readyState === "complete") {
      trackCustomMetrics();
    } else {
      window.addEventListener("load", trackCustomMetrics);
    }

    // Track interaction metrics
    let interactionCount = 0;
    const trackInteraction = () => {
      interactionCount++;

      // Report interaction count every 10 interactions
      if (interactionCount % 10 === 0 && window.va) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).va?.("track", "User Interactions", {
          count: interactionCount,
        });
      }
    };

    // Track various interaction types
    ["click", "keydown", "scroll", "touchstart"].forEach((eventType) => {
      document.addEventListener(eventType, trackInteraction, { passive: true });
    });

    // Cleanup
    return () => {
      window.removeEventListener("load", trackCustomMetrics);
      ["click", "keydown", "scroll", "touchstart"].forEach((eventType) => {
        document.removeEventListener(eventType, trackInteraction);
      });
    };
  }, []);

  return null;
}

// Component for tracking page-specific performance
export function PagePerformanceTracker({ pageName }: { pageName: string }) {
  useEffect(() => {
    const startTime = Date.now();

    // Track time spent on page
    return () => {
      const timeOnPage = Date.now() - startTime;

      if (window.va) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).va?.("track", "Time on Page", {
          page: pageName,
          duration: timeOnPage,
          durationSeconds: Math.round(timeOnPage / 1000),
        });
      }
    };
  }, [pageName]);

  return null;
}

// Real-time performance monitoring for development
export function DevelopmentPerformanceMonitor() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    // Create performance observer for real-time monitoring
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Log slow resources
          if (entry.entryType === "resource" && entry.duration > 1000) {
            console.warn("Slow resource detected:", {
              name: entry.name,
              duration: Math.round(entry.duration),
              size: (entry as PerformanceResourceTiming).transferSize || 0,
            });
          }

          // Log layout shifts
          if (
            entry.entryType === "layout-shift" &&
            !(entry as PerformanceEntry & { hadRecentInput?: boolean })
              .hadRecentInput
          ) {
            const shift = entry as PerformanceEntry & {
              value: number;
              sources: unknown[];
            };
            if (shift.value > 0.1) {
              console.warn("Large layout shift detected:", {
                value: shift.value,
                sources: (
                  shift.sources as Array<{
                    node?: Element;
                    currentRect?: DOMRect;
                    previousRect?: DOMRect;
                  }>
                )?.map((source) => ({
                  element: source.node?.tagName || "unknown",
                  previousRect: source.previousRect,
                  currentRect: source.currentRect,
                })),
              });
            }
          }

          // Log long tasks
          if (entry.entryType === "longtask") {
            console.warn("Long task detected:", {
              duration: Math.round(entry.duration),
              startTime: Math.round(entry.startTime),
            });
          }
        });
      });

      // Observe different performance entry types
      try {
        observer.observe({
          entryTypes: ["resource", "layout-shift", "longtask"],
        });
      } catch (error) {
        console.warn("Some performance observation not supported:", error);
      }

      return () => observer.disconnect();
    }
  }, []);

  return null;
}

// Performance budget checker component
export function PerformanceBudgetChecker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const checkBudgets = () => {
      // Check JavaScript bundle size
      const resources = performance.getEntriesByType(
        "resource",
      ) as PerformanceResourceTiming[];
      const jsSize = resources
        .filter((resource) => resource.name.includes(".js"))
        .reduce((total, resource) => total + (resource.transferSize || 0), 0);

      const jsBudget = 500 * 1024; // 500KB
      if (jsSize > jsBudget) {
        console.warn(
          `JavaScript budget exceeded: ${Math.round(jsSize / 1024)}KB (budget: ${Math.round(jsBudget / 1024)}KB)`,
        );
      }

      // Check image sizes
      const imageSize = resources
        .filter((resource) => {
          const name = resource.name.toLowerCase();
          return (
            name.includes(".jpg") ||
            name.includes(".png") ||
            name.includes(".webp") ||
            name.includes(".avif")
          );
        })
        .reduce((total, resource) => total + (resource.transferSize || 0), 0);

      const imageBudget = 2 * 1024 * 1024; // 2MB
      if (imageSize > imageBudget) {
        console.warn(
          `Image budget exceeded: ${Math.round(imageSize / 1024 / 1024)}MB (budget: ${Math.round(imageBudget / 1024 / 1024)}MB)`,
        );
      }

      // Check Core Web Vitals
      if ("PerformanceObserver" in window) {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === "largest-contentful-paint") {
              const lcp = entry.startTime;
              if (lcp > 2500) {
                console.warn(
                  `LCP budget exceeded: ${Math.round(lcp)}ms (budget: 2500ms)`,
                );
              }
            }
          });
        });

        observer.observe({ entryTypes: ["largest-contentful-paint"] });
      }
    };

    // Check budgets after page load
    window.addEventListener("load", checkBudgets);

    return () => {
      window.removeEventListener("load", checkBudgets);
    };
  }, []);

  return null;
}

// Main performance tracking component
export function PerformanceTracker({ pageName }: { pageName?: string }) {
  return (
    <>
      <WebVitalsReporter />
      <PerformanceMetrics />
      {pageName && <PagePerformanceTracker pageName={pageName} />}
      <DevelopmentPerformanceMonitor />
      <PerformanceBudgetChecker />
    </>
  );
}
