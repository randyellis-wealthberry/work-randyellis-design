/**
 * Comprehensive Monitoring and Error Tracking
 *
 * This module provides enterprise-grade monitoring capabilities including:
 * - Error tracking and alerting
 * - Performance monitoring
 * - Real User Monitoring (RUM)
 * - Custom metrics and dashboards
 * - Health checks and uptime monitoring
 */

import { trackEvent } from "./analytics";

// Types for monitoring data
interface ErrorContext {
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  timestamp?: number;
  severity?: "low" | "medium" | "high" | "critical";
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: "ms" | "bytes" | "count" | "percentage";
  timestamp?: number;
  tags?: Record<string, string>;
}

interface HealthCheckResult {
  service: string;
  status: "healthy" | "degraded" | "unhealthy";
  responseTime?: number;
  message?: string;
  timestamp: number;
}

class MonitoringService {
  private static instance: MonitoringService;
  private sessionId: string;
  private startTime: number;
  private performanceObserver?: PerformanceObserver;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();

    if (typeof window !== "undefined") {
      this.initializeClientMonitoring();
    }
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeClientMonitoring() {
    // Performance monitoring
    this.initializePerformanceObserver();

    // Error tracking
    this.initializeErrorHandlers();

    // Resource monitoring
    this.initializeResourceMonitoring();

    // User interaction tracking
    this.initializeInteractionTracking();
  }

