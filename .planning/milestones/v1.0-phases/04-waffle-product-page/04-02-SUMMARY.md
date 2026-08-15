---
phase: 04-waffle-product-page
plan: 02
subsystem: ui
tags: [nextjs, react, tailwind-v4, projects-grid, data-model]

# Dependency graph
requires:
  - phase: 04-waffle-product-page
    provides: "04-01: /projects/waffle showcase page + screenshot.png asset this card routes to"
provides:
  - Optional isLiveProduct flag on the Project type
  - Waffle PROJECTS entry (slug "waffle", isLiveProduct: true)
  - Conditional "Live Product" badge overlay on the /projects grid card
  - Test proving the badge, routing, and data-shape contract
affects: [04-waffle-product-page (plan 03 — checkpoint verification of the full recruiter flow)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Optional boolean flag on shared data model (isLiveProduct) driving a conditional badge overlay, mirroring the existing Featured Star Indicator pattern in components/ui/global-article-grid.tsx"
    - "Static route folder (app/projects/waffle/) takes precedence over [slug] catch-all — no routing special-case needed, only the slug field + folder existing"

key-files:
  created:
    - __tests__/projects/waffle/waffle-grid-card.test.tsx
  modified:
    - lib/data/types.ts
    - lib/data/projects.ts
    - app/projects/projects-client.tsx

key-decisions:
  - "status: \"completed\" for the Waffle PROJECTS entry (not \"in-progress\") — the product is live and paid, matching 04-01's SUMMARY framing"
  - "Badge test asserts exact count (toHaveLength(1)) rather than toBeInTheDocument() to enforce the regression guard that only the Waffle card renders the badge"

requirements-completed: [WAF-02, WAF-04]

# Metrics
duration: 13min
completed: 2026-08-15
---

# Phase 4 Plan 02: Projects Grid Live Product Badge Summary

**Waffle PROJECTS entry with `isLiveProduct: true` plus a conditional amber "Live Product" badge overlay in the `/projects` grid, routing to the bespoke `/projects/waffle` page from 04-01 via the existing slug-based Link (no `[slug]` special-casing needed).**

## Performance

- **Duration:** ~13 min
- **Started:** 2026-08-15T06:42:00Z
- **Completed:** 2026-08-15T06:55:09Z
- **Tasks:** 2
- **Files modified:** 4 (1 new test, 3 modified)

## Accomplishments
- Failing test written first (RED) encoding the full contract: real `PROJECTS` data shape (slug/isLiveProduct/id/name/thumbnail/longDescription/featured) and real grid render (exactly one "Live Product" badge, a link to `/projects/waffle`), plus a regression guard proving the `echo` case-study entry is unaffected
- `Project` type extended with an additive, optional `isLiveProduct?: boolean` field — zero changes required to any existing `PROJECTS` entry
- Waffle entry appended to `PROJECTS` (`slug: "waffle"`, `isLiveProduct: true`, `thumbnail: "/projects/waffle/screenshot.png"` — reusing 04-01's screenshot asset), deliberately omitting case-study-only fields (`challenges`/`solutions`/`processStory`/`overview`) since this is a product entry, not a case study (D-06)
- Badge overlay inserted into `projects-client.tsx` as a `Card`-level sibling of the existing thumbnail `Link`, guarded by `project.isLiveProduct`, styled `bg-amber-600 dark:bg-amber-500 text-zinc-950` (contrast-safe per D-08/UI-SPEC) — all 10 test assertions pass, `npm run lint` clean, `npx tsc --noEmit` clean, full `npm test` shows zero new failures (1176 passed / 685 skipped baseline, matching CLAUDE.md's documented skip set)

## Task Commits

Each task was committed atomically:

1. **Task 1: Write failing test for the Waffle grid card + badge + routing** - `a92a03a` (test)
2. **Task 2: Add isLiveProduct flag, the Waffle PROJECTS entry, and the badge overlay — GREEN** - `6c5e0d8` (feat)

_TDD gate sequence verified: `test(04-02)` commit `a92a03a` precedes the `feat(04-02)` GREEN commit `6c5e0d8`._

## Files Created/Modified
- `__tests__/projects/waffle/waffle-grid-card.test.tsx` - 10-assertion test: data-shape on real `PROJECTS` (not mocked), badge render count, routing link, echo regression guard
- `lib/data/types.ts` - `isLiveProduct?: boolean` added to `Project` type, alongside `featured: boolean`
- `lib/data/projects.ts` - New `waffle` entry appended to `PROJECTS` array (slug `"waffle"`, `isLiveProduct: true`, `status: "completed"`)
- `app/projects/projects-client.tsx` - Conditional `{project.isLiveProduct && (...)}` badge overlay (`absolute top-3 right-3 z-10` + `Badge` with amber/zinc-950 contrast classes) inserted as a `Card`-level sibling of the thumbnail `Link`

## Decisions Made
- Used `status: "completed"` (not `"in-progress"`, which was the PATTERNS.md excerpt's placeholder) since Waffle is a live, paid product per 04-01's SUMMARY and the CONTEXT.md recruiter-proof framing — "in-progress" would undersell it.
- Test asserts `screen.getAllByText("Live Product")).toHaveLength(1)` rather than a looser `getByText` presence check, so the regression guard (badge only renders for the flagged entry) is enforced by the test itself, not just by inspection.

## Deviations from Plan

None - plan executed exactly as written. The `Badge` component was already imported in `projects-client.tsx` (no new import needed, as the plan noted); no sitemap or routing special-case edits were made, per the plan's explicit instruction that both are handled automatically by the existing generic `PROJECTS`-driven logic.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- ROADMAP Phase 4 success criterion #3 met: `/projects` grid shows a Waffle card with a "Live Product" badge routing to `/projects/waffle` (not the `[slug]` template).
- WAF-02 satisfied; the badge-accent portion of WAF-04 satisfied (combined with 04-01's page-level accent work, WAF-04 is now fully covered).
- Combined with 04-01, the full recruiter discovery flow now works end-to-end: `/projects` grid → badged Waffle card → `/projects/waffle` showcase page → dual CTA to the live product.
- Remaining phase work (per ROADMAP): the 04-03 checkpoint for manual visual verification (light/dark theme render of both the grid badge and the showcase page, amber contrast spot-check, screenshot PII check) — not yet performed, deferred by design to that checkpoint plan.

## Self-Check: PASSED

All 4 files verified present on disk; both commits (`a92a03a`, `6c5e0d8`) verified present in git history.

---
*Phase: 04-waffle-product-page*
*Completed: 2026-08-15*
