import type { Metadata } from "next";
import ProjectsClient from "./projects-client";
import { BreadcrumbStructuredData } from "@/components/seo/structured-data";

export const metadata: Metadata = {
  title: "AI Product Design Projects - Randy Ellis Portfolio",
  description:
    "🎯 Proven AI design results: GrowIt hit 1M+ users & 4.8★ rating, AI Design System Generator saves 40+ hours/week. See real projects that deliver business impact.",
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
      "🎯 Real AI design impact: 1M+ users, 4.8★ ratings, 40+ hours saved weekly. Discover projects that prove AI-powered design delivers business results.",
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
