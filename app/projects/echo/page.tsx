import { Metadata } from "next";
import { PROJECTS } from "@/lib/data/projects";
import { projectMetadata, projectBreadcrumbItems } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buildCreativeWorkSchema,
  buildBreadcrumbSchema,
} from "@/lib/seo/json-ld";
import EchoClientPage from "./echo-client";

const project = PROJECTS.find((p) => p.slug === "echo")!;

export const metadata: Metadata = projectMetadata(project);

export default function EchoDriveCaseStudy() {
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
        <EchoClientPage />
      </div>
    </>
  );
}
