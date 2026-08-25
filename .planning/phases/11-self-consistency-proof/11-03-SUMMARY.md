---
phase: 11-self-consistency-proof
plan: 03
subsystem: ui
tags: [nextjs, react, tailwind, accessibility, credibility-copy]

# Dependency graph
requires:
  - phase: 11-self-consistency-proof
    provides: "11-01 fixed the /about OG image's award count (6→4); this plan builds on the same corrected numeral"
provides:
  - "The four named design awards (issuer + category) visible on /about's Design awards cell, agreeing with lib/seo/json-ld.ts's award array"
  - "The Webby Awards judge credential rendered as a structurally distinct line, never counted among the four"
  - "achievements array typed as ReadonlyArray<{...}> with optional awards/judgeCredential fields, enabling data-driven (not label-string) render branching"
affects: [11-04, 11-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Render branch on field presence (achievement.awards) rather than label string comparison, giving downstream tests a stable structural anchor"
    - "Swap span→div for the one cell needing flow content (ul), leaving the other three cells' span render byte-identical"

key-files:
  created: []
  modified:
    - "app/about/about-client.tsx"

key-decisions:
  - "Award description lead-in shortened to \"For GrowIt!\" — all four awards are for the same product, so the attribution is carried once above the list rather than repeated in each award string"
  - "Award list entries drop the repeated \"(GrowIt!)\" suffix present in lib/seo/json-ld.ts, since the cell's lead-in already carries that attribution once"
  - "Webby judge line rendered as a <p> sibling after the closing </ul>, separated with a hairline top border and italics — never an <li>, per D-07"
  - "list-none with no custom marker glyph — the D-06 no-icons rule extends to bullet discs, not just emoji"

patterns-established:
  - "Optional per-entry fields (awards?, judgeCredential?) on an otherwise-uniform array, branched on presence — reusable if a future cell needs similar structured content without disturbing sibling cells"

requirements-completed: [PRF-01]

# Metrics
duration: 8min
completed: 2026-08-23
---

# Phase 11 Plan 03: Named Awards In-Cell Summary

**Promoted the four named design awards from JSON-LD-only to visible on-page copy inside `/about`'s existing `4 / Design awards` proof-band cell, with the Webby Awards judge credential rendered as a structurally distinct, non-counted line.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-08-23T06:56Z (immediately following 11-02's completion commit)
- **Completed:** 2026-08-23T07:02Z
- **Tasks:** 3 (2 code tasks + 1 verification-only task)
- **Files modified:** 1

## Accomplishments
- `achievements` array explicitly typed as `ReadonlyArray<{ value; label; description; awards?; judgeCredential? }>`, mirroring `lib/data/retainer.ts`'s type-annotation convention
- The Design awards entry now carries all four named awards (issuer + category), matching `lib/seo/json-ld.ts`'s `buildPersonSchema().award` array
- The other three cells (`2.5M+`, `$50M`, `800+`) render through the exact same `<span>` path, byte-identical to before
- The Webby judge credential renders as a separate, visually distinct element — never a fifth award, never inside the `<ul>`
- No icons, emoji, or bullet-disc markers anywhere in the new markup (D-06)

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend the achievements data shape with the four named awards** - `fad9ff9` (feat)
2. **Task 2: Render the awards as a compact list inside the Design awards cell** - `392d7d2` (feat)
3. **Task 3: Prove the change is contained and the full gate is green** - verification only, no code change, no commit (nothing to stage)

**Plan metadata:** (this commit, following SUMMARY write)

## Files Created/Modified
- `app/about/about-client.tsx` - `achievements` array gained an explicit `ReadonlyArray<{...}>` type and two optional fields (`awards`, `judgeCredential`) populated on the Design awards entry only; the render swapped that one cell's description `<span>` for a `<div>` containing a lead-in, a marker-less `<ul>` of four awards, and a separated Webby judge line. The other three cells' render path is untouched.

## Decisions Made

