import type { Metadata } from "next";
import HireAiRandyClient from "./hire-ai-randy-client";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbSchema, PERSON_ID } from "@/lib/seo/json-ld";
import { DIAGNOSTIC_PATH, WEBSITE_URL } from "@/lib/constants";

const TITLE = "Hire AI Randy — AI Product Ship Readiness Diagnostic";

const DESCRIPTION =
  "Twelve questions that score how ready your AI product is to ship, across AI surface UX, design system governance, roadmap feasibility, and boardroom metrics. Free, ten minutes, with the verdict a fractional Chief Design Officer would give you on a call.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: DIAGNOSTIC_PATH,
  },
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
