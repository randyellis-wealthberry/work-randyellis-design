---
phase: 10-seo-remediation
plan: 05
subsystem: seo
tags: [seo, json-ld, rsc, server-components, migration]
dependency_graph:
  requires: [10-01, 10-03]
  provides: [SEO-04]
  affects: []
tech_stack:
  added: []
  patterns: [server-rendered-json-ld, migration, test-driven-drift-detection]
key_files:
  created: []
  modified:
    - app/layout.tsx
    - app/projects/[slug]/page.tsx
    - app/projects/addvanced/page.tsx
    - app/projects/echo/page.tsx
    - app/projects/nagarro/page.tsx
    - app/projects/rambis-ui/page.tsx
    - app/about/page.tsx
    - app/metis/page.tsx
    - components/ui/breadcrumb-nav.tsx
    - app/projects/[slug]/project-detail-client.tsx
    - __tests__/seo/project-route-wiring.test.ts
decisions:
  - D-08: Emit only four schema types (Person, WebSite, CreativeWork, Article)
  - D-09: No FAQ schemas remain in any route
  - D-10: All JSON-LD server-rendered via RSC JsonLd component
  - Phase 9 D-14: projectMetadata() wiring preserved exactly (not modified)
metrics:
  duration: ~18 minutes
  tasks_completed: 3
  files_modified: 11
  test_count: 58 (drift test)
  commits: 3
  tdd_gates: n/a
completed: 2026-08-21
---

# Phase 10 Plan 05: Wire server-rendered JSON-LD into layout + all 7 case-study routes + about/metis

**Migrated 10 pages from client-rendered JSON-LD (next/script) to server-rendered JSON-LD (RSC `<JsonLd>`), updated Phase 9's route-wiring drift test in place, and removed the breadcrumb nav's schema emission — completing the server-render migration for Person, WebSite, CreativeWork, and BreadcrumbList schemas.**

## What Was Built

Migrated all routes owned by this plan (layout, 7 case studies, about, metis) to use the server-rendered JSON-LD layer built in Plan 10-03:

### Task 1: Root layout + breadcrumb nav (c35fd77)
- **app/layout.tsx**: Replaced client `PersonStructuredData`/`WebsiteStructuredData` with server-rendered `<JsonLd id="person-jsonld" data={buildPersonSchema()} />` and `<JsonLd id="website-jsonld" data={buildWebSiteSchema()} />`
- **components/ui/breadcrumb-nav.tsx**: Removed `BreadcrumbStructuredData` import, `structuredData` prop, `structuredDataItems` logic, and schema rendering — now a pure visual navigation component with a header comment documenting the change
- **app/projects/[slug]/project-detail-client.tsx**: Removed `structuredData={false}` prop from its `<BreadcrumbNav>` call (the prop no longer exists)

### Task 2: All 7 case-study routes (df99c0d)
Updated all 5 project route files ([slug], addvanced, echo, nagarro, rambis-ui):
- Replaced `CreativeWorkStructuredData {...projectCreativeWorkProps(project)}` with `<JsonLd id="creativework-jsonld" data={buildCreativeWorkSchema(project)} />`
- Replaced `BreadcrumbStructuredData items={projectBreadcrumbItems(project)}` with `<JsonLd id="breadcrumb-jsonld" data={buildBreadcrumbSchema(projectBreadcrumbItems(project))} />`
- Dropped `projectCreativeWorkProps` import (builder calls it internally)
- **Phase 9 metadata wiring preserved**: `generateMetadata`/`export const metadata = projectMetadata(project)` untouched; this plan only changed the JSON-LD emission mechanism

### Task 3: About/metis + drift test (c456244)
- **app/about/page.tsx** and **app/metis/page.tsx**: Replaced hardcoded `https://work.randyellis.design` strings with `WEBSITE_URL` constant; replaced `BreadcrumbStructuredData` with server-rendered `<JsonLd>`
- **__tests__/seo/project-route-wiring.test.ts**: Updated Phase 9's D-14 drift test in place (not duplicated):
  - Changed per-route assertions: `buildCreativeWorkSchema(project)`, `buildBreadcrumbSchema(projectBreadcrumbItems(project))`, `<JsonLd`, no `structured-data` imports
  - Added "Site-level wiring" suite: layout emits Person + WebSite; about/metis emit BreadcrumbList; breadcrumb-nav is schema-free
  - Added "Rendered JSON-LD" suite: actual `renderToStaticMarkup` tests for growit and addvanced routes parsing `<script type="application/ld+json">` blocks and asserting CreativeWork + BreadcrumbList presence, forbidden types absent (Organization, LocalBusiness, ProfessionalService, FAQPage)
  - Test file updated header to reference Phase 10 D-10; 58 tests now pass (was 30 before expansion)

## Implementation Details

