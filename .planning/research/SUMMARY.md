# Project Research Summary

**Project:** Randy Ellis Portfolio — v3.0 Enterprise Credibility
**Domain:** Remediation milestone on a shipped Next.js 15 portfolio (metric-integrity regression test, Echo/Nagarro reframing, a projects grouping UI) — NOT a greenfield build
**Researched:** 2026-08-22
**Confidence:** HIGH

## Executive Summary

**All four researchers independently traced the codebase and converged on the same headline conclusion: the milestone's staged premise is wrong, and the roadmap must be built from the corrected map, not the original one.** `components/core/animated-number-basic.tsx`, cited by both `PROJECT.md` and `.planning/milestones/v2.0-MILESTONE-AUDIT.md` as "the source" of the three unbacked figures (2.5M+ users, $50M product value, 800+ designers mentored), is dead code — zero import sites anywhere in `app/`, `components/`, or `lib/`. It was retired the same day this research ran, when commit `8de7262` rewrote the homepage to state its proof figures in markup instead of counting up to them from a component. There is no single source to edit: the same three numbers are hand-typed, independently, into somewhere between 8 and 12 live files depending on how a "surface" is counted — not the 5-6 the milestone brief assumed. The four researchers also independently surfaced two live defects that exist in **no prior audit**: `app/about/opengraph-image.tsx:238` still renders "6" Design Awards (a third recurrence of the exact bug v1.0's CRED-01 was supposed to have purged sitewide), and Echo's already-flagged-Unbacked `"Significant"` metric ships today in live JSON-LD (`additionalProperty`) via `buildCreativeWorkSchema`, even though Echo's own rendered page never shows that line.

**The recommended approach requires zero new dependencies.** Everything needed — `fs`/`path` source-scanning inside Jest (with direct precedent in `__tests__/seo/no-legacy-schema.test.ts`), the `next/og` `ImageResponse` API already imported in both OG generators, and the `/projects?category=` filter mechanism — is already installed and, in the filter's case, already built and shipped (Phase 10, D-13) with no visible UI trigger. The work is disciplined reuse and targeted editing, not new plumbing. The single biggest scope-sizing risk the research surfaces is not a missed file — it's a layout problem: five different stat-band grids (`sm:grid-cols-4`) were authored for exactly four peer items, and removing three of four figures collapses each into a visually broken single cell unless the container is explicitly redesigned at each site. This is a design decision, not a data edit, and should be made once and applied consistently.

**Key risks and how the research says to mitigate them:** (1) trusting the audit-cited dead-code file as the edit surface — mitigated by grepping for the exact formatted strings (`"2.5M+"`, `"$50M"`, `"800+"`) rather than starting from any cited component; (2) a currently-green test (`__tests__/integration/home-page-argument.test.tsx:62`) that asserts the unbacked figures are present, which will go red the instant they're removed and must be rewritten in the same change, not after; (3) relabeling Nagarro's raw `metrics[]` for "org-design tone" without resolving that `DECK-COVERAGE-AUDIT.md` already ruled all 8 of its metrics `Unbacked` — polishing wording around an unresolved truth question repeats the exact Phase 9 `$50M`-harmonization mistake the project's own retrospective already names as a lesson; (4) building a multi-chip filter bar for the grouped entry point when only 1 of 8 projects (Echo) actually belongs to a regulated/field-ops bucket — the research verdict is a single link/pill on the existing URL mechanism, not new filter UI.

## Key Findings

### Recommended Stack

No new runtime or dev dependencies are needed for any of the three v3.0 capabilities (STACK.md, HIGH confidence — every claim read directly from repo source or verified against current Next.js docs via Context7). The only "stack" work is reuse of existing patterns:

**Core technologies (already installed, reused as-is):**
- **Jest (`fs`/`path` source-scanning)** — the regression-test mechanism; already proven twice in this repo (`__tests__/seo/no-legacy-schema.test.ts`'s recursive file walker, `__tests__/projects/projects-category-filter.test.tsx`'s raw-source assertions). No ESLint rule, no standalone script — this repo has no Husky/pre-commit infrastructure, so anything outside `__tests__/` wouldn't be enforced by `npm test`.
- **`next/og` `ImageResponse`** — bundled with `next` 15.5.9, already the import in both `app/opengraph-image.tsx` and `app/about/opengraph-image.tsx`. Confirmed via Context7 as the current, non-deprecated path; only a CSS subset (flex/absolute positioning, no grid) is supported, which both generators already respect.
- **The existing `?category=` filter (`lib/project-utils.ts`, `app/projects/projects-client.tsx`)** — fully built and already live-wired to a `WebSite` `SearchAction` JSON-LD schema. A grouped entry point is additive UI on top of this, not a new filtering system.

**Explicitly rejected as unnecessary:** a new filter/tab library (`@radix-ui/react-tabs` is installed but not the right fit — it manages simultaneous-DOM panel switching, not shareable/crawlable navigation state), a custom ESLint rule (no local-rule infrastructure exists), `ts-jest` (`next/jest` already compiles test files via SWC).

