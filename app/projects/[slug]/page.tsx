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

  // Some projects use a video as their thumbnail (LedgerIQ is an .mp4), which
  // cannot be an og:image. Fall back to the first real image rather than
  // emitting no preview at all — a shared link with no card is worse than one
  // using a secondary shot.
  const isImage = (path: string) =>
    /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(path);

  const imageThumbnail =
    project.thumbnail && isImage(project.thumbnail)
      ? project.thumbnail
      : project.images?.find(isImage);

  return {
    title: `${project.name} | ${project.subtitle || project.category}`,
    description: project.longDescription || project.description,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
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
      url: `/projects/${project.slug}`,
      images: imageThumbnail
        ? [
            {
              url: imageThumbnail,
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
      images: imageThumbnail ? [imageThumbnail] : [],
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
