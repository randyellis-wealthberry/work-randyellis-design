import { notFound } from "next/navigation";
import { PROJECTS } from "../../data";
import ProjectDetailClient from "./project-detail-client";

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
    <ProjectDetailClient project={project} relatedProjects={relatedProjects} />
  );
}
