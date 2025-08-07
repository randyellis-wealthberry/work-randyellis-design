import { Metadata } from "next";
import NagarroClientPage from "./nagarro-client";

export const metadata: Metadata = {
  title: "Design @Nagarro | Scaling Excellence Across 18,000+ Global Teams",
  description:
    "Discover how strategic design leadership at Nagarro drove digital accessibility initiatives, inclusive design practices, and design evangelism across 36 countries, generating $50M+ in business impact.",
  openGraph: {
    title: "Design @Nagarro | Strategic Design Leadership Case Study",
    description:
      "From 15,000 to 18,000+ employees: How design evangelism strategy drove 50% brand recognition growth and 100+ qualified leads through accessibility innovation.",
    type: "article",
    images: [
      {
        url: "/projects/nagarro/digital-accessibility-strategy.png",
        width: 1200,
        height: 630,
        alt: "Nagarro digital accessibility strategy framework",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Design @Nagarro | Strategic Design Leadership",
    description:
      "How design evangelism drove 50% brand growth and accessibility innovation across 18,000+ global teams.",
    images: ["/projects/nagarro/digital-accessibility-strategy.png"],
  },
};

export default function NagarroPage() {
  return <NagarroClientPage />;
}
