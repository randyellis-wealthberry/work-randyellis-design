import { Metadata } from "next";
import { CaseStudyLayout } from "@/components/case-study/case-study-layout";

export const metadata: Metadata = {
  title:
    "EchoDrive Case Study | Streamlining Logistics Through Digital Innovation",
  description:
    "Discover how Eight Bit Studios and Echo Global Logistics transformed traditional logistics operations through strategic digital innovation, achieving 16% revenue increase and 10,000+ active users.",
  openGraph: {
    title: "EchoDrive Case Study | Digital Logistics Transformation",
    description:
      "Strategic digital innovation case study: 16% revenue increase, 12% volume growth, 10,000+ active users in logistics technology.",
    type: "article",
    images: [
      {
        url: "/projects/echo/showcase1.jpg",
        width: 1200,
        height: 630,
        alt: "EchoDrive mobile application showcase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EchoDrive Case Study | Digital Logistics Innovation",
    description:
      "How strategic UX design and development achieved 16% revenue growth in logistics technology.",
    images: ["/projects/echo/showcase1.jpg"],
  },
};

const echoDriveData = {
  title: "EchoDrive: Streamlining Logistics Through Digital Innovation",
  client: "Echo Global Logistics, Inc.",
  partner: "Eight Bit Studios",
  timeline: "Alpha → Beta → Launch",
  platforms: ["iOS", "Android", "Web Application"],
  hero: {
    title: "EchoDrive: Streamlining Logistics Through Digital Innovation",
    subtitle:
      "Transforming traditional logistics operations through strategic digital innovation, user-centered design, and comprehensive development execution.",
    client: "Echo Global Logistics, Inc.",
    partner: "Eight Bit Studios",
    timeline: "Alpha → Beta → Launch",
    platforms: ["iOS", "Android", "Web Application"],
    heroImage: "/projects/echo/showcase1.jpg",
    heroVideo: "/projects/echo/echodrive-mockup-video.mp4",
  },
  metrics: [
    {
      label: "Revenue Increase",
      value: "16%",
      description: "LTL shipment revenues to $184.4M (Q4 2019)",
    },
    {
      label: "Volume Growth",
      value: "12%",
      description: "Through self-serve booking application",
    },
    {
      label: "Beta Downloads",
      value: "1,000",
      description: "During testing phase",
    },
    {
      label: "Active Users",
      value: "10,000+",
      description: "Post-launch drivers on platform",
    },
  ],
};

export default function EchoDriveCaseStudy() {
  return <CaseStudyLayout data={echoDriveData} />;
}
