# Feature Research

**Domain:** Portfolio/credibility presentation for senior design leadership; enterprise-buyer evaluation of a fractional executive's case-study evidence
**Researched:** 2026-08-22
**Confidence:** HIGH — every dependency below was verified directly against this repository (file:line); domain-pattern claims are corroborated by 2+ independent external sources and marked with confidence where they rest on a single source

## How to read this document

This is a *close-out and reframing* milestone, not a green-field build, so "feature" below
means "a concrete change to an existing surface," not a new product capability. Every row
carries a capability tag so the roadmapper can group phases:

- **[MI]** — Capability 1, Metric integrity close-out (CRED-10/11/12)
- **[EL]** — Capability 2, Enterprise legibility for Echo + Nagarro (ENT-01/02/03)
- **[GE]** — Capability 3, Grouped entry point for regulated/field-ops work (ENT-04)

A load-bearing finding up front, because it changes the shape of the work: **the standalone
case-study pages for Echo and Nagarro (`app/projects/echo/echo-client.tsx`,
`app/projects/nagarro/nagarro-client.tsx`) are already enterprise-legible.** Nagarro's page
already runs a "span of control" ledger (18,000+ org / 36 countries / 15 direct reports / 8
months) instead of agency-growth metrics, and Echo's page already shows `100% ELD compliance
/ 2 Platforms designed / On-site Research method` — no qualitative word in a numeric slot, no
invented specificity. Both pages pass a custom `proof` array to `CaseStudyTemplate` that
already overrides the raw data. **What is NOT reframed is the raw `Project.metrics[]` array
in `lib/data/projects.ts`**, which independently feeds three other surfaces the case-study
pages don't control: the `/projects` grid row, the homepage featured-project snippet, and —
critically — the CreativeWork JSON-LD `additionalProperty` array that both static pages build
straight from `project.metrics` via `buildCreativeWorkSchema(project)`
(`lib/seo/json-ld.ts:126-172`, called from `app/projects/echo/page.tsx` and
`app/projects/nagarro/page.tsx`). So Echo's live structured data currently emits
`{"name":"Call Center Stress Reduction","value":"Significant"}` as a schema.org
`PropertyValue` even though the human-readable page next to it never shows that line. This is
a cross-surface reconciliation gap of exactly the kind CRED-09 fixed in v2.0 — same failure
mode, different surface pair (visible copy vs. JSON-LD instead of copy vs. metadata).

## Feature Landscape

### Table Stakes (Required for this milestone to be true to its own goal)

Missing these means the milestone's stated goal — "every figure on the site is deck-backed or
gone, and the two large-organization engagements read as proof of operating inside regulatory
and scale constraint" — is not actually met, regardless of what else ships.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **[MI-1]** Remove "2.5M+ Users Impacted," "$50M in product value," "800+ Designers Mentored" at every live surface | These are the exact three `Unbacked` verdicts (SITE-01/03/04) from the project's own Phase-5 deck audit; CRED-10/11/12 commit to removing them "rather than reconciling copy around them" (PROJECT.md) | MEDIUM | Not 5 surfaces (MILESTONES.md's count) but at least 12 live locations: `lib/data/retainer.ts:48-50` (`PROOF_EXHIBITS`, feeds two pages), `app/page.tsx:165` (renders it), `app/services/services-client.tsx:189` (renders it again), `app/about/about-client.tsx:19-40` (a *separate* hardcoded `achievements` array — does not import `PROOF_EXHIBITS`), `app/opengraph-image.tsx:118,126,143,168,176`, `app/about/opengraph-image.tsx:161,212,220,264`, `app/about/page.tsx:10,27` (metadata description strings, twice), `app/page.tsx:85` (bio paragraph prose), `app/services/page.tsx:10` (metadata description), `components/seo/related-content.tsx:255`, `lib/metadata.ts:25` (sitewide default OG description — the fallback every page without its own description inherits). Grep for `2.5M`, `800+`, `\$50M` before declaring done; the v1.0 postmortem already recorded "the '6' lingered in 2 spots until audit remediation" as a lesson for exactly this kind of multi-surface claim. |
| **[MI-2]** Update or replace `__tests__/integration/home-page-argument.test.tsx:59-66`, which currently asserts `["2.5M+","$50M","800+","4"]` are all present and locks in "The True Figure First Rule" against these specific values | A shipped regression test that hard-codes the unbacked figures will fail the moment MI-1 lands — good, it should — but if not rewritten it either blocks the fix in CI or gets silently deleted, losing the "true figure first, no zero-flash" behavioral coverage it also carries | LOW | This is the only existing automated check that would catch a values regression here; write its replacement to assert the *backed* figures (e.g. `"4"` awards, GrowIt's `240K+`/`4.8★` if kept) render and that `2.5M+`/`$50M`/`800+` do **not** — a negative assertion, which this test suite doesn't currently have a precedent for anywhere else in the repo. |
| **[MI-3]** Promote the 4 named awards (Davey ×2, Vega ×2 — issuer + category) from machine-readable-only to **visible on-page copy** | They are already `Backed` (SITE-02/SITE-05, deck slide 28) and already implemented as structured data in `lib/seo/json-ld.ts:79-84` (`buildPersonSchema().award`) — but no human reader ever sees the names, issuers, or categories; `app/about/about-client.tsx` only renders the bare number `"4"` with the flat label `"Design awards"` | LOW | This is a copy-and-markup change, not new plumbing: the data (name, issuer, category) already exists verbatim in `.planning/CREDIBILITY-COPY.md §1` and in `buildPersonSchema()`. Closes exactly the gap CRED-09 was built to prevent, just running the other direction (schema ahead of copy instead of copy ahead of schema). |
| **[EL-1]** Recategorize Echo: `category: "Mobile App"` → a term that reads as field/regulated-operations work (e.g. `"Field Operations"`), and mirror it into `categories[0]` | ENT-01 explicitly requires this; "Mobile App" sits next to GrowIt and Oh!Plays (consumer social/sports apps) in both the grid and any reader's mental model, actively working against the regulated-ops reading Echo needs | LOW | `lib/data/projects.ts:764-765` (Echo's `category`/`categories`). This single edit ripples for free to three surfaces because they all read the same field: the grid row's visible category text (`app/projects/projects-client.tsx:88`), the CreativeWork JSON-LD `genre` (`lib/seo/json-ld.ts:140`, `genre: props.category`), and — if the new term also appears in `categories[]` — the `/projects?category=` filter match (`lib/project-utils.ts:23-44`, substring match across `category`/`categories`/`tags`, case-insensitive). One data edit satisfies part of ENT-01 and sets up **[GE-1]** simultaneously. |
| **[EL-2]** Promote Echo's position in the project index | ENT-01 requires this explicitly ("currently NOT first in project ordering") | LOW | `app/projects/projects-client.tsx` has no sort function — `visibleProjects` is `filterProjectsByCategory(PROJECTS, categoryTerm)`, which preserves array order. So "promote" is purely reordering the `PROJECTS` array in `lib/data/projects.ts` (Echo is currently 5th of 8: growit, ohplays, ledgeriq, addvanced, **echo**, nagarro, rambis-ui, waffle). Verified no test hardcodes *which* project sits at a given index — `__tests__/integration/selected-projects.test.tsx`, `component-integration.test.tsx`, and `runtime-error-detection.test.tsx` all use `PROJECTS[0]`/`PROJECTS[1]` as generic structural mocks, not content assertions. Echo is already one of the 3 `FEATURED_SLUGS` on the homepage (`app/page.tsx:55`, `["waffle", "echo", "growit"]`) — "promoted" here is about the `/projects` grid specifically, since the homepage already surfaces it. |
| **[EL-3]** Resolve Echo's qualitative metric at the data level: replace `{ label: "Call Center Stress Reduction", value: "Significant" }` in `lib/data/projects.ts:807` | ENT-02 names this exact line; a text word in a numeric-looking slot reads as either padding or an unstated number, and it is the one thing on this project's data record that the NDA-safe process/design framing doesn't already handle correctly | LOW–MEDIUM | The fix is not deleting the row (losing "we addressed call-center stress" as a claim entirely) but restating it the way the *page* already restates the same category of fact: `echo-client.tsx:70` already ships `{ value: "On-site", context: "Research method" }` for a non-numeric value, rendered as plain text by `AnimatedMetricValue` (`components/ui/animated-metric-value.tsx:66,84-86` — `isNumeric` check, non-numeric values "render as plain text — no fake count-up," per its own doc comment: this component was *already built* for exactly this case). Match that vocabulary at the data level, e.g. `{ label: "Call center relief", value: "Redesigned" }` or drop the row and let the two quantified metrics (`ELD Compliance 100%`, `Platforms Designed 2`) carry the slot alone — either resolves ENT-02 without inventing a number. **This single edit also fixes the JSON-LD gap** described above for free, since `buildCreativeWorkSchema` reads the same array — do not treat the schema fix as separate work. |
| **[EL-4]** Reframe Nagarro's raw `metrics[]` array (not just its case-study page) away from agency-growth framing | ENT-03 requires org-design framing; the case-study page already gets this right (see header note), but the *data record* (`lib/data/projects.ts:992-1001`) still reads: Brand Recognition Growth 50%, Design Event Leads Generated 100+, Content Subscribers Reached 10K+, Junior Designer Retention +40%, Website Traffic Improvement +40%, Lead Generation Increase +25%, Global Design Team Growth 15+ — and this full array (not just index 0) flows verbatim into the live CreativeWork JSON-LD via `app/projects/nagarro/page.tsx` → `buildCreativeWorkSchema(project)` | MEDIUM | Note the nuance: `metrics[0]` ("Nagarrians Impacted: 18,000+") is *already* org-scale framed and is what the grid headline shows (`project.metrics?.[0]`, `projects-client.tsx:62`) and what the homepage snippet shows (`app/page.tsx:231-236`) — those two surfaces are fine today. The actual gap is indices 1–7, which is what a JSON-LD consumer or a reader who expands past the headline sees, and it reads like a marketing case study, not an organizational-design one. Reframe/reorder toward the case-study page's own vocabulary: org scale (18,000+, 36 countries), direct span (15 reports), tenure (8 months), retention (+40%) — and either cut or relabel the brand/lead/traffic figures rather than lead with them. |
| **[GE-1]** A single visible entry point on `/projects` that links to a filtered view of the regulated/field-ops work, built on the **existing** `?category=` mechanism | ENT-04 commits to "one grouped entry point... NOT a new route" | LOW | The infrastructure already ships and is unused by any visible UI: `app/projects/projects-client.tsx:143-145` reads `useSearchParams().get("category")` and calls `filterProjectsByCategory(PROJECTS, categoryTerm)` (`lib/project-utils.ts`); the URL pattern is already advertised to search engines via the WebSite `SearchAction` (`lib/seo/json-ld.ts:89-111`, `urlTemplate: ".../projects?category={search_term_string}"`, shipped in Phase 10 D-13). Today nothing in the UI actually *links* to `/projects?category=...` — it exists only as a schema-advertised, manually-typeable URL param. Once **[EL-1]** gives Echo a distinctive `category`/`categories` term, one `<Link href="/projects?category=Field Operations">` satisfies "grouped entry point" with zero new filtering logic. |
| **[GE-2]** The entry point is a real interactive element (`<Link>`, optionally an `<a>`-rendering `Badge asChild`), placed as a sibling of — never inside, never wrapping — the `case-studies-heading` `<h2>` | This repo has a committed, named precedent for exactly this failure: commit `26c7bf0` ("fix(a11y): stop TextScramble overriding heading semantics") removed `role="button"`/`tabIndex` from `TextScramble` because `ScrambleSectionTitle` renders it `as="h1"`–`"h6"`, and the stray interactive role turned every heading on the site into a button for screen readers ("a page of buttons instead of a document outline") | LOW | `components/case-study/section-chrome.tsx`'s `SectionLabel` always renders through `ScrambleSectionTitle` → `TextScramble` as `<h2>`. Do not attach the new entry point's interactivity to that component or its output. `components/ui/badge.tsx` already supports `asChild` (Radix `Slot`), so `<Badge asChild><Link href="...">Field ops →</Link></Badge>` gets the existing visual chip language (already used for `isLiveProduct`/`isComposite`, `projects-client.tsx:109-118`) through a real, natively-focusable anchor — no synthetic `role`/`tabIndex`/`onKeyDown` reimplementation needed, which is the same class of shortcut that caused the original bug. `components/ui/project-resources-section.tsx:74-88` is the one place in the current codebase that *does* hand-roll `role="button"`/`tabIndex`/`onKeyDown` on a `<div>` — it is a working, non-heading-adjacent example of the pattern to avoid, useful as a "what not to imitate" reference, not a template. |

### Differentiators (Strengthen the argument; not required to satisfy ENT-01..04/CRED-10..12)

| Feature | Value Proposition | Complexity | Notes |
|---------|--------------------|------------|-------|
| **[MI-4]** Consolidate the stats-band data source: fold `app/about/about-client.tsx`'s local `achievements` array into (or alongside) `lib/data/retainer.ts`'s `PROOF_EXHIBITS`, so the same 4 figures are authored once | Right now there are two independently-typed, independently-maintained arrays carrying the same 3 unbacked + 1 backed figures — exactly the "grep all surfaces" risk the v1.0 postmortem flagged. One source makes a future credibility audit a one-file check instead of a repo-wide grep | LOW–MEDIUM | `retainer.ts`'s `{value, context}` shape and `about-client.tsx`'s `{value, label, description}` shape aren't identical — this is a small refactor, not a rename. Optional for v3.0; the milestone's stated Key Decision pattern favors "bounded punch-list, not research build," so this is worth flagging to the roadmapper as a candidate for a later phase, not necessarily this one. |
| **[MI-5]** Give the reduced stats band a fourth, honestly-earned slot instead of shipping a 1-of-4 grid with three empty cells | A `sm:grid-cols-4` layout built for four figures reads as visibly broken with only one occupied cell; the site already has two more deck-backed, sourceable figures that were never asked to carry sitewide-aggregate weight: GrowIt's `240K+ active users` and `4.8★ App Store rating at peak` (`lib/data/projects.ts:59,63`, already used correctly and specifically on the homepage bio, `/projects` metadata, and GrowIt's own case study) | LOW | This is the concrete answer to "what replaces the slot": not a new invented aggregate, and not a forced 4-item grid — a **named-exhibit format**, one instance per real thing: `4 Design Awards` (named, sourced), `240K+ Active Users — GrowIt at peak` (named, sourced, already true elsewhere on the site), `2 Real Testimonials` linking to the named quotes (`lib/data/testimonials.ts`), and/or `Live Product — Waffle` linking to `/projects/waffle`. Each cell names a real, checkable thing instead of aggregating across unrelated engagements — which is also the load-bearing insight from the domain research below (see "External domain findings"). |
| **[EL-5]** Surface Echo's already-authored `constraints.environmental` (ELD Mandate, low-tech-industry adoption, working-condition diversity) as a small visible section on the Echo case-study page | This data exists (`lib/data/projects.ts`, Echo's `constraints` field) and directly answers "does this person understand regulatory/operational constraint," but `Project.constraints` is currently authored and never rendered anywhere in the app (verified: no reference in `case-study-template.tsx`, no reference in any `app/projects/*` client component) | MEDIUM if added to the shared `case-study-template.tsx` (touches all 7 case studies' TOC/props surface); LOW if added as a page-owned `children` section on `echo-client.tsx` only | The existing precedent for a page-owned extra section is already in `echo-client.tsx` itself — the "What the client said" quotes block is conditionally rendered as `children` with its own `tocExtra` entry, not a template prop. Follow that pattern rather than growing `CaseStudyTemplateProps`. Not required by ENT-02, which only names the metrics-slot problem — flag as optional strengthening, not a blocker. |
| **[GE-3]** Mirror the existing "Showing N projects matching..." status-line pattern (`projects-client.tsx:176-205`, `role="status"`) for the new entry point's active state | Screen-reader users get the same "filter applied, N results" confirmation sighted users get from watching the list shrink — this is pure reuse of code that already exists and already passes a11y review | LOW | No new pattern to invent; the `role="status"` + "Clear filter" link block is already written for the general `categoryTerm` case and will automatically fire once `?category=Field%20Operations` is in the URL, whether the reader arrived via the new entry point or typed the URL directly. |

### Anti-Features (Would look like progress; would actually undermine this milestone)

The milestone is explicitly about restraint — closing gaps, not adding surface area. These are
the moves that would be easy to reach for and would each reopen the exact problem this
milestone exists to close.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|------------------|-------------|
| Compute a new blended/estimated aggregate ("~500K+ users across all engagements," "$XXM combined impact") to keep a big sitewide number after removing the three `Unbacked` ones | The stats band "feels empty" with only one backed figure; a big number is persuasive shorthand | This is CRED-07 exactly — inventing a figure not sourced to the deck. It would recreate the audit finding this milestone exists to close, one release later, with a number that's *harder* to challenge because it's a synthetic blend rather than a single wrong claim | See **[MI-5]**: name real, individually-sourced things instead of aggregating |
| Restore "6 Design Awards" if any additional awards are recalled informally, without deck/issuer proof | The 4-award count feels small next to what a career-length deck implies | PROJECT.md's Out of Scope explicitly closes this: "Restoring '6 awards' — only if 2 more surface with proof." Informal recall is not proof | Keep 4, named, sourced; revisit only if a slide/issuer link surfaces |
| Invent specific figures for Echo to fill the constraint slot (driver counts, state counts, a rollout timeline with numbers) | "Significant" and "On-site" feel thin compared to a hard number | CRED-08: Echo's business figures were deliberately stripped for NDA reasons; adding new specific numbers — even plausible-sounding ones — breaches that line just as much as restoring the original figures would | Use the vocabulary the site has already proven works for this exact situation (see External domain findings, and Waffle's own live precedent: *"Waffle is live and paid; revenue and customer counts are not published here"* — `app/projects/waffle/waffle-client.tsx:107`) |
| Rewrite Nagarro's `roleNarrative`/`decisions[]`/`processStory` prose "to be more enterprise" | ENT-03 says "reframed in organizational-design terms," which sounds like a full-page rewrite | The prose is already the strongest asset on the page — "I had direct authority over 15 designers and influence over everyone else... nearly every decision below is therefore about persuasion rather than control" is exactly the signal an enterprise evaluator looks for (see External domain findings). Touching working prose risks diluting it for no gain; the actual gap is narrowly the raw `metrics[]` array | Scope the fix to **[EL-4]** only; leave the narrative alone |
| Build a multi-chip filter bar across the top of `/projects` (5–7 category buttons, active/inactive states, `aria-pressed`, wrap behavior on mobile) | "Filter UI" is the familiar mental model for "grouped entry point," and the site has an unused `PROJECT_CATEGORIES` constant (`lib/data/types.ts:105-113`) that looks ready-made for it | Only **one** of 8 projects (Echo) actually belongs to a regulated/field-ops bucket today — verified by reading every project's `category`/`categories`/`tags` in `lib/data/projects.ts` (growit: consumer social; ohplays: consumer sports/video; ledgeriq: enterprise fintech SaaS, and `isComposite`; addvanced: career-tech sprint; nagarro: design leadership/enterprise strategy; rambis-ui: open-source design system; waffle: AI/ML SaaS). A chip bar that resolves to n=1 adds interaction cost — extra tap targets, more ARIA surface, more states to test and keep accessible — for a grouping a scanning reader gets for free once Echo is reordered to sit early in an 8-item list. External filter-UX guidance backs this: chip/tab filters earn their cost for simple *multi-bucket* single-dimension filtering, not a near-binary split | **[GE-1]**: one link/pill using the URL filter mechanism that already ships |
| A dropdown or multi-select faceted filter (category × tag × status) on `/projects` | Feels more "complete" as a filtering feature | Net-new ARIA combobox/listbox engineering, disproportionate to an 8-item list that already fits on one scroll; the page's own code comments describe the index as deliberately a "Recommendations List grammar" meant to be read top-to-bottom, not queried | Do nothing beyond **[GE-1]**; the list is short enough that scanning *is* the filter |
| A new `/projects/field-operations` (or similarly named) route or landing page | Feels like the "proper" way to give a category real estate | PROJECT.md's Key Decision is explicit: "a filter or grouping on `/projects`, NOT a new route." A dedicated route would also fragment Echo's one case study across two places on the site (the grid *and* a sub-collection page), which directly contradicts "group work without fragmenting it" | **[GE-1]**: same page, URL-parameterized view |
| A decorative "NDA" badge/pill/lock-icon system next to Echo's title or metrics | Signals "there's more we can't show you" visually, feels transparent | The `ProjectRow` on `/projects` already stacks up to three badges (status, `isLiveProduct`, `isComposite` — `projects-client.tsx:96-118`); a fourth decorative badge crowds the row for a fact the prose already states plainly and correctly ("the business specifics of the engagement stay with the client," Echo's `roleNarrative`). A badge also implies a taxonomy (which projects are/aren't NDA'd) that doesn't otherwise exist in the data model | Trust the existing prose vocabulary; if a structural signal is wanted later, it is a `Project` type decision (a new optional field, mirroring `isComposite`), not a page-level visual hack |
| Retrofit `role="button"`/`tabIndex`/manual `onKeyDown` onto a styled `<span>`/`<div>` for the new filter entry point | Fastest way to get chip-looking styling without touching routing | This is the literal bug pattern fixed in commit `26c7bf0` — a decorative or quasi-interactive element with hand-rolled ARIA next to (or worse, wrapping) a heading. `components/ui/project-resources-section.tsx:74-88` shows this pattern still exists elsewhere in the codebase (on a non-heading element, where it's less dangerous but still a maintenance smell) | Use a real `<Link>`/`<button>` (`Badge asChild` + `Link`, per **[GE-2]**) |
| Delete or "fix" `components/core/animated-number-basic.tsx`, `components/ui/enhanced-metrics-grid.tsx`, `components/ui/enhanced-hover-cards.tsx` as part of this milestone's critical path | `animated-number-basic.tsx` literally contains the three unbacked figures (`setValue1(2.5)`, `setValue3(50)`, `setValue4(800)`) and `CREDIBILITY-COPY.md §1` names it as a place to edit | Verified via repo-wide grep: none of these three components are imported anywhere in `app/` or `components/` — they render nothing on the live site. Treating them as launch-blocking work misspends effort verifying/testing dead code under time pressure | Note them for a later cleanup pass (they will produce false positives in any future grep-based credibility audit, which *is* a real but non-urgent cost); do not block CRED-10/11/12 on them |

## Feature Dependencies

```
[EL-1] Echo recategorized (lib/data/projects.ts category/categories)
    └──enables──> [GE-1] entry point can target a real, matching category term
                      └──requires──> [GE-2] entry point is a real interactive element,
                                            not attached to the case-studies <h2>

[EL-3] Echo metrics[] qualitative-slot fix (lib/data/projects.ts)
    └──also fixes──> Echo's live CreativeWork JSON-LD (buildCreativeWorkSchema reads
                      the same array; no separate schema-layer fix needed)

[EL-4] Nagarro metrics[] reframe (lib/data/projects.ts)
    └──also fixes──> Nagarro's live CreativeWork JSON-LD (same mechanism as above)
    └──must NOT touch──> Nagarro's roleNarrative/decisions/processStory (already correct;
                          see Anti-Features)

[MI-1] Remove the 3 unbacked figures at source
    └──breaks (on purpose)──> [MI-2] existing test asserting those figures are present
                                   └──requires fixing in the same change, not after

[MI-3] Promote named awards to visible copy
    └──independent of──> [MI-1] (different figures; can ship in either order or together)

[MI-5] Named-exhibit replacement for the stats band
    └──depends on──> [MI-1] landing first (nothing to replace until the unbacked figures
                      are gone) and optionally [MI-4] (single data source) for consistency
                      across about/homepage/services
```

### Dependency Notes

- **[EL-1] enables [GE-1]:** the grouped entry point needs a real category string to link
  to. Sequence Echo's recategorization before (or in the same phase as) the grouping work —
  reversing the order means building a filter link that points at a category no project
  carries yet.
- **[EL-3]/[EL-4] also fix the JSON-LD gap:** because `buildCreativeWorkSchema(project)`
  (`lib/seo/json-ld.ts:126`) is called with the raw `Project` object on both static pages
  (`app/projects/echo/page.tsx`, `app/projects/nagarro/page.tsx`), there is no separate
  "fix the schema" task — fixing `lib/data/projects.ts` fixes grid, homepage snippet, and
  JSON-LD in one edit each. Do not plan a second phase item for the schema layer.
- **[MI-1] breaks [MI-2] on purpose:** the existing test failure *is* the safety net. Land
  the test rewrite in the same commit/plan as the source-of-truth removal so CI never sits
  red between them.
- **[MI-4] is optional infrastructure, not a blocker:** [MI-1] can be done as N separate
  edits without consolidating the data sources first; [MI-4] just reduces the chance of a
  future miss. Sequence it after [MI-1]/[MI-5] if it's done at all this milestone.

## MVP Definition

Reframed for a close-out milestone: "launch" = satisfies CRED-10/11/12 and ENT-01..04 as
written in PROJECT.md. "Add after" = strengthens the same claim without being required by an
open REQ-ID. "Future" = real but explicitly out of this milestone's bounded scope.

### Ship this milestone (satisfies CRED-10/11/12, ENT-01..04)

- [ ] **[MI-1]** Remove the three `Unbacked` figures at all ~12 live locations — the milestone's stated goal is false until this is complete everywhere, not just on the two most-visited pages
- [ ] **[MI-2]** Rewrite the regression test that currently locks in the unbacked values — otherwise the fix either fails CI or ships with zero automated protection against a silent revert
- [ ] **[MI-3]** Make the 4 named, backed awards visible in copy, not just in JSON-LD
- [ ] **[EL-1]** Recategorize + reorder Echo
- [ ] **[EL-3]** Resolve Echo's qualitative metric at the data level (fixes grid + homepage + JSON-LD together)
- [ ] **[EL-4]** Reframe Nagarro's raw `metrics[]` (not its already-good prose)
- [ ] **[GE-1]** One entry point on `/projects`, built on the existing `?category=` mechanism
- [ ] **[GE-2]** That entry point implemented as a real interactive element, never attached to the section heading

### Add after, if there's room (strengthens the same argument; no open REQ-ID requires it)

- [ ] **[MI-5]** Named-exhibit replacement content for the reduced stats band (240K+/GrowIt, 4.8★, testimonials, live product) — do this rather than shipping a visibly broken 1-of-4 grid, but it's a copy/content decision, not a new REQ-ID
- [ ] **[GE-3]** Reuse the existing status-line pattern for the entry point's active state
- [ ] **[EL-5]** Surface Echo's `constraints.environmental` as a page-owned section

### Defer past this milestone (real, but out of the bounded punch-list)

- [ ] **[MI-4]** Consolidate `about-client.tsx`'s local achievements array into `retainer.ts`'s `PROOF_EXHIBITS` — worth doing, but the Key Decisions log's own stated preference is "bounded punch-list, not research build"; treat as a candidate for a future architecture pass
- [ ] Dead-code cleanup of `animated-number-basic.tsx`, `enhanced-metrics-grid.tsx`, `enhanced-hover-cards.tsx` — real (they'll false-positive future grep audits) but non-blocking; not on the live site today

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|----------------------|----------|
| [MI-1] Remove 3 unbacked figures everywhere | HIGH | MEDIUM | P1 |
| [MI-2] Fix the locking regression test | HIGH (prevents silent regression) | LOW | P1 |
| [MI-3] Make named awards visible | HIGH | LOW | P1 |
| [EL-1] Recategorize + promote Echo | HIGH | LOW | P1 |
| [EL-3] Fix Echo's qualitative metric | HIGH | LOW–MEDIUM | P1 |
| [EL-4] Reframe Nagarro's raw metrics | HIGH | MEDIUM | P1 |
| [GE-1] Grouped entry point (URL-based) | MEDIUM–HIGH | LOW | P1 |
| [GE-2] Accessible entry-point markup | HIGH (avoids a known bug class) | LOW | P1 |
| [MI-5] Named-exhibit stats-band content | MEDIUM | LOW | P2 |
| [GE-3] Status-line reuse for entry point | LOW–MEDIUM | LOW | P2 |
| [EL-5] Surface Echo's constraints data | MEDIUM | LOW–MEDIUM | P2 |
| [MI-4] Consolidate stats data sources | LOW–MEDIUM | LOW–MEDIUM | P3 |
| Dead-code cleanup (3 unused components) | LOW | LOW | P3 |

**Priority key:** P1 = required to satisfy this milestone's committed REQ-IDs (CRED-10/11/12,
ENT-01..04). P2 = strengthens the same claim, no open REQ-ID depends on it. P3 = real but
explicitly deferrable.

## External domain findings

Corroborates the codebase-derived recommendations above with outside evidence. Confidence is
MEDIUM unless noted — these are WebSearch-sourced patterns, cross-checked across 2+ results
per query but not independently verified against a primary source the way the file:line
findings above are.

**What replaces a removed vanity-metric stats band.** Fractional-executive and consulting
positioning research converges on named, checkable proof over aggregate numbers: case studies
mapped to specific engagements with before/after detail, named client references, and
industry-recognition credentials — not follower counts or blended totals. One source states
the pattern explicitly: "a weekly email newsletter to 500 highly targeted subscribers will
generate more inbound client interest than 50,000 LinkedIn followers." The mechanism is the
same one this repo already uses correctly for its Coursera/Northwestern/Vanderbilt
certifications (`app/about/about-client.tsx`, each with a real `validationLink`) — named,
sourced, individually checkable beats an aggregate every time. This directly supports
**[MI-5]**'s named-exhibit format over any blended-number alternative. MEDIUM confidence
(WebSearch, cross-checked across 3 results; no single authoritative source, but the pattern
was consistent).

**Writing an NDA-constrained case study.** Independent guidance (IxDF's UX-portfolio NDA
article, Smart Interface Design Patterns) converges on the same substitution pattern: trade
absolute figures for proportional/qualitative language ("a 12% increase" not "12,512 to
14,013"), describe methodology and process in detail while generalizing the business specifics,
and state the anonymization/non-disclosure openly rather than implying full transparency. This
is, near-verbatim, what Echo's `roleNarrative` and `processStory.outcome` already do ("the
business specifics of the engagement stay with the client... what I can speak to is the design
work") and what Waffle's proof note does ("Waffle is live and paid; revenue and customer
counts are not published here" — `app/projects/waffle/waffle-client.tsx:107`). This site has
already independently converged on the pattern the domain literature recommends — the gap is
narrowly that the structured `metrics[]` field doesn't yet speak the same way the prose does.
Supports **[EL-3]** directly. MEDIUM confidence (2 independent sources agreeing).

**What an enterprise-scale evaluator looks for in a design-leadership case study.** Forrester/
Gartner B2B-buying research (cited via secondary sources, not fetched directly — LOW confidence
on the specific numbers) puts typical enterprise buying committees at 6–10 active stakeholders
across 2+ departments; the throughline in design-leadership-at-scale case studies is *span of
authority vs. span of influence*, governance/rollout mechanics, and how compliance requirements
were met without direct authority over the people who had to comply. This is exactly Nagarro's
existing `decisions[]` argument ("With no authority over the wider organization, I positioned
design as a business driver... a mandate I could not enforce would have produced compliance
theatre") — reinforcing that the prose should be left alone and the fix scoped to the metrics
array (**[EL-4]**), not the narrative.

**Filter chips vs. a single grouped link on a small content grid.** UX filter-pattern guidance
(UXPin, WAI-ARIA authoring practices) frames chip/tab filters as earning their interaction
cost for *simple, single-dimension filtering across multiple genuine buckets* — not for
splitting a small list where nearly everything falls in one bucket and a single item falls in
another. For an 8-item project index where 7 of 8 projects share overlapping consumer/SaaS
categories and exactly 1 is field/regulated-ops, a multi-chip bar has no second use once
built — it will always resolve to "everything" or "the one item." This directly supports
**[GE-1]** (single link) over a chip bar (flagged as an anti-feature above). MEDIUM confidence.

## Sources

**Codebase (HIGH confidence — direct verification):**
- `.planning/PROJECT.md`, `.planning/MILESTONES.md`, `.planning/CREDIBILITY-COPY.md`, `.planning/DECK-COVERAGE-AUDIT.md` (SITE-01/02/03/04/05/06, ECHO-01..37, NAGARRO-01..35)
- `lib/data/types.ts`, `lib/data/projects.ts`, `lib/data/retainer.ts`, `lib/data/testimonials.ts`
- `app/page.tsx`, `app/about/about-client.tsx`, `app/services/services-client.tsx`, `app/opengraph-image.tsx`, `app/about/opengraph-image.tsx`, `lib/metadata.ts`, `components/seo/related-content.tsx`
- `app/projects/page.tsx`, `app/projects/projects-client.tsx`, `lib/project-utils.ts`, `lib/seo/json-ld.ts`
- `app/projects/echo/echo-client.tsx`, `app/projects/echo/page.tsx`, `app/projects/nagarro/nagarro-client.tsx`, `app/projects/nagarro/page.tsx`, `components/case-study/case-study-template.tsx`, `components/case-study/section-chrome.tsx`, `components/ui/animated-metric-value.tsx`, `components/ui/badge.tsx`, `components/core/text-scramble.tsx`, `components/ui/scramble-section-title.tsx`, `components/ui/project-resources-section.tsx`
- `__tests__/integration/home-page-argument.test.tsx`, `__tests__/projects/nagarro/nagarro-data.test.tsx` (note: this test's `mockNagarroProject` is a hand-authored fixture that does not import from `lib/data/projects.ts` — it does not exercise the real Nagarro record and should not be relied on as coverage for **[EL-4]**), `__tests__/integration/selected-projects.test.tsx`, `component-integration.test.tsx`, `runtime-error-detection.test.tsx`
- git commit `26c7bf0` ("fix(a11y): stop TextScramble overriding heading semantics") — read via `git show`

**External (MEDIUM confidence unless noted, cross-checked across multiple results per query):**
- [How to Handle Non-Disclosure Agreements (NDAs) When You Write Your UX Case Study — IxDF](https://ixdf.org/literature/article/how-to-handle-non-disclosure-agreements-ndas-when-you-write-your-ux-case-study)
- [How To Share NDA-Protected UX Work — Smart Interface Design Patterns](https://smart-interface-design-patterns.com/articles/sharing-nda-protected-ux-work/)
- [Value Proposition for Fractional CFOs: How to Stand Out and Win Clients](https://theexpertcfo.com/fractional-cfo-value-proposition/)
- [Fractional Clients for Executives — Executive Career Partners](https://www.ecp-careers.com/fractional-executive-branding-client-acquisition/)
- [Filter UI and UX Design: Best Practices, Patterns, and Examples — UXPin](https://www.uxpin.com/studio/blog/filter-ui-and-ux/)
- [ARIA Practices Guide — W3C WAI](https://wai-aria-practices.netlify.app/aria-practices/)
- [Can We Write A Case Study When Our Customer Has an NDA? — eCreativeWorks](https://www.ecreativeworks.com/blog/can-we-write-a-case-study-when-our-customer-has-an-nda)
- [How to write a gripping case study — without naming the client — Equinet Media](https://www.equinetmedia.com/blog/how-to-write-a-case-study-anonymous-client)

---
*Feature research for: portfolio/credibility presentation, v3.0 Enterprise Credibility milestone*
*Researched: 2026-08-22*
