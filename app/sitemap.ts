import { MetadataRoute } from "next";
import { WEBSITE_URL } from "@/lib/constants";
import { PROJECTS, BLOG_POSTS } from "./data";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Static pages with priority scoring
  const staticPages = [
    {
      url: `${WEBSITE_URL}/`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 1.0, // Homepage - highest priority
    },
    {
      url: `${WEBSITE_URL}/projects`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.9, // Projects page - very high priority
    },
    {
      url: `${WEBSITE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8, // About page - high priority
    },
    {
      url: `${WEBSITE_URL}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.7, // Blog index - high priority
    },
  ];

  // Dynamic project pages
  const projectPages = PROJECTS.map((project) => ({
    url: `${WEBSITE_URL}/projects/${project.slug}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: project.featured ? 0.8 : 0.6, // Featured projects get higher priority
  }));

  // Dynamic blog pages
  const blogPages = BLOG_POSTS.map((post) => ({
    url: `${WEBSITE_URL}${post.link}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.6, // Blog posts - medium priority
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
