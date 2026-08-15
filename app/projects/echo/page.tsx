import { Metadata } from "next";
import EchoClientPage from "./echo-client";

export const metadata: Metadata = {
  title: "EchoDrive Case Study | Logistics Innovation",
  description:
    "How EchoDrive brought trucking logistics onto mobile: on-site research with drivers and dispatch, a shared shipment state across both platforms, and full ELD compliance.",
  alternates: {
    canonical: "/projects/echo",
  },
  openGraph: {
    title:
      "EchoDrive Case Study | Logistics Innovation & Digital Transformation",
    description:
      "Trucking logistics case study: field research with drivers, dual-platform design, and ELD compliance through a mobile-first approach.",
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
