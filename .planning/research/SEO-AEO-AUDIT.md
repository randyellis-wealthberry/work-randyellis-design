# SEO/AEO Audit — 2026-08-29

Full codebase + live-site audit of search-engine and answer-engine readiness.
Scopes Phase 13 (AEO Remediation). Live HTML verified against
https://work.randyellis.design on 2026-08-29.

## Scorecard

| Area | Grade |
|---|---|
| Crawlability & indexing | A− |
| Metadata & canonicals | B+ |
| Structured data | B |
| Content depth / E-E-A-T | A− |
| Server renderability | B− |
| AEO readiness | C+ |
| Blog & freshness | D+ |

## Verified strengths (do not regress)

- `app/robots.ts` explicitly allows 15 named AI crawlers with correctly-repeated
  disallows (D-21). Sitemap + host declared.
- Single honest entity model (D-08): `Person#person` anchors `WebSite`,
  `Article`, `CreativeWork`, `Service`. No fake reviews/ratings; pinned by
  `__tests__/seo/no-legacy-schema.test.ts`.
- Every content route has title/description/canonical; `metadataBase` set;
  previews and `/admin`+`/api` noindexed via middleware `X-Robots-Tag`.
- ~13.4k words of case-study prose, all server-rendered; project pages serve
  13–16k chars of visible text. One meaningful `<h1>` per page. Motion never
  starts at `opacity: 0` ("Visible At Zero").
- E-E-A-T: verifiable certifications (Coursera URLs), 4 named awards with
  issuer, 2 sourced testimonials, qualified career-total metrics, LedgerIQ
  composite disclosure, `sameAs` (LinkedIn/GitHub/X).
- All 22 `sr-only` uses are legitimate a11y text — no cloaking.

## Findings (T-numbers referenced by Phase 13 plans)

### High

- **T-01 Accordions unmount collapsed content.**
  `components/core/accordion.tsx:127-129` renders children inside
  `<AnimatePresence>{isExpanded && …}` — collapsed items are absent from server
  HTML. Consequences: homepage FAQ answers (~600 words, `app/page.tsx:312`)
  ship as questions only; `/blog` archive
  (`components/blog/blog-archive-accordion.tsx:108`) ships zero crawlable
  post links (rescued only by the 6-item GlobalRecommendationsGrid);
  `app/projects/rambis-ui/rambis-client.tsx:101-115` (Radix, no `forceMount`)
  same pattern.
- **T-02 No FAQPage schema** despite visible Q&A ("Questions founders ask",
  `app/page.tsx:62-85`). Deliberately dropped in D-08 while answers were
  unmounted anyway; once T-01 lands the schema is valid and valuable. Stale
  comment at `app/page.tsx:59-61` still claims the schema exists.
- **T-03 Blog dates disagree across three sources.**
  `lib/utils/blog-data.ts` ("Mock blog articles data", drives sitemap
  lastModified + visible archive dates) vs MDX `metadata` (OG publishedTime)
  vs `<BlogPostJsonLd datePublished>` — 3 of 4 posts disagree;
  `profits-not-pixels` is 2025-07-21 in schema/byline but 2024-10-30 in
  sitemap/archive; `create-professional-videos` disagrees with itself
  (2024-12-20 vs 2024-12-15).
- **T-04 No llms.txt** — zero references repo-wide. AI crawlers welcomed by
  robots.ts but given no map.
- **T-05 Blog stale/thin** — 4 posts, newest 2025-07-21 (~13 months), two
  under 800 words. Content work; cannot be closed by code (→ backlog note).

### Medium

- **T-06 No RSS/Atom feed** and no `<link rel="alternate">` in layout.
- **T-07 Blog OG incomplete.** All 4 MDX posts hand-write metadata; none sets
  per-post OG title/url/images; `exploring-the-intersection…` has no
  `openGraph` block at all (emits `og:type=website`, no dates). The
  purpose-built `createArticleMetadata()` (`lib/metadata.ts:127`) is dead code.
- **T-08 No contact surface.** `hello@randyellis.design` appears only in
  privacy/terms; Person schema has no email/ContactPoint;
  `public/randy-ellis-resume.pdf` (363 KB) linked from nowhere.
- **T-09 Homepage is `"use client"`** (`app/page.tsx:1`) — cannot export its
  own `metadata`; rides on root-layout defaults. Violates the repo's own
  page.tsx → *-client.tsx convention.
- **T-10 Project metadata inconsistencies.** `/projects/waffle` uses
  `createPageMetadata` not `projectMetadata` and is the only project page with
  no `CreativeWork` JSON-LD. `projectMetadata` can emit `openGraph.images: []`
  (`lib/metadata.ts:257`), which suppresses the file-convention OG fallback;
  the `skills` project resolves an `.svg` OG image most scrapers reject.
- **T-11 Thin server-rendered pages.** `/services` ~2.7k chars visible text,
  `/metis` ~1.6k with `<h1>` "METIS:LAYER" carrying no query intent. Copy
  decisions — noted, not auto-fixed.

### Low

- **T-12 Freshness signals weak.** 18/22 sitemap URLs report `BUILD_TIME` as
  lastModified; Article `dateModified` always equals `datePublished`.
- **T-13 `WebSite.potentialAction`** advertises `/projects?category={…}` — a
  client-side filter, not site search; the sitelinks-searchbox feature is
  deprecated. Drop it.
- **T-14 Dead code / stale docs.** `components/seo/related-content.tsx`
  (262 lines, import commented out at `app/blog/layout.tsx:4` — dead, resolves
  the STATE.md "disputed" blocker), `getMetadataBase()` (no callers),
  `SEO_IMPLEMENTATION.md` + `SEO_OPTIMIZATION_REPORT.md` (describe deleted
  code), `__tests__/seo/sitemap.test.ts:21` asserts 7 static pages while 9
  ship.
- **T-15 `/projects/skills` vs `/skills`** — two indexable URLs for adjacent
  content. Positioning decision; noted.
- **T-16 404 page canonicals to `/`** (inherits root `alternates`).
- **T-17 Cache-header conflict** — middleware 60s vs vercel.json 86400s on
  `/projects/*` HTML. Risky to touch blind; noted.
- **T-18 `/services` ships a ~250-word internal design memo** as an HTML
  comment (`app/services/page.tsx:31-55`) — intentional per its own comment;
  left alone.

## Out of scope for Phase 13

- T-05 (blog cadence) and T-11 (services/metis copy) — content/positioning.
- T-15, T-17 — need a decision/measurement first.
- A visible contact page — positioning decision (backlog).
