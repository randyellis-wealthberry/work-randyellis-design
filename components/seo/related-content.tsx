"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock, User } from "lucide-react";
import { BLOG_POSTS } from "@/lib/data";
import { PROJECTS } from "@/lib/data/projects";
// import { calculateReadTime } from "@/lib/utils/read-time";

export interface RelatedItem {
  title: string;
  description: string;
  url: string;
  type: "blog" | "project" | "external";
  image?: string;
  readTime?: number;
  tags?: string[];
  author?: string;
  date?: string;
}

interface RelatedContentProps {
  currentUrl: string;
  contentType: "blog" | "project";
  tags?: string[];
  category?: string;
  maxItems?: number;
  showImages?: boolean;
  className?: string;
}

export function RelatedContent({
  currentUrl,
  contentType,
  // tags = [],
  category,
  maxItems = 3,
  showImages = true,
  className = "",
}: RelatedContentProps) {
  const getRelatedContent = (): RelatedItem[] => {
    const related: RelatedItem[] = [];

    if (contentType === "blog") {
      // Get related blog posts
      const otherPosts = BLOG_POSTS.filter(
        (post) => !currentUrl.includes(post.link),
      );

      // Add blog posts
      otherPosts.slice(0, 2).forEach((post) => {
        related.push({
          title: post.title,
          description: post.description,
          url: post.link,
          type: "blog",
          readTime: 5, // Default read time
        });
      });

      // Add related projects if there's space
      if (related.length < maxItems) {
        const relatedProjects = PROJECTS.filter(
          (project) => project.featured,
        ).slice(0, maxItems - related.length);

        relatedProjects.forEach((project) => {
          related.push({
            title: project.name,
            description: project.description,
            url: `/projects/${project.slug}`,
            type: "project",
            tags: project.tags,
            image: project.thumbnail,
          });
        });
      }
    } else if (contentType === "project") {
      // Get related projects
      const otherProjects = PROJECTS.filter(
        (project) => !currentUrl.includes(project.slug),
      );

      // Prioritize by category match
      const sameCategory = otherProjects.filter((p) => p.category === category);
      const otherCategories = otherProjects.filter(
        (p) => p.category !== category,
      );

      const sortedProjects = [...sameCategory, ...otherCategories].slice(
        0,
        maxItems - 1,
      ); // Leave room for a blog post

      sortedProjects.forEach((project) => {
        related.push({
          title: project.name,
          description: project.description,
          url: `/projects/${project.slug}`,
          type: "project",
          tags: project.tags,
          image: project.thumbnail,
        });
      });

      // Add a relevant blog post
      if (related.length < maxItems) {
        const relevantPost = BLOG_POSTS[0]; // Could be smarter matching
        related.push({
          title: relevantPost.title,
          description: relevantPost.description,
          url: relevantPost.link,
          type: "blog",
          readTime: 5,
        });
      }
    }

    return related.slice(0, maxItems);
  };

  const relatedItems = getRelatedContent();

  if (relatedItems.length === 0) return null;

  return (
    <section className={`space-y-6 ${className}`}>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Related Content</h2>
        <p className="text-muted-foreground">
          Explore more{" "}
          {contentType === "blog"
            ? "articles and projects"
            : "projects and insights"}{" "}
          that might interest you.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedItems.map((item, index) => (
          <Card
            key={`${item.type}-${index}`}
            className="group h-full transition-all hover:shadow-lg"
          >
            <Link href={item.url} className="block h-full">
              {showImages && item.image && (
                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                  <Image
                    src={item.image}
                    alt={`${item.title} preview image`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}

              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={item.type === "blog" ? "default" : "secondary"}
                    className="w-fit"
                  >
                    {item.type === "blog" ? "Article" : "Project"}
                  </Badge>

                  {item.readTime && (
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {item.readTime} min read
                    </div>
                  )}
                </div>

                <CardTitle className="group-hover:text-primary line-clamp-2 transition-colors">
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <CardDescription className="line-clamp-3">
                  {item.description}
                </CardDescription>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="outline"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  {item.author && (
                    <div className="text-muted-foreground flex items-center gap-1 text-xs">
                      <User className="h-3 w-3" />
                      {item.author}
                    </div>
                  )}

                  <div className="text-muted-foreground group-hover:text-primary flex items-center gap-1 text-xs transition-colors">
                    Read more
                    <ExternalLink className="h-3 w-3" />
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}

// Utility to get contextual related content
export function getContextualLinks(currentPath: string): RelatedItem[] {
  const links: RelatedItem[] = [];

  // Context-aware internal linking
  if (currentPath.includes("/blog/")) {
    // On blog posts, suggest projects
    links.push({
      title: "View My Projects",
      description:
        "Explore AI-powered product design projects with real business impact",
      url: "/projects",
      type: "project",
    });
  } else if (currentPath.includes("/projects/")) {
    // On projects, suggest blog and about
    links.push({
      title: "Read My Blog",
      description: "AI design insights, tutorials, and real-world experiences",
      url: "/blog",
      type: "blog",
    });
  } else if (currentPath.includes("/about")) {
    // On about, suggest projects and blog
    links.push({
      title: "See My Work",
      description: "Explore projects that have impacted 2.5M+ users",
      url: "/projects",
      type: "project",
    });
  }

  return links;
}
