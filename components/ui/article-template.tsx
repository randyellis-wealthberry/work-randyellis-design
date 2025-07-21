"use client";
import React, { useMemo } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export type ArticleTemplateProps = {
  title: string;
  subtitle?: string;
  author?: string;
  date: string;
  content: React.ReactNode;
  featuredImage?: string;
  showCopyUrl?: boolean;
  tags?: string[];
  readTimeOverride?: number;
};

const WORDS_PER_MINUTE = 200;

const stripHtml = (html: string): string => {
  if (typeof window !== "undefined") {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }
  // fallback for SSR
  return html.replace(/<[^>]+>/g, "");
};

export const ArticleTemplate: React.FC<ArticleTemplateProps> = ({
  title,
  subtitle,
  author,
  date,
  content,
  featuredImage,
  showCopyUrl,
  tags,
  readTimeOverride,
}) => {
  // Calculate read time
  const readTime = useMemo(() => {
    if (readTimeOverride) return readTimeOverride;
    let text = "";
    if (typeof content === "string") {
      text = stripHtml(content);
    } else if (Array.isArray(content)) {
      text = content
        .map((c) => (typeof c === "string" ? stripHtml(c) : ""))
        .join(" ");
    } else {
      text = "";
    }
    const wordCount = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
  }, [content, readTimeOverride]);

  // Copy URL handler
  const handleCopyUrl = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      {featuredImage && (
        <Image
          src={featuredImage}
          alt="Featured image"
          width={800}
          height={400}
          className="mb-8 w-full rounded-xl object-cover"
        />
      )}
      <header className="mb-6">
        <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-2">
            {subtitle}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          {author && <span>By {author}</span>}
          <span>
            {new Date(date).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span aria-label="Read time">{readTime} min read</span>
          {showCopyUrl && (
            <button
              onClick={handleCopyUrl}
              className="ml-2 rounded px-2 py-1 text-xs font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Copy article URL"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleCopyUrl();
              }}
            >
              Copy URL
            </button>
          )}
        </div>
      </header>
      <section className="prose prose-zinc dark:prose-invert mb-8">
        {content}
      </section>
      {tags && tags.length > 0 && (
        <footer className="mt-8 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
            >
              {tag}
            </Badge>
          ))}
        </footer>
      )}
    </article>
  );
};

export default ArticleTemplate;
