// Performance monitoring utilities for Core Web Vitals
export interface PerformanceMetrics {
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
  tti: number | null; // Time to Interactive
  duration?: number;
  fps?: number;
  memoryUsed?: number;
  reflows?: number;
  paints?: number;
  timestamp?: number;
}

interface TrackingSession {
  startTime: number;
  frameCount: number;
  frameTimes: number[];
  memoryStart: number;
  reflows: number;
  paints: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    tti: null,
  };

  private observers: PerformanceObserver[] = [];
  private sessions: Map<string, TrackingSession> = new Map();
  private rafId: number | null = null;

  init() {
    if (typeof window === "undefined") return;

    this.measureTTFB();
    this.measureFCP();
    this.measureLCP();
    this.measureFID();
    this.measureCLS();
    this.measureTTI();
  }

  private measureTTFB() {
    if (typeof performance === "undefined" || !performance.getEntriesByType) {
      return;
    }

    try {
      const navigationEntry = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        this.metrics.ttfb =
          navigationEntry.responseStart - navigationEntry.requestStart;
      }
    } catch {
      // Silently fail in test environments
    }
  }

  private measureFCP() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntriesByName("first-contentful-paint");
        if (entries.length > 0) {
          this.metrics.fcp = entries[0].startTime;
          observer.disconnect();
        }
      });
      observer.observe({ entryTypes: ["paint"] });
      this.observers.push(observer);
    }
  }

  private measureLCP() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        this.metrics.lcp = lastEntry.startTime;
      });
      observer.observe({ entryTypes: ["largest-contentful-paint"] });
      this.observers.push(observer);
    }
  }

  private measureFID() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: PerformanceEntry) => {
          if (entry.name === "first-input") {
            // First Input Delay entry has additional properties
            const fidEntry = entry as PerformanceEntry & {
              processingStart: number;
            };
            this.metrics.fid = fidEntry.processingStart - entry.startTime;
          }
        });
      });
      observer.observe({ entryTypes: ["first-input"] });
      this.observers.push(observer);
    }
  }

  private measureCLS() {
    if ("PerformanceObserver" in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: PerformanceEntry) => {
          // Layout Shift entry has additional properties
          const clsEntry = entry as PerformanceEntry & {
            hadRecentInput: boolean;
            value: number;
          };
          if (!clsEntry.hadRecentInput) {
            clsValue += clsEntry.value;
            this.metrics.cls = clsValue;
          }
        });
      });
      observer.observe({ entryTypes: ["layout-shift"] });
      this.observers.push(observer);
    }
  }

  private measureTTI() {
    // Simplified TTI calculation based on long tasks
    if ("PerformanceObserver" in window) {
      let lastLongTask = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          lastLongTask = Math.max(
            lastLongTask,
            entry.startTime + entry.duration,
          );
        });
      });
      observer.observe({ entryTypes: ["longtask"] });
      this.observers.push(observer);

      // Estimate TTI as 5 seconds after last long task
      setTimeout(() => {
        this.metrics.tti = lastLongTask + 5000;
      }, 10000);
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  getGrades(): Record<
    "lcp" | "fid" | "cls" | "fcp" | "ttfb" | "tti",
    "good" | "needs-improvement" | "poor"
  > {
    return {
      lcp: this.gradeMetric(this.metrics.lcp, [2500, 4000]),
      fid: this.gradeMetric(this.metrics.fid, [100, 300]),
      cls: this.gradeMetric(this.metrics.cls, [0.1, 0.25]),
      fcp: this.gradeMetric(this.metrics.fcp, [1800, 3000]),
      ttfb: this.gradeMetric(this.metrics.ttfb, [800, 1800]),
      tti: this.gradeMetric(this.metrics.tti, [3800, 7300]),
    };
  }

  private gradeMetric(
    value: number | null,
    thresholds: [number, number],
  ): "good" | "needs-improvement" | "poor" {
    if (value === null) return "poor";
    if (value <= thresholds[0]) return "good";
    if (value <= thresholds[1]) return "needs-improvement";
    return "poor";
  }

  generateReport(): string {
    const metrics = this.getMetrics();
    const grades = this.getGrades();

    return `
# Performance Report

## Core Web Vitals
- LCP: ${metrics.lcp?.toFixed(2)}ms (${grades.lcp})
- FID: ${metrics.fid?.toFixed(2)}ms (${grades.fid})
- CLS: ${metrics.cls?.toFixed(3)} (${grades.cls})

## Additional Metrics
- FCP: ${metrics.fcp?.toFixed(2)}ms (${grades.fcp})
- TTFB: ${metrics.ttfb?.toFixed(2)}ms (${grades.ttfb})
- TTI: ${metrics.tti?.toFixed(2)}ms (${grades.tti})

## Recommendations
${this.getRecommendations(grades)}
    `.trim();
  }

  private getRecommendations(
    grades: Record<"lcp" | "fid" | "cls" | "fcp" | "ttfb" | "tti", string>,
  ): string {
    const recommendations: string[] = [];

    if (grades.lcp !== "good") {
      recommendations.push(
        "- Optimize Largest Contentful Paint: Reduce image sizes, use next-gen formats, implement lazy loading",
      );
    }

    if (grades.fid !== "good") {
      recommendations.push(
        "- Improve First Input Delay: Reduce JavaScript execution time, code splitting, defer non-critical JS",
      );
    }

    if (grades.cls !== "good") {
      recommendations.push(
        "- Fix Cumulative Layout Shift: Set dimensions on images/videos, avoid injecting content above existing content",
      );
    }

    if (grades.fcp !== "good") {
      recommendations.push(
        "- Optimize First Contentful Paint: Minimize render-blocking resources, optimize critical CSS",
      );
    }

    if (grades.ttfb !== "good") {
      recommendations.push(
        "- Improve Time to First Byte: Use CDN, optimize server response time, enable browser caching",
      );
    }

    if (grades.tti !== "good") {
      recommendations.push(
        "- Optimize Time to Interactive: Minimize main thread work, reduce JavaScript bundle size",
      );
    }

    return recommendations.length > 0
      ? recommendations.join("\n")
      : "- All metrics are performing well!";
  }

  cleanup() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }

  /**
   * Start tracking performance for a specific operation
   */
  startTracking(sessionId: string): PerformanceMetrics {
    const memoryStart = this.getMemoryUsage();

    const session: TrackingSession = {
      startTime: performance.now(),
      frameCount: 0,
      frameTimes: [],
      memoryStart,
      reflows: 0,
      paints: 0,
    };

    this.sessions.set(sessionId, session);
    this.startFrameTracking(sessionId);

    return this.getCurrentMetrics(sessionId);
  }

  /**
   * End tracking and return performance metrics
   */
  endTracking(sessionId: string): PerformanceMetrics {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return {
        ...this.metrics,
        duration: 0,
        fps: 60,
        memoryUsed: 0,
        reflows: 0,
        paints: 0,
        timestamp: Date.now(),
      };
    }

    this.stopFrameTracking();

    const endTime = performance.now();
    const duration = endTime - session.startTime;
    const fps = this.calculateFPS(session.frameTimes);
    const memoryUsed = this.getMemoryUsage() - session.memoryStart;

    const metrics: PerformanceMetrics = {
      ...this.metrics,
      duration,
      fps,
      memoryUsed: Math.max(0, memoryUsed),
      reflows: session.reflows,
      paints: session.paints,
      timestamp: Date.now(),
    };

    this.sessions.delete(sessionId);

    return metrics;
  }

  /**
   * Get current metrics without ending the session
   */
  getCurrentMetrics(sessionId: string): PerformanceMetrics {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return {
        ...this.metrics,
        duration: 0,
        fps: 60,
        memoryUsed: 0,
        reflows: 0,
        paints: 0,
        timestamp: Date.now(),
      };
    }

    const currentTime = performance.now();
    const duration = currentTime - session.startTime;
    const fps = this.calculateFPS(session.frameTimes);
    const memoryUsed = this.getMemoryUsage() - session.memoryStart;

    return {
      ...this.metrics,
      duration,
      fps,
      memoryUsed: Math.max(0, memoryUsed),
      reflows: session.reflows,
      paints: session.paints,
      timestamp: Date.now(),
    };
  }

  private startFrameTracking(sessionId: string) {
    let lastTime = performance.now();

    const trackFrame = () => {
      const session = this.sessions.get(sessionId);
      if (!session) {
        this.rafId = null;
        return;
      }

      const currentTime = performance.now();
      const delta = currentTime - lastTime;

      session.frameTimes.push(delta);
      session.frameCount++;

      // Keep only last 60 frame timings
      if (session.frameTimes.length > 60) {
        session.frameTimes.shift();
      }

      lastTime = currentTime;
      this.rafId = requestAnimationFrame(trackFrame);
    };

    this.rafId = requestAnimationFrame(trackFrame);
  }

  private stopFrameTracking() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private calculateFPS(frameTimes: number[]): number {
    if (frameTimes.length === 0) return 60;

    const avgFrameTime =
      frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    return Math.min(60, 1000 / avgFrameTime);
  }

  private getMemoryUsage(): number {
    if (typeof performance === "undefined") return 0;

    const memory = (
      performance as typeof performance & {
        memory?: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      }
    ).memory;
    if (memory && memory.usedJSHeapSize) {
      return memory.usedJSHeapSize;
    }

    return 0;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Auto-initialize in browser environment
if (typeof window !== "undefined") {
  performanceMonitor.init();
}

// Utility function to log performance metrics
export const logPerformanceMetrics = () => {
  if (process.env.NODE_ENV === "development") {
    setTimeout(() => {
      console.log(performanceMonitor.generateReport());
    }, 5000);
  }
};
