/**
 * Award-count self-consistency regression test (Phase 11 Plan 04, CRED-12).
 *
 * Randy's design-award count is hand-typed into five independent surfaces with
 * no shared source: lib/seo/json-ld.ts's Person schema, lib/data/retainer.ts's
 * PROOF_EXHIBITS row, app/about/about-client.tsx's achievements cell,
 * app/about/opengraph-image.tsx's OG stat card, and app/about/page.tsx's
 * openGraph.description. A stale "6" survived on the OG image through two
 * milestone audits precisely because nothing bound these surfaces together.
 *
 * D-11: this test does not ban a figure, it asserts AGREEMENT — every surface
 * assertion below compares against the single EXPECTED_AWARD_COUNT constant,
 * and one test (Block 4) binds three independently-derived counts to each
 * other directly.
 *
 * D-12: every assertion is structural — a real import, a field lookup, an
 * object-literal slice, or a whole-line/phrase match — NEVER a bare digit
 * match. A bare `"4"` grep would collide with `grid-cols-4`, `h-4 w-4`, and
 * `sm:text-4xl`, all of which appear inside the very files this test reads.
 *
 * D-13: the `collectSourceFiles` walker below is reused verbatim from
 * __tests__/seo/no-legacy-schema.test.ts. It only ever walks explicit
 * `app`/`components`/`lib` roots, so the planning record is outside its reach
 * by construction, not by an exclusion rule.
 *
 * D-07: the Webby Awards judge credential must never be counted among the
 * four design awards, on any surface. Asserted structurally in Block 1 (the
 * JSON-LD award array) and Block 2 (the about-client.tsx awards literal).
 */

import fs from "fs";
import path from "path";
import { buildPersonSchema } from "@/lib/seo/json-ld";
import { PROOF_EXHIBITS } from "@/lib/data/retainer";

/**
 * The single source of truth this whole suite compares every surface
 * against. If Randy wins a fifth award, exactly this constant changes, and
 * the suite then names every surface that has not been updated to match.
 */
const EXPECTED_AWARD_COUNT = 4;

const ABOUT_CLIENT_PATH = path.join(
  process.cwd(),
  "app/about/about-client.tsx",
);
const OPENGRAPH_IMAGE_PATH = path.join(
  process.cwd(),
  "app/about/opengraph-image.tsx",
);
const ABOUT_PAGE_PATH = path.join(process.cwd(), "app/about/page.tsx");

/**
 * Isolates the "Design awards" achievement object's `awards` array literal
 * from about-client.tsx's source text. Anchors on the `label: "Design
 * awards"` field and slices outward to the nearest object/array delimiters,
 * so the extraction survives Prettier re-indentation and does not depend on
 * array position within the file.
 */
function extractAboutClientAwardsSlice(content: string) {
  const labelIndex = content.indexOf('label: "Design awards"');
  const objectStart = content.lastIndexOf("{", labelIndex);
  const objectSlice = content.slice(objectStart, labelIndex);
  const awardsKeyIndex = content.indexOf("awards: [", labelIndex);
  const awardsArrayEnd = content.indexOf("]", awardsKeyIndex);
  const awardsSlice = content.slice(awardsKeyIndex, awardsArrayEnd);
  return {
    labelIndex,
    objectSlice,
    awardsKeyIndex,
    awardsArrayEnd,
    awardsSlice,
  };
}

