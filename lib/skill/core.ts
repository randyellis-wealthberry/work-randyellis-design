import fs from "node:fs";
import path from "node:path";

/**
 * The free core skill, as one file.
 *
 * `content/skill/SKILL.md` is the single source. The `/skill.md` route serves
 * it verbatim, the `/skill` page renders excerpts from it, and the public
 * skills repo mirrors it, so the three cannot drift the way a hand-pasted
 * copy would. Read once per process: the file is static and small.
 *
 * Server only. `fs` is not available in a client bundle; the page passes
 * whatever strings it needs down as props.
 */
export const SKILL_CORE_PATH = path.join(
  process.cwd(),
  "content",
  "skill",
  "SKILL.md",
);

export const SKILL_CORE_MD: string = fs.readFileSync(SKILL_CORE_PATH, "utf8");

export type SkillFrontmatter = {
  name: string;
  license: string;
  version: string;
  updated: string;
};

/**
 * Reads the handful of frontmatter keys the site displays. A full YAML parser
 * is more than four scalar lines deserve, and the shape is ours to control.
 */
export function parseSkillFrontmatter(md: string): SkillFrontmatter {
  const match = md.match(/^---\n([\s\S]*?)\n---/);
  const block = match ? match[1] : "";
  const read = (key: string): string => {
    const line = block.match(
      new RegExp(`^\\s*${key}:\\s*"?([^"\\n]*)"?\\s*$`, "m"),
    );
    return line ? line[1].trim() : "";
  };
  return {
    name: read("name"),
    license: read("license"),
    version: read("version"),
    updated: read("updated"),
  };
}

export const SKILL_CORE = parseSkillFrontmatter(SKILL_CORE_MD);

export const SKILL_CORE_LINE_COUNT = SKILL_CORE_MD.split("\n").length;

/**
 * The body without frontmatter, so an excerpt on the page starts at the
 * title rather than at a YAML fence.
 */
export function skillBody(md: string = SKILL_CORE_MD): string {
  return md.replace(/^---\n[\s\S]*?\n---\n*/, "");
}

/**
 * The opening of the file, cut at a heading boundary so the excerpt never
 * ends mid-sentence. Used by the page to show what the file reads like
 * before linking to the whole thing.
 */
export function skillExcerpt(
  maxLines = 40,
  md: string = SKILL_CORE_MD,
): string {
  const lines = skillBody(md).split("\n");
  if (lines.length <= maxLines) return lines.join("\n");
  let cut = maxLines;
  for (let i = maxLines; i > Math.floor(maxLines / 2); i--) {
    if (lines[i].startsWith("## ")) {
      cut = i;
      break;
    }
  }
  return lines.slice(0, cut).join("\n").trimEnd();
}
