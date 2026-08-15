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
      default: "Randy Ellis | Head of Product & Fractional CDO",
      template: "%s | Randy Ellis",
    },
    description:
      "Head of Product & Fractional Chief Design Officer helping startups ship design-led AI products. 2.5M+ users impacted, $50M+ product value delivered.",
    keywords: [
      "Fractional Chief Design Officer",
      "Fractional CDO",
      "AI Product Design Engineer",
      "Startup Design Leadership",
      "Design Systems",
      "Generative AI Design",
      "Design Engineering",
      "Interim Chief Design Officer",
      "Venture-backed Design Consultant",
      "Product Design Consulting",
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
      siteName: "Randy Ellis - Head of Product & Fractional CDO",
    },
    twitter: {
      card: "summary_large_image",
      site: "@iamrandyellis",
      creator: "@iamrandyellis",
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
  const canonicalUrl = createAbsoluteUrl(path);
  const ogImage = image ? createAbsoluteUrl(image) : undefined;

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
      ...(ogImage && {
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
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
  const ogImage = image ? createAbsoluteUrl(image) : undefined;

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
      ...(ogImage && {
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

/**
 * Get environment-aware metadata base for Next.js
 */
export function getMetadataBase(): URL {
  return new URL(getBaseUrl());
}
