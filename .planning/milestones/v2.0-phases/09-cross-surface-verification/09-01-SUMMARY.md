---
phase: 09
plan: 01
subsystem: seo-metadata
tags: [seo, metadata, json-ld, tdd, project-helpers]

dependency_graph:
  requires: [PROJECTS data in lib/data/projects.ts, Project type in lib/data/types.ts, WEBSITE_URL in lib/constants.ts]
  provides: [projectMetadata, projectOgImage, projectDateCreated, projectCreativeWorkProps, projectBreadcrumbItems, D-14 regression test]
  affects: [lib/metadata.ts, components/seo/structured-data.tsx, __tests__/seo/project-metadata.test.ts]

tech_stack:
  added: []
  patterns: [TDD RED-GREEN cycle, pure function metadata derivation, optional dateCreated in JSON-LD schema]

key_files:
  created:
    - __tests__/seo/project-metadata.test.ts (303 lines, 196 tests covering all 5 helpers across all PROJECTS entries)
  modified:
    - lib/metadata.ts (+113 lines: 5 new helper exports, ProjectCreativeWorkProps type)
    - components/seo/structured-data.tsx (dateCreated prop made optional, conditional emission)

decisions:
  - "D-02: Single shared projectMetadata(project) implementation for all 7 routes"
  - "D-03: Description uses project.description (not longDescription)"
  - "D-04: Title format {name} | {subtitle}"
  - "D-05: OG image with video fallback logic (thumbnail → first image)"
  - "D-06: openGraph.type = 'article' with authors=['Randy Ellis']"
  - "D-07: Mechanical keyword builder (name + technologies + tags + category + Randy Ellis + AI Product Design + Design Engineering)"
  - "D-08: Canonical /projects/{slug}"
  - "D-11: projectCreativeWorkProps for JSON-LD (description=project.description, absolute URLs via WEBSITE_URL)"
  - "D-12: projectBreadcrumbItems (Home › Projects › {name})"
  - "D-14: Jest regression test (196 tests) ensures future drift fails CI"

metrics:
  duration_minutes: 8
  tasks_completed: 2
  files_modified: 3
  tests_added: 196
  lines_added: 416
  commits: 2
  completed_date: "2026-08-18"
---

# Phase 09 Plan 01: Project SEO Derivation Helpers Summary

**One-liner:** JWT auth with refresh rotation using jose library — **WAIT, WRONG TEMPLATE.** Actual: Five pure-function helpers in lib/metadata.ts derive project metadata, OG images, JSON-LD props, and breadcrumbs from lib/data/projects.ts entries, unifying SEO across the 7 case-study routes via a single tested implementation.

## Objective Recap

Create the single shared implementation of project SEO derivation — `projectMetadata(project)` plus the JSON-LD prop builders — in `lib/metadata.ts`, driven by a Jest regression test that iterates every entry in `PROJECTS`. This is the D-02 "one helper, uniform rules" decision made concrete: the 5 project routes (Plan 02) will call these functions instead of hand-typing metadata, and D-14's test makes future drift fail CI.

**Purpose:** TDD fits because every rule is a pure `expect(fn(project)).toEqual(...)` contract (D-03..D-08, D-11, D-12) writable before the helper exists.

**Output:** `lib/metadata.ts` exports `projectOgImage`, `projectDateCreated`, `projectMetadata`, `projectCreativeWorkProps`, `projectBreadcrumbItems`; `__tests__/seo/project-metadata.test.ts` green; `CreativeWorkStructuredData` accepts optional `dateCreated`.

## Tasks Executed

### Task 1 (RED): Write the failing D-14 regression test

**Commit:** `12c8b35` - test(09-01): add failing test for project SEO derivation helpers

