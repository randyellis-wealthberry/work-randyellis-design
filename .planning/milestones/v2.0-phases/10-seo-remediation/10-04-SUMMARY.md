---
phase: 10-seo-remediation
plan: 04
subsystem: seo
tags: [sitemap, lastModified, legal-pages, tdd]
dependency_graph:
  requires: []
  provides: [sitemap-lastModified, legal-page-discovery]
  affects: [app/sitemap.ts]
tech_stack:
  added: []
  patterns: [tdd-red-green, build-time-timestamp]
key_files:
  created:
    - __tests__/seo/sitemap.test.ts
  modified:
    - app/sitemap.ts
decisions:
  - what: "Use BUILD_TIME constant for static and project pages"
    why: "Projects lack updatedAt field; build time is the honest freshness signal (D-20, research Open Question 2)"
    alternative: "Per-page timestamps or omit lastModified"
    chosen: "BUILD_TIME constant"
  - what: "Include /privacy-policy and /terms-of-service in sitemap"
    why: "Footer-linked, indexable, public pages (audit T-05 second bullet, research recommendation)"
    alternative: "Exclude legal pages from sitemap"
    chosen: "Include with low priority (0.3), yearly changeFrequency"
metrics:
  duration: "~12 minutes"
  completed_date: "2026-08-21"
  tasks: 1
  commits: 2
  files_modified: 2
---

# Phase 10 Plan 04: Sitemap lastModified + Legal Pages

**One-liner:** Every sitemap entry now carries a valid lastModified timestamp (build-time for static/project pages, publishedDate for blog posts) and the sitemap lists both legal pages.

## Objective

Add `lastModified` to every sitemap entry (build-time for static + project URLs, publication date for blog) and include the two legal pages, proven by a contract test over `sitemap()`.

## What Was Built

### TDD Implementation (RED → GREEN)

**RED commit (03d17ad):** Created failing contract test with 6 test cases
- Test 1: Every entry has valid lastModified Date (FAILED - static/project entries missing)
- Test 2: Static URLs include 7 required pages (FAILED - legal pages missing)
- Test 3: Project entries match PROJECTS with correct priority/changeFrequency (PASSED)
- Test 4: Blog entries have correct publishedDate mapping (PASSED)
- Test 5: All URLs absolute, no localhost, no duplicates (PASSED)
- Test 6: Static/project share build-time instant within 24h (FAILED - no lastModified)

**GREEN commit (11f2379):** Implementation that makes all tests pass
- Added `BUILD_TIME` constant at module scope (build/first-request timestamp)
- Added `lastModified: BUILD_TIME` to 5 existing static pages (/, /projects, /about, /blog, /metis)
- Added 2 new legal page entries (/privacy-policy, /terms-of-service) with `lastModified: BUILD_TIME`, `changeFrequency: "yearly"`, `priority: 0.3`
- Added `lastModified: BUILD_TIME` to all project page entries
- Left blog pages unchanged (already had `lastModified: new Date(post.publishedDate)`)

### Files Modified

**app/sitemap.ts** (+23 lines)
- Added BUILD_TIME constant with explanatory comment about honest freshness signal
- 7 static entries now all have lastModified (5 existing + 2 legal)
- 8 project entries now all have lastModified
- 4 blog entries retain existing publishedDate-based lastModified

**__tests__/seo/sitemap.test.ts** (+114 lines)
- Complete contract test over sitemap() output
- 6 test cases covering all audit requirements

## Deviations from Plan

None - plan executed exactly as written.

## Known Issues & Observations

### Blog Date Mismatch (Not Fixed Here - Outside Audit Scope)

**Issue:** `publishedDate` in `lib/utils/blog-data.ts` differs from `metadata.date` / `metadata.openGraph.publishedTime` declared in blog MDX files.

**Example:** `profits-not-pixels`
- MDX metadata.date: `2025-07-21`
- blog-data.ts publishedDate: `2024-10-30`

**Current behavior:** Sitemap uses blog-data.ts dates (per existing implementation). This mismatch affects:
- Sitemap lastModified values (uses blog-data.ts)
- Blog post metadata (uses MDX frontmatter)

**Recommendation:** Reconcile these dates in a future content-quality phase. The sitemap implementation is correct per the current data source contract.

