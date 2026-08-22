# Roadmap: Randy Ellis Portfolio

## Milestones

- ✅ **v1.0 Recruiter-Readiness** — Phases 1-4 (shipped 2026-08-15) — [roadmap](milestones/v1.0-ROADMAP.md) · [requirements](milestones/v1.0-REQUIREMENTS.md) · [audit](milestones/v1.0-MILESTONE-AUDIT.md)
- ✅ **v2.0 Case-Study Depth** — Phases 5-10 (shipped 2026-08-22) — [roadmap](milestones/v2.0-ROADMAP.md) · [requirements](milestones/v2.0-REQUIREMENTS.md) · [audit](milestones/v2.0-MILESTONE-AUDIT.md)
- 🚧 **v3.0 Enterprise Credibility** — Phases 11-12 (roadmapped, not started) — [requirements](REQUIREMENTS.md) · [research](research/SUMMARY.md)

## Phases

**Phase Numbering:** continues from v2.0. Phase 10 was the last phase of v2.0 (shipped), so v3.0 starts at 11.

- [ ] **Phase 11: Metric Integrity Close-Out** - Remove the three unbacked sitewide figures at every live surface and repo doc, fix the `/about` OG "6 awards" bug, promote the 4 named awards to visible copy, and lock it all in with a rewritten regression test
- [ ] **Phase 12: Enterprise Legibility** - Echo and Nagarro reframed for a reader evaluating regulated, large-organization operating experience, with one grouped entry point on `/projects`

## Phase Details

### Phase 11: Metric Integrity Close-Out

**Goal**: Every unbacked figure (`2.5M+ Users Impacted`, `$50M in product value`, `800+ Designers Mentored`) is gone from every live surface and the four named repo docs, the `/about` OG image's stray "6 Design Awards" bug is fixed to 4, the 4 named awards are promoted from JSON-LD-only to visible on-page copy with issuer and category, and a rewritten regression test locks all of it in place.

**Depends on**: Phase 10 (v2.0, shipped) — first phase of v3.0, no dependency within this milestone

**Requirements**: CRED-10, CRED-11, CRED-12, CRED-13, CRED-14, CRED-15, CRED-16, PRF-01, PRF-02

**Success Criteria** (what must be TRUE):

  1. A full-repo grep for the three exact strings (`rg -n '2\.5M\+|\$50M|800\+'`) returns zero matches across `app/`, `components/`, and `lib/` — covering the homepage proof band + FAQ prose, `/services` proof band and metadata, `/about` stats grid and metadata, both OG image generators, sitewide base metadata (`lib/metadata.ts`), and the two dead modules (`animated-number-basic.tsx`, `related-content.tsx`) with the figures stripped in place — and the same three strings are absent from `PRODUCT.md`, `README.md`, `SEO_OPTIMIZATION_REPORT.md`, and `docs/reports/accessibility/implementation-roadmap.md`
  2. The 4 named awards (Davey ×2, Vega ×2) render as visible on-page copy with issuer and category — today they exist only in `lib/seo/json-ld.ts:79-84`, invisible to a human reader; the Webby stays listed as judge, never as a win
  3. `/about`'s OG image states **4** Design Awards, not 6 — closing the third recurrence of the v1.0 CRED-01 defect
  4. No stat band renders a 4-up grid holding one surviving item — verified by an actual render check across all 5 affected surfaces (homepage + `/services` via `PROOF_EXHIBITS`, `/about`'s `achievements` grid, both OG image generators), because this is not catchable by `npm run lint`, `tsc --noEmit`, or `jest`
  5. `npm run lint` → `npx tsc --noEmit` → `npm test` all pass, including `__tests__/integration/home-page-argument.test.tsx` rewritten to assert the current backed argument (not the removed figures) and a regression test keyed to `DECK-COVERAGE-AUDIT.md` IDs (SITE-01/03/04) that fails if any of the three exact strings reappears and verifies the 4 Design Awards structurally (data shape), not by string match

**Planning constraints** (hard, do not route around):

  - **CRED-14 must land in the SAME plan as CRED-10.** `__tests__/integration/home-page-argument.test.tsx:59-66` currently asserts the unbacked figures are PRESENT; it goes red the instant they're removed. Splitting figure-removal and test-rewrite across plans guarantees a red suite between them.
  - **PRF-02 is a design decision made ONCE and applied to 5 surfaces**, not solved five times. Decide the replacement stat-band layout before touching any of the 5 render sites, then apply it consistently.
  - **`app/page.tsx` is the single cross-phase file conflict with Phase 12.** This phase edits `:85` (FAQ prose, "mentored 800+ designers") and consumes `PROOF_EXHIBITS` at `:165`. Phase 12 may reword the Selected-work paragraph in the same file. This phase must fully complete — including its test rewrite — before Phase 12 opens `app/page.tsx`.
  - **PRF-01's copy is already written and sourced — do not re-derive it.** `.planning/CREDIBILITY-COPY.md` §1 carries all 4 awards traced to deck slide 28 (GrowIt! case study) with issuer and category, plus a ready-to-use awards block for the about page. Two constraints ride with it: the **Webby is a Judge credential from deck slide 2, never counted among awards won**, and §1's own Phase-1 recommendation was to *"drop the bare counter and show the named list below"* — written in v1.0, never executed, which is why `/about` ships the numeral `4` today.
  - **§1's "Where to change in code" list is STALE — do not follow it.** It names `components/core/animated-number-basic.tsx` (dead code) and `components/seo/structured-data.tsx` (deleted in Phase 10). Its JSON-LD item is already done (`lib/seo/json-ld.ts:79-84`), which is precisely how the 4 named awards became machine-visible but human-invisible. The live targets are `app/about/about-client.tsx:19-40` (local `achievements` array) and `app/about/opengraph-image.tsx`, where the stray `"6"` also lives.
  - **`/about` alone does not satisfy PRF-01.** `about-client.tsx`'s `achievements` is a local array, not an import; the homepage and `/services` read a different one (`PROOF_EXHIBITS`, `lib/data/retainer.ts`). Both must be addressed. Consolidating them is deferred as MI-4 — do not fold it in here.
  - Re-verify `components/seo/related-content.tsx`'s live/dead status (`app/blog/layout.tsx:4`'s import state) fresh at plan time before deciding whether to edit or skip it — researchers disagreed and it needs one current check, not a majority vote.

