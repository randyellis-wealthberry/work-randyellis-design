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
import NagarroClientPage from "./nagarro-client";

const project = PROJECTS.find((p) => p.slug === "nagarro")!;

export const metadata: Metadata = projectMetadata(project);

export default function NagarroPage() {
  return (
    <>
      <CreativeWorkStructuredData {...projectCreativeWorkProps(project)} />
      <BreadcrumbStructuredData items={projectBreadcrumbItems(project)} />
      <NagarroClientPage />
    </>
  );
}
