# Architecture Research: Narrative Case-Study Template Integration

**Domain:** Existing Next.js 15 App Router portfolio — extending the `[slug]` case-study
template to carry a first-person narrative structure (problem → my role →
decisions-with-rationale → measurable outcome → reflection), and reconciling it with
6 bespoke per-project route directories.
**Researched:** 2026-08-15
**Confidence:** HIGH (all findings verified by direct file reads, not framework docs)

## Current State (verified by reading the codebase, not assumed)

### The "8 projects" are NOT 2-pure-data + 5-bespoke + 1-custom as briefed — they are messier

| Slug | Route that actually renders | Data source | Lines of bespoke JSX |
|---|---|---|---|
| `growit` | `app/projects/[slug]/page.tsx` (dynamic) | 100% `lib/data/projects.ts` | 0 (shared template) |
| `ohplays` | `app/projects/[slug]/page.tsx` (dynamic) | 100% `lib/data/projects.ts` | 0 (shared template) |
| `addvanced` | `app/projects/addvanced/page.tsx` (static, shadows `[slug]`) | **0 references** to `PROJECTS` data despite importing it | 1,317 (`addvanced-client.tsx`) |
| `echo` | `app/projects/echo/page.tsx` (static) | Imports `PROJECTS` but component is hand-written JSX | 481 (`echo-client.tsx`, the one actually imported) |
| `nagarro` | `app/projects/nagarro/page.tsx` (static) | 8 references to `nagarroProject.*` (partial) | 1,118 (`nagarro-client.tsx`) |
| `rambis-ui` | `app/projects/rambis-ui/page.tsx` (static) | 6 references to `rambisProject.*` (partial) | 406 (`rambis-client.tsx`) |
| `waffle` | `app/projects/waffle/page.tsx` (static) | Live-product showcase, not a case study | 317 (`waffle-client.tsx`) |
| `ledgeriq` | **Two competing routes** — see below | Partial | 1,144 (`ledgeriq-client.tsx`) |

**LedgerIQ is a hidden 7th bespoke page, not a clean data-driven case, and it's currently duplicated/orphaned:**
- The projects grid (`app/projects/projects-client.tsx:235,362`) links every card to `/projects/${project.slug}`. For `ledgeriq` that resolves to `/projects/ledgeriq`, which has no static folder, so it falls through to `app/projects/[slug]/page.tsx` and renders the **generic data-driven template** using `lib/data/projects.ts` (which does have full `processStory`/`overview`/`metrics` for ledgeriq).
- A second, much more elaborate bespoke page exists at **`app/ledgeriq/page.tsx`** (root-level route `/ledgeriq`, *not* under `/projects/`) with its own 1,144-line client component. Nothing in the app — not the grid, not the header, not `app/sitemap.ts`, not `related projects` links — points to `/ledgeriq`. It is fully orphaned: unreachable from any nav, unindexed in the sitemap, but still built, deployed, and crawlable if guessed. This is a duplicate-content and dead-code liability that should be resolved (delete or redirect) as part of this milestone, since the milestone's own goal ("all 8 projects... this inconsistency matters") is not achievable while a project has two different case studies live at two different URLs.

**So the real count is: 2 pure data-driven (`growit`, `ohplays`) + 6 bespoke JSX case-study components (`addvanced`, `echo`, `nagarro`, `rambis-ui`, `ledgeriq` ×2 counted once, `waffle` — waffle being product-showcase not narrative case study).**

### The `[slug]` template's own `Project` type is pulled from the wrong (stale) module

`app/projects/[slug]/project-detail-client.tsx:42`:
```ts
import type { Project } from "../../data"; // = app/data.ts, NOT lib/data/types.ts
```
`app/data.ts` is a 775-line duplicate of `lib/data/projects.ts` + a duplicate, **older** `Project` type (missing `isLiveProduct`, missing the stricter `metrics[].performanceLevel` union). It is dead weight already flagged in `.planning/PROJECT.md` for deletion ("delete stale `app/data.ts` PROJECTS array"). **Any new narrative fields must be added to `lib/data/types.ts` and the `[slug]` template's import must be repointed to it in the same change**, or the new fields will not typecheck against what the template actually imports.

### A prior, abandoned attempt at a shared case-study component system already exists — and is dead code

