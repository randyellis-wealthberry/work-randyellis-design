import type { Metadata } from "next";
import SkillClient from "./skill-client";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbSchema, buildSkillFileSchema } from "@/lib/seo/json-ld";
import { WEBSITE_URL } from "@/lib/constants";
import {
  SKILL_CORE,
  SKILL_CORE_LINE_COUNT,
  skillExcerpt,
} from "@/lib/skill/core";
import { SKILL_MODULES } from "@/lib/data/skill-catalog";

const DESCRIPTION =
  "Randy Ellis's product design judgment as one installable agent skill, free. Six à la carte modules that go deeper: researcher, product strategy, visual strategy, the five advisors, all bets are off, and diagram. The diagnostic ends with a SKILL.md written for your product.";

export const metadata: Metadata = {
  title: "Skill.md",
  description: DESCRIPTION,
  alternates: {
    canonical: "/skill",
  },
  keywords: [
    "Skill.md",
    "Agent Skills",
    "Claude Skills",
    "Design Judgment",
    "Product Design Decisions",
    "Fractional Chief Design Officer",
    "Randy Ellis",
    "AI Product Design",
    "Design Strategy",
  ],
  openGraph: {
    title: "Skill.md",
    description: DESCRIPTION,
    url: "/skill",
  },
};

export default function SkillPage() {
  const breadcrumbItems = [
    { name: "Home", url: WEBSITE_URL },
    { name: "Skill.md", url: `${WEBSITE_URL}/skill` },
  ];

  const core = {
    name: SKILL_CORE.name,
    version: SKILL_CORE.version,
    updated: SKILL_CORE.updated,
    license: SKILL_CORE.license,
    lineCount: SKILL_CORE_LINE_COUNT,
    excerpt: skillExcerpt(40),
  };

  return (
    <>
      <JsonLd
        id="breadcrumb-jsonld"
        data={buildBreadcrumbSchema(breadcrumbItems)}
      />
      <JsonLd
        id="skill-file-jsonld"
        data={buildSkillFileSchema({
          name: SKILL_CORE.name,
          version: SKILL_CORE.version,
          updated: SKILL_CORE.updated,
          modules: SKILL_MODULES.map((m) => m.name),
        })}
      />
      <SkillClient core={core} />
    </>
  );
}
