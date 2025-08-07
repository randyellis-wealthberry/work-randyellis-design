// Performance monitoring utilities for Core Web Vitals
export interface PerformanceMetrics {
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
  tti: number | null; // Time to Interactive
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
    const navigationEntry = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      this.metrics.ttfb =
        navigationEntry.responseStart - navigationEntry.requestStart;
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
    keyof PerformanceMetrics,
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
    grades: Record<keyof PerformanceMetrics, string>,
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
