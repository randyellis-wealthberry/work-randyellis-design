import type { Metadata } from "next";
import AboutClient from "./about-client";
import { BreadcrumbStructuredData } from "@/components/seo/structured-data";

export const metadata: Metadata = {
  title: "About Randy Ellis - AI Product Design Engineer & Leader",
  description:
    "💡 From design leader to AI product engineer: Built teams at Nagarro (100+ leads, 40% retention boost) to Head of Product at Wealthberry Labs. The story behind 2.5M+ users impacted.",
  keywords: [
    "Randy Ellis About",
    "AI Product Design Engineer Biography",
    "Wealthberry Labs Head of Product",
    "Design Leadership Career",
    "AI Design Expert Background",
    "Product Design Experience",
    "Nagarro Head of Design",
    "Design Engineering Leader",
  ],
  openGraph: {
    title: "About Randy Ellis - AI Product Design Engineer & Leader",
    description:
      "💡 The journey from design leader to AI product engineer: 2.5M+ users impacted, 6 awards won, $50M value delivered. See how it all started.",
    url: "https://work.randyellis.design/about",
  },
};

export default function AboutPage() {
  const breadcrumbItems = [
    { name: "Home", url: "https://work.randyellis.design" },
    { name: "About", url: "https://work.randyellis.design/about" },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <AboutClient />
    </>
  );
}
