# Phase 5: Foundation & Cleanup - Context

**Gathered:** 2026-08-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the codebase type-safe, duplicate-free, and dead-code-free, produce the
per-claim deck-coverage audit that gates all Phase 8 content, and clear two
v1.0 tech-debt items (POS-02 proof chips, WAF-02 badge dead zone).

**Requirements:** FND-01, FND-02, FND-03, FND-04, DEBT-01, DEBT-02

**In scope:** deleting orphaned/dead routes and files, repointing imports to
`lib/data`, producing the deck-coverage audit artifact, the hero proof-chip
treatment, the grid badge click fix.

**Out of scope:** any narrative component work (Phase 6), any bespoke page
migration (Phase 7), any case-study copy rewriting (Phase 8), cross-surface
metadata reconciliation (Phase 9).

</domain>

<decisions>
## Implementation Decisions

### LedgerIQ Orphan Route (FND-02)

- **D-01:** Delete `app/ledgeriq/` (both `page.tsx` and the 1,144-line
  `ledgeriq-client.tsx`) and add a permanent (301) redirect
  `/ledgeriq → /projects/ledgeriq` in `next.config.js`. `next.config.js` has no
  `redirects()` block today — one must be added. The redirect is insurance for
  external inbound links; the route was never in `app/sitemap.ts` (which only
  emits `/projects/{slug}`), so search-engine exposure is low but not zero.
- **D-02:** Salvage **nothing** from the bespoke page into the data model. Its
  5-step process narrative (Discovery & Research → Information Architecture →
  Design System → High-Fidelity Design → Development & Testing) and its metrics
  are unverified, and every image it references (`/ledgeriq/*.jpg`) 404s because
  `public/ledgeriq/` is empty.
- **D-03:** The two LedgerIQ sources state **contradictory metrics for the same
  project**. This MUST be logged as a hard UNBACKED entry in the FND-03 audit
  for Randy to resolve before Phase 8 writes any LedgerIQ copy:

  | Bespoke `/ledgeriq` (being deleted) | Data-driven `/projects/ledgeriq` (surviving) |
  |---|---|
  | $2.3M annual cost savings | $180K annual savings |
  | 40% productivity increase | 78% payroll error reduction |
  | 60% processing-time reduction | 65% time savings per cycle |
  | 85% user satisfaction | 92% anomaly detection rate |

  Note this compounds the pre-existing STATE.md blocker that LedgerIQ's
  real-vs-composite status is ambiguous.

### Deck-Coverage Audit (FND-03)

- **D-04:** The 48-page deck (`Randy's Product Design Deck.pdf`) is **committed
  to `.planning/`** so downstream researcher/planner agents can read it directly
  on every future phase without re-supply. (Gitignore it if client sensitivity
  requires — but it must be present on disk at that path.)
- **D-05:** Granularity is **per claim, grouped by project** — one row per
  individual metric, decision, rationale, and outcome, each with a
  Backed/Partial/Unbacked verdict and a deck slide number. Not per project, not
  per section. This is the only granularity that gates Phase 8 line by line and
  makes the LedgerIQ-class contradiction impossible to miss.
- **D-06:** The audit runs **bidirectionally**: (a) verdict every claim
  currently rendered across the 7 in-scope projects, AND (b) inventory deck
  material *not yet used* on the site. Half (b) is what actually feeds Phase 8's
  decisions/rationale/reflection content — auditing only existing claims tells
  Phase 8 what to delete, not what to write.
- **D-07:** For any project the deck barely covers or doesn't cover, the audit
  produces a **per-project "open questions for Randy"** list with specific,
  answerable asks (e.g. "what was the actual outcome metric on rambis-ui?").
  Phase 8 MUST NOT write those sections until answered. Nothing is invented.
