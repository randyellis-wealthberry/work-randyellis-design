"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export type RecentPage = { href: string; title: string };

const STORAGE_KEY = "re:recent-pages";
const MAX_RECENT = 3;

function readStored(): RecentPage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter(
          (p): p is RecentPage =>
            typeof p === "object" &&
            p !== null &&
            typeof (p as RecentPage).href === "string" &&
            typeof (p as RecentPage).title === "string",
        )
      : [];
  } catch {
    return [];
  }
}

/**
 * Derive a human title for a route without needing page metadata on the
 * client: "/projects/growit" → "GrowIt" if it is a known project, else the
 * last path segment title-cased.
 */
function titleFor(pathname: string, lookup: (href: string) => string | null) {
  const known = lookup(pathname);
  if (known) return known;
  const seg = pathname.split("/").filter(Boolean).pop() ?? "Home";
  return seg
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Records the pages a visitor has been to (localStorage, this device only,
 * capped at three) and returns the ones that are not the current page.
 *
 * `lookup` lets the caller resolve a route to a nicer title using data it
 * already has (the search index) without this hook importing it.
 */
export function useRecentPages(
  lookup: (href: string) => string | null,
): RecentPage[] {
  const pathname = usePathname();
  const [recent, setRecent] = useState<RecentPage[]>([]);

  useEffect(() => {
    if (!pathname) return;
    const current: RecentPage = {
      href: pathname,
      title: titleFor(pathname, lookup),
    };
    const next = [
      current,
      ...readStored().filter((p) => p.href !== pathname),
    ].slice(0, MAX_RECENT + 1);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable (private mode, quota) — recents are a nicety */
    }
    setRecent(next.filter((p) => p.href !== pathname).slice(0, MAX_RECENT));
  }, [pathname, lookup]);

  return recent;
}
