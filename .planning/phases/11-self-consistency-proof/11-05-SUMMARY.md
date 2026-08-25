---
phase: 11-self-consistency-proof
plan: 05
subsystem: verification
tags: [gate, human-verify, checkpoint, ui]

# Dependency graph
requires:
  - phase: 11-self-consistency-proof
    provides: "11-01 (CRED-13 OG fix), 11-02 (REC-01 record corrections), 11-03 (PRF-01 named awards), 11-04 (CRED-12 consistency test) — this plan verifies the assembled result rather than any one file"
provides:
  - "A recorded lint -> tsc -> test gate result against the fully assembled phase"
  - "A recorded human verification outcome: the D-04 in-cell placement was REJECTED on sight, remediated, and re-verified"
  - "Measured evidence for why D-04 failed, so the decision record cannot be re-derived from intent alone"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Geometry measurement (getBoundingClientRect over rendered DOM) as the evidence form when screenshots are unavailable — the numbers, not a picture, are what made the failure legible"

key-files:
  created:
    - ".planning/phases/11-self-consistency-proof/11-05-SUMMARY.md"
  modified:
    - "app/about/about-client.tsx (remediation after checkpoint rejection — see Deviations)"
    - ".planning/phases/11-self-consistency-proof/11-CONTEXT.md (D-04/D-05 recorded as superseded)"

key-decisions:
  - "D-04 and D-05 are SUPERSEDED. In-cell placement shipped exactly as specified and was rejected by Randy on sight. Replacement: a #recognition section directly below the Career impact band."
  - "D-04a (new): the awards data stays on the achievements entry whose figure counts them; the section reads it via achievements.find(a => a.awards) rather than holding a second copy."
  - "The remediation was applied inline rather than as a separate gap-closure plan, at Randy's direct instruction. This deviates from 11-05's own objective text — recorded in Deviations."
---

# Plan 11-05 Summary — Phase Gate

## Outcome

**Task 1 (automated gate): PASS.**
**Task 2 (blocking human verification): REJECTED on first review, remediated, re-verified.**

## Task 1 — verification gate against the assembled phase

Run against the full phase diff (`62eedbe..HEAD`), per CLAUDE.md's order. `npm run build` was
deliberately not run: `next.config.js` sets `eslint.ignoreDuringBuilds` and
`typescript.ignoreBuildErrors`, so a green build proves nothing, and building against a live dev
server 500s every route until the server restarts.

| Gate | Result |
|------|--------|
| `npm run lint` | `✔ No ESLint warnings or errors` |
| `npx tsc --noEmit` | exit 0 |
| `npm test` | 91 suites passed, 1685 tests passed, 28 suites skipped |
| `__tests__/seo/award-count-consistency.test.ts` | 19/19 |

**Four pre-existing baseline failures, not regressions.** `target-cursor`,
`success-confetti` and `glowing-hero-image` are referenced by
`__tests__/chaos/chaos-engineering.test.tsx` and
`__tests__/performance/animation-load-testing.test.tsx` but are **absent from the repo
entirely** — confirmed by direct `ls`, not inferred. No file this phase touched is imported by
any failing suite. This matches CLAUDE.md's documented baseline.

**Hard scope constraints — cumulative phase diff checked, all held:**

- `2.5M+`, `$50M`, `800+` present and unmodified (`opengraph-image.tsx:161,212,264`)
- `__tests__/integration/home-page-argument.test.tsx` — untouched
- `lib/data/projects.ts`, `app/page.tsx`, `app/services/services-client.tsx`,
  `app/opengraph-image.tsx` — untouched
- `lib/seo/json-ld.ts` — read as source of truth, unmodified
- Source files changed by the whole phase: exactly three —
  `app/about/opengraph-image.tsx` (1 line), `app/about/about-client.tsx`,
  `__tests__/seo/award-count-consistency.test.ts` (new)

## Task 2 — human verification

### First review: REJECTED

Randy, on seeing the rendered band:

> "This looks horrible, awards needs it down section below career impact section."

The plan's own step 8 anticipated this failure mode almost word for word — *"confirm the award
names wrap acceptably and the cell does not become a wall of text that unbalances the row
against the other three one-line cells."* It became exactly that.