- **D-08:** Expect a large number of Unbacked rows and treat that as a correct
  result, not a failure. `.planning/CREDIBILITY-COPY.md` (the v1.0 extraction,
  100 lines) covers **GrowIt only** — grep counts across the 7 projects are
  growit 6, ohplays 0, ledgeriq 0, addvanced 0, echo 0, nagarro 0, rambis-ui 0.
  Six of seven projects have zero verified source in the repo today, so FND-03
  is a genuinely new deep extraction, not a summary of existing work. It is
  likely the largest single work item in the phase.

### Code Cleanup (FND-01, FND-04)

- **D-09:** **Delete the `/archive` route entirely** — remove `app/archive/`,
  remove the footer link at `app/footer.tsx:17`, and drop
  `ARCHIVE_ITEMS`/`ARCHIVE_CATEGORIES` (and the now-unused `ArchiveItem` type
  handling) from both data files. Rationale: `/archive` is linked site-wide from
  the footer and crawlable (`app/robots.ts` allows `/`), and it renders 4
  entirely fabricated articles whose links all point to `https://example.com/…`
  and whose thumbnails all 404 (`public/images/archive/` does not exist). This
  is the same fabricated-content defect class v1.0 purged; it survived because
  the v1.0 audit was scoped by REQ-ID to named pages and `/archive` wasn't one.
  Nothing real is lost — both datasets are 100% placeholder.
- **D-10:** Delete `app/data.ts` (775 lines). It is only *partially* stale, so
  three importers must be repointed to `@/lib/data` first:
  - `app/projects/[slug]/project-detail-client.tsx:42` — `import type { Project } from "../../data"` → `@/lib/data/types` (this is the FND-01 blocker; new narrative fields will not typecheck until it is fixed)
  - `app/about/about-client.tsx:22` — `getEmail`
  - `__tests__/about-professional-experience.test.tsx:46` — `jest.mock("@/app/data", …)`
  - `app/archive/archive-client.tsx:19` — resolved by D-09 (route deleted)

  These repoints are mechanical. `lib/data/projects.ts` is a strict superset
  (8 slugs vs 4) and `WORK_EXPERIENCE` is identical between the two files, so
  no data is lost.
- **D-11:** Delete **all 6** files in `components/case-study/` — including
  `case-study-section.tsx`. All 6 have zero importers. `case-study-layout.tsx`
  hardcodes Echo's image paths (`/projects/echo/research1.jpg`, …) inside a
  supposedly generic component, which is the failure that killed the first
  attempt at a shared layout.
- **D-12:** **Carry forward to Phase 6 (do not lose):** the only salvageable
  thing in `case-study-section.tsx` was its *accessibility contract*, not its
  markup — `id` + `role="region"` + `aria-labelledby={`${id}-heading`}`. That
  contract is exactly what Phase 6's `CaseStudyTOC` needs to anchor to, and the
  live template does not provide it today. Phase 6's section wrapper MUST keep
  that contract but render its heading via `ScrambleSectionTitle` (used 39×
  in `project-detail-client.tsx` — it IS this platform's section-heading
  language). Resurrecting the old plain centered `<h2>` would fork the design
  language into two heading treatments.
- **D-13:** Delete `app/projects/echo/echo-client-final.tsx` — zero importers,
  clean delete. The live file is `echo-client.tsx` (this is the file Phase 7's
  MIG-02 must migrate; the `-final` variant must never be reintroduced).

### Tech Debt (DEBT-01, DEBT-02)

- **D-14:** POS-02 proof chips — keep a **short** `TextGradientScroll`
  positioning line, then add **3 chips**. Target shape:

  ```
  Design leader who ships AI products.

  I turn startups into design-led organizations — and write
  the code to prove it.

    [ 20 years in design ]  [ 8+ yrs leading teams ]
    [ Ships React / Next.js / TypeScript ]

    [Book a 30-min call]  [View work]
  ```

  The chips carry proof the counter block **doesn't**. Root cause of POS-02
  reading unresolved after v1.0: the current 43-word subhead at
  `app/page.tsx:544` restates *two of the four* stats rendered ~200px below it
  in `AnimatedNumberBasic` (2.5M Users Impacted · 4 Design Awards · $50M in
  product value · 800 Designers Mentored). The fix is dividing labor between the
  two blocks, not adding a third. Keep the `AnimatedNumberBasic` block as-is.
