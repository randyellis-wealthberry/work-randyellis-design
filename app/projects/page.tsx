import type { Metadata } from "next";
import { Suspense } from "react";
import ProjectsClient from "./projects-client";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbSchema } from "@/lib/seo/json-ld";
import { WEBSITE_URL } from "@/lib/constants";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "AI Product Design Projects",
  description:
    "Proven AI design results: GrowIt peaked at 240K+ active users and a 4.8★ rating, AI Design System Generator saves 40+ hours/week. See real projects that deliver business impact.",
  path: "/projects",
  keywords: [
    "AI Product Design Projects",
    "Randy Ellis Portfolio",
    "GrowIt App Design",
    "AI Design System Generator",
    "Product Design Case Studies",
    "Design Engineering Projects",
    "Mobile App Design",
    "AI Design Tools",
  ],
});

export default function ProjectsPage() {
  const breadcrumbItems = [
    { name: "Home", url: WEBSITE_URL },
    { name: "Projects", url: `${WEBSITE_URL}/projects` },
  ];

  return (
    <>
      <JsonLd
        id="breadcrumb-jsonld"
        data={buildBreadcrumbSchema(breadcrumbItems)}
      />
      {/* Suspense is required by Next 15 for useSearchParams on a statically prerendered route — without it `next build` fails; build is not in the verify gate, so do not remove */}
      <Suspense fallback={null}>
        <ProjectsClient />
      </Suspense>
    </>
  );
}