`components/case-study/` (`case-study-layout.tsx` 478 lines, `case-study-hero.tsx`, `case-study-section.tsx`, `metrics-card.tsx`, `image-gallery.tsx`, `video-player.tsx`) is **imported by zero files in `app/` or `components/`**. It was built to be generic (`CaseStudyLayout({ data: CaseStudyData })`) but hardcodes `echo`-specific image paths (`/projects/echo/research1.jpg`, etc.) inside the "shared" component — the exact anti-pattern that makes shared components unusable for other projects. `CaseStudySection` (35 lines: `id`, `role="region"`, `aria-labelledby`) is the one clean, genuinely reusable piece — it is a reasonable seed for a TOC-anchor section wrapper, but it isn't used anywhere today.

**Implication:** this is not the team's first attempt at "one template for all case studies." It failed by hardcoding project-specific content into a "shared" layout instead of accepting narrative content as data. The new template evolution must not repeat that mistake — treat this milestone as an opportunity to either resurrect `CaseStudySection` properly or delete the whole `components/case-study/` directory as tech debt (recommend: **delete**, since `case-study-layout.tsx`/`case-study-hero.tsx`/`metrics-card.tsx`/`image-gallery.tsx`/`video-player.tsx` duplicate functionality that already exists and is used elsewhere — `AnimatedMetricCard`, `ImageGallery`-equivalent inline grids, `VideoPlayer` in `components/ui/`).

### Other dead code found in the same area (fold into "Tech-debt fold-in")
- `app/projects/echo/echo-client-final.tsx` (734 lines) — not imported by `app/projects/echo/page.tsx` (which imports `./echo-client`, 481 lines). Appears to be an abandoned rewrite left in the tree.
- `components/seo/project-faq.tsx` FAQ content for `echo` describes a "design system... AI-powered design workflows" while the actual EchoDrive project (per `lib/data/projects.ts` and `echo-client.tsx` metadata) is trucking-logistics mobile software. This FAQ schema is stale/mismatched content that will read as incoherent to a hiring manager who views source — flag for the content-rewrite phase, not this architecture phase, but it must be touched since FAQ copy has to match the rewritten narrative voice.

## Data-Model Decision: (a) Extend the typed `Project` model — not MDX, not hybrid

### Comparison

| Criterion | (a) Extend typed model | (b) MDX per project | (c) Hybrid (typed metadata + MDX body) |
|---|---|---|---|
| Fits existing `generateMetadata()` pattern (`app/projects/[slug]/page.tsx:8-60`), which needs synchronous plain strings for `description`/`openGraph`/`twitter` | Yes, no change to pattern | No — needs async content loading + a plaintext-extraction step just for metadata | Partial — still needs a separate plaintext summary field, defeating some of MDX's benefit |
| Fits `CreativeWorkStructuredData` / `ProjectFAQStructuredData` (both consume typed fields directly, server components) | Yes | Requires a parser to pull structured facts back out of prose | Same problem for the MDX body portion |
| Fits the milestone's own acceptance bar ("no section renders shallow") — needs to be **programmatically checkable** | Yes — a script can assert `project.decisions.length >= 3 && every(d => d.rationale && d.outcome)` | Hard — would need frontmatter-only checks, prose completeness is not type-checkable | Only the frontmatter half is checkable |
| New tooling required | None — reuses existing `@next/mdx`-free, typed-data pattern already used by 100% of non-blog content | `next-mdx-remote` or a `contentlayer`-style pipeline, TOC-from-headings tooling (remark plugin), custom MDX components registered per case study | Same MDX tooling, scoped down |
| Consistency with existing convention | Matches `lib/data/index.ts` barrel + "content is code, not CMS" pattern already documented in `.planning/codebase/ARCHITECTURE.md` | Breaks convention — MDX is currently blog-only (`app/blog/**/page.mdx`) | Partially breaks convention |
| Risk of reopening the `app/data.ts` duplication problem | Low if the type is fixed to live in `lib/data/types.ts` only | New risk surface: content files could drift from typed fields the same way `app/data.ts` drifted | Same partial risk |
| Match for the actual content shape (problem/role/decisions/outcome/reflection are fixed narrative *beats*, not open-ended prose) | Strong — decisions are naturally `{decision, rationale, outcome}[]`, not prose | Weak — MDX shines for free-flowing long-form with embedded rich media, which this content mostly isn't (it's structured bullet-and-paragraph beats, matching what's already in `processStory`) | Strong for body paragraphs, weak justification for the added complexity given (a) already covers the shape |

