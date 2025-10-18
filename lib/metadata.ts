/**
 * Dynamic metadata generation utility
 * Handles environment-aware metadata for SEO and social sharing
 */

import type { Metadata } from "next";
import { getBaseUrl, createAbsoluteUrl } from "./env";

/**
 * Create base metadata configuration with dynamic URLs
 */
export function createBaseMetadata(): Metadata {
  const baseUrl = getBaseUrl();

  return {
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: "/",
    },
    title: {
      default:
        "Randy Ellis - Fractional Chief Design Officer & AI Product Design Engineer | Startup Design Leadership",
      template: "%s | Randy Ellis",
    },
    description:
      "🚀 Fractional Chief Design Officer & AI Product Design Engineer transforming startups into design-led organizations. 2.5M+ users impacted, $50M+ product value delivered. Specializing in venture-backed startup design leadership, scalable design systems, and AI-powered product innovation. Available for fractional CDO engagements through Chameleon Collective, Go Fractional, and startup advisory partnerships.",
    keywords: [
      "AI Product Design Engineer",
      "Generative AI Design",
      "Product Design Leadership",
      "AI Design Systems",
      "UX Research AI",
      "Design Engineering",
      "AI Product Strategy",
      "Wealthberry Labs",
      "Portfolio Randy Ellis",
      "AI Design Tools",
      "React Design Systems",
      "Next.js Developer",
      "Design Leadership",
      "Product Management",
      "Design Systems Architecture",
      "Fractional Chief Design Officer",
      "Fractional CDO",
      "Part-time Design Executive",
      "Startup Design Leadership",
      "Venture-backed Design Consultant",
      "Chameleon Collective Fractional Executive",
      "Go Fractional Design Leadership",
      "Catalant Fractional Consulting",
      "Toptal Design Executive",
      "Business Talent Group Fractional CDO",
      "Fractional Design Services",
      "Startup Design Advisor",
      "Design Systems Scaling",
      "Remote Design Leadership",
      "Interim Chief Design Officer",
      "Contract Design Executive",
      "Startup C-suite Design",
      "Design Operations Fractional",
      "Product Design Fractional",
      "UX Leadership Fractional",
    ],
    authors: [{ name: "Randy Ellis", url: baseUrl }],
    creator: "Randy Ellis",
    publisher: "Randy Ellis",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseUrl,
      siteName: "Randy Ellis - Fractional Chief Design Officer & AI Product Design Engineer",
      title:
        "Randy Ellis - Fractional Chief Design Officer & AI Product Design Engineer | Startup Design Leadership",
      description:
        "🚀 Fractional Chief Design Officer & AI Product Design Engineer transforming startups into design-led organizations. 2.5M+ users impacted, $50M+ product value delivered. Specializing in venture-backed startup design leadership, scalable design systems, and AI-powered product innovation.",
      images: [
        {
          url: createAbsoluteUrl("/randy-ellis-og-image.jpg"),
          width: 1200,
          height: 630,
          alt: "Randy Ellis - Fractional Chief Design Officer & AI Product Design Engineer Portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        "Randy Ellis - Fractional Chief Design Officer & AI Product Design Engineer | Startup Design Leadership",
      description:
        "🚀 Fractional Chief Design Officer transforming startups into design-led organizations. 2.5M+ users impacted, $50M+ product value delivered. Available for fractional CDO engagements.",
      site: "@iamrandyellis",
      creator: "@iamrandyellis",
      images: [createAbsoluteUrl("/randy-ellis-og-image.jpg")],
    },
    verification: {
      google: "your-google-verification-code", // Replace with actual verification
    },
    category: "Technology",
    classification: "Business",
  };
}

/**
 * Create page-specific metadata with dynamic URLs
 */
export function createPageMetadata({
  title,
  description,
  path = "",
  image,
  keywords = [],
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  keywords?: string[];
}): Metadata {
  // const baseUrl = getBaseUrl(); // Currently unused
  const canonicalUrl = createAbsoluteUrl(path);
  const ogImage = image
    ? createAbsoluteUrl(image)
    : createAbsoluteUrl("/randy-ellis-og-image.jpg");

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Create article metadata for blog posts
 */
export function createArticleMetadata({
  title,
  description,
  path,
  publishedTime,
  modifiedTime,
  tags = [],
  image,
}: {
  title: string;
  description: string;
  path: string;
  publishedTime: string;
  modifiedTime?: string;
  tags?: string[];
  image?: string;
}): Metadata {
  const canonicalUrl = createAbsoluteUrl(path);
  const ogImage = image
    ? createAbsoluteUrl(image)
    : createAbsoluteUrl("/randy-ellis-og-image.jpg");

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: tags.length > 0 ? tags : undefined,
    authors: [{ name: "Randy Ellis", url: getBaseUrl() }],
    openGraph: {
      type: "article",
      title,
      description,
      url: canonicalUrl,
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      authors: ["Randy Ellis"],
      tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Get environment-aware metadata base for Next.js
 */
export function getMetadataBase(): URL {
  return new URL(getBaseUrl());
}
