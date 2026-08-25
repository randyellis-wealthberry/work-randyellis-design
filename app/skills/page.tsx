import type { Metadata } from "next";
import SkillsClient from "./skills-client";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbSchema } from "@/lib/seo/json-ld";
import { WEBSITE_URL } from "@/lib/constants";

const DESCRIPTION =
  "Open-source agent skills that hold design work to a defensible standard: every decision names its alternative and its cost, every claim is limited to what you actually did, and every outcome reports the part that cut against you.";

export const metadata: Metadata = {
  title: "Skills",
  description: DESCRIPTION,
  alternates: {
    canonical: "/skills",
  },
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
    title: "Skills",
    description: DESCRIPTION,
    url: "/skills",
  },
};

export default function SkillsPage() {
  const breadcrumbItems = [
    { name: "Home", url: WEBSITE_URL },
    { name: "Skills", url: `${WEBSITE_URL}/skills` },
  ];

  return (
    <>
      <JsonLd
        id="breadcrumb-jsonld"
        data={buildBreadcrumbSchema(breadcrumbItems)}
      />
      <SkillsClient />
    </>
  );
}
