/**
 * @jest-environment jsdom
 */

import { render } from "@testing-library/react";

// Mock resource hints utilities
const resourceHints = {
  // DNS prefetching for external domains
  getDNSPrefetchHints: () => [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
    "https://images.unsplash.com",
    "https://cdn.cosmos.so",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://vercel.live",
  ],

  // Preconnect for critical third-party origins
  getPreconnectHints: () => [
    { href: "https://fonts.googleapis.com" },
    { href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    { href: "https://www.googletagmanager.com" },
    { href: "https://vercel.live" },
  ],

  // Preload for critical resources
  getPreloadHints: () => [
    {
      href: "/fonts/geist-variable.woff2",
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    {
      href: "/fonts/geist-mono-variable.woff2",
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
    {
      href: "/manifest.json",
      as: "manifest",
    },
  ],

  // Prefetch for likely navigation
  getPrefetchHints: () => [
    "/projects",
    "/about",
    "/contact",
    "/_next/static/css/app.css",
  ],
};

// Mock resource hints HTML generation
const generateResourceHintsHTML = () => {
  const dnsHints = resourceHints.getDNSPrefetchHints();
  const preconnectHints = resourceHints.getPreconnectHints();
  const preloadHints = resourceHints.getPreloadHints();
  const prefetchHints = resourceHints.getPrefetchHints();

  let html = "";

  // DNS Prefetch
  dnsHints.forEach((href) => {
    html += `<link rel="dns-prefetch" href="${href}" />`;
  });

  // Preconnect
  preconnectHints.forEach(({ href, crossOrigin }) => {
    html += `<link rel="preconnect" href="${href}"${crossOrigin ? ` crossorigin="${crossOrigin}"` : ""} />`;
  });

  // Preload
  preloadHints.forEach(({ href, as, type, crossOrigin }) => {
    html += `<link rel="preload" href="${href}" as="${as}"${type ? ` type="${type}"` : ""}${crossOrigin ? ` crossorigin="${crossOrigin}"` : ""} />`;
  });

  // Prefetch
  prefetchHints.forEach((href) => {
    html += `<link rel="prefetch" href="${href}" />`;
  });

  return html;
};

describe("CDN Resource Hints", () => {
  beforeEach(() => {
    // Clear document head before each test
    document.head.innerHTML = "";
  });

  describe("DNS Prefetch Hints", () => {
    it("should include DNS prefetch for Google Fonts", () => {
      const hints = resourceHints.getDNSPrefetchHints();

      expect(hints).toContain("https://fonts.googleapis.com");
      expect(hints).toContain("https://fonts.gstatic.com");
    });

    it("should include DNS prefetch for image CDNs", () => {
      const hints = resourceHints.getDNSPrefetchHints();

      expect(hints).toContain("https://images.unsplash.com");
      expect(hints).toContain("https://cdn.cosmos.so");
    });

    it("should include DNS prefetch for analytics domains", () => {
      const hints = resourceHints.getDNSPrefetchHints();

      expect(hints).toContain("https://www.googletagmanager.com");
      expect(hints).toContain("https://www.google-analytics.com");
    });

    it("should include DNS prefetch for Vercel services", () => {
      const hints = resourceHints.getDNSPrefetchHints();

      expect(hints).toContain("https://vercel.live");
    });

    it("should return array of valid URLs", () => {
      const hints = resourceHints.getDNSPrefetchHints();

      hints.forEach((hint) => {
        expect(hint).toMatch(/^https:\/\//);
        expect(() => new URL(hint)).not.toThrow();
      });
    });
  });

  describe("Preconnect Hints", () => {
    it("should include preconnect for critical third-party origins", () => {
      const hints = resourceHints.getPreconnectHints();

      const googleFonts = hints.find(
        (hint) => hint.href === "https://fonts.googleapis.com",
      );
      const googleFontsStatic = hints.find(
        (hint) => hint.href === "https://fonts.gstatic.com",
      );

      expect(googleFonts).toBeDefined();
      expect(googleFontsStatic).toBeDefined();
      expect(googleFontsStatic?.crossOrigin).toBe("anonymous");
    });

    it("should include crossOrigin attribute where needed", () => {
      const hints = resourceHints.getPreconnectHints();

      const fontsStaticHint = hints.find(
        (hint) => hint.href === "https://fonts.gstatic.com",
      );
      expect(fontsStaticHint?.crossOrigin).toBe("anonymous");
    });

    it("should include preconnect for analytics", () => {
      const hints = resourceHints.getPreconnectHints();

      const analyticsHint = hints.find(
        (hint) => hint.href === "https://www.googletagmanager.com",
      );
      expect(analyticsHint).toBeDefined();
    });
  });

  describe("Preload Hints", () => {
    it("should preload critical font files", () => {
      const hints = resourceHints.getPreloadHints();

      const geistFont = hints.find(
        (hint) => hint.href === "/fonts/geist-variable.woff2",
      );
      const geistMonoFont = hints.find(
        (hint) => hint.href === "/fonts/geist-mono-variable.woff2",
      );

      expect(geistFont).toBeDefined();
      expect(geistFont?.as).toBe("font");
      expect(geistFont?.type).toBe("font/woff2");
      expect(geistFont?.crossOrigin).toBe("anonymous");

      expect(geistMonoFont).toBeDefined();
      expect(geistMonoFont?.as).toBe("font");
      expect(geistMonoFont?.type).toBe("font/woff2");
      expect(geistMonoFont?.crossOrigin).toBe("anonymous");
    });

    it("should preload PWA manifest", () => {
      const hints = resourceHints.getPreloadHints();

      const manifestHint = hints.find((hint) => hint.href === "/manifest.json");
      expect(manifestHint).toBeDefined();
      expect(manifestHint?.as).toBe("manifest");
    });

    it("should have correct resource types", () => {
      const hints = resourceHints.getPreloadHints();

      hints.forEach((hint) => {
        if (hint.as === "font") {
          expect(hint.type).toBe("font/woff2");
          expect(hint.crossOrigin).toBe("anonymous");
        }
        if (hint.as === "manifest") {
          expect(hint.href).toBe("/manifest.json");
        }
      });
    });
  });

  describe("Prefetch Hints", () => {
    it("should prefetch likely navigation routes", () => {
      const hints = resourceHints.getPrefetchHints();

      expect(hints).toContain("/projects");
      expect(hints).toContain("/about");
      expect(hints).toContain("/contact");
    });

    it("should prefetch critical CSS", () => {
      const hints = resourceHints.getPrefetchHints();

      expect(hints).toContain("/_next/static/css/app.css");
    });

    it("should return array of valid paths", () => {
      const hints = resourceHints.getPrefetchHints();

      hints.forEach((hint) => {
        expect(hint).toMatch(/^\//); // Should start with /
      });
    });
  });

  describe("Resource Hints Integration", () => {
    it("should render DNS prefetch links correctly", () => {
      const html = generateResourceHintsHTML();

      expect(html).toContain(
        '<link rel="dns-prefetch" href="https://fonts.googleapis.com" />',
      );
      expect(html).toContain(
        '<link rel="dns-prefetch" href="https://fonts.gstatic.com" />',
      );

      // Count DNS prefetch links
      const dnsCount = (html.match(/rel="dns-prefetch"/g) || []).length;
      expect(dnsCount).toBeGreaterThan(0);
    });

    it("should render preconnect links correctly", () => {
      const html = generateResourceHintsHTML();

      expect(html).toContain(
        '<link rel="preconnect" href="https://fonts.googleapis.com" />',
      );
      expect(html).toContain(
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />',
      );
    });

    it("should render preload links correctly", () => {
      const html = generateResourceHintsHTML();

      expect(html).toContain('rel="preload"');
      expect(html).toContain('as="font"');
      expect(html).toContain('type="font/woff2"');
      expect(html).toContain('crossorigin="anonymous"');
    });

    it("should render prefetch links correctly", () => {
      const html = generateResourceHintsHTML();

      expect(html).toContain('<link rel="prefetch" href="/projects" />');
      expect(html).toContain('<link rel="prefetch" href="/about" />');
    });
  });

  describe("Performance Impact", () => {
    it("should have reasonable number of DNS prefetch hints", () => {
      const hints = resourceHints.getDNSPrefetchHints();

      // Should not exceed 10 DNS prefetch hints to avoid performance impact
      expect(hints.length).toBeLessThanOrEqual(10);
    });

    it("should have reasonable number of preconnect hints", () => {
      const hints = resourceHints.getPreconnectHints();

      // Should not exceed 6 preconnect hints to avoid performance impact
      expect(hints.length).toBeLessThanOrEqual(6);
    });

    it("should prioritize critical resources in preload hints", () => {
      const hints = resourceHints.getPreloadHints();

      // Should include fonts and manifest as critical resources
      const fontHints = hints.filter((hint) => hint.as === "font");
      const manifestHints = hints.filter((hint) => hint.as === "manifest");

      expect(fontHints.length).toBeGreaterThan(0);
      expect(manifestHints.length).toBeGreaterThan(0);
    });
  });

  describe("Connection Warming", () => {
    it("should warm connections to third-party services", () => {
      const preconnectHints = resourceHints.getPreconnectHints();
      const dnsHints = resourceHints.getDNSPrefetchHints();

      // Google Fonts should have both DNS prefetch and preconnect
      expect(dnsHints).toContain("https://fonts.googleapis.com");
      expect(
        preconnectHints.some(
          (hint) => hint.href === "https://fonts.googleapis.com",
        ),
      ).toBe(true);

      // Analytics should be warmed
      expect(dnsHints).toContain("https://www.googletagmanager.com");
      expect(
        preconnectHints.some(
          (hint) => hint.href === "https://www.googletagmanager.com",
        ),
      ).toBe(true);
    });
  });
});
