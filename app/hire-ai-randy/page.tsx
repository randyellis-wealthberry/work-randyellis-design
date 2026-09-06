import type { Metadata } from "next";
import { canonicalAlternates } from "@/lib/metadata";
import HireAiRandyClient from "./hire-ai-randy-client";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbSchema, PERSON_ID } from "@/lib/seo/json-ld";
import { DIAGNOSTIC_PATH, WEBSITE_URL } from "@/lib/constants";

const TITLE = "Hire AI Randy — Ship Readiness Diagnostic";

const DESCRIPTION =
  "A free ten-minute diagnostic that scores how ready your AI product is to ship across UX, design systems, roadmap feasibility, and boardroom metrics.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: canonicalAlternates(DIAGNOSTIC_PATH),
  keywords: [
    "AI Product Ship Readiness Diagnostic",
    "AI Product Design Audit",
    "Fractional Chief Design Officer",
    "AI UX Assessment",
    "Design System Governance",
    "Startup Design Leadership",
    "Randy Ellis",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: DIAGNOSTIC_PATH,
  },
};

export default function HireAiRandyPage() {
  const breadcrumbItems = [
    { name: "Home", url: WEBSITE_URL },
    { name: "Hire AI Randy", url: `${WEBSITE_URL}${DIAGNOSTIC_PATH}` },
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${WEBSITE_URL}${DIAGNOSTIC_PATH}#service`,
    name: "AI Product Ship Readiness Diagnostic",
    serviceType: "AI product design assessment",
    description: DESCRIPTION,
    provider: { "@id": PERSON_ID },
    areaServed: "Worldwide",
    audience: {
      "@type": "Audience",
      audienceType: "Startup founders and CTOs",
    },
    isAccessibleForFree: true,
    url: `${WEBSITE_URL}${DIAGNOSTIC_PATH}`,
  };

  return (
    <>
      <JsonLd
        id="breadcrumb-jsonld"
        data={buildBreadcrumbSchema(breadcrumbItems)}
      />
      <JsonLd id="service-jsonld" data={serviceSchema} />
      <HireAiRandyClient />
    </>
  );
}