**Suggested internal order** (from research, deviate only with reason):

  1. Fix the `/about` OG "6 Design Awards" bug as its own independently-shippable commit — pure bug fix, no design decision blocking it
  2. Strip the figures from the two dead modules (`animated-number-basic.tsx`, `related-content.tsx`) in place; keep the files per the incorporate-don't-delete standing preference
  3. Decide the stat-band replacement layout once (e.g., promote the 4 named awards into the freed slots)
  4. Remove the figures from the remaining live surfaces and rewrite `home-page-argument.test.tsx` together, in the same plan
  5. Close with a full-repo grep sweep across `app/`, `components/`, `lib/`, and the 4 named repo docs as the phase's closing gate

**Plans**: TBD

**UI hint**: yes

### Phase 12: Enterprise Legibility

**Goal**: Echo and Nagarro read, across every rendered surface, as proof Randy can operate inside a regulated, large-organization environment — Echo recategorized and demonstrably promoted, its one qualitative metric resolved at the data layer, Nagarro's raw metrics reframed only after each has a recorded backing disposition — and the `/projects` page carries one real, accessible entry point into that regulated/field-operations work.

**Depends on**: Phase 11 — `app/page.tsx` must be clear of Phase 11's edits (figure removal + test rewrite complete) before this phase reopens the same file to reword the Selected-work paragraph naming Echo/Nagarro

**Requirements**: ENT-01, ENT-02, ENT-03, ENT-04, ENT-05

