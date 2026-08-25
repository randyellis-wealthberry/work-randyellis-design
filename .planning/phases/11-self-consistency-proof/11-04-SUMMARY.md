---
phase: 11-self-consistency-proof
plan: 04
subsystem: testing
tags: [jest, seo, regression-test, credibility]

# Dependency graph
requires:
  - phase: 11-self-consistency-proof
    provides: "11-01 fixed the /about OG image's award count (6->4); 11-03 shipped the four named awards + judgeCredential inside about-client.tsx's achievements array. This plan pins the final post-PRF-01 shape of both."
provides:
  - "A regression test (__tests__/seo/award-count-consistency.test.ts) that fails if any of five surfaces stating an award count disagree with each other or with EXPECTED_AWARD_COUNT"
  - "A surface-set sweep that fails if a new file mentions 'award' without being added to the test's allow-list or surface assertions"
  - "Mutation-proven detection paths for all four ways this figure has drifted or could drift again"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Shape-anchored source-text extraction (lastIndexOf/indexOf slicing) as the D-12-compliant alternative to bare-string regex for non-exported data"
    - "Single shared EXPECTED_AWARD_COUNT constant compared against by every surface assertion, so the suite tests agreement rather than five independent hardcoded counts"
    - "collectSourceFiles walker + allow-list sweep to prevent the surface set itself from growing silently"

key-files:
  created:
    - "__tests__/seo/award-count-consistency.test.ts"
  modified: []

key-decisions:
  - "Reused collectSourceFiles verbatim from no-legacy-schema.test.ts (D-13) rather than importing it — matches repo convention of self-contained SEO test files"
  - "extractAboutClientAwardsSlice() factored as a shared helper used by both Block 2 (about-client surface) and Block 4 (cross-surface agreement), rather than duplicating the slice logic — kept the extraction anchor in exactly one place while still recomputing fresh fs reads per call"
  - "Root OG image (app/opengraph-image.tsx) is NOT asserted for a count — it states none. Covered only by the Block 3 sweep, which would catch an awards cell being added to it in the future (see Root OG Reconciliation below)"
  - "Block 3's allow-list failure uses a try/catch wrapper around expect().toEqual() to attach an instructive ACTION REQUIRED message on top of Jest's own diff, since Jest's expect() doesn't support a Chai-style second message argument"

patterns-established:
  - "Consistency-over-ban test shape: one shared constant, N surface blocks each comparing against it, one final block binding surfaces to each other directly — reusable for any other hand-typed-in-N-places figure this codebase accumulates"

requirements-completed: [CRED-12]

# Metrics
duration: 22min
completed: 2026-08-23
---

# Phase 11 Plan 04: Award-Count Consistency Test Summary

**New regression test (`__tests__/seo/award-count-consistency.test.ts`, 324 lines, 19 assertions) pins the design-award count as consistent across five independently hand-typed surfaces plus a seven-file allow-listed sweep, replacing zero prior automated coverage of this figure with structural (never bare-string) assertions, and demonstrates all four detection paths go red under targeted mutation.**

## Performance

