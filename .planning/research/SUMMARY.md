# Project Research Summary

**Project:** Randy Ellis Portfolio — v2.0 Case-Study Depth
**Domain:** Long-form narrative case-study content/template for a senior design-leadership portfolio (existing Next.js 15 site, content/structure problem, not infrastructure)
**Researched:** 2026-08-15
**Confidence:** HIGH

## Executive Summary

This milestone is a content and template-consistency problem, not a technology problem. All four researchers independently converged on: extend the existing typed `Project`/`processStory` model with a first-class `decisions[]` array (title, decision, rationale, outcome) and a `roleNarrative` field, render it with `@tailwindcss/typography` and a handful of new prop-driven components — no new dependencies, no MDX, no CMS. That part is low-risk and well-precedented (matches the additive, non-breaking pattern the project already used successfully for `isLiveProduct` in v1.0).

The milestone's real risk lives in two places the brief's framing ("extend the `[slug]` layout for all 8 projects") obscures. **First, routing**: only 3 of 8 projects (`growit`, `ohplays`, `ledgeriq`) are actually served by the dynamic `[slug]` template at runtime. The other 5 (`addvanced`, `echo`, `nagarro`, `rambis-ui`, `waffle`) have their own static route directories that *shadow* `[slug]` — Next.js resolves static segments before dynamic ones — and contain 700–1,300 lines each of hand-authored, bespoke JSX. "Extend `[slug]`" reaches 3 of 8 pages unless the roadmap explicitly decides whether to converge the 5 bespoke pages onto shared components or evolve them independently. `ledgeriq` compounds this: it has both a data-driven page at `/projects/ledgeriq` and a fully orphaned, unlinked 1,144-line bespoke page at root `/ledgeriq` — duplicate content that must be resolved before its copy is rewritten. There is also a real, blocking prerequisite: the `[slug]` template currently imports `Project` from the stale, duplicate `app/data.ts` (not `lib/data/types.ts`), so new fields will not typecheck until that import is fixed and `app/data.ts` deleted.

**Second, credibility.** v1.0 was built specifically to purge fabricated claims (fake testimonials, an unverifiable "6 awards" that lingered in OG images and JSON-LD after the visible copy was fixed). v2.0's own template — a mandatory "rationale" and "outcome" slot per decision, across 8 projects at once — structurally *increases* the pressure to invent plausible-sounding content to fill empty slots, exactly the failure mode v1.0 fixed. Mitigating this requires the milestone to build in, not bolt on: a per-project deck-coverage audit (Backed/Partial/Unbacked) run *before* any prose is written; an explicit "I vs. we vs. led" rule so first-person voice doesn't misattribute team-executed work (several projects have `teamSize` 3–15 with director-level titles); an NDA/confidentiality check for real, still-operating named clients (Nagarro, Echo) before publishing new specificity about them; and a dedicated cross-surface verification pass (copy vs. `generateMetadata()` vs. OG image vs. JSON-LD) at the end, explicitly modeled on the v1.0 audit remediation that closed CRED-01/CRED-03/POS-04. Skipping any of these reproduces a defect class this exact codebase has already shipped and fixed once.

## Key Findings

### Recommended Stack

No new runtime dependencies. `@tailwindcss/typography` is already installed and proven on `/blog` — apply its `prose`/`prose-invert` classes to the narrative sections of `project-detail-client.tsx`. `motion` (already the animation system) covers reading-progress and section-stagger needs via `ScrollProgress`, `useScroll`, `useInView`, all already in the repo. The one real "stack" change is a data-model addition to `lib/data/types.ts`, not a library. MDX-per-project was explicitly evaluated and rejected: projects render through a dynamic `[slug]` segment, which the native `@next/mdx` file-convention (used by the blog) cannot target per-project without a second, heavier content pipeline (`next-mdx-remote` or Velite/Contentlayer) — and it would break direct `PROJECTS` consumers (grid, OG generation, JSON-LD) and make claims harder to grep-audit, undermining the credibility-guard workflow.

**Core technologies:**
- `@tailwindcss/typography` (0.5.19, installed) — long-form narrative typography — already active via `@plugin` in `app/globals.css`, zero install cost
- `motion` (12.23.12, installed) — reading progress, section entrance choreography, in-page nav active-state — already the animation system, covers every scroll-linked need
- Existing Radix primitives (`Card`, `Badge`, `ScrollArea`) — building blocks for `DecisionCard`/TOC — no new accessibility surface to audit
- Data-model addition to `lib/data/types.ts`: `decisions[]{title, decision, rationale, outcome?}` and `roleNarrative?` — the one concrete schema change that makes the narrative structure renderable and programmatically auditable

