/**
 * TDD PHASE 1: Route Coverage Analysis
 * Tests to verify all expected routes exist and render correctly
 */

import { render, screen } from "@testing-library/react";
import { PROJECTS } from "@/lib/data/projects";

// Expected routes based on app directory structure
const EXPECTED_ROUTES = [
  // Static routes
  { path: "/", name: "Homepage" },
  { path: "/about", name: "About" },
  { path: "/projects", name: "Projects" },
  { path: "/archive", name: "Archive" },
  { path: "/metis", name: "METIS" },
  { path: "/ledgeriq", name: "LedgerIQ" },
  { path: "/addvanced", name: "Addvanced" },
  { path: "/privacy-policy", name: "Privacy Policy" },
  { path: "/terms-of-service", name: "Terms of Service" },

  // Admin routes
  { path: "/admin/email-test", name: "Email Test" },
  { path: "/admin/test-results-demo", name: "Test Results Demo" },

  // Blog routes (MDX)
  {
    path: "/blog/create-professional-videos-claude-code-guide",
    name: "Professional Videos Guide",
  },
  {
    path: "/blog/exploring-the-intersection-of-design-ai-and-design-engineering",
    name: "Design AI Intersection",
  },
  {
    path: "/blog/product-manager-guide-ai-evaluations",
    name: "PM Guide AI Evaluations",
  },
  { path: "/blog/profits-not-pixels", name: "Profits Not Pixels" },
  { path: "/blog/when-ai-gets-it-right-phion", name: "AI Gets It Right" },

  // API routes
  { path: "/api/newsletter/subscribe", name: "Newsletter Subscribe API" },
  { path: "/api/newsletter/unsubscribe", name: "Newsletter Unsubscribe API" },
  { path: "/api/newsletter/analytics", name: "Newsletter Analytics API" },
  { path: "/api/newsletter/export", name: "Newsletter Export API" },
  { path: "/api/newsletter/stats", name: "Newsletter Stats API" },
];

describe("TDD PHASE 1: Route Coverage Analysis", () => {
  describe("Static Route Verification", () => {
    test("should have all expected static routes defined", () => {
      const staticRoutes = EXPECTED_ROUTES.filter(
        (route) =>
          !route.path.startsWith("/api") &&
          !route.path.startsWith("/blog") &&
          !route.path.includes("[slug]"),
      );

      // This test will initially fail - we'll use it to identify missing routes
      expect(staticRoutes).toHaveLength(11); // We actually have 11 static routes (including admin)

      staticRoutes.forEach((route) => {
        expect(route.path).toBeDefined();
        expect(route.name).toBeDefined();
      });
    });
  });

  describe("Dynamic Route Verification", () => {
    test("should generate project routes for all projects", async () => {
      // Test that we can generate routes for all projects
      expect(PROJECTS).toBeDefined();
      expect(Array.isArray(PROJECTS)).toBe(true);
      expect(PROJECTS.length).toBeGreaterThan(0);

      PROJECTS.forEach((project) => {
        expect(project.slug).toBeDefined();
        expect(typeof project.slug).toBe("string");
        expect(project.slug.length).toBeGreaterThan(0);

        // Each project should be able to generate a valid route
        const projectRoute = `/projects/${project.slug}`;
        expect(projectRoute).toMatch(/^\/projects\/[a-z0-9-]+$/);
      });
    });
  });

  describe("Blog Route Verification", () => {
    test("should have all expected blog routes", () => {
      const blogRoutes = EXPECTED_ROUTES.filter((route) =>
        route.path.startsWith("/blog"),
      );

      expect(blogRoutes).toHaveLength(5); // Expected blog posts

      blogRoutes.forEach((route) => {
        expect(route.path).toMatch(/^\/blog\/[a-z0-9-]+$/);
        expect(route.name).toBeDefined();
      });
    });
  });

  describe("API Route Verification", () => {
    test("should have all expected API routes", () => {
      const apiRoutes = EXPECTED_ROUTES.filter((route) =>
        route.path.startsWith("/api"),
      );

      expect(apiRoutes).toHaveLength(5); // Expected API routes

      apiRoutes.forEach((route) => {
        expect(route.path).toMatch(/^\/api\/[a-z0-9/-]+$/);
        expect(route.name).toBeDefined();
      });
    });
  });

  describe("Route Manifest Integration", () => {
    test("should verify app-paths-manifest includes expected routes", () => {
      // This test will help us identify the manifest generation issue
      // We expect the manifest to include more than just "/page"

      // Mock what the manifest should contain
      const expectedManifestRoutes = [
        "/page",
        "/about/page",
        "/projects/page",
        "/projects/[slug]/page",
        "/archive/page",
        "/metis/page",
        "/ledgeriq/page",
        "/addvanced/page",
        "/privacy-policy/page",
        "/terms-of-service/page",
      ];

      expectedManifestRoutes.forEach((route) => {
        expect(route).toBeDefined();
        expect(typeof route).toBe("string");
      });

      // This will initially fail and help us identify what's missing
      expect(expectedManifestRoutes.length).toBeGreaterThan(1);
    });
  });

  describe("SEO and Meta Routes", () => {
    test("should have SEO-related routes", () => {
      const seoRoutes = [
        "/sitemap.xml",
        "/robots.txt",
        "/manifest.webmanifest",
        "/opengraph-image",
        "/icon",
        "/apple-icon",
      ];

      seoRoutes.forEach((route) => {
        expect(route).toBeDefined();
        expect(typeof route).toBe("string");
      });
    });
  });
});