- **D-15:** WAF-02 badge dead zone — add `pointer-events-none` to the
  absolutely-positioned badge wrapper at `app/projects/projects-client.tsx:238`
  so clicks fall through to the `<Link>` beneath. One class, zero layout risk,
  correct semantics (the badge is informational, not interactive). Do NOT
  restructure the JSX or wrap the whole card in a Link.
  The `waffle-client.tsx:118` badge sits in normal flow with no overlay and is
  **not** affected — leave it alone.

### Milestone-Level Constraint (applies through Phases 6–8)

- **D-16:** **No AI slop.** Narrative components must be built from this
  platform's existing design language and primitives, not generic templated
  blocks. Enforcement mechanism: this CONTEXT records the concrete list below,
  and **Phase 6's `UI-SPEC.md` MUST encode it** so `gsd-ui-checker` can issue
  BLOCK verdicts on violations. (Phase 6 is already flagged `UI hint: yes` in
  ROADMAP.md, so `/gsd:ui-phase` runs there — this rides existing machinery
  rather than adding a doc nobody reads.)

  **Build on (allowlist — existing primitives):**
  - `components/ui/scramble-section-title.tsx` — the section-heading language (39 uses in the live template)
  - `components/ui/card.tsx`, `badge.tsx`, `separator.tsx` — Radix-based base primitives
  - `components/ui/border-trail-card.tsx`, `animated-metric-card.tsx`, `enhanced-metrics-grid.tsx` — existing richer card treatments worth deriving from
  - `components/motion-primitives/` — `in-view`, `text-effect`, `scroll-progress`, `disclosure`, `glow-effect`, `magnetic`
  - `components/core/` — `text-scramble`, `border-trail`, `tilt`
  - `@tailwindcss/typography` `prose`/`prose-invert` (already installed, proven on `/blog`)

  **Banned outright:**
  1. **Generic icon+heading+body cards** — the lucide-icon / bold-heading / gray-body-text card every AI-generated landing page ships. Not acceptable as the default treatment for `DecisionCallout` or `ReflectionBlock`.
  2. **Uniform template fill across projects** — every project rendering the identical section set in identical order regardless of what its content supports. (Reinforces CNT-08.)
  3. **New color / type / spacing outside the system** — no new palette entries, type-scale steps, or spacing values. Existing zinc scale, the amber accent, established type/spacing tokens only.
  4. **Decorative stock or placeholder imagery** — no filler images to pad a section. Already a live anti-pattern flagged in research and found again on `/archive` in this discussion.

### Plan Structure & Verification

- **D-17:** Split Phase 5 into **two plans that run in parallel** (no dependency,
  no shared files):
  - **Plan A — Deck-coverage audit** (FND-03): the deck read + per-claim table + open-questions list.
  - **Plan B — Code cleanup & tech debt** (FND-01, FND-02, FND-04, DEBT-01, DEBT-02).

  Rationale: the audit may stall on Randy's input (deck delivery, open
  questions); that must not block mechanical code wins. Plan A is the only
  Phase 8 blocker.
