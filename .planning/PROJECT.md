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

## Current Milestone: v3.0 Enterprise Credibility

**Phases:** 11-12 (numbering continues from v2.0)

**Goal:** The site agrees with itself and names its proof, and the two
large-organization engagements read as proof of operating inside regulatory and
scale constraint.

> **Rescoped 2026-08-22.** The original goal ("every figure deck-backed or gone")
> inverted `DECK-COVERAGE-AUDIT.md`, which states at `:34` that `Unbacked` means
> *"not found in this deck… **This is not a defect and requires no action**"* and
> at `:37` that the non-deck-source rule was removed because *"Randy's own account
> of his engagements is a source."* The three sitewide figures are accurate and stay.

**Target features:**
- Self-consistency and named proof — fix the one surface still claiming 6 design
  awards, and show the four named awards where a human can read them
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

### Active (v3.0 Enterprise Credibility — committed)

- [ ] CRED-13 / PRF-01 / CRED-12: `/about`'s OG image says 4 Design Awards (it
      says 6 today, contradicting three other surfaces); the 4 named awards
      promoted from JSON-LD-only to visible copy; consistency pinned by a test
- [ ] REC-01: the withdrawn metric-removal premise corrected wherever recorded
- [ ] ENT-01..05: Echo recategorized and promoted across all three ordering
      mechanisms; the qualitative value in its metrics slot resolved; Nagarro
      reframed in org-design terms; one grouped entry point for the regulated /
      field-operations work

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
| Deck demoted from gate to advisory reference (2026-08-15) | Randy's firsthand account is the real source; the deck was blocking real content | ⚠ Mixed — unblocked Phase 8, but the reversal was recorded only in the audit; every downstream summary kept the pre-reversal framing and restaged the `Unbacked` rows as debt in v3.0. Corrected 2026-08-22 (REC-01) |
| `Unbacked` figures are accurate and stay (2026-08-22) | The audit says so in its own verdict definitions: `Unbacked` = absent from a 48-page PDF scoped to two case studies, not a finding of falsehood. Five of seven projects were never in it | ✓ Good — withdrew a whole phase of removal work built on a misreading. Lesson: read a document's own definitions before acting on how another doc summarized it |
| DNS TXT over meta tag for Search Console verification | ~~v3.0 CRED-11 edits `lib/metadata.ts`; a token there is a silent-removal risk~~ **CORRECTED 2026-08-22 (REC-01):** CRED-11 is void (see REQUIREMENTS.md §"Voided requirements"); DNS TXT was still the right call independent of that — a static meta tag remains fragile against any future `lib/metadata.ts` edit | ✓ Good — survives redeploys, covers all subdomains |
| Inline audit remediation over closure phase | 3 blockers = ~7 file edits; full GSD chain disproportionate | ✓ Good — fixed + verified same session |

## Context

Verify changes via `npm run lint` → `npx tsc --noEmit` → `npm test` (build is NOT a
validation gate — ignores lint/type errors). Known flaky: `animation-load-testing.test.tsx`
(FPS in jsdom). Booking link: cal.com/randyellis/30min (`BOOKING_URL` in `lib/constants.ts`).

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-08-22 — started v3.0 Enterprise Credibility milestone*
