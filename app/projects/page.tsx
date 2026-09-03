import type { Metadata } from "next";
import { Suspense } from "react";
import ProjectsClient from "./projects-client";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
} from "@/lib/seo/json-ld";
import { PROJECTS } from "@/lib/data/projects";
import { WEBSITE_URL } from "@/lib/constants";
import { createPageMetadata } from "@/lib/metadata";

const DESCRIPTION =
  "Proven AI design results: GrowIt peaked at 240K+ active users and a 4.8★ rating, AI Design System Generator saves 40+ hours a week. Case studies with business impact.";

export const metadata: Metadata = createPageMetadata({
  title: "AI Product Design Projects",
  description: DESCRIPTION,
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
      {/* The same list the client renders before any filter is applied:
          every non-archived case study, in data order. */}
      <JsonLd
        id="collection-jsonld"
        data={buildCollectionPageSchema({
          name: "AI Product Design Projects",
          description: DESCRIPTION,
          url: `${WEBSITE_URL}/projects`,
          items: PROJECTS.filter((project) => !project.archived).map(
            (project) => ({
              name: project.name,
              url: `${WEBSITE_URL}/projects/${project.slug}`,
            }),
          ),
        })}
      />
      {/* Suspense is required by Next 15 for useSearchParams on a statically prerendered route — without it `next build` fails; build is not in the verify gate, so do not remove */}
      <Suspense fallback={null}>
        <ProjectsClient />
      </Suspense>
    </>
  );
}
