/**
 * Echo Project Performance Testing Suite
 * Comprehensive performance testing and monitoring for the Echo interactive page
 */

const puppeteer = require("puppeteer");
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");

class PerformanceTestSuite {
  constructor() {
    this.testResults = {
      timestamp: new Date().toISOString(),
      performance: {},
      accessibility: {},
      bestPractices: {},
      seo: {},
      customMetrics: {},
    };
  }

  /**
   * Run comprehensive performance testing
   */
  async runFullTest() {
    console.log("🚀 Starting Echo Project Performance Test Suite...");

    await this.runLighthouseTests();
    await this.runAnimationPerformanceTests();
    await this.runMemoryTests();
    await this.runMobilePerformanceTests();
    await this.runBundleAnalysis();

    this.generateReport();
  }

  /**
   * Lighthouse Core Web Vitals Testing
   */
  async runLighthouseTests() {
    console.log("📊 Running Lighthouse tests...");

    const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
    const options = {
      logLevel: "info",
      output: "json",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      port: chrome.port,
    };

    try {
      // Test desktop performance
      const desktopResult = await lighthouse(
        "http://localhost:3000/projects/echo",
        {
          ...options,
          formFactor: "desktop",
          throttling: {
            rttMs: 40,
            throughputKbps: 10240,
            cpuSlowdownMultiplier: 1,
          },
        },
      );

      // Test mobile performance
      const mobileResult = await lighthouse(
        "http://localhost:3000/projects/echo",
        {
          ...options,
          formFactor: "mobile",
          throttling: {
            rttMs: 150,
            throughputKbps: 1638,
            cpuSlowdownMultiplier: 4,
          },
        },
      );

      this.testResults.performance.desktop = {
        score: desktopResult.lhr.categories.performance.score * 100,
        fcp: desktopResult.lhr.audits["first-contentful-paint"].numericValue,
        lcp: desktopResult.lhr.audits["largest-contentful-paint"].numericValue,
        cls: desktopResult.lhr.audits["cumulative-layout-shift"].numericValue,
        tti: desktopResult.lhr.audits["interactive"].numericValue,
        fid: desktopResult.lhr.audits["max-potential-fid"]?.numericValue || 0,
      };

      this.testResults.performance.mobile = {
        score: mobileResult.lhr.categories.performance.score * 100,
        fcp: mobileResult.lhr.audits["first-contentful-paint"].numericValue,
        lcp: mobileResult.lhr.audits["largest-contentful-paint"].numericValue,
        cls: mobileResult.lhr.audits["cumulative-layout-shift"].numericValue,
        tti: mobileResult.lhr.audits["interactive"].numericValue,
        fid: mobileResult.lhr.audits["max-potential-fid"]?.numericValue || 0,
      };

      this.testResults.accessibility.score =
        mobileResult.lhr.categories.accessibility.score * 100;
    } finally {
      await chrome.kill();
    }

    console.log("✅ Lighthouse tests completed");
  }