- **Award string wording (Claude's Discretion under D-05):** each of the four `awards` array entries is `"{Placement} — {Issuer}, {Category}"` (e.g. `"Silver — The Davey Awards, Mobile Apps/Social"`), dropping the repeated `(GrowIt!)` suffix that `lib/seo/json-ld.ts` carries per-entry. Product attribution is instead carried once by the cell's `description` lead-in (`"For GrowIt!"`), since a quarter-width cell repeating the same parenthetical four times is noise. The four strings, in array order:
  1. `Silver — The Davey Awards, Mobile Apps/Social`
  2. `Silver — The Davey Awards, Mobile Apps/Lifestyle`
  3. `3rd Place — Vega Digital Awards, Best User Interface App/Experience`
  4. `3rd Place — Vega Digital Awards, Best Lifestyle App`
- **`description` lead-in:** changed from the placeholder `"Recognition for innovative design work"` to `"For GrowIt!"` — short, sits above a four-item list in a narrow cell, carries the shared product attribution once.
- **`judgeCredential` wording:** `"Also a Webby Awards judge."` — contains "judge", contains no "won" or placement word, satisfying D-07's structural-separation requirement.
- **Markup shape (Claude's Discretion under D-05):** the Design awards cell's description slot became a `<div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">` (dropping `block` since `div` is already block-level) containing, in order: the `description` lead-in as a text node, a `<ul className="mt-1 list-none space-y-0.5">` of four `<li>` (keyed by award string), then conditionally a `<p className="mt-1.5 border-t border-zinc-200 pt-1.5 italic dark:border-zinc-800">` for `judgeCredential`. The other three cells continue to render the original `<span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">{achievement.description}</span>`, chosen by branching on `achievement.awards` (data presence), not `achievement.label === "Design awards"` (string comparison) — per the plan's explicit instruction, so a future label reword cannot silently drop the list, and 11-04's test has a stable structural anchor.

## Deviations from Plan

None - plan executed exactly as written. All task-level acceptance criteria (grep checks for award content, D-06 emoji absence, D-07 structural separation, HTML validity, dark-mode contrast pairing, scope containment) passed on first implementation with no rework.

## Issues Encountered

- `npm test` showed 5 failing test suites and 1 failing test on the full run: `__tests__/components/ui/delight/confetti.test.tsx`, `__tests__/components/ui/glowing-hero-image.test.tsx`, `__tests__/performance/animation-load-testing.test.tsx`, `__tests__/chaos/chaos-engineering.test.tsx` (all `Cannot find module` errors for `components/ui/success-confetti`, `components/ui/glowing-hero-image`, `components/animations/target-cursor` — none of which exist in the repo, matching CLAUDE.md's documented known baseline), plus one flaky assertion in `__tests__/performance/email-animation-60fps.test.tsx` ("should maintain 60fps during success animation" — a requestAnimationFrame-count timing assertion).
  - **Verified pre-existing, not a regression:** `git diff --stat 9c086a3 HEAD` shows this plan touched exactly one file, `app/about/about-client.tsx`. None of the five failing suites (or the components/tests they import) reference `about-client.tsx` in any way (`grep -l "about-client"` across all five returned no matches). The `email-animation-60fps.test.tsx` failure did not reproduce when the suite was re-run in isolation (`npx jest __tests__/performance/email-animation-60fps.test.tsx` → 8/8 passed), confirming it is timing-flaky in jsdom, the same category as the already-documented `animation-load-testing.test.tsx` flakiness — not caused by this plan's change. Comparison method: since the working tree was already clean (both tasks committed) at verification time, containment was proven by diffing the plan's two commits against the pre-plan commit (`9c086a3`) and cross-referencing import graphs, rather than `git stash` (avoided per this repo's worktree-safety rules, since stash refs are shared across concurrent worktrees).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The `achievements` array now exposes `achievement.awards` (a `readonly string[]` of exactly 4 entries) as a stable, data-driven anchor for plan 11-04's consistency test — it can assert array length and content directly by reading the file's source text and locating this field, without depending on rendered markup or label strings.
- `judgeCredential` is a separate field from `awards`, so 11-04's test can assert no `award` entry matches `/webby/i` without any special-casing.
- No blockers for 11-04 (consistency test) or 11-05 (checkpoint/visual review, which per the plan's own `<verification>` step 7 is where human confirmation of the rendered result belongs — this plan's automated gate is green but visual sign-off is deferred by design).

## Self-Check: PASSED

- FOUND: `app/about/about-client.tsx`
- FOUND: `.planning/phases/11-self-consistency-proof/11-03-SUMMARY.md`
- FOUND: `fad9ff9` (Task 1 commit)
- FOUND: `392d7d2` (Task 2 commit)
- FOUND: `537b372` (SUMMARY commit)

---
*Phase: 11-self-consistency-proof*
*Completed: 2026-08-23*
