import type { Metadata } from "next";
import AddvancedClient from "./addvanced-client";
import { BreadcrumbStructuredData } from "@/components/seo/structured-data";

export const metadata: Metadata = {
  title: "Addvanced Career Tracker Case Study",
  description:
    "A two-week design sprint for a career intelligence platform: referral discovery across a job seeker's extended network, mobile-first tracking, and a prototype user-tested to 94% approval.",
  alternates: {
    canonical: "/projects/addvanced",
  },
  keywords: [
    "Addvanced Career Tracker",
    "Randy Ellis Case Study",
    "UX Research",
    "Product Strategy",
    "Innovation Lab",
    "Career Intelligence",
  ],
  openGraph: {
    title: "Addvanced Career Tracker Case Study",
    description:
      "A two-week design sprint: referral discovery, mobile-first career tracking, and a prototype user-tested to 94% approval.",
    url: "/projects/addvanced",
    images: [
      {
        url: "/projects/addvanced/A1-Home.png",
        width: 1200,
        height: 630,
        alt: "Addvanced Career Intelligence Platform Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Addvanced Career Tracker Case Study",
    description:
      "A two-week design sprint: referral discovery, mobile-first career tracking, and a prototype user-tested to 94% approval.",
    images: ["/projects/addvanced/A1-Home.png"],
  },
};

export default function AddvancedPage() {
  const breadcrumbItems = [
    { name: "Home", url: "https://work.randyellis.design" },
    { name: "Projects", url: "https://work.randyellis.design/projects" },
    {
      name: "Addvanced Career Tracker",
      url: "https://work.randyellis.design/projects/addvanced",
    },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <AddvancedClient />
    </>
  );
}