  private initializePerformanceObserver() {
    if ("PerformanceObserver" in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.trackPerformanceMetric({
            name: entry.name,
            value: entry.duration || 0,
            unit: "ms",
            tags: {
              entryType: entry.entryType,
              sessionId: this.sessionId,
            },
          });
        });
      });

      this.performanceObserver.observe({
        entryTypes: [
          "navigation",
          "measure",
          "paint",
          "largest-contentful-paint",
        ],
      });
    }
  }

  private initializeErrorHandlers() {
    // JavaScript errors
    window.addEventListener("error", (event) => {
      this.trackError(event.error || new Error(event.message), {
        url: event.filename,
        severity: "high",
        tags: {
          type: "javascript_error",
          line: event.lineno?.toString(),
          column: event.colno?.toString(),
        },
      });
    });

    // Promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.trackError(new Error(event.reason), {
        severity: "high",
        tags: {
          type: "unhandled_promise_rejection",
        },
      });
    });

    // Resource loading errors
    window.addEventListener(
      "error",
      (event) => {
        if (event.target !== window) {
          try {
            const target = event.target as Element & {
              src?: string;
              href?: string;
            };
            const resourceSrc = target?.src || target?.href;
            const tagName = target?.tagName?.toLowerCase();

            // Only track legitimate resource failures, not unknown/internal errors
            if (
              resourceSrc &&
              typeof resourceSrc === "string" &&
              resourceSrc.length > 0 &&
              !resourceSrc.startsWith("data:") &&
              !resourceSrc.startsWith("blob:") &&
              !resourceSrc.includes("chrome-extension://") &&
              !resourceSrc.includes("moz-extension://") &&
              tagName &&
              [
                "img",
                "script",
                "link",
                "iframe",
                "video",
                "audio",
                "source",
              ].includes(tagName)
            ) {
              this.trackError(
                new Error(`Resource failed to load: ${resourceSrc}`),
                {
                  severity: "medium",
                  tags: {
                    type: "resource_error",
                    resource: tagName,
                    url: resourceSrc.substring(0, 100), // Limit URL length
                  },
                },
              );
            }
          } catch (error) {
            // Silently fail for resource tracking errors to avoid noise
            console.debug("Error tracking resource failure:", error);
          }
        }
      },
      true,
    );
  }

  private initializeResourceMonitoring() {
    // Monitor critical resources
    if ("PerformanceObserver" in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const resourceEntry = entry as PerformanceResourceTiming;
          if (
            resourceEntry.transferSize === 0 &&
            resourceEntry.decodedBodySize > 0
          ) {
            // Resource was cached
            this.trackPerformanceMetric({
              name: "resource_cache_hit",
              value: 1,
              unit: "count",
              tags: {
                resource: resourceEntry.name,
                type: resourceEntry.initiatorType,
              },
            });
          }

          // Track large resources
          if (resourceEntry.transferSize > 1024 * 1024) {
            // > 1MB
            this.trackPerformanceMetric({
              name: "large_resource_loaded",
              value: resourceEntry.transferSize,
              unit: "bytes",
              tags: {
                resource: resourceEntry.name,
                type: resourceEntry.initiatorType,
              },
            });
          }
        });
      });

      resourceObserver.observe({ entryTypes: ["resource"] });
    }
  }

  private initializeInteractionTracking() {
    // Track First Input Delay
    if ("PerformanceObserver" in window) {
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          const fidEntry = entry as PerformanceEntry & {
            processingStart: number;
          };
          this.trackPerformanceMetric({
            name: "first_input_delay",
            value: fidEntry.processingStart - fidEntry.startTime,
            unit: "ms",
            tags: {
              inputType: entry.name,
              sessionId: this.sessionId,
            },
          });
        });
      });

      fidObserver.observe({ entryTypes: ["first-input"] });
    }

    // Track Cumulative Layout Shift
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
            this.trackPerformanceMetric({
              name: "cumulative_layout_shift",
              value: clsValue,
              unit: "count",
              tags: {
                sessionId: this.sessionId,
              },
            });
          }
        });
      });

      clsObserver.observe({ entryTypes: ["layout-shift"] });
    }
  }

  // Public API methods

  trackError(error: Error, context: ErrorContext = {}) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      userAgent:
        typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      ...context,
    };

    // Send to error tracking service (Sentry, Bugsnag, etc.)
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      this.sendToSentry(errorData);
    }

    // Send to custom analytics
    trackEvent("error_occurred", "error_tracking", error.message, undefined, {
      error_name: error.name,
      severity: context.severity || "medium",
      session_id: this.sessionId,
    });

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Monitoring: Error tracked", errorData);
    }
  }

  trackPerformanceMetric(metric: PerformanceMetric) {
    const metricData = {
      ...metric,
      timestamp: metric.timestamp || Date.now(),
      sessionId: this.sessionId,
      tags: {
        ...metric.tags,
        environment: process.env.NODE_ENV || "unknown",
      },
    };

    // Send to monitoring service (DataDog, New Relic, etc.)
    if (process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID) {
      this.sendToDataDog(metricData);
    }

    // Send to analytics for core metrics
    if (
      [
        "first_contentful_paint",
        "largest_contentful_paint",
        "first_input_delay",
      ].includes(metric.name)
    ) {
      trackEvent(
        "performance_metric",
        "performance",
        metric.name,
        metric.value,
        {
          metric_unit: metric.unit,
          session_id: this.sessionId,
        },
      );
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("Monitoring: Performance metric", metricData);
    }
  }

  async checkHealthStatus(): Promise<HealthCheckResult[]> {
    const checks: HealthCheckResult[] = [];
    const timestamp = Date.now();

    // API health checks
    const apiChecks = [
      { endpoint: "/api/health", name: "api_health" },
      { endpoint: "/api/newsletter/health", name: "newsletter_api" },
    ];

    for (const check of apiChecks) {
      try {
        const startTime = Date.now();
        const response = await fetch(check.endpoint);
        const responseTime = Date.now() - startTime;

        checks.push({
          service: check.name,
          status: response.ok ? "healthy" : "degraded",
          responseTime,
          message: response.ok ? "OK" : `HTTP ${response.status}`,
          timestamp,
        });
      } catch (error) {
        checks.push({
          service: check.name,
          status: "unhealthy",
          message: error instanceof Error ? error.message : "Unknown error",
          timestamp,
        });
      }
    }

    // External service checks
    const externalChecks = [
      { url: "https://api.vercel.com/v1/status", name: "vercel_status" },
      {
        url: "https://status.loops.so/api/v2/status.json",
        name: "loops_status",
      },
    ];

    for (const check of externalChecks) {
      try {
        const startTime = Date.now();
        const response = await fetch(check.url);
        const responseTime = Date.now() - startTime;

        checks.push({
          service: check.name,
          status: response.ok ? "healthy" : "degraded",
          responseTime,
          timestamp,
        });
      } catch {
        checks.push({
          service: check.name,
          status: "unhealthy",
          message: "External service unreachable",
          timestamp,
        });
      }
    }

    return checks;
  }

  trackCustomEvent(name: string, properties: Record<string, unknown> = {}) {
    const eventData = {
      ...properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      environment: process.env.NODE_ENV,
    };

    trackEvent(name, "custom", undefined, undefined, eventData);
  }

  // Session and user tracking
  getSessionId(): string {
    return this.sessionId;
  }

  getSessionDuration(): number {
    return Date.now() - this.startTime;
  }

  // Private helper methods
  private sendToSentry(errorData: ErrorContext) {
    // Implement Sentry integration
    if (
      typeof window !== "undefined" &&
      (
        window as Window & {
          Sentry?: {
            captureException: (error: Error, context: unknown) => void;
          };
        }
      ).Sentry
    ) {
      (
        window as Window & {
          Sentry?: {
            captureException: (error: Error, context: unknown) => void;
          };
        }
      ).Sentry?.captureException(new Error("Application Error"), {
        contexts: {
          error: errorData,
        },
        tags: errorData.tags,
        extra: errorData.extra,
      });
    }
  }

  private sendToDataDog(metricData: PerformanceMetric) {
    // Implement DataDog RUM integration
    if (
      typeof window !== "undefined" &&
      (
        window as Window & {
          DD_RUM?: { addAction: (name: string, data: unknown) => void };
        }
      ).DD_RUM
    ) {
      (
        window as Window & {
          DD_RUM?: { addAction: (name: string, data: unknown) => void };
        }
      ).DD_RUM?.addAction(metricData.name, metricData);
    }
  }
}

// Export singleton instance
export const monitoring = MonitoringService.getInstance();

// Export utility functions for easy use
export const trackError = (error: Error, context?: ErrorContext) => {
  monitoring.trackError(error, context);
};

export const trackPerformance = (metric: PerformanceMetric) => {
  monitoring.trackPerformanceMetric(metric);
};

export const trackCustomEvent = (
  name: string,
  properties?: Record<string, unknown>,
) => {
  monitoring.trackCustomEvent(name, properties);
};

export const getHealthStatus = async () => {
  return monitoring.checkHealthStatus();
};

// React hook for component-level monitoring
export const useMonitoring = () => {
  return {
    trackError,
    trackPerformance,
    trackCustomEvent,
    sessionId: monitoring.getSessionId(),
    sessionDuration: monitoring.getSessionDuration(),
  };
};

export default monitoring;