- **Duration:** 22 min
- **Started:** 2026-08-23 (immediately following 11-03's completion commit)
- **Completed:** 2026-08-23
- **Tasks:** 2 (1 code task + 1 mutation-proof task, no code change)
- **Files created:** 1

## Accomplishments

- Wrote a single new test file asserting all five surfaces that state an award count agree with a shared `EXPECTED_AWARD_COUNT = 4` constant and, in one final test, agree with each other directly (D-11)
- Every assertion is structural: real imports (`buildPersonSchema`, `PROOF_EXHIBITS`) for the two importable surfaces, shape-anchored source-text slicing for the three that are not exported — never a bare `"4"` grep, which would collide with `grid-cols-4`, `h-4 w-4`, and `sm:text-4xl` inside the exact files under test (D-12)
- Reused `collectSourceFiles` verbatim from `__tests__/seo/no-legacy-schema.test.ts` (D-13) to sweep `app/`, `components/`, `lib/` for any file mentioning `/award/i`, pinned against a seven-entry allow-list with an instructive failure message so the surface set can never grow silently
- Structurally excluded the Webby Awards judge credential from the count on both surfaces that carry it (JSON-LD array, about-client.tsx awards literal) — asserted both by absence-of-match and by position (the Webby mention must fall *outside* the awards array slice), satisfying D-07
- Proved all four detection paths go red under a targeted, single-surface-at-a-time mutation, then reverted every mutation cleanly

## Task Commits

1. **Task 1: Write the award-count consistency test** — `d472925` (test)
2. **Task 2: Prove the test actually fails when a surface drifts** — no commit (mutation-only proof task; every mutation reverted with `git checkout --` before proceeding to the next, nothing left to stage)

**Plan metadata:** (this commit, following SUMMARY write)

## Files Created/Modified

- `__tests__/seo/award-count-consistency.test.ts` (created, 324 lines) — 19 tests across four describe blocks (importable surfaces, source-text surfaces, surface-set sweep, cross-surface agreement) plus the reused `collectSourceFiles` walker

## The Final Surface Set and Assertion Method

| Surface | States a count? | Assertion method |
|---------|------------------|-------------------|
| `lib/seo/json-ld.ts` `buildPersonSchema().award` | yes — 4-entry array | Real named import; `.length === EXPECTED_AWARD_COUNT`, non-empty-string check, 2×Davey/2×Vega regex count, `/webby/i` absence |
| `lib/data/retainer.ts` `PROOF_EXHIBITS` | yes — `{ value: "4", context: "Design awards won" }` row | Real named import; field lookup by `context` (not array index), `.value === String(EXPECTED_AWARD_COUNT)` |
| `app/about/about-client.tsx` `achievements` (Design awards cell) | yes — `value: "4"` + 4-entry `awards` array | Not exported; `fs.readFileSync` + shape-anchored slice: `lastIndexOf("{", labelIndex)` for the object, `indexOf("awards: [")` → `indexOf("]")` for the array, quoted-literal count, `/webby/i` position check |
| `app/about/opengraph-image.tsx` | yes — bare `4` text node | Not exported (edge `next/og` route); whole-line match `/^\s*\d+\s*$/`, exactly one such line, trimmed value equals `String(EXPECTED_AWARD_COUNT)`, `"Design Awards"` label confirmed within the next 12 lines |
| `app/about/page.tsx` `metadata.openGraph.description` | yes — `"4 awards won"` phrase | Not exported as a standalone value; `matchAll(/(\d+)\s+awards?\s+won/gi)`, every captured group equals `String(EXPECTED_AWARD_COUNT)` |
| `app/opengraph-image.tsx` (root OG) | **no** — 3-cell stats row (`2.5M+`, `$50M`, `800+`), no awards cell | Not asserted directly — see Root OG Reconciliation below |
| `components/core/animated-number-basic.tsx` | no — dead code, zero imports | Allow-listed with inline comment, excluded from count assertions |
| `components/ui/reading-progress.tsx` | no — `Award` is a `lucide-react` icon import for a milestone label | Allow-listed with inline comment, excluded from count assertions |

## The Seven-Entry Allow-List, As Shipped

```typescript
const ALLOWED_AWARD_FILES = [
  "app/about/about-client.tsx",              // states the count — Block 2
  "app/about/opengraph-image.tsx",           // states the count — Block 2
  "app/about/page.tsx",                      // states the count — Block 2
  "components/core/animated-number-basic.tsx", // dead code, zero imports
  "components/ui/reading-progress.tsx",      // lucide-react icon, not a count
  "lib/data/retainer.ts",                    // states the count — Block 1
  "lib/seo/json-ld.ts",                      // states the count — Block 1
].sort();
```

Verified by direct grep at execution time (`grep -rliE 'award' app components lib`) — exactly these seven paths, matching the plan's `<interfaces>` table with no drift.

## Root OG Reconciliation

`REQUIREMENTS.md` says "both OG generators" and ROADMAP criterion 3 says "all four surfaces." Neither is literally true of what the code states today: `app/opengraph-image.tsx` (the root/homepage OG image) has a three-cell stats row — `2.5M+`, `$50M`, `800+` — and **no awards cell at all**, confirmed by full-file read at plan time and unchanged since. There is no count on that surface to pin, and asserting one would assert a claim the file does not make.

This test does not add a count assertion for the root OG. Instead, Block 3's sweep covers it structurally: the root OG file does not currently match `/award/i`, so it is absent from `ALLOWED_AWARD_FILES`. If an awards cell is ever added to it, the file will start matching the sweep, appear in the actual set but not the allow-list, fail the sweep assertion, and the instructive failure message will tell whoever added it to either pin the new count or extend the allow-list with justification. The five-surface count and the two-file dead-surface allow-list together are the honest implementation of "every surface that states it" (D-11) — the root OG states nothing, so it needs no count assertion, only sweep coverage.

## Mutation Results

All four mutations were run one at a time against the clean HEAD tree, confirmed to produce a failure, then reverted with `git checkout -- <path>` before the next mutation. No `git stash` was used.

| # | Mutation | File | Failing Test(s) |
|---|----------|------|-------------------|
| 1 | `Design awards won` row's `value` changed `"4"` → `"5"` | `lib/data/retainer.ts` | `that row's value equals String(EXPECTED_AWARD_COUNT)` (Block 1, PROOF_EXHIBITS) AND `buildPersonSchema().award length, PROOF_EXHIBITS's Design awards value, and about-client.tsx's awards array length are all equal to each other` (Block 4) |
| 2 | Awards value text node changed `4` → `6` (restoring the exact CRED-13 defect) | `app/about/opengraph-image.tsx` | `that line's trimmed value equals String(EXPECTED_AWARD_COUNT)` (Block 2, OG stat card) — the single most important path, confirmed to catch the exact regression CRED-13 fixed |
| 3 | One entry deleted from the `awards` array (4 → 3 entries) | `app/about/about-client.tsx` | `the awards array contains exactly EXPECTED_AWARD_COUNT string literals` (Block 2, about-client) AND `buildPersonSchema().award length, PROOF_EXHIBITS's Design awards value, and about-client.tsx's awards array length are all equal to each other` (Block 4) |
| 4 | Webby judge text moved from `judgeCredential` field into the `awards` array as a 5th entry | `app/about/about-client.tsx` | `the awards array contains exactly EXPECTED_AWARD_COUNT string literals`, `the awards array slice does not mention the Webby Awards judge credential (D-07)`, `the Webby Awards mention exists but falls structurally outside the awards array (D-07)` (all Block 2, about-client) AND the Block 4 cross-surface agreement test — both the count and D-07's exclusion path failed, plus the structural-position test flipped as expected since the Webby mention was now inside the slice it's meant to be outside of |

After all four mutations, `git status --porcelain lib/data/retainer.ts app/about/opengraph-image.tsx app/about/about-client.tsx` produced no output, `git stash list` showed no new entry, and `npx jest __tests__/seo/award-count-consistency.test.ts` passed 19/19 on the restored tree.

## Deviations from Plan

None — plan executed exactly as written. One implementation refinement within Claude's Discretion: Block 4's cross-surface extraction reuses a shared `extractAboutClientAwardsSlice()` helper (also used by Block 2) rather than re-deriving the slice logic inline a second time, keeping the single anchor point (`label: "Design awards"` → `lastIndexOf("{")` / `indexOf("awards: [")` → `indexOf("]")`) in exactly one place in the file. Each call still does a fresh `fs.readFileSync`, so the two blocks remain independently verifiable — this is a DRY refactor of the extraction logic, not a shared cached state.

One acceptance-criteria fix caught mid-task (Rule 1 — bug in the test's own doc comment, not application code): the walker's doc comment originally described the security property in prose using the literal strings `process.env` and `process.argv` (to explain what the walker does NOT accept as input), which caused the acceptance-criteria grep for those exact strings to return `1` instead of the required `0`. Reworded to "no externally-supplied input" — same meaning, no longer collides with the criterion whose actual intent is "no runtime-supplied root exists in the file," which remains true.

## Issues Encountered

- `npm test` (full suite) shows the same 4 known-baseline failing suites documented in CLAUDE.md and confirmed pre-existing by 11-03-SUMMARY.md: `__tests__/components/ui/delight/confetti.test.tsx`, `__tests__/components/ui/glowing-hero-image.test.tsx`, `__tests__/performance/animation-load-testing.test.tsx`, `__tests__/chaos/chaos-engineering.test.tsx` — all `Cannot find module` errors for `components/ui/success-confetti`, `components/ui/glowing-hero-image`, `components/animations/target-cursor`, none of which exist in the repo. `email-animation-60fps.test.tsx` (documented as flaky) passed cleanly on this run.
  - **Verified pre-existing, not a regression:** `git diff --stat a3c0f34 HEAD` shows this plan's commit touched exactly one file, the new test file. None of the four failing suites import or reference `award-count-consistency.test.ts` or the module paths this test reads.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- CRED-12 is now closed with automated, mutation-proven coverage. No further work in this phase depends on this plan's output (11-05, if it exists, is a checkpoint/visual-review step per 11-03-SUMMARY's readiness note, unrelated to this test).
- The test's `EXPECTED_AWARD_COUNT` constant is the single edit point if the award count ever legitimately changes — whoever makes that change gets immediate, named failures across every surface that has not been updated to match.
- No blockers for Phase 12.

## Self-Check: PASSED

- FOUND: `__tests__/seo/award-count-consistency.test.ts`
- FOUND: `d472925` (Task 1 commit)

---
*Phase: 11-self-consistency-proof*
*Completed: 2026-08-23*
