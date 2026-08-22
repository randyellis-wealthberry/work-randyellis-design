# PROJECT: Randy Ellis Portfolio

## What This Is

A shipped Next.js 15 portfolio site for Randy Ellis (`work.randyellis.design`)
positioning him as a design leader who ships AI products. As of v1.0
(Recruiter-Readiness, shipped 2026-08-15) every public claim is verifiable,
positioning is leadership-forward across visible copy AND metadata/OG/schema,
recruiter conversion is friction-free (booking CTA, resume download, logo bar,
real testimonials), and a standalone `/projects/waffle` page showcases his live,
monetized AI SaaS.

**Source-of-truth for claims:** Randy's 48-page product design deck +
`.planning/CREDIBILITY-COPY.md`. Do not add unbacked numbers.

## Current State (v2.0 shipped)

- **Shipped:** 2026-08-22 — v2.0 Case-Study Depth
- **Scale:** 221 commits, 353 files (+44,454/−25,294) across the milestone, 2026-08-15 → 2026-08-22
- **Verification:** 30/31 REQ-IDs verified directly against the codebase and live production; CRED-07 sitewide gap accepted as debt; MIG-01..04 restated to the shipped architecture
- **Live SEO:** Search Console domain property verified, sitemap submitted (Success, 19 pages), Rich Results clean on 3 sampled URLs, zero banned schema types in production HTML
- **Tags:** v1.0, v2.0

<details><summary>v1.0 Recruiter-Readiness (shipped 2026-08-15)</summary>

- 49 commits, 64 files (+3,378/−801); 18/18 REQ-IDs audited; shipped via PR #47 (`7db0645`) + inline remediation (`514de29`)

</details>

## Next Milestone: v3.0 Enterprise Credibility

**Status:** staged, not started. Scope lives in `.planning/MILESTONE-CONTEXT.md`,
which `/gsd:new-milestone` consumes.

**Goal:** Every figure on the site is deck-backed or gone, and the two
large-organization engagements read as proof of operating inside regulatory and
scale constraint.

**Target features:**
- Metric integrity close-out — execute the three outstanding `Unbacked` verdicts
  from the Phase 5 deck audit rather than reconciling copy around them
- Enterprise legibility — Echo and Nagarro reframed for a reader evaluating
  whether Randy can operate inside a regulated, large organization
- A grouped entry point for the regulated / field-operations work

## Core Value

**The ONE thing that must work:** a hiring manager landing on the site (or a recruiter
viewing source) finds a coherent, senior, *verifiable* story — leadership positioning,
named awards, real testimonials, honest metrics — with an obvious way to book a
conversation. **Shipped and audit-verified in v1.0.**

## Requirements

### Validated

- ✓ Case-study depth: all 7 case studies carry typed `decisions[]` with rationale, `roleNarrative` and `processStory` — v2.0
- ✓ Structural consistency: all 5 standalone project pages share `components/case-study/case-study-template.tsx` + `diagrams` — v2.0
- ✓ Cross-surface reconciliation: visible copy, metadata, OG and JSON-LD agree across every touched project — v2.0 (CRED-09)
- ✓ SEO foundation: kill-switch SW, `/_next/` unblocked, dev routes gone, structured data consolidated and server-rendered, sitemap timestamped, live-verified 14/14 — v2.0 (SEO-01..05)

- ✓ Credibility: every public claim accurate and verifiable (4 named awards, real testimonials, 240K+ GrowIt everywhere, no fabricated schema, no hidden SEO) — v1.0
- ✓ Positioning: leadership-forward hero + single title lane through metadata/OG/JSON-LD ("Head of Product & Fractional CDO") — v1.0
- ✓ Readiness: above-the-fold cal.com booking CTA, tracked resume PDF, 5-client logo bar, homepage testimonials — v1.0
- ✓ Waffle product showcase: `/projects/waffle` page + "Live Product" badged grid card + dual tracked CTAs — v1.0
- ✓ Pre-existing platform: Next.js 15 App Router on Vercel, SEO JSON-LD, Motion/Radix/Tailwind v4, MDX blog, Loops newsletter — existing

### Active (v3.0 Enterprise Credibility — staged, not started)

- [ ] CRED-10/11/12: the three `Unbacked` sitewide figures removed at source and
      pinned with a regression test; the 4 named awards preserved
- [ ] ENT-01..04: Echo recategorized and promoted; the qualitative value in its
      metrics slot resolved; Nagarro reframed in org-design terms; one grouped
      entry point for the regulated / field-operations work

### Deferred (not this milestone)

- [ ] Visual polish pass beyond case-study surfaces (deferred from v1.0)

### Out of Scope

- Visual redesign / rebrand — substance over aesthetics
- PWA revival — `next-pwa` disabled (Next 15 incompat), not a hiring blocker
- Restoring "6 awards" — only if 2 more surface with proof

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Deck is source-of-truth over live site | Deck has named awards, real testimonials, defensible metrics | ✓ Good — audit found zero fabricated content remaining |
| "4 named awards" over "6 unnamed" | Specific + verifiable beats bigger unbacked number | ✓ Good — but the "6" lingered in 2 spots until audit remediation; lesson: grep all surfaces incl. OG generators |
| Remove fabricated schema + hidden-keyword SEO | Trust + search-penalty risk | ✓ Good — clean repo-wide |
| Coarse granularity, 3 phases, planning docs authored directly | Bounded punch-list, not research build | ⚠️ Revisit — pre-GSD phases left no VERIFICATION.md; milestone audit had to re-verify from codebase |
| Phase 4 added post-milestone as ship-proof | Live monetized SaaS beats another case study | ✓ Good — human-verified, 36 tests |
| Duplicated CTA JSX (no shared component) in waffle-client | Keeps trackEvent call sites greppable/auditable | ✓ Good |
| Literal amber utilities over CSS custom property | tailwind.config.js is dead code in this Tailwind v4 setup | ✓ Good |
| `isLiveProduct` optional flag + static route shadowing `[slug]` | Additive data-model change, zero routing special-cases | ✓ Good |
| One shared `CaseStudyTemplate` over four separate narrative components | Stronger structural consistency; one file to keep honest | ✓ Good — pulled waffle into the same system for free; requirement text needed restating at close |
| Typed data model over MDX for narrative | Keeps every claim greppable for credibility audits | ✓ Good — made the v2.0 audit possible by direct verification |
| Deck demoted from gate to advisory reference (2026-08-15) | Randy's firsthand account is the real source; the deck was blocking real content | ⚠ Mixed — unblocked Phase 8, but FND-03's `Unbacked` verdicts then went unactioned into v3.0 |
| DNS TXT over meta tag for Search Console verification | v3.0 CRED-11 edits `lib/metadata.ts`; a token there is a silent-removal risk | ✓ Good — survives redeploys, covers all subdomains |
| Inline audit remediation over closure phase | 3 blockers = ~7 file edits; full GSD chain disproportionate | ✓ Good — fixed + verified same session |

## Context

Verify changes via `npm run lint` → `npx tsc --noEmit` → `npm test` (build is NOT a
validation gate — ignores lint/type errors). Known flaky: `animation-load-testing.test.tsx`
(FPS in jsdom). Booking link: cal.com/randyellis/30min (`BOOKING_URL` in `lib/constants.ts`).

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition:**
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions

---
*Last updated: 2026-08-22 — v2.0 Case-Study Depth shipped and archived*
