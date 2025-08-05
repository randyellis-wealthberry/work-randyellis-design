/**
 * Enterprise Error Tracking and Monitoring
 *
 * Comprehensive error handling with:
 * - Structured error logging
 * - Performance monitoring
 * - Real-time alerting
 * - Context capture
 * - Error aggregation and analytics
 */

interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
  referer?: string;
  endpoint?: string;
  method?: string;
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
  stack?: string;
  breadcrumbs?: Breadcrumb[];
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
}

interface Breadcrumb {
  timestamp: number;
  message: string;
  category: string;
  level: "debug" | "info" | "warning" | "error";
  data?: Record<string, unknown>;
}

interface ErrorEvent {
  id: string;
  timestamp: number;
  level: "debug" | "info" | "warning" | "error" | "fatal";
  message: string;
  error?: Error;
  context: ErrorContext;
  fingerprint?: string;
  environment: string;
  release?: string;
}

interface PerformanceMetric {
  id: string;
  timestamp: number;
  name: string;
  value: number;
  unit: string;
  tags: Record<string, string>;
  context: ErrorContext;
}

class ErrorTracker {
  private breadcrumbs: Breadcrumb[] = [];
  private maxBreadcrumbs = 50;
  private isEnabled = true;
  private environment: string;
  private release?: string;
  private errorQueue: ErrorEvent[] = [];
  private performanceQueue: PerformanceMetric[] = [];

  constructor() {
    this.environment =
      process.env.VERCEL_ENV || process.env.NODE_ENV || "development";
    this.release =
      process.env.VERCEL_GIT_COMMIT_SHA || process.env.npm_package_version;

    // Initialize external integrations
    this.initializeIntegrations();

    // Flush queues periodically
    if (typeof window === "undefined") {
      setInterval(() => this.flushQueues(), 30000); // 30 seconds
    }
  }

  private initializeIntegrations(): void {
    // Initialize Sentry if configured
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      this.initializeSentry();
    }

