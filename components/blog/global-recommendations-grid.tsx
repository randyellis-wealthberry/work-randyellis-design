"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn, slugifyTitle } from "@/lib/utils";
import { getBlogArticles, type BlogArticle } from "@/lib/utils/blog-data";
import { SECTION, SectionLabel } from "@/components/case-study/section-chrome";

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

/** A stable id for `aria-labelledby`, derived from the section's own title. */
/**
 * One article as a row in a hairline list — the Recommendations List grammar
 * (DESIGN.md): "a hairline list of links, not a card grid". What sat here was a
 * shadcn `Card` with `shadow-sm`/`hover:shadow-md`, wrapped in `<Magnetic>` so
 * six cards chased the cursor at once. The Hairline-First Rule says structure
 * is a line before it is a box and a box before it is a shadow, and Buttons →
 * Hover/Focus allows `transition-colors` only — no lift, no shadow, no scale.
 *
 * The term column is 22rem, the signature's width: a headline is a full phrase,
 * not a one-word term, and the description keeps the rest of the measure.
 */
function ArticleRow({ article }: { article: BlogArticle }) {
  return (
    <li className="border-t border-zinc-200 dark:border-zinc-800">
      <Link
        href={`/blog/${article.slug}`}
        className="group grid grid-cols-1 py-5 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none sm:grid-cols-[minmax(0,22rem)_1fr] dark:focus-visible:ring-white"
      >
        <span className="flex flex-col gap-2 sm:pr-8">
          <span className="flex items-start gap-1.5 text-base font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors group-hover:decoration-zinc-900 dark:text-white dark:decoration-zinc-700 dark:group-hover:decoration-zinc-100">
            {article.title}
            <ArrowRight
              aria-hidden="true"
              className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-500"
            />
          </span>
          {/* The Tabular Figures Rule: a reader scanning a list compares read
              times against each other and dates against each other. */}
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <span>{article.category}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{article.readTime} min read</span>
            <span aria-hidden="true">·</span>
            <time className="tabular-nums" dateTime={article.publishedDate}>
              {formatPublishedDate(article.publishedDate)}
            </time>
          </span>
        </span>

        <span className="mt-3 max-w-[62ch] text-base text-zinc-500 sm:mt-0 dark:text-zinc-400">
          {article.description}
        </span>
      </Link>
    </li>
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

  const headingId = `${slugifyTitle(title)}-heading`;

  return (
    <section
      className={cn(SECTION, className)}
      aria-labelledby={headingId}
      data-testid="recommendations-list-container"
    >
      <SectionLabel id={headingId}>{title}</SectionLabel>
      <ul
        className="mt-6 border-b border-zinc-200 dark:border-zinc-800"
        data-testid="recommendations-list"
      >
        {recommendations.map((article) => (
          <ArticleRow key={article.slug} article={article} />
        ))}
      </ul>
    </section>
  );
}