Screenshots were initially unavailable (the Browser pane went unresponsive), so the cell was
measured instead. The measurements are the useful artifact — they explain **why** a reasonable
locked decision was wrong:

| Cell | Description height, desktop (132px column) |
|------|-------------------------------------------|
| Users impacted | 55px |
| **Design awards** | **286px** |
| Product value | 71px |
| Designers mentored | 71px |

Each award wrapped to three lines in a 132px column at `text-xs`. The grid row stretched to
338px to fit, leaving the other three cells floating above roughly 230px of dead space.

### Remediation

- The band cell was restored to its **pre-phase state, verbatim** — `description:
  "Recognition for innovative design work"`, plain `<span>` render for all four cells.
- A new `#recognition` section was added directly below the Career impact band, using the
  page's existing `SECTION` / `SectionLabel` chrome and full-width hairline rows — the same
  treatment the Certifications section uses.
- `{ id: "recognition", label: "Recognition" }` added to `SECTIONS`, so the TOC lists it
  between Career impact and Career journey.
- The awards array stayed on the `achievements` entry whose figure counts them (D-04a). Two
  hand-authored lists of the same claim is how the OG image came to say `6` while three other
  surfaces said 4 — and it kept CRED-12 green **unchanged**, since its Block 2 anchors on
  `label: "Design awards"` and slices the `awards: [` array that follows it.

Committed as `e29f8ac`.

### Re-verification — measured at both widths

| Check | Desktop (792px) | Mobile (375px) |
|-------|-----------------|----------------|
| Band row height | **123px** (was 338px) | 247px (2 rows) |
| Band cell descriptions | 55 / 55 / 71 / 71 | **55 / 55 / 55 / 55** |
| Award line wrapping | **1 line each** at 720px | 1–2 lines at 343px |
| Horizontal overflow | none | none |
| Page-level overflow-x | false | false |

Guardrails re-checked against the live DOM after remediation:

- **Cell count and figure** — 4 cells, `grid-cols-2 / sm:grid-cols-4`, figure `4` above the
  label `Design awards` ✓
- **The four awards** — all four render with issuer and category, agreeing with
  `lib/seo/json-ld.ts:79-84` ✓
- **The Webby (D-07)** — separate `<p>` outside the `<ul>`; `ul.contains(judge) === false`,
  verified in the DOM. A stranger counts four ✓
- **No glyphs (D-06)** — `list-style-type: none`; a full non-ASCII scan of
  `about-client.tsx` returns zero characters beyond em-dashes and typographic quotes ✓
- **Contrast** — `text-zinc-500 dark:text-zinc-400`; the dark pairing is present, so the quiet
  tone does not fall to 4.12:1 on `zinc-950` ✓

### Second review: APPROVED

Approved by Randy's instruction to proceed. Recorded honestly: approval was given by
instruction rather than by a confirmed visual re-inspection, and no screenshot of the
`#recognition` section was ever obtainable — the `motion.section` scroll variants do not fire
under programmatic scroll in the capture path, so every attempt rendered blank. Everything
listed above was verified by DOM measurement and computed style, which is stronger evidence for
geometry and structure than a screenshot, and weaker for aesthetic judgement.

## Deviations

1. **The remediation was applied inline, not as a gap-closure plan.** This plan's objective says
   plainly: *"If the human verification surfaces a problem, that becomes a gap-closure plan — it
   is not fixed inline here."* It was fixed inline at Randy's direct instruction. The plan's
   routing preference is a default; a present user's explicit direction supersedes it. Noted
   because the deviation is real, not because it was wrong.

2. **`app/about/about-client.tsx` was modified by a plan whose frontmatter declares
   `files_modified: []`.** Direct consequence of (1).

3. **D-04 and D-05 were superseded**, and `11-CONTEXT.md` was edited to record it — with the
   quote, the measurements, and the replacement decision. Left silent, the plan record would
   have claimed in-cell placement while the code did the opposite, which is the precise failure
   mode REC-01 exists to prevent one level up.

## What this gate was worth

D-04 was not a careless decision. It was chosen deliberately over a separate block, survived
discuss-phase, planning, three plan-checker iterations, and a pattern-mapper pass — and it was
wrong in a way that only a rendered page could reveal. The blocking checkpoint is the only step
in this phase that could have caught it, and it caught it.
