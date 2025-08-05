"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      registerServiceWorker();
    }
  }, []);

  return null;
}

async function registerServiceWorker() {
  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });

    console.log("Service Worker registered successfully:", registration);

    // Handle updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;

      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // New content is available
              console.log("New content is available; please refresh.");

              // Optionally show a notification to user
              if (
                "Notification" in window &&
                Notification.permission === "granted"
              ) {
                new Notification("Update Available", {
                  body: "New content is available. Please refresh the page.",
                  icon: "/icons/icon-192x192.png",
                  badge: "/icons/icon-192x192.png",
                });
              }
            } else {
              // Content is cached for offline use
              console.log("Content is cached for offline use.");
            }
          }
        });
      }
    });

    // Send performance data to service worker
    if (registration.active) {
      sendPerformanceDataToSW(registration);
    }

    // Listen for service worker messages
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data && event.data.type === "CACHE_UPDATED") {
        console.log("Cache updated:", event.data.url);
      }
    });
  } catch (error) {
    console.error("Service Worker registration failed:", error);
  }
}

function sendPerformanceDataToSW(registration: ServiceWorkerRegistration) {
  // Send performance metrics to service worker for caching
  if ("PerformanceObserver" in window) {
    const sendMetrics = () => {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType("paint");

      const metrics = {
        navigation: {
          domContentLoaded:
            navigation.domContentLoadedEventEnd -
            navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          responseTime: navigation.responseEnd - navigation.requestStart,
          transferSize: navigation.transferSize,
          encodedBodySize: navigation.encodedBodySize,
          decodedBodySize: navigation.decodedBodySize,
        },
        paint: paint.reduce(
          (acc, entry) => {
            acc[entry.name] = entry.startTime;
            return acc;
          },
          {} as Record<string, number>,
        ),
        resources: performance.getEntriesByType("resource").length,
        timestamp: Date.now(),
      };

      registration.active?.postMessage({
        type: "PERFORMANCE_REPORT",
        metrics,
      });
    };

    // Send initial metrics
    if (document.readyState === "complete") {
      sendMetrics();
    } else {
      window.addEventListener("load", sendMetrics);
    }
  }
}

// Critical resource preloader
export function CriticalResourcePreloader() {
  useEffect(() => {
    const preloadCriticalResources = () => {
      const criticalResources = [
        // Critical images
        { href: "/images/randyellis-official-avatar.png", as: "image" },

        // Critical styles (if externally hosted)
        // { href: '/styles/critical.css', as: 'style' }
      ];

      criticalResources.forEach(
        ({ href, as, type }: { href: string; as: string; type?: string }) => {
          const link = document.createElement("link");
          link.rel = "preload";
          link.href = href;
          link.as = as;
          if (type) link.type = type;
          link.crossOrigin = "anonymous";

          // Add to head if not already present
          if (!document.querySelector(`link[href="${href}"]`)) {
            document.head.appendChild(link);
          }
        },
      );

      // Preload critical routes
      const criticalRoutes = ["/projects", "/about"];
      criticalRoutes.forEach((route) => {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = route;
        document.head.appendChild(link);
      });
    };

    // Preload on idle or after 2 seconds
    if ("requestIdleCallback" in window) {
      requestIdleCallback(preloadCriticalResources);
    } else {
      setTimeout(preloadCriticalResources, 2000);
    }
  }, []);

  return null;
}

// Connection awareness optimization
export function ConnectionAwareOptimizer() {
  useEffect(() => {
    interface Connection {
      effectiveType: string;
      downlink: number;
      addEventListener: (event: string, handler: () => void) => void;
      removeEventListener: (event: string, handler: () => void) => void;
    }

    interface NavigatorWithConnection extends Navigator {
      connection?: Connection;
      mozConnection?: Connection;
      webkitConnection?: Connection;
    }

    const nav = navigator as NavigatorWithConnection;
    const connection =
      nav.connection || nav.mozConnection || nav.webkitConnection;

    if (connection) {
      const optimizeForConnection = () => {
        const effectiveType = connection.effectiveType;
        const downlink = connection.downlink;

        // Adjust image quality based on connection
        const images = document.querySelectorAll("img[data-optimize]");
        images.forEach((img) => {
          const originalSrc =
            img.getAttribute("data-src") || img.getAttribute("src");
          if (originalSrc) {
            let optimizedSrc = originalSrc;

            // Reduce quality for slow connections
            if (
              effectiveType === "2g" ||
              effectiveType === "slow-2g" ||
              downlink < 1
            ) {
              optimizedSrc = originalSrc.replace(/quality=\d+/, "quality=50");
              optimizedSrc = optimizedSrc.replace(/w_\d+/, "w_800"); // Reduce width
            } else if (effectiveType === "3g" || downlink < 2) {
              optimizedSrc = originalSrc.replace(/quality=\d+/, "quality=70");
            }

            if (img.getAttribute("src") !== optimizedSrc) {
              img.setAttribute("src", optimizedSrc);
            }
          }
        });

        // Disable autoplay videos on slow connections
        if (effectiveType === "2g" || effectiveType === "slow-2g") {
          const videos = document.querySelectorAll("video[autoplay]");
          videos.forEach((video) => {
            (video as HTMLVideoElement).autoplay = false;
            video.setAttribute("preload", "none");
          });
        }
      };

      // Initial optimization
      optimizeForConnection();

      // Listen for connection changes
      connection.addEventListener("change", optimizeForConnection);

      return () => {
        connection.removeEventListener("change", optimizeForConnection);
      };
    }
  }, []);

  return null;
}
