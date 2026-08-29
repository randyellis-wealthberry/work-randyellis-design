import { Metadata } from "next";
import { PROJECTS } from "@/lib/data/projects";
import { projectMetadata, projectBreadcrumbItems } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buildCreativeWorkSchema,
  buildBreadcrumbSchema,
} from "@/lib/seo/json-ld";
import WaffleClientPage from "./waffle-client";

const project = PROJECTS.find((p) => p.slug === "waffle")!;

// Phase 13 T-10: same helper + schema pattern as the other project pages
// (this was the one project route without CreativeWork JSON-LD). The bespoke
// 1200×630 card overrides the data-derived OG image.
const WAFFLE_OG_IMAGE = {
  url: "/projects/waffle/opengraph.png",
  width: 1200,
  height: 630,
  alt: "Waffle | AI-Powered Interview Scorecard Generator",
};

const base = projectMetadata(project);

export const metadata: Metadata = {
  ...base,
  openGraph: {
    ...base.openGraph,
    images: [WAFFLE_OG_IMAGE],
  },
  twitter: {
    ...base.twitter,
    images: [WAFFLE_OG_IMAGE.url],
  },
};

export default function WaffleProductPage() {
  return (
    <>
      <JsonLd
        id="creativework-jsonld"
        data={buildCreativeWorkSchema(project)}
      />
      <JsonLd
        id="breadcrumb-jsonld"
        data={buildBreadcrumbSchema(projectBreadcrumbItems(project))}
      />
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <WaffleClientPage />
      </div>
    </>
  );
}
