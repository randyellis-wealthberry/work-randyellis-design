"use client";

import * as React from "react";
import { ChevronUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/core/accordion";
import { AdvancedReadTimeBadge } from "@/components/ui/advanced-read-time-badge";
import { Badge } from "@/components/ui/badge";
import { getBlogArticles, type BlogArticle } from "@/lib/utils/blog-data";
import { InView } from "@/components/motion-primitives/in-view";
import { TextEffect } from "@/components/motion-primitives/text-effect";

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
        <div className="mb-1 flex items-center gap-3">
          <TextEffect
            as="h3"
            preset="fade-in-blur"
            className="truncate font-medium text-zinc-950 dark:text-zinc-50"
            delay={0.1}
            speedSegment={1.2}
          >
            {article.title}
          </TextEffect>
          {article.featured && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
              <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="capitalize">{article.category}</span>
          <span>•</span>
          <span>{article.readTime} min read</span>
        </div>
      </div>
      <ChevronUp className="ml-4 h-4 w-4 shrink-0 text-zinc-950 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-50" />
    </div>
  );
}

function ArticleContent({ article }: { article: BlogArticle }) {
  return (
    <div className="space-y-4 text-zinc-500 dark:text-zinc-400">
      <div className="flex flex-col space-y-2 border-b border-zinc-200 pb-4 dark:border-zinc-700">
        <h4 className="font-semibold text-zinc-950 dark:text-zinc-50">
          Article Details
        </h4>
        <p>
          <span className="font-medium">Published:</span>{" "}
          {formatPublishedDate(article.publishedDate)}
        </p>
        <p>
          <span className="font-medium">Category:</span> {article.category}
        </p>
        <div className="flex items-center gap-2">
          <span className="font-medium">Read Time:</span>
          <AdvancedReadTimeBadge
            readTime={article.readTime}
            variant="outline"
          />
        </div>
        {article.views && (
          <p>
            <span className="font-medium">Views:</span>{" "}
            {article.views.toLocaleString()} views
          </p>
        )}
      </div>

      <div>
        <h4 className="mb-2 font-semibold text-zinc-950 dark:text-zinc-50">
          Description
        </h4>
        <p
          className="mb-3 text-zinc-500 dark:text-zinc-400"
          style={{ textDecoration: "none" }}
        >
          {article.description}
        </p>

        {article.tags.length > 0 && (
          <div className="mb-3">
            <span className="mb-2 block font-medium">Tags:</span>
            <div className="flex flex-wrap gap-1">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <a
          href={`/blog/${article.slug}`}
          className="inline-flex items-center text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Read Article →
        </a>
      </div>
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
    <Accordion
      className={cn(
        "flex w-full flex-col divide-y divide-zinc-200 dark:divide-zinc-700",
        className,
      )}
      transition={{ duration: 0.2 }}
      type="single"
    >
      {articles.map((article, index) => (
        <InView
          key={article.slug}
          variants={{
            hidden: { opacity: 0, y: 50, scale: 0.95 },
            visible: { opacity: 1, y: 0, scale: 1 },
          }}
          transition={{
            duration: 0.6,
            delay: index * 0.1,
            ease: [0.21, 1.11, 0.81, 0.99],
          }}
          viewOptions={{ margin: "0px 0px -200px 0px" }}
          once
        >
          <AccordionItem value={article.slug} className="py-3">
            <AccordionTrigger className="w-full text-left text-zinc-950 dark:text-zinc-50">
              <ArticleTrigger article={article} />
            </AccordionTrigger>
            <AccordionContent>
              <ArticleContent article={article} />
            </AccordionContent>
          </AccordionItem>
        </InView>
      ))}
    </Accordion>
  );
}
