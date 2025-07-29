import type { Metadata } from "next";
import AddvancedClient from "./addvanced-client";
import { BreadcrumbStructuredData } from "@/components/seo/structured-data";

export const metadata: Metadata = {
  title: "Addvanced Career Tracker Case Study - Randy Ellis",
  description:
    "Transforming job search from reactive to strategic through AI-powered insights. A comprehensive case study of innovation lab leadership delivering 35% improvement in customer job placement success.",
  keywords: [
    "Addvanced",
    "Career Tracker",
    "Randy Ellis",
    "Case Study",
    "UX Research",
    "Product Strategy",
    "Innovation Lab",
    "Alight Solutions",
    "Career Intelligence",
    "Progressive Web App",
    "Mobile Design",
    "Usability Testing",
    "Social Intelligence",
    "B2C/B2B Platform",
    "Rapid Prototyping",
    "IDI Framework",
    "UX Leadership",
  ],
  openGraph: {
    title: "Addvanced Career Tracker Case Study - Randy Ellis",
    description:
      "Innovation lab leadership delivering 35% improvement in customer job placement success through strategic UX design and rapid prototyping methodology.",
    url: "https://work.randyellis.design/addvanced",
    images: [
      {
        url: "https://work.randyellis.design/projects/addvanced/A1-Home.png",
        width: 1200,
        height: 630,
        alt: "Addvanced Career Intelligence Platform Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Addvanced Career Tracker Case Study - Randy Ellis",
    description:
      "Innovation lab leadership delivering 35% improvement in customer job placement success through strategic UX design and rapid prototyping.",
    images: ["https://work.randyellis.design/projects/addvanced/A1-Home.png"],
  },
};

export default function AddvancedPage() {
  const breadcrumbItems = [
    { name: "Home", url: "https://work.randyellis.design" },
    {
      name: "Addvanced Career Tracker",
      url: "https://work.randyellis.design/addvanced",
    },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <AddvancedClient />
    </>
  );
}
