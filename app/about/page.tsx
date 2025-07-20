import type { Metadata } from "next";
import AboutClient from "./about-client";

export const metadata: Metadata = {
  title: "About Randy Ellis - AI Product Design Engineer & Leader",
  description:
    "Learn about Randy Ellis's journey from design leadership to AI product engineering. Head of Product at Wealthberry Labs with 2.5M+ users impacted, 6 design awards, and $50M in product value.",
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
      "From design leadership to AI innovation: 2.5M+ users impacted, 6 design awards, $50M in product value delivered.",
    url: "https://work.randyellis.design/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
