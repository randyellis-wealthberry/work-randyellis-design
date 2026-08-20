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
import RambisClientPage from "./rambis-client";

const project = PROJECTS.find((p) => p.slug === "rambis-ui")!;

export const metadata: Metadata = projectMetadata(project);

export default function RambisUICaseStudy() {
  return (
    <>
      <CreativeWorkStructuredData {...projectCreativeWorkProps(project)} />
      <BreadcrumbStructuredData items={projectBreadcrumbItems(project)} />
      <div className="container mx-auto max-w-6xl px-4 py-16">
        <RambisClientPage />
      </div>
    </>
  );
}
