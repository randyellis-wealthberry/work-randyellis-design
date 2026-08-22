# Requirements — v3.0 Enterprise Credibility

**Status:** 🔨 IN PROGRESS
**Defined:** 2026-08-22
**Phases:** 11-12 (numbering continues from v2.0)
**Core Value:** A hiring manager finds a coherent, senior, *verifiable* story — and here, every remaining figure is one Randy can stand behind, with the two large-organization engagements legible as proof of operating under constraint.

**Research basis:** `.planning/research/SUMMARY.md` (4 parallel researchers, HIGH
confidence, every load-bearing claim traced to `file:line`).

## Scope Correction (read before planning)

The staged premise for this milestone was **wrong in a way that would have shipped a no-op.**
All four researchers independently converged on the correction:

- `components/core/animated-number-basic.tsx` — named as "the source" of SITE-01/03/04 by
  both `PROJECT.md` and `v2.0-MILESTONE-AUDIT.md` — is **dead code**, zero import sites.
  It was orphaned by commit `8de7262`. Editing lines 12-15 changes nothing a reader sees.
- **There is no single source.** The three figures are hand-typed independently into
  **10 live surfaces** (see the authoritative table in `SUMMARY.md`). This is why CRED-12's
  regression test is load-bearing rather than nice-to-have: there is no definition to guard.
- **Two live defects exist that appear in no prior audit** — `app/about/opengraph-image.tsx:238`
  renders `"6"` Design Awards (third recurrence of the v1.0 CRED-01 bug), and Echo's
  `"Significant"` metric ships in live JSON-LD despite being invisible on Echo's own page.
  Both hide in generated, non-visible-to-a-human surfaces. Both prior milestones audited
  visible copy first and missed them.
- `components/seo/related-content.tsx` is **also dead** — its only import is commented out at
  `app/blog/layout.tsx:4`. Verified directly 2026-08-22, resolving a 3-vs-1 researcher split.
- `NAGARRO-35` (`"$50M+ in business impact"`) is **stale** — the text no longer exists after
  commit `4c15468` rewrote `nagarro-client.tsx` from 1,118 to 119 lines. Dropped from scope.

## Decisions Taken at Definition (Randy, 2026-08-22)

| # | Question | Decision |
|---|----------|----------|
| 1 | Nagarro's 8 metrics are all ruled `Unbacked` — reframe or remove? | **Firsthand-account policy.** Same rule v2.0 adopted for case-study content: Randy's firsthand account is a valid source, the deck is advisory. Nagarro is unrestricted (no NDA). Requires a recorded per-metric disposition first — see ENT-03. |
| 2 | What fills the stat band after removing 3 of 4 figures? | **Promote the 4 named awards** from JSON-LD-only to visible copy with issuer + category. Nothing invented; uses proof already held. |
| 3 | How should the grouped entry point land? | **One `<Link>`, no filter bar.** A multi-chip bar resolving to n=1 is an anti-feature. |
| 4 | Are repo docs (`PRODUCT.md`, `README.md`, …) in scope? | **Yes** — public on GitHub, cheap to fix while already grepping. Excluded from the regression test's scan roots. |

## v3.0 Requirements

### Metric Integrity (Phase 11)

- [ ] **CRED-10**: No rendered page displays `2.5M+ Users Impacted`, `$50M in product value`, or
      `800+ Designers Mentored` — covering the homepage proof band + FAQ prose, `/services`
      proof band, and `/about` stats grid
- [ ] **CRED-11**: No metadata or generated image carries those figures — sitewide base
      description (`lib/metadata.ts:25`), `/about` and `/services` page descriptions, and both
      OG image generators (`app/opengraph-image.tsx`, `app/about/opengraph-image.tsx`)
- [ ] **CRED-12**: A regression test keyed to `DECK-COVERAGE-AUDIT.md` IDs (SITE-01/03/04) fails
      if any of the three exact formatted strings reappears under `app/`, `components/`, or
      `lib/`, and verifies the 4 Design Awards **structurally** (data shape) rather than by
      string match. Reuses `__tests__/seo/no-legacy-schema.test.ts`'s directory walker, which
      excludes `.planning/` by construction so the audit record stays intact
- [ ] **CRED-13**: `/about`'s OG image states **4** Design Awards, not 6 — closing the third
      recurrence of the v1.0 CRED-01 defect
- [ ] **CRED-14**: `__tests__/integration/home-page-argument.test.tsx` asserts the *current*
      backed argument. It currently asserts the unbacked figures are **present** and goes red
      the instant CRED-10 lands, so it is rewritten in the same change, not after
- [ ] **CRED-15**: The two dead modules carrying the figures — `animated-number-basic.tsx`
      (zero imports) and `related-content.tsx` (only import commented out at
      `app/blog/layout.tsx:4`) — have the unbacked figures **stripped in place**, so neither can
      be revived carrying a claim this milestone removed. **The modules themselves are kept**,
      per the standing incorporate-don't-delete preference; whether either earns a home is a
      separate decision deferred past v3.0, not a deletion made under milestone pressure
- [ ] **CRED-16**: Repo docs (`PRODUCT.md`, `README.md`, `SEO_OPTIMIZATION_REPORT.md`,
      `docs/reports/accessibility/implementation-roadmap.md`) carry no unbacked figure

### Proof Presentation (Phase 11)