**Recommendation: (a).** The codebase already has 90% of the target shape sitting in `lib/data/types.ts`'s `processStory` (`background`, `approach`, `methodology`, `keyInsights`, `outcome`, `reflection`, `stakeholderQuotes`) and top-level `challenges`/`solutions`/`learnings`/`overview`/`constraints`. This is evidence the domain (decision-driven case studies) fits structured data better than prose — someone already modeled it that way once. The gap is not "we need free-form prose," it's "we need an explicit `decisions[]` array with rationale + tie-back-to-metric, and a first-person role narrative field," both of which are structured, not prose-shaped. MDX would be a disproportionate infrastructure change (new render pipeline, new async data flow in a route that is currently 100% synchronous data lookup) for a milestone whose stated risk to de-risk is the *template*, not a content-authoring-format migration.

### Proposed type additions (`lib/data/types.ts`)

```ts
export type Project = {
  // ...existing fields unchanged...

  /** First-person "what I owned" — distinct from the short `role` label already present */
  roleNarrative?: string;

  /** The decisions-with-rationale beat. Renders via new <DecisionCallout> */
  decisions?: {
    decision: string;      // "I chose X"
    rationale: string;     // "because Y" — the senior-signal payload
    outcome?: string;      // "which led to Z" — free text tie-back
    metricLabel?: string;  // optional cross-link to an existing `metrics[].label` for the UI to bold/link the number
  }[];

  // processStory.reflection already exists — reuse it, don't duplicate.
  // processStory.background already exists — reuse as "the problem."
};
```

`processStory.reflection` and `processStory.background` are kept as-is (avoids a second migration); only `decisions[]` and `roleNarrative` are new. This is additive — exactly the pattern already used for `isLiveProduct` in v1.0 (`.planning/PROJECT.md` Key Decisions: "Additive data-model change, zero routing special-cases... Good"). Precedent supports doing it again the same way.

**Do not** repurpose `processStory.keyInsights` (currently rendered as "Key Design Decisions" at `project-detail-client.tsx:800-840`) as a permanent second decisions mechanism — during content rewrite, migrate its content into `decisions[]` and stop rendering `keyInsights` once all 8 projects have `decisions[]` populated, to avoid two divergent "decisions" sections on the same page.

## New Components Needed

| Component | Location (convention: kebab-case, PascalCase export) | Responsibility | New or extends existing |
|---|---|---|---|
| `DecisionCallout` | `components/case-study/decision-callout.tsx` (new dir, or reuse-and-clean `components/case-study/` after deleting the dead files) | Renders one `{decision, rationale, outcome}` — visually distinct (bordered card + icon), NOT a plain `<SectionCard>` bullet, so it reads as "the senior-signal moment" on the page | New |
| `CaseStudyTOC` | `components/case-study/case-study-toc.tsx` | Sticky/inline anchor nav built from a **static array of `{id, label}` per page** (not parsed from prose — content is structured, so the section list is known at render time), scroll-spy optional | New |
| `ReflectionBlock` | `components/case-study/reflection-block.tsx` | Pull-quote-styled treatment for `processStory.reflection` — distinct typography (italic/serif accent, "Looking back" framing) instead of the current plain `<Card>` treatment at `project-detail-client.tsx:948-960`, so reflection reads as a voice shift, not another content card | New (replaces existing inline JSX block) |
| `RoleNarrativeSection` | `components/case-study/role-narrative.tsx` | Renders `roleNarrative` alongside the existing `overview.deliverables`/`overview.teamMembers` cards — bridges "my role" beat to data already collected in `overview` | New |
| `CaseStudySection` | `components/case-study/case-study-section.tsx` (already exists, unused) | Generic `<section id aria-labelledby>` wrapper — **resurrect this one file**, delete the other 5 dead files in `components/case-study/` | Extend/resurrect existing |

All five should be built to accept **props, not the whole `Project` object** (e.g. `<DecisionCallout decision={...} rationale={...} outcome={...} />`, not `<DecisionCallout project={project} />`). This is what makes them usable from bespoke pages later without forcing those pages onto the full `Project` type.

## Bespoke-vs-Data Convergence Strategy

**Do not force full data-model convergence this milestone.** Six bespoke components (5,517 combined lines) already contain hand-authored, project-specific layout decisions (Tabs, Progress bars, Alert banners, hover-video grids) that took real effort and, per the git log, are the *product* of prior work, not accidental drift. Rewriting all six onto a single generic `[slug]`-style template in the same milestone as the content rewrite is exactly the kind of disproportionate, high-risk change the milestone's own build-order request is trying to avoid.