### Expected Changes (this milestone's "features")

This is a close-out milestone — "feature" means a concrete fix to an existing surface. FEATURES.md tags each item by capability: **[MI]** metric integrity (CRED-10/11/12), **[EL]** enterprise legibility (ENT-01/02/03), **[GE]** grouped entry point (ENT-04).

**Must ship (satisfies the milestone's committed REQ-IDs), all P1:**
- **[MI-1]** Remove the three `Unbacked` figures at every live surface (see "Authoritative Surface List" below)
- **[MI-2]** Rewrite `__tests__/integration/home-page-argument.test.tsx`, which currently asserts the unbacked figures ARE present
- **[MI-3]** Promote the 4 named, backed awards (Davey ×2, Vega ×2) from JSON-LD-only to visible on-page copy
- **[EL-1]** Recategorize Echo away from `"Mobile App"` and promote it in `/projects` ordering
- **[EL-3]** Resolve Echo's qualitative `"Significant"` metric at the data level (fixes the JSON-LD gap for free — no separate schema-layer task)
- **[EL-4]** Reframe Nagarro's raw `metrics[]` array (not its already-correct case-study prose)
- **[GE-1]** One entry point on `/projects`, built on the existing `?category=` mechanism
- **[GE-2]** That entry point as a real interactive element, never attached to the section `<h2>`

**Strengthens the argument, no open REQ-ID requires it (P2, "add after if there's room"):**
- **[MI-5]** Named-exhibit replacement content for the reduced stats band (4 Design Awards, GrowIt's 240K+/4.8★, real testimonials, Live Product — Waffle) instead of a blended/invented aggregate
- **[GE-3]** Reuse the existing `role="status"` filter-state announcement pattern
- **[EL-5]** Surface Echo's already-authored but never-rendered `constraints.environmental` data

**Defer past this milestone (P3):**
- **[MI-4]** Consolidate `about-client.tsx`'s local `achievements` array into `retainer.ts`'s `PROOF_EXHIBITS` — real, but the Key Decisions log's own stated preference is "bounded punch-list, not research build"
- Dead-code cleanup of `animated-number-basic.tsx`, `enhanced-metrics-grid.tsx`, `enhanced-hover-cards.tsx`

**Anti-features (would look like progress, would undermine the milestone) — all four researchers converge here:**
- Computing a new blended/estimated aggregate to keep a "big number" after removal — this recreates CRED-07 one release later with a number that's harder to challenge
- Restoring "6 Design Awards" without 2 more surfacing with proof — explicitly closed in `PROJECT.md`
- Inventing specific figures for Echo's constraint slot — breaches the same CRED-08 NDA line as restoring the original figures would
- Rewriting Nagarro's `roleNarrative`/`decisions[]` prose "to be more enterprise" — the prose is already the strongest asset on the page; the gap is narrowly the raw `metrics[]` array
- **A multi-chip filter bar across `/projects`** — only 1 of 8 projects (Echo) belongs to a regulated/field-ops bucket; a chip bar resolving to n=1 adds interaction/ARIA cost for a grouping a scanning reader gets for free once Echo sits early in an 8-item list. External filter-UX guidance (UXPin, WAI-ARIA) backs this: chip/tab filters earn their cost for genuine multi-bucket filtering, not a near-binary split.
- A new `/projects/field-operations` route — `PROJECT.md`'s Key Decision is explicit: filter/group on `/projects`, not a new route
- A decorative "NDA" badge system — the existing prose already states the boundary plainly; a badge implies a taxonomy that doesn't otherwise exist in the data model

### Architecture Approach

**Zero schema/type changes are needed.** `Project` (`lib/data/types.ts`) already has every field ENT-01..03 needs: `category: string` (freeform in practice — not enforced against the dead `PROJECT_CATEGORIES` enum), `categories?: string[]`, `metrics?: {label,value}[]`, `featured: boolean`. The architecture work is entirely data edits plus one small UI addition, traced end to end:

**Major components / mechanisms:**
1. **Two independent stat-literal arrays** — `lib/data/retainer.ts`'s `PROOF_EXHIBITS` (feeds homepage + `/services`) and `app/about/about-client.tsx`'s local `achievements` (feeds `/about` only) — structurally parallel but not the same object, don't share field names or order. "They propagate" (the phrasing in `v2.0-MILESTONE-AUDIT.md`) is editorial shorthand for "the same mistake was pasted repeatedly," not an import graph.
2. **Two self-contained OG image generators** (`app/opengraph-image.tsx`, `app/about/opengraph-image.tsx`) — hand-built flex layouts, no shared helper component, each with its own copy of the figures and (in the about generator's case) the live "6" bug.
3. **`buildCreativeWorkSchema` (`lib/seo/json-ld.ts:126-172`)** — reads `project.metrics` and `project.category` directly from the raw `Project` object on Echo's and Nagarro's static pages. This means fixing `lib/data/projects.ts` fixes the grid row, the homepage snippet, AND the JSON-LD in one edit each — there is no separate "fix the schema" task.
4. **`app/projects/projects-client.tsx`** — a client component that already reads `useSearchParams().get("category")` and filters via `lib/project-utils.ts`'s case-insensitive substring match across `name`/`category`/`categories[]`/`tags[]`. Wrapped in `<Suspense fallback={null}>` in the server-component parent specifically because Next 15 requires it for `useSearchParams()` on a statically prerendered route — any new filter UI must call `useSearchParams()` from inside this existing boundary, not a second call site, or `next build` (not part of the documented verify gate) silently breaks.

### Critical Pitfalls

Top findings from PITFALLS.md (17 pitfalls total, all traced to file:line in this repo, not generic advice):

1. **Trusting the audit-cited dead-code file as the edit surface** — an executor who edits `animated-number-basic.tsx` sees green tests and a plausible diff while all four live surfaces stay unchanged. Prevention: start from `rg -n '"2\.5M\+"|"\$50M"|"800\+"'`, not from the cited file; delete the dead file outright once done rather than leaving it edited-but-orphaned.
2. **Deleting 3-of-4 stat-band items without redesigning the container** — `sm:grid-cols-4` layouts collapse into one lonely cell at five separate render sites; this is not catchable by lint/tsc/test, only by an actual render check.
3. **The About OG image's live "6 Design Awards" bug** — undetected by both the v1.0 remediation grep and the entire v2.0 audit, because greps for the phrase "6 Design Awards" don't match a bare `"6"` sitting near an unrelated label three lines away.
4. **A currently-passing test asserts the exact values being removed** (`__tests__/integration/home-page-argument.test.tsx:59-66`) — writing a *new* regression test does nothing to fix this; it's a separate file that stays green while this one goes red unless both are edited together.
5. **Relabeling Nagarro's metrics without resolving their `Unbacked` status** — `DECK-COVERAGE-AUDIT.md` already ruled all 8 (NAGARRO-01..08) `Unbacked` because no deck slide mentions Nagarro at all; reframing only the labels repeats the exact Phase 9 `$50M`-harmonization mistake the project's own retrospective names as a lesson — polished wording makes an unresolved truth question *harder* for a future audit to spot, not easier.

## Implications for Roadmap

Based on combined research, the milestone should keep its two-phase structure (`PROJECT.md` already numbers it Phases 11-12), sequenced rather than parallelized, for one specific structural reason detailed below.

### Phase 11: Metric Integrity Close-Out

**Rationale:** Architecturally independent of Phase 12 — all edits live in sitewide surfaces (`retainer.ts`, `about-client.tsx`, both OG generators, `lib/metadata.ts`, `/services`) that never touch `lib/data/projects.ts`. Sequenced first because it's the smaller, better-precedented body of work and because its test-suite fix must land before Phase 12 risks reopening the one file both phases touch (see "Cross-Phase File Conflict" below).

**Delivers:** The three `Unbacked` figures (2.5M+, $50M, 800+) removed from every live surface; the live "6 Design Awards" OG bug fixed to 4; the 4 named awards promoted to visible copy; the locking regression test rewritten in the same change; `animated-number-basic.tsx` deleted as dead code.

**Addresses:** MI-1, MI-2, MI-3 (P1); optionally MI-5 (stat-band replacement content) and MI-4 (data-source consolidation, likely deferred).

**Avoids:** Pitfalls 1-6 (dead-code false source, grid collapse, OG "6" bug, undercounted surfaces, existing-test collision, regression-test scoping).

**Suggested internal order** (from ARCHITECTURE.md §4b):
1. Fix the "6 Design Awards" OG bug as its own small, independently-shippable commit — pure bug fix, doesn't need to wait on the harder "what replaces the 3 figures" design decision
2. Delete `animated-number-basic.tsx`; resolve `related-content.tsx`'s live/dead status (see disagreement note below) before deciding whether to edit or ignore it
3. Decide the replacement layout for the "4 items → 1 item" grid collapse **once**, apply it consistently across the five affected render sites (`retainer.ts`-fed pages, `about-client.tsx`, both OG generators)
4. Rewrite `home-page-argument.test.tsx`'s figure assertions
5. Run a full repo grep sweep (`rg -rn '2\.5M\+|\$50M|800\+'` scoped to `app`/`components`/`lib`) as the phase's closing gate, mirroring Phase 9's own `09-03-PLAN.md` pattern

### Phase 12: Enterprise Legibility + Grouped Entry Point

**Rationale:** Entirely inside `lib/data/projects.ts` and the `app/projects/*` tree — no data dependency on Phase 11. Sequenced second purely because of the shared-file risk on `app/page.tsx` (below), not because of any technical blocker.

**Delivers:** Echo recategorized (off `"Mobile App"`) and promoted within `/projects` ordering; Echo's qualitative `"Significant"` metric resolved at the data level (fixes its live JSON-LD `additionalProperty` for free); Nagarro's raw `metrics[]` reframed toward org-design vocabulary with an explicit per-metric backing disposition recorded (not just relabeled); one grouped entry point added to `/projects` on the existing `?category=` mechanism, built as an accessible real `<Link>`.

**Addresses:** EL-1, EL-3, EL-4, GE-1, GE-2 (P1); optionally GE-3, EL-5 (P2).

**Avoids:** Pitfalls 7-17 (adjective-swap laundering, prose-restated figures, Nagarro's 8 Unbacked metrics relabeled-not-resolved, three-mechanism "promote to first" ambiguity, dead `PROJECT_CATEGORIES` enum, substring-filter false positive pulling Nagarro into an "Echo-only" filter, Suspense/prerender break, `SearchAction` schema drift, heading-semantics a11y recurrence, third-badge-color dilution, JSON-LD re-verification).

**Suggested internal order** (from ARCHITECTURE.md §4c):
1. **ENT-02 (Echo's qualitative metric) first** — smallest, fully isolated, zero downstream code changes
2. **ENT-01 (Echo recategorized)** — the one edit everything else in the phase depends on, since the grouped entry point needs the *final* category string
3. **ENT-03 (Nagarro reframing)** — can run in parallel with ENT-01/02 unless the "shared category" decision also changes Nagarro's `category` field, in which case do both category changes together
4. **ENT-04 (grouped entry point) last** — depends on ENT-01/03's final category value being settled

### Cross-Phase File Conflict

**`app/page.tsx` is the single file both phases touch, and the only reason to sequence rather than parallelize.** Phase 11 edits `app/page.tsx:85` (FAQ prose: "mentored 800+ designers") and consumes `PROOF_EXHIBITS` at `:165`. Phase 12, if the homepage's "Selected work" paragraph (naming EchoDrive and Nagarro) is reworded as part of the enterprise reframing, touches the same ~250-line client component. Running Phase 11 to completion first — including its test rewrite — removes its edits from the diff surface before Phase 12 opens the file, and avoids stacking two waves of red tests on the same component. Every other file in the two phases is a clean split (confirmed by ARCHITECTURE.md's full touchpoint matrix: `lib/data/projects.ts`, `app/projects/*` are Phase-12-only; `lib/data/retainer.ts`, `about-client.tsx`, both OG generators, `lib/metadata.ts` are Phase-11-only).

### The "4 Items → 1 Item" Stat-Band Problem — Biggest Scope-Sizing Risk

Flagged independently by ARCHITECTURE.md (§1c) and PITFALLS.md (Pitfall 2) as the single biggest risk to sizing Phase 11 correctly: this is not "delete 3 array elements," it is "redesign 5 stat bands around 1 surviving figure." Five grid-shaped surfaces — `retainer.ts`'s `PROOF_EXHIBITS` (rendered on homepage + `/services`), `about-client.tsx`'s `achievements`, and both OG generators' hand-built flex rows — are all authored for exactly four peer items (`sm:grid-cols-4`, or `justifyContent: space-around` for three OG cells). Deleting the unbacked entries without changing the container leaves a single `<dd>/<dt>` pair or a lone flex child floating in a grid built for four — visually broken to exactly the enterprise-credibility-conscious reader this milestone exists to convince, and not catchable by `npm run lint` / `tsc --noEmit` / `npm test` — it requires an actual render check. This is a UI/content decision that should be made once (per MI-5's named-exhibit recommendation, or another approach Randy chooses) and applied consistently, not solved independently five times.

### Regression-Test Approach

Both STACK.md and PITFALLS.md converge on the same two-layer design, reusing existing precedent rather than inventing new test infrastructure:

1. **Match the exact formatted string, not a bare digit.** `"2.5M+"`, `"$50M"`, `"800+"` have zero collision risk (verified by repo-wide grep); bare-number regexes (`/\b800\b/`, `/\b50\b/`, `/\b2\.5\b/`) produce real false positives today — `fontWeight: "800"`, SVG coordinates, a Web Vitals TTFB budget, and a legitimate, differently-scoped `"2.5K+"` metric at `lib/data/projects.ts:1174`.
2. **Reuse `__tests__/seo/no-legacy-schema.test.ts`'s directory walker** (`collectSourceFiles([app, components, lib])`) rather than writing a new one — it already excludes `node_modules`, `.next`, `out`, `.git`, `dist`, and, by construction (it never lists them as roots), `.planning/`, `docs/`, and root `*.md` files, sidestepping the 22 legitimate `.planning/` hits and the two known illustrative-example false positives (`DESIGN.md`, `animated-metric-value.tsx`'s JSDoc).
3. **Verify "4 Design Awards" structurally, not by string match** — assert the actual data shape (`PROOF_EXHIBITS`/renamed equivalent has exactly one entry, `value === "4"`, label matches `/design award/i`) rather than asserting a bare `"4"` is present, since `"4"` alone has near-unlimited legitimate occurrences across the codebase (`grid-cols-4`, `h-4 w-4`, etc.).
4. **Layer a rendered-output check on top of the source-level one**, mirroring `home-page-argument.test.tsx`'s own existing pattern — this catches cases where data was fixed but a hardcoded JSX string wasn't, which pure source-grep can't.

### Grouped Entry Point — The n=1 Problem

Every researcher that examined the eight projects' actual `category`/`categories`/`tags` fields converged on the same finding: **only 1 of 8 projects (Echo) is genuinely regulated/field-ops work today.** Every other project is consumer social/sports (growit, ohplays), enterprise fintech SaaS (ledgeriq), career-tech (addvanced), design leadership/strategy (nagarro — which becomes the second member only *if* Phase 12 deliberately gives it a shared category term), open-source design systems (rambis-ui), or AI/ML SaaS (waffle). This is why FEATURES.md and PITFALLS.md both rule a multi-chip filter bar an anti-feature: it would resolve to "everything" or "the one item" with no second use, adding ARIA/interaction cost a scanning reader of an 8-item list doesn't need. The recommended mechanism (GE-1) is a single `<Link href="/projects?category=...">` using the URL param the site already advertises via its `WebSite` `SearchAction` schema. PITFALLS.md adds a sharp collision warning here: Nagarro's existing `tags` already include `"Accessibility Compliance"` — if the chosen filter term is anything "compliance"-adjacent, the loose substring matcher (`lib/project-utils.ts`) will silently pull Nagarro into what's meant to be an Echo-specific regulated-work filter. The filter term must be checked against every project's existing `tags`/`categories`/`category` for collisions before it's chosen.

### "Promote Echo to First" — Three Unrelated Mechanisms

PITFALLS.md's Pitfall 10 traces a genuine ambiguity that all four phase items depend on being resolved explicitly, because there is no `order` field on `Project`:

1. **Homepage featured order** — `app/page.tsx:55`, `const FEATURED_SLUGS = ["waffle", "echo", "growit"]`. Echo is already 2nd of 3; a one-line array edit.
2. **`/projects` grid array order** — literal position in `lib/data/projects.ts`'s `PROJECTS` array (Echo is currently 5th of 8); preserved as-is through filtering, never sorted.
3. **`GlobalCaseStudyGrid`'s runtime recommendation-widget sort** — sorts by `featured`, then `views`, then a year parsed via regex out of the `timeline` string. **Echo's `timeline` field is the literal string `"Alpha → Beta → Launch"` — it contains no year at all.** The regex match returns nothing, the fallback year is `0`, and Echo silently ranks **last** in this specific widget — the opposite of "promoted" — with zero errors or warnings. Fixing mechanisms 1 and 2 does nothing to fix this third one; each must be verified independently by rendering the actual surface.

### Open Decisions — Belong to Randy, Not to a Planner

The following are genuine content/product calls the research surfaced but explicitly did not resolve on Randy's behalf; the roadmap should flag these as decisions to make during Phase 11/12 planning, not default-implement:

- **What replaces the collapsed stat band** — MI-5's named-exhibit format (4 Design Awards, GrowIt's 240K+/4.8★, testimonials, Live Product — Waffle) is the researched recommendation, but the final content/layout choice is Randy's, not automatic.
- **Nagarro's 8 `Unbacked` metrics** — each of NAGARRO-01..08 needs an explicit disposition recorded (backed-by-alternate-source / downgraded-to-qualitative / accepted-as-firsthand-account, per Pitfall 9) before the metrics are reframed. Whether alternate backing exists (LinkedIn, press, an internal Nagarro reference) is unresolved and is Randy's to answer.
- **Echo's new category term** and whether it's shared with Nagarro (making them mutually related "for free" via the existing exact-match `relatedProjects` logic) — undecided; affects GE-1's target string.
- **Whether to give Echo's `timeline` field a real year** so `GlobalCaseStudyGrid`'s regex-based sort ranks it correctly, or to explicitly accept that this specific recommendation widget won't reflect the "promoted" intent — Randy's call on scope.
- **Whether root docs (`PRODUCT.md`, `README.md`, `SEO_OPTIMIZATION_REPORT.md`, `docs/reports/accessibility/implementation-roadmap.md`) count as "the site" for this milestone's grep-and-fix purposes** — PITFALLS.md flags this as a genuine gray zone the task's own `.planning/` exemption doesn't resolve; ARCHITECTURE.md deprioritizes them as "not shipped HTML." Both are defensible; the choice needs an explicit answer, not a silent default.
- **`MI-4`/`EL-5` (data-source consolidation, surfacing Echo's `constraints.environmental`)** — real value, explicitly optional; whether they fit inside this milestone's "bounded punch-list" framing is Randy's scope call, not a research conclusion.

### Research Flags

Phases likely needing deeper research or an explicit decision-recording step during planning:
- **Phase 12:** Nagarro's per-metric backing disposition (NAGARRO-01..08) is unresolved and may warrant a short research/verification spike (checking for alternate backing sources) before the reframe copy is finalized — not because the pattern is technically unclear, but because the underlying truth question is open.

Phases with standard, well-precedented patterns (safe to skip `--research-phase`):
- **Phase 11:** The regression-test mechanism, OG-image editing constraints, and data-array edits all have direct, already-proven precedent in this exact repo (`no-legacy-schema.test.ts`, existing `ImageResponse` usage). The one non-technical open item (stat-band replacement content) is a design/content decision, not a research gap.
- **Phase 12 (data edits, filter UI):** The `?category=` filter infrastructure, `Badge`/`Link` accessibility patterns, and JSON-LD derivation are all already built and traced end-to-end; only the Nagarro-disposition question above needs extra care.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Every claim read directly from repo source files (`package.json`, `jest.config.js`, `tsconfig.json`, `eslint.config.mjs`) or verified against current Next.js docs via Context7 (`/vercel/next.js`, non-deprecated `next/og` import confirmed). No inference. |
| Features | HIGH (codebase claims) / MEDIUM (external domain findings) | Dependency and gap claims verified file:line against this repo. External domain-pattern claims (NDA case-study writing, filter-chip UX guidance, enterprise-buyer evaluation criteria) are WebSearch-sourced, cross-checked across 2-3 results per query, explicitly marked MEDIUM by the researcher — not independently primary-source-verified the way the file:line findings are. |
| Architecture | HIGH | Every claim traced to file:line in the actual working tree, including a live `git show` on the commit (`8de7262`) that retired the audit-cited component. Explicitly marks anything unverifiable as LOW — none of the load-bearing claims fell into that bucket. |
| Pitfalls | HIGH | Grounded in direct codebase inspection (file:line evidence) plus the project's own audit trail (`v1.0`/`v2.0` MILESTONE-AUDIT.md, `DECK-COVERAGE-AUDIT.md`) and a currently-live, currently-passing test suite whose exact collision point was traced, not inferred. |

**Overall confidence:** HIGH — but see the explicit disagreement and gaps below; the four researchers were independently thorough and mostly convergent, and where they diverge it is due to different counting methodologies or one researcher checking something the others didn't, not contradictory evidence.

### Where the Researchers Disagree

**Total live-surface count.** All four agree the milestone brief's "5-6 surfaces" premise is wrong and the true count is materially higher, but they report different numbers because they count differently, and no single number should be treated as final without re-verification at plan time:
- **STACK.md says "eight confirmed files"** — a file-count basis that lists each source-of-truth file once (e.g., counts `lib/data/retainer.ts` as "the homepage source" without separately listing `app/page.tsx`'s or `app/services/services-client.tsx`'s render call-sites as their own rows).
- **FEATURES.md says "at least ~12 live locations"** — a more granular occurrence-count basis, separately counting `app/page.tsx`'s bio prose (`:85`) apart from its `PROOF_EXHIBITS` render, and both of `app/about/page.tsx`'s two metadata description strings.
- **ARCHITECTURE.md is the most granular and file:line-traced source** — its own summary states "9 live rendering surfaces + 1 live regression test + 3 confirmed-dead files + 1 stale audit finding to drop," with a 17-row table giving explicit file:line for every hit, including the two that turned out NOT to be live surfaces at all (see below). **This is the table to build the master edit list from** (reproduced below) because it is the only one that individually verified each candidate file's import/render status rather than grep-matching the figure strings alone.
- **PITFALLS.md doesn't give a single total** but flags "at least 5 real files" beyond the 4 originally-named surfaces + 2 OG generators — specifically root-level docs (`PRODUCT.md`, `README.md`, `SEO_OPTIMIZATION_REPORT.md`, `docs/reports/accessibility/implementation-roadmap.md`) that STACK.md and FEATURES.md don't mention and ARCHITECTURE.md explicitly deprioritizes as "NOT SHIPPED HTML."

**`components/seo/related-content.tsx:255` — live or dead.** This is a direct factual disagreement, not just a counting-method difference. **STACK.md, FEATURES.md, and PITFALLS.md all list it as a live surface** requiring an edit (each independently found the string `"2.5M+ users"` at line 255 and treated the file as rendered). **ARCHITECTURE.md is the only one that traced the import site** and found `app/blog/layout.tsx:4` has the `RelatedContent` import commented out — concluding the component is never rendered anywhere and is DEAD, alongside `animated-number-basic.tsx`. This should be re-verified at Phase 11 plan time (a fresh check of `app/blog/layout.tsx`'s current import state) before deciding whether to edit the file or explicitly skip it as confirmed-dead.

### Authoritative Surface List (reconciled, file:line-traced, ARCHITECTURE.md basis)

| # | Surface | File:line | Figures | Status |
|---|---|---|---|---|
| 1 | Homepage proof band | `app/page.tsx:165-179` (render) + `lib/data/retainer.ts:48-51` (data, `PROOF_EXHIBITS`) | 2.5M+, $50M, 800+, 4 | LIVE |
| 2 | Homepage FAQ prose | `app/page.tsx:85` | "mentored 800+ designers" (prose) | LIVE |
| 3 | `/services` proof band | `app/services/services-client.tsx:189-199` (renders same `PROOF_EXHIBITS`) | 2.5M+, $50M, 800+, 4 | LIVE |
| 4 | `/services` metadata description | `app/services/page.tsx:10` | 2.5M+, $50M | LIVE |
| 5 | `/about` stats grid | `app/about/about-client.tsx:19-40` (independent `achievements` array, not an import of `PROOF_EXHIBITS`) + `:455-469` (render) | 2.5M+, 4, $50M, 800+ | LIVE |
| 6 | `/about` bio metadata description | `app/about/page.tsx:10` | 2.5M+ | LIVE |
| 7 | `/about` OG metadata description | `app/about/page.tsx:27` | 2.5M+, 4 awards, $50M | LIVE |
| 8 | Root OG image | `app/opengraph-image.tsx:118,143,168` | 2.5M+, $50M, 800+ (no awards cell exists in this file) | LIVE |
| 9 | About OG image | `app/about/opengraph-image.tsx:161,212,238,264` | 2.5M+, **"6" [live bug — should be 4]**, $50M, 800+ (separate prose bullet) | LIVE — third recurrence of v1.0 CRED-01 |
| 10 | Sitewide base metadata | `lib/metadata.ts:25` | 2.5M+, $50M | LIVE — fallback `<meta name="description">` for every page without its own override |
| 11 | Homepage regression test | `__tests__/integration/home-page-argument.test.tsx:59-66` (STACK.md cites `:62` for the array itself) | Asserts `["2.5M+","$50M","800+","4"]` are ALL present | LIVE TEST — will fail the instant #1 changes; must be rewritten in the same change |
| — | `components/core/animated-number-basic.tsx:12-15` | 2.5, 4, 50, 800 | **DEAD** — zero import sites in `app`/`components`/`lib`; wrongly cited as "the source" by `PROJECT.md` and `v2.0-MILESTONE-AUDIT.md`; retired in effect by commit `8de7262` |
| — | `components/seo/related-content.tsx:255` | "2.5M+ users" | **DISPUTED** — 3 of 4 researchers call it live; ARCHITECTURE.md traced `app/blog/layout.tsx:4`'s import as commented-out and calls it dead. Re-verify at plan time. |
| — | Nagarro "$50M+ business impact" (previously `nagarro-client.tsx:552/577` per `DECK-COVERAGE-AUDIT.md:494`, finding `NAGARRO-35`) | — | **STALE, DROP FROM SCOPE** — file rewritten from 1,118 to 119 lines by commit `4c15468`; confirmed absent by full read of the current file |
| — | `app/projects/opengraph-image.tsx` | — | **NOT A CONSUMING SURFACE** — confirmed by full read; no version of the three figures present |
| — | `PRODUCT.md`, `README.md`, `SEO_OPTIMIZATION_REPORT.md`, `docs/reports/accessibility/implementation-roadmap.md:636,693` | various | **NOT SHIPPED HTML per ARCHITECTURE.md; flagged as a genuine gray-zone decision per PITFALLS.md** — repo docs a human/LLM might grep, never rendered to a browser. `SEO_OPTIMIZATION_REPORT.md` also still separately contains the old "6 design awards" wording as a documented historical state. Randy's call whether these count as "the site" for this milestone. |

**Echo's live JSON-LD defect (not in any prior audit):** `lib/data/projects.ts`, Echo's `metrics` array, third entry: `{ label: "Call Center Stress Reduction", value: "Significant" }` (ruled `Unbacked` as ECHO-05 in `DECK-COVERAGE-AUDIT.md`). Invisible on Echo's own rendered page — `echo-client.tsx:67-71` passes an explicit `proof` prop that overrides the template's default metrics fallback — but flows unfiltered into the live `CreativeWork` JSON-LD `additionalProperty` array via `buildCreativeWorkSchema` (`lib/seo/json-ld.ts:166-171`), called from `app/projects/echo/page.tsx`. A structured-data-only surface holding a problem the visible page already fixed — same failure class as the About OG "6" bug.

**Nagarro's metrics — audit status, not just wording:** `.planning/DECK-COVERAGE-AUDIT.md` (NAGARRO-01 through NAGARRO-08) already ruled **all eight** of Nagarro's raw `metrics[]` entries `Unbacked` — "No slide in the 48-page deck mentions Nagarro" — with an open, unresolved question (audit lines 673-680) about whether alternate backing (LinkedIn, press, an internal Nagarro case study) exists. `metrics[0]` ("Nagarrians Impacted: 18,000+") is already org-scale framed and fine as-is on the grid headline and homepage snippet; the gap is indices 1-7, which read like a marketing case study and flow verbatim into live JSON-LD.

### Gaps to Address

- **`related-content.tsx` live/dead status** — re-verify `app/blog/layout.tsx`'s current import state before Phase 11 planning locks in the edit list; don't silently trust either the 3-researcher majority or the 1-researcher dissent without a fresh check.
- **Nagarro's 8 `Unbacked` metrics disposition** — no source material currently answers whether alternate backing exists; needs Randy's input, possibly with a short verification pass, before Phase 12's reframe copy is finalized.
- **Root-doc scope decision** (`PRODUCT.md`, `README.md`, etc.) — explicitly unresolved; needs a stated decision (fix now / note-and-defer / out of scope) recorded in the Phase 11 plan rather than a silent omission.
- **Stat-band replacement content** — MI-5's named-exhibit format is a research recommendation, not a decision Randy has made; the roadmap should surface this as a required design decision early in Phase 11, not assume it.
- **Echo's shared category term with Nagarro** — undecided; blocks finalizing GE-1's target filter string and the exact-match `relatedProjects` bonus effect.

## Sources

### Primary (HIGH confidence — direct repo verification)
- Direct repo inspection across all four research files: `package.json`, `jest.config.js`, `tsconfig.json`, `eslint.config.mjs`, `lib/data/types.ts`, `lib/data/projects.ts` (full Echo/Nagarro/GrowIt entries + all 8 `category` lines), `lib/data/retainer.ts`, `lib/metadata.ts`, `lib/seo/json-ld.ts`, `lib/project-utils.ts`, `app/page.tsx`, `app/about/about-client.tsx`, `app/about/page.tsx`, `app/services/page.tsx`, `app/services/services-client.tsx`, `app/opengraph-image.tsx`, `app/about/opengraph-image.tsx`, `app/projects/opengraph-image.tsx`, `app/projects/page.tsx`, `app/projects/projects-client.tsx`, `app/projects/[slug]/page.tsx`, `app/projects/echo/echo-client.tsx`, `app/projects/echo/page.tsx`, `app/projects/nagarro/nagarro-client.tsx`, `app/projects/nagarro/page.tsx`, `components/core/animated-number-basic.tsx`, `components/seo/related-content.tsx`, `components/ui/animated-metric-value.tsx`, `components/ui/badge.tsx`, `components/ui/tabs.tsx`, `components/ui/global-case-study-grid.tsx`, `components/case-study/case-study-template.tsx`, `components/case-study/section-chrome.tsx`, `__tests__/integration/home-page-argument.test.tsx`, `__tests__/seo/no-legacy-schema.test.ts`, `__tests__/projects/projects-category-filter.test.tsx`
- `.planning/PROJECT.md`, `.planning/MILESTONES.md`, `.planning/RETROSPECTIVE.md`, `.planning/CREDIBILITY-COPY.md`, `.planning/DECK-COVERAGE-AUDIT.md` (SITE-01..06, ECHO-01..37, NAGARRO-01..35), `.planning/milestones/v1.0-MILESTONE-AUDIT.md`, `.planning/milestones/v2.0-MILESTONE-AUDIT.md`, `.planning/milestones/v2.0-phases/09-cross-surface-verification/09-CROSS-SURFACE-MATRIX.md` and `09-03-PLAN.md`/`09-03-SUMMARY.md`
- `git log`/`git show` on commits `8de7262` ("refactor(home): rewrite the homepage as one argument"), `4c15468` ("converge 8 case studies on one editorial template"), `26c7bf0` ("fix(a11y): stop TextScramble overriding heading semantics"), `514de29` (v1.0 inline remediation)
- Repo-wide `rg`/grep sweeps for `2.5M`, `$50M`, `800+`, `AnimatedNumberBasic`, `PROJECT_CATEGORIES` across the working tree — used to empirically confirm both true edit sites and false-positive risk of naive matching
- Context7 `/vercel/next.js` (via `npx ctx7@latest`) — "ImageResponse from next/og... bundled or separate package, edge runtime constraints" and CSS-subset support — HIGH confidence, current docs

### Secondary (MEDIUM confidence — cross-checked, not primary-source-verified)
- FEATURES.md's "External domain findings": fractional-executive/consulting positioning research (named proof over aggregates), NDA-constrained case-study writing guidance (IxDF, Smart Interface Design Patterns), enterprise B2B-buying committee research (Forrester/Gartner, cited via secondary sources), filter-chip UX guidance (UXPin, WAI-ARIA Authoring Practices) — each cross-checked across 2-3 WebSearch results per query, explicitly marked MEDIUM by the researcher

---
*Research completed: 2026-08-22*
*Ready for roadmap: yes*