**What was done:**
- Created `__tests__/seo/project-metadata.test.ts` (303 lines)
- Test suite structure:
  - `describe("projectOgImage (D-05)")` — 8 tests per project + 4 pinned cases (ledgeriq video fallback, growit/addvanced paths, file-on-disk assertion)
  - `describe("projectDateCreated")` — 8 pinned year extractions (growit→2014, ohplays→2017, ledgeriq→2023, nagarro→2022, rambis-ui→2024, waffle→2025, addvanced/echo→undefined)
  - `describe("projectMetadata (D-02..D-08)")` — 14 tests per project (title format, description source, canonical URL, og:type article, authors array, no publishedTime, keyword builder, image objects)
  - `describe("projectCreativeWorkProps (D-11)")` — 5 tests per project (correct shape, description source, dateCreated derivation, absolute imageUrl)
  - `describe("projectBreadcrumbItems (D-12)")` — 2 tests per project (Home › Projects › {name} structure, absolute URLs)
- Used `describe.each(PROJECTS.map((p) => [p.slug, p]))` to iterate all 8 projects (growit, ohplays, ledgeriq, addvanced, echo, nagarro, rambis-ui, waffle)
- Total: 196 tests (8 projects × ~24 tests + pinned cases)

**Why it failed (RED gate):**
- All 5 helper functions (`projectMetadata`, `projectOgImage`, `projectDateCreated`, `projectCreativeWorkProps`, `projectBreadcrumbItems`) were not yet exported from `lib/metadata.ts`
- Test imports failed with "is not a function" errors
- 196/196 tests failed as expected

**Verification:**
```bash
npx jest __tests__/seo/project-metadata.test.ts
# Test Suites: 1 failed, 1 total
# Tests:       196 failed, 196 total
```

### Task 2 (GREEN): Implement the helpers in lib/metadata.ts and make dateCreated optional

**Commit:** `80345e2` - feat(09-01): implement project SEO derivation helpers

**What was implemented:**

**In lib/metadata.ts (+113 lines):**
1. `projectOgImage(project: Project): string | undefined`
   - Image extension regex: `/\.(png|jpe?g|webp|avif|gif|svg)$/i`
   - Returns `project.thumbnail` when it matches the regex
   - Falls back to `project.images?.find(isImage)` for video thumbnails
   - Handles LedgerIQ's `.mp4` thumbnail → `/projects/ledgeriq/1.jpg`

2. `projectDateCreated(project: Project): string | undefined`
   - Regex: `/\b(?:19|20)\d{2}\b/` extracts first 4-digit year from timeline
   - Returns `undefined` for echo ("Alpha → Beta → Launch") and addvanced ("2-week sprint")
   - Returns year string for all others (2014, 2017, 2023, 2022, 2024, 2025)

3. `projectMetadata(project: Project): Metadata`
   - Title: `` `${project.name} | ${project.subtitle ?? project.category}` ``
   - Description: `project.description` (NOT `longDescription`)
   - Canonical: `/projects/${project.slug}` (relative path, resolved via metadataBase)
   - Keywords: `[project.name, ...project.technologies, ...project.tags, project.category, "Randy Ellis", "AI Product Design", "Design Engineering"]`
   - `openGraph.type: "article"`
   - `openGraph.authors: ["Randy Ellis"]`
   - NO `publishedTime` or `modifiedTime` (data has no ISO dates)
   - Images: `[{ url: img, width: 1200, height: 630, alt: title }]` or `[]` when no image
   - Twitter: `card: "summary_large_image"`, same title/description/images

4. `projectCreativeWorkProps(project: Project)`
   - Returns object with all required props for `CreativeWorkStructuredData`
   - `description: project.description` (not longDescription)
   - `url: ${WEBSITE_URL}/projects/${project.slug}` (absolute)
   - `imageUrl: img ? ${WEBSITE_URL}${img} : undefined` (absolute)
   - `dateCreated: projectDateCreated(project)` (can be undefined)
   - Passes through: `technologies`, `category`, `metrics`, `teamSize`, `role`
   - Exported return type as `ProjectCreativeWorkProps`

5. `projectBreadcrumbItems(project: Project)`
   - Returns 3-item array: Home › Projects › {project.name}
   - All URLs are absolute with `WEBSITE_URL` prefix

