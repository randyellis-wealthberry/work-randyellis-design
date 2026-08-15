import type { Metadata } from "next";
import MetisClient from "./metis-client";
import { BreadcrumbStructuredData } from "@/components/seo/structured-data";

export const metadata: Metadata = {
  title: "METIS — AI Business Strategy Agent",
  description:
    "A humble announcement about METIS and what I share with the design community. Bridging the gap between design excellence and boardroom fluency.",
  alternates: {
    canonical: "/metis",
  },
  keywords: [
    "METIS",
    "Randy Ellis",
    "Design Community",
    "Product Design",
    "Business Strategy",
    "Design Leadership",
    "AI Product Design",
  ],
  openGraph: {
    title: "METIS — AI Business Strategy Agent",
    description:
      "A humble announcement about METIS and what I share with the design community.",
    url: "/metis",
  },
};

export default function MetisPage() {
  const breadcrumbItems = [
    { name: "Home", url: "https://work.randyellis.design" },
    { name: "METIS", url: "https://work.randyellis.design/metis" },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <MetisClient />
    </>
  );
}
