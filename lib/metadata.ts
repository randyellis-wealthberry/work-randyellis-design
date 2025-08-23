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
        "Randy Ellis - AI Product Design Engineer | Generative AI & Design Leadership",
      template: "%s | Randy Ellis",
    },
    description:
      "🚀 AI Product Design Engineer transforming ideas into reality. 2.5M+ users impacted, 6 design awards won. See how AI-powered design drives $50M in product value at Wealthberry Labs.",
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
      siteName: "Randy Ellis - AI Product Design Engineer",
      title:
        "Randy Ellis - AI Product Design Engineer | Generative AI & Design Leadership",
      description:
        "🚀 AI Product Design Engineer transforming ideas into reality. 2.5M+ users impacted, 6 design awards won. See how AI-powered design drives $50M in product value at Wealthberry Labs.",
      images: [
        {
          url: createAbsoluteUrl("/randy-ellis-og-image.jpg"),
          width: 1200,
          height: 630,
          alt: "Randy Ellis - AI Product Design Engineer Portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        "Randy Ellis - AI Product Design Engineer | Generative AI & Design Leadership",
      description:
        "🚀 AI Product Design Engineer transforming ideas into reality. 2.5M+ users impacted, 6 design awards won.",
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
