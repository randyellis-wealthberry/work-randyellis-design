"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBlogArticles, type BlogArticle } from "@/lib/utils/blog-data";
import { SECTION, SectionLabel } from "@/components/case-study/section-chrome";
import {
  trackRecommendationArticleClick,
  trackRecommendationCardHover,
} from "@/lib/analytics";
import { throttled } from "@/lib/analytics-guard";
import { HIGH_FREQUENCY_WINDOW_MS } from "@/lib/analytics-events";

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

/** A stable id for `aria-labelledby`, derived from the section's own title. */
function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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
      // Per-card key: hovering one card must not suppress the signal for
      // the others, only repeat re-entries of the same card within the window.
      if (
        !throttled(
          `recommendation_card_hover:article:${article.slug}`,
          HIGH_FREQUENCY_WINDOW_MS,
        )
      ) {
        return;
      }

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

  const headingId = `${slugifyTitle(title)}-heading`;

  return (
    // "More Articles" at the foot of a post is the Recommendations List
    // (DESIGN.md): a hairline list of links, not a card grid. The shadcn `Card`
    // with `shadow-sm`/`hover:shadow-md` that stood here grouped content with a
    // shadow — the Hairline-First Rule reserves shadows for things that
    // genuinely overlay the page — and lifted on hover, which Buttons →
    // Hover/Focus rules out ("transition-colors only").
    <section
      className={cn(SECTION, className)}
      aria-labelledby={headingId}
      data-testid="article-list-container"
    >
      <SectionLabel id={headingId}>{title}</SectionLabel>

      <ul
        className="mt-6 border-b border-zinc-200 dark:border-zinc-800"
        data-testid="article-list"
      >
        {articles.map((article, index) => (
          // No featured star. What sat here was an amber-filled `Star` in an
          // amber chip; The One Family Rule keeps Live Amber for "this project
          // is live and you can open it" and nothing else. Featured articles
          // already sort to the top, which is what the flag is for.
          <li
            key={article.slug}
            className="border-t border-zinc-200 dark:border-zinc-800"
            data-testid="article-row"
          >
            {/* No hero image. What sat here was a random photograph pulled
                from picsum.photos per slug — a placeholder service standing
                in for article art, cropped to 16:9 and unrelated to the
                writing. An article's title and description are its preview. */}
            <Link
              href={`/blog/${article.slug}`}
              className="group grid grid-cols-1 py-5 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none sm:grid-cols-[minmax(0,22rem)_1fr] dark:focus-visible:ring-white"
              aria-label={`Read ${article.title}`}
              onClick={() => handleArticleClick?.(article, index)}
              onMouseEnter={() => handleArticleHover?.(article, index)}
            >
              <span className="flex flex-col gap-2 sm:pr-8">
                <span className="flex items-start gap-1.5 text-base font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors group-hover:decoration-zinc-900 dark:text-white dark:decoration-zinc-700 dark:group-hover:decoration-zinc-100">
                  {article.title}
                  <ArrowRight
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-500"
                  />
                </span>

                {/* The Tabular Figures Rule: read times and dates are numbers a
                    reader compares down the column. */}
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {showCategory && <span>{article.category}</span>}
                  {showCategory && showReadTime && (
                    <span aria-hidden="true">·</span>
                  )}
                  {showReadTime && (
                    <span
                      className="tabular-nums"
                      data-testid="read-time-badge"
                    >
                      {article.readTime} min read
                    </span>
                  )}
                  {(showCategory || showReadTime) && (
                    <span aria-hidden="true">·</span>
                  )}
                  <time
                    className="tabular-nums"
                    dateTime={article.publishedDate}
                  >
                    {formatPublishedDate(article.publishedDate)}
                  </time>
                </span>
              </span>

              {showDescription && article.description && (
                <span className="mt-3 max-w-[62ch] text-base text-zinc-500 sm:mt-0 dark:text-zinc-400">
                  {article.description}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
