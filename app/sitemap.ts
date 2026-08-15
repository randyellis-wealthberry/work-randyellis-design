import { MetadataRoute } from "next";
import { WEBSITE_URL } from "@/lib/constants";
import { PROJECTS } from "@/lib/data/projects";
import { getBlogArticles } from "@/lib/utils/blog-data";

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages with priority scoring
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${WEBSITE_URL}/`,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${WEBSITE_URL}/projects`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${WEBSITE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${WEBSITE_URL}/blog`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${WEBSITE_URL}/metis`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamic project pages
  const projectPages: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: `${WEBSITE_URL}/projects/${project.slug}`,
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