- [ ] **PRF-01**: The 4 named awards (Davey ×2, Vega ×2) appear as **visible on-page copy** with
      issuer and category, sourced to `CREDIBILITY-COPY.md` §1. They exist today only in
      `lib/seo/json-ld.ts:79-84` — a machine-readable claim a human reader never sees. The Webby
      stays listed as *judge*, never as a win
- [ ] **PRF-02**: Every stat band renders correctly at its reduced item count. Five surfaces were
      authored as 4-up grids (`sm:grid-cols-4`, or `space-around` for the OG flex rows); removing
      three of four items collapses each into a broken single cell. **Not catchable by lint, tsc,
      or jest** — requires a render check. One layout decision applied consistently, not solved
      five times

### Enterprise Legibility (Phase 12)

- [ ] **ENT-01**: Echo is recategorized off `"Mobile App"` into a regulated / field-operations
      framing. The chosen term is collision-checked against every project's existing
      `category` / `categories[]` / `tags[]` first — `lib/project-utils.ts` matches by
      case-insensitive substring, and Nagarro already carries `"Accessibility Compliance"`
- [ ] **ENT-02**: Echo's `{ label: "Call Center Stress Reduction", value: "Significant" }` is
      resolved at the data layer in `lib/data/projects.ts`. A qualitative word in a numeric slot
      reads as a hole where a number should be. Fixing the data fixes the live JSON-LD
      `additionalProperty` for free — there is no separate schema task
- [ ] **ENT-03**: Nagarro's raw `metrics[]` reads in organizational-design terms — **after** each
      of NAGARRO-01..08 has a recorded disposition (backed-by-alternate-source / downgraded-to-
      qualitative / accepted-as-firsthand-account). Relabeling before dispositioning repeats the
      Phase 9 `$50M` harmonization mistake. `metrics[0]` ("Nagarrians Impacted: 18,000+") is
      already org-scale and stays; the gap is indices 1-7, which flow verbatim into live JSON-LD
- [ ] **ENT-05**: Echo's promotion holds across **all three** independent ordering mechanisms —
      `FEATURED_SLUGS` (`app/page.tsx:55`), `PROJECTS` array position (`lib/data/projects.ts`),
      and `GlobalCaseStudyGrid`'s runtime sort. The third parses a year out of `timeline`; Echo's
      is `"Alpha → Beta → Launch"` with no year, so it currently falls back to `0` and ranks Echo
      **last** — silently, with no error. Each mechanism verified by rendering its surface

### Grouped Entry Point (Phase 12)

- [ ] **ENT-04**: One entry point on `/projects` leads to the regulated / field-operations work,
      built as a real `<Link>` on the `?category=` mechanism already shipped in Phase 10 (D-13)
      and already advertised by the `WebSite` `SearchAction` schema. It must call
      `useSearchParams()` from inside the existing `<Suspense>` boundary in
      `app/projects/projects-client.tsx`, never a second call site, and must never attach an
      interactive role to the section heading — the v2.0 `TextScramble` regression (`26c7bf0`)

## Future Requirements (deferred, not this milestone)

- [ ] **MI-4**: Consolidate `about-client.tsx`'s local `achievements` array into
      `lib/data/retainer.ts`'s `PROOF_EXHIBITS`. Two independent hand-authored arrays holding the
      same class of claim is the structural cause of this milestone. Real, but the Key Decisions
      log's stated preference is "bounded punch-list, not research build"
- [ ] **EL-5**: Surface Echo's already-authored but never-rendered `constraints.environmental`
      data
- [ ] **GE-3**: Reuse the existing `role="status"` filter-state announcement on the new entry point
- [ ] **POL-01**: Visual polish pass beyond case-study surfaces (deferred from v1.0)
- [ ] Dead-code cleanup of `enhanced-metrics-grid.tsx`, `enhanced-hover-cards.tsx`

## Out of Scope

- **Computing a replacement aggregate.** Blending or estimating a new "big number" to keep the
  stat band full recreates CRED-07 one release later, with a figure harder to challenge because
  it looks derived. All four researchers named this the primary anti-feature
- **Restoring "6 Design Awards."** Closed in `PROJECT.md` — only if 2 more surface with proof
- **Inventing a figure for Echo's constraint slot.** Breaches the same CRED-08 disclosure line
  (Echo = process-and-design only) that removing the original figures respected
- **Rewriting Nagarro's `roleNarrative` / `decisions[]` prose.** Already the strongest asset on
  the page; the gap is narrowly the raw `metrics[]` array
- **A multi-chip filter bar on `/projects`.** Only 1 of 8 projects is genuinely regulated /
  field-ops; a chip bar resolving to n=1 adds ARIA and interaction cost for a grouping a scanning
  reader of an 8-item list gets for free
- **A new `/projects/field-operations` route.** `PROJECT.md` Key Decision: group on `/projects`,
  never a new surface needing its own metadata, OG image, and JSON-LD
- **A decorative "NDA" badge system.** The prose already states the boundary; a badge implies a
  taxonomy the data model doesn't have
- **The `/services` dual-reader question.** `/services` and the retainer funnel own the metadata
  description and primary conversion path on a site whose core value names the hiring manager as
  the reader. Which reader wins is a positioning decision for Randy, not a queued task. Logged so
  it is not silently inherited a third time
- **Site rebuild or visual redesign.** Consistent with v1.0 and v2.0

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| _(filled by roadmap)_ | | |
