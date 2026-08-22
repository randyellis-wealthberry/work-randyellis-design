---
phase: 10-seo-remediation
plan: 03
subsystem: seo
tags: [seo, json-ld, structured-data, schema-org, tdd, server-components]
dependency_graph:
  requires: [CRED-09]
  provides: [SEO-04]
  affects: []
tech_stack:
  added: [lib/seo/json-ld.ts, components/seo/json-ld.tsx]
  patterns: [tdd, rsc, json-ld, single-source-of-truth]
key_files:
  created:
    - lib/seo/json-ld.ts
    - components/seo/json-ld.tsx
    - __tests__/seo/json-ld.test.tsx
  modified: []
decisions:
  - D-08 entity story implementation (Person + WebSite + CreativeWork + Article only)
  - D-11 no Chameleon Collective references in Person schema
  - D-12 dual jobTitle array implementation
  - D-13 SearchAction template (filter to be delivered in 10-06)
  - D-14 teamSize/role as extension keys
  - D-15 Article author linking to Person @id
metrics:
  duration: ~10 minutes
  tasks_completed: 1
  files_created: 3
  test_count: 155
  commits: 2
  tdd_gates: "RED → GREEN (no REFACTOR needed)"
completed: 2026-08-21
---

# Phase 10 Plan 03: Server-safe JSON-LD builders + RSC JsonLd component

**Built the server-safe JSON-LD layer: pure schema builders for Person, WebSite (with SearchAction), CreativeWork, Article, BreadcrumbList, a `<`-escaping serializer, and an RSC `<JsonLd>` component — all contract-tested first.**

## What Was Built

Created three new files implementing the JSON-LD structured data layer that every RSC page will render:

1. **lib/seo/json-ld.ts** (245 lines)
   - Five pure builder functions: `buildPersonSchema`, `buildWebSiteSchema`, `buildCreativeWorkSchema`, `buildArticleSchema`, `buildBreadcrumbSchema`
   - `serializeJsonLd` function that escapes `<` and `>` to prevent script breakout
   - `PERSON_ID` and `WEBSITE_ID` constants
   - `JsonLdObject` type export

2. **components/seo/json-ld.tsx**
   - RSC component that renders `<script type="application/ld+json">` tags
   - No "use client" directive (server-rendered)
   - No next/script import (uses plain HTML script tag)
   - Uses `dangerouslySetInnerHTML` with sanitized output from `serializeJsonLd`

3. **__tests__/seo/json-ld.test.tsx** (502 lines)
   - 155 contract tests across all builders
   - Tests all 8 PROJECTS entries for CreativeWork schema
   - Validates D-08, D-11, D-12, D-13, D-14, D-15 requirements
   - File existence checks for Person.image
   - Source code assertions (no "use client", no next/script)

## Implementation Details

### Entity Story (D-08)
Schema emits exactly four entity types:
- **Person** — Randy Ellis (primary entity)
- **WebSite** — Portfolio site with SearchAction
- **CreativeWork** — Project case studies
- **Article** — Blog posts

No Organization, LocalBusiness, ProfessionalService, or FAQPage nodes at any depth. Clean verifiable entity story matching Phase 9's single-sourced metadata.

### Person Schema (D-11, D-12)
- **jobTitle**: `["Head of Product", "Fractional Chief Design Officer"]` (D-12 dual positioning)
- **description**: Single-sourced from `createBaseMetadata().description` (Phase 9 reconciled claims)
- **sameAs**: Uses `https://x.com/iamrandyellis` (NOT twitter.com)
- **knowsAbout**: 21 items, excludes "Chameleon Collective Partnership" and "Go Fractional Design Leadership" (D-11 — sameAs must identify the same entity, not partners)
- **award**: 4 verbatim strings from existing structured-data.tsx
- **image**: Points to `public/images/randyellis-official-avatar.png` (file existence verified in tests)
- No Organization nodes: no `worksFor`, `hasOccupation`, `performerIn`, `alumniOf`, or `hasCredential`

### WebSite Schema (D-13)
- **@type**: `WebSite` (correct casing, not `Website`)
- **potentialAction**: SearchAction with template `${WEBSITE_URL}/projects?category={search_term_string}`
- Note: The `/projects?category=` filter will be implemented in Plan 10-06 — this schema is ready for it

### CreativeWork Schema (D-14)
- Single-sourced from `projectCreativeWorkProps()` (Phase 9 D-11 single source)
- **teamSize** and **role**: Emitted when present on project data (deliberate non-standard extension keys for CRED-06 solo-vs-team differentiation)
- **additionalProperty**: Maps `project.metrics` to PropertyValue array
- **dateCreated**: Only present when `projectDateCreated()` returns a value (echo, addvanced have no year in timeline → key absent)
- **image**: ImageObject with url only (no guessed width/height)

### Article Schema (D-15)
- **author**: Links to Person entity with `@id` and includes `url`
- **publisher**: Person entity reference
- **dateModified**: Defaults to `datePublished` when omitted
- **image**: Plain URL string (not ImageObject)
- **keywords**: Comma-joined when provided, absent otherwise

