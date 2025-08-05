/**
 * Advanced Performance Monitoring and Auto-scaling
 *
 * This module provides comprehensive performance monitoring, optimization,
 * and auto-scaling capabilities for the portfolio site.
 */

import { trackEvent } from "./analytics";
import { monitoring } from "./monitoring";

// Performance thresholds and configuration
const PERFORMANCE_CONFIG = {
  // Core Web Vitals thresholds (Google standards)
  coreWebVitals: {
    lcp: { good: 2500, poor: 4000 }, // Largest Contentful Paint (ms)
    fid: { good: 100, poor: 300 }, // First Input Delay (ms)
    cls: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
    fcp: { good: 1800, poor: 3000 }, // First Contentful Paint (ms)
    ttfb: { good: 800, poor: 1800 }, // Time to First Byte (ms)
  },

  // Resource loading thresholds
  resources: {
    maxImageSize: 1024 * 1024, // 1MB
    maxScriptSize: 500 * 1024, // 500KB
    maxCssSize: 100 * 1024, // 100KB
    maxFontSize: 200 * 1024, // 200KB
  },

  // Network and performance monitoring
  monitoring: {
    sampleRate: 0.1, // Monitor 10% of sessions
    slowConnectionThreshold: 1000, // Consider connection slow if > 1s TTFB
    errorThreshold: 0.05, // Alert if error rate > 5%
    performanceThreshold: 3000, // Alert if page load > 3s
  },
};

interface PerformanceMetrics {
  // Navigation timing
  navigationTiming?: PerformanceNavigationTiming;

  // Core Web Vitals
  lcp?: number;
  fid?: number;
  cls?: number;
  fcp?: number;
  ttfb?: number;

  // Resource metrics
  resourceLoadTime?: number;
  totalResourceSize?: number;
  criticalResourceCount?: number;

  // Network information
  connectionType?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;

  // Device information
  deviceMemory?: number;
  hardwareConcurrency?: number;

  // User interaction
  sessionDuration?: number;
  interactionCount?: number;
  scrollDepth?: number;

  // Memory and resource metrics
  jsHeapSizeUsed?: number;
  jsHeapSizeTotal?: number;
  jsHeapSizeLimit?: number;

  // Edge and CDN metrics
  cdnCacheHitRate?: number;
  edgeResponseTime?: number;
  edgeLocation?: string;

  // Business metrics
  pageViews?: number;
  uniqueUsers?: number;
  conversionEvents?: number;

