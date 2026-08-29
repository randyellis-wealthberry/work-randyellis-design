/**
 * Regression test for Phase 10 Plan 08 — pins the deletion of legacy client-side schema modules
 * and enforces the D-08/D-09/D-10 entity story (Person, WebSite, CreativeWork, Article only;
 * single server-rendered JSON-LD emitter).
 *
 * Phase 10 D-08: Four schema types only (Person, WebSite, CreativeWork, Article)
 * Phase 10 D-09: No FAQ schemas anywhere
 * Phase 10 D-10: Single JSON-LD emitter (components/seo/json-ld.tsx)
 */

import fs from "fs";
import path from "path";

describe("Legacy schema module deletion (Phase 10-08)", () => {
  describe("Test 1: Legacy files absent", () => {
    it("components/seo/structured-data.tsx does not exist", () => {
      const filePath = path.join(
        process.cwd(),
        "components/seo/structured-data.tsx",
      );
      expect(fs.existsSync(filePath)).toBe(false);
    });

    it("components/seo/project-faq.tsx does not exist (already deleted in 09-02)", () => {
      const filePath = path.join(
        process.cwd(),
        "components/seo/project-faq.tsx",
      );
      expect(fs.existsSync(filePath)).toBe(false);
    });
  });

  describe("Test 2: No forbidden schema @type values in app/components/lib (D-08)", () => {
    // FAQPage removed from this list 2026-08-29 (Phase 13 T-02, D-08
    // amendment): the homepage Q&A is now server-rendered visible content, so
    // FAQPage markup for it is legitimate. lib/seo/json-ld.ts's
    // buildFaqPageSchema takes the visible FAQS array as input precisely so
    // schema and page cannot diverge. Organization/LocalBusiness/
    // ProfessionalService remain forbidden.
    const forbiddenTypes = [
      "LocalBusiness",
      "ProfessionalService",
      "Organization",
    ];

    const sourceFiles = collectSourceFiles([
      path.join(process.cwd(), "app"),
      path.join(process.cwd(), "components"),
      path.join(process.cwd(), "lib"),
    ]);

    forbiddenTypes.forEach((forbiddenType) => {
      it(`no file contains "@type": "${forbiddenType}"`, () => {
        const violations: string[] = [];

        sourceFiles.forEach((file) => {
          const content = fs.readFileSync(file, "utf-8");
          // Match both JSON and TypeScript object literal styles
          const jsonRegex = new RegExp(`"@type":\\s*"${forbiddenType}"`, "g");
          const tsRegex = new RegExp(`@type:\\s*"${forbiddenType}"`, "g");

          if (jsonRegex.test(content) || tsRegex.test(content)) {
            violations.push(file);
          }
        });

        expect(violations).toEqual([]);
      });
    });
  });

  describe("Test 3: Single JSON-LD emitter (D-10)", () => {
    it("components/seo/json-ld.tsx is the ONLY file with application/ld+json", () => {
      const sourceFiles = collectSourceFiles([
        path.join(process.cwd(), "app"),
        path.join(process.cwd(), "components"),
        path.join(process.cwd(), "lib"),
      ]);

      const filesWithLdJson = sourceFiles.filter((file) => {
        const content = fs.readFileSync(file, "utf-8");
        return content.includes("application/ld+json");
      });

      // Should be exactly one file: components/seo/json-ld.tsx
      expect(filesWithLdJson).toHaveLength(1);
      expect(filesWithLdJson[0]).toContain("components/seo/json-ld.tsx");
    });

    it("no file imports next/script together with ld+json", () => {
      const sourceFiles = collectSourceFiles([
        path.join(process.cwd(), "app"),
        path.join(process.cwd(), "components"),
        path.join(process.cwd(), "lib"),
      ]);

      const violations: string[] = [];

      sourceFiles.forEach((file) => {
        const content = fs.readFileSync(file, "utf-8");
        const hasNextScript =
          content.includes('from "next/script"') ||
          content.includes("from 'next/script'");
        const hasLdJson = content.includes("ld+json");

        if (hasNextScript && hasLdJson) {
          violations.push(file);
        }
      });

      expect(violations).toEqual([]);
    });
  });

  describe("Test 4: No imports from legacy modules", () => {
    it("no file imports from @/components/seo/structured-data", () => {
      const sourceFiles = collectSourceFiles([
        path.join(process.cwd(), "app"),
        path.join(process.cwd(), "components"),
        path.join(process.cwd(), "lib"),
      ]);

      const violations: string[] = [];

      sourceFiles.forEach((file) => {
        const content = fs.readFileSync(file, "utf-8");
        if (
          content.includes('from "@/components/seo/structured-data"') ||
          content.includes("from '@/components/seo/structured-data'")
        ) {
          violations.push(file);
        }
      });

      expect(violations).toEqual([]);
    });

    it("no file imports from @/components/seo/project-faq", () => {
      const sourceFiles = collectSourceFiles([
        path.join(process.cwd(), "app"),
        path.join(process.cwd(), "components"),
        path.join(process.cwd(), "lib"),
      ]);

      const violations: string[] = [];

      sourceFiles.forEach((file) => {
        const content = fs.readFileSync(file, "utf-8");
        if (
          content.includes('from "@/components/seo/project-faq"') ||
          content.includes("from '@/components/seo/project-faq'")
        ) {
          violations.push(file);
        }
      });

      expect(violations).toEqual([]);
    });
  });
});

/**
 * Recursively collect all .ts/.tsx/.mdx source files from given directories,
 * excluding node_modules, .next, and other build artifacts.
 */
function collectSourceFiles(dirs: string[]): string[] {
  const files: string[] = [];

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip build artifacts and dependencies
      if (
        entry.name === "node_modules" ||
        entry.name === ".next" ||
        entry.name === "out" ||
        entry.name === ".git" ||
        entry.name === "dist"
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (
        entry.isFile() &&
        /\.(ts|tsx|mdx)$/.test(entry.name) &&
        !entry.name.endsWith(".d.ts")
      ) {
        files.push(fullPath);
      }
    }
  }

  dirs.forEach((dir) => walk(dir));
  return files;
}
