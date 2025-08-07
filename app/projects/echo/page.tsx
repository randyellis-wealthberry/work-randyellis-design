import { Metadata } from "next";
import EchoClientPage from "./echo-client";

export const metadata: Metadata = {
  title: "EchoDrive Case Study | AI-Powered Smart Cloud Storage",
  description:
    "Explore how EchoDrive revolutionized cloud storage through AI-powered organization, achieving 89% user adoption, 35% storage efficiency gains, and 5x faster search speeds.",
  openGraph: {
    title: "EchoDrive Case Study | AI-Powered Cloud Storage Innovation",
    description:
      "AI-powered cloud storage case study: 35% storage efficiency, 5x search speed, 89% user adoption through intelligent file management.",
    type: "article",
    images: [
      {
        url: "/projects/echo/img1.jpg",
        width: 1200,
        height: 630,
        alt: "EchoDrive AI-powered cloud storage interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EchoDrive Case Study | Smart Cloud Storage with AI",
    description:
      "How AI-powered intelligence transformed cloud storage efficiency and collaboration workflows.",
    images: ["/projects/echo/img1.jpg"],
  },
};

export default function EchoDriveCaseStudy() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <EchoClientPage />
    </div>
  );
}
