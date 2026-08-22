---
phase: 10-seo-remediation
plan: 06
subsystem: seo
tags: [seo, search-action, projects-filter, tdd, url-filter, json-ld]
dependency_graph:
  requires: [SEO-04]
  provides: [SEO-04]
  affects: [app/projects]
tech_stack:
  added: [filterProjectsByCategory, projects category filter]
  patterns: [tdd, url-driven-filter, suspense, server-components]
key_files:
  created:
    - __tests__/lib/filter-projects-by-category.test.ts
    - __tests__/projects/projects-category-filter.test.tsx
  modified:
    - lib/project-utils.ts
    - app/projects/projects-client.tsx
    - app/projects/page.tsx
decisions:
  - D-13 SearchAction URL filter implementation
  - JsonLd server-rendered breadcrumb migration
metrics:
  duration: ~15 minutes
  tasks_completed: 2
  files_created: 2
  files_modified: 3
  test_count: 31
  commits: 4
  tdd_gates: "RED → GREEN (Task 1 and Task 2)"
completed: 2026-08-21
---

# Phase 10 Plan 06: URL-driven /projects?category= filter + JsonLd breadcrumb migration

**Implemented a truthful SearchAction: the WebSite schema's `/projects?category={search_term_string}` urlTemplate (D-13) now resolves to a working filter that searches across project names, categories, and tags — plus migrated the projects index breadcrumb to server-rendered JsonLd.**

## What Was Built

Before this plan, **no URL-driven filter existed** on `/projects` — the page unconditionally mapped over `PROJECTS` with no `useSearchParams` hook, no filtering logic, and no status line. The WebSite SearchAction in Plan 10-03's `lib/seo/json-ld.ts` advertised `/projects?category={search_term_string}` as a search endpoint, but visiting that URL did nothing. Emitting a SearchAction against a non-functional URL would be fabricated markup (violates CRED-07), so this plan delivered the minimal filter to make D-13 truthful.

### 1. Pure filter helper (Task 1)

**File:** `lib/project-utils.ts` (added `filterProjectsByCategory` function, 41 lines)

- **Signature:** `filterProjectsByCategory<T>(projects: readonly T[], term: string | null | undefined): T[]`
- **Behavior:** Searches across `project.name`, `project.category`, `project.categories[]`, and `project.tags[]`; case-insensitive, trims whitespace; returns all projects when term is empty/null/undefined
- **Generic:** Works with any object having `{ name, category, tags, categories? }` — not coupled to the `Project` type
- **Purpose:** Single-sourced filter logic; no duplication between client component and potential future use cases

**Tests:** `__tests__/lib/filter-projects-by-category.test.ts` (177 lines, 17 tests)
- Empty/null/whitespace term handling (4 tests)
- Category matching (4 tests, including case-insensitivity and trim)
- Tag matching (2 tests)
- Name matching (2 tests)
- No match handling (1 test)
- Type safety and immutability (3 tests)
- Integration with real `PROJECTS` data (1 test)

### 2. URL-driven filter UI (Task 2)

**File:** `app/projects/projects-client.tsx` (126 line diff)

**Changes:**
- Imported `useSearchParams` from `next/navigation` and `filterProjectsByCategory` from `@/lib/project-utils`
- Added filter logic at component start:
  ```typescript
  const searchParams = useSearchParams();
  const categoryTerm = searchParams?.get("category")?.trim() ?? "";
  const visibleProjects = filterProjectsByCategory(PROJECTS, categoryTerm);
  ```
- Optional chaining (`searchParams?.get()`) is **required** — outside the App Router (e.g., Jest), `useSearchParams()` returns `null`
- Replaced `PROJECTS.map(` with `visibleProjects.map(` in the grid
- Added status line after intro paragraph (conditionally rendered when `categoryTerm` is non-empty):
  - `visibleProjects.length > 0`: "Showing N project(s) matching "{term}" · Clear filter"
  - `visibleProjects.length === 0`: "No projects match "{term}". Clear filter"
  - `role="status"` for screen readers
  - Clear filter link → `/projects`
