import { Metadata } from "next";
import { PROJECTS } from "@/lib/data/projects";
import {
  projectMetadata,
  projectCreativeWorkProps,
  projectBreadcrumbItems,
} from "@/lib/metadata";
import {
  CreativeWorkStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data";
import EchoClientPage from "./echo-client";

const project = PROJECTS.find((p) => p.slug === "echo")!;

export const metadata: Metadata = projectMetadata(project);

export default function EchoDriveCaseStudy() {
  return (
    <>
      <CreativeWorkStructuredData {...projectCreativeWorkProps(project)} />
      <BreadcrumbStructuredData items={projectBreadcrumbItems(project)} />
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <EchoClientPage />
      </div>
    </>
  );
}
