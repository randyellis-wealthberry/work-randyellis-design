import type { Metadata } from "next";
import MetisClient from "./metis-client";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbSchema } from "@/lib/seo/json-ld";
import { WEBSITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "METIS — AI Business Strategy Agent",
  description:
    "A humble announcement about METIS and what I share with the design community. Bridging the gap between design excellence and boardroom fluency.",
  alternates: {
    canonical: "/metis",
  },
  keywords: [
    "METIS",
    "Randy Ellis",
    "Design Community",
    "Product Design",
    "Business Strategy",
    "Design Leadership",
    "AI Product Design",
  ],
  openGraph: {
    title: "METIS — AI Business Strategy Agent",
    description:
      "A humble announcement about METIS and what I share with the design community.",
    url: "/metis",
  },
};

export default function MetisPage() {
  const breadcrumbItems = [
    { name: "Home", url: WEBSITE_URL },
    { name: "METIS", url: `${WEBSITE_URL}/metis` },
  ];

  return (
    <>
      <JsonLd
        id="breadcrumb-jsonld"
        data={buildBreadcrumbSchema(breadcrumbItems)}
      />
      <MetisClient />
    </>
  );
}
