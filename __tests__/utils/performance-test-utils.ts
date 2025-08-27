/**
 * Performance Testing Utilities
 * Advanced performance monitoring and testing utilities
 */

// Performance metrics collection
export interface PerformanceMetrics {
  fps: number;
  memory: {
    used: number;
    total: number;
    limit: number;
  };
  timing: {
    domContentLoaded: number;
    loadComplete: number;
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    cumulativeLayoutShift: number;
    firstInputDelay: number;
  };
  network: {
    requests: number;
    totalSize: number;
    cacheHitRate: number;
  };
}

// Animation performance monitor
export class AnimationPerformanceMonitor {
  private frameData: number[] = [];
  private startTime = 0;
  private animationId: number | null = null;
  private isMonitoring = false;

  start() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.frameData = [];
    this.startTime = performance.now();
    this.measureFrame();
  }

  stop() {
    this.isMonitoring = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private measureFrame = () => {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    this.frameData.push(currentTime);
    this.animationId = requestAnimationFrame(this.measureFrame);
  };

  getMetrics() {
    if (this.frameData.length < 2) {
      return null;
    }

    const frameTimes = [];
    for (let i = 1; i < this.frameData.length; i++) {
      frameTimes.push(this.frameData[i] - this.frameData[i - 1]);
    }

    const avgFrameTime =
      frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    const fps = 1000 / avgFrameTime;
    const minFrameTime = Math.min(...frameTimes);
    const maxFrameTime = Math.max(...frameTimes);
    const jank = frameTimes.filter((time) => time > 16.67).length; // Frames over 60fps

    return {
      averageFPS: fps,
      minFPS: 1000 / maxFrameTime,
      maxFPS: 1000 / minFrameTime,
      jankFrames: jank,
      jankPercentage: (jank / frameTimes.length) * 100,
      totalFrames: frameTimes.length,
      duration: this.frameData[this.frameData.length - 1] - this.startTime,
    };
  }
}

// Memory leak detector
export class MemoryLeakDetector {
  private initialMemory = 0;
  private measurements: number[] = [];

  start() {
    this.forceGarbageCollection();
    this.initialMemory = this.getCurrentMemoryUsage();
    this.measurements = [this.initialMemory];
  }

  measure() {
    const current = this.getCurrentMemoryUsage();
    this.measurements.push(current);
    return current;
  }

  detectLeak(threshold = 50 * 1024 * 1024): {
    hasLeak: boolean;
    initialMemory: number;
    currentMemory: number;
    growth: number;
    growthRate: number;
  } {
    const currentMemory = this.getCurrentMemoryUsage();
    const growth = currentMemory - this.initialMemory;
    const growthRate = growth / this.measurements.length;

    return {
      hasLeak: growth > threshold,
      initialMemory: this.initialMemory,
      currentMemory,
      growth,
      growthRate,
    };
  }

  private getCurrentMemoryUsage(): number {
    if ((performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  private forceGarbageCollection() {
    if (global.gc) {
      global.gc();
    }
  }
}

// Load testing utilities
export const loadTest = async (
  testFunction: () => Promise<void>,
  options: {
    concurrent: number;
    duration: number;
    rampUp?: number;
  },
): Promise<{
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  minResponseTime: number;
  maxResponseTime: number;
  requestsPerSecond: number;
  errors: Error[];
}> => {
  const { concurrent, duration, rampUp = 0 } = options;
  const startTime = Date.now();
  const endTime = startTime + duration;

  const results: Array<{
    success: boolean;
    responseTime: number;
    error?: Error;
  }> = [];

  const workers: Promise<void>[] = [];

  // Create concurrent workers
  for (let i = 0; i < concurrent; i++) {
    const workerDelay = rampUp ? (rampUp / concurrent) * i : 0;

    workers.push(
      (async () => {
        if (workerDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, workerDelay));
        }

        while (Date.now() < endTime) {
          const requestStart = Date.now();

          try {
            await testFunction();
            results.push({
              success: true,
              responseTime: Date.now() - requestStart,
            });
          } catch (error) {
            results.push({
              success: false,
              responseTime: Date.now() - requestStart,
              error: error as Error,
            });
          }
        }
      })(),
    );
  }

  await Promise.all(workers);

  const successfulResults = results.filter((r) => r.success);
  const failedResults = results.filter((r) => !r.success);
  const responseTimes = results.map((r) => r.responseTime);

  return {
    totalRequests: results.length,
    successfulRequests: successfulResults.length,
    failedRequests: failedResults.length,
    averageResponseTime:
      responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
    minResponseTime: Math.min(...responseTimes),
    maxResponseTime: Math.max(...responseTimes),
    requestsPerSecond: results.length / (duration / 1000),
    errors: failedResults.map((r) => r.error!).filter(Boolean),
  };
};

// Web Vitals measurement
export const measureWebVitals = (): Promise<{
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
}> => {
  return new Promise((resolve) => {
    const vitals = {
      lcp: 0,
      fid: 0,
      cls: 0,
      fcp: 0,
      ttfb: 0,
    };

    // Measure LCP
    if ("PerformanceObserver" in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        vitals.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

      // Measure FID
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          vitals.fid = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ["first-input"] });

      // Measure CLS
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            vitals.cls += entry.value;
          }
        });
      });
      clsObserver.observe({ entryTypes: ["layout-shift"] });

      // Measure FCP and TTFB
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (
            entry.entryType === "paint" &&
            entry.name === "first-contentful-paint"
          ) {
            vitals.fcp = entry.startTime;
          }
          if (entry.entryType === "navigation") {
            vitals.ttfb = entry.responseStart - entry.fetchStart;
          }
        });
      });
      navigationObserver.observe({ entryTypes: ["paint", "navigation"] });

      // Resolve after a delay to collect metrics
      setTimeout(() => resolve(vitals), 3000);
    } else {
      resolve(vitals);
    }
  });
};

// Chaos engineering utilities
export const chaosTest = async (
  testFunction: () => Promise<void>,
  chaosScenarios: Array<{
    name: string;
    probability: number;
    execute: () => void;
  }>,
): Promise<{
  totalTests: number;
  successful: number;
  failed: number;
  chaosEvents: string[];
  errors: Error[];
}> => {
  const results = {
    totalTests: 0,
    successful: 0,
    failed: 0,
    chaosEvents: [] as string[],
    errors: [] as Error[],
  };

  for (let i = 0; i < 100; i++) {
    results.totalTests++;

    // Apply chaos scenarios
    for (const scenario of chaosScenarios) {
      if (Math.random() < scenario.probability) {
        scenario.execute();
        results.chaosEvents.push(`Test ${i}: ${scenario.name}`);
      }
    }

    try {
      await testFunction();
      results.successful++;
    } catch (error) {
      results.failed++;
      results.errors.push(error as Error);
    }
  }

  return results;
};

// Property-based testing helper
export const generateRandomWebGLScenes = (count: number) => {
  const scenes = [];

  for (let i = 0; i < count; i++) {
    scenes.push({
      vertices: Math.floor(Math.random() * 10000) + 100,
      triangles: Math.floor(Math.random() * 5000) + 50,
      textures: Math.floor(Math.random() * 10) + 1,
      lights: Math.floor(Math.random() * 8) + 1,
      materials: Math.floor(Math.random() * 5) + 1,
      animationSpeed: Math.random() * 2 + 0.1,
      complexity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
    });
  }

  return scenes;
};
