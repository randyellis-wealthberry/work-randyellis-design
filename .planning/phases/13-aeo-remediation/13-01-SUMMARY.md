# 13-01 Summary — llms.txt + RSS feed (T-04, T-06)

**Status:** Complete · lint ✅ tsc ✅ tests 10/10 ✅

## What shipped

- `app/llms.txt/route.ts` — static route, llmstxt.org-format Markdown map:
  identity + positioning blockquote, Services, Case Studies (all non-archived
  `PROJECTS`), Writing (all `getBlogArticles()`), Contact (booking + sameAs
  profiles). Generated from data modules so it cannot drift from the site.
- `app/rss.xml/route.ts` — static RSS 2.0 feed, one `<item>` per post
  (permalink guid, RFC-822 pubDate, escaped entities, newest first,
  atom:link self).
- `lib/metadata.ts` — `RSS_ALTERNATE_TYPES` attached to `alternates.types` in
  all four metadata helpers (base/page/article/project), because Next replaces
  rather than merges a page's `alternates` object.
- Tests: `__tests__/seo/llms-txt.test.ts` (5), `__tests__/seo/rss-feed.test.ts` (5).

## Deviations

None. RSS item dates read `getBlogArticles()`, which 13-03 reconciles with the
MDX dates — the feed automatically corrects when 13-03 lands.
