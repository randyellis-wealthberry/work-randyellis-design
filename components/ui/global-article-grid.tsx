"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdvancedReadTimeBadge } from "@/components/ui/advanced-read-time-badge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getBlogArticles, type BlogArticle } from "@/lib/utils/blog-data";
import { InView } from "@/components/motion-primitives/in-view";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import {
  trackRecommendationArticleClick,
  trackRecommendationCardHover,
} from "@/lib/analytics";

// Animation variants matching existing patterns
const VARIANTS_ITEM = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const TRANSITION_ITEM = {
  duration: 0.4,
};

interface GlobalArticleGridProps {
  currentSlug?: string;
  title?: string;
  className?: string;
  limit?: number;
  showReadTime?: boolean;
  showCategory?: boolean;
  showDescription?: boolean;
  sourcePageType?: "project" | "blog";
  sourceSlug?: string;
}

function formatPublishedDate(dateString: string): string {
  try {
    // Create date with UTC to avoid timezone issues
    const date = new Date(dateString + "T00:00:00.000Z");
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return dateString;
  }
}

export function GlobalArticleGrid({
  currentSlug,
  title = "Latest Articles",
  className,
  limit = 2,
  showReadTime = true,
  showCategory = true,
  showDescription = true,
  sourcePageType = "project",
  sourceSlug = "",
}: GlobalArticleGridProps) {
  // Handle analytics tracking
  const handleArticleClick = React.useCallback(
    (article: BlogArticle, position: number) => {
      trackRecommendationArticleClick(
        sourcePageType,
        sourceSlug,
        article.slug,
        article.title,
        position,
        `${sourcePageType}_page`,
      );
    },
    [sourcePageType, sourceSlug],
  );

  // Handle hover analytics tracking
  const handleArticleHover = React.useCallback(
    (article: BlogArticle, position: number) => {
      trackRecommendationCardHover(
        "article",
        sourcePageType,
        article.slug,
        article.title,
        position,
      );
    },
    [sourcePageType],
  );
  const articles = React.useMemo(() => {
    const allArticles = getBlogArticles();

    // Filter out malformed data and current article
    const validArticles = allArticles.filter((article) => {
      if (!article?.title || !article?.slug) return false;
      if (currentSlug && article.slug === currentSlug) return false;
      return true;
    });

    if (validArticles.length === 0) {
      return [];
    }

    // Sort by featured status first, then by views, then by date
    const sortedArticles = validArticles.sort((a, b) => {
      // Featured articles first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      // Then by views (descending)
      const aViews = a.views || 0;
      const bViews = b.views || 0;
      if (aViews !== bViews) return bViews - aViews;

      // Finally by date (newest first)
      return (
        new Date(b.publishedDate).getTime() -
        new Date(a.publishedDate).getTime()
      );
    });

    return sortedArticles.slice(0, limit);
  }, [currentSlug, limit]);

  // Don't render if no articles available
  if (articles.length === 0) {
    return null;
  }

  return (
    <section
      className={cn("space-y-6", className)}
      data-testid="article-grid-container"
    >
      {/* Section Title */}
      <TextEffect as="h2" className="text-2xl font-bold" preset="fade-in-blur">
        {title}
      </TextEffect>

      {/* Grid */}
      <div
        className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2"
        data-testid="article-grid"
      >
        {articles.map((article, index) => (
          <InView
            key={article.slug}
            variants={VARIANTS_ITEM}
            transition={{ ...TRANSITION_ITEM, delay: index * 0.1 }}
            viewOptions={{ once: true }}
          >
            <Card
              className="group h-full transition-all duration-200 hover:border-zinc-300 hover:shadow-md dark:hover:border-zinc-600"
              data-testid="article-card"
            >
              {/* Featured Star Indicator */}
              {article.featured && (
                <div
                  className="absolute top-3 right-3 z-10"
                  data-testid="featured-star"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  </div>
                </div>
              )}

              {/* Article Hero Image */}
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <Image
                  src={`https://picsum.photos/600/300?random=${article.slug}`}
                  alt={`${article.title} preview`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <Link
                href={`/blog/${article.slug}`}
                className="block h-full p-6 no-underline"
                style={{ textDecoration: "none" }}
                aria-label={`Read ${article.title}`}
                onClick={() => handleArticleClick?.(article, index)}
                onMouseEnter={() => handleArticleHover?.(article, index)}
              >
                <div className="flex h-full flex-col">
                  {/* Header with category and read time */}
                  <div className="mb-4 flex items-center justify-between gap-2">
                    {showCategory && (
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                    )}
                    {showReadTime && (
                      <div data-testid="read-time-badge">
                        <AdvancedReadTimeBadge
                          readTime={article.readTime}
                          variant="outline"
                          size="sm"
                        />
                      </div>
                    )}
                  </div>

                  {/* Article title with hover effects */}
                  <TextEffect
                    as="h3"
                    preset="fade"
                    className="mb-3 line-clamp-2 min-h-[3.5rem] font-semibold text-zinc-950 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400"
                    delay={0.1}
                  >
                    {article.title}
                  </TextEffect>

                  {/* Description */}
                  {showDescription && article.description && (
                    <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                      {article.description}
                    </p>
                  )}

                  {/* Publication date */}
                  <div className="mt-auto text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {formatPublishedDate(article.publishedDate)}
                  </div>
                </div>
              </Link>
            </Card>
          </InView>
        ))}
      </div>
    </section>
  );
}