**Success Criteria** (what must be TRUE):

  1. Echo leads the ordering under a regulated-operations framing, verified across all THREE independent mechanisms by rendering each surface: `FEATURED_SLUGS` (`app/page.tsx:55`), the `PROJECTS` array position (`lib/data/projects.ts`), and `GlobalCaseStudyGrid`'s runtime year-parse sort — which today ranks Echo **last** because its `timeline` field (`"Alpha → Beta → Launch"`) has no year to parse
  2. No qualitative value sits in a metrics slot — verified in the rendered `CreativeWork` JSON-LD `additionalProperty` output, not only in visible copy — closing Echo's `{ label: "Call Center Stress Reduction", value: "Significant" }` gap
  3. Nagarro's raw `metrics[]` reads in organizational-design terms, with a recorded per-metric disposition (backed-by-alternate-source / downgraded-to-qualitative / accepted-as-firsthand-account) for each of NAGARRO-01..08 completed and logged *before* any reframe copy is written
  4. `/projects` has exactly one working entry point into the regulated/field-operations work — a real `<Link>` on the existing `?category=` mechanism, not a filter bar, and not attached to the section heading
  5. Cross-surface consistency holds per CRED-09 (v2.0's standard) — Echo's and Nagarro's visible copy, metadata, OG images, and JSON-LD agree with each other after this phase's edits

**Planning constraints** (hard, do not route around):

  - **ENT-03 has a HUMAN GATE.** Randy decided Nagarro resolves via firsthand-account policy, which requires a recorded per-metric disposition for NAGARRO-01..08 BEFORE any reframe copy is written — structurally identical to v2.0's CRED-08 sign-off, which was a real blocker there. **Mark the plan carrying ENT-03 `autonomous: false`.**
  - **ENT-01's category term must be collision-checked** against every project's existing `category` / `categories[]` / `tags[]` before selection — `lib/project-utils.ts` matches by case-insensitive substring, and Nagarro already carries `"Accessibility Compliance"`. If the chosen term is compliance-adjacent, the loose matcher will silently pull Nagarro into what's meant to be an Echo-specific filter.
  - **ENT-04 must call `useSearchParams()` from inside the existing `<Suspense>` boundary** in `app/projects/projects-client.tsx`, never a second call site, or static prerender breaks. It must also never attach an interactive role to the section heading — the v2.0 `TextScramble` regression (`26c7bf0`).
  - Do not rewrite Nagarro's `roleNarrative` / `decisions[]` prose — already the strongest asset on the page; the gap is narrowly the raw `metrics[]` array.
  - Do not invent a figure for Echo's constraint slot, compute a replacement aggregate anywhere, or build a multi-chip filter bar — all three are named anti-features in research (recreate CRED-07, breach the CRED-08 NDA line, or add interaction/ARIA cost for a grouping that resolves to n=1).

**Suggested internal order** (from research, deviate only with reason):

  1. ENT-02 (Echo's qualitative metric) — smallest, fully isolated, zero downstream code changes
  2. ENT-01 (Echo recategorized) — everything else in the phase depends on the final category string
  3. ENT-03 (Nagarro reframe) — human gate; dispositions recorded before copy is written
  4. ENT-04 (grouped entry point) — needs ENT-01's settled category value
  5. ENT-05 verified last, by rendering all three ordering mechanisms independently — fixing mechanisms 1 and 2 does nothing to fix the third

**Plans**: TBD

**UI hint**: yes

## Progress

**Execution Order:** Phases execute in numeric order: 11 → 12

| Phase | Milestone | Plans | Status | Completed |
|-------|-----------|-------|--------|-----------|
| 1. Credibility Fixes | v1.0 | pre-GSD (traced) | Complete | 2026-08-14 |
| 2. Positioning & Messaging | v1.0 | pre-GSD (traced) | Complete | 2026-08-14 |
| 3. Candidate Readiness | v1.0 | pre-GSD (traced) | Complete | 2026-08-14 |
| 4. Waffle Product Page | v1.0 | 3/3 | Complete | 2026-08-15 |
| 5. Foundation & Cleanup | v2.0 | 2/2 | Complete | 2026-08-15 |
| 6. Narrative Template & Data Model | v2.0 | 1/1 | Complete | 2026-08-15 |
| 7. Bespoke Convergence | v2.0 | pre-GSD (traced) | Complete | 2026-08-15 |
| 8. Content Rewrite & Credibility Guardrails | v2.0 | pre-GSD (traced) | Complete | 2026-08-16 |
| 9. Cross-Surface Verification | v2.0 | 5/5 | Complete | 2026-08-20 |
| 10. SEO Remediation | v2.0 | 10/10 | Complete | 2026-08-22 |
| 11. Metric Integrity Close-Out | v3.0 | 0/TBD | Not started | - |
| 12. Enterprise Legibility | v3.0 | 0/TBD | Not started | - |

## Backlog

- **POL-01** — visual polish pass beyond case-study surfaces (deferred from v1.0
  and v2.0)
- **POL-02** — waffle converged onto the shared template as a *case study* (it
  already shares the template as a product page)
- **Blog Article structured data** — `datePublished`/`dateModified` emit bare
  dates with no time or timezone; no `image`; `Paywalled Content` detected on a
  post that is not paywalled
- **`/services` reader conflict** — `/services` and the retainer funnel were built
  outside GSD and now own the metadata description and primary conversion path on
  a site whose PROJECT.md core value names the hiring manager as the reader.
  A positioning decision, not a queued task
- **MI-4** — consolidate `about-client.tsx`'s local `achievements` array into
  `lib/data/retainer.ts`'s `PROOF_EXHIBITS` (deferred from v3.0 — see REQUIREMENTS.md "Future Requirements")
- **EL-5** — surface Echo's already-authored but never-rendered `constraints.environmental` data (deferred from v3.0)
- **GE-3** — reuse the existing `role="status"` filter-state announcement on the new `/projects` entry point (deferred from v3.0)
- Dead-code cleanup of `enhanced-metrics-grid.tsx`, `enhanced-hover-cards.tsx` (deferred from v3.0)

---
*Last updated: 2026-08-22 — v3.0 Enterprise Credibility roadmap created (Phase 11-12)*
