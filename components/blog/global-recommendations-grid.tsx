"use client";

import * as React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdvancedReadTimeBadge } from "@/components/ui/advanced-read-time-badge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getBlogArticles, type BlogArticle } from "@/lib/utils/blog-data";
import { Magnetic } from "@/components/motion-primitives/magnetic";
import { InView } from "@/components/motion-primitives/in-view";
import { TextEffect } from "@/components/motion-primitives/text-effect";

interface GlobalRecommendationsGridProps {
  currentSlug?: string;
  limit?: number;
  title?: string;
  className?: string;
}

function formatPublishedDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ArticleCard({ article }: { article: BlogArticle }) {
  return (
    <Magnetic intensity={0.3} range={120}>
      <Card className="group relative flex h-full min-h-[280px] flex-col overflow-hidden border-zinc-200 bg-white transition-all duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600">
        {/* Featured Star Indicator */}
        {article.featured && (
          <div className="absolute top-3 right-3 z-10">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            </div>
          </div>
        )}

        <Link
          href={`/blog/${article.slug}`}
          className="block h-full p-6 no-underline"
          style={{ textDecoration: "none" }}
          aria-label={`Read ${article.title}`}
        >
          <div className="flex h-full flex-col">
            {/* Header with category and read time */}
            <div className="mb-4 flex items-center justify-between gap-2">
              <Badge variant="outline" className="text-xs">
                {article.category}
              </Badge>
              <AdvancedReadTimeBadge
                readTime={article.readTime}
                variant="outline"
                size="sm"
              />
            </div>

            {/* Article title with subtle animation */}
            <TextEffect
              as="h3"
              preset="fade"
              className="mb-3 line-clamp-2 min-h-[3.5rem] font-semibold text-zinc-950 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400"
              delay={0.1}
              speedSegment={2}
            >
              {article.title}
            </TextEffect>

            {/* Description without text effects for better readability */}
            <p
              className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300"
              style={{ textDecoration: "none" }}
            >
              {article.description}
            </p>

            {/* Publication date */}
            <div className="mt-auto text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {formatPublishedDate(article.publishedDate)}
            </div>
          </div>
        </Link>
      </Card>
    </Magnetic>
  );
}

export function GlobalRecommendationsGrid({
  currentSlug,
  limit = 4,
  title = "More Articles",
  className,
}: GlobalRecommendationsGridProps) {
  const recommendations = React.useMemo(() => {
    const allArticles = getBlogArticles();

    // Filter out current article if provided
    const availableArticles = currentSlug
      ? allArticles.filter((article) => article.slug !== currentSlug)
      : allArticles;

    if (availableArticles.length === 0) {
      return [];
    }

    // Sort by featured status first, then by views, then by date
    const sortedArticles = availableArticles.sort((a, b) => {
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

  // Don't render anything if no recommendations
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-6", className)}>
      <InView
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.8, ease: [0.21, 1.11, 0.81, 0.99] }}
        once
      >
        <TextEffect
          as="h2"
          preset="slide"
          className="text-2xl font-bold text-zinc-950 dark:text-zinc-50"
          delay={0.2}
        >
          {title}
        </TextEffect>
      </InView>

      <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2">
        {recommendations.map((article, index) => (
          <InView
            key={article.slug}
            variants={{
              hidden: { opacity: 0, y: 40, scale: 0.9 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{
              duration: 0.7,
              delay: index * 0.15,
              ease: [0.21, 1.11, 0.81, 0.99],
            }}
            viewOptions={{ margin: "0px 0px -100px 0px" }}
            once
          >
            <div className="h-full">
              <ArticleCard article={article} />
            </div>
          </InView>
        ))}
      </div>
    </div>
  );
}
