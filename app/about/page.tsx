import type { Metadata } from "next";
import { canonicalAlternates } from "@/lib/metadata";
import AboutClient from "./about-client";
import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbSchema } from "@/lib/seo/json-ld";
import { WEBSITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About — AI Product Design Engineer & Leader",
  description:
    "From design leader to AI product engineer: built teams at Nagarro, now Head of Product at Wealthberry Labs. The story behind 500M+ users impacted.",
  alternates: canonicalAlternates("/about"),
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
    title: "About Randy Ellis - Head of Product & Fractional CDO",
    description:
      "The journey of a design leader who ships AI products: 500M+ users impacted, 4 awards won, $500M+ product value delivered. See how it all started.",
    url: "/about",
  },
};

export default function AboutPage() {
  const breadcrumbItems = [
    { name: "Home", url: WEBSITE_URL },
    { name: "About", url: `${WEBSITE_URL}/about` },
  ];

  return (
    <>
      <JsonLd
        id="breadcrumb-jsonld"
        data={buildBreadcrumbSchema(breadcrumbItems)}
      />
      <AboutClient />
    </>
  );
}
