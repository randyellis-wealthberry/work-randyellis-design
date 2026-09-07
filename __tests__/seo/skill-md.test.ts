/**
 * /skill.md serves the free core skill as the file it is: frontmatter first,
 * markdown content type, MIT, and the canonical URL inside it. The page and
 * the public repo both derive from this same file.
 */
import { GET } from "@/app/skill.md/route";
import {
  SKILL_CORE,
  SKILL_CORE_MD,
  parseSkillFrontmatter,
  skillExcerpt,
} from "@/lib/skill/core";
import { SKILL_MODULE_IDS } from "@/lib/data/skill-catalog";
import { WEBSITE_URL } from "@/lib/constants";

describe("skill.md route", () => {
  let body: string;
  let response: Response;

  beforeAll(async () => {
    response = GET();
    body = await response.text();
  });

  it("serves the file as markdown with an inline filename", () => {
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("text/markdown");
    expect(response.headers.get("Content-Disposition")).toContain("SKILL.md");
    expect(body).toBe(SKILL_CORE_MD);
  });

  it("opens with skill frontmatter naming the skill and its license", () => {
    expect(body.startsWith("---\nname: randy-ellis\n")).toBe(true);
    expect(SKILL_CORE.name).toBe("randy-ellis");
    expect(SKILL_CORE.license).toBe("MIT");
    expect(SKILL_CORE.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(SKILL_CORE.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("points back at its canonical copy and the modules page", () => {
    expect(body).toContain(`${WEBSITE_URL}/skill.md`);
    expect(body).toContain(`${WEBSITE_URL}/skill`);
  });

  it("names every paid module so the free file routes to them", () => {
    for (const id of SKILL_MODULE_IDS) {
      expect(body).toContain(`\`${id}\``);
    }
  });

  it("keeps the review format and the six rules", () => {
    expect(body).toContain("| Before | After | Why |");
    for (const n of [1, 2, 3, 4, 5, 6]) {
      expect(body).toMatch(new RegExp(`^### ${n}\\. `, "m"));
    }
  });

  it("stays under the 40,000 byte budget a skill file should hold to", () => {
    expect(Buffer.byteLength(body, "utf8")).toBeLessThan(40_000);
  });
});

describe("frontmatter parsing", () => {
  it("reads quoted and unquoted scalars and ignores the body", () => {
    const md = `---\nname: x\nlicense: MIT\nmetadata:\n  version: "2.0.0"\n  updated: "2026-01-01"\n---\n# Title\nversion: nope\n`;
    expect(parseSkillFrontmatter(md)).toEqual({
      name: "x",
      license: "MIT",
      version: "2.0.0",
      updated: "2026-01-01",
    });
  });

  it("returns empty strings when there is no frontmatter", () => {
    expect(parseSkillFrontmatter("# nothing")).toEqual({
      name: "",
      license: "",
      version: "",
      updated: "",
    });
  });
});

describe("excerpt", () => {
  it("drops the frontmatter and cuts at a heading boundary", () => {
    const excerpt = skillExcerpt(40);
    expect(excerpt.startsWith("# ")).toBe(true);
    expect(excerpt).not.toContain("---\nname:");
    const lines = excerpt.split("\n");
    expect(lines.length).toBeLessThanOrEqual(40);
    // The next content line after the cut, in the source, is a section
    // heading. (The source keeps a blank line before every heading, which
    // trimEnd strips from the excerpt, so blank lines are skipped here.)
    const bodyLines = SKILL_CORE_MD.replace(/^---\n[\s\S]*?\n---\n*/, "").split(
      "\n",
    );
    const next = bodyLines
      .slice(lines.length)
      .find((line) => line.trim() !== "");
    expect(next.startsWith("## ")).toBe(true);
  });
});