  /**
   * Animation Performance Testing
   */
  async runAnimationPerformanceTests() {
    console.log("🎬 Testing animation performance...");

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Enable performance monitoring
    await page.setCacheEnabled(false);

    // Test animation frame rate during heavy animations
    await page.goto("http://localhost:3000/projects/echo");

    const animationMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        let frameCount = 0;
        let droppedFrames = 0;
        const startTime = performance.now();

        // Trigger celebrations to test heavy animations
        const celebrateButton = document.querySelector(
          '[aria-label*="celebration"]',
        );
        if (celebrateButton) celebrateButton.click();

        const measureFrames = () => {
          frameCount++;
          const currentTime = performance.now();

          if (currentTime - startTime > 3000) {
            // 3 second test
            const fps = frameCount / 3;
            const smoothness =
              fps >= 55 ? "excellent" : fps >= 30 ? "good" : "poor";

            resolve({
              averageFPS: fps,
              totalFrames: frameCount,
              droppedFrames: Math.max(0, 180 - frameCount), // Expected 60fps * 3s
              smoothness,
              testDuration: 3000,
            });
          } else {
            requestAnimationFrame(measureFrames);
          }
        };

        requestAnimationFrame(measureFrames);
      });
    });

    this.testResults.customMetrics.animations = animationMetrics;

    await browser.close();
    console.log("✅ Animation performance tests completed");
  }

  /**
   * Memory Usage Testing
   */
  async runMemoryTests() {
    console.log("🧠 Testing memory usage...");

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--enable-precise-memory-info"],
    });
    const page = await browser.newPage();

    await page.goto("http://localhost:3000/projects/echo");

    // Wait for page to fully load and animations to start
    await page.waitForTimeout(2000);

    const memoryMetrics = await page.evaluate(() => {
      const memInfo = performance.memory;
      return {
        usedJSHeapSize: memInfo.usedJSHeapSize,
        totalJSHeapSize: memInfo.totalJSHeapSize,
        jsHeapSizeLimit: memInfo.jsHeapSizeLimit,
        usedMB: Math.round(memInfo.usedJSHeapSize / 1048576),
        totalMB: Math.round(memInfo.totalJSHeapSize / 1048576),
      };
    });

    // Trigger heavy animations and measure memory spike
    await page.click('button[aria-label*="celebration"]');
    await page.waitForTimeout(1000);

    const peakMemoryMetrics = await page.evaluate(() => {
      const memInfo = performance.memory;
      return {
        peakUsedMB: Math.round(memInfo.usedJSHeapSize / 1048576),
        memoryIncrease: Math.round(
          (memInfo.usedJSHeapSize - window.initialMemory) / 1048576,
        ),
      };
    });

    this.testResults.customMetrics.memory = {
      ...memoryMetrics,
      ...peakMemoryMetrics,
      memoryEfficiency:
        memoryMetrics.usedMB < 30
          ? "excellent"
          : memoryMetrics.usedMB < 50
            ? "good"
            : "needs-improvement",
    };

    await browser.close();
    console.log("✅ Memory tests completed");
  }

  /**
   * Mobile Performance Testing
   */
  async runMobilePerformanceTests() {
    console.log("📱 Testing mobile performance...");

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Emulate mobile device
    await page.emulate({
      name: "iPhone 12",
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
      viewport: {
        width: 390,
        height: 844,
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        isLandscape: false,
      },
    });

    // Throttle network and CPU
    await page.setCacheEnabled(false);
    await page.emulateNetworkConditions({
      offline: false,
      downloadThroughput: (1.5 * 1024 * 1024) / 8, // 1.5 Mbps
      uploadThroughput: (750 * 1024) / 8,
      latency: 100,
    });

    const startTime = Date.now();
    await page.goto("http://localhost:3000/projects/echo");

    // Wait for LCP
    await page.waitForSelector("[data-cursor-hover]", { timeout: 10000 });
    const loadTime = Date.now() - startTime;

    // Test touch interactions
    const touchMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const button = document.querySelector("button");
        if (button) {
          const startTime = performance.now();
          button.addEventListener("click", () => {
            const responseTime = performance.now() - startTime;
            resolve({
              touchResponseTime: responseTime,
              touchResponsive: responseTime < 100,
            });
          });
          button.click();
        } else {
          resolve({ touchResponseTime: 0, touchResponsive: false });
        }
      });
    });

    this.testResults.customMetrics.mobile = {
      loadTime,
      ...touchMetrics,
      mobileOptimized: loadTime < 3000 && touchMetrics.touchResponsive,
    };

    await browser.close();
    console.log("✅ Mobile performance tests completed");
  }

  /**
   * Bundle Size Analysis
   */
  async runBundleAnalysis() {
    console.log("📦 Analyzing bundle size...");

    const fs = require("fs");
    const path = require("path");

    try {
      // Read build stats (assuming Next.js build has been run)
      const buildDir = path.join(process.cwd(), ".next/static/chunks");
      const files = fs.readdirSync(buildDir);

      let totalSize = 0;
      const chunks = files
        .map((file) => {
          const filePath = path.join(buildDir, file);
          const stats = fs.statSync(filePath);
          totalSize += stats.size;
          return {
            name: file,
            size: stats.size,
            sizeKB: Math.round(stats.size / 1024),
          };
        })
        .filter((chunk) => chunk.name.endsWith(".js"));

      this.testResults.customMetrics.bundle = {
        totalSizeKB: Math.round(totalSize / 1024),
        chunkCount: chunks.length,
        largestChunk: chunks.reduce((prev, curr) =>
          prev.size > curr.size ? prev : curr,
        ),
        bundleOptimized: totalSize < 200 * 1024, // Less than 200KB
      };
    } catch (error) {
      console.warn("Bundle analysis failed:", error.message);
      this.testResults.customMetrics.bundle = {
        error: "Bundle analysis unavailable",
      };
    }

    console.log("✅ Bundle analysis completed");
  }

  /**
   * Generate comprehensive performance report
   */
  generateReport() {
    console.log("\n🎯 ECHO PROJECT PERFORMANCE REPORT");
    console.log("=".repeat(50));

    // Performance Scores
    console.log("\n📊 LIGHTHOUSE SCORES");
    console.log(
      `Desktop Performance: ${this.testResults.performance.desktop?.score || "N/A"}/100`,
    );
    console.log(
      `Mobile Performance: ${this.testResults.performance.mobile?.score || "N/A"}/100`,
    );
    console.log(
      `Accessibility: ${this.testResults.accessibility?.score || "N/A"}/100`,
    );

    // Core Web Vitals
    console.log("\n⚡ CORE WEB VITALS (Mobile)");
    const mobile = this.testResults.performance.mobile;
    if (mobile) {
      console.log(
        `LCP: ${(mobile.lcp / 1000).toFixed(2)}s ${mobile.lcp < 2500 ? "✅" : "❌"}`,
      );
      console.log(
        `FCP: ${(mobile.fcp / 1000).toFixed(2)}s ${mobile.fcp < 1800 ? "✅" : "❌"}`,
      );
      console.log(
        `CLS: ${mobile.cls.toFixed(3)} ${mobile.cls < 0.1 ? "✅" : "❌"}`,
      );
      console.log(
        `TTI: ${(mobile.tti / 1000).toFixed(2)}s ${mobile.tti < 3800 ? "✅" : "❌"}`,
      );
    }

    // Animation Performance
    console.log("\n🎬 ANIMATION PERFORMANCE");
    const animations = this.testResults.customMetrics.animations;
    if (animations) {
      console.log(
        `Average FPS: ${animations.averageFPS.toFixed(1)} (${animations.smoothness})`,
      );
      console.log(`Dropped Frames: ${animations.droppedFrames}`);
    }

    // Memory Usage
    console.log("\n🧠 MEMORY USAGE");
    const memory = this.testResults.customMetrics.memory;
    if (memory) {
      console.log(`Initial Memory: ${memory.usedMB}MB`);
      console.log(`Peak Memory: ${memory.peakUsedMB}MB`);
      console.log(`Memory Efficiency: ${memory.memoryEfficiency}`);
    }

    // Mobile Performance
    console.log("\n📱 MOBILE PERFORMANCE");
    const mobileMetrics = this.testResults.customMetrics.mobile;
    if (mobileMetrics) {
      console.log(
        `Load Time: ${mobileMetrics.loadTime}ms ${mobileMetrics.loadTime < 3000 ? "✅" : "❌"}`,
      );
      console.log(
        `Touch Response: ${mobileMetrics.touchResponseTime.toFixed(1)}ms ${mobileMetrics.touchResponsive ? "✅" : "❌"}`,
      );
    }

    // Bundle Analysis
    console.log("\n📦 BUNDLE ANALYSIS");
    const bundle = this.testResults.customMetrics.bundle;
    if (bundle && !bundle.error) {
      console.log(
        `Total Bundle Size: ${bundle.totalSizeKB}KB ${bundle.bundleOptimized ? "✅" : "❌"}`,
      );
      console.log(`Chunks: ${bundle.chunkCount}`);
      console.log(
        `Largest Chunk: ${bundle.largestChunk.name} (${bundle.largestChunk.sizeKB}KB)`,
      );
    }

    // Performance Grade
    const grade = this.calculateOverallGrade();
    console.log(
      `\n🏆 OVERALL PERFORMANCE GRADE: ${grade.letter} (${grade.score}/100)`,
    );
    console.log(`Recommendation: ${grade.recommendation}`);

    // Save detailed results
    const fs = require("fs");
    fs.writeFileSync(
      `performance-report-${Date.now()}.json`,
      JSON.stringify(this.testResults, null, 2),
    );

    console.log(
      "\n📄 Detailed report saved to performance-report-[timestamp].json",
    );
  }

  /**
   * Calculate overall performance grade
   */
  calculateOverallGrade() {
    const scores = [];

    // Lighthouse scores (40% weight)
    if (this.testResults.performance.mobile?.score) {
      scores.push(this.testResults.performance.mobile.score * 0.4);
    }

    // Animation performance (20% weight)
    const animFPS = this.testResults.customMetrics.animations?.averageFPS || 0;
    const animScore = Math.min(100, (animFPS / 60) * 100);
    scores.push(animScore * 0.2);

    // Memory efficiency (20% weight)
    const memUsed = this.testResults.customMetrics.memory?.usedMB || 100;
    const memScore = Math.max(0, 100 - (memUsed - 20) * 2); // Penalty after 20MB
    scores.push(memScore * 0.2);

    // Mobile performance (20% weight)
    const mobileLoad = this.testResults.customMetrics.mobile?.loadTime || 5000;
    const mobileScore = Math.max(0, 100 - (mobileLoad - 2000) / 30); // Penalty after 2s
    scores.push(mobileScore * 0.2);

    const totalScore = scores.reduce((sum, score) => sum + score, 0);

    let letter, recommendation;
    if (totalScore >= 90) {
      letter = "A";
      recommendation =
        "Excellent performance! Consider A/B testing for further optimizations.";
    } else if (totalScore >= 80) {
      letter = "B";
      recommendation =
        "Good performance. Focus on animation smoothness and bundle size.";
    } else if (totalScore >= 70) {
      letter = "C";
      recommendation =
        "Needs improvement. Implement lazy loading and reduce animation complexity.";
    } else {
      letter = "D";
      recommendation =
        "Poor performance. Critical optimizations needed for user experience.";
    }

    return { letter, score: Math.round(totalScore), recommendation };
  }
}

// CLI usage
if (require.main === module) {
  const suite = new PerformanceTestSuite();
  suite.runFullTest().catch(console.error);
}

module.exports = PerformanceTestSuite;