**Recommended approach: converge on shared narrative *components*, not a shared page template.**

1. Build the five new components above as standalone, prop-driven pieces (not baked into `CaseStudyLayout`-style monoliths — that's the mistake the dead `components/case-study/case-study-layout.tsx` already made).
2. `[slug]`'s `project-detail-client.tsx` (serving `growit`, `ohplays`) composes them directly from `Project` fields — this is the "pure data" path and is nearly free (template already has slots for all the surrounding sections).
3. Each bespoke client (`addvanced-client.tsx`, `echo-client.tsx`, `nagarro-client.tsx`, `rambis-client.tsx`, `ledgeriq-client.tsx`) gets the **same five components inserted into its existing JSX**, fed either from its partial `PROJECTS` reference (nagarro, rambis, ledgeriq already do this partially) or from new inline props (addvanced, echo, which currently ignore the data layer entirely and would need the new narrative content authored as literal JSX props — consistent with how the rest of those files already work).
4. Result: all 8 pages get **visually and structurally consistent** decision callouts, TOC, and reflection treatment — the part a hiring manager actually perceives as "this feels like one coherent site" — without a risky full rewrite of 5,517 lines of working bespoke layout into a generic template this milestone.
5. `waffle` is explicitly out of this narrative pattern (it's a live-product showcase per v1.0 Key Decisions, not a case study) — do not force `DecisionCallout`/`ReflectionBlock` onto it.
6. **Resolve the `ledgeriq` duplicate-route problem first**, independent of the narrative work: either (a) delete `app/ledgeriq/` and let `/projects/ledgeriq` continue rendering off the data-driven template (simplest, keeps the count at 2 pure-data), or (b) delete `app/projects/[slug]`'s implicit handling of `ledgeriq` by giving it a real `app/projects/ledgeriq/` static folder built from the existing orphaned 1,144-line component (keeps the more elaborate bespoke version, matches the "6 bespoke" reality). Recommend (a) — the orphaned page has had zero traffic/indexing and the data-driven `processStory` for ledgeriq is already reasonably complete (verified: `lib/data/projects.ts` has `processStory`, `overview`, `constraints`, full `challenges/solutions/learnings` for ledgeriq), so deleting the 1,144-line orphan is a pure debt reduction, not a content loss, once its unique content (if any) is diffed against the data-driven version and folded in.

**A future milestone** (not this one) can revisit whether full convergence to one generic, data-driven template is worth it once all 8 pages share the same section-level building blocks — at that point the remaining bespoke-vs-data gap is mostly plumbing (moving literal JSX content into `decisions[]`/`overview` fields), which is a much lower-risk mechanical migration than doing content strategy and template design at the same time.

## Data Flow Changes

### Current (unchanged for the 2 pure-data pages)
```
lib/data/projects.ts (PROJECTS)
    → app/projects/[slug]/page.tsx (generateMetadata, notFound, structured data)
        → project-detail-client.tsx (renders project.* fields into fixed JSX sections)
```

### After this milestone
```
lib/data/types.ts (Project + decisions[] + roleNarrative)   ← type fix: point import here, not app/data.ts
    → lib/data/projects.ts (PROJECTS, content-completed)
        → app/projects/[slug]/page.tsx (unchanged: generateMetadata still reads description/longDescription/technologies — NOT decisions[], see SEO note below)
            → project-detail-client.tsx
                → NEW: <RoleNarrativeSection roleNarrative={project.roleNarrative} .../>
                → NEW: <DecisionCallout decision=... rationale=... outcome=.../> per project.decisions[]
                → NEW: <ReflectionBlock reflection={project.processStory.reflection} />
                → NEW: <CaseStudyTOC sections={[...]} /> (static section list per render, inserted near hero)

    (parallel, per bespoke page)
    addvanced-client.tsx / echo-client.tsx / nagarro-client.tsx / rambis-client.tsx / ledgeriq-client.tsx
        → same 5 new components, fed by literal props or partial PROJECTS lookups (unchanged data source per file)
```

**No change to the request/render pipeline** described in `.planning/codebase/ARCHITECTURE.md` ("Primary Request Path") — this is additive within the existing server-page-reads-data → client-half-renders pattern, not a new data-fetching mechanism.

## SEO / JSON-LD / OG Impact

- **`generateMetadata()` (`app/projects/[slug]/page.tsx:8-60`) needs no structural change.** It already falls back `project.longDescription || project.description` for `description`/`openGraph.description`/`twitter.description`. New `decisions[]`/`roleNarrative` content should **not** be auto-concatenated into meta description (risk of keyword-stuffing / incoherent meta text) — if the rewritten `longDescription` itself becomes more first-person as part of content rewrite, that flows through automatically with zero code change.
- **`CreativeWorkStructuredData`** (`components/seo/structured-data.tsx:449+`) already accepts `role` and `metrics` and emits `contributor.roleName` / `additionalProperty`. Consider (optional, not required) adding `Project.roleNarrative` as the schema's `description`-adjacent context, but do not invent new schema.org properties for `decisions[]` — there is no clean CreativeWork mapping for "decision rationale," and forcing one risks the kind of fabricated/awkward schema v1.0 explicitly removed ("Remove fabricated schema... Trust + search-penalty risk," per `.planning/PROJECT.md` Key Decisions). Leave `decisions[]` as UI-only content, not JSON-LD.
- **No per-project dynamic OG image exists today** — `app/projects/opengraph-image.tsx` is the shared `/projects` list OG, not per-slug. Per-slug OG comes from `openGraph.images: [project.thumbnail]` (static asset) in `page.tsx`. Narrative content changes don't require touching OG image generation, **except**: verify all 6 bespoke-page slugs still have a valid `project.thumbnail` in `lib/data/projects.ts` for their `/projects/${slug}` fallback metadata (used when someone shares the canonical `/projects/${slug}` URL rather than the bespoke one) — this matters more once the `ledgeriq` duplicate-route decision is made, since whichever URL becomes canonical needs correct OG.
- **`ProjectFAQStructuredData`** (`components/seo/project-faq.tsx`) is hand-authored per slug, independent of `Project` fields. It is NOT touched by the type/component changes here, but its content must be re-voiced during the content-rewrite phase to match the new first-person narrative (the `echo` FAQ entry currently describes an unrelated "AI design system" — a pre-existing content mismatch, flagged here because it's adjacent to structured data, but it's a content-rewrite-phase fix, not an architecture-phase one).
- **`app/sitemap.ts`** maps every `PROJECTS` entry to `/projects/${slug}` — once the `ledgeriq` route duplication is resolved, sitemap output is automatically correct (it already only advertises `/projects/ledgeriq`, never the orphan `/ledgeriq`).

## Recommended Build Order (de-risk template before content)

**Phase A — Template evolution, pilot on 1–2 projects (do this first, alone)**
1. Fix `app/projects/[slug]/project-detail-client.tsx:42` to import `Project` from `@/lib/data/types` instead of `../../data` (unblocks everything else; currently blocks type-safety of any new field).
2. Add `decisions[]` and `roleNarrative` to `lib/data/types.ts`.
3. Build the 5 new components (`DecisionCallout`, `CaseStudyTOC`, `ReflectionBlock`, `RoleNarrativeSection`, resurrected `CaseStudySection`) as standalone, prop-driven, unit-testable pieces — delete `case-study-layout.tsx`/`case-study-hero.tsx`/`metrics-card.tsx`/`image-gallery.tsx`/`video-player.tsx` from `components/case-study/` in the same pass (dead code, superseded).
4. Wire the 5 components into `project-detail-client.tsx` and populate `decisions[]`/`roleNarrative` for **`growit` only** (simplest case, already fully data-driven, no bespoke JSX to touch) as the structural pilot. Verify visually, verify `npm run lint` / `npx tsc --noEmit` / `npm test` clean.
5. Wire the same 5 components into **one bespoke page** (`rambis-client.tsx`, 406 lines — smallest bespoke file, already partially data-driven) as the second pilot, proving the components work when fed by literal props instead of the full `Project` object. This is the load-bearing proof for "converge on components, not templates."
6. Only after both pilots are verified: this phase is "done," and the template shape is considered de-risked.

**Phase B — Content rewrite (all 8), now that the template shape is proven**
7. Resolve the `ledgeriq` duplicate-route decision (delete `app/ledgeriq/` recommended) before rewriting ledgeriq content, so content isn't written twice.
8. Fill `decisions[]`/`roleNarrative` (and any thin `challenges`/`solutions`/`learnings`) for the remaining 7 projects, deck-backed per `.planning/CREDIBILITY-COPY.md` sourcing rules.
9. Migrate `processStory.keyInsights` content into `decisions[]` where overlapping, then stop rendering the old `keyInsights` section once all 8 have `decisions[]`.
10. Re-voice `ProjectFAQStructuredData` entries to match first-person narrative (and fix the `echo` content mismatch found above).

**Phase C — Tech-debt fold-in (can interleave with Phase B, lower risk, independent files)**
11. Delete `app/data.ts` (now unreferenced once step 1 lands).
12. Delete `app/projects/echo/echo-client-final.tsx` (unreferenced dead file).
13. POS-02 proof-chips, WAF-02 badge dead-zone (per `.planning/PROJECT.md` — unrelated to narrative template, safe to interleave).

**Why this order de-risks the milestone:** the single riskiest unknown is "does the 5-component narrative pattern actually work when retrofitted into pre-existing, differently-structured bespoke JSX?" Phase A answers that on 2 cheap pilots (1 pure-data, 1 bespoke) before committing to writing ~7,000+ words of new first-person content across 8 files. If the component design needs to change, it changes once, not after 6 more bespoke files have already been touched.

## Anti-Patterns to Avoid (found in this codebase, not generic)

### Anti-Pattern 1: "Shared" layout components that hardcode one project's data
**What happened:** `components/case-study/case-study-layout.tsx` was built as a generic `CaseStudyLayout` but hardcodes `/projects/echo/research1.jpg` etc. inside it — unusable for any other project, hence zero adoption.
**Do instead:** New components take content via props only; no project-specific strings, paths, or copy inside `components/case-study/*`.

### Anti-Pattern 2: Two Project types, two data files
**What happened:** `app/data.ts` duplicates `lib/data/projects.ts`/`types.ts`; the `[slug]` template imports the wrong one.
**Do instead:** Single source `lib/data/types.ts` / `lib/data/projects.ts`; delete `app/data.ts` once nothing imports it.

### Anti-Pattern 3: Orphaned route duplicating a canonical one
**What happened:** `/ledgeriq` (root) and `/projects/ledgeriq` (via `[slug]`) both render a LedgerIQ case study; only one is linked/sitemapped.
**Do instead:** One canonical URL per project; if a bespoke page is kept, it must replace (not sit alongside) the dynamic-route fallback, and must be in the sitemap.

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|---|---|---|
| `lib/data/types.ts` ↔ `lib/data/projects.ts` | Direct import, typed array | Add `decisions[]`, `roleNarrative` here only |
| `lib/data/types.ts` ↔ `app/projects/[slug]/project-detail-client.tsx` | Currently broken — imports from `app/data.ts` instead | Fix import path as step 1 of Phase A |
| New `components/case-study/*` ↔ `[slug]` template and bespoke `*-client.tsx` files | Props-only React components | No component should import `Project` type or `PROJECTS` directly — keeps them usable from both data-driven and bespoke callers |
| `app/projects/[slug]/page.tsx` (`generateMetadata`) ↔ new narrative fields | No new coupling | Meta description continues to derive from `longDescription`/`description` only |
| `components/seo/structured-data.tsx` (`CreativeWorkStructuredData`) ↔ new narrative fields | No new coupling (by design) | Do not add `decisions[]` to JSON-LD — no clean schema.org mapping, risk of the fabricated-schema problem v1.0 already fixed |
| `app/sitemap.ts` ↔ route duplication | Currently correct (`/projects/${slug}` only) | Becomes fully correct once `/ledgeriq` orphan is deleted |

## Sources

All findings verified by direct file reads in this repository (not external docs — this is a codebase-integration question):
- `lib/data/types.ts`, `lib/data/projects.ts`, `app/data.ts` (duplication)
- `app/projects/[slug]/page.tsx`, `app/projects/[slug]/project-detail-client.tsx` (full read, 1080 lines)
- `app/projects/{addvanced,echo,nagarro,rambis-ui,waffle}/page.tsx` and their `*-client.tsx` line counts
- `app/ledgeriq/page.tsx`, `app/ledgeriq/ledgeriq-client.tsx` (orphaned route)
- `components/case-study/*` (dead code, 6 files)
- `components/seo/structured-data.tsx`, `components/seo/project-faq.tsx`
- `app/sitemap.ts`, `app/projects/opengraph-image.tsx`
- `.planning/PROJECT.md`, `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/CONVENTIONS.md`

---
*Architecture research for: v2.0 Case-Study Depth narrative template integration*
*Researched: 2026-08-15*
