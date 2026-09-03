/**
 * The published agent skills, in the order the /skills page lists them.
 *
 * Lived inside the skills client component until the page needed the same
 * list for its ItemList schema; a server component cannot read a value out of
 * a "use client" module, so the data moved here and both surfaces read it.
 */
export const SKILLS_REPO_URL =
  "https://github.com/randyellis-wealthberry/skills";

export type Skill = {
  name: string;
  role: string;
  summary: string;
  path: string;
};

export const SKILLS: readonly Skill[] = [
  {
    name: "randy-design-eng",
    role: "The main skill",
    summary:
      "Decision defensibility, evidence standards, claim discipline, AI product surfaces, design-system API design, and leading design without authority. Worked examples from real projects live alongside it in DECISIONS.md.",
    path: "/blob/main/skills/randy-design-eng/SKILL.md",
  },
  {
    name: "ui-craft",
    role: "The interface lens",
    summary:
      "How much a surface should assert: progressive disclosure over modes, ranked candidates over single confident answers, graceful scope degradation over empty states, composition over configuration, and designing the seam between two roles.",
    path: "/blob/main/skills/ui-craft/SKILL.md",
  },
  {
    name: "defend-decision",
    role: "Construction skill",
    summary:
      "Take a design decision and harden it until it survives interrogation: the alternative at its strongest, the price you actually paid, and the outcome you would rather delete.",
    path: "/blob/main/skills/defend-decision/SKILL.md",
  },
  {
    name: "write-case-study",
    role: "Construction skill",
    summary:
      "Write or audit a case study with strict claim discipline. Separates what you decided from what was handed to you, and what you validated from what shipped after you left.",
    path: "/blob/main/skills/write-case-study/SKILL.md",
  },
];