### Security (T-10-09)
`serializeJsonLd` escapes `<` → `\\u003c` and `>` → `\\u003e` to prevent `</script>` breakout when schema text is user/data-derived. Tested with payload `{ a: "</script><b>" }` — round-trips through `JSON.parse` correctly.

## TDD Evidence

**RED commit** (`312b252`):
- Created failing tests (155 tests)
- Stub implementations returned empty objects/null
- All tests failed on assertions

**GREEN commit** (`18875a1`):
- Implemented full builders and JsonLd component
- All 155 tests pass
- Phase 9 regression (196 tests in `project-metadata.test.ts`) still green
- Lint and TypeScript checks pass

**No REFACTOR commit needed** — code passed lint/tsc on first GREEN iteration.

## Verification Results

```bash
npx jest __tests__/seo/json-ld.test.tsx
# Test Suites: 1 passed
# Tests: 155 passed
# Coverage: 5 builders + serializer + component across 8 PROJECTS

npm run lint
# ✔ No ESLint warnings or errors

npx tsc --noEmit
# No TypeScript errors

npx jest __tests__/seo/project-metadata.test.ts
# Test Suites: 1 passed
# Tests: 196 passed (Phase 9 regression clean)
```

### Exports Verification
```bash
grep -c "export function build" lib/seo/json-ld.ts  # 5 (Person, WebSite, CreativeWork, Article, Breadcrumb)
grep -c "export function serializeJsonLd" lib/seo/json-ld.ts  # 1
grep -c "export const PERSON_ID\|export const WEBSITE_ID" lib/seo/json-ld.ts  # 2
grep -c '"@type": "WebSite"' lib/seo/json-ld.ts  # 1
grep -c "x.com/iamrandyellis" lib/seo/json-ld.ts  # 1
grep -c "twitter.com" lib/seo/json-ld.ts  # 0
grep -c "projects?category={search_term_string}" lib/seo/json-ld.ts  # 1
grep -ci "chameleon\|wealthberry" lib/seo/json-ld.ts  # 0
head -1 components/seo/json-ld.tsx | grep -c "use client"  # 0
grep -c "next/script" components/seo/json-ld.tsx lib/seo/json-ld.ts  # 0
```

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all builders are fully implemented and contract-tested.

## Threat Surface

No new threat surface beyond what's documented in plan's threat model:
- **T-10-09**: Mitigated via `serializeJsonLd` escaping
- **T-10-10**: Mitigated via single-source imports from Phase 9 helpers
- **T-10-11**: Accepted (public profile URLs only)

## Dependencies & Next Steps

**Blocks:**
- Plan 10-05: Wire Person + WebSite schemas into `app/layout.tsx`
- Plan 10-06: Wire CreativeWork + Breadcrumb into `app/projects/[slug]/page.tsx` + implement `?category=` filter (D-13 SearchAction target)
- Plan 10-07: Wire Article schema into `app/blog/[slug]/page.tsx`

**After Plan 10-08** (delete `components/seo/structured-data.tsx`):
- The new JSON-LD layer will be the sole structured data implementation site-wide

**D-13 Note:**
The WebSite SearchAction template references `/projects?category={search_term_string}`. Plan 10-06 will implement the URL-addressable category filter in `app/projects/projects-client.tsx` so the SearchAction is real, not fabricated. Google retired the Sitelinks-searchbox rich result in 2024, so Rich Results Test will not list SearchAction as a rich result — this is expected, not an error.

## Files Changed

| File | Status | Lines | Purpose |
|------|--------|-------|---------|
| `lib/seo/json-ld.ts` | created | 245 | Pure builder functions + serializer |
| `components/seo/json-ld.tsx` | created | 21 | RSC JsonLd component |
| `__tests__/seo/json-ld.test.tsx` | created | 502 | Contract tests (155 tests) |

**Total**: 3 files created, 768 lines added

## Commits

1. `312b252` — `test(10-03): add failing JSON-LD builder contract tests`
2. `18875a1` — `feat(10-03): add server-safe JSON-LD builders and RSC JsonLd component`

## Self-Check: PASSED

- [x] Created files exist: `lib/seo/json-ld.ts`, `components/seo/json-ld.tsx`, `__tests__/seo/json-ld.test.tsx`
- [x] Commits exist: `312b252` (RED), `18875a1` (GREEN)
- [x] 155 tests pass in `__tests__/seo/json-ld.test.tsx`
- [x] Phase 9 regression passes (196 tests in `project-metadata.test.ts`)
- [x] Lint passes (0 warnings/errors)
- [x] TypeScript passes (0 errors)
- [x] All 5 builders export correctly
- [x] `serializeJsonLd` and constants export correctly
- [x] Component is server-rendered (no "use client", no next/script)
- [x] All D-08, D-11, D-12, D-13, D-14, D-15 requirements implemented and tested