- **D-18:** Verification for Phase 5 is **all four** of:
  1. **Standard gate** — `npm run lint` → `npx tsc --noEmit` → `npm test`. (Note: `npm run build` is NOT a gate — `next.config.js` sets `ignoreDuringBuilds`/`ignoreBuildErrors`.)
  2. **Link-integrity sweep** — grep `app/`, `components/`, `lib/` for any surviving reference to `/archive`, `/ledgeriq`, `app/data`, `components/case-study`, or `echo-client-final`. Catches the dead-href class lint and tsc both miss.
  3. **Test-suite audit for deleted surfaces** — find any test asserting on `/archive`, `ARCHIVE_ITEMS`, or the case-study components and remove/update them deliberately rather than discovering them red.
  4. **Manual browser check** — load `/`, `/projects`, `/projects/ledgeriq`: chips render, badge click navigates, `/ledgeriq` redirect works, footer no longer links to `/archive`.

  Known baseline (not a regression): `__tests__/performance/animation-load-testing.test.tsx` is flaky (measures FPS in jsdom).

### Claude's Discretion

- Audit artifact filename/location — suggest `.planning/DECK-COVERAGE-AUDIT.md`.
- Exact definition of **Partial** vs Backed vs Unbacked — propose: *Backed* = claim appears in the deck (or another linked verifiable source) with a slide/URL citation; *Partial* = the deck supports the substance but not the exact figure/wording; *Unbacked* = no source found.
- Whether non-deck verifiable sources (App Store 4.8★, Chameleon Collective URL, LinkedIn) count as Backed — propose yes, **if** the audit row carries the source link. Both of those specific items are already flagged as needing verification in PROJECT.md.
- Exact chip copy/wording and chip component treatment for D-14 (must obey the D-16 allowlist/bans).
- Whether `ArchiveItem` type and `lib/data`'s `ARCHIVE_ITEMS` are deleted or left as unused exports after D-09.
- Ordering of file deletions and commit granularity within Plan B.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone & Requirements
- `.planning/ROADMAP.md` §Phase 5 — phase goal + 5 success criteria
- `.planning/REQUIREMENTS.md` §Foundation, §Tech-Debt Fold-In — FND-01..04, DEBT-01/02 wording and the Out-of-Scope table
- `.planning/PROJECT.md` §Key Decisions — v1.0 decision log and its lessons (incl. "grep all surfaces incl. OG generators")
- `.planning/STATE.md` §Accumulated Context — carries the LedgerIQ real-vs-composite blocker and the Chameleon URL / 4.8★ verification carry-overs

### Credibility Source-of-Truth
- `.planning/CREDIBILITY-COPY.md` — v1.0 verified extraction. **Covers GrowIt only** (see D-08); do not assume it covers the other 6 projects
- `.planning/` — `Randy's Product Design Deck.pdf` (48pp) to be placed here per D-04; the source-of-truth for FND-03
- `.planning/milestones/v1.0-MILESTONE-AUDIT.md` — POS-02 (line 45, 82) and WAF-02 (line 91) deviation records that DEBT-01/02 close

### Research
- `.planning/research/SUMMARY.md` — architecture + credibility findings; documents the `project-detail-client.tsx` type-import blocker and the dead `components/case-study/` attempt
- `.planning/research/PITFALLS.md`, `.planning/research/ARCHITECTURE.md`
- `.planning/codebase/ARCHITECTURE.md`, `CONVENTIONS.md`, `STACK.md`

### Project Instructions
- `CLAUDE.md` §Verifying Changes — the lint → tsc → test order, and the warning that `npm run build` is not a validation gate

</canonical_refs>

<code_context>
## Existing Code Insights

### Files this phase deletes
- `app/ledgeriq/page.tsx` + `app/ledgeriq/ledgeriq-client.tsx` (1,144 lines) — orphan, zero internal links, all images 404
- `app/archive/` (route + client) and the `app/footer.tsx:17` link — fabricated placeholder content
- `app/data.ts` (775 lines) — partially live; see D-10 for the three repoints
- `components/case-study/` — all 6 files, zero importers
- `app/projects/echo/echo-client-final.tsx` — zero importers

