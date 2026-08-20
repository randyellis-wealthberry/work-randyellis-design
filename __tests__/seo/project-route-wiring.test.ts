/**
 * Route-wiring drift test (D-14)
 *
 * Guards that all 5 case-study routes continue to derive metadata + JSON-LD
 * from lib/metadata.ts helpers (not hand-typed metadata), and that Waffle
 * remains untouched (uses createPageMetadata, not projectMetadata).
 */

import * as fs from "fs";
import * as path from "path";

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

    it("uses projectCreativeWorkProps helper", () => {
      expect(source).toContain("projectCreativeWorkProps(");
    });

    it("uses projectBreadcrumbItems helper", () => {
      expect(source).toContain("projectBreadcrumbItems(");
    });

    it("renders CreativeWorkStructuredData component", () => {
      expect(source).toContain("<CreativeWorkStructuredData");
    });

    it("renders BreadcrumbStructuredData component", () => {
      expect(source).toContain("<BreadcrumbStructuredData");
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

    it("does NOT render CreativeWorkStructuredData", () => {
      expect(waffleSource).not.toContain("CreativeWorkStructuredData");
    });

    it("does NOT render BreadcrumbStructuredData", () => {
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
});