### Expected Features

The differentiator that separates a senior/leadership narrative from a merely competent one, across every source reviewed, is **decisions stated with explicit rationale** ("I chose X because Y") — the current template has no field for this; `processStory.keyInsights` is the closest analog but reads as retrospective insight, not in-the-moment judgment. Second most load-bearing: honest imperfection (a reflection distinct from a triumphant summary) and leadership-vs-execution balance (mentoring, stakeholder influence — not just artifacts) for a Head of Product/Fractional CDO audience specifically.

**Must have (table stakes):**
- First-person voice replacing "we developed/we designed," with explicit role & team disambiguation
- Constraints stated with real specifics; drop decorative stock-photo illustrations (a live anti-pattern already in the codebase)
- 2–3 "I chose X because Y" decision beats per project with a named trade-off
- One reconciled, sourced outcome metric per decision/project (per `CREDIBILITY-COPY.md`)
- Genuine reflection/"what I'd do differently," distinct from outcome narrative
- Remove all fabricated/reused stakeholder quotes (already flagged as a v1.0-era defect); keep only the 2 verified real ones
- Remove boilerplate/templated subtext and stock constraint imagery

**Should have (differentiators, only where genuinely true):**
- Explicit "alternatives considered" (2–3 real options weighed) per decision, where the deck/memory actually supports it — never invented to fill the beat
- Leadership-signal callouts (mentoring, stakeholder influence, org-maturity impact) for projects where Randy held genuine people/stakeholder scope
- Dual-metric framing (business + user outcome together) wherever both are truthfully available

**Defer (v2.x/v3+):**
- Progressive disclosure / expandable decision depth (accordion) — defer until decision content itself exists to disclose
- Cross-case-study leadership throughline as an explicit editorial synthesis — only makes sense after all 8 individual rewrites reveal a real pattern

### Architecture Approach

