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

## Current State (v1.0 shipped)

- **Shipped:** 2026-08-15 via PR #47 (merge `7db0645`) + inline audit remediation (`514de29`)
- **Scale:** 49 commits, 64 files (+3,378/−801) across the milestone
- **Verification:** 18/18 REQ-IDs audited (17 satisfied, POS-02 documented deviation); lint/tsc clean; 1175 tests passing (1 known-flaky FPS test)
- **Tag:** v1.0

## Core Value

**The ONE thing that must work:** a hiring manager landing on the site (or a recruiter
viewing source) finds a coherent, senior, *verifiable* story — leadership positioning,
named awards, real testimonials, honest metrics — with an obvious way to book a
conversation. **Shipped and audit-verified in v1.0.**

## Requirements

### Validated

- ✓ Credibility: every public claim accurate and verifiable (4 named awards, real testimonials, 240K+ GrowIt everywhere, no fabricated schema, no hidden SEO) — v1.0
- ✓ Positioning: leadership-forward hero + single title lane through metadata/OG/JSON-LD ("Head of Product & Fractional CDO") — v1.0
- ✓ Readiness: above-the-fold cal.com booking CTA, tracked resume PDF, 5-client logo bar, homepage testimonials — v1.0
- ✓ Waffle product showcase: `/projects/waffle` page + "Live Product" badged grid card + dual tracked CTAs — v1.0
- ✓ Pre-existing platform: Next.js 15 App Router on Vercel, SEO JSON-LD, Motion/Radix/Tailwind v4, MDX blog, Loops newsletter — existing

### Active (next milestone candidates — not yet committed)

- [ ] Tech-debt sweep: POS-02 proof-chips spec (subhead still dense), WAF-02 badge click dead-zone, delete stale `app/data.ts` PROJECTS array
- [ ] Visual polish pass (deferred from v1.0)
- [ ] Additional case-study rewrites (deferred from v1.0)

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
*Last updated: 2026-08-15 after v1.0 Recruiter-Readiness milestone*
