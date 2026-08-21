import type { Metadata } from "next";
import { PROJECTS } from "@/lib/data/projects";
import { projectMetadata, projectBreadcrumbItems } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buildCreativeWorkSchema,
  buildBreadcrumbSchema,
} from "@/lib/seo/json-ld";
import AddvancedClient from "./addvanced-client";

const project = PROJECTS.find((p) => p.slug === "addvanced")!;

export const metadata: Metadata = projectMetadata(project);

export default function AddvancedPage() {
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
      <AddvancedClient />
    </>
  );
}