Fix a blocking prerequisite first (`project-detail-client.tsx:42` imports the wrong, stale `Project` type from `app/data.ts` instead of `lib/data/types.ts` — new fields won't typecheck until repointed and `app/data.ts` deleted), then build 5 new prop-driven components (`DecisionCallout`, `CaseStudyTOC`, `ReflectionBlock`, `RoleNarrativeSection`, and a resurrected `CaseStudySection`) that accept content via props only — never the whole `Project` object — so they're usable from both the data-driven `[slug]` template and the 5 bespoke standalone pages. A prior attempt at a shared `CaseStudyLayout` (`components/case-study/`) already failed by hardcoding one project's asset paths into a "generic" component; it is dead code (imported nowhere) and should be deleted rather than reused, except for one clean, genuinely generic 35-line section wrapper worth resurrecting.

**Major components:**
1. `DecisionCallout` — renders `{decision, rationale, outcome}` as a visually distinct card (the senior-signal moment), not a plain bullet
2. `CaseStudyTOC` — static anchor nav built from a known `{id,label}[]` per page (content is structured, not parsed from prose)
3. `ReflectionBlock` — distinct pull-quote typography for genuine reflection, replacing the current plain-card treatment
4. `RoleNarrativeSection` — bridges the new first-person role narrative to existing `overview.deliverables`/`teamMembers` data
5. `lib/data/types.ts` extension — `decisions[]` + `roleNarrative`, additive/non-breaking, same pattern already proven for `isLiveProduct` in v1.0

**Do not add `decisions[]` to JSON-LD** — no clean `schema.org` mapping exists, and forcing one risks recreating the fabricated-schema problem v1.0 explicitly removed. `generateMetadata()` needs no structural change; it already derives from `description`/`longDescription`.

### THE ROUTE-SHADOWING REALITY: "All 8 Projects" Is Not One Template

This is the single most important architectural fact for scoping this milestone, and it is easy to miss if the plan is written at the "update the project template" level of abstraction.

| Slug | Route actually served | Data source | Bespoke JSX |
|---|---|---|---|
| `growit` | `[slug]` (dynamic, shared) | 100% `lib/data/projects.ts` | 0 |
| `ohplays` | `[slug]` (dynamic, shared) | 100% `lib/data/projects.ts` | 0 |
| `ledgeriq` | `/projects/ledgeriq` via `[slug]` **+ orphaned duplicate at root `/ledgeriq`** | Partial (data-driven route) / bespoke (orphan) | 1,144 (orphan, unlinked, still built/crawlable) |
| `addvanced` | `app/projects/addvanced/page.tsx` (static, shadows `[slug]`) | 0 references to `PROJECTS` despite importing it | 1,317 |
| `echo` | `app/projects/echo/page.tsx` (static) | Partial | 481 (live file is `echo-client.tsx`; a 734-line `echo-client-final.tsx` is dead code — do not edit it) |
| `nagarro` | `app/projects/nagarro/page.tsx` (static) | Partial | 1,118 |
| `rambis-ui` | `app/projects/rambis-ui/page.tsx` (static) | Partial | 406 |
| `waffle` | `app/projects/waffle/page.tsx` (static) | Live-product showcase, not a case study — explicitly out of the narrative pattern | 317 |

Next.js resolves static route segments before dynamic ones, so 5 of 8 projects will receive **zero** benefit from any change scoped only to `app/projects/[slug]/project-detail-client.tsx`. This is not hypothetical — v1.0's own history confirms static-route-shadowing was used deliberately for `waffle`. The roadmap must make an explicit, documented decision: (a) migrate the 5 bespoke pages onto the shared narrative components, deleting the standalone routes, or (b) apply the same 5 new components independently into each bespoke client file, keeping the routes but unifying the rendered narrative structure. Research recommends (b) as the lower-risk default for this milestone — rewriting 5,517 combined lines of working bespoke layout into one generic template in the same milestone as an 8-project content rewrite is disproportionate risk — with (a) as a candidate for a future milestone once all 8 share the same component-level building blocks. Whichever is chosen, "all 8 use the new template" must be verified against all 6 rendering files individually, not assumed from a single `[slug]` edit — and the `ledgeriq` duplicate route must be resolved (delete the orphan) before its content is rewritten, so copy isn't authored twice.

### Critical Pitfalls

1. **Embellishment creep** — the template's mandatory "rationale" and "outcome" slot per decision structurally increases pressure to invent plausible-sounding content when the deck is silent. Avoid by running a per-project, per-claim deck-coverage audit (Backed/Partial/Unbacked) *before* writing prose, and treating "I'm not sure where this came from" as a hard stop during self-review, not a style note. Unbacked sections get flagged to Randy, never backfilled.
2. **Cross-surface claim drift** — a claim fixed in visible copy can linger unchanged in `generateMetadata()`, OG image alt text, or JSON-LD, because these are separate code paths reading the same `PROJECTS` record. This is the exact defect class v1.0 shipped and fixed ("6 awards" lingering in OG/schema). Avoid with a mandatory grep-and-reconcile pass across `app/`, `lib/`, `components/seo/` per project, plus a dedicated final cross-surface verification phase across all 8 together — including the 5 standalone-route pages, which don't inherit fixes made to `[slug]`'s `generateMetadata()`.
3. **Sole-credit over-claiming** — a mechanical "we"→"I" swap risks misattributing team-executed work (`teamSize` 3–15, director-level titles on several projects) as solo IC work to a leadership-hiring audience who will notice. Avoid with an explicit "I vs. we vs. led" rule checked per claim against `role`/`teamSize` before finalizing any "I" statement.
4. **Confidentiality/NDA exposure** — deepening a case study for real, still-operating named clients (Nagarro, Echo) naturally pulls in more specific internal detail than was previously cleared for publication. Avoid with an explicit "cleared to publish at this depth" sign-off from Randy per project before new specificity ships, applied with extra scrutiny to employment (vs. freelance/contractor) relationships.
5. **Route-shadowing inconsistency** (see above) — treated as its own top-tier pitfall by the pitfalls researcher independently of the architecture researcher's finding, because it's the single most likely way this milestone could ship believing "all 8 are done" when only 3 actually are.

## Implications for Roadmap

Based on combined research, the milestone has a natural four-part shape. This is not prescriptive phase numbering — the roadmapper should decide exact phase boundaries — but the dependency order below is load-bearing and should not be reordered.

### Phase 0: Decisions Gate (routing + prerequisite tech-debt + audit)
**Rationale:** Both of the milestone's structural risks (route-shadowing, embellishment pressure) are cheapest to resolve before any content or template code is written, and both require a decision only a human/architecture-level call can make — not something to discover mid-rewrite.
**Delivers:** (1) explicit decision on bespoke-page convergence strategy (recommend: keep 5 standalone routes, insert shared components into each); (2) `ledgeriq` duplicate-route resolved (delete the orphaned `/ledgeriq` root page); (3) `project-detail-client.tsx` repointed from stale `app/data.ts` to `lib/data/types.ts`, and `app/data.ts` deleted; (4) a per-project deck-coverage audit table (Backed/Partial/Unbacked) produced and routed to Randy for gaps.
**Addresses:** Prerequisite for every other feature in FEATURES.md's MVP list — none of the decision/reflection content can be written credibly before the coverage audit exists.
**Avoids:** Pitfall 7 (route-shadowing), Pitfall 6 (thin-data padding), and unblocks the type-safety prerequisite architecture flagged as blocking.

### Phase A: Template + Data-Model Evolution (piloted, not applied to all 8 yet)
**Rationale:** The riskiest unknown is whether the new 5-component narrative pattern actually works when retrofitted into pre-existing, differently-structured bespoke JSX — cheaper to prove on 2 pilot projects than discover mid-rewrite across 8.
**Delivers:** `decisions[]`/`roleNarrative` added to `lib/data/types.ts`; 5 new prop-driven components built and unit-tested; wired into `growit` (pure-data pilot) and one bespoke page — `rambis-ui` is the smallest, already-partially-data-driven candidate (second pilot, proves components work when fed literal props).
**Uses:** `@tailwindcss/typography`, `motion`, existing Radix primitives (STACK.md) — zero new dependencies.
**Implements:** `DecisionCallout`, `CaseStudyTOC`, `ReflectionBlock`, `RoleNarrativeSection`, resurrected `CaseStudySection` (ARCHITECTURE.md).

### Phase B: Content Rewrite (all 8, credit-rule + source-check enforced)
**Rationale:** Only proceed once the template shape is proven on 2 pilots and the coverage audit (Phase 0) tells the writer what's genuinely backed per project — sequencing content after template avoids re-doing content work if the component design changes.
**Delivers:** First-person, decision-driven rewrite across all 8 projects; one fully-approved reference project (recommend `growit`, best deck-verified) calibrated first, then the remaining 7 against the same fixed checklist (deck-coverage audited, decisions sourced, I/we/led credit checked, metadata/OG/schema reconciled, a11y heading check).
**Addresses:** FEATURES.md's full P1 MVP list (first-person voice, decisions-with-rationale, constraints, reconciled metrics, reflection, fake-quote removal) plus P2 differentiators only where deck-verified.
**Avoids:** Pitfall 1 (fabrication), Pitfall 3 (NDA exposure — per-project sign-off gate), Pitfall 4 (sole-credit over-claiming), Pitfall 5 (generic voice/process theater), Pitfall 10 (scope creep — reference-project-first sequencing).

### Phase C: Tech-Debt Fold-In (interleavable with B, lower risk)
**Rationale:** Independent files, safe to interleave with content work rather than gating it — but must stay on its own tracked checklist so it doesn't silently absorb unrelated fixes noticed mid-rewrite (Pitfall 10).
**Delivers:** Delete `app/projects/echo/echo-client-final.tsx` (dead code); resolve POS-02 proof-chips and WAF-02 badge dead-zone (named in PROJECT.md); re-voice `ProjectFAQStructuredData` for `echo` (currently describes an unrelated "AI design system" — stale content mismatch).

### Phase Final: Cross-Surface Verification Pass
**Rationale:** v1.0 proved this must be a distinct, deliberate pass, not an assumed side effect of content rewrite — the exact defect class ("6 awards" lingering in OG/schema) is the one this milestone is most structurally likely to reproduce given the mandatory rationale/outcome slots.
**Delivers:** Before/after diff of title/meta description/OG image/JSON-LD for all 8 projects (including the 5 standalone-route pages, which don't inherit `[slug]`'s `generateMetadata()`); grep sweep for every changed claim across `app/`, `lib/`, `components/seo/`; heading-hierarchy and reduced-motion spot-check across all 8.
**Addresses:** Pitfall 2 (cross-surface drift), Pitfall 8 (SEO/OG regressions), Pitfall 9 (accessibility regressions from longer pages).

### Phase Ordering Rationale

- Routing decision and type-import fix must precede template work — content and components literally cannot typecheck or reach 5 of 8 pages otherwise.
- Deck-coverage audit must precede content writing — writing first and fact-checking after is exactly how v1.0's fabricated claims shipped in the first place.
- Template pilot (2 projects) must precede full 8-project rewrite — de-risks the component design once, not after 6 more bespoke files are already touched.
- Cross-surface verification must be a distinct final pass, not folded into "content rewrite is done" — proven necessary by v1.0's own remediation history.

### Research Flags

Needs deeper research/decision during planning:
- **Route-shadowing convergence decision** (Phase 0) — this is a scope-defining architectural choice (5 bespoke pages: converge vs. evolve independently) that the roadmap should surface explicitly to Randy/requirements, not silently resolve.
- **`ledgeriq` orphan-route resolution** — confirm no unique content in the 1,144-line orphan needs folding into the data-driven version before deletion.
- **NDA/disclosure scope for Nagarro and Echo** — requires Randy's direct input; not resolvable from research alone.

Standard patterns (skip research-phase, well-documented internally):
- **Data-model extension** — additive, non-breaking, directly precedented by v1.0's `isLiveProduct` addition.
- **Typography/component composition** — `@tailwindcss/typography` + existing Radix/Motion primitives, zero new tooling.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified against Context7 docs for `@tailwindcss/typography` v4 usage, npm registry version check, and direct codebase inspection — no external uncertainty, this is a "what's already installed" question |
| Features | MEDIUM-HIGH | Cross-verified across multiple independent UX-portfolio/hiring-manager sources plus one design-leadership-specific source (DoorDash), corroborated directly against this codebase's existing anti-pattern instances (stock imagery, fake quotes) — feature landscape itself is MEDIUM (web sources), but grounding against actual repo content is HIGH |
| Architecture | HIGH | All findings verified by direct file reads (line counts, import paths, route structure), not framework docs or inference — this is a codebase-integration question with no external unknowns |
| Pitfalls | HIGH | Grounded directly in this repo's data/code and its own documented v1.0 audit history (CRED-01/CRED-03/POS-04); general credibility/ghostwriting framing is MEDIUM (industry convention) but the load-bearing findings (route-shadowing, cross-surface drift, fabrication risk) are HIGH, traced to this exact codebase |

**Overall confidence:** HIGH

### Gaps to Address

- **Bespoke-page convergence decision (converge vs. evolve independently)** is a judgment call research can inform but not make — must be explicitly decided during requirements/roadmap creation, not left implicit.
- **Per-project deck coverage is uneven** — `CREDIBILITY-COPY.md` only deeply backs awards/testimonials/GrowIt metrics/schema cleanup; the other 7 projects' decision-level rationale needs a fresh coverage pass against the 48-page deck before content work starts. This audit is scoped as Phase 0 above, not something research could pre-resolve.
- **LedgerIQ's real-vs-composite status is ambiguous** — existing copy uses hypothetical/composite framing ("Our target client was experiencing...") that suggests it may be a concept/speculative project rather than a verified real client engagement; this must be resolved with Randy before deepening its narrative, or a hypothetical risks being presented as a verified outcome.
- **NDA/confidentiality clearance for Nagarro and Echo** cannot be determined by research — requires Randy's explicit sign-off per new specificity before publish.

## Sources

### Primary (HIGH confidence)
- Context7 `/tailwindlabs/tailwindcss-typography` — verified Tailwind v4 `@plugin` usage, `not-prose` escape hatch
- Direct codebase inspection — `lib/data/types.ts`, `lib/data/projects.ts`, `app/data.ts`, `app/projects/[slug]/project-detail-client.tsx` (full 1,080-line read), `app/projects/{addvanced,echo,nagarro,rambis-ui,waffle}/`, `app/ledgeriq/`, `components/case-study/*`, `components/seo/structured-data.tsx`, `components/seo/project-faq.tsx`, `app/sitemap.ts`, `.planning/PROJECT.md`, `.planning/CREDIBILITY-COPY.md`, `.planning/MILESTONES.md`, `.planning/codebase/ARCHITECTURE.md`
- `npm view @tailwindcss/typography version` — direct registry check

### Secondary (MEDIUM-HIGH confidence)
- [Three tips on design leaders' portfolio presentations — Design @ DoorDash](https://medium.com/design-doordash/three-tips-on-design-leaders-portfolio-presentations-5afd4e412bf8) — fetched directly, most load-bearing source for leadership-vs-execution distinction
- [Deceptive Patterns in UX (NN/g)](https://www.nngroup.com/articles/deceptive-patterns/) — authoritative source for vanity-metrics framing

### Tertiary (MEDIUM confidence)
- Multiple UX portfolio/hiring-manager guides (uxfol.io, uxplaybook.org, IxDF, Indeed Design, designcase.app, Medium/Bootcamp pieces) — WebSearch-summarized, cross-corroborating on table-stakes/anti-feature patterns, no single source treated as ground truth

---
*Research completed: 2026-08-15*
*Ready for roadmap: yes*
