"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, FileText, FolderKanban, Compass } from "lucide-react";
import { searchSite, type SearchResult } from "@/lib/site-search";
import { cn } from "@/lib/utils";

const TYPE_LABEL: Record<SearchResult["type"], string> = {
  page: "Page",
  project: "Project",
  post: "Article",
};

const TYPE_ICON: Record<SearchResult["type"], typeof Search> = {
  page: Compass,
  project: FolderKanban,
  post: FileText,
};

type MobileMenuSearchProps = {
  /** Called after a result is chosen so the parent can close the menu. */
  onNavigate: (result: SearchResult) => void;
  /** Called with the query and result count whenever results change. */
  onSearch?: (query: string, resultCount: number) => void;
  autoFocus?: boolean;
  className?: string;
};

/**
 * Quick site search for the mobile menu. Runs entirely on the client against
 * an in-memory index of pages, projects and posts — no network, no debounce
 * needed. Arrow keys move through results, Enter opens the highlighted one,
 * Escape clears the query before it closes the menu.
 */
export function MobileMenuSearch({
  onNavigate,
  onSearch,
  autoFocus = false,
  className,
}: MobileMenuSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => searchSite(query, 6), [query]);
  const hasQuery = query.trim().length > 0;

  useEffect(() => {
    setActiveIndex(0);
    onSearch?.(query, results.length);
    // onSearch is an analytics hook; re-firing on identity change is noise.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, results.length]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const choose = (result: SearchResult) => {
    onNavigate(result);
    router.push(result.href);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!hasQuery) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault();
      choose(results[activeIndex]);
    } else if (e.key === "Escape" && hasQuery) {
      // First Escape clears the search; the menu's own handler gets the next.
      e.preventDefault();
      e.stopPropagation();
      setQuery("");
    }
  };

  const activeId =
    hasQuery && results[activeIndex]
      ? `${listId}-opt-${results[activeIndex].id}`
      : undefined;

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-400"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-label="Search the site"
          aria-expanded={hasQuery}
          aria-controls={listId}
          aria-activedescendant={activeId}
          aria-autocomplete="list"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          placeholder="Search projects, articles, pages…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          className="h-14 w-full rounded-2xl border border-zinc-200 bg-white/90 pr-12 pl-12 text-base text-zinc-900 shadow-sm backdrop-blur-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/10 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-white/10 [&::-webkit-search-cancel-button]:hidden"
        />
        {hasQuery && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <div
        id={listId}
        role="listbox"
        aria-label="Search results"
        className={cn(
          "mt-2 overflow-hidden rounded-2xl border border-zinc-200 bg-white/95 shadow-lg backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/95",
          !hasQuery && "hidden",
        )}
      >
        {hasQuery && results.length === 0 && (
          <p
            className="px-4 py-4 text-sm text-zinc-500 dark:text-zinc-400"
            role="status"
          >
            No matches for &ldquo;{query.trim()}&rdquo;.
          </p>
        )}
        {results.map((r, i) => {
          const Icon = TYPE_ICON[r.type];
          const active = i === activeIndex;
          return (
            <Link
              key={r.id}
              id={`${listId}-opt-${r.id}`}
              role="option"
              aria-selected={active}
              href={r.href}
              onClick={(e) => {
                e.preventDefault();
                choose(r);
              }}
              onMouseEnter={() => setActiveIndex(i)}
              className={cn(
                "flex items-start gap-3 px-4 py-3 text-left transition-colors",
                active
                  ? "bg-zinc-100 dark:bg-zinc-800"
                  : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60",
              )}
            >
              <Icon
                className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400"
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {r.title}
                </span>
                <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {r.description}
                </span>
              </span>
              <span className="shrink-0 rounded-full border border-zinc-200 px-2 py-0.5 text-[10px] font-medium tracking-wide text-zinc-500 uppercase dark:border-zinc-700 dark:text-zinc-400">
                {TYPE_LABEL[r.type]}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
