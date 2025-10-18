import { Metadata } from "next";
import EchoClientPage from "./echo-client";

export const metadata: Metadata = {
  title: "EchoDrive Case Study | Logistics Innovation & Digital Transformation",
  description:
    "Explore how EchoDrive revolutionized trucking logistics through mobile innovation, achieving 16% revenue increase, 10,000+ active drivers, and full ELD compliance.",
  openGraph: {
    title:
      "EchoDrive Case Study | Logistics Innovation & Digital Transformation",
    description:
      "Trucking logistics case study: 16% revenue increase, 10,000+ active drivers, ELD compliance through mobile-first digital transformation.",
    type: "article",
    images: [
      {
        url: "/projects/echo/img1.jpg",
        width: 1200,
        height: 630,
        alt: "EchoDrive mobile logistics platform for trucking industry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EchoDrive Case Study | Trucking Logistics Innovation",
    description:
      "How mobile-first digital transformation transformed trucking logistics operations and driver experience.",
    images: ["/projects/echo/img1.jpg"],
  },
};

export default function EchoDriveCaseStudy() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <EchoClientPage />
    </div>
  );
}
