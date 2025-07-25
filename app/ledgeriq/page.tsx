import type { Metadata } from "next";
import LedgerIQClient from "./ledgeriq-client";
import { BreadcrumbStructuredData } from "@/components/seo/structured-data";

export const metadata: Metadata = {
  title: "LedgerIQ Case Study - Randy Ellis",
  description:
    "Transforming financial intelligence through advanced UX design - achieving 40% productivity increase and 60% processing time reduction. A comprehensive case study in enterprise SaaS design.",
  keywords: [
    "LedgerIQ",
    "Randy Ellis",
    "Case Study",
    "Product Design",
    "Enterprise SaaS",
    "Financial Technology",
    "UX Research",
    "Design Systems",
    "Data Visualization",
    "Mobile Design",
    "User Experience",
  ],
  openGraph: {
    title: "LedgerIQ Case Study - Randy Ellis",
    description:
      "Transforming financial intelligence through advanced UX design - achieving 40% productivity increase and 60% processing time reduction.",
    url: "https://work.randyellis.design/ledgeriq",
    images: [
      {
        url: "/ledgeriq/hero-thumbnail.jpg",
        width: 1200,
        height: 630,
        alt: "LedgerIQ Case Study Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LedgerIQ Case Study - Randy Ellis",
    description:
      "Transforming financial intelligence through advanced UX design - achieving 40% productivity increase and 60% processing time reduction.",
    images: ["/ledgeriq/hero-thumbnail.jpg"],
  },
};

export default function LedgerIQPage() {
  const breadcrumbItems = [
    { name: "Home", url: "https://work.randyellis.design" },
    {
      name: "LedgerIQ Case Study",
      url: "https://work.randyellis.design/ledgeriq",
    },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />
      <LedgerIQClient />
    </>
  );
}
