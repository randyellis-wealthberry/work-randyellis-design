/**
 * Dynamic metadata generation utility
 * Handles environment-aware metadata for SEO and social sharing
 */

import type { Metadata } from "next";
import { getBaseUrl, createAbsoluteUrl } from "./env";

// Next.js replaces (not merges) a page's `alternates` object, so every helper
// that sets a canonical must re-attach the feed link or the page loses it.
const RSS_ALTERNATE_TYPES = {
  "application/rss+xml": [{ url: "/rss.xml", title: "Randy Ellis — Blog" }],
};

/**
 * Create base metadata configuration with dynamic URLs
 */
export function createBaseMetadata(): Metadata {
  const baseUrl = getBaseUrl();

  return {
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: "/",
      types: RSS_ALTERNATE_TYPES,
    },
    title: {
      default: "Randy Ellis | Head of Product & Fractional CDO",
      template: "%s | Randy Ellis",
    },
    description:
      "Head of Product & Fractional Chief Design Officer helping startups ship design-led AI products. 500M+ users impacted, $500M+ product value delivered.",
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
      types: RSS_ALTERNATE_TYPES,
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
      types: RSS_ALTERNATE_TYPES,
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

import type { Project } from "./data/types";
import { WEBSITE_URL } from "./constants";

/**
 * Extract OG-suitable image from project data (D-05)
 * Returns thumbnail if it's an image, otherwise falls back to first image
 * in the images array (handles video thumbnails like LedgerIQ's .mp4)
 */
export function projectOgImage(project: Project): string | undefined {
  const isImage = (path: string) =>
    /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(path);

  if (project.thumbnail && isImage(project.thumbnail)) {
    return project.thumbnail;
  }

  return project.images?.find(isImage);
}

/**
 * Extract first 4-digit year from project timeline (D-11)
 * Returns undefined when timeline contains no year (e.g. "Alpha → Beta → Launch")
 */
export function projectDateCreated(project: Project): string | undefined {
  const yearMatch = project.timeline.match(/\b(?:19|20)\d{2}\b/);
  return yearMatch ? yearMatch[0] : undefined;
}

/**
 * Single implementation of project metadata for all 7 case-study routes (D-02)
 * Uses project.description (not longDescription) per D-03
 */
export function projectMetadata(project: Project): Metadata {
  const title = `${project.name} | ${project.subtitle ?? project.category}`;
  const img = projectOgImage(project);

  return {
    title,
    description: project.description,
    alternates: {
      canonical: `/projects/${project.slug}`,
      types: RSS_ALTERNATE_TYPES,
    },
    keywords: [
      project.name,
      ...project.technologies,
      ...project.tags,
      project.category,
      "Randy Ellis",
      "AI Product Design",
      "Design Engineering",
    ],
    openGraph: {
      type: "article",
      title,
      description: project.description,
      url: `/projects/${project.slug}`,
      authors: ["Randy Ellis"],
      images: img
        ? [
            {
              url: img,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.description,
      images: img ? [img] : [],
    },
  };
}

/**
 * Props builder for CreativeWorkStructuredData JSON-LD (D-11)
 */
export function projectCreativeWorkProps(project: Project) {
  const img = projectOgImage(project);
  return {
    name: project.name,
    description: project.description,
    url: `${WEBSITE_URL}/projects/${project.slug}`,
    dateCreated: projectDateCreated(project),
    technologies: project.technologies,
    category: project.category,
    metrics: project.metrics,
    imageUrl: img ? `${WEBSITE_URL}${img}` : undefined,
    teamSize: project.teamSize,
    role: project.role,
  };
}

export type ProjectCreativeWorkProps = ReturnType<
  typeof projectCreativeWorkProps
>;

/**
 * Breadcrumb items builder for BreadcrumbStructuredData (D-12)
 */
export function projectBreadcrumbItems(project: Project) {
  return [
    { name: "Home", url: WEBSITE_URL },
    { name: "Projects", url: `${WEBSITE_URL}/projects` },
    { name: project.name, url: `${WEBSITE_URL}/projects/${project.slug}` },
  ];
}
