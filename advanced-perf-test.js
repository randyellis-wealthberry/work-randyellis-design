#!/usr/bin/env node

/**
 * Advanced Performance Testing for METIS LightRays
 * Tests specific scenarios and edge cases
 */

const puppeteer = require("puppeteer");

class AdvancedPerformanceTest {
  constructor() {
    this.results = {};
  }

  async runAdvancedTests() {
    console.log("🔬 Starting Advanced METIS LightRays Performance Tests\n");

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--enable-features=NetworkService",
      ],
    });

    try {
      // Test 1: Component unmount cleanup
      console.log("🧹 Testing Component Cleanup on Unmount...");
      await this.testComponentCleanup(browser);

      // Test 2: Reduced motion preferences
      console.log("♿ Testing Reduced Motion Preferences...");
      await this.testReducedMotion(browser);

      // Test 3: WebGL Context handling
      console.log("🎮 Testing WebGL Context...");
      await this.testWebGLContext(browser);

      // Test 4: Multiple tab stress test
      console.log("📑 Testing Multiple Tab Performance...");
      await this.testMultipleTabs(browser);

      // Test 5: Network throttling impact
      console.log("🐌 Testing Slow Network Impact...");
      await this.testSlowNetwork(browser);

      this.generateAdvancedReport();
    } catch (error) {
      console.error("❌ Advanced test failed:", error.message);
    } finally {
      await browser.close();
    }
  }

  async testComponentCleanup(browser) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    try {
      // Navigate to page and get initial memory
      await page.goto("http://localhost:3000/metis", {
        waitUntil: "networkidle2",
      });
      await page.waitForSelector('[role="img"][aria-label*="light rays"]', {
        timeout: 10000,
      });

      const initialMemory = await page.evaluate(() => {
        return performance.memory ? performance.memory.usedJSHeapSize : null;
      });

      // Navigate away (simulating component unmount)
      await page.goto("http://localhost:3000/", { waitUntil: "networkidle2" });

      // Force garbage collection and check memory
      await page.evaluate(() => {
        if (window.gc) window.gc();
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const finalMemory = await page.evaluate(() => {
        return performance.memory ? performance.memory.usedJSHeapSize : null;
      });

      const memoryLeakMB =
        initialMemory && finalMemory
          ? Math.round((finalMemory - initialMemory) / 1024 / 1024)
          : 0;

      this.results.cleanup = {
        status: memoryLeakMB <= 5 ? "good" : "warning",
        memoryLeakMB,
        initialMemoryMB: initialMemory
          ? Math.round(initialMemory / 1024 / 1024)
          : null,
        finalMemoryMB: finalMemory
          ? Math.round(finalMemory / 1024 / 1024)
          : null,
      };

      console.log(
        `  📊 Memory leak test: ${memoryLeakMB}MB (${this.results.cleanup.status})`,
      );
    } catch (error) {
      this.results.cleanup = { status: "failed", error: error.message };
      console.log(`  ❌ Cleanup test failed: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  async testReducedMotion(browser) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    try {
      // Emulate reduced motion preference
      await page.emulateMediaFeatures([
        {
          name: "prefers-reduced-motion",
          value: "reduce",
        },
      ]);

      await page.goto("http://localhost:3000/metis", {
        waitUntil: "networkidle2",
      });

      // Check if LightRays component respects reduced motion
      const lightRaysHidden = await page.evaluate(() => {
        const lightRaysElement = document.querySelector(
          '[role="img"][aria-label*="light rays"]',
        );
        if (!lightRaysElement) return true; // Component not rendered = good

        // Check if it's hidden via CSS
        const computedStyle = window.getComputedStyle(lightRaysElement);
        return (
          computedStyle.display === "none" ||
          computedStyle.visibility === "hidden" ||
          computedStyle.opacity === "0"
        );
      });

      this.results.reducedMotion = {
        status: lightRaysHidden ? "excellent" : "needs-improvement",
        respectsPreference: lightRaysHidden,
        recommendation: lightRaysHidden
          ? "Component properly respects reduced motion preference"
          : "Component should be hidden when user prefers reduced motion",
      };

      console.log(
        `  ♿ Reduced motion test: ${this.results.reducedMotion.status}`,
      );
    } catch (error) {
      this.results.reducedMotion = { status: "failed", error: error.message };
      console.log(`  ❌ Reduced motion test failed: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  async testWebGLContext(browser) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    try {
      await page.goto("http://localhost:3000/metis", {
        waitUntil: "networkidle2",
      });
      await page.waitForSelector('[role="img"][aria-label*="light rays"]', {
        timeout: 10000,
      });

      const webglInfo = await page.evaluate(() => {
        const canvas = document.querySelector("canvas");
        if (!canvas) return { hasCanvas: false };

        const gl =
          canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) return { hasCanvas: true, hasWebGL: false };

        // Check WebGL capabilities
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        const maxViewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS);

        return {
          hasCanvas: true,
          hasWebGL: true,
          renderer: debugInfo
            ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            : "Unknown",
          vendor: debugInfo
            ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
            : "Unknown",
          version: gl.getParameter(gl.VERSION),
          maxTextureSize,
          maxViewportDims: `${maxViewportDims[0]}x${maxViewportDims[1]}`,
          extensions: gl.getSupportedExtensions()?.length || 0,
        };
      });

      this.results.webgl = {
        status: webglInfo.hasWebGL ? "good" : "warning",
        ...webglInfo,
      };

      console.log(
        `  🎮 WebGL test: ${this.results.webgl.status} (${webglInfo.hasWebGL ? "Available" : "Not available"})`,
      );
    } catch (error) {
      this.results.webgl = { status: "failed", error: error.message };
      console.log(`  ❌ WebGL test failed: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  async testMultipleTabs(browser) {
    const tabs = [];

    try {
      // Open 3 tabs with the METIS page
      for (let i = 0; i < 3; i++) {
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        tabs.push(page);
      }

      const startTime = Date.now();

      // Load all tabs simultaneously
      await Promise.all(
        tabs.map(async (page, index) => {
          try {
            await page.goto("http://localhost:3000/metis", {
              waitUntil: "networkidle2",
              timeout: 30000,
            });
            await page.waitForSelector(
              '[role="img"][aria-label*="light rays"]',
              { timeout: 10000 },
            );
          } catch (error) {
            console.log(
              `    Tab ${index + 1} failed to load: ${error.message}`,
            );
          }
        }),
      );

      const loadTime = Date.now() - startTime;

      // Check memory usage across all tabs
      const memoryUsages = await Promise.all(
        tabs.map(async (page) => {
          try {
            return await page.evaluate(() => {
              return performance.memory
                ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)
                : null;
            });
          } catch {
            return null;
          }
        }),
      );

      const totalMemory = memoryUsages
        .filter((m) => m !== null)
        .reduce((a, b) => a + b, 0);
      const avgMemoryPerTab =
        totalMemory / memoryUsages.filter((m) => m !== null).length;

      this.results.multipleTabs = {
        status: loadTime < 10000 && avgMemoryPerTab < 150 ? "good" : "warning",
        tabCount: tabs.length,
        totalLoadTime: loadTime,
        avgLoadTime: Math.round(loadTime / tabs.length),
        totalMemoryMB: totalMemory,
        avgMemoryPerTabMB: Math.round(avgMemoryPerTab),
        successfulTabs: memoryUsages.filter((m) => m !== null).length,
      };

      console.log(
        `  📑 Multiple tabs test: ${this.results.multipleTabs.status} (${this.results.multipleTabs.successfulTabs}/${tabs.length} loaded)`,
      );
    } catch (error) {
      this.results.multipleTabs = { status: "failed", error: error.message };
      console.log(`  ❌ Multiple tabs test failed: ${error.message}`);
    } finally {
      // Close all tabs
      await Promise.all(tabs.map((page) => page.close().catch(() => {})));
    }
  }

  async testSlowNetwork(browser) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    try {
      // Throttle to slow 3G
      const client = await page.target().createCDPSession();
      await client.send("Network.emulateNetworkConditions", {
        offline: false,
        downloadThroughput: (500 * 1024) / 8, // 500kb/s
        uploadThroughput: (500 * 1024) / 8, // 500kb/s
        latency: 400, // 400ms
      });

      const startTime = Date.now();

      await page.goto("http://localhost:3000/metis", {
        waitUntil: "networkidle2",
        timeout: 60000,
      });

      const loadTime = Date.now() - startTime;

      // Check if LightRays still loads properly on slow network
      const lightRaysLoaded = await page.evaluate(() => {
        const lightRaysElement = document.querySelector(
          '[role="img"][aria-label*="light rays"]',
        );
        return !!lightRaysElement;
      });

      this.results.slowNetwork = {
        status: loadTime < 15000 && lightRaysLoaded ? "good" : "warning",
        loadTime,
        lightRaysLoaded,
        recommendation: lightRaysLoaded
          ? "Component loads well on slow network"
          : "Consider optimizing for slow network conditions",
      };

      console.log(
        `  🐌 Slow network test: ${this.results.slowNetwork.status} (${loadTime}ms)`,
      );
    } catch (error) {
      this.results.slowNetwork = { status: "failed", error: error.message };
      console.log(`  ❌ Slow network test failed: ${error.message}`);
    } finally {
      await page.close();
    }
  }

  generateAdvancedReport() {
    console.log("\\n" + "=".repeat(80));
    console.log("🔬 ADVANCED METIS LIGHTRAYS PERFORMANCE REPORT");
    console.log("=".repeat(80));

    const tests = [
      { name: "Component Cleanup", key: "cleanup" },
      { name: "Reduced Motion", key: "reducedMotion" },
      { name: "WebGL Context", key: "webgl" },
      { name: "Multiple Tabs", key: "multipleTabs" },
      { name: "Slow Network", key: "slowNetwork" },
    ];

    tests.forEach((test) => {
      const result = this.results[test.key];
      if (result) {
        console.log(`\\n🧪 ${test.name.toUpperCase()}:`);
        console.log(
          `   Status: ${this.getStatusEmoji(result.status)} ${result.status}`,
        );

        // Display specific metrics for each test
        this.displayTestMetrics(test.key, result);
      }
    });

    // Overall advanced assessment
    const passedTests = Object.values(this.results).filter(
      (r) => r.status === "good" || r.status === "excellent",
    ).length;
    const totalTests = Object.keys(this.results).length;

    console.log(
      `\\n🎯 ADVANCED ASSESSMENT: ${passedTests}/${totalTests} tests passed`,
    );

    // Advanced recommendations
    console.log("\\n💡 ADVANCED RECOMMENDATIONS:");
    this.generateAdvancedRecommendations();

    console.log("\\n" + "=".repeat(80));
  }

  displayTestMetrics(testKey, result) {
    switch (testKey) {
      case "cleanup":
        if (result.memoryLeakMB !== undefined) {
          console.log(`   Memory Leak: ${result.memoryLeakMB}MB`);
          console.log(
            `   Before/After: ${result.initialMemoryMB}MB → ${result.finalMemoryMB}MB`,
          );
        }
        break;

      case "reducedMotion":
        console.log(
          `   Respects Preference: ${result.respectsPreference ? "✅" : "❌"}`,
        );
        if (result.recommendation) {
          console.log(`   Note: ${result.recommendation}`);
        }
        break;

      case "webgl":
        if (result.hasWebGL) {
          console.log(`   Renderer: ${result.renderer}`);
          console.log(`   Max Texture: ${result.maxTextureSize}px`);
          console.log(`   Extensions: ${result.extensions} available`);
        }
        break;

      case "multipleTabs":
        if (result.tabCount) {
          console.log(
            `   Tabs Loaded: ${result.successfulTabs}/${result.tabCount}`,
          );
          console.log(`   Avg Load Time: ${result.avgLoadTime}ms`);
          console.log(`   Avg Memory/Tab: ${result.avgMemoryPerTabMB}MB`);
        }
        break;

      case "slowNetwork":
        if (result.loadTime) {
          console.log(`   Load Time: ${result.loadTime}ms`);
          console.log(
            `   LightRays Loaded: ${result.lightRaysLoaded ? "✅" : "❌"}`,
          );
        }
        break;
    }

    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  }

  generateAdvancedRecommendations() {
    const recommendations = [];

    // Analyze each test result
    Object.entries(this.results).forEach(([testKey, result]) => {
      switch (testKey) {
        case "cleanup":
          if (result.status === "warning" && result.memoryLeakMB > 5) {
            recommendations.push(
              `🧹 Memory leak detected (${result.memoryLeakMB}MB). Implement proper WebGL context cleanup.`,
            );
          }
          break;

        case "reducedMotion":
          if (result.status === "needs-improvement") {
            recommendations.push(
              `♿ Add prefers-reduced-motion support to disable animations for accessibility.`,
            );
          }
          break;

        case "webgl":
          if (result.status === "warning") {
            recommendations.push(
              `🎮 WebGL not available. Ensure graceful fallback to static visual effects.`,
            );
          }
          break;

        case "multipleTabs":
          if (result.status === "warning") {
            recommendations.push(
              `📑 Performance degrades with multiple tabs. Consider context sharing or reduced quality.`,
            );
          }
          break;

        case "slowNetwork":
          if (result.status === "warning") {
            recommendations.push(
              `🐌 Poor performance on slow networks. Consider lazy loading or progressive enhancement.`,
            );
          }
          break;
      }
    });

    // Add positive findings
    const goodTests = Object.entries(this.results)
      .filter(
        ([_, result]) =>
          result.status === "good" || result.status === "excellent",
      )
      .map(([key, _]) => key);

    if (goodTests.includes("cleanup")) {
      recommendations.push(
        "✅ Clean component unmounting prevents memory leaks.",
      );
    }

    if (goodTests.includes("reducedMotion")) {
      recommendations.push(
        "✅ Accessibility compliance with reduced motion preferences.",
      );
    }

    if (goodTests.includes("webgl")) {
      recommendations.push(
        "✅ WebGL context properly initialized and functional.",
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        "🎉 All advanced tests passed! LightRays implementation is robust.",
      );
    }

    recommendations.forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec}`);
    });
  }

  getStatusEmoji(status) {
    const emojis = {
      excellent: "🟢",
      good: "🟡",
      warning: "🟠",
      "needs-improvement": "🔴",
      failed: "❌",
    };
    return emojis[status] || "⚪";
  }
}

// Run the advanced tests
if (require.main === module) {
  const test = new AdvancedPerformanceTest();
  test.runAdvancedTests().catch(console.error);
}

module.exports = AdvancedPerformanceTest;
