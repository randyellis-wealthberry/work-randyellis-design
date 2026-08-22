import { PROJECTS } from "@/lib/data/projects";
import { BLOG_POSTS } from "@/lib/data/static-data";

export type SearchResultType = "page" | "project" | "post";

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  href: string;
  /** Extra words that should match but are not shown (tags, category). */
  keywords: string[];
};

/** Top-level routes. Kept here so the menu and the search agree on them. */
export const SITE_PAGES: ReadonlyArray<{
  title: string;
  href: string;
  description: string;
}> = [
  { title: "Home", href: "/", description: "Randy Ellis — portfolio home" },
  {
    title: "About",
    href: "/about",
    description: "Background, roles, and how I work",
  },
  {
    title: "Services",
    href: "/services",
    description: "Fractional CDO retainer — fixed hours, monthly",
  },
  {
    title: "Projects",
    href: "/projects",
    description: "Case studies and product work",
  },
  {
    title: "Blog",
    href: "/blog",
    description: "Writing on design, AI, and engineering",
  },
];

let cachedIndex: SearchResult[] | null = null;

/**
 * Everything the mobile menu can search: the four site pages, every
 * non-archived project, and every blog post. Built once and reused — the
 * whole index is a few dozen entries, so a lazily memoised in-memory array
 * beats any API round-trip and needs no cache invalidation.
 */
export function buildSearchIndex(): SearchResult[] {
  if (cachedIndex) return cachedIndex;

  const pages: SearchResult[] = SITE_PAGES.map((p) => ({
    id: `page:${p.href}`,
    type: "page",
    title: p.title,
    description: p.description,
    href: p.href,
    keywords: [],
  }));

  const projects: SearchResult[] = PROJECTS.filter((p) => !p.archived).map(
    (p) => ({
      id: `project:${p.slug}`,
      type: "project",
      title: p.name,
      description: p.subtitle || p.description,
      href: `/projects/${p.slug}`,
      keywords: [p.category, ...(p.categories ?? []), ...p.tags],
    }),
  );

  const posts: SearchResult[] = BLOG_POSTS.map((b) => ({
    id: `post:${b.uid}`,
    type: "post",
    title: b.title,
    description: b.description,
    href: b.link,
    keywords: [],
  }));

  cachedIndex = [...pages, ...projects, ...posts];
  return cachedIndex;
}

/** Test seam — the index is memoised for the life of the module. */
export function resetSearchIndexForTests() {
  cachedIndex = null;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^\p{L}\p{N}\s]/gu, " ") // punctuation → space
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Score one entry against a query. Every query token must appear somewhere
 * (title, description, or keywords) — an AND match, so "ai payroll" narrows
 * rather than widens. Title hits outrank description hits, which outrank
 * keyword hits; a title that *starts* with the query ranks highest of all.
 */
function scoreEntry(entry: SearchResult, tokens: string[]): number {
  const title = normalize(entry.title);
  const description = normalize(entry.description);
  const keywords = normalize(entry.keywords.join(" "));

  let score = 0;
  for (const token of tokens) {
    if (title.startsWith(token)) score += 10;
    else if (title.includes(token)) score += 6;
    else if (description.includes(token)) score += 3;
    else if (keywords.includes(token)) score += 2;
    else return 0; // AND semantics — a token that matches nothing kills the entry
  }
  return score;
}

/**
 * Search the site index. Returns up to `limit` results, best first, or an
 * empty array for a blank query.
 */
export function searchSite(query: string, limit = 8): SearchResult[] {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return [];

  return buildSearchIndex()
    .map((entry) => ({ entry, score: scoreEntry(entry, tokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ entry }) => entry);
}