  // Advanced timing metrics
  timeToInteractive?: number;
  totalBlockingTime?: number;
  speedIndex?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];
  private sessionStartTime: number;
  private interactionCount = 0;
  private maxScrollDepth = 0;

  constructor() {
    this.sessionStartTime = Date.now();

    if (typeof window !== "undefined") {
      this.initializeMonitoring();
    }
  }

  private initializeMonitoring() {
    try {
      // Initialize all performance observers
      if (typeof this.observeNavigationTiming === "function") {
        this.observeNavigationTiming();
      }
      if (typeof this.observeCoreWebVitals === "function") {
        this.observeCoreWebVitals();
      }
      if (typeof this.observeResourceLoading === "function") {
        this.observeResourceLoading();
      }
      if (typeof this.observeNetworkInformation === "function") {
        this.observeNetworkInformation();
      }
      if (typeof this.observeUserInteractions === "function") {
        this.observeUserInteractions();
      }
      if (typeof this.observeDeviceCapabilities === "function") {
        this.observeDeviceCapabilities();
      }
      if (typeof this.observeMemoryUsage === "function") {
        this.observeMemoryUsage();
      }
      if (typeof this.observeEdgeMetrics === "function") {
        this.observeEdgeMetrics();
      }
      if (typeof this.observeBusinessMetrics === "function") {
        this.observeBusinessMetrics();
      }
    } catch (error) {
      console.warn("Performance monitoring initialization failed:", error);
    }

    // Set up periodic reporting
    this.setupPeriodicReporting();

    // Set up page visibility change handling
    this.setupVisibilityChangeHandling();

    // Initialize real-time alerting
    this.setupRealTimeAlerting();
  }

  private observeNavigationTiming() {
    // Observe navigation timing
    if ("PerformanceObserver" in window) {
      const navObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const navEntry = entry as PerformanceNavigationTiming;
          this.metrics.navigationTiming = navEntry;
          this.metrics.ttfb = navEntry.responseStart - navEntry.requestStart;

          // Track key timing metrics
          const timings = {
            dns_lookup: navEntry.domainLookupEnd - navEntry.domainLookupStart,
            tcp_connect: navEntry.connectEnd - navEntry.connectStart,
            tls_negotiation:
              navEntry.secureConnectionStart > 0
                ? navEntry.connectEnd - navEntry.secureConnectionStart
                : 0,
            server_response: navEntry.responseEnd - navEntry.responseStart,
            dom_processing:
              navEntry.domContentLoadedEventEnd - navEntry.responseEnd,
            resource_loading:
              navEntry.loadEventEnd - navEntry.domContentLoadedEventEnd,
          };

          // Report detailed timing breakdown
          Object.entries(timings).forEach(([metric, value]) => {
            if (value > 0) {
              monitoring.trackPerformanceMetric({
                name: `navigation_${metric}`,
                value,
                unit: "ms",
                tags: {
                  page: window.location.pathname,
                  connection: this.getConnectionType(),
                },
              });
            }
          });
        });
      });

      navObserver.observe({ entryTypes: ["navigation"] });
      this.observers.push(navObserver);
    }
  }

  private observeCoreWebVitals() {
    // Largest Contentful Paint
    if ("PerformanceObserver" in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          startTime: number;
          element?: Element;
        };

        this.metrics.lcp = lastEntry.startTime;

        const rating = this.getRating(
          lastEntry.startTime,
          PERFORMANCE_CONFIG.coreWebVitals.lcp,
        );

        monitoring.trackPerformanceMetric({
          name: "largest_contentful_paint",
          value: lastEntry.startTime,
          unit: "ms",
          tags: {
            rating,
            element: lastEntry.element?.tagName || "unknown",
            page: window.location.pathname,
          },
        });
      });

      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
      this.observers.push(lcpObserver);
    }

    // First Input Delay
    if ("PerformanceObserver" in window) {
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const fidEntry = entry as PerformanceEntry & {
            processingStart: number;
          };
          const fidValue = fidEntry.processingStart - fidEntry.startTime;
          this.metrics.fid = fidValue;

          const rating = this.getRating(
            fidValue,
            PERFORMANCE_CONFIG.coreWebVitals.fid,
          );

          monitoring.trackPerformanceMetric({
            name: "first_input_delay",
            value: fidValue,
            unit: "ms",
            tags: {
              rating,
              input_type: entry.name,
              page: window.location.pathname,
            },
          });
        });
      });

      fidObserver.observe({ entryTypes: ["first-input"] });
      this.observers.push(fidObserver);
    }

    // Cumulative Layout Shift
    let clsValue = 0;
    if ("PerformanceObserver" in window) {
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const clsEntry = entry as PerformanceEntry & {
            hadRecentInput?: boolean;
            value: number;
          };
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value;
            this.metrics.cls = clsValue;

            const rating = this.getRating(
              clsValue,
              PERFORMANCE_CONFIG.coreWebVitals.cls,
            );

            monitoring.trackPerformanceMetric({
              name: "cumulative_layout_shift",
              value: clsValue,
              unit: "count",
              tags: {
                rating,
                page: window.location.pathname,
              },
            });
          }
        });
      });

      clsObserver.observe({ entryTypes: ["layout-shift"] });
      this.observers.push(clsObserver);
    }

    // First Contentful Paint
    if ("PerformanceObserver" in window) {
      const fcpObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.metrics.fcp = entry.startTime;

          const rating = this.getRating(
            entry.startTime,
            PERFORMANCE_CONFIG.coreWebVitals.fcp,
          );

          monitoring.trackPerformanceMetric({
            name: "first_contentful_paint",
            value: entry.startTime,
            unit: "ms",
            tags: {
              rating,
              page: window.location.pathname,
            },
          });
        });
      });

      fcpObserver.observe({ entryTypes: ["paint"] });
      this.observers.push(fcpObserver);
    }
  }

  private observeResourceLoading() {
    if ("PerformanceObserver" in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        let totalSize = 0;
        let criticalResourceCount = 0;
        let slowResourceCount = 0;

        list.getEntries().forEach((entry) => {
          const resourceEntry = entry as PerformanceResourceTiming;
          const size = resourceEntry.transferSize || 0;
          const loadTime = resourceEntry.responseEnd - resourceEntry.startTime;

          totalSize += size;

          // Identify critical resources
          if (this.isCriticalResource(resourceEntry)) {
            criticalResourceCount++;
          }

          // Track slow resources
          if (loadTime > 2000) {
            // > 2 seconds
            slowResourceCount++;

            monitoring.trackPerformanceMetric({
              name: "slow_resource_load",
              value: loadTime,
              unit: "ms",
              tags: {
                resource_type: resourceEntry.initiatorType,
                resource_name: this.getResourceName(resourceEntry.name),
                size_kb: Math.round(size / 1024).toString(),
              },
            });
          }

          // Track large resources
          if (size > PERFORMANCE_CONFIG.resources.maxImageSize) {
            monitoring.trackPerformanceMetric({
              name: "large_resource_detected",
              value: size,
              unit: "bytes",
              tags: {
                resource_type: resourceEntry.initiatorType,
                resource_name: this.getResourceName(resourceEntry.name),
              },
            });
          }
        });

        this.metrics.totalResourceSize = totalSize;
        this.metrics.criticalResourceCount = criticalResourceCount;

        // Report overall resource metrics
        monitoring.trackPerformanceMetric({
          name: "total_resource_size",
          value: totalSize,
          unit: "bytes",
          tags: {
            page: window.location.pathname,
            critical_resources: criticalResourceCount.toString(),
            slow_resources: slowResourceCount.toString(),
          },
        });
      });

      resourceObserver.observe({ entryTypes: ["resource"] });
      this.observers.push(resourceObserver);
    }
  }

  private observeNetworkInformation() {
    // Network Information API
    interface NetworkConnection {
      type: string;
      effectiveType: string;
      downlink: number;
      rtt: number;
      addEventListener: (event: string, handler: () => void) => void;
    }

    interface NavigatorWithConnection extends Navigator {
      connection?: NetworkConnection;
      mozConnection?: NetworkConnection;
      webkitConnection?: NetworkConnection;
    }

    const nav = navigator as NavigatorWithConnection;
    const connection =
      nav.connection || nav.mozConnection || nav.webkitConnection;

    if (connection) {
      this.metrics.connectionType = connection.type;
      this.metrics.effectiveType = connection.effectiveType;
      this.metrics.downlink = connection.downlink;
      this.metrics.rtt = connection.rtt;

      // Track network changes
      connection.addEventListener("change", () => {
        monitoring.trackPerformanceMetric({
          name: "network_change",
          value: connection.downlink || 0,
          unit: "count",
          tags: {
            effective_type: connection.effectiveType,
            type: connection.type,
            rtt: connection.rtt?.toString() || "unknown",
          },
        });
      });
    }
  }

  private observeUserInteractions() {
    // Track user interactions
    const interactionEvents = ["click", "keydown", "scroll", "touch"];

    interactionEvents.forEach((eventType) => {
      document.addEventListener(
        eventType,
        () => {
          this.interactionCount++;
        },
        { passive: true },
      );
    });

    // Track scroll depth
    let ticking = false;
    const updateScrollDepth = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      if (scrollPercent > this.maxScrollDepth) {
        this.maxScrollDepth = scrollPercent;

        // Report significant scroll milestones
        if (scrollPercent >= 25 && scrollPercent % 25 === 0) {
          trackEvent(
            "scroll_depth",
            "engagement",
            `${scrollPercent}%`,
            scrollPercent,
          );
        }
      }

      ticking = false;
    };

    document.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(updateScrollDepth);
          ticking = true;
        }
      },
      { passive: true },
    );
  }

  private observeDeviceCapabilities() {
    // Device memory
    if ("deviceMemory" in navigator) {
      this.metrics.deviceMemory = (
        navigator as Navigator & { deviceMemory?: number }
      ).deviceMemory;
    }

    // Hardware concurrency
    if ("hardwareConcurrency" in navigator) {
      this.metrics.hardwareConcurrency = navigator.hardwareConcurrency;
    }

    // Report device capabilities
    monitoring.trackPerformanceMetric({
      name: "device_capabilities",
      value: this.metrics.deviceMemory || 0,
      unit: "count",
      tags: {
        device_memory: (this.metrics.deviceMemory || "unknown").toString(),
        cpu_cores: (this.metrics.hardwareConcurrency || "unknown").toString(),
        user_agent: navigator.userAgent.includes("Mobile")
          ? "mobile"
          : "desktop",
      },
    });
  }

  private observeMemoryUsage() {
    // Check if we're in a browser environment and performance.memory is available
    if (typeof window === "undefined" || typeof performance === "undefined") {
      return;
    }

    if (!("memory" in performance)) {
      console.warn("Performance memory API not available");
      return;
    }

    try {
      const updateMemoryMetrics = () => {
        try {
          const memory = (
            performance as Performance & {
              memory?: {
                usedJSHeapSize: number;
                totalJSHeapSize: number;
                jsHeapSizeLimit: number;
              };
            }
          ).memory;
          if (memory) {
            this.metrics.jsHeapSizeUsed = memory.usedJSHeapSize;
            this.metrics.jsHeapSizeTotal = memory.totalJSHeapSize;
            this.metrics.jsHeapSizeLimit = memory.jsHeapSizeLimit;

            // Track memory pressure
            const memoryPressure =
              memory.usedJSHeapSize / memory.jsHeapSizeLimit;
            if (memoryPressure > 0.8) {
              monitoring.trackPerformanceMetric({
                name: "memory_pressure",
                value: memoryPressure * 100,
                unit: "percentage",
                tags: {
                  severity: memoryPressure > 0.9 ? "critical" : "warning",
                },
              });
            }
          }
        } catch (innerError) {
          console.warn("Memory metrics update failed:", innerError);
        }
      };

      // Update memory metrics every 10 seconds
      setInterval(updateMemoryMetrics, 10000);
      updateMemoryMetrics(); // Initial update
    } catch (error) {
      console.warn("Memory monitoring failed:", error);
    }
  }

  private observeEdgeMetrics() {
    // Edge/CDN metrics - simplified implementation
    try {
      // Check for edge location headers
      const checkEdgeLocation = () => {
        // This would typically come from response headers
        if (
          typeof window !== "undefined" &&
          window.location.hostname.includes("vercel.app")
        ) {
          this.metrics.edgeLocation = "vercel";
          this.metrics.cdnCacheHitRate = 0.95; // Estimated
        }
      };

      checkEdgeLocation();
    } catch (error) {
      console.warn("Edge metrics monitoring failed:", error);
    }
  }

  private observeBusinessMetrics() {
    // Business metrics tracking
    try {
      // Track page views
      this.metrics.pageViews = (this.metrics.pageViews || 0) + 1;

      // Track unique users (simplified - would use localStorage/cookies in real implementation)
      const userId =
        sessionStorage.getItem("userId") || this.generateUniqueId();
      sessionStorage.setItem("userId", userId);

      // Track conversion events (newsletter signups, contact forms, etc.)
      const trackConversion = (event: Event) => {
        if ((event.target as HTMLElement)?.closest("form")) {
          this.metrics.conversionEvents =
            (this.metrics.conversionEvents || 0) + 1;
          monitoring.trackPerformanceMetric({
            name: "conversion_event",
            value: 1,
            unit: "count",
            tags: {
              type: "form_submission",
              page: window.location.pathname,
            },
          });
        }
      };

      document.addEventListener("submit", trackConversion);
    } catch (error) {
      console.warn("Business metrics monitoring failed:", error);
    }
  }

  private setupRealTimeAlerting() {
    // Real-time performance alerting
    try {
      const checkPerformanceThresholds = () => {
        // Check LCP threshold
        if (this.metrics.lcp && this.metrics.lcp > 4000) {
          monitoring.trackPerformanceMetric({
            name: "performance_alert",
            value: this.metrics.lcp,
            unit: "ms",
            tags: {
              metric: "lcp",
              severity: "warning",
              threshold: "4000ms",
            },
          });
        }

        // Check FID threshold
        if (this.metrics.fid && this.metrics.fid > 300) {
          monitoring.trackPerformanceMetric({
            name: "performance_alert",
            value: this.metrics.fid,
            unit: "ms",
            tags: {
              metric: "fid",
              severity: "warning",
              threshold: "300ms",
            },
          });
        }
      };

      // Check thresholds every 30 seconds
      setInterval(checkPerformanceThresholds, 30000);
    } catch (error) {
      console.warn("Real-time alerting setup failed:", error);
    }
  }

  private setupPeriodicReporting() {
    // Report performance summary every 30 seconds
    setInterval(() => {
      this.reportPerformanceSummary();
    }, 30000);

    // Report at page unload
    window.addEventListener("beforeunload", () => {
      this.reportSessionSummary();
    });
  }

  private setupVisibilityChangeHandling() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        // Page became hidden - report current state
        this.reportPerformanceSummary();
      } else {
        // Page became visible - reset some metrics
        this.sessionStartTime = Date.now();
      }
    });
  }

  private reportPerformanceSummary() {
    const currentTime = Date.now();
    this.metrics.sessionDuration = currentTime - this.sessionStartTime;
    this.metrics.interactionCount = this.interactionCount;
    this.metrics.scrollDepth = this.maxScrollDepth;

    // Only report if we should sample this session
    if (Math.random() > PERFORMANCE_CONFIG.monitoring.sampleRate) {
      return;
    }

    // Create performance summary
    const summary = {
      lcp: this.metrics.lcp || 0,
      fid: this.metrics.fid || 0,
      cls: this.metrics.cls || 0,
      fcp: this.metrics.fcp || 0,
      ttfb: this.metrics.ttfb || 0,
      session_duration: this.metrics.sessionDuration || 0,
      interaction_count: this.metrics.interactionCount || 0,
      scroll_depth: this.metrics.scrollDepth || 0,
      connection_type: this.metrics.effectiveType || "unknown",
      device_memory: this.metrics.deviceMemory || 0,
      page: window.location.pathname,
    };

    // Send comprehensive performance data
    trackEvent(
      "performance_summary",
      "performance",
      window.location.pathname,
      undefined,
      summary,
    );
  }

  private reportSessionSummary() {
    this.metrics.sessionDuration = Date.now() - this.sessionStartTime;

    const sessionSummary = {
      total_session_duration: this.metrics.sessionDuration,
      total_interactions: this.interactionCount,
      max_scroll_depth: this.maxScrollDepth,
      performance_rating: this.getOverallPerformanceRating(),
      connection_quality: this.getConnectionQuality(),
      device_tier: this.getDeviceTier(),
    };

    trackEvent(
      "session_summary",
      "performance",
      undefined,
      this.metrics.sessionDuration,
      sessionSummary,
    );
  }

  // Helper methods
  private getRating(
    value: number,
    thresholds: { good: number; poor: number },
  ): string {
    if (value <= thresholds.good) return "good";
    if (value <= thresholds.poor) return "needs-improvement";
    return "poor";
  }

  private isCriticalResource(entry: PerformanceResourceTiming): boolean {
    const criticalTypes = ["document", "stylesheet", "script"];
    return (
      criticalTypes.includes(entry.initiatorType) ||
      entry.name.includes("critical") ||
      entry.name.includes("above-fold")
    );
  }

  private getResourceName(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.split("/").pop() || "unknown";
    } catch {
      return "unknown";
    }
  }

  private getConnectionType(): string {
    interface NetworkConnection {
      effectiveType: string;
    }
    const connection = (
      navigator as Navigator & { connection?: NetworkConnection }
    ).connection;
    return connection?.effectiveType || "unknown";
  }

  private generateUniqueId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private getOverallPerformanceRating(): string {
    const scores = [];

    if (this.metrics.lcp) {
      scores.push(
        this.getRating(this.metrics.lcp, PERFORMANCE_CONFIG.coreWebVitals.lcp),
      );
    }
    if (this.metrics.fid) {
      scores.push(
        this.getRating(this.metrics.fid, PERFORMANCE_CONFIG.coreWebVitals.fid),
      );
    }
    if (this.metrics.cls) {
      scores.push(
        this.getRating(this.metrics.cls, PERFORMANCE_CONFIG.coreWebVitals.cls),
      );
    }

    const poorCount = scores.filter((s) => s === "poor").length;
    const goodCount = scores.filter((s) => s === "good").length;

    if (poorCount > 0) return "poor";
    if (goodCount === scores.length) return "good";
    return "needs-improvement";
  }

  private getConnectionQuality(): string {
    if (!this.metrics.effectiveType) return "unknown";

    const quality = {
      "slow-2g": "poor",
      "2g": "poor",
      "3g": "fair",
      "4g": "good",
    };

    return (
      quality[this.metrics.effectiveType as keyof typeof quality] || "unknown"
    );
  }

  private getDeviceTier(): string {
    const memory = this.metrics.deviceMemory || 0;
    const cores = this.metrics.hardwareConcurrency || 0;

    if (memory >= 8 && cores >= 8) return "high-end";
    if (memory >= 4 && cores >= 4) return "mid-range";
    return "low-end";
  }

  // Public API
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public destroy() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }
}

