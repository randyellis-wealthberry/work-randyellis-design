import type { Metadata } from "next";
import ProjectsClient from "./projects-client";
import { BreadcrumbStructuredData } from "@/components/seo/structured-data";

export const metadata: Metadata = {
  title: "AI Product Design Projects - Randy Ellis Portfolio",
  description:
    "Explore Randy Ellis's AI-powered product design projects including GrowIt (100K+ users), AI Design System Generator, and innovative design engineering solutions.",
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
  openGraph: {
    title: "AI Product Design Projects - Randy Ellis",
    description:
      "Explore innovative AI-powered design projects with real impact: 100K+ users, 4.8★ ratings, and cutting-edge AI design tools.",
    url: "https://work.randyellis.design/projects",
  },
};

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
