import { Metadata } from "next";
import { PROJECTS } from "@/lib/data/projects";
import { projectMetadata, projectBreadcrumbItems } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buildCreativeWorkSchema,
  buildBreadcrumbSchema,
} from "@/lib/seo/json-ld";
import NagarroClientPage from "./nagarro-client";

const project = PROJECTS.find((p) => p.slug === "nagarro")!;

export const metadata: Metadata = projectMetadata(project);

export default function NagarroPage() {
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
      <NagarroClientPage />
    </>
  );
}
