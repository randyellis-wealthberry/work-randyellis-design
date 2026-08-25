import { MetadataRoute } from "next";
import { WEBSITE_URL } from "@/lib/constants";
import { PROJECTS } from "@/lib/data/projects";
import { getBlogArticles } from "@/lib/utils/blog-data";

// Build-time timestamp for static and project pages.
// This is the honest freshness signal until projects carry content dates (D-20).
// Evaluated once at build or first request in development.
const BUILD_TIME = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages with priority scoring
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${WEBSITE_URL}/`,
      lastModified: BUILD_TIME,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${WEBSITE_URL}/projects`,
      lastModified: BUILD_TIME,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${WEBSITE_URL}/about`,
      lastModified: BUILD_TIME,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${WEBSITE_URL}/blog`,
      lastModified: BUILD_TIME,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${WEBSITE_URL}/skills`,
      lastModified: BUILD_TIME,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${WEBSITE_URL}/metis`,
      lastModified: BUILD_TIME,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${WEBSITE_URL}/privacy-policy`,
      lastModified: BUILD_TIME,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${WEBSITE_URL}/terms-of-service`,
      lastModified: BUILD_TIME,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic project pages
  const projectPages: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: `${WEBSITE_URL}/projects/${project.slug}`,
    lastModified: BUILD_TIME,
    changeFrequency: "monthly" as const,
    priority: project.featured ? 0.8 : 0.6,
  }));

  // Dynamic blog pages with real publication dates
  const blogPages: MetadataRoute.Sitemap = getBlogArticles().map((post) => ({
    url: `${WEBSITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedDate),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
