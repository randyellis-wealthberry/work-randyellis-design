/**
 * Global performance configuration for lazy loading optimizations
 */

export interface PerformanceConfig {
  // Intersection Observer settings
  intersectionRootMargin: {
    high: string;
    medium: string;
    low: string;
  };
  intersectionThreshold: {
    high: number;
    medium: number;
    low: number;
  };

  // Preloading settings
  preloadDistance: {
    high: number;
    medium: number;
    low: number;
  };

  // Connection-aware settings
  connectionThresholds: {
    enableWebGLOn: string[];
    enableVideoPreloadOn: string[];
    enableImagePreloadOn: string[];
  };

  // Performance budgets
  budgets: {
    maxConcurrentLoads: number;
    videoQualityByConnection: Record<string, number>;
    imageQualityByConnection: Record<string, number>;
  };
}

export const PERFORMANCE_CONFIG: PerformanceConfig = {
  // More aggressive intersection margins for faster loading
  intersectionRootMargin: {
    high: "300px", // Start loading 300px before element enters viewport
    medium: "150px", // Start loading 150px before element enters viewport
    low: "50px", // Start loading 50px before element enters viewport
  },

  // Lower thresholds for earlier triggering
  intersectionThreshold: {
    high: 0.001, // Trigger as soon as any pixel is visible
    medium: 0.01, // Trigger when 1% is visible
    low: 0.1, // Trigger when 10% is visible
  },

  // Preload distances for critical content
  preloadDistance: {
    high: 500, // Start preloading 500px away
    medium: 300, // Start preloading 300px away
    low: 150, // Start preloading 150px away
  },

  // Connection-aware loading
  connectionThresholds: {
    enableWebGLOn: ["4g"],
    enableVideoPreloadOn: ["4g", "3g"],
    enableImagePreloadOn: ["4g", "3g", "2g"],
  },

  // Performance budgets
  budgets: {
    maxConcurrentLoads: 3,
    videoQualityByConnection: {
      "4g": 85,
      "3g": 65,
      "2g": 45,
      "slow-2g": 35,
    },
    imageQualityByConnection: {
      "4g": 90,
      "3g": 75,
      "2g": 60,
      "slow-2g": 45,
    },
  },
};

// Helper functions
export function getConfigForPriority(priority: "high" | "medium" | "low") {
  return {
    rootMargin: PERFORMANCE_CONFIG.intersectionRootMargin[priority],
    threshold: PERFORMANCE_CONFIG.intersectionThreshold[priority],
    preloadDistance: PERFORMANCE_CONFIG.preloadDistance[priority],
  };
}

export function shouldEnableFeatureForConnection(
  feature: keyof typeof PERFORMANCE_CONFIG.connectionThresholds,
  connectionType: string,
): boolean {
  return PERFORMANCE_CONFIG.connectionThresholds[feature].includes(
    connectionType,
  );
}

export function getQualityForConnection(
  type: "video" | "image",
  connectionType: string,
): number {
  const qualityMap =
    type === "video"
      ? PERFORMANCE_CONFIG.budgets.videoQualityByConnection
      : PERFORMANCE_CONFIG.budgets.imageQualityByConnection;

  return qualityMap[connectionType] || qualityMap["2g"];
}

// Global performance hints
export function addResourceHints() {
  if (typeof document === "undefined") return;

  // Add DNS prefetch for external domains
  const domains = [
    "fonts.googleapis.com",
    "fonts.gstatic.com",
    "www.google-analytics.com",
    "vercel.live",
  ];

  domains.forEach((domain) => {
    if (!document.querySelector(`link[href="//${domain}"]`)) {
      const link = document.createElement("link");
      link.rel = "dns-prefetch";
      link.href = `//${domain}`;
      document.head.appendChild(link);
    }
  });

  // Add preconnect for critical resources
  const preconnectDomains = [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
  ];

  preconnectDomains.forEach((domain) => {
    if (!document.querySelector(`link[href="${domain}"]`)) {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = domain;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    }
  });
}

// Performance monitoring
export function trackPerformanceMetrics() {
  if (typeof window === "undefined") return;

  // Track lazy loading performance
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.entryType === "measure" && entry.name.includes("lazy-load")) {
        console.debug("Lazy load timing:", entry.name, entry.duration);
      }
    });
  });

  observer.observe({ entryTypes: ["measure"] });

  // Track largest contentful paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.debug("LCP:", lastEntry.startTime);
  });

  lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
}