- Comment: "URL-driven filter backing the WebSite SearchAction (/projects?category=…) — Phase 10 D-13; keep the param name in sync with lib/seo/json-ld.ts"

**File:** `app/projects/page.tsx` (migrated breadcrumb to JsonLd, added Suspense)

**Changes:**
- Replaced `BreadcrumbStructuredData` import with:
  - `import { Suspense } from "react"`
  - `import { JsonLd } from "@/components/seo/json-ld"`
  - `import { buildBreadcrumbSchema } from "@/lib/seo/json-ld"`
  - `import { WEBSITE_URL } from "@/lib/constants"`
- Replaced hardcoded `"https://work.randyellis.design"` URLs in `breadcrumbItems` with `WEBSITE_URL` constant
- Replaced `<BreadcrumbStructuredData items={...} />` with `<JsonLd id="breadcrumb-jsonld" data={buildBreadcrumbSchema(breadcrumbItems)} />`
- Wrapped `<ProjectsClient />` in `<Suspense fallback={null}>` — **required by Next 15** for `useSearchParams()` on a statically prerendered route (without it, `next build` fails with "useSearchParams() should be wrapped in a suspense boundary")
- Comment: "Suspense is required by Next 15 for useSearchParams on a statically prerendered route — without it `next build` fails; build is not in the verify gate, so do not remove"

**Tests:** `__tests__/projects/projects-category-filter.test.tsx` (246 lines, 14 tests)
- **Controllable mock pattern:** `let mockSearchParams: URLSearchParams | null = null` at top level, `jest.mock("next/navigation", () => ({ useSearchParams: () => mockSearchParams }))`, then each test suite sets `mockSearchParams` in `beforeEach`
- **Filter behavior tests (8 tests):**
  - With `category=mobile app`: shows only Alpha App (matches "Mobile App" category); shows "Showing 1 project"; shows clear filter link
  - With `category=zzz`: shows no project cards; shows "No projects match"; shows clear filter link
  - With `null` (no router): shows all 3 projects; does not show status line or clear link
- **Source assertions (6 tests):**
  - `page.tsx` contains `<Suspense` wrapping `<ProjectsClient`
  - Imports `Suspense` from `"react"`
  - Uses `buildBreadcrumbSchema(`
  - Imports from `"@/components/seo/json-ld"`
  - Does NOT import `"structured-data"`
  - Does NOT contain hardcoded `"https://work.randyellis.design"` URLs

**Regression:** Existing tests still pass:
- `__tests__/projects/mobile-filter-spacing.test.tsx` (skipped suite, but would pass — no assertions break)
- `__tests__/projects/waffle/waffle-grid-card.test.tsx` (10 passed) — renders `<ProjectsClient />` without a router; `useSearchParams()` returns `null` → filter tolerates it → all projects render

## TDD Evidence

**Task 1 — filterProjectsByCategory helper:**

- **RED commit** (`d36c1ac`): Created `__tests__/lib/filter-projects-by-category.test.ts` with 17 tests; all failed with "filterProjectsByCategory is not a function"
- **GREEN commit** (`e268c93`): Implemented `filterProjectsByCategory` in `lib/project-utils.ts`; all 17 tests pass; lint and TypeScript clean

**Task 2 — URL-driven filter UI:**

- **RED commit** (`ff0f39f`): Created `__tests__/projects/projects-category-filter.test.tsx` with 14 tests; all failed (no filter logic, no Suspense, no JsonLd, hardcoded URLs)
- **GREEN commit** (`b5fe522`): Implemented filter in `projects-client.tsx`, migrated `page.tsx` to Suspense + JsonLd; all 14 tests pass; existing regression tests pass; lint and TypeScript clean

**No REFACTOR commits needed** — code passed lint/tsc on first GREEN iteration for both tasks.

## Verification Results

