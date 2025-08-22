import { Metadata } from "next";
import RambisClientPage from "./rambis-client";
import { PROJECTS } from "@/lib/data/projects";

// Get the Rambis UI project data
const rambisProject = PROJECTS.find((p) => p.id === "rambis-ui")!;

export const metadata: Metadata = {
  title: `${rambisProject.name} Case Study | ${rambisProject.subtitle}`,
  description: rambisProject.description,
  openGraph: {
    title: `${rambisProject.name} Case Study | Modern Design System Innovation`,
    description: rambisProject.description,
    type: "article",
    images: [
      {
        url: rambisProject.thumbnail || "/projects/rambis-ui/hero-image.jpg",
        width: 1200,
        height: 630,
        alt: `${rambisProject.name} design system showcase`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${rambisProject.name} Case Study | Design System Excellence`,
    description: rambisProject.description,
    images: [rambisProject.thumbnail || "/projects/rambis-ui/hero-image.jpg"],
  },
};

export default function RambisUICaseStudy() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <RambisClientPage />
    </div>
  );
}
