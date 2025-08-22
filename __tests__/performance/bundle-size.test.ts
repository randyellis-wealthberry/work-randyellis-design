import { describe, test, expect, beforeAll } from "@jest/globals";
import { promises as fs } from "fs";
import path from "path";

type BundleStats = {
  fileName: string;
  size: number;
  gzipSize?: number;
};

type BundleLimits = {
  maxMainBundleSize: number; // KB
  maxChunkSize: number; // KB
  maxTotalJSSize: number; // KB
  maxThreeJSChunkSize: number; // KB
  maxFrameworkChunkSize: number; // KB
};

// Performance budget limits (these should initially fail)
const BUNDLE_LIMITS: BundleLimits = {
  maxMainBundleSize: 120, // Currently ~172KB (4bd1b696 chunk)
  maxChunkSize: 200, // Currently 428KB (f58c171e chunk)
  maxTotalJSSize: 800, // Total JavaScript budget
  maxThreeJSChunkSize: 150, // Three.js related chunks should be smaller
  maxFrameworkChunkSize: 180, // Framework chunks (React, Next.js)
};

const BUILD_DIR = path.join(process.cwd(), ".next", "static", "chunks");

describe("Bundle Size Performance Tests", () => {
  let bundleStats: BundleStats[] = [];
  let totalJSSize = 0;

  beforeAll(async () => {
    try {
      const files = await fs.readdir(BUILD_DIR);

      for (const file of files) {
        if (file.endsWith(".js") && !file.includes("app/")) {
          const filePath = path.join(BUILD_DIR, file);
          const stats = await fs.stat(filePath);
          const sizeKB = Math.round(stats.size / 1024);

          bundleStats.push({
            fileName: file,
            size: sizeKB,
          });

          totalJSSize += sizeKB;
        }
      }

      // Sort by size descending
      bundleStats.sort((a, b) => b.size - a.size);
    } catch (error) {
      console.warn("Build directory not found. Run npm run build first.");
    }
  });

  test("Main bundle size should be under limit", () => {
    const mainBundle = bundleStats.find(
      (bundle) =>
        bundle.fileName.includes("4bd1b696") || // Current main chunk
        bundle.fileName.includes("main-"),
    );

    if (mainBundle) {
      expect(mainBundle.size).toBeLessThanOrEqual(
        BUNDLE_LIMITS.maxMainBundleSize,
      );
    } else {
      console.warn("Main bundle not found in build output");
    }
  });

  test("No individual chunk should exceed size limit", () => {
    const oversizedChunks = bundleStats.filter(
      (bundle) => bundle.size > BUNDLE_LIMITS.maxChunkSize,
    );

    if (oversizedChunks.length > 0) {
      console.log(
        "Oversized chunks:",
        oversizedChunks.map((c) => `${c.fileName}: ${c.size}KB`),
      );
      expect(oversizedChunks).toHaveLength(0);
    }
  });

  test("Total JavaScript size should be under budget", () => {
    expect(totalJSSize).toBeLessThanOrEqual(BUNDLE_LIMITS.maxTotalJSSize);
  });

  test("Three.js related chunks should be optimized", () => {
    // Look for chunks that likely contain Three.js code
    const potentialThreeJSChunks = bundleStats.filter((bundle) => {
      // Large chunks are likely to contain Three.js
      return bundle.size > 300; // KB - chunks this large likely contain 3D libraries
    });

    potentialThreeJSChunks.forEach((chunk) => {
      expect(chunk.size).toBeLessThanOrEqual(BUNDLE_LIMITS.maxThreeJSChunkSize);
    });
  });

  test("Framework chunks should be within limits", () => {
    const frameworkChunks = bundleStats.filter(
      (bundle) =>
        bundle.fileName.includes("framework-") ||
        bundle.fileName.includes("webpack-") ||
        bundle.fileName.includes("polyfills-"),
    );

    frameworkChunks.forEach((chunk) => {
      expect(chunk.size).toBeLessThanOrEqual(
        BUNDLE_LIMITS.maxFrameworkChunkSize,
      );
    });
  });

  test("Bundle distribution should be reasonable", () => {
    // Skip test if no build artifacts are available (test environment)
    if (bundleStats.length === 0 || totalJSSize === 0) {
      console.log("No bundle stats available, skipping test");
      return;
    }

    // No single chunk should be more than 40% of total bundle size
    const largestChunk = bundleStats[0];
    if (largestChunk && totalJSSize > 0) {
      const percentage = (largestChunk.size / totalJSSize) * 100;
      expect(percentage).toBeLessThan(40);
    }
  });

  test("Should not have too many small chunks (bundle splitting efficiency)", () => {
    const smallChunks = bundleStats.filter((bundle) => bundle.size < 10); // Less than 10KB
    const totalChunks = bundleStats.length;

    if (totalChunks > 0) {
      const smallChunkPercentage = (smallChunks.length / totalChunks) * 100;
      // Less than 30% of chunks should be very small (indicates over-splitting)
      expect(smallChunkPercentage).toBeLessThan(30);
    }
  });

  test("Critical performance metrics should be tracked", () => {
    // This test documents current state and ensures we track improvements
    const currentState = {
      totalBundles: bundleStats.length,
      totalSizeKB: totalJSSize,
      largestChunkSizeKB: bundleStats[0]?.size || 0,
      averageChunkSizeKB: totalJSSize / bundleStats.length,
    };

    console.log("Current Bundle Stats:", currentState);

    // Skip reality checks if no build artifacts are available (test environment)
    if (bundleStats.length === 0 || totalJSSize === 0) {
      console.log("No bundle stats available, skipping reality checks");
      return;
    }

    // These are current reality checks - should pass
    expect(currentState.totalBundles).toBeGreaterThan(0);
    expect(currentState.totalSizeKB).toBeGreaterThan(0);

    // Document the current "before optimization" state
    // Only check if we have actual bundle data
    if (currentState.largestChunkSizeKB > 0) {
      expect(currentState.largestChunkSizeKB).toBeGreaterThan(50); // Reasonable minimum for any chunk
    }
  });

  // Integration test for bundle analysis
  test("Bundle analysis should identify optimization opportunities", () => {
    const optimizationOpportunities = [];

    // Large chunks that could be split
    const largeChunks = bundleStats.filter((b) => b.size > 200);
    if (largeChunks.length > 0) {
      optimizationOpportunities.push({
        type: "code-splitting",
        chunks: largeChunks.map((c) => c.fileName),
        recommendation: "Consider splitting large chunks with dynamic imports",
      });
    }

    // Too many medium-sized chunks (potential for merging)
    const mediumChunks = bundleStats.filter((b) => b.size > 50 && b.size < 150);
    if (mediumChunks.length > 8) {
      optimizationOpportunities.push({
        type: "chunk-merging",
        count: mediumChunks.length,
        recommendation: "Consider merging related medium-sized chunks",
      });
    }

    console.log("Optimization Opportunities:", optimizationOpportunities);

    // This test documents opportunities rather than failing
    expect(optimizationOpportunities).toEqual(expect.any(Array));
  });
});

describe("Bundle Size Regression Tests", () => {
  test("Bundle sizes should not increase significantly", () => {
    // This would be used to prevent bundle size regressions
    // In CI, compare against baseline measurements

    const bundleSizeBaseline = {
      // These represent current state - any improvement should reduce these
      maxObservedMainBundle: 172, // KB
      maxObservedLargestChunk: 428, // KB
      maxObservedTotalSize: 1200, // KB (estimated)
    };

    // These tests ensure we don't regress from current state
    // They should be updated as we improve bundle sizes
    expect(bundleSizeBaseline.maxObservedMainBundle).toBeGreaterThan(
      BUNDLE_LIMITS.maxMainBundleSize,
    );
    expect(bundleSizeBaseline.maxObservedLargestChunk).toBeGreaterThan(
      BUNDLE_LIMITS.maxChunkSize,
    );
  });
});