```bash
npx jest __tests__/lib/filter-projects-by-category.test.ts \
  __tests__/projects/projects-category-filter.test.tsx \
  __tests__/projects/mobile-filter-spacing.test.tsx \
  __tests__/projects/waffle/waffle-grid-card.test.tsx
# Test Suites: 1 skipped, 3 passed, 3 of 4 total
# Tests: 7 skipped, 41 passed, 48 total

npm run lint
# ✔ No ESLint warnings or errors

npx tsc --noEmit
# No TypeScript errors

# Acceptance criteria checks
grep -c "<Suspense" app/projects/page.tsx  # 1
grep -c 'searchParams?.get("category")' app/projects/projects-client.tsx  # 1
grep -c "filterProjectsByCategory(PROJECTS" app/projects/projects-client.tsx  # 1
grep -c "visibleProjects.map(" app/projects/projects-client.tsx  # 1
grep -c "Clear filter" app/projects/projects-client.tsx  # 2 (matches and no-match cases)
grep -c "buildBreadcrumbSchema(" app/projects/page.tsx  # 1
grep -c "structured-data\|https://work.randyellis.design" app/projects/page.tsx  # 0
```

**Param name sync verified:** `category` appears in:
- `lib/seo/json-ld.ts`: `?category={search_term_string}` (WebSite SearchAction urlTemplate)
- `app/projects/projects-client.tsx`: `searchParams?.get("category")`

## Implementation Details

### Why optional chaining is required

`useSearchParams()` returns `null` when called outside the App Router context (e.g., in Jest without a router mock, or in server components). Without optional chaining (`searchParams?.get("category")`), the component would crash with "Cannot read properties of null" in existing test suites (`mobile-filter-spacing`, `waffle-grid-card`) that render `<ProjectsClient />` directly without a router.

The plan's `<interfaces>` section explicitly called this out: "In Jest/jsdom without an App Router context `useSearchParams()` returns `null` → code must use `searchParams?.get("category")`".

### Why Suspense is required

Next.js 15 requires `useSearchParams()` calls in client components to be wrapped in a `<Suspense>` boundary when the route is statically prerendered. Without it, `next build` fails with:

```
Error: useSearchParams() should be wrapped in a suspense boundary at page "/projects".
```

The plan noted that `npm run build` is **not** in the verify gate (per CLAUDE.md, `next.config.js` sets `ignoreBuildErrors` and `ignoreDuringBuilds`), so the Suspense wrapper is mandatory by plan, not discovered by build. The comment in `page.tsx` documents this so it's never removed as "unused".

### SearchAction truthfulness (D-13)

**Before:** Plan 10-03 emitted a WebSite SearchAction with `target: "${WEBSITE_URL}/projects?category={search_term_string}"`, but visiting `/projects?category=mobile app` did nothing — the page unconditionally rendered all 8 projects with no filtering.

**After:** Visiting `/projects?category=mobile app` filters the grid to show only projects whose `category`, `categories[]`, `tags[]`, or `name` contain "mobile app" (case-insensitive); shows "Showing N projects matching 'mobile app' · Clear filter"; clicking Clear filter navigates to `/projects` (no query param).

The SearchAction is now a **truthful, working endpoint** — not fabricated markup.

### Breadcrumb migration

**Before:** `app/projects/page.tsx` rendered `<BreadcrumbStructuredData items={breadcrumbItems} />` (from `components/seo/structured-data.tsx`) with hardcoded `"https://work.randyellis.design"` URLs.

**After:** `page.tsx` renders `<JsonLd id="breadcrumb-jsonld" data={buildBreadcrumbSchema(breadcrumbItems)} />` (from `components/seo/json-ld.tsx`) with `WEBSITE_URL` constant.

