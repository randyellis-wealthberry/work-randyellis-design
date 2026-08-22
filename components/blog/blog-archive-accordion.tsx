"use client";

import * as React from "react";
import { ArrowRight, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/core/accordion";
import { Badge } from "@/components/ui/badge";
import { getBlogArticles, type BlogArticle } from "@/lib/utils/blog-data";

interface BlogArchiveAccordionProps {
  className?: string;
}

function formatPublishedDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ArticleTrigger({ article }: { article: BlogArticle }) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="min-w-0 flex-1">
        {/* Subhead voice: Body at font-medium in Ink. The title rendered
            through TextEffect before, whose hidden state is opacity 0 — The
            Visible At Zero Rule says entrance motion moves, it never hides. */}
        {/* Wraps rather than truncates. At 390 the row is ~330px wide and
            `truncate` clipped every title mid-word — on a Read surface the
            title is the whole basis for choosing what to read. */}
        <h3 className="mb-1 text-base font-medium text-pretty text-zinc-900 dark:text-white">
          {article.title}
        </h3>
        {/* No amber star. The One Family Rule keeps Live Amber for "this
            project is live and you can open it today" and nothing else; a
            second use of it makes it mean nothing. The Tabular Figures Rule
            puts `tabular-nums` on the read time a reader scans down a column. */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="capitalize">{article.category}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{article.readTime} min read</span>
        </div>
      </div>
      <ChevronUp
        aria-hidden="true"
        className="ml-4 h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-500"
      />
    </div>
  );
}

function ArticleContent({ article }: { article: BlogArticle }) {
  return (
    <div className="pb-5 text-zinc-500 dark:text-zinc-400">
      {/* A Terms List (DESIGN.md): hairline above every row, the term sized to
          the term, the value in the remaining space.
          The "Views" row is gone. `lib/utils/blog-data.ts` ships hardcoded
          counts (1,250 / 890 / 675 / 1,120) that no analytics source produced,
          and this rendered them as confirmed figures — PRODUCT.md's first
          principle is credibility through proof, which bans invented numbers.
          Nothing replaces it: an unmeasured number has no honest placeholder. */}
      <dl className="border-b border-zinc-200 text-sm dark:border-zinc-800">
        <div className="grid grid-cols-1 border-t border-zinc-200 py-3 sm:grid-cols-[minmax(0,14rem)_1fr] dark:border-zinc-800">
          <dt className="text-zinc-500 dark:text-zinc-400">Published</dt>
          <dd className="font-medium text-zinc-900 dark:text-white">
            <time className="tabular-nums" dateTime={article.publishedDate}>
              {formatPublishedDate(article.publishedDate)}
            </time>
          </dd>
        </div>
        <div className="grid grid-cols-1 border-t border-zinc-200 py-3 sm:grid-cols-[minmax(0,14rem)_1fr] dark:border-zinc-800">
          <dt className="text-zinc-500 dark:text-zinc-400">Category</dt>
          <dd className="font-medium text-zinc-900 dark:text-white">
            {article.category}
          </dd>
        </div>
        <div className="grid grid-cols-1 border-t border-zinc-200 py-3 sm:grid-cols-[minmax(0,14rem)_1fr] dark:border-zinc-800">
          <dt className="text-zinc-500 dark:text-zinc-400">Read time</dt>
          <dd className="font-medium text-zinc-900 tabular-nums dark:text-white">
            {article.readTime} min
          </dd>
        </div>
        {article.tags.length > 0 && (
          <div className="grid grid-cols-1 border-t border-zinc-200 py-3 sm:grid-cols-[minmax(0,14rem)_1fr] dark:border-zinc-800">
            <dt className="text-zinc-500 dark:text-zinc-400">Tags</dt>
            <dd className="flex flex-wrap gap-1">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </dd>
          </div>
        )}
      </dl>

      <p className="mt-5 max-w-[62ch] text-base text-zinc-500 dark:text-zinc-400">
        {article.description}
      </p>

      {/* Ink with an Edge underline, not blue-600 — a new hue on a text surface
          is a bug report, not a design decision. 44px target via `-my-3 py-3`,
          and a focus ring in Ink (Paper in dark); this link had neither. */}
      <a
        href={`/blog/${article.slug}`}
        className="group mt-2 -mb-3 inline-flex min-h-[44px] items-center gap-1.5 py-3 text-base font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-white dark:decoration-zinc-700 dark:hover:decoration-zinc-100 dark:focus-visible:ring-white"
      >
        Read article
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-500"
        />
      </a>
    </div>
  );
}

export function BlogArchiveAccordion({ className }: BlogArchiveAccordionProps) {
  const articles = getBlogArticles();

  if (articles.length === 0) {
    return (
      <div
        className={cn(
          "py-8 text-center text-zinc-500 dark:text-zinc-400",
          className,
        )}
      >
        No articles found.
      </div>
    );
  }

  return (
    // Hairline rows at the documented weight: Hairline (zinc-200/zinc-800)
    // separates peers. The dark side was zinc-700, which is Edge — the stroke
    // weight for buttons and inputs, one step too strong for a row rule.
    <Accordion
      className={cn(
        "flex w-full flex-col divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800",
        className,
      )}
      transition={{ duration: 0.2 }}
      type="single"
    >
      {articles.map((article) => (
        <AccordionItem key={article.slug} value={article.slug}>
          <AccordionTrigger className="w-full py-5 text-left focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:ring-white">
            <ArticleTrigger article={article} />
          </AccordionTrigger>
          <AccordionContent>
            <ArticleContent article={article} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
