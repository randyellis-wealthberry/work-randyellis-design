import type { Metadata } from "next";
import ServicesClient from "./services-client";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbSchema, PERSON_ID } from "@/lib/seo/json-ld";
import { WEBSITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services — Fractional CDO Retainer",
  description:
    "A fractional Chief Design Officer retainer: fixed hours every month on design strategy, systems, and AI product surfaces. 500M+ users reached, $500M+ product value delivered.",
  alternates: {
    canonical: "/services",
  },
  keywords: [
    "Fractional Chief Design Officer",
    "Fractional CDO Retainer",
    "Design Leadership Retainer",
    "Interim Chief Design Officer",
    "AI Product Design Consulting",
    "Startup Design Leadership",
    "Design Systems Consulting",
  ],
  openGraph: {
    title: "Fractional CDO Retainer — Randy Ellis",
    description:
      "Design leadership on a fixed monthly retainer. Fixed hours, weekly working sessions, no equity, start this month.",
    url: "/services",
  },
};

/**
 * Direction contract for this surface. Emitted as a real HTML comment so it
 * survives the production build and can be grepped by seed key.
 */
const DIRECTION_CONTRACT = `
IMPECCABLE DIRECTION CONTRACT — /services
THESIS: A fractional-CDO retainer read as a balance sheet, not a services
grid. Refuses the three-tier pricing-card arrangement this category ships.
OWN-WORLD: Inherited, not invented — zinc neutrals on white/zinc-950, Geist,
hairline rules, tabular figures. No new palette. The gutter between two
columns is the page's only structural device.
STORY: A founder sees what missing design leadership costs, sees the fixed
monthly hours that replace it, and books a 30-minute call.
FIRST VIEWPORT: Split at the fold. Left column the gap, right column the
retainer, separated by a static hairline. A scroll rail down the block's left
margin inks itself on one shared timeline — separate from the divider, because
a rule carrying a timeline cannot sit where text crosses it. Primary action
under the split.
FORM: The Split Ledger, index 5 of 7 ordered candidates; seed key 3f2d039b.
FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance
`;

export default function ServicesPage() {
  const breadcrumbItems = [
    { name: "Home", url: WEBSITE_URL },
    { name: "Services", url: `${WEBSITE_URL}/services` },
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${WEBSITE_URL}/services#service`,
    name: "Fractional Chief Design Officer Retainer",
    serviceType: "Fractional Chief Design Officer",
    description:
      "A monthly design leadership retainer covering design strategy, design systems, AI product surfaces, and team guidance, on a fixed number of hours per month.",
    provider: { "@id": PERSON_ID },
    areaServed: "Worldwide",
    audience: {
      "@type": "Audience",
      audienceType: "Startup founders and CTOs",
    },
    url: `${WEBSITE_URL}/services`,
  };

  return (
    <>
      <div
        dangerouslySetInnerHTML={{ __html: `<!--${DIRECTION_CONTRACT}-->` }}
      />
      <JsonLd
        id="breadcrumb-jsonld"
        data={buildBreadcrumbSchema(breadcrumbItems)}
      />
      <JsonLd id="service-jsonld" data={serviceSchema} />
      <ServicesClient />
    </>
  );
}