`/projects` is now the **second route** (after Plan 10-05's `/projects/[slug]` routes) to no longer import `components/seo/structured-data.tsx`. Plan 10-08 will delete that file once all remaining importers are migrated.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — the filter is fully implemented and tested.

## Threat Surface

No new threat surface beyond what's documented in plan's threat model:
- **T-10-15 (Tampering/reflected XSS)**: Mitigated — `categoryTerm` is rendered as a React text node (auto-escaped by React), not via `dangerouslySetInnerHTML`, and not used in hrefs
- **T-10-16 (Denial of Service)**: Accepted — O(n) filter over a constant 8-element array; term length is bounded by browser URL limits (~2000 chars)
- **T-10-SC (Supply chain)**: Accepted — no packages installed

## Dependencies & Next Steps

**Unblocks:**
- Plan 10-08: Delete `components/seo/structured-data.tsx` after migrating remaining importers (layout.tsx, blog routes)

**SearchAction note:**
Google retired the Sitelinks-searchbox rich result in 2024, so Rich Results Test will not list SearchAction as a rich result — this is expected, not an error. The SearchAction is still semantically correct structured data; it just doesn't produce a visual rich result in Google Search anymore.

**D-13 fulfillment:**
D-13 stated "WebSite schema includes search action using /projects page category filter. Not fabricated — filter functionality exists." This plan delivered:
1. A pure, tested helper (`filterProjectsByCategory`)
2. A working URL filter (`/projects?category=<term>`)
3. Visible UI feedback (status line + clear link)
4. The SearchAction urlTemplate (`/projects?category={search_term_string}`) now points to real functionality

The SearchAction is **not fabricated** — it truthfully advertises a working feature.

## Files Changed

| File | Status | Lines | Purpose |
|------|--------|-------|---------|
| `lib/project-utils.ts` | modified | +41 | Pure filter helper |
| `app/projects/projects-client.tsx` | modified | +50/-24 | Filter logic + status line |
| `app/projects/page.tsx` | modified | +8/-5 | Suspense + JsonLd breadcrumb |
| `__tests__/lib/filter-projects-by-category.test.ts` | created | 177 | Helper contract tests (17 tests) |
| `__tests__/projects/projects-category-filter.test.tsx` | created | 246 | Filter UI tests (14 tests) |

**Total**: 2 files created, 3 files modified, 522 lines added

## Commits

1. `d36c1ac` — `test(10-06): add failing filterProjectsByCategory tests` (Task 1 RED)
2. `e268c93` — `feat(10-06): add filterProjectsByCategory helper` (Task 1 GREEN)
3. `ff0f39f` — `test(10-06): add failing /projects category filter tests` (Task 2 RED)
4. `b5fe522` — `feat(10-06): URL-driven /projects?category= filter behind the WebSite SearchAction; server-render projects breadcrumb` (Task 2 GREEN)

## Self-Check: PASSED

- [x] Created files exist: `__tests__/lib/filter-projects-by-category.test.ts`, `__tests__/projects/projects-category-filter.test.tsx`
- [x] Modified files exist: `lib/project-utils.ts`, `app/projects/projects-client.tsx`, `app/projects/page.tsx`
- [x] Commits exist: `d36c1ac` (Task 1 RED), `e268c93` (Task 1 GREEN), `ff0f39f` (Task 2 RED), `b5fe522` (Task 2 GREEN)
- [x] 31 tests pass (17 in filter helper + 14 in filter UI)
- [x] Existing regression tests pass (mobile-filter-spacing skipped, waffle-grid-card 10 passed)
- [x] Lint passes (0 warnings/errors)
- [x] TypeScript passes (0 errors)
- [x] `filterProjectsByCategory` exported from `lib/project-utils.ts`
- [x] `projects-client.tsx` uses `searchParams?.get("category")` with optional chaining
- [x] `projects-client.tsx` uses `visibleProjects.map(`
- [x] `page.tsx` has `<Suspense` wrapping `<ProjectsClient />`
- [x] `page.tsx` uses `buildBreadcrumbSchema(`
- [x] `page.tsx` does NOT import `structured-data`
- [x] `page.tsx` does NOT contain hardcoded `https://work.randyellis.design` URLs
- [x] Param name `category` is in sync across `lib/seo/json-ld.ts` and `projects-client.tsx`
