---
phase: 10-seo-remediation
plan: 07
subsystem: seo
tags: [seo, json-ld, article, blog, rsc, tdd, server-components]
dependency_graph:
  requires: [10-03]
  provides: [SEO-04]
  affects: []
tech_stack:
  added: [components/seo/blog-post-json-ld.tsx]
  patterns: [server-rendered-json-ld, mdx-rsc-integration]
key_files:
  created:
    - components/seo/blog-post-json-ld.tsx
    - __tests__/seo/blog-post-json-ld.test.tsx
  modified:
    - app/blog/claude-obsidian-workflows/page.mdx
    - app/blog/create-professional-videos-claude-code-guide/page.mdx
    - app/blog/exploring-the-intersection-of-design-ai-and-design-engineering/page.mdx
    - app/blog/profits-not-pixels/page.mdx
    - app/blog/layout.tsx
decisions:
  - D-10 server-rendered structured data implementation for blog
  - D-15 Article author linking to Person @id (single entity across site)
  - D-08 entity story compliance (Article + BreadcrumbList only)
patterns_established:
  - "MDX blog posts use BlogPostJsonLd RSC component with slug prop (not full URL)"
  - "Blog breadcrumb schema emitted per-post (server), not in client layout"
  - "Article author references site Person @id for entity unification"
requirements_completed: [SEO-04]
metrics:
  duration: ~7 minutes
  tasks_completed: 2
  files_created: 2
  files_modified: 5
  test_count: 39
  commits: 3
  tdd_gates: "RED → GREEN (no REFACTOR needed)"
completed: 2026-08-21
---

# Phase 10 Plan 07: Server-rendered Article + BreadcrumbList on blog posts

**Blog Article schema migrated to server: RSC BlogPostJsonLd emits Article (author → Person @id) + BreadcrumbList on all 4 posts; client blog layout no longer emits breadcrumb schema.**

## Performance

- **Duration:** ~7 minutes
- **Started:** 2026-08-21T14:07:25-06:00
- **Completed:** 2026-08-21T14:14:22-06:00
- **Tasks:** 2
- **Files modified:** 7 (2 created, 5 modified)

## Accomplishments

- Created server-rendered `<BlogPostJsonLd>` RSC component emitting Article + BreadcrumbList schemas
- Migrated all 4 MDX blog posts from client `ArticleStructuredData` to server `BlogPostJsonLd`
- Removed client breadcrumb schema generation from `app/blog/layout.tsx`
- Article author now links to site Person @id (D-15) — Google sees one author entity across all surfaces
- 39 passing tests (11 component behavior + 28 source assertions for MDX migration + layout cleanup)

## Task Commits

Each task was committed atomically following TDD protocol:

1. **Task 1: BlogPostJsonLd RSC component (RED → GREEN)**
   - `61bbd3f` (test) — RED: Failing tests for BlogPostJsonLd behavior + source assertions
   - `989a959` (feat) — GREEN: Implemented server component using builders from Plan 10-03

2. **Task 2: Swap MDX posts & strip blog layout**
   - `515880f` (feat) — Updated 4 MDX posts + blog layout + extended test source assertions

## Files Created/Modified

**Created:**
- `components/seo/blog-post-json-ld.tsx` — Server-rendered Article + BreadcrumbList for MDX blog posts (51 lines)
- `__tests__/seo/blog-post-json-ld.test.tsx` — Render + source assertions (168 lines → 243 lines after Task 2 extensions)

**Modified:**
- `app/blog/claude-obsidian-workflows/page.mdx` — Swapped to BlogPostJsonLd, added slug="claude-obsidian-workflows"
- `app/blog/create-professional-videos-claude-code-guide/page.mdx` — Swapped to BlogPostJsonLd, added slug="create-professional-videos-claude-code-guide"
- `app/blog/exploring-the-intersection-of-design-ai-and-design-engineering/page.mdx` — Swapped to BlogPostJsonLd, added slug="exploring-the-intersection-of-design-ai-and-design-engineering"
- `app/blog/profits-not-pixels/page.mdx` — Swapped to BlogPostJsonLd, added slug="profits-not-pixels"
- `app/blog/layout.tsx` — Removed BreadcrumbStructuredData import, origin state, useEffect, schemaItems variable, and schema render line; kept BreadcrumbNav + visual breadcrumb logic

## Implementation Details

### BlogPostJsonLd Component (D-10, D-15)

Server component (no "use client" directive) that:
- Accepts: title, description, datePublished, slug, dateModified?, imageUrl?, keywords?
- Builds URL from `${WEBSITE_URL}/blog/${slug}` (single source for URL construction)
- Emits two schemas via `<JsonLd>` wrapper:
  1. **Article** — via `buildArticleSchema` with author → Person @id + name (D-15)
  2. **BreadcrumbList** — Home → Blog → Post title (via `buildBreadcrumbSchema`)

### MDX Migration Pattern