### Entity Story Compliance (D-08, D-09)
Every route this plan migrated now emits only the four allowed schema types:
- **Person** (Randy) — layout
- **WebSite** (portfolio) — layout
- **CreativeWork** (case studies) — 7 project routes
- **BreadcrumbList** (navigation) — 7 project routes + about + metis

No Organization, LocalBusiness, ProfessionalService, or FAQPage nodes at any depth. Breadcrumb nav no longer emits any schema; each page server-renders its own BreadcrumbList via `<JsonLd>`.

### Server-Render Migration (D-10)
All JSON-LD is now in the initial HTML (`<script type="application/ld+json">` tags rendered by RSC), not injected via next/script on the client. Google indexes server-rendered JSON-LD more reliably, especially with the robots.txt `/_next/` fix (Plan 10-02).

### Phase 9 Metadata Wiring Preserved (D-14)
No changes to `generateMetadata`, `export const metadata`, `projectMetadata()` calls, or `const project = PROJECTS.find(...)` lines. This plan built on Phase 9's single-source metadata and only swapped the JSON-LD emission mechanism from client to server.

### Drift Test Update Strategy
The test file was updated **in place** (not duplicated) to guard the new server-rendered wiring while preserving its Phase 9 role (metadata derives from `projectMetadata`/`projectBreadcrumbItems`, not hand-typed). The rendered JSON-LD suite uses `renderToStaticMarkup` on real page exports (growit via [slug], addvanced standalone) with client components mocked, parsing actual `<script>` tags to verify schema presence and forbidden-type absence.

## Deviations from Plan

None — plan executed exactly as written. All 10 files migrated, drift test updated in place, lint/tsc/test green.

## Files Remaining with structured-data Imports

Per plan expectations, the following files still import from `@/components/seo/structured-data` and are owned by parallel plans in Wave 2:
- **Plan 10-06** (projects listing): `app/projects/page.tsx`
- **Plan 10-07** (blog posts): `app/blog/layout.tsx`, `app/blog/*/page.mdx` (4 files)

Plan 10-08 will delete `components/seo/structured-data.tsx` after all importers migrate in Wave 3.

## Verification

### Automated Checks (all passed)
- `npm run lint` — no ESLint warnings or errors
- `npx tsc --noEmit` — no TypeScript errors
- `npx jest __tests__/seo/project-route-wiring.test.ts` — 58 tests pass (30 source assertions, 28 new wiring/render checks)
- `npx jest __tests__/seo/project-metadata.test.ts` — 196 tests pass (Phase 9 metadata tests unaffected)
- `npx jest __tests__/seo/` — all 432 SEO tests pass

### Manual Verification
- Layout emits Person + WebSite: `grep -c "buildPersonSchema()" app/layout.tsx` → 1; `grep -c "buildWebSiteSchema()" app/layout.tsx` → 1
- No old client imports in layout: `grep -c "PersonStructuredData\|WebsiteStructuredData\|components/seo/structured-data" app/layout.tsx` → 0
- All 5 project routes emit CreativeWork + BreadcrumbList: for each file, `buildCreativeWorkSchema(project)` present, `buildBreadcrumbSchema(projectBreadcrumbItems(project))` present, no `structured-data` imports
- About/metis use WEBSITE_URL: `grep -c "https://work.randyellis.design" app/about/page.tsx app/metis/page.tsx` → 0
- Breadcrumb nav is schema-free: `grep -c "BreadcrumbStructuredData\|application/ld+json\|structuredData" components/ui/breadcrumb-nav.tsx` → 0
- structuredData prop removed site-wide: `grep -rc "structuredData=" app components` → 0

## Success Criteria

- [x] ROADMAP Phase 10 SC3 (server-rendered Person/WebSite/CreativeWork, FAQ absent) holds for layout + all 7 project routes + about/metis
- [x] D-08, D-09, D-10 implemented and cited throughout
- [x] Phase 9 09-02 metadata wiring preserved (no changes to `projectMetadata`, `generateMetadata`, or `export const metadata` calls)
- [x] Phase 9's drift test kept meaningful and extended to guard server-rendered JSON-LD wiring (updated in place, not duplicated)
- [x] All structured-data imports remaining are in files owned by parallel plans (10-06, 10-07)
- [x] Gate green: lint → tsc → test (all SEO tests pass; full suite has known baseline failures per CLAUDE.md)

## Commits

| Hash    | Type | Message                                                                                      |
|---------|------|----------------------------------------------------------------------------------------------|
| c35fd77 | feat | server-render Person + WebSite JSON-LD in root layout; breadcrumb nav visual-only           |
| df99c0d | feat | server-render CreativeWork + BreadcrumbList on all 7 case-study routes via JsonLd           |
| c456244 | test | update route-wiring drift test for server-rendered JSON-LD; migrate about/metis breadcrumbs |
