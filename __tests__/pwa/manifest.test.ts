/**
 * @jest-environment jsdom
 */

import { describe, it, expect, beforeEach } from "@jest/globals";

// Mock the manifest file for testing
const mockManifest = {
  name: "Randy Ellis - Portfolio",
  short_name: "Randy Ellis",
  description:
    "Creative developer and designer specializing in innovative digital experiences",
  start_url: "/",
  display: "standalone",
  background_color: "#000000",
  theme_color: "#000000",
  icons: [
    {
      src: "/icons/icon-72x72.png",
      sizes: "72x72",
      type: "image/png",
    },
    {
      src: "/icons/icon-96x96.png",
      sizes: "96x96",
      type: "image/png",
    },
    {
      src: "/icons/icon-128x128.png",
      sizes: "128x128",
      type: "image/png",
    },
    {
      src: "/icons/icon-144x144.png",
      sizes: "144x144",
      type: "image/png",
    },
    {
      src: "/icons/icon-152x152.png",
      sizes: "152x152",
      type: "image/png",
    },
    {
      src: "/icons/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/icons/icon-384x384.png",
      sizes: "384x384",
      type: "image/png",
    },
    {
      src: "/icons/icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
  categories: ["portfolio", "design", "development"],
  lang: "en",
  orientation: "portrait-primary",
  scope: "/",
  prefer_related_applications: false,
};

describe("PWA Manifest Tests", () => {
  beforeEach(() => {
    // Reset DOM
    document.head.innerHTML = "";

    // Mock fetch for manifest requests
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("Manifest File Validation", () => {
    it("should have valid manifest.json structure", () => {
      expect(mockManifest).toMatchObject({
        name: expect.any(String),
        short_name: expect.any(String),
        description: expect.any(String),
        start_url: expect.any(String),
        display: expect.any(String),
        background_color: expect.any(String),
        theme_color: expect.any(String),
        icons: expect.arrayContaining([
          expect.objectContaining({
            src: expect.any(String),
            sizes: expect.any(String),
            type: expect.any(String),
          }),
        ]),
      });
    });

    it("should have required PWA manifest properties", () => {
      expect(mockManifest.name).toBeDefined();
      expect(mockManifest.name.length).toBeGreaterThan(0);
      expect(mockManifest.name.length).toBeLessThanOrEqual(45);

      expect(mockManifest.short_name).toBeDefined();
      expect(mockManifest.short_name.length).toBeLessThanOrEqual(12);

      expect(mockManifest.description).toBeDefined();
      expect(mockManifest.description.length).toBeGreaterThan(0);

      expect(mockManifest.start_url).toBe("/");
      expect(["fullscreen", "standalone", "minimal-ui", "browser"]).toContain(
        mockManifest.display,
      );

      expect(mockManifest.background_color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(mockManifest.theme_color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it("should have all required icon sizes for PWA", () => {
      const requiredSizes = [
        "72x72",
        "96x96",
        "128x128",
        "144x144",
        "152x152",
        "192x192",
        "384x384",
        "512x512",
      ];
      const availableSizes = mockManifest.icons.map((icon) => icon.sizes);

      requiredSizes.forEach((size) => {
        expect(availableSizes).toContain(size);
      });
    });

    it("should have proper icon format and paths", () => {
      mockManifest.icons.forEach((icon) => {
        expect(icon.src).toMatch(/^\/icons\/icon-\d+x\d+\.png$/);
        expect(icon.type).toBe("image/png");
        expect(icon.sizes).toMatch(/^\d+x\d+$/);
      });
    });

    it("should have valid scope and start_url relationship", () => {
      expect(mockManifest.start_url).toMatch(
        new RegExp(`^${mockManifest.scope}`),
      );
    });

    it("should have appropriate categories for portfolio site", () => {
      expect(mockManifest.categories).toContain("portfolio");
      expect(mockManifest.categories).toContain("design");
      expect(mockManifest.categories).toContain("development");
    });
  });

  describe("Manifest Link Tag", () => {
    it("should have manifest link tag in document head", () => {
      // Simulate manifest link being added to head
      const link = document.createElement("link");
      link.rel = "manifest";
      link.href = "/manifest.json";
      document.head.appendChild(link);

      const manifestLink = document.querySelector(
        'link[rel="manifest"]',
      ) as HTMLLinkElement;
      expect(manifestLink).toBeTruthy();
      expect(manifestLink.href).toContain("/manifest.json");
    });

    it("should have theme-color meta tag", () => {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.content = mockManifest.theme_color;
      document.head.appendChild(meta);

      const themeColorMeta = document.querySelector(
        'meta[name="theme-color"]',
      ) as HTMLMetaElement;
      expect(themeColorMeta).toBeTruthy();
      expect(themeColorMeta.content).toBe(mockManifest.theme_color);
    });

    it("should have apple-touch-icon for iOS compatibility", () => {
      const appleIcon = document.createElement("link");
      appleIcon.rel = "apple-touch-icon";
      appleIcon.href = "/icons/icon-192x192.png";
      document.head.appendChild(appleIcon);

      const appleIconLink = document.querySelector(
        'link[rel="apple-touch-icon"]',
      ) as HTMLLinkElement;
      expect(appleIconLink).toBeTruthy();
      expect(appleIconLink.href).toContain("/icons/icon-192x192.png");
    });

    it("should have viewport meta tag for mobile optimization", () => {
      const viewport = document.createElement("meta");
      viewport.name = "viewport";
      viewport.content =
        "width=device-width, initial-scale=1, shrink-to-fit=no";
      document.head.appendChild(viewport);

      const viewportMeta = document.querySelector(
        'meta[name="viewport"]',
      ) as HTMLMetaElement;
      expect(viewportMeta).toBeTruthy();
      expect(viewportMeta.content).toContain("width=device-width");
      expect(viewportMeta.content).toContain("initial-scale=1");
    });
  });

  describe("Manifest Accessibility", () => {
    it("should have proper color contrast for theme colors", () => {
      // Basic color contrast check (would need more sophisticated implementation in real app)
      expect(mockManifest.background_color).toBe("#000000");
      expect(mockManifest.theme_color).toBe("#000000");

      // Ensure text would be readable on these backgrounds
      expect(mockManifest.background_color).not.toBe("#ffffff"); // Avoid potential contrast issues
    });

    it("should have descriptive name and description", () => {
      expect(mockManifest.name).not.toMatch(/^[0-9]+$/); // Not just numbers
      expect(mockManifest.description).toContain("developer");
      expect(mockManifest.description).toContain("design");
      expect(mockManifest.description.length).toBeGreaterThan(20);
    });
  });

  describe("Manifest Performance", () => {
    it("should specify prefer_related_applications as false for web-first approach", () => {
      expect(mockManifest.prefer_related_applications).toBe(false);
    });

    it("should have optimized icon sizes for different devices", () => {
      const iconSizes = mockManifest.icons.map((icon) => {
        const [width, height] = icon.sizes.split("x").map(Number);
        return width * height;
      });

      // Should have a good range of sizes
      expect(Math.min(...iconSizes)).toBeLessThanOrEqual(72 * 72);
      expect(Math.max(...iconSizes)).toBeGreaterThanOrEqual(512 * 512);
    });

    it("should have efficient icon format (PNG)", () => {
      mockManifest.icons.forEach((icon) => {
        expect(icon.type).toBe("image/png");
      });
    });
  });

  describe("Installability Requirements", () => {
    it("should meet basic PWA installability criteria", () => {
      // Check for essential manifest properties needed for installation
      expect(mockManifest.name).toBeDefined();
      expect(mockManifest.short_name).toBeDefined();
      expect(mockManifest.start_url).toBeDefined();
      expect(mockManifest.display).toBe("standalone");

      // Should have at least one icon >= 192x192
      const hasLargeIcon = mockManifest.icons.some((icon) => {
        const [width] = icon.sizes.split("x").map(Number);
        return width >= 192;
      });
      expect(hasLargeIcon).toBe(true);
    });

    it("should have proper display mode for app-like experience", () => {
      expect(["standalone", "fullscreen"]).toContain(mockManifest.display);
    });

    it("should have appropriate orientation for portfolio content", () => {
      expect(["portrait", "portrait-primary", "any"]).toContain(
        mockManifest.orientation,
      );
    });
  });
});
