/**
 * Route-wiring drift test (Phase 9 D-14, Phase 10 D-10)
 *
 * Guards that all 5 case-study routes continue to derive metadata from
 * lib/metadata.ts helpers (Phase 9) and now emit server-rendered JSON-LD
 * via lib/seo/json-ld.ts builders and components/seo/json-ld.tsx (Phase 10).
 * Waffle remains untouched (uses createPageMetadata, not projectMetadata).
 */

import * as fs from "fs";
import * as path from "path";
import { renderToStaticMarkup } from "react-dom/server";

const ROUTES = {
  slug: "app/projects/[slug]/page.tsx",
  addvanced: "app/projects/addvanced/page.tsx",
  echo: "app/projects/echo/page.tsx",
  nagarro: "app/projects/nagarro/page.tsx",
  rambisUi: "app/projects/rambis-ui/page.tsx",
} as const;

const WAFFLE_ROUTE = "app/projects/waffle/page.tsx";

describe("Project route wiring (D-14)", () => {
  describe.each([
    ["[slug]", ROUTES.slug],
    ["addvanced", ROUTES.addvanced],
    ["echo", ROUTES.echo],
    ["nagarro", ROUTES.nagarro],
    ["rambis-ui", ROUTES.rambisUi],
  ])("%s route", (name, routePath) => {
    let source: string;

    beforeAll(() => {
      const fullPath = path.join(process.cwd(), routePath);
      source = fs.readFileSync(fullPath, "utf-8");
    });

    it("uses projectMetadata helper", () => {
      expect(source).toContain("projectMetadata(");
    });

    it("derives CreativeWork via buildCreativeWorkSchema(project)", () => {
      expect(source).toContain("buildCreativeWorkSchema(project)");
    });

    it("uses projectBreadcrumbItems helper", () => {
      expect(source).toContain("projectBreadcrumbItems(");
    });

    it("renders server-rendered JSON-LD via JsonLd component", () => {
      expect(source).toContain("<JsonLd");
      expect(source).toContain(
        "buildBreadcrumbSchema(projectBreadcrumbItems(project))",
      );
      expect(source).toContain('from "@/components/seo/json-ld"');
    });

    it("does NOT use client structured-data components", () => {
      expect(source).not.toContain("components/seo/structured-data");
      expect(source).not.toContain("CreativeWorkStructuredData");
      expect(source).not.toContain("BreadcrumbStructuredData");
    });

    it("does NOT contain ProjectFAQStructuredData", () => {
      expect(source).not.toContain("ProjectFAQStructuredData");
      expect(source).not.toContain("project-faq");
    });

    it("does NOT contain longDescription reference", () => {
      expect(source).not.toContain("longDescription");
    });

    it("does NOT contain literal openGraph: key", () => {
      expect(source).not.toMatch(/\bopenGraph\s*:/);
    });
  });

  describe("Standalone routes (addvanced, echo, nagarro, rambis-ui)", () => {
    const standaloneRoutes = [
      ["addvanced", ROUTES.addvanced, "addvanced"],
      ["echo", ROUTES.echo, "echo"],
      ["nagarro", ROUTES.nagarro, "nagarro"],
      ["rambis-ui", ROUTES.rambisUi, "rambis-ui"],
    ] as const;

    describe.each(standaloneRoutes)("%s", (name, routePath, slug) => {
      let source: string;

      beforeAll(() => {
        const fullPath = path.join(process.cwd(), routePath);
        source = fs.readFileSync(fullPath, "utf-8");
      });

      it("exports metadata via projectMetadata(project)", () => {
        expect(source).toContain(
          "export const metadata: Metadata = projectMetadata(project);",
        );
      });

      it(`looks up project by slug "${slug}"`, () => {
        expect(source).toContain(`p.slug === "${slug}"`);
      });
    });
  });

  describe("Waffle exclusion (D-13)", () => {
    let waffleSource: string;

    beforeAll(() => {
      const fullPath = path.join(process.cwd(), WAFFLE_ROUTE);
      waffleSource = fs.readFileSync(fullPath, "utf-8");
    });

    it("uses createPageMetadata (NOT projectMetadata)", () => {
      expect(waffleSource).toContain("createPageMetadata(");
      expect(waffleSource).not.toContain("projectMetadata(");
    });

    it("does NOT use server-rendered JSON-LD builders", () => {
      expect(waffleSource).not.toContain("buildCreativeWorkSchema");
      expect(waffleSource).not.toContain('@/components/seo/json-ld"');
    });

    it("does NOT render old client structured-data components", () => {
      expect(waffleSource).not.toContain("CreativeWorkStructuredData");
      expect(waffleSource).not.toContain("BreadcrumbStructuredData");
    });
  });

  describe("project-faq.tsx deletion", () => {
    it("components/seo/project-faq.tsx does not exist", () => {
      const faqPath = path.join(
        process.cwd(),
        "components/seo/project-faq.tsx",
      );
      expect(fs.existsSync(faqPath)).toBe(false);
    });
  });

  describe("Site-level wiring (Phase 10 D-10)", () => {
    it("app/layout.tsx uses server-rendered Person + WebSite", () => {
      const layoutPath = path.join(process.cwd(), "app/layout.tsx");
      const layoutSource = fs.readFileSync(layoutPath, "utf-8");

      expect(layoutSource).toContain("buildPersonSchema()");
      expect(layoutSource).toContain("buildWebSiteSchema()");
      expect(layoutSource).toContain('from "@/components/seo/json-ld"');
      expect(layoutSource).not.toContain("structured-data");
    });

    it("app/about/page.tsx uses server-rendered BreadcrumbList", () => {
      const aboutPath = path.join(process.cwd(), "app/about/page.tsx");
      const aboutSource = fs.readFileSync(aboutPath, "utf-8");

      expect(aboutSource).toContain("buildBreadcrumbSchema(");
      expect(aboutSource).not.toContain("structured-data");
    });

    it("app/metis/page.tsx uses server-rendered BreadcrumbList", () => {
      const metisPath = path.join(process.cwd(), "app/metis/page.tsx");
      const metisSource = fs.readFileSync(metisPath, "utf-8");

      expect(metisSource).toContain("buildBreadcrumbSchema(");
      expect(metisSource).not.toContain("structured-data");
    });

    it("components/ui/breadcrumb-nav.tsx is visual-only", () => {
      const navPath = path.join(
        process.cwd(),
        "components/ui/breadcrumb-nav.tsx",
      );
      const navSource = fs.readFileSync(navPath, "utf-8");

      expect(navSource).not.toContain("BreadcrumbStructuredData");
      expect(navSource).not.toContain("application/ld+json");
      expect(navSource).not.toContain("structuredData");
    });
  });

  describe("Rendered JSON-LD (Phase 10 D-10)", () => {
    // Mock heavy client components and next/navigation
    jest.mock("@/app/projects/[slug]/project-detail-client", () => ({
      __esModule: true,
      default: () => null,
    }));
    jest.mock("@/app/projects/addvanced/addvanced-client", () => ({
      __esModule: true,
      default: () => null,
    }));
    jest.mock("next/navigation", () => ({
      notFound: jest.fn(),
    }));

    it("growit route renders CreativeWork + BreadcrumbList JSON-LD", async () => {
      const ProjectDetailPage = (await import("@/app/projects/[slug]/page"))
        .default;
      const html = renderToStaticMarkup(
        await ProjectDetailPage({
          params: Promise.resolve({ slug: "growit" }),
        }),
      );

      // Extract all <script type="application/ld+json"> blocks
      const scriptRegex =
        /<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs;
      const matches = Array.from(html.matchAll(scriptRegex));
      const schemas = matches.map((m) => JSON.parse(m[1]));

      // Expect exactly one CreativeWork
      const creativeWork = schemas.find((s) => s["@type"] === "CreativeWork");
      expect(creativeWork).toBeDefined();
      expect(creativeWork?.name).toBe("GrowIt!");
      expect(creativeWork?.url).toBe(
        "https://work.randyellis.design/projects/growit",
      );

      // Expect exactly one BreadcrumbList
      const breadcrumb = schemas.find((s) => s["@type"] === "BreadcrumbList");
      expect(breadcrumb).toBeDefined();
      expect(breadcrumb?.itemListElement).toHaveLength(3);
      expect(breadcrumb?.itemListElement[2].name).toBe("GrowIt!");

      // Expect NO Organization, LocalBusiness, ProfessionalService, or FAQPage
      const forbiddenTypes = [
        "Organization",
        "LocalBusiness",
        "ProfessionalService",
        "FAQPage",
      ];
      forbiddenTypes.forEach((type) => {
        expect(schemas.find((s) => s["@type"] === type)).toBeUndefined();
      });
    });

    it("addvanced route renders CreativeWork + BreadcrumbList JSON-LD", async () => {
      const AddvancedPage = (await import("@/app/projects/addvanced/page"))
        .default;
      const html = renderToStaticMarkup(AddvancedPage());

      // Extract all <script type="application/ld+json"> blocks
      const scriptRegex =
        /<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs;
      const matches = Array.from(html.matchAll(scriptRegex));
      const schemas = matches.map((m) => JSON.parse(m[1]));

      // Expect exactly one CreativeWork
      const creativeWork = schemas.find((s) => s["@type"] === "CreativeWork");
      expect(creativeWork).toBeDefined();
      expect(creativeWork?.name).toBe("Addvance");

      // Expect exactly one BreadcrumbList
      const breadcrumb = schemas.find((s) => s["@type"] === "BreadcrumbList");
      expect(breadcrumb).toBeDefined();

      // Expect NO forbidden types
      const forbiddenTypes = [
        "Organization",
        "LocalBusiness",
        "ProfessionalService",
        "FAQPage",
      ];
      forbiddenTypes.forEach((type) => {
        expect(schemas.find((s) => s["@type"] === type)).toBeUndefined();
      });
    });
  });
});
