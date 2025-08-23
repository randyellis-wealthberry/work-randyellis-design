import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PROJECTS } from "@/lib/data/projects";
import { CreativeWorkStructuredData } from "@/components/seo/structured-data";
import { ProjectFAQStructuredData } from "@/components/seo/project-faq";
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

  return {
    title: `${project.name} | ${project.subtitle || project.category} | Randy Ellis`,
    description: project.longDescription || project.description,
    keywords: [
      project.name,
      ...project.technologies,
      ...project.tags,
      project.category,
      "Randy Ellis",
      "AI Product Design",
      "Design Engineering",
    ],
    openGraph: {
      title: `${project.name} - ${project.subtitle || project.category}`,
      description: project.longDescription || project.description,
      url: `https://work.randyellis.design/projects/${project.slug}`,
      images: project.thumbnail
        ? [
            {
              url: `https://work.randyellis.design${project.thumbnail}`,
              width: 1200,
              height: 630,
              alt: `${project.name} - ${project.subtitle || project.description}`,
            },
          ]
        : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} - ${project.subtitle || project.category}`,
      description: project.longDescription || project.description,
      images: project.thumbnail
        ? [`https://work.randyellis.design${project.thumbnail}`]
        : [],
    },
  };
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
      <CreativeWorkStructuredData
        name={project.name}
        description={project.longDescription || project.description}
        url={`https://work.randyellis.design/projects/${project.slug}`}
        dateCreated={project.timeline.split(" - ")[0] || "2023"}
        technologies={project.technologies}
        category={project.category}
        metrics={project.metrics}
        imageUrl={
          project.thumbnail
            ? `https://work.randyellis.design${project.thumbnail}`
            : undefined
        }
        teamSize={project.teamSize}
        role={project.role}
      />
      <ProjectFAQStructuredData projectSlug={project.slug} />
      <ProjectDetailClient
        project={project}
        relatedProjects={relatedProjects}
      />
    </>
  );
}