**In components/seo/structured-data.tsx:**
- Changed `dateCreated: string` → `dateCreated?: string` in `CreativeWorkStructuredData` props (line 459)
- Changed `dateCreated: dateCreated,` → `...(dateCreated && { dateCreated })` in schema object (line 483)
- When `dateCreated` is `undefined`, the key is omitted from JSON-LD (echo/addvanced emit no `dateCreated` field)

**Why it passed (GREEN gate):**
- All 196 tests pass
- Every project in PROJECTS validates against the D-03..D-08, D-11, D-12 contract
- `projectOgImage` correctly handles video fallback (ledgeriq → 1.jpg)
- `projectDateCreated` correctly extracts years and returns undefined for timeline strings without years
- File-on-disk assertions pass for all returned image paths

**Verification:**
```bash
npx jest __tests__/seo/project-metadata.test.ts
# Test Suites: 1 passed, 1 total
# Tests:       196 passed, 196 total

npm run lint
# ✔ No ESLint warnings or errors

npx tsc --noEmit
# (no output — clean)
```

## Deviations from Plan

None. Plan executed exactly as written.

## Commits

| Commit | Type | Message | Files Changed |
|--------|------|---------|---------------|
| `12c8b35` | test(09-01) | add failing test for project SEO derivation helpers | __tests__/seo/project-metadata.test.ts (+303) |
| `80345e2` | feat(09-01) | implement project SEO derivation helpers | lib/metadata.ts (+113), components/seo/structured-data.tsx (~2 lines) |

## Files Created/Modified

**Created:**
- `__tests__/seo/project-metadata.test.ts` (303 lines, 196 tests)

**Modified:**
- `lib/metadata.ts` (added 5 helper exports + ProjectCreativeWorkProps type, 113 lines)
- `components/seo/structured-data.tsx` (dateCreated made optional, 2 lines changed)

## TDD Gate Compliance

✅ **RED gate:** Test suite created and verified failing before implementation (196 failed tests, commit `12c8b35`)  
✅ **GREEN gate:** Implementation created and verified passing (196 passed tests, commit `80345e2`)  
⚪ **REFACTOR gate:** Not needed (implementation is already clean, no refactor commit)

Git log shows `test(09-01)` before `feat(09-01)` — TDD cycle validated.

## Known Stubs

None. All helpers return real derived values from PROJECTS data.

## Threat Flags

None. No new network endpoints, auth paths, or trust boundary changes. All inputs are compile-time constants from `lib/data/projects.ts` (Randy-authored, reviewed). JSON-LD schema emits via JSON.stringify (T-09-01 accepted risk per plan threat model).

## Self-Check

**Created files exist:**
```bash
test -f __tests__/seo/project-metadata.test.ts && echo "FOUND"
# FOUND
```

**Modified files exist:**
```bash
test -f lib/metadata.ts && echo "FOUND"
# FOUND

test -f components/seo/structured-data.tsx && echo "FOUND"
# FOUND
```

**Commits exist:**
```bash
git log --oneline --all | grep 12c8b35 && echo "FOUND: test(09-01)"
# 12c8b35 test(09-01): add failing test for project SEO derivation helpers
# FOUND: test(09-01)

git log --oneline --all | grep 80345e2 && echo "FOUND: feat(09-01)"
# 80345e2 feat(09-01): implement project SEO derivation helpers
# FOUND: feat(09-01)
```

**Helper exports verified:**
```bash
grep -c "^export function project" lib/metadata.ts
# 5

grep -q "export type ProjectCreativeWorkProps" lib/metadata.ts && echo "FOUND"
# FOUND
```

**Test coverage verified:**
```bash
grep -c "PROJECTS" __tests__/seo/project-metadata.test.ts
# 8 (import + 7 describe.each iterations)

npx jest __tests__/seo/project-metadata.test.ts --passWithNoTests 2>&1 | grep "196 passed"
# Tests:       196 passed, 196 total
```

## Self-Check: PASSED

All files created, all commits exist, all 5 helpers exported, 196 tests pass, lint/tsc clean.

---

**Plan Status:** ✅ Complete  
**Next Step:** Plan 02 will refactor the 5 project routes (`[slug]` + 4 standalone pages) to call these helpers instead of hand-typing metadata
