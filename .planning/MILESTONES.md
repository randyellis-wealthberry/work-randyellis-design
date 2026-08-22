# Milestones

## v2.0 Case-Study Depth (Shipped: 2026-08-22)

**Phases completed:** 6 phases (5, 6, 9, 10 with GSD artifacts; 7 and 8 executed without any — no directory, no git history — verified via milestone audit), 18 tracked plans, 31 REQ-IDs
**Stats:** 221 commits, 353 files (+44,454/−25,294), 2026-08-15 → 2026-08-22
**Delivered:** The 7 case studies now show *how Randy decides*, not just what he shipped — first-person decision narratives with rationale, reconciled across every surface, on a fully remediated SEO foundation.
**Audit:** `.planning/milestones/v2.0-MILESTONE-AUDIT.md` — `passed_with_notes` (30/31 verified; CRED-07 sitewide gap accepted as debt; MIG-01..04 restated to the shipped architecture)

**Key accomplishments:**

- **Decision narratives across all 7 case studies (Phase 8, CNT-01..08):** every project carries typed `decisions[]{title, decision, rationale, outcome}`, `roleNarrative` and `processStory`. Depth varies honestly by project — growit 5 decisions, the rest 2 — rather than being padded to a uniform count.
- **One shared template, not four components (Phases 6-7, TPL/MIG):** the plan specified `DecisionCallout`/`CaseStudyTOC`/`ReflectionBlock`/`RoleNarrativeSection`; what shipped is a single `components/case-study/case-study-template.tsx` plus `diagrams` and `section-chrome`, imported by all five standalone project pages — and it pulled waffle into the same system as a bonus.
- **Cross-surface reconciliation (Phase 9, CRED-09):** visible copy, `generateMetadata()`, OG images and JSON-LD brought into agreement across 7 projects and the 5 standalone routes that don't inherit `[slug]`'s metadata, behind TDD'd helpers in `lib/metadata.ts`.
- **Full SEO remediation (Phase 10, SEO-01..05):** stale Workbox service worker replaced with a self-unregistering kill switch and PWA artifacts removed; `/_next/` unblocked for Googlebot with an explicit AI-crawler allow group; dev-only routes deleted; structured data consolidated to server-rendered Person/WebSite/CreativeWork/Article with LocalBusiness, Organization, ProfessionalService and all FAQ schema removed (verified 0 occurrences live); sitemap timestamped.
- **Live verification with proof (Phase 10, 14/14):** Rich Results Test clean on three sampled URLs — zero errors; Search Console domain property created and DNS-verified; sitemap submitted with status Success and 19 pages discovered. Every row backed by a committed artifact.

**Known deferred items at close:** CRED-07 sitewide gap — SITE-01 (`2.5M+`), SITE-03 (`$50M`), SITE-04 (`800+`) were ruled `Unbacked` by FND-03's own deck audit and remain live across five surfaces; Phase 9 aligned the `$50M` wording rather than removing the claim. Scoped into v3.0 as CRED-10..12. Also: blog Article dates lack time/timezone and an `image`; `Paywalled Content` detected on a non-paywalled post; `/services` reader conflict unresolved; phases 07-08 lack GSD artifacts (compensated by direct-codebase audit, as v1.0 did for phases 1-3).

**New standing dependency:** the apex `google-site-verification` TXT record on `randyellis.design` now carries Search Console ownership. Removing it forfeits the property and its history.

---

## v1.0 Recruiter-Readiness (Shipped: 2026-08-15)

**Phases completed:** 4 phases (1-3 executed pre-GSD-artifacts, verified via milestone audit; 4 with full GSD chain), 3 tracked plans, 18 REQ-IDs
**Stats:** 49 commits, 64 files (+3,378/−801), 2026-08-14 → 2026-08-15
**Delivered:** Portfolio transformed from inflated-claims IC framing to verifiable leadership positioning with friction-free recruiter conversion, plus a live-product proof point (Waffle).
**Audit:** `.planning/milestones/v1.0-MILESTONE-AUDIT.md` — passed after inline remediation `514de29` (3 blockers closed: CRED-01 About "6 awards", CRED-03 OG "100K+", POS-04 IC-forward metadata lane)

**Key accomplishments:**

- **Credibility purge (Phase 1, CRED-01..05):** All fabricated content removed — fake testimonials (Sarah Chen et al.), unverifiable "6 Design Awards" → 4 named awards, aggregateRating/placeholder-telephone schema, hidden keyword-stuffing block; GrowIt metrics reconciled to 240K+ everywhere.
- **Leadership positioning (Phase 2, POS-01..05):** Hero rewritten leadership-forward ("Head of Product & Fractional CDO" / "Design leader who ships AI products"); single title lane extended through metadata, OG images, and JSON-LD during audit remediation.
- **Recruiter conversion (Phase 3, RDY-01..04):** Above-the-fold cal.com booking CTA, tracked resume PDF download, 5-client logo bar, real-testimonials homepage section.
- **Waffle product page (Phase 4, WAF-01..04):** Standalone `/projects/waffle` showcase (hero → 6-feature grid → 3-step how-it-works → screenshot → dual tracked CTA), amber accent contrast-safe both themes, "Live Product" badge card in `/projects` grid, 36 passing tests, human-verified 6/6 checkpoint items (closed threats T-04-01/T-04-02).
- Shipped to main via PR #47 (merge commit `7db0645`); 13/13 phase-04 verification truths + 18-REQ milestone audit passed.

**Known deferred items at close:** 0 open artifacts. Tech debt: POS-02 chips-spec deviation (documented), WAF-02 badge click dead-zone, stale dead code `app/data.ts` PROJECTS array, phases 1-3 lack per-phase GSD verification artifacts (compensated by direct-codebase audit).

---