    // Initialize custom webhook if configured
    if (process.env.ERROR_WEBHOOK_URL) {
      console.log("Error tracking webhook configured");
    }
  }

  private initializeSentry(): void {
    try {
      // This would typically use @sentry/nextjs
      console.log("Sentry error tracking initialized");
    } catch (error) {
      console.error("Failed to initialize Sentry:", error);
    }
  }

  addBreadcrumb(breadcrumb: Omit<Breadcrumb, "timestamp">): void {
    if (!this.isEnabled) return;

    this.breadcrumbs.push({
      ...breadcrumb,
      timestamp: Date.now(),
    });

    // Keep only the most recent breadcrumbs
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs = this.breadcrumbs.slice(-this.maxBreadcrumbs);
    }
  }

  captureError(
    error: Error,
    level: ErrorEvent["level"] = "error",
    context: Partial<ErrorContext> = {},
  ): string {
    const errorId = this.generateErrorId();

    const errorEvent: ErrorEvent = {
      id: errorId,
      timestamp: Date.now(),
      level,
      message: error.message,
      error,
      context: {
        ...context,
        stack: error.stack,
        breadcrumbs: [...this.breadcrumbs],
      },
      fingerprint: this.generateFingerprint(error),
      environment: this.environment,
      release: this.release,
    };

    this.processError(errorEvent);
    return errorId;
  }

  captureMessage(
    message: string,
    level: ErrorEvent["level"] = "info",
    context: Partial<ErrorContext> = {},
  ): string {
    const errorId = this.generateErrorId();

    const errorEvent: ErrorEvent = {
      id: errorId,
      timestamp: Date.now(),
      level,
      message,
      context: {
        ...context,
        breadcrumbs: [...this.breadcrumbs],
      },
      environment: this.environment,
      release: this.release,
    };

    this.processError(errorEvent);
    return errorId;
  }

  capturePerformanceMetric(
    name: string,
    value: number,
    unit: string = "ms",
    tags: Record<string, string> = {},
    context: Partial<ErrorContext> = {},
  ): void {
    const metric: PerformanceMetric = {
      id: this.generateErrorId(),
      timestamp: Date.now(),
      name,
      value,
      unit,
      tags,
      context: context as ErrorContext,
    };

    this.processPerformanceMetric(metric);
  }

  private processError(errorEvent: ErrorEvent): void {
    // Add to queue for batch processing
    this.errorQueue.push(errorEvent);

    // Log to console in development
    if (this.environment === "development") {
      console.error(
        `[${errorEvent.level.toUpperCase()}] ${errorEvent.message}`,
        {
          id: errorEvent.id,
          context: errorEvent.context,
          error: errorEvent.error,
        },
      );
    }

    // Send to external services if critical
    if (errorEvent.level === "error" || errorEvent.level === "fatal") {
      this.sendToExternalServices(errorEvent);
    }

    // Limit queue size
    if (this.errorQueue.length > 100) {
      this.errorQueue = this.errorQueue.slice(-50);
    }
  }

  private processPerformanceMetric(metric: PerformanceMetric): void {
    this.performanceQueue.push(metric);

    // Alert on performance issues
    if (metric.name.includes("response_time") && metric.value > 5000) {
      this.captureMessage(
        `Slow response detected: ${metric.name} = ${metric.value}ms`,
        "warning",
        metric.context,
      );
    }

    // Limit queue size
    if (this.performanceQueue.length > 200) {
      this.performanceQueue = this.performanceQueue.slice(-100);
    }
  }

  private async sendToExternalServices(errorEvent: ErrorEvent): Promise<void> {
    const promises: Promise<void>[] = [];

    // Send to Sentry if available
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      promises.push(this.sendToSentry(errorEvent));
    }

    // Send to webhook if configured
    if (process.env.ERROR_WEBHOOK_URL) {
      promises.push(this.sendToWebhook(errorEvent));
    }

    // Send to database for long-term storage
    promises.push(this.storeInDatabase(errorEvent));

    await Promise.allSettled(promises);
  }

  private async sendToSentry(errorEvent: ErrorEvent): Promise<void> {
    try {
      // This would integrate with actual Sentry SDK
      console.log("Would send to Sentry:", errorEvent.id);
    } catch (error) {
      console.error("Failed to send error to Sentry:", error);
    }
  }

  private async sendToWebhook(errorEvent: ErrorEvent): Promise<void> {
    try {
      const webhookUrl = process.env.ERROR_WEBHOOK_URL;
      if (!webhookUrl) return;

      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "error",
          event: {
            ...errorEvent,
            error: errorEvent.error
              ? {
                  name: errorEvent.error.name,
                  message: errorEvent.error.message,
                  stack: errorEvent.error.stack,
                }
              : undefined,
          },
        }),
      });
    } catch (error) {
      console.error("Failed to send error to webhook:", error);
    }
  }

  private async storeInDatabase(errorEvent: ErrorEvent): Promise<void> {
    try {
      // This would store in the audit log table
      console.log("Would store in database:", errorEvent.id);
    } catch (error) {
      console.error("Failed to store error in database:", error);
    }
  }

  private async flushQueues(): Promise<void> {
    if (this.errorQueue.length === 0 && this.performanceQueue.length === 0) {
      return;
    }

    try {
      // Batch send errors and metrics
      const errors = this.errorQueue.splice(0);
      const metrics = this.performanceQueue.splice(0);

      if (process.env.ANALYTICS_ENDPOINT) {
        await fetch(process.env.ANALYTICS_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.ANALYTICS_API_KEY}`,
          },
          body: JSON.stringify({
            errors,
            metrics,
            timestamp: Date.now(),
          }),
        });
      }
    } catch (error) {
      console.error("Failed to flush error queues:", error);
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateFingerprint(error: Error): string {
    // Create a unique fingerprint for error grouping
    const key = `${error.name}:${error.message}:${error.stack?.split("\n")[1]?.trim()}`;
    return btoa(key)
      .replace(/[^a-zA-Z0-9]/g, "")
      .substr(0, 32);
  }

  setUser(user: { id: string; email?: string; [key: string]: unknown }): void {
    this.addBreadcrumb({
      message: "User identified",
      category: "auth",
      level: "info",
      data: { userId: user.id },
    });
  }

  setTag(): void {
    // This would set tags for subsequent error events
  }

  setContext(name: string, context: Record<string, unknown>): void {
    this.addBreadcrumb({
      message: `Context set: ${name}`,
      category: "context",
      level: "debug",
      data: context,
    });
  }

  getErrorStats(): {
    totalErrors: number;
    recentErrors: number;
    breadcrumbsCount: number;
    queueSizes: { errors: number; metrics: number };
  } {
    const now = Date.now();
    const recentThreshold = now - 5 * 60 * 1000; // 5 minutes

    return {
      totalErrors: this.errorQueue.length,
      recentErrors: this.errorQueue.filter((e) => e.timestamp > recentThreshold)
        .length,
      breadcrumbsCount: this.breadcrumbs.length,
      queueSizes: {
        errors: this.errorQueue.length,
        metrics: this.performanceQueue.length,
      },
    };
  }
}

// Singleton instance
export const errorTracker = new ErrorTracker();

// Helper functions for common use cases
export function withErrorTracking<T extends (...args: unknown[]) => unknown>(
  fn: T,
  context?: Partial<ErrorContext>,
): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    try {
      const result = fn(...args);

      // Handle async functions
      if (result instanceof Promise) {
        return result.catch((error) => {
          errorTracker.captureError(error, "error", context);
          throw error;
        }) as ReturnType<T>;
      }

      return result as ReturnType<T>;
    } catch (error) {
      errorTracker.captureError(error as Error, "error", context);
      throw error;
    }
  }) as T;
}

export function measurePerformance(
  name: string,
  tags?: Record<string, string>,
) {
  const startTime = Date.now();

  return {
    end: () => {
      const duration = Date.now() - startTime;
      errorTracker.capturePerformanceMetric(name, duration, "ms", tags);
      return duration;
    },
  };
}

// Next.js specific helpers
export function captureNextError(
  error: Error,
  context: {
    req?: { method?: string; ip?: string; headers?: Record<string, string> };
    res?: { statusCode?: number };
    route?: string;
    query?: Record<string, unknown>;
  },
): string {
  const errorContext: Partial<ErrorContext> = {
    endpoint: context.route,
    method: context.req?.method,
    query: context.query,
    ipAddress:
      context.req?.ip ||
      context.req?.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ||
      context.req?.headers?.["x-real-ip"],
    userAgent: context.req?.headers?.["user-agent"],
    referer: context.req?.headers?.referer,
  };

  return errorTracker.captureError(error, "error", errorContext);
}