All 4 blog posts now follow consistent pattern:
```tsx
import { BlogPostJsonLd } from "@/components/seo/blog-post-json-ld";

<BlogPostJsonLd
  title="..."
  description="..."
  datePublished="YYYY-MM-DD"
  slug="<directory-name>"
  imageUrl="..."  // optional (3 of 4 have it)
  keywords={[...]}
/>
```

**Values preserved verbatim** — no content authoring in this plan (CRED-07):
- `claude-obsidian-workflows`: datePublished "2025-01-15", imageUrl hero.png
- `create-professional-videos-claude-code-guide`: datePublished "2024-12-15", imageUrl hero.jpg
- `exploring-the-intersection-of-design-ai-and-design-engineering`: datePublished "2024-01-15", imageUrl cosmos.so CDN
- `profits-not-pixels`: datePublished "2025-07-21", no imageUrl

### Blog Layout Cleanup (D-10)

Removed all client-side breadcrumb schema logic:
- Deleted `BreadcrumbStructuredData` import
- Deleted `origin` state + `useEffect` for `window.location.origin`
- Deleted `schemaItems` variable + conditional render
- Deleted `blogSlug` and `postTitle` variables (unused after schema removal)
- **Kept** `BreadcrumbNav` import/usage + `generateBlogBreadcrumbs()` helper (visual breadcrumbs unchanged)

Result: blog layout emits NO schema — all structured data now server-rendered per-post.

## Verification Results

```bash
npx jest __tests__/seo/blog-post-json-ld.test.tsx
# Test Suites: 1 passed
# Tests: 39 passed (11 component + 24 MDX migration + 4 layout cleanup)

grep -rc "ArticleStructuredData|structured-data" app/blog
# All 0 — no legacy imports remain

grep -c "<BlogPostJsonLd" app/blog/*/page.mdx
# All 4 files have exactly 1

npm run lint
# ✔ No ESLint warnings or errors

npx tsc --noEmit
# No TypeScript errors
```

## Decisions Made

None — followed plan as specified.

## Deviations from Plan

None — plan executed exactly as written.

## Observations (Not Regressions)

Logged per plan's interface notes — pre-existing inconsistencies, not introduced by this plan:

1. **profits-not-pixels headline vs metadata.title mismatch:**
   - Article schema headline: "PROFITS, NOT PIXELS: The story of world's most expensive (yet, valuable?) cup of coffee"
   - MDX `metadata.title`: "Profits, Not Pixels: Why Business Impact Matters"
   - Both preserved verbatim (no content authoring this phase)

2. **MDX metadata.date vs lib/utils/blog-data.ts date mismatches:**
   - Same discrepancy logged in Plan 10-04
   - Not fixed here (out of scope for SEO remediation)

## Known Stubs

None — all blog posts now emit fully-wired Article + BreadcrumbList schemas with real values.

## Threat Surface

No new threat surface — mitigations inherited from Plan 10-03:
- **T-10-17 (script breakout):** Mitigated via `serializeJsonLd` escaping in JsonLd component
- **T-10-18 (repudiation):** Accepted — dates copied verbatim from existing MDX; author = site Person @id

## Dependencies & Next Steps

**Unblocks:**
- Blog structured data fully migrated to server
- Plan 10-08 can delete `ArticleStructuredData` and `BreadcrumbStructuredData` exports from `components/seo/structured-data.tsx` (blog was the last consumer)

**Entity story compliance:**
- D-08: Blog emits Article + BreadcrumbList only (no Organization, LocalBusiness, etc.)
- D-15: Article author references Person @id — Google can unify Randy Ellis entity across blog + projects + homepage

## Commits

1. `61bbd3f` — `test(10-07): add failing BlogPostJsonLd tests`
2. `989a959` — `feat(10-07): add BlogPostJsonLd server component`
3. `515880f` — `feat(10-07): server-render Article + BreadcrumbList on blog posts; drop client breadcrumb schema from blog layout`

## Self-Check: PASSED

- [x] Created files exist: `components/seo/blog-post-json-ld.tsx`, `__tests__/seo/blog-post-json-ld.test.tsx`
- [x] Modified files exist: 4 MDX posts + blog layout
- [x] Commits exist: `61bbd3f` (RED), `989a959` (GREEN), `515880f` (Task 2)
- [x] 39 tests pass in `__tests__/seo/blog-post-json-ld.test.tsx`
- [x] Grep: 0 ArticleStructuredData/structured-data imports in app/blog
- [x] Grep: 4 MDX files each have exactly 1 `<BlogPostJsonLd`
- [x] Grep: profits-not-pixels has `datePublished="2025-07-21"` preserved
- [x] Grep: exploring-the-intersection has cosmos.so URL preserved
- [x] Lint passes (0 warnings/errors)
- [x] TypeScript passes (0 errors)
- [x] Component is server-rendered (no "use client", no next/script, imports buildArticleSchema + buildBreadcrumbSchema)
