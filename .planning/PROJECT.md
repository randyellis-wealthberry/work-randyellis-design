# PROJECT: Randy Ellis Portfolio — Recruiter-Readiness Milestone

## What This Is

An existing, shipped Next.js 15 portfolio site for Randy Ellis
(`work.randyellis.design`). This milestone is **not** a rebuild — it's a
positioning + credibility upgrade so hiring managers get excited about Randy as a
design-leadership hire, and so nothing on the site fails a reference check.

**Driven by:** an executive-recruiter ingestion of the whole site (2026-08-14) plus
a review of Randy's 48-page product design deck. The deck is the verified
source-of-truth; the live site inflated or blurred several facts.

## Core Value

**The ONE thing that must work:** a hiring manager landing on the site (or a recruiter
viewing source) finds a coherent, senior, *verifiable* story — leadership positioning,
named awards, real testimonials, honest metrics — with an obvious way to book a
conversation.

## Requirements

### Validated (already shipped — from codebase map + live site)

- ✓ Next.js 15 App Router site, deployed on Vercel (`iad1`), custom domain — existing
- ✓ Homepage, About, Projects (7), case studies (LedgerIQ, METIS), MDX blog (4 posts) — existing
- ✓ SEO structured data (Person/Org/FAQ/LocalBusiness JSON-LD) — existing
- ✓ Motion animations, Radix/shadcn UI, dark mode, Tailwind v4 — existing
- ✓ Newsletter API via Loops — existing
- ✓ Waffle product showcase: standalone `/projects/waffle` page (hero + build credit, 6-feature grid, how-it-works, screenshot, dual CTAs to waffle.cards with analytics) + "Live Product" badged card in `/projects` grid — Validated in Phase 4: Waffle Product Page

### Active (this milestone — hypotheses until shipped)

- [ ] Credibility: every public claim is accurate and verifiable (awards, testimonials, metrics)
- [ ] Positioning: leadership value proposition is visible and skimmable in 10 seconds
- [ ] Readiness: obvious book-a-call path + downloadable resume + credible social proof

### Out of Scope

- Visual redesign / rebrand — the design is fine; this is about substance and coherence
- New features, blog content, or case studies — no net-new product work
- PWA revival — `next-pwa` stays disabled (Next 15 incompat), not a hiring blocker

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Deck is source-of-truth over live site | Deck has named awards, real testimonials, defensible metrics; site inflated them | — Pending |
| "4 named awards" over "6 unnamed" | Specific + verifiable beats a bigger unbacked number | — Pending |
| Remove fabricated schema + hidden-keyword SEO | Trust + search-penalty risk | — Pending |
| Coarse granularity, 3 phases | Bounded, well-understood punch-list — not a research build | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition:**
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions

**After the milestone:** full review; confirm the site would pass a recruiter's
source-view and a reference check.

---
*Last updated: 2026-08-15 after Phase 4 (Waffle Product Page) completion — all phase plans executed, verified 13/13 must-haves, human visual sign-off recorded*
