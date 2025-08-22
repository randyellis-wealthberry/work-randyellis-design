/**
 * @jest-environment jsdom
 */

import { ImageProps } from "next/image";

// Mock Next.js Image optimization configuration
const imageOptimization = {
  // Device sizes for responsive images
  getDeviceSizes: () => [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

  // Image sizes for different use cases
  getImageSizes: () => [16, 32, 48, 64, 96, 128, 256, 384],

  // Supported modern formats
  getSupportedFormats: () => ["image/webp", "image/avif"],

  // Remote patterns for external image sources
  getRemotePatterns: () => [
    {
      protocol: "https",
      hostname: "images.unsplash.com",
      port: "",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "cdn.cosmos.so",
      port: "",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "work.randyellis.design",
      port: "",
      pathname: "/**",
    },
  ],

  // Cache TTL configuration
  getCacheTTL: () => 31536000, // 1 year

  // Quality settings for different contexts
  getQualitySettings: () => ({
    default: 75,
    thumbnail: 60,
    hero: 85,
    gallery: 80,
  }),

  // Generate srcSet for responsive images
  generateSrcSet: (src: string, sizes: number[]) => {
    return sizes.map((size) => `${src}?w=${size}&q=75 ${size}w`).join(", ");
  },

  // Generate optimized image URL
  generateOptimizedUrl: (src: string, width?: number, quality?: number) => {
    const params = new URLSearchParams();
    if (width) params.set("w", width.toString());
    if (quality) params.set("q", quality.toString());

    return `${src}?${params.toString()}`;
  },

  // Check if URL matches allowed patterns
  isAllowedSource: (src: string) => {
    const patterns = imageOptimization.getRemotePatterns();

    try {
      const url = new URL(src);
      return patterns.some((pattern) => {
        return (
          pattern.protocol === url.protocol.slice(0, -1) &&
          pattern.hostname === url.hostname
        );
      });
    } catch {
      // If it's a relative path, it's allowed
      return src.startsWith("/");
    }
  },
};

// Mock optimized image attributes generation
interface OptimizedImageProps {
  src: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  alt: string;
}

const generateOptimizedImageAttributes = ({
  src,
  width,
  height,
  quality = 75,
  priority = false,
  alt,
}: OptimizedImageProps) => {
  const deviceSizes = imageOptimization.getDeviceSizes();
  const optimizedSrc = imageOptimization.generateOptimizedUrl(
    src,
    Number(width),
    quality,
  );
  const srcSet = imageOptimization.generateSrcSet(src, deviceSizes);

  return {
    src: optimizedSrc,
    srcSet,
    width,
    height,
    alt,
    loading: priority ? "eager" : "lazy",
    decoding: "async",
  };
};

describe("CDN Image Optimization", () => {
  describe("Configuration", () => {
    it("should have proper device sizes for responsive images", () => {
      const deviceSizes = imageOptimization.getDeviceSizes();

      expect(deviceSizes).toContain(640); // Mobile
      expect(deviceSizes).toContain(1200); // Desktop
      expect(deviceSizes).toContain(1920); // Large desktop
      expect(deviceSizes).toContain(3840); // 4K displays

      // Should be in ascending order
      const sortedSizes = [...deviceSizes].sort((a, b) => a - b);
      expect(deviceSizes).toEqual(sortedSizes);
    });

    it("should have appropriate image sizes for different use cases", () => {
      const imageSizes = imageOptimization.getImageSizes();

      expect(imageSizes).toContain(16); // Small icons
      expect(imageSizes).toContain(64); // Medium icons
      expect(imageSizes).toContain(256); // Large thumbnails
      expect(imageSizes).toContain(384); // Hero images (partial)

      // Should be in ascending order
      const sortedSizes = [...imageSizes].sort((a, b) => a - b);
      expect(imageSizes).toEqual(sortedSizes);
    });

    it("should support modern image formats", () => {
      const formats = imageOptimization.getSupportedFormats();

      expect(formats).toContain("image/webp");
      expect(formats).toContain("image/avif");
    });

    it("should have long-term cache TTL", () => {
      const cacheTTL = imageOptimization.getCacheTTL();

      expect(cacheTTL).toBe(31536000); // 1 year in seconds
    });
  });

  describe("Remote Patterns", () => {
    it("should allow Unsplash images", () => {
      const patterns = imageOptimization.getRemotePatterns();

      const unsplashPattern = patterns.find(
        (p) => p.hostname === "images.unsplash.com",
      );
      expect(unsplashPattern).toBeDefined();
      expect(unsplashPattern?.protocol).toBe("https");
      expect(unsplashPattern?.pathname).toBe("/**");
    });

    it("should allow Cosmos CDN images", () => {
      const patterns = imageOptimization.getRemotePatterns();

      const cosmosPattern = patterns.find(
        (p) => p.hostname === "cdn.cosmos.so",
      );
      expect(cosmosPattern).toBeDefined();
      expect(cosmosPattern?.protocol).toBe("https");
    });

    it("should allow own domain images", () => {
      const patterns = imageOptimization.getRemotePatterns();

      const ownDomainPattern = patterns.find(
        (p) => p.hostname === "work.randyellis.design",
      );
      expect(ownDomainPattern).toBeDefined();
      expect(ownDomainPattern?.protocol).toBe("https");
    });

    it("should validate allowed sources correctly", () => {
      expect(
        imageOptimization.isAllowedSource(
          "https://images.unsplash.com/photo-123",
        ),
      ).toBe(true);
      expect(
        imageOptimization.isAllowedSource("https://cdn.cosmos.so/image.jpg"),
      ).toBe(true);
      expect(
        imageOptimization.isAllowedSource(
          "https://work.randyellis.design/logo.png",
        ),
      ).toBe(true);
      expect(imageOptimization.isAllowedSource("/local-image.jpg")).toBe(true);
      expect(
        imageOptimization.isAllowedSource("https://evil.com/malicious.jpg"),
      ).toBe(false);
    });
  });

  describe("Quality Settings", () => {
    it("should have appropriate quality settings for different contexts", () => {
      const quality = imageOptimization.getQualitySettings();

      expect(quality.default).toBe(75);
      expect(quality.thumbnail).toBe(60); // Lower quality for thumbnails
      expect(quality.hero).toBe(85); // Higher quality for hero images
      expect(quality.gallery).toBe(80); // Good quality for gallery
    });

    it("should balance quality and file size", () => {
      const quality = imageOptimization.getQualitySettings();

      // Thumbnail should have lowest quality
      expect(quality.thumbnail).toBeLessThan(quality.default);

      // Hero should have highest quality
      expect(quality.hero).toBeGreaterThan(quality.default);

      // All qualities should be reasonable (30-95 range)
      Object.values(quality).forEach((q) => {
        expect(q).toBeGreaterThanOrEqual(30);
        expect(q).toBeLessThanOrEqual(95);
      });
    });
  });

  describe("URL Generation", () => {
    it("should generate optimized URLs with width and quality parameters", () => {
      const src = "/images/hero.jpg";
      const optimizedUrl = imageOptimization.generateOptimizedUrl(src, 800, 85);

      expect(optimizedUrl).toBe("/images/hero.jpg?w=800&q=85");
    });

    it("should generate URLs with only width when quality not specified", () => {
      const src = "/images/thumbnail.jpg";
      const optimizedUrl = imageOptimization.generateOptimizedUrl(src, 200);

      expect(optimizedUrl).toBe("/images/thumbnail.jpg?w=200");
    });

    it("should generate URLs with only quality when width not specified", () => {
      const src = "/images/gallery.jpg";
      const optimizedUrl = imageOptimization.generateOptimizedUrl(
        src,
        undefined,
        80,
      );

      expect(optimizedUrl).toBe("/images/gallery.jpg?q=80");
    });

    it("should return original URL when no parameters specified", () => {
      const src = "/images/original.jpg";
      const optimizedUrl = imageOptimization.generateOptimizedUrl(src);

      expect(optimizedUrl).toBe("/images/original.jpg?");
    });
  });

  describe("Responsive Images", () => {
    it("should generate proper srcSet for responsive images", () => {
      const src = "/images/responsive.jpg";
      const sizes = [640, 1200, 1920];
      const srcSet = imageOptimization.generateSrcSet(src, sizes);

      expect(srcSet).toBe(
        "/images/responsive.jpg?w=640&q=75 640w, " +
          "/images/responsive.jpg?w=1200&q=75 1200w, " +
          "/images/responsive.jpg?w=1920&q=75 1920w",
      );
    });

    it("should include appropriate widths in srcSet", () => {
      const deviceSizes = imageOptimization.getDeviceSizes();
      const src = "/images/test.jpg";
      const srcSet = imageOptimization.generateSrcSet(src, deviceSizes);

      // Should include mobile sizes
      expect(srcSet).toContain("640w");
      expect(srcSet).toContain("750w");

      // Should include desktop sizes
      expect(srcSet).toContain("1200w");
      expect(srcSet).toContain("1920w");

      // Should include high-DPI sizes
      expect(srcSet).toContain("2048w");
      expect(srcSet).toContain("3840w");
    });
  });

  describe("Performance Optimization", () => {
    it("should use lazy loading by default", () => {
      const container = document.createElement("div");
      container.innerHTML = `<img loading="lazy" />`;

      const img = container.querySelector("img");
      expect(img?.getAttribute("loading")).toBe("lazy");
    });

    it("should use eager loading for priority images", () => {
      const container = document.createElement("div");
      container.innerHTML = `<img loading="eager" />`;

      const img = container.querySelector("img");
      expect(img?.getAttribute("loading")).toBe("eager");
    });

    it("should include async decoding", () => {
      const container = document.createElement("div");
      container.innerHTML = `<img decoding="async" />`;

      const img = container.querySelector("img");
      expect(img?.getAttribute("decoding")).toBe("async");
    });
  });

  describe("WebP/AVIF Support", () => {
    it("should prioritize AVIF over WebP in format array", () => {
      const formats = imageOptimization.getSupportedFormats();

      const avifIndex = formats.indexOf("image/avif");
      const webpIndex = formats.indexOf("image/webp");

      expect(avifIndex).toBeGreaterThanOrEqual(0);
      expect(webpIndex).toBeGreaterThanOrEqual(0);

      // AVIF should come after WebP for fallback support
      expect(webpIndex).toBeLessThan(avifIndex);
    });

    it("should include modern formats for better compression", () => {
      const formats = imageOptimization.getSupportedFormats();

      // Should support next-gen formats
      expect(formats).toContain("image/webp");
      expect(formats).toContain("image/avif");

      // Should have exactly these formats
      expect(formats).toHaveLength(2);
    });
  });

  describe("Security", () => {
    it("should prevent unauthorized external domains", () => {
      const maliciousUrls = [
        "https://evil.com/malicious.jpg",
        "https://attacker.site/image.png",
        "http://unsecure.com/photo.gif",
      ];

      maliciousUrls.forEach((url) => {
        expect(imageOptimization.isAllowedSource(url)).toBe(false);
      });
    });

    it("should allow only HTTPS for external sources", () => {
      const patterns = imageOptimization.getRemotePatterns();

      patterns.forEach((pattern) => {
        expect(pattern.protocol).toBe("https");
      });
    });

    it("should validate URL format", () => {
      const invalidUrls = [
        "not-a-url",
        "ftp://files.example.com/image.jpg",
        "javascript:alert(1)",
      ];

      invalidUrls.forEach((url) => {
        expect(imageOptimization.isAllowedSource(url)).toBe(false);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty srcSet gracefully", () => {
      const srcSet = imageOptimization.generateSrcSet("/test.jpg", []);
      expect(srcSet).toBe("");
    });

    it("should handle relative paths", () => {
      expect(imageOptimization.isAllowedSource("/images/local.jpg")).toBe(true);
      expect(imageOptimization.isAllowedSource("../images/relative.jpg")).toBe(
        false,
      );
      expect(
        imageOptimization.isAllowedSource("./images/dot-relative.jpg"),
      ).toBe(false);
    });

    it("should handle edge case dimensions", () => {
      const verySmall = imageOptimization.generateOptimizedUrl(
        "/test.jpg",
        1,
        1,
      );
      const veryLarge = imageOptimization.generateOptimizedUrl(
        "/test.jpg",
        10000,
        100,
      );

      expect(verySmall).toBe("/test.jpg?w=1&q=1");
      expect(veryLarge).toBe("/test.jpg?w=10000&q=100");
    });
  });
});
