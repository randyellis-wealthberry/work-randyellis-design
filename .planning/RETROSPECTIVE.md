# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 — Recruiter-Readiness

**Shipped:** 2026-08-15
**Phases:** 4 | **Plans:** 3 tracked (phases 1-3 pre-GSD) | **Commits:** 49

### What Was Built
- Credibility purge: fabricated testimonials/awards/schema/hidden-SEO removed; all claims verifiable against Randy's deck
- Leadership-forward positioning: hero + (after audit remediation) metadata/OG/JSON-LD unified on "Head of Product & Fractional CDO"
- Recruiter conversion path: booking CTA above fold, tracked resume download, client logo bar, real testimonials
- `/projects/waffle` live-product showcase with badged grid card and dual tracked CTAs

### What Worked
- Phase 4's full GSD chain (UI-SPEC → 3 waves → TDD → human checkpoint → 13/13 verification) shipped clean — zero audit findings against it
- Milestone audit before close caught 3 real blockers all in *secondary surfaces* (About card, OG image generators, metadata) that per-phase work missed
- Inline remediation (7 file edits, same session) over inserting a closure phase — proportionate response
- Merging PR before tagging — tag lands on main history, no orphan risk

### What Was Inefficient
- Phases 1-3 executed without GSD artifacts (no PLAN/SUMMARY/VERIFICATION) — milestone audit had to re-verify 14 REQ-IDs from raw codebase, and the 3 blockers were exactly the kind of secondary-surface misses per-phase verification would have caught
- "Fixed" claims tracked only by primary surface: the "6 awards" fix updated homepage counter but not the About card; the 240K fix updated text metadata but not the OG image generator

### Patterns Established
- OG image generators (`opengraph-image.tsx`) are content surfaces — include them in any copy/claims sweep
- Title lane must be enforced across four layers: visible copy, `lib/metadata.ts`, OG images, structured-data jobTitles
- Duplicated (not shared) CTA JSX keeps trackEvent call sites greppable for verification
- Literal Tailwind utilities over CSS custom properties (tailwind.config.js is dead in this v4 setup)

### Key Lessons
1. Claim fixes need a repo-wide grep per claim (all renderable surfaces), not a per-page fix list
2. Skipping per-phase verification artifacts defers the cost to milestone close with interest
3. Audit-before-close earns its keep even when all traceability rows say Done

### Cost Observations
- Model mix: primary session (Fable) + 1 sonnet integration-checker subagent (~127K tokens, 97 tool uses)
- Sessions: ~6 across the milestone (per .remember daily logs)
- Notable: audit + remediation + close completed in a single session

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | ~6 | 4 | Adopted GSD mid-milestone (phase 4 first with full chain); added audit-before-close |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v1.0 | 1175 passing | n/a | Waffle page + badge added with 0 new deps |

### Top Lessons (Verified Across Milestones)

1. (single milestone so far — see v1.0 lessons above)
