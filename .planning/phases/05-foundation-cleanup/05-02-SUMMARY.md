---
phase: 05-foundation-cleanup
plan: 02
subsystem: cleanup
tags: [nextjs, redirects, data-model, dead-code-removal, tailwind, badge]

# Dependency graph
requires:
  - phase: 04 (v1.0 audit remediation)
    provides: the fabricated-content defect class that motivated deleting /archive and unverified LedgerIQ content
provides:
  - Project type resolved from lib/data/types.ts everywhere (app/data.ts deleted) — unblocks Phase 6's decisions[]/roleNarrative fields
  - Single canonical /projects/ledgeriq URL; /ledgeriq 301-redirects to it
  - Dead code removed: components/case-study/* (6 files), echo-client-final.tsx, app/archive/*, components/ui/archive-thumbnail.tsx
  - Hero proof-chip row (DEBT-01) and click-through Live Product badge (DEBT-02)
  - D-12 accessibility contract carried forward for Phase 6's section wrapper
affects: [06-narrative-template, 07-bespoke-convergence, 08-content-rewrite]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Type-only imports resolve from @/lib/data/types (direct-module style) or @/lib/data (barrel style) — app/data.ts no longer exists"
    - "Informational proof chips use Badge variant=secondary, never variant=outline (reserved for tag/tech chips) or the amber Live Product status accent"
    - "Absolutely-positioned overlay badges over a card-level Link need pointer-events-none or they create a click dead-zone"

key-files:
  created: []
  modified:
    - next.config.js
    - app/projects/[slug]/project-detail-client.tsx
    - app/about/about-client.tsx
    - __tests__/about-professional-experience.test.tsx
    - app/footer.tsx
    - lib/data/types.ts
    - lib/data/static-data.ts
    - lib/data/index.ts
    - app/page.tsx
    - app/projects/projects-client.tsx
    - __tests__/integration/route-coverage.test.tsx

key-decisions:
  - "D-02: nothing salvaged from the deleted bespoke ledgeriq-client.tsx (unverified 5-step narrative, unverified metrics, 404ing images) into lib/data/projects.ts"
  - "D-09: archive data exports (ArchiveItem type, ARCHIVE_CATEGORIES, ARCHIVE_ITEMS) deleted outright rather than left as unused exports"
  - "D-12 CARRY-FORWARD for Phase 6: the deleted case-study-section.tsx's accessibility contract — a section id, role=\"region\", and aria-labelledby pointing at an {id}-heading element (what CaseStudyTOC anchors to) — must be preserved by Phase 6's new section wrapper, but its heading must render via ScrambleSectionTitle (used 39x in project-detail-client.tsx), not the old plain centered h2"
  - "D-16 allowlist/bans for Phase 6 UI-SPEC.md: proof chips built only from the allowlisted Badge primitive; no lucide-react icons inside a chip, no Card wrapper around a chip, no new color/type/spacing tokens, and the amber bg-amber-600/bg-amber-500 accent is reserved exclusively for the Live Product status badge — reusing it on informational chips blurs status-vs-fact semantics"

patterns-established:
  - "Pattern: dead-surface deletion order is repoint importers first, delete the orphaned module last, so there is never a broken intermediate state"

requirements-completed: [FND-01, FND-02, FND-04, DEBT-01, DEBT-02]

# Metrics
duration: 19min
completed: 2026-08-15
---

# Phase 5 Plan 2: Foundation Cleanup Summary

**Deleted 12 dead files (orphan /ledgeriq page, /archive route, components/case-study/*, echo-client-final.tsx), repointed all data-model imports from stale app/data.ts onto lib/data, added a permanent /ledgeriq → /projects/ledgeriq redirect, and closed two v1.0 tech-debt items (hero proof chips, Live Product badge click-through).**

## Performance

- **Duration:** 19 min (11:57:46 to 12:16:43 local, first task commit to plan close)
- **Started:** 2026-08-15T17:57:46Z
- **Completed:** 2026-08-15T18:16:43Z
- **Tasks:** 5 (4 auto + 1 checkpoint:human-verify)
- **Files modified:** 24 (12 deleted, 11 edited, next.config.js edited)

## Accomplishments

- FND-01 closed: `app/projects/[slug]/project-detail-client.tsx` now imports `Project` from `@/lib/data/types`; `app/data.ts` (775 lines) is deleted; `npx tsc --noEmit` exits 0. Phase 6 can now add `decisions[]` and `roleNarrative` to `lib/data/types.ts` and expect them to typecheck.
- FND-02 closed: the orphan bespoke `/ledgeriq` route is deleted; `next.config.js` issues a permanent (301) redirect from `/ledgeriq` to `/projects/ledgeriq`, which is now the single canonical LedgerIQ URL.
- FND-04 closed: `echo-client-final.tsx` and all 6 files under `components/case-study/` are deleted (`echo-client.tsx`, the live Phase 7 MIG-02 target, is untouched).
- DEBT-01 closed: hero subhead shortened to a single positioning line, with a 3-chip proof row (`20 years in design`, `8+ yrs leading teams`, `Ships React / Next.js / TypeScript`) dividing labor with the unchanged `AnimatedNumberBasic` counter block below it.
- DEBT-02 closed: the absolutely-positioned Live Product badge wrapper in `projects-client.tsx` now carries `pointer-events-none`, so clicks fall through to the card's `Link`.
- Bonus (D-09, in FND-04's spirit): `/archive` route, its footer link, `components/ui/archive-thumbnail.tsx`, and the `ArchiveItem`/`ARCHIVE_CATEGORIES`/`ARCHIVE_ITEMS` data exports are all deleted — the fabricated-content defect class purged in v1.0 is removed from this surface too.
- All four D-18 verification methods passed: standard gate (lint, tsc, test), link-integrity grep sweep (including sitemap/robots/manifest/OG generators), deliberate test-suite audit of `route-coverage.test.tsx`, and a human-verified manual browser check.

## Task Commits

Each task was committed atomically:

1. **Task 1: Delete dead surfaces and add /ledgeriq redirect** - `0db34e7` (feat)
2. **Task 2: Consolidate onto lib/data and delete /archive route** - `b3f5595` (feat)
3. **Task 3: Hero proof chips and Live Product badge click-through** - `5d97790` (feat)
4. **Task 4: D-18 verification (lint / tsc / test / link-integrity sweep)** - `3413906` (test)
5. **Task 5: Manual browser check (D-18 method 4)** - human-verified, no code change (checkpoint, approved by operator)

**Plan metadata:** (this commit)

## Files Created/Modified

**Deleted (12):**
- `app/ledgeriq/page.tsx`, `app/ledgeriq/ledgeriq-client.tsx` — orphan bespoke LedgerIQ route (D-01, D-02)
- `components/case-study/case-study-hero.tsx`, `case-study-layout.tsx`, `case-study-section.tsx`, `image-gallery.tsx`, `metrics-card.tsx`, `video-player.tsx` — abandoned, zero-importer component set (D-11)
- `app/projects/echo/echo-client-final.tsx` — dead duplicate of the live `echo-client.tsx` (D-13)
- `app/archive/page.tsx`, `app/archive/archive-client.tsx` — fabricated-content route (D-09)
- `components/ui/archive-thumbnail.tsx` — became zero-importer the moment `/archive` was deleted

**Edited (11 + next.config.js):**
- `next.config.js` — added `async redirects()` sibling to `headers()`: hardcoded `/ledgeriq` → `/projects/ledgeriq`, `permanent: true`, no wildcard/env/request-derived destination (T-05-02-01 mitigation)
- `app/projects/[slug]/project-detail-client.tsx` — `import type { Project }` repointed from `"../../data"` to `"@/lib/data/types"`
- `app/about/about-client.tsx` — `getEmail` import repointed from `"../data"` to `"@/lib/data"` (barrel)
- `__tests__/about-professional-experience.test.tsx` — `jest.mock` target repointed from `"@/app/data"` to `"@/lib/data"`
- `app/footer.tsx` — `/archive` anchor removed; `FooterThemeToggle` and surrounding layout untouched
- `lib/data/types.ts` — `ArchiveItem` type deleted
- `lib/data/static-data.ts` — `ArchiveItem` import, `ARCHIVE_CATEGORIES`, `ARCHIVE_ITEMS` deleted
- `lib/data/index.ts` — `ARCHIVE_ITEMS` removed from barrel re-export list
- `app/page.tsx` — hero subhead shortened; `Badge` import added; 3-chip proof row inserted (DEBT-01)
- `app/projects/projects-client.tsx` — badge wrapper class gained `pointer-events-none` (DEBT-02, single-class diff)
- `__tests__/integration/route-coverage.test.tsx` — stale `/archive` and `/ledgeriq` entries removed from `EXPECTED_ROUTES` and `expectedManifestRoutes`

## Decisions Made

- **D-12 accessibility-contract carry-forward (recorded before deleting `case-study-section.tsx`, not implemented here):** Phase 6's section wrapper must preserve the deleted file's accessibility contract — a section `id`, `role="region"`, and `aria-labelledby` pointing at that section's `{id}-heading` element (this is what `CaseStudyTOC` anchors to) — while rendering the heading via `ScrambleSectionTitle` (used 39x in `project-detail-client.tsx`, the platform's actual section-heading language) rather than resurrecting the old plain centered `h2`, which would fork the design language.
- **D-16 no-AI-slop allowlist/bans, to be encoded in Phase 6's `UI-SPEC.md` for `gsd-ui-checker` BLOCK verdicts:** proof chips use only the allowlisted `Badge` primitive; no lucide-react icons inside a chip; no `Card` wrapper around a chip; no new color/type/spacing tokens; the amber `bg-amber-600 text-sm font-bold text-zinc-950 dark:bg-amber-500` accent is reserved exclusively for the Live Product status badge and must never be reused on informational chips.
- **D-02:** nothing from the deleted bespoke `ledgeriq-client.tsx` (unverified 5-step process narrative, unverified metrics, images 404ing under an empty `public/ledgeriq/`) was migrated into `lib/data/projects.ts`.
- **D-09 discretionary call:** archive data exports were deleted outright (not left as unused exports) — consistent with the fabricated-content purge, not a "keep dead code around" compromise.
- **FND-01 closure confirmed:** `Project` now resolves exclusively from `lib/data/types.ts` across the codebase; `app/data.ts` no longer exists. Phase 6 may add `decisions[]` and `roleNarrative` to `lib/data/types.ts` and expect them to typecheck against the model actually used at runtime.

## Deviations from Plan

None - plan executed exactly as written across all 5 tasks (4 auto + 1 checkpoint).

## Issues Encountered

None.

## Task 4 — D-18 Automated Gate Results (verbatim record)

- `npm run lint` — clean (0 errors)
- `npx tsc --noEmit` — exit 0
- `npm test` — 1175 passing; sole failure is `__tests__/performance/animation-load-testing.test.tsx`, the known-flaky jsdom FPS suite documented as a pre-existing baseline in CLAUDE.md ("Known baseline (not regressions)"). This is NOT a regression introduced by this plan.
- Link-integrity sweep across `app/`, `components/`, `lib/`, `__tests__/`, `app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, and every `opengraph-image.tsx` generator — zero surviving dead references to `/archive`, `/ledgeriq` (outside the Task 1 redirect and legitimate `/projects/ledgeriq` survivors), `app/data`, `components/case-study`, or `echo-client-final`.
- `npm run build` was explicitly NOT used as a verification step (per CLAUDE.md, `next.config.js` sets `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors`, so a passing build does not validate lint/type correctness).

## Task 5 — Manual Browser Check (D-18 method 4): HUMAN-VERIFIED / APPROVED

Operator response: **"approved"**. All 7 steps of the checklist confirmed:

1. Hero renders the shortened positioning line ("I turn startups into design-led organizations — and write the code to prove it.") followed by three visually distinct chip pills ("20 years in design", "8+ yrs leading teams", "Ships React / Next.js / TypeScript"), then the existing CTAs.
2. The four-stat `AnimatedNumberBasic` counter block (2.5M Users Impacted, 4 Design Awards, $50M in product value, 800 Designers Mentored) still animates and is unchanged.
3. No "Archive" link in the footer; the theme toggle still renders.
4. Clicking directly on the amber "Live Product" badge on `/projects` navigates to that project's detail page (the DEBT-02 fix).
5. `/ledgeriq` lands on `/projects/ledgeriq` in the URL bar, rendering the data-driven LedgerIQ case study.
6. `/archive` returns 404.
7. `/projects/echo` renders normally (unchanged `echo-client.tsx`).

Per the resume instructions, this browser check was not re-run by this continuation agent — the operator's prior "approved" verdict against the running dev server is recorded as-is. This agent did not start a new dev server and did not touch the background dev server left running by the prior executor on port 3000.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- FND-01 is closed: Phase 6 may extend `lib/data/types.ts` with `decisions[]` and `roleNarrative` and expect them to typecheck against the model actually in use.
- D-12 accessibility contract (section `id` / `role="region"` / `aria-labelledby` → `{id}-heading`) is recorded above for Phase 6's section wrapper to preserve while switching its heading to `ScrambleSectionTitle`.
- D-16 chip-building allowlist/bans are recorded above for Phase 6's `UI-SPEC.md`.
- FND-02 and FND-04 mean Phases 7 and 8 will only ever edit live, reachable files — no risk of extending dead code.
- FND-03 (deck-coverage audit) is owned by sibling plan 05-01, running concurrently, and is out of this plan's scope — not addressed or commented on here.
- No blockers for Phase 6.

---
*Phase: 05-foundation-cleanup*
*Completed: 2026-08-15*