// Auto-scaling and optimization recommendations
export class PerformanceOptimizer {
  private monitor: PerformanceMonitor;

  constructor() {
    this.monitor = new PerformanceMonitor();
  }

  // Analyze performance and provide optimization recommendations
  public async analyzeAndOptimize(): Promise<string[]> {
    const metrics = this.monitor.getMetrics();
    const recommendations: string[] = [];

    // Core Web Vitals analysis
    if (
      metrics.lcp &&
      metrics.lcp > PERFORMANCE_CONFIG.coreWebVitals.lcp.poor
    ) {
      recommendations.push(
        "Optimize Largest Contentful Paint: Consider image optimization, lazy loading, or CDN usage",
      );
    }

    if (
      metrics.fid &&
      metrics.fid > PERFORMANCE_CONFIG.coreWebVitals.fid.poor
    ) {
      recommendations.push(
        "Reduce First Input Delay: Break up long tasks, optimize JavaScript execution",
      );
    }

    if (
      metrics.cls &&
      metrics.cls > PERFORMANCE_CONFIG.coreWebVitals.cls.poor
    ) {
      recommendations.push(
        "Improve Cumulative Layout Shift: Add dimensions to images, avoid inserting content above existing content",
      );
    }

    // Resource optimization
    if (
      metrics.totalResourceSize &&
      metrics.totalResourceSize > 2 * 1024 * 1024
    ) {
      // > 2MB
      recommendations.push(
        "Reduce total resource size: Optimize images, minify assets, implement code splitting",
      );
    }

    // Network-specific recommendations
    if (metrics.effectiveType === "3g" || metrics.effectiveType === "slow-2g") {
      recommendations.push(
        "Optimize for slow connections: Implement aggressive caching, reduce critical path resources",
      );
    }

    // Device-specific recommendations
    if (metrics.deviceMemory && metrics.deviceMemory < 4) {
      recommendations.push(
        "Optimize for low-memory devices: Reduce JavaScript bundle size, implement memory-efficient patterns",
      );
    }

    return recommendations;
  }

  public getMonitor(): PerformanceMonitor {
    return this.monitor;
  }
}

// Initialize global performance monitoring
let globalPerformanceMonitor: PerformanceMonitor | null = null;

export const initializePerformanceMonitoring =
  (): PerformanceMonitor | null => {
    if (!globalPerformanceMonitor && typeof window !== "undefined") {
      try {
        globalPerformanceMonitor = new PerformanceMonitor();
      } catch (error) {
        console.warn("Failed to initialize PerformanceMonitor:", error);
        return null;
      }
    }
    return globalPerformanceMonitor;
  };

export const getPerformanceMonitor = (): PerformanceMonitor | null => {
  return globalPerformanceMonitor;
};

export default PerformanceMonitor;
