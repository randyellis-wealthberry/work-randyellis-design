import {
  generateRandomImageSeed,
  createUnsplashUrl,
  generateResourceCardImages,
  validateUnsplashUrl,
} from "@/lib/utils/random-image-generator";

describe("RandomImageGenerator", () => {
  describe("generateRandomImageSeed", () => {
    it("should generate a positive integer", () => {
      const seed = generateRandomImageSeed();
      expect(typeof seed).toBe("number");
      expect(seed).toBeGreaterThan(0);
      expect(Number.isInteger(seed)).toBe(true);
    });

    it("should generate different seeds on consecutive calls", () => {
      const seed1 = generateRandomImageSeed();
      const seed2 = generateRandomImageSeed();
      const seed3 = generateRandomImageSeed();

      expect(seed1).not.toBe(seed2);
      expect(seed2).not.toBe(seed3);
      expect(seed1).not.toBe(seed3);
    });

    it("should generate seeds within reasonable range", () => {
      const seeds = Array.from({ length: 10 }, () => generateRandomImageSeed());

      seeds.forEach((seed) => {
        expect(seed).toBeGreaterThan(0);
        expect(seed).toBeLessThan(Number.MAX_SAFE_INTEGER);
      });
    });

    it("should maintain randomness over multiple calls", () => {
      const seeds = Array.from({ length: 100 }, () =>
        generateRandomImageSeed(),
      );
      const uniqueSeeds = new Set(seeds);

      // Should have at least 95% unique values (allowing for small chance of duplicates)
      expect(uniqueSeeds.size).toBeGreaterThanOrEqual(95);
    });
  });

  describe("createUnsplashUrl", () => {
    it("should create valid Unsplash URL with single category", () => {
      const url = createUnsplashUrl("abstract", 123456);
      expect(url).toBe(
        "https://source.unsplash.com/400x200/?abstract&sig=123456",
      );
    });

    it("should create valid Unsplash URL with multiple categories", () => {
      const url = createUnsplashUrl("art,geometric", 789012);
      expect(url).toBe(
        "https://source.unsplash.com/400x200/?art,geometric&sig=789012",
      );
    });

    it("should handle special characters in categories", () => {
      const url = createUnsplashUrl("digital-art", 555555);
      expect(url).toBe(
        "https://source.unsplash.com/400x200/?digital-art&sig=555555",
      );
    });

    it("should handle empty category gracefully", () => {
      const url = createUnsplashUrl("", 111111);
      expect(url).toBe("https://source.unsplash.com/400x200/?&sig=111111");
    });

    it("should handle very large seed numbers", () => {
      const largeSeed = Number.MAX_SAFE_INTEGER - 1;
      const url = createUnsplashUrl("abstract", largeSeed);
      expect(url).toContain(`sig=${largeSeed}`);
    });

    it("should create URL with correct dimensions", () => {
      const url = createUnsplashUrl("minimal", 999999);
      expect(url).toContain("400x200");
    });

    it("should use HTTPS protocol", () => {
      const url = createUnsplashUrl("design", 123456);
      expect(url.startsWith("https://")).toBe(true);
    });
  });

  describe("generateResourceCardImages", () => {
    const mockResourceCards = [
      { id: "maze-testing", imageCategory: "abstract" },
      { id: "miro-board", imageCategory: "art,geometric" },
      { id: "addvance-report", imageCategory: "digital,abstract" },
      { id: "more-projects", imageCategory: "minimal,design" },
    ];

    it("should generate unique images for all cards", () => {
      const images = generateResourceCardImages(mockResourceCards as any);

      expect(Object.keys(images)).toHaveLength(4);
      expect(images).toHaveProperty("maze-testing");
      expect(images).toHaveProperty("miro-board");
      expect(images).toHaveProperty("addvance-report");
      expect(images).toHaveProperty("more-projects");

      // All URLs should be different
      const urls = Object.values(images);
      const uniqueUrls = new Set(urls);
      expect(uniqueUrls.size).toBe(4);
    });

    it("should generate different images on multiple calls", () => {
      const images1 = generateResourceCardImages(mockResourceCards as any);
      const images2 = generateResourceCardImages(mockResourceCards as any);

      // Same keys but different URLs
      expect(Object.keys(images1)).toEqual(Object.keys(images2));
      expect(images1["maze-testing"]).not.toBe(images2["maze-testing"]);
      expect(images1["miro-board"]).not.toBe(images2["miro-board"]);
      expect(images1["addvance-report"]).not.toBe(images2["addvance-report"]);
      expect(images1["more-projects"]).not.toBe(images2["more-projects"]);
    });

    it("should use correct categories for each card", () => {
      const images = generateResourceCardImages(mockResourceCards as any);

      expect(images["maze-testing"]).toContain("abstract");
      expect(images["miro-board"]).toContain("art,geometric");
      expect(images["addvance-report"]).toContain("digital,abstract");
      expect(images["more-projects"]).toContain("minimal,design");
    });

    it("should handle empty cards array", () => {
      const images = generateResourceCardImages([]);
      expect(images).toEqual({});
    });

    it("should handle cards with missing imageCategory", () => {
      const cardsWithMissingCategory = [
        { id: "test-card" }, // Missing imageCategory
        { id: "valid-card", imageCategory: "abstract" },
      ];

      expect(() => {
        generateResourceCardImages(cardsWithMissingCategory as any);
      }).not.toThrow();
    });
  });

  describe("validateUnsplashUrl", () => {
    it("should validate correct Unsplash URLs", () => {
      const validUrl =
        "https://source.unsplash.com/400x200/?abstract&sig=123456";
      expect(validateUnsplashUrl(validUrl)).toBe(true);
    });

    it("should reject non-Unsplash URLs", () => {
      expect(validateUnsplashUrl("https://example.com/image.jpg")).toBe(false);
      expect(validateUnsplashUrl("https://google.com")).toBe(false);
    });

    it("should reject HTTP (non-HTTPS) URLs", () => {
      const httpUrl = "http://source.unsplash.com/400x200/?abstract&sig=123456";
      expect(validateUnsplashUrl(httpUrl)).toBe(false);
    });

    it("should reject malformed URLs", () => {
      expect(validateUnsplashUrl("not-a-url")).toBe(false);
      expect(validateUnsplashUrl("")).toBe(false);
      expect(validateUnsplashUrl("https://")).toBe(false);
    });

    it("should validate URLs with different categories", () => {
      const urls = [
        "https://source.unsplash.com/400x200/?abstract&sig=123",
        "https://source.unsplash.com/400x200/?art,geometric&sig=456",
        "https://source.unsplash.com/400x200/?digital-art&sig=789",
      ];

      urls.forEach((url) => {
        expect(validateUnsplashUrl(url)).toBe(true);
      });
    });
  });

  describe("Performance", () => {
    it("should generate seeds quickly", () => {
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        generateRandomImageSeed();
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should be very fast (less than 10ms for 1000 seeds)
      expect(duration).toBeLessThan(10);
    });

    it("should create URLs quickly", () => {
      const startTime = performance.now();

      for (let i = 0; i < 1000; i++) {
        createUnsplashUrl("abstract", i);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should be very fast (less than 5ms for 1000 URLs)
      expect(duration).toBeLessThan(5);
    });

    it("should handle memory efficiently with large numbers", () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Generate many seeds
      const seeds = Array.from({ length: 10000 }, () =>
        generateRandomImageSeed(),
      );

      const afterMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Should not use excessive memory (allow up to 1MB increase)
      if (initialMemory > 0) {
        expect(afterMemory - initialMemory).toBeLessThan(1024 * 1024);
      }

      // Clean up
      seeds.length = 0;
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid successive calls", () => {
      const seeds = [];

      // Generate many seeds in quick succession
      for (let i = 0; i < 100; i++) {
        seeds.push(generateRandomImageSeed());
      }

      // Should still maintain uniqueness
      const uniqueSeeds = new Set(seeds);
      expect(uniqueSeeds.size).toBeGreaterThan(90); // Allow for some small chance of duplicates
    });

    it("should handle concurrent calls", async () => {
      const promises = Array.from({ length: 10 }, () =>
        Promise.resolve(generateRandomImageSeed()),
      );

      const results = await Promise.all(promises);

      // Should generate different seeds even in concurrent execution
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBeGreaterThanOrEqual(8); // Allow for some overlap
    });

    it("should maintain randomness after many calls", () => {
      const seeds = Array.from({ length: 1000 }, () =>
        generateRandomImageSeed(),
      );

      // Check distribution - should not have obvious patterns
      const lastDigits = seeds.map((seed) => seed % 10);
      const digitCounts = lastDigits.reduce(
        (acc, digit) => {
          acc[digit] = (acc[digit] || 0) + 1;
          return acc;
        },
        {} as Record<number, number>,
      );

      // Each digit should appear roughly 100 times (allowing for variance)
      Object.values(digitCounts).forEach((count) => {
        expect(count).toBeGreaterThan(50);
        expect(count).toBeLessThan(150);
      });
    });
  });
});
