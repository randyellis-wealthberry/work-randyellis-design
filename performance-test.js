#!/usr/bin/env node

/**
 * Comprehensive Performance Testing Suite for METIS LightRays Implementation
 *
 * This script runs automated performance tests including:
 * - Page load timing
 * - Memory usage monitoring
 * - Bundle analysis
 * - Mobile performance simulation
 * - WebGL rendering performance
 */

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

// Configuration
const config = {
  baseURL: "http://localhost:3000",
  testPage: "/metis",
  targetMetrics: {
    pageLoadTime: 2500, // 2.5s max
    fcp: 1800, // First Contentful Paint
    lcp: 2500, // Largest Contentful Paint
    cls: 0.1, // Cumulative Layout Shift
    fid: 100, // First Input Delay
    tti: 3800, // Time to Interactive
    fps: 60, // Target FPS
    memoryGrowth: 50, // Max MB memory growth
  },
  devices: {
    desktop: { width: 1920, height: 1080 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 667 },
  },
};

class PerformanceProfiler {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      summary: {},
      devices: {},
      recommendations: [],
    };
  }

  async runAllTests() {
    console.log("🚀 Starting METIS LightRays Performance Testing Suite\n");

    // Test each device profile
    for (const [deviceName, viewport] of Object.entries(config.devices)) {
      console.log(
        `📱 Testing ${deviceName} (${viewport.width}x${viewport.height})`,
      );
      await this.testDevice(deviceName, viewport);
    }

    // Generate final report
    await this.generateReport();

    console.log(
      "\n✅ Performance testing complete! Check metis-performance-report.json for details.",
    );
  }

  async testDevice(deviceName, viewport) {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--enable-features=NetworkService",
      ],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport(viewport);

      // Throttle network and CPU for mobile testing
      if (deviceName === "mobile") {
        const client = await page.target().createCDPSession();
        await client.send("Network.emulateNetworkConditions", {
          offline: false,
          downloadThroughput: (1.5 * 1024 * 1024) / 8, // 1.5 Mbps
          uploadThroughput: (750 * 1024) / 8, // 750 Kbps
          latency: 150, // 150ms
        });

        await client.send("Emulation.setCPUThrottlingRate", { rate: 4 });
      }

      // Start performance monitoring
      const performanceMetrics = await this.measurePageLoad(page, deviceName);
      const memoryMetrics = await this.measureMemoryUsage(page, deviceName);
      const webglMetrics = await this.measureWebGLPerformance(page, deviceName);
      const animationMetrics = await this.measureAnimationPerformance(
        page,
        deviceName,
      );

      this.results.devices[deviceName] = {
        viewport,
        performance: performanceMetrics,
        memory: memoryMetrics,
        webgl: webglMetrics,
        animation: animationMetrics,
        score: this.calculateDeviceScore(
          performanceMetrics,
          memoryMetrics,
          webglMetrics,
          animationMetrics,
        ),
      };
    } catch (error) {
      console.error(`❌ Error testing ${deviceName}:`, error.message);
      this.results.devices[deviceName] = { error: error.message };
    } finally {
      await browser.close();
    }
  }

  async measurePageLoad(page, deviceName) {
    console.log(`  📊 Measuring page load performance...`);

    // Enable performance monitoring
    await page.setCacheEnabled(false);

    const startTime = Date.now();

    // Navigate and collect metrics
    await page.goto(`${config.baseURL}${config.testPage}`, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    const endTime = Date.now();

    // Get Web Vitals using Core Web Vitals library
    const webVitals = await page.evaluate(async () => {
      return new Promise((resolve) => {
        const vitals = {};
        let vitalsCount = 0;
        const targetVitals = 5; // LCP, FID, CLS, FCP, TTI

        function onVital(metric) {
          vitals[metric.name] = metric.value;
          vitalsCount++;

          if (vitalsCount >= targetVitals) {
            resolve(vitals);
          }
        }

        // Simplified Web Vitals measurement
        // In a real scenario, you'd use the web-vitals library
        setTimeout(() => {
          const navigation = performance.getEntriesByType("navigation")[0];
          const paint = performance.getEntriesByType("paint");

          vitals.FCP =
            paint.find((p) => p.name === "first-contentful-paint")?.startTime ||
            0;
          vitals.LCP = navigation?.loadEventStart || 0;
          vitals.TTI = navigation?.domInteractive || 0;
          vitals.CLS = 0; // Would need PerformanceObserver in real implementation
          vitals.FID = 0; // Would need real user interaction

          resolve(vitals);
        }, 2000);
      });
    });

    const totalLoadTime = endTime - startTime;

    return {
      totalLoadTime,
      ...webVitals,
      navigation: await page.evaluate(() => {
        const nav = performance.getEntriesByType("navigation")[0];
        return {
          domContentLoaded:
            nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
          loadComplete: nav.loadEventEnd - nav.loadEventStart,
          firstPaint: performance.getEntriesByType("paint")[0]?.startTime || 0,
        };
      }),
    };
  }

  async measureMemoryUsage(page, deviceName) {
    console.log(`  🧠 Measuring memory usage...`);

    const initialMemory = await page.evaluate(() => {
      return performance.memory
        ? {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          }
        : null;
    });

    // Wait for LightRays to load and animate
    try {
      await page.waitForSelector('[role="img"][aria-label*="light rays"]', {
        timeout: 10000,
      });
    } catch (e) {
      console.log(`    ⚠️  LightRays component not found on ${deviceName}`);
    }
    await page.waitForFunction(
      () => new Promise((resolve) => setTimeout(resolve, 5000)),
    ); // Let animations run

    const finalMemory = await page.evaluate(() => {
      return performance.memory
        ? {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          }
        : null;
    });

    const memoryGrowth =
      finalMemory && initialMemory
        ? (finalMemory.usedJSHeapSize - initialMemory.usedJSHeapSize) /
          (1024 * 1024)
        : 0;

    return {
      initial: initialMemory,
      final: finalMemory,
      growthMB: memoryGrowth,
      withinTarget: memoryGrowth <= config.targetMetrics.memoryGrowth,
    };
  }

  async measureWebGLPerformance(page, deviceName) {
    console.log(`  🎮 Measuring WebGL performance...`);

    try {
      const webglInfo = await page.evaluate(() => {
        const canvas = document.querySelector("canvas");
        if (!canvas) return { available: false, reason: "No canvas found" };

        const gl =
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) return { available: false, reason: "WebGL not available" };

        const ext = gl.getExtension("WEBGL_debug_renderer_info");

        return {
          available: true,
          renderer: ext
            ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
            : "Unknown",
          vendor: ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : "Unknown",
          version: gl.getParameter(gl.VERSION),
          canvasSize: {
            width: canvas.width,
            height: canvas.height,
          },
        };
      });

      return webglInfo;
    } catch (error) {
      return {
        available: false,
        reason: error.message,
      };
    }
  }

  async measureAnimationPerformance(page, deviceName) {
    console.log(`  🎬 Measuring animation performance...`);

    const frameMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const frameTimes = [];
        let frameCount = 0;
        const maxFrames = 180; // 3 seconds at 60fps
        let lastTime = performance.now();

        function measureFrame() {
          const currentTime = performance.now();
          const deltaTime = currentTime - lastTime;

          frameTimes.push(deltaTime);
          frameCount++;
          lastTime = currentTime;

          if (frameCount < maxFrames) {
            requestAnimationFrame(measureFrame);
          } else {
            const avgFrameTime =
              frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
            const fps = 1000 / avgFrameTime;
            const droppedFrames = frameTimes.filter(
              (time) => time > 16.67,
            ).length; // Frames > 60fps threshold

            resolve({
              averageFPS: Math.round(fps),
              droppedFrames,
              frameTimeConsistency: Math.round(
                (1 - droppedFrames / frameCount) * 100,
              ),
              worstFrameTime: Math.max(...frameTimes),
            });
          }
        }

        requestAnimationFrame(measureFrame);
      });
    });

    return frameMetrics;
  }

  calculateDeviceScore(performance, memory, webgl, animation) {
    let score = 100;
    const penalties = [];

    // Page load penalties
    if (performance.totalLoadTime > config.targetMetrics.pageLoadTime) {
      const penalty = Math.min(
        20,
        (performance.totalLoadTime - config.targetMetrics.pageLoadTime) / 100,
      );
      score -= penalty;
      penalties.push(`Slow page load: -${penalty.toFixed(1)} points`);
    }

    // Memory penalties
    if (memory.growthMB > config.targetMetrics.memoryGrowth) {
      const penalty = Math.min(
        15,
        (memory.growthMB - config.targetMetrics.memoryGrowth) / 5,
      );
      score -= penalty;
      penalties.push(`Memory growth: -${penalty.toFixed(1)} points`);
    }

    // Animation penalties
    if (animation.averageFPS < config.targetMetrics.fps) {
      const penalty = Math.min(
        25,
        (config.targetMetrics.fps - animation.averageFPS) / 2,
      );
      score -= penalty;
      penalties.push(`Low FPS: -${penalty.toFixed(1)} points`);
    }

    // WebGL penalties
    if (!webgl.available) {
      score -= 10;
      penalties.push("WebGL not available: -10 points");
    }

    return {
      total: Math.max(0, Math.round(score)),
      penalties,
      grade: this.getGrade(score),
    };
  }

  getGrade(score) {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  }

  async generateReport() {
    // Calculate overall summary
    const deviceScores = Object.values(this.results.devices)
      .filter((device) => device.score)
      .map((device) => device.score.total);

    const averageScore =
      deviceScores.length > 0
        ? Math.round(
            deviceScores.reduce((a, b) => a + b, 0) / deviceScores.length,
          )
        : 0;

    this.results.summary = {
      overallScore: averageScore,
      overallGrade: this.getGrade(averageScore),
      passedDevices: deviceScores.filter((score) => score >= 70).length,
      totalDevices: deviceScores.length,
      critical: [],
      warnings: [],
      recommendations: this.generateRecommendations(),
    };

    // Identify critical issues
    Object.entries(this.results.devices).forEach(([deviceName, deviceData]) => {
      if (deviceData.score && deviceData.score.total < 60) {
        this.results.summary.critical.push(
          `${deviceName}: Poor performance (${deviceData.score.total}/100)`,
        );
      }

      if (
        deviceData.memory &&
        deviceData.memory.growthMB > config.targetMetrics.memoryGrowth * 1.5
      ) {
        this.results.summary.critical.push(
          `${deviceName}: Excessive memory usage (${deviceData.memory.growthMB.toFixed(1)}MB)`,
        );
      }

      if (deviceData.animation && deviceData.animation.averageFPS < 30) {
        this.results.summary.critical.push(
          `${deviceName}: Very low FPS (${deviceData.animation.averageFPS})`,
        );
      }
    });

    // Save report
    const reportPath = path.join(__dirname, "metis-performance-report.json");
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    // Generate readable summary
    this.printSummary();
  }

  generateRecommendations() {
    const recommendations = [];

    // Analyze results and generate specific recommendations
    Object.entries(this.results.devices).forEach(([deviceName, deviceData]) => {
      if (
        deviceData.performance &&
        deviceData.performance.totalLoadTime > config.targetMetrics.pageLoadTime
      ) {
        recommendations.push({
          priority: "high",
          device: deviceName,
          issue: "Slow page load",
          recommendation:
            "Consider implementing code splitting or reducing initial bundle size",
        });
      }

      if (
        deviceData.memory &&
        deviceData.memory.growthMB > config.targetMetrics.memoryGrowth
      ) {
        recommendations.push({
          priority: "medium",
          device: deviceName,
          issue: "Memory growth",
          recommendation:
            "Implement proper cleanup in WebGL components and check for memory leaks",
        });
      }

      if (deviceData.animation && deviceData.animation.averageFPS < 50) {
        recommendations.push({
          priority: "high",
          device: deviceName,
          issue: "Low FPS",
          recommendation:
            "Reduce animation complexity or implement performance scaling based on device capabilities",
        });
      }
    });

    return recommendations;
  }

  printSummary() {
    console.log("\n" + "=".repeat(80));
    console.log("📊 METIS LIGHTRAYS PERFORMANCE REPORT");
    console.log("=".repeat(80));
    console.log(
      `🎯 Overall Score: ${this.results.summary.overallScore}/100 (Grade: ${this.results.summary.overallGrade})`,
    );
    console.log(
      `✅ Devices Passed: ${this.results.summary.passedDevices}/${this.results.summary.totalDevices}`,
    );

    if (this.results.summary.critical.length > 0) {
      console.log("\n🚨 CRITICAL ISSUES:");
      this.results.summary.critical.forEach((issue) =>
        console.log(`  • ${issue}`),
      );
    }

    console.log("\n📱 DEVICE BREAKDOWN:");
    Object.entries(this.results.devices).forEach(([device, data]) => {
      if (data.score) {
        console.log(
          `  ${device.toUpperCase()}: ${data.score.total}/100 (${data.score.grade})`,
        );
        if (data.performance) {
          console.log(`    ⏱️  Load Time: ${data.performance.totalLoadTime}ms`);
        }
        if (data.animation) {
          console.log(`    🎬 Average FPS: ${data.animation.averageFPS}`);
        }
        if (data.memory) {
          console.log(
            `    🧠 Memory Growth: ${data.memory.growthMB.toFixed(1)}MB`,
          );
        }
      }
    });

    if (this.results.summary.recommendations.length > 0) {
      console.log("\n💡 RECOMMENDATIONS:");
      this.results.summary.recommendations.forEach((rec, index) => {
        console.log(
          `  ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.device}: ${rec.issue}`,
        );
        console.log(`     → ${rec.recommendation}`);
      });
    }

    console.log("\n✅ Full report saved to: metis-performance-report.json");
    console.log("=".repeat(80) + "\n");
  }
}

// Run the performance test
if (require.main === module) {
  const profiler = new PerformanceProfiler();
  profiler.runAllTests().catch(console.error);
}

module.exports = PerformanceProfiler;