describe("Award-count consistency across every stating surface (CRED-12)", () => {
  describe("Block 1: importable surfaces, asserted via real imports (D-12)", () => {
    describe("lib/seo/json-ld.ts buildPersonSchema().award", () => {
      const award = buildPersonSchema().award as string[];

      it(`is an array of exactly EXPECTED_AWARD_COUNT (${EXPECTED_AWARD_COUNT}) entries`, () => {
        expect(Array.isArray(award)).toBe(true);
        expect(award).toHaveLength(EXPECTED_AWARD_COUNT);
      });

      it("every entry is a non-empty string", () => {
        award.forEach((entry) => {
          expect(typeof entry).toBe("string");
          expect(entry.length).toBeGreaterThan(0);
        });
      });

      it("exactly two entries are Davey Awards and two are Vega Digital Awards", () => {
        const davey = award.filter((entry) => /Davey Awards/.test(entry));
        const vega = award.filter((entry) => /Vega Digital Awards/.test(entry));
        expect(davey).toHaveLength(2);
        expect(vega).toHaveLength(2);
      });

      it("no entry mentions the Webby Awards judge credential (D-07)", () => {
        const webbyEntries = award.filter((entry) => /webby/i.test(entry));
        expect(webbyEntries).toHaveLength(0);
      });
    });

    describe("lib/data/retainer.ts PROOF_EXHIBITS", () => {
      it('contains exactly one row whose context is "Design awards won"', () => {
        const rows = PROOF_EXHIBITS.filter(
          (exhibit) => exhibit.context === "Design awards won",
        );
        expect(rows).toHaveLength(1);
      });

      it("that row's value equals String(EXPECTED_AWARD_COUNT)", () => {
        const row = PROOF_EXHIBITS.find(
          (exhibit) => exhibit.context === "Design awards won",
        );
        expect(row?.value).toBe(String(EXPECTED_AWARD_COUNT));
      });
    });
  });

  describe("Block 2: source-text surfaces, asserted via shape-anchored extraction (D-12)", () => {
    describe("app/about/about-client.tsx achievements cell", () => {
      const content = fs.readFileSync(ABOUT_CLIENT_PATH, "utf-8");
      const {
        labelIndex,
        objectSlice,
        awardsKeyIndex,
        awardsArrayEnd,
        awardsSlice,
      } = extractAboutClientAwardsSlice(content);

      it('contains the "Design awards" achievement object', () => {
        expect(labelIndex).toBeGreaterThan(-1);
      });

      it("the achievement object's value field equals String(EXPECTED_AWARD_COUNT)", () => {
        expect(objectSlice).toMatch(
          new RegExp(`value:\\s*"${EXPECTED_AWARD_COUNT}"`),
        );
      });

      it("the awards array literal is found on the object", () => {
        expect(awardsKeyIndex).toBeGreaterThan(-1);
        expect(awardsArrayEnd).toBeGreaterThan(awardsKeyIndex);
      });

      it("the awards array contains exactly EXPECTED_AWARD_COUNT string literals", () => {
        const matches = awardsSlice.match(/"[^"]*"/g) ?? [];
        expect(matches).toHaveLength(EXPECTED_AWARD_COUNT);
      });

      it("the awards array slice does not mention the Webby Awards judge credential (D-07)", () => {
        expect(awardsSlice).not.toMatch(/webby/i);
      });

      it("the Webby Awards mention exists but falls structurally outside the awards array (D-07)", () => {
        const webbyIndex = content.search(/webby/i);
        expect(webbyIndex).toBeGreaterThan(-1);
        expect(webbyIndex).toBeGreaterThan(awardsArrayEnd);
      });
    });

    describe("app/about/opengraph-image.tsx OG stat card", () => {
      const content = fs.readFileSync(OPENGRAPH_IMAGE_PATH, "utf-8");
      const lines = content.split("\n");
      const bareNumberLines = lines
        .map((line, index) => ({ line, index }))
        .filter(({ line }) => /^\s*\d+\s*$/.test(line));

      it("exactly one line in the file is a bare digit-only line", () => {
        expect(bareNumberLines).toHaveLength(1);
      });

      it("that line's trimmed value equals String(EXPECTED_AWARD_COUNT)", () => {
        expect(bareNumberLines[0]?.line.trim()).toBe(
          String(EXPECTED_AWARD_COUNT),
        );
      });

      it('the "Design Awards" label appears within the following 12 lines, proving this is the awards figure', () => {
        const { index } = bareNumberLines[0] ?? { index: -1 };
        const nextLines = lines.slice(index, index + 12);
        expect(nextLines.some((line) => line.includes("Design Awards"))).toBe(
          true,
        );
      });
    });

    describe("app/about/page.tsx openGraph.description", () => {
      const content = fs.readFileSync(ABOUT_PAGE_PATH, "utf-8");
      const matches = [...content.matchAll(/(\d+)\s+awards?\s+won/gi)];

      it('contains at least one "N awards won" phrase', () => {
        expect(matches.length).toBeGreaterThan(0);
      });

      it("every captured count equals String(EXPECTED_AWARD_COUNT)", () => {
        matches.forEach((match) => {
          expect(match[1]).toBe(String(EXPECTED_AWARD_COUNT));
        });
      });
    });
  });

  describe("Block 3: surface-set sweep, using the collectSourceFiles walker (D-13)", () => {
    /**
     * Every file under app/, components/, lib/ that mentions "award"
     * case-insensitively, as of this plan's authoring. Two entries state no
     * count and are allow-listed with a reason; the other five state
     * EXPECTED_AWARD_COUNT and are asserted individually in Blocks 1-2.
     *
     * If this assertion fails, a new file now mentions "award" that isn't
     * accounted for here. Either it states a count — add a structural
     * assertion for it above and confirm it equals EXPECTED_AWARD_COUNT — or
     * it states no count — add it to this list with a comment explaining
     * why. The surface set must never grow silently.
     */
    const ALLOWED_AWARD_FILES = [
      "app/llms.txt/route.ts", // Phase 13: "certifications, awards, and design philosophy" — a link description for /about, states no count
      "app/about/about-client.tsx", // states the count — asserted in Block 2
      "app/about/opengraph-image.tsx", // states the count — asserted in Block 2
      "app/about/page.tsx", // states the count — asserted in Block 2
      "components/core/animated-number-basic.tsx", // dead code, zero imports anywhere in the repo, renders nothing, cannot disagree with anything
      "components/ui/reading-progress.tsx", // "Award" here is a lucide-react icon import for a reading-progress milestone label, not a design-award count
      "lib/data/retainer.ts", // states the count — asserted in Block 1
      "lib/seo/json-ld.ts", // states the count — asserted in Block 1
    ].sort();

    it("the set of files mentioning /award/i matches the allow-list exactly", () => {
      const sourceFiles = collectSourceFiles([
        path.join(process.cwd(), "app"),
        path.join(process.cwd(), "components"),
        path.join(process.cwd(), "lib"),
      ]);

      const cwd = process.cwd();
      const matchingFiles = sourceFiles
        .filter((file) => /award/i.test(fs.readFileSync(file, "utf-8")))
        .map((file) => path.relative(cwd, file).split(path.sep).join("/"))
        .sort();

      try {
        expect(matchingFiles).toEqual(ALLOWED_AWARD_FILES);
      } catch (error) {
        throw new Error(
          `${(error as Error).message}\n\n` +
            'ACTION REQUIRED: a file now mentions "award" that is not in ' +
            "ALLOWED_AWARD_FILES. If it states an award count, add a " +
            "structural assertion for it in this test's surface blocks and " +
            "pin it to EXPECTED_AWARD_COUNT. If it states no count, add it " +
            "to ALLOWED_AWARD_FILES with a comment explaining why it states " +
            "no count. The surface set must never grow silently.",
        );
      }
    });
  });

  describe("Block 4: cross-surface agreement — the core consistency assertion (D-11)", () => {
    it("buildPersonSchema().award length, PROOF_EXHIBITS's Design awards value, and about-client.tsx's awards array length are all equal to each other", () => {
      const jsonLdCount = (buildPersonSchema().award as string[]).length;

      const retainerRow = PROOF_EXHIBITS.find(
        (exhibit) => exhibit.context === "Design awards won",
      );
      const retainerCount = Number(retainerRow?.value);

      const aboutClientContent = fs.readFileSync(ABOUT_CLIENT_PATH, "utf-8");
      const { awardsSlice } = extractAboutClientAwardsSlice(aboutClientContent);
      const aboutClientCount = (awardsSlice.match(/"[^"]*"/g) ?? []).length;

      expect(jsonLdCount).toBe(retainerCount);
      expect(retainerCount).toBe(aboutClientCount);
      expect(aboutClientCount).toBe(jsonLdCount);
    });
  });
});

/**
 * Recursively collect all .ts/.tsx/.mdx source files from given directories,
 * excluding node_modules, .next, and other build artifacts.
 *
 * Reused verbatim from __tests__/seo/no-legacy-schema.test.ts (D-13). Every
 * root is a literal path.join(process.cwd(), "app" | "components" | "lib")
 * with no externally-supplied input, so this walk can never be pointed
 * outside the repository (T-11-31).
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
