import type { Metadata } from "next";
import ProjectsClient from "./projects-client";
import { BreadcrumbStructuredData } from "@/components/seo/structured-data";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "AI Product Design Projects",
  description:
    "Proven AI design results: GrowIt reached 240K+ active users & a 4.8★ rating, AI Design System Generator saves 40+ hours/week. See real projects that deliver business impact.",
  path: "/projects",
  keywords: [
    "AI Product Design Projects",
    "Randy Ellis Portfolio",
    "GrowIt App Design",
    "AI Design System Generator",
    "Product Design Case Studies",
    "Design Engineering Projects",
    "Mobile App Design",
    "AI Design Tools",
  ],
});

export default function ProjectsPage() {
  const breadcrumbItems = [
    { name: "Home", url: "https://work.randyellis.design" },
    { name: "Projects", url: "https://work.randyellis.design/projects" },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <ProjectsClient />
    </>
  );
}
