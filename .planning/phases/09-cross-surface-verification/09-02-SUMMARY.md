---
phase: 09-cross-surface-verification
plan: 02
subsystem: seo-metadata
tags: [seo, routing, json-ld, metadata-helpers]
dependency_graph:
  requires: [09-01-SUMMARY.md]
  provides: [project-route-metadata-convergence, route-wiring-drift-guard]
  affects: [app/projects/*/page.tsx, components/seo/*, __tests__/seo/*]
tech_stack:
  added: []
  patterns: [metadata-helper-convergence, structured-data-deduplication]
key_files:
  created:
    - __tests__/seo/project-route-wiring.test.ts
  modified:
    - app/projects/[slug]/page.tsx
    - app/projects/[slug]/project-detail-client.tsx
    - app/projects/addvanced/page.tsx
    - app/projects/echo/page.tsx
    - app/projects/nagarro/page.tsx
    - app/projects/rambis-ui/page.tsx
    - components/ui/breadcrumb-nav.tsx
  deleted:
    - components/seo/project-faq.tsx
decisions:
  - id: D-02-01
    what: Drop FAQPage JSON-LD from [slug] entirely
    why: Fabricated Q&A pairs (not from actual user questions); no other route emitted them
    outcome: components/seo/project-faq.tsx deleted, no FAQ schema remains
  - id: D-02-02
    what: BreadcrumbNav gains optional structuredData prop
    why: "[slug] page.tsx and project-detail-client.tsx both rendered BreadcrumbStructuredData → duplicate Script tags with same id"
    outcome: page.tsx emits full 3-item breadcrumb; component emits shorter 2-item trail with structuredData={false}
  - id: D-02-03
    what: Lookup rambis-ui by slug, not id
    why: Consistent with other 4 routes; id is internal, slug is URL contract
    outcome: All 5 routes use p.slug === "{slug}" pattern
metrics:
  duration_minutes: 12
  tasks_completed: 3
  files_changed: 9
  tests_added: 52
  completed_at: "2026-08-20"
---

# Phase 09 Plan 02: Wire Project Routes to Metadata Helpers Summary

**One-liner:** All 5 case-study routes now derive metadata + JSON-LD from `lib/metadata.ts` helpers; FAQPage schema removed; route-wiring drift test guards convergence.

## What Was Built

Refactored the 5 project route files (`[slug]`, addvanced, echo, nagarro, rambis-ui) to use Plan 01's `projectMetadata`, `projectCreativeWorkProps`, and `projectBreadcrumbItems` helpers instead of hand-typed metadata blocks. Deleted the fabricated FAQPage JSON-LD and its only component (`components/seo/project-faq.tsx`). Added `BreadcrumbStructuredData` to all routes and prevented duplication via an optional prop on `BreadcrumbNav`. Created a 52-test drift guard (`__tests__/seo/project-route-wiring.test.ts`) that fails if any route stops calling the helpers or reintroduces forbidden patterns.

## Tasks Completed

### Task 1: Refactor [slug]/page.tsx to the helper, drop FAQ JSON-LD, add BreadcrumbList once

**Commit:** `9c33fae`

- Replaced `generateMetadata` body after not-found guard with `return projectMetadata(project);`
- Removed `ProjectFAQStructuredData` import and JSX call
- Rendered `<CreativeWorkStructuredData {...projectCreativeWorkProps(project)} />` and `<BreadcrumbStructuredData items={projectBreadcrumbItems(project)} />` before `<ProjectDetailClient>`
- Deleted `components/seo/project-faq.tsx` (only importer was `[slug]`)
- Added `structuredData?: boolean` prop (default `true`) to `BreadcrumbNav`
- Passed `structuredData={false}` to `BreadcrumbNav` in `project-detail-client.tsx`
- Result: `[slug]` emits exactly one BreadcrumbList (3 items: Home › Projects › {name}) and no FAQ schema

**Files:** `app/projects/[slug]/page.tsx`, `app/projects/[slug]/project-detail-client.tsx`, `components/ui/breadcrumb-nav.tsx`, `components/seo/project-faq.tsx` (deleted)

### Task 2: Derive addvanced and echo page metadata + JSON-LD from PROJECTS

**Commit:** `5e4d5ea`

- Replaced hand-typed `export const metadata: Metadata = { ... }` blocks with `projectMetadata(project)`
- Added `const project = PROJECTS.find((p) => p.slug === "addvanced")!;` (and `"echo"`)
- Rendered `<CreativeWorkStructuredData {...projectCreativeWorkProps(project)} />` and `<BreadcrumbStructuredData items={projectBreadcrumbItems(project)} />` before client components
- Preserved `export default function AddvancedPage()` and `EchoDriveCaseStudy()` names
- Preserved Echo's `container mx-auto max-w-6xl px-4 py-16` wrapper div

**Files:** `app/projects/addvanced/page.tsx`, `app/projects/echo/page.tsx`

**Title changes:**
- addvanced: `"Addvanced Career Tracker Case Study"` → `"Addvance | AI-Enhanced Career Intelligence Platform"`
- echo: `"EchoDrive Case Study | Logistics Innovation"` → `"EchoDrive | Streamlining Logistics Through Digital Innovation"`

### Task 3: Derive nagarro and rambis-ui page metadata + JSON-LD, then add the route-wiring drift test

**Commit:** `92d987e`

- Applied same transformation as Task 2 to nagarro and rambis-ui
- Changed rambis-ui lookup from `p.id === "rambis-ui"` to `p.slug === "rambis-ui"`
- Created `__tests__/seo/project-route-wiring.test.ts` (52 tests):
  - Verifies all 5 routes use `projectMetadata(`, `projectCreativeWorkProps(`, `projectBreadcrumbItems(`, `<CreativeWorkStructuredData`, `<BreadcrumbStructuredData`
  - Confirms NO routes contain `ProjectFAQStructuredData`, `project-faq`, `longDescription`, or literal `openGraph:` keys
  - Checks standalone routes export `metadata = projectMetadata(project)` and look up by `p.slug === "{slug}"`
  - Guards Waffle exclusion: uses `createPageMetadata(`, NOT `projectMetadata(`, NO `CreativeWorkStructuredData` or `BreadcrumbStructuredData`
  - Confirms `components/seo/project-faq.tsx` does not exist

**Files:** `app/projects/nagarro/page.tsx`, `app/projects/rambis-ui/page.tsx`, `__tests__/seo/project-route-wiring.test.ts`

**Title changes:**
- nagarro: `"Design @Nagarro | Design Leadership at Scale"` → `"Design Leadership @ Nagarro | Scaling Design Excellence Across 18,000+ Global Teams"`
- rambis-ui: `"Rambis UI Case Study | Modern Design System & Component Library"` → `"Rambis UI | Modern Design System & Component Library"`

## Deviations from Plan

None. Plan executed exactly as written.

## Verification Evidence

- `npx tsc --noEmit`: clean (no errors)
- `npm run lint`: clean (0 warnings/errors)
- `npx jest __tests__/seo`: 248 tests passed (196 from project-metadata.test.ts + 52 from project-route-wiring.test.ts)
- `git diff --quiet HEAD -- app/projects/waffle/`: Waffle untouched (D-13)
- `grep -rn "ProjectFAQStructuredData\|seo/project-faq" app lib components __tests__`: 0 matches
- `test ! -f components/seo/project-faq.tsx`: confirmed deleted
- All 5 routes pass route-wiring drift test assertions

## Known Stubs

None. All routes now derive metadata + JSON-LD from the same PROJECTS data source as their visible content.

## Threat Flags

None. All file modifications were refactors of existing metadata generation (no new network endpoints, auth paths, or trust-boundary changes).

## Route Metadata Title Matrix

For Plan 04 cross-surface audit:

| Route | Old Title | New Title |
|-------|-----------|-----------|
| `[slug]` | `{name} \| {subtitle \|\| category}` (unchanged pattern) | `{name} \| {subtitle \|\| category}` (now via helper) |
| addvanced | `Addvanced Career Tracker Case Study` | `Addvance \| AI-Enhanced Career Intelligence Platform` |
| echo | `EchoDrive Case Study \| Logistics Innovation` | `EchoDrive \| Streamlining Logistics Through Digital Innovation` |
| nagarro | `Design @Nagarro \| Design Leadership at Scale` | `Design Leadership @ Nagarro \| Scaling Design Excellence Across 18,000+ Global Teams` |
| rambis-ui | `Rambis UI Case Study \| Modern Design System & Component Library` | `Rambis UI \| Modern Design System & Component Library` |

**Note:** All old titles contained "Case Study" or organization-specific branding. New titles follow the helper's `{name} | {subtitle}` pattern, which pulls directly from `lib/data/projects.ts`.

## Commits

1. `9c33fae` — feat(09-02): refactor [slug] to use metadata helpers, drop FAQ schema, add single BreadcrumbList
2. `5e4d5ea` — feat(09-02): derive addvanced and echo metadata + JSON-LD from PROJECTS
3. `92d987e` — feat(09-02): derive nagarro and rambis-ui metadata + add route-wiring test

## Self-Check: PASSED

**Created files exist:**
- `__tests__/seo/project-route-wiring.test.ts` ✓

**Deleted files removed:**
- `components/seo/project-faq.tsx` ✓ (confirmed does not exist)

**Commits exist:**
- `9c33fae` ✓
- `5e4d5ea` ✓
- `92d987e` ✓

**Modified files contain expected patterns:**
- All 5 routes call `projectMetadata(project)` ✓
- All 5 routes render `CreativeWorkStructuredData` and `BreadcrumbStructuredData` ✓
- No routes contain `ProjectFAQStructuredData`, `project-faq`, or literal `openGraph:` ✓
- Waffle still uses `createPageMetadata` ✓
- Route-wiring test exists and passes (52 tests) ✓