### Files this phase edits
- `app/projects/[slug]/project-detail-client.tsx:42` — the FND-01 type-import blocker
- `app/about/about-client.tsx:22` — `getEmail` repoint
- `__tests__/about-professional-experience.test.tsx:46` — jest mock path
- `app/page.tsx:544` — the 43-word `TextGradientScroll` subhead (DEBT-01)
- `app/projects/projects-client.tsx:238` — badge wrapper (DEBT-02)
- `next.config.js` — add a `redirects()` block (currently has none)

### Reusable Assets
- `lib/data/` — `index.ts`, `types.ts`, `projects.ts`, `static-data.ts`. `types.ts` already exports `Project`, `getEmail`, `EMAIL_ENCODED`, `PROJECT_CATEGORIES`. `projects.ts` is a strict superset of `app/data.ts`'s PROJECTS (8 slugs vs 4)
- `components/ui/scramble-section-title.tsx` — the platform's section-heading language
- `components/ui/badge.tsx` — already used for the Live Product badge; the amber treatment (`bg-amber-600 dark:bg-amber-500 text-zinc-950`) is the established accent from Phase 4
- Full primitive inventory for Phase 6's use is enumerated in D-16's allowlist

### Established Patterns
- **Static routes shadow `[slug]`** — Next.js resolves static segments first, which is why `/projects/echo` (static dir) bypasses the template while `/projects/ledgeriq` (no dir) falls through to it. This is also how `/ledgeriq` at root became an unreviewed duplicate
- `app/sitemap.ts` derives project URLs from `PROJECTS` — it only ever emits `/projects/{slug}`, so deleted static routes need no sitemap edit
- Literal Tailwind utilities over CSS custom properties (`tailwind.config.js` is dead code in this Tailwind v4 setup) — v1.0 decision, still holds
- Additive, non-breaking data-model changes (the `isLiveProduct` pattern)

### Integration Points
- The FND-01 type repoint is the hard prerequisite for Phase 6's `decisions[]`/`roleNarrative` fields — they will not typecheck until it lands
- The FND-03 audit output is the hard gate on Phase 8's content scope
- D-12's accessibility contract is the hand-off into Phase 6's section wrapper
- D-16's allowlist/bans are the hand-off into Phase 6's `UI-SPEC.md`

</code_context>

<specifics>
## Specific Ideas

- The hero chip layout is locked to the shape shown in D-14 (short prose line
  above, 3 chips below, dual CTAs beneath, `AnimatedNumberBasic` block
  unchanged further down).
- User's framing, verbatim in spirit: *"I want these case studies to not be AI
  slop, it should be unique using the platform design language and components."*
  Captured concretely as D-16.
- Preference established across this discussion: prefer the option that
  **surfaces a contradiction for a human to resolve** over the option that
  quietly picks a winner (D-03, D-07). This mirrors the v1.0 fabrication-purge
  discipline.

</specifics>

<deferred>
## Deferred Ideas

- **"$50M in product value"** (`components/core/animated-number-basic.tsx:14`,
  labelled "in product value") appears nowhere in `.planning/CREDIBILITY-COPY.md`.
  Not touched in Phase 5 — logged as a claim the FND-03 audit must verdict, and
  reconcile in Phase 9's cross-surface pass if it fails.
- **Real `/archive` content** — populating an archive with genuine artifacts
  (talks, workshops, real articles) is content work needing deck/Randy input.
  The route is deleted in Phase 5; re-introducing it with real content is a
  future milestone, not v2.0.
- **Broader placeholder/`example.com` sweep** — this discussion found fabricated
  content on `/archive` only because FND-01 forced the question. A repo-wide
  sweep for other placeholder content was raised and not pursued; it belongs
  alongside Phase 9's cross-surface verification if it happens at all.
- **`/projects/ledgeriq`'s own metrics** — the surviving page's figures (78%,
  $180K, 92%, 65%) are not verified either. Not caveated or pulled in Phase 5;
  they go through the FND-03 audit like every other claim, and Phase 8 acts on
  the verdict.

</deferred>

---

*Phase: 5-Foundation & Cleanup*
*Context gathered: 2026-08-15*
