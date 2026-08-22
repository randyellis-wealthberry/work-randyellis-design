# MILESTONE-CONTEXT — v3.0 Enterprise Credibility

> Staged input for `/gsd:new-milestone`. Consumed (and deleted) by that workflow
> at step 2. **Do not run new-milestone until v2.0 is closed** — its step 6 runs
> `phases.clear --confirm`, which would delete `.planning/phases/10-seo-remediation/`
> (10 plans, 9 summaries, verification checklist, screenshots).

**Blocked on:** Phase 10 plan `10-10` (`autonomous: false` — human gate: Rich
Results Test screenshots + Search Console sitemap submission), then
`/gsd:complete-milestone` for v2.0.

---

## Milestone v3.0: Enterprise Credibility

**Goal:** Every figure on the site is deck-backed or gone, and the two
large-organization engagements read as proof of operating inside regulatory and
scale constraint rather than as generic project summaries.

**Target features:**

- Metric integrity close-out — execute the Phase 5 deck audit's three
  outstanding `Unbacked` verdicts instead of reconciling copy around them
- Enterprise legibility — Echo and Nagarro reframed for a reader evaluating
  whether Randy can operate inside a regulated, large organization
- A grouped entry point for the regulated / field-operations work

## Key Context

### Why this milestone exists

`.planning/DECK-COVERAGE-AUDIT.md` (Phase 5) returned `Unbacked` verdicts on
three sitewide figures. The verdicts were recorded but never became requirements.
Phase 9 (`09-03-PLAN`) then *aligned the `$50M` wording* across surfaces —
harmonizing a claim the audit had already ruled unsupported. Cross-surface
consistency work layered on an unresolved truth question makes the problem harder
to see, because afterward every surface agrees.

| Audit ID | Claim | Verdict | Status |
|----------|-------|---------|--------|
| SITE-01 | "2.5M+ Users Impacted" | Unbacked | Still live |
| SITE-03 | "$50M in product value" | Unbacked | Still live |
| SITE-04 | "800+ Designers Mentored" | Unbacked | Still live |

All three originate in `components/core/animated-number-basic.tsx:12-15`
(`2.5`, `50`, `800`) and propagate to `/about`, `/services`, `lib/metadata.ts`,
`app/opengraph-image.tsx`, `app/about/opengraph-image.tsx`, and
`lib/data/retainer.ts` `PROOF_EXHIBITS`.

### Explicitly NOT in scope

- **"4 Design Awards" is backed.** `CREDIBILITY-COPY.md` §1 sources all four to
  deck slide 28 with issuer and category. It shares a component with the three
  unbacked figures and must survive untouched. The Webby stays listed as *judge*,
  never as a win.
- **The `/services` dual-reader question.** `/services` and the retainer funnel
  appear in neither `ROADMAP.md` nor `REQUIREMENTS.md` — built outside GSD — and
  now own the metadata description and the primary conversion path on a site
  whose `PROJECT.md` core value names the hiring manager as the reader. Resolving
  which reader wins is a positioning decision for Randy, not a queued task.
  Logged here so it is not silently inherited.
- **Site rebuild or visual redesign.** Out of scope, consistent with v2.0.

### Constraints

- CRED-07 (no invented figures) and CRED-08 (named-client disclosure for Nagarro
  and Echo) carry forward unchanged from v2.0.
- Every change must pay off for both readers — an enterprise employer and an
  enterprise client. Work that only serves one is out of scope.

---

## Proposed Requirements

### Metric Integrity

- **CRED-10**: SITE-01 / SITE-03 / SITE-04 removed at source in
  `components/core/animated-number-basic.tsx`, or replaced with deck-backed
  figures. The 4 named awards are preserved.
- **CRED-11**: Removal propagated to every consuming surface — `/about`,
  `/services`, `lib/metadata.ts`, both OG image generators, and
  `lib/data/retainer.ts` `PROOF_EXHIBITS`.
- **CRED-12**: A regression test asserts no `Unbacked`-verdict figure reappears,
  keyed to the `DECK-COVERAGE-AUDIT.md` IDs. (v1.0's lesson — the "6 awards"
  figure lingered in two surfaces until audit remediation — argues for a test,
  not a grep.)

### Enterprise Legibility

- **ENT-01**: Echo recategorized from `"Mobile App"` to a field / regulated-
  operations framing, and promoted to first position in the project ordering.
- **ENT-02**: `metrics` entry `"Call Center Stress Reduction": "Significant"`
  replaced with a real figure or the row removed — a qualitative word in a
  metrics slot reads as a hole where a number should be.
- **ENT-03**: Nagarro metrics reframed from agency-growth terms (brand
  recognition, lead count) to organizational-design terms, within CRED-07/08.
- **ENT-04**: One grouped entry point for the regulated / field-operations work.
  **Decision: a filter or grouping on `/projects`, not a new route** — far cheaper
  and avoids a surface that needs its own metadata, OG image, and JSON-LD.

## Proposed Phases

- **Phase 11 — Metric Integrity Close-Out** (CRED-10, CRED-11, CRED-12)
  Success: grep for `2.5M` / `50M` / `800+` across `app/`, `lib/`, `components/`
  returns zero; the 4 named awards render unchanged; `npm run lint`,
  `npx tsc --noEmit`, and `npm test` pass clean.

- **Phase 12 — Enterprise Legibility** (ENT-01..04) — depends on Phase 11
  Success: Echo leads the project ordering under a regulated-operations framing
  with no qualitative value in a metrics slot; Nagarro reads in org-design terms;
  `/projects` groups the field-operations work; cross-surface consistency holds
  per CRED-09.

---

*Staged 2026-08-22. Source: five-lens portfolio review, reconciled against
`DECK-COVERAGE-AUDIT.md`, `CREDIBILITY-COPY.md`, and `PROJECT.md`.*
