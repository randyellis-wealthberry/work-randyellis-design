import type { Metadata } from "next";
import { canonicalAlternates } from "@/lib/metadata";
import SkillsClient from "./skills-client";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
} from "@/lib/seo/json-ld";
import { SKILLS, SKILLS_REPO_URL } from "@/lib/data/skills";
import { WEBSITE_URL } from "@/lib/constants";

const DESCRIPTION =
  "Open-source agent skills that hold design work to a defensible standard: every decision names its alternative and its cost, every claim stays within what you did.";

export const metadata: Metadata = {
  title: "AI Skills",
  description: DESCRIPTION,
  alternates: canonicalAlternates("/skills"),
  keywords: [
    "Agent Skills",
    "Claude Skills",
    "Product Design Decisions",
    "Design Rationale",
    "Design Case Study",
    "Randy Ellis",
    "Design Systems",
    "AI Product Design",
  ],
  openGraph: {
    title: "AI Skills",
    description: DESCRIPTION,
    url: "/skills",
  },
};

export default function SkillsPage() {
  const breadcrumbItems = [
    { name: "Home", url: WEBSITE_URL },
    { name: "AI Skills", url: `${WEBSITE_URL}/skills` },
  ];

  return (
    <>
      <JsonLd
        id="breadcrumb-jsonld"
        data={buildBreadcrumbSchema(breadcrumbItems)}
      />
      <JsonLd
        id="collection-jsonld"
        data={buildCollectionPageSchema({
          name: "AI Skills",
          description: DESCRIPTION,
          url: `${WEBSITE_URL}/skills`,
          items: SKILLS.map((skill) => ({
            name: skill.name,
            url: `${SKILLS_REPO_URL}${skill.path}`,
          })),
        })}
      />
      <SkillsClient />
    </>
  );
}
