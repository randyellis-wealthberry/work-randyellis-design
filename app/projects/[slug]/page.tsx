import { notFound } from "next/navigation";
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
import ProjectDetailClient from "./project-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }

  return projectMetadata(project);
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = PROJECTS.filter(
    (p) => p.id !== project.id && p.category === project.category,
  ).slice(0, 2);

  return (
    <>
      <CreativeWorkStructuredData {...projectCreativeWorkProps(project)} />
      <BreadcrumbStructuredData items={projectBreadcrumbItems(project)} />
      <ProjectDetailClient
        project={project}
        relatedProjects={relatedProjects}
      />
    </>
  );
}