**Affected posts:** Likely 3 of 4 blog posts (plan context mentioned this pattern).

### Verification

All acceptance criteria met:
- ✓ `npx jest __tests__/seo/sitemap.test.ts` exits 0 with 6 passing tests
- ✓ `grep -c "lastModified" app/sitemap.ts` = 9 (≥ 3)
- ✓ `grep -c "BUILD_TIME" app/sitemap.ts` = 9 (≥ 3)
- ✓ `grep -c "privacy-policy" app/sitemap.ts` = 1
- ✓ `grep -c "terms-of-service" app/sitemap.ts` = 1
- ✓ `npm run lint` exits 0
- ✓ `npx tsc --noEmit` exits 0
- ✓ git log shows RED commit (03d17ad) before GREEN commit (11f2379)

## Technical Details

### BUILD_TIME Pattern

```typescript
// Build-time timestamp for static and project pages.
// This is the honest freshness signal until projects carry content dates (D-20).
// Evaluated once at build or first request in development.
const BUILD_TIME = new Date();
```

- **Evaluation:** Module-scope constant evaluated once at build (production) or first request (dev)
- **Rationale:** Projects lack `updatedAt` field; build time is the only honest content-agnostic date (D-20, research Open Question 2)
- **Alternative considered:** Per-page timestamps or omitting lastModified (rejected - audit T-05 requires freshness signals)

### Sitemap Structure

**19 total entries:**
- 7 static pages (5 core + 2 legal)
- 8 project pages (all featured: true in current data)
- 4 blog pages (publishedDate-based timestamps)

**Priority tiers:**
- 1.0: Homepage
- 0.9: Projects index
- 0.8: About, featured projects
- 0.7: Blog index
- 0.6: Metis, non-featured projects, blog posts
- 0.3: Legal pages

## Test Coverage

**Contract test validates:**
1. Every entry has valid lastModified Date instance
2. All 7 required static URLs present (core + legal)
3. Every PROJECTS entry mapped with correct priority/changeFrequency
4. Every blog article mapped with exact publishedDate timestamp
5. All URLs absolute (WEBSITE_URL), no localhost, no duplicates
6. Static and project entries share identical build-time instant within 24h of test execution

## Requirements Satisfied

- **SEO-05:** Sitemap includes lastModified on all entries (static/project = build time, blog = publishedDate)
- **Audit T-05:** Freshness signals present for all sitemap entries
- **D-20:** lastModified added to sitemap (decision implemented)

## Success Criteria

- ✓ ROADMAP Phase 10 SC4 satisfied at code level (live `<lastmod>` proof in Plan 10-09)
- ✓ D-20 implemented
- ✓ Blog date mismatch logged for Randy (not fixed here - outside audit findings)

## Impact

**SEO:**
- Search engines now receive freshness signals for all pages
- Legal pages now discoverable via sitemap (already footer-linked, now crawler-optimized)

**Maintenance:**
- Contract test prevents regression (lastModified omission)
- Build-time pattern documented for future project metadata expansion

## Self-Check: PASSED

✓ Created files exist:
- `__tests__/seo/sitemap.test.ts` exists

✓ Modified files contain expected changes:
- `app/sitemap.ts` contains BUILD_TIME constant (9 occurrences)
- `app/sitemap.ts` contains lastModified (9 occurrences)
- `app/sitemap.ts` contains privacy-policy entry (1 occurrence)
- `app/sitemap.ts` contains terms-of-service entry (1 occurrence)

✓ Commits exist:
- 03d17ad: test(10-04): add failing sitemap lastModified contract test
- 11f2379: feat(10-04): add lastModified to every sitemap entry and list legal pages

✓ Tests pass:
- All 6 sitemap contract tests passing

✓ Verification gates pass:
- npm run lint: ✓
- npx tsc --noEmit: ✓

## Next Steps

**Immediate (same phase):**
- Plan 10-09 will verify live sitemap.xml includes `<lastmod>` tags (post-deploy verification)

**Future:**
- Reconcile blog-data.ts publishedDate vs MDX metadata.date mismatch (content-quality phase)
- Consider adding `updatedAt` field to Project type when content warrants it (would replace BUILD_TIME for project pages)
