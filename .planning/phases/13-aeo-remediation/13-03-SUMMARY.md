# 13-03 Summary — blog date unification + article metadata (T-03, T-07)

**Status:** Complete · lint ✅ tsc ✅ SEO suites 560/560 ✅

## What shipped

- `lib/utils/blog-data.ts` — three divergent `publishedDate`s corrected to the
  MDX byline/JSON-LD dates (the author-written ones, per roadmap constraint):
  create-professional-videos 2024-12-20 → **2024-12-15**, exploring… 2024-11-15
  → **2024-01-15**, profits-not-pixels 2024-10-30 → **2025-07-21**. The "Mock
  blog articles data" comment now states the file's real role and that dates
  are test-pinned to the MDX.
- All four `page.mdx` files build metadata via `createArticleMetadata()` (was
  dead code): per-post OG title/description/url/publishedTime/image + twitter
  card. The post with no OG block at all (exploring…) now emits
  `og:type=article` with dates. Junk top-level keys (`date`/`author`/`tags`/
  `slug`) that Next silently dropped are gone.
- `__tests__/seo/blog-date-consistency.test.ts` (9 tests) — pins
  listing-array date === MDX `publishedTime` === JSON-LD `datePublished` ===
  byline `date`, and the createArticleMetadata adoption, for every post
  directory (a fifth post is automatically covered).
- Sitemap + RSS pick the corrected dates up automatically (both read
  `getBlogArticles()`).

## Deviations / corrections

- `__tests__/seo/award-count-consistency.test.ts` allow-list gained
  `app/llms.txt/route.ts` (states no count) — a 13-01 follow-up: the llms.txt
  route's "certifications, awards, and design philosophy" link description
  tripped the surface sweep.
- Baseline correction to 13-02-SUMMARY: award-count-consistency was NOT a
  pre-existing failure — it was 13-01's regression (now fixed). Verified on a
  clean `main` worktree: the genuinely pre-existing failures are the 5
  `analytics-*` suites and `motion-reduced` only.
