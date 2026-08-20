import type { Metadata } from "next";
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
import AddvancedClient from "./addvanced-client";

const project = PROJECTS.find((p) => p.slug === "addvanced")!;

export const metadata: Metadata = projectMetadata(project);

export default function AddvancedPage() {
  return (
    <>
      <CreativeWorkStructuredData {...projectCreativeWorkProps(project)} />
      <BreadcrumbStructuredData items={projectBreadcrumbItems(project)} />
      <AddvancedClient />
    </>
  );
}
