# Phase 4: Waffle Product Page - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-14
**Phase:** 4-Waffle Product Page
**Areas discussed:** What Waffle is, Process, Page depth & format, Primary goal & CTA, Grid visibility, Brand treatment

---

## Framing (pre-discussion)

Phase not found in `ROADMAP.md` (current roadmap = completed Recruiter-Readiness
milestone). Scoped ad-hoc. No "waffle" reference existed anywhere in the portfolio
repo, so intent had to be established from scratch.

## What Waffle is

| Option | Description | Selected |
|--------|-------------|----------|
| New project case study | Product/client case study like echo/nagarro | |
| Waffle-chart visualization | Square-grid data-viz page | |
| Standalone page | Custom page under /projects (not case study, not chart) | ✓ |

**User's choice:** Standalone page → later clarified as "a product/tool named Waffle."
**Notes:** User pointed to `/Users/MacBook/Developer/waffle.cards` and said "ingest my
project." Ingestion revealed Waffle = live AI SaaS (AI interview-scorecard generator,
Next.js 16 / AI SDK 6 + Claude / Stripe / Neon), Randy's own product.

## Process

| Option | Description | Selected |
|--------|-------------|----------|
| Scope as a new phase | Add to roadmap, then discuss formally | |
| Discuss now, formalize after | Talk it through now, capture to CONTEXT.md after | ✓ |
| Just build it directly | Skip GSD ceremony | |

**User's choice:** Discuss now, formalize after.

## Page depth & format

| Option | Description | Selected |
|--------|-------------|----------|
| Product showcase | hero + 6 features + how-it-works + screenshot + CTA (medium) | ✓ |
| Full landing w/ pricing | + 5-tier pricing table + testimonials (sales page) | |
| Lean teaser | hero + 3 bullets + link out | |

**User's choice:** Product showcase.
**Notes:** Pricing table deferred; both showcase and full-landing were viable given assets on hand.

## Primary goal & CTA

| Option | Description | Selected |
|--------|-------------|----------|
| Recruiter proof + live link | Emphasis on "designed & built it"; CTA = View live product | |
| Product acquisition | Funnel to Try-free signups; pricing prominent | |
| Both, dual CTA | View live product ↗ + Try free | ✓ |

**User's choice:** Both, dual CTA.
**Notes:** Accepts a slightly broader message in exchange for serving recruiters and product interest simultaneously. Recommendation had been recruiter-proof-primary; user opted for dual.

## Grid visibility

| Option | Description | Selected |
|--------|-------------|----------|
| In grid w/ "Live Product" badge | Badged card, distinguished from case studies | ✓ |
| In grid, styled like others | Blends in with case-study cards | |
| Standalone only | No card; direct-link access only | |

**User's choice:** In grid with "Live Product" badge.

## Brand treatment

| Option | Description | Selected |
|--------|-------------|----------|
| Portfolio system + orange accent | Site's look + waffle-orange accents + logo | ✓ |
| Full Waffle brand | Orange-forward product-site feel | |
| Portfolio system only | Logo as plain asset, no orange | |

**User's choice:** Portfolio system + waffle-orange accent.

---

## Claude's Discretion

- Grid-card badge mechanism (extend `Project` type vs. standalone entry).
- Specific screenshot selection + framing.
- Bespoke folder vs. `[slug]` scaffold for the page (recommend bespoke).
- Draft copy wording from Waffle positioning docs (Randy approves).

## Deferred Ideas

- Full 5-tier pricing table.
- Case-study narrative version of Waffle.
- Embedded live demo / interactive scorecard preview.
- Testimonials section (source: waffle.cards marketing inputs).
- Transcript-ingestion integrations deep-dive block.
