# Stack Research

**Domain:** Long-form narrative case-study rendering (v2.0 Case-Study Depth milestone) on an existing Next.js 15 portfolio
**Researched:** 2026-08-15
**Confidence:** HIGH

## Headline Recommendation

**Keep the extended-typed-data model. Do NOT move per-project content to MDX.**
No new runtime dependency is required. The single addition worth making is
*using* `@tailwindcss/typography` (already installed, already imported in
`app/globals.css`, already proven on `/blog`) on the narrative sections of
`app/projects/[slug]/project-detail-client.tsx`, plus ~2 small, dependency-free
presentational components (`DecisionCard`, in-page anchor nav) built from
primitives already in the repo (Radix, Motion, `cn()`).

This is a content/template problem, not a technology gap. The codebase
already contains everything needed to build problem → my role → decisions →
outcome → reflection; it's just spread across an under-used typed schema and
two abandoned bespoke pages that show what to avoid.

## Why MDX-per-project loses to extended-typed-data (verified against the codebase)

The blog's MDX (`app/blog/**/page.mdx`) works by exploiting `@next/mdx`'s
**native App Router file convention**: each MDX file *is* a static route
(`page.mdx` inside a literal folder), configured via `pageExtensions` in
`next.config.js` and `mdx-components.tsx`. This pattern only works for
statically-named routes. Projects render through a **dynamic segment**
(`app/projects/[slug]/page.tsx` + `generateStaticParams`), which the native
`@next/mdx` convention cannot target — you cannot have one `[slug]/page.mdx`
resolve differently per project. Adopting MDX for project content would
therefore require a *second*, heavier content pipeline (`next-mdx-remote`
compiling MDX strings at build/request time, or a build-time content layer
like Velite/Contentlayer to read `.mdx` files by slug and compile them into
typed frontmatter) — a genuine architecture addition, not a "minimum viable"
one, and it would leave the project two divergent content systems (blog MDX
vs. project MDX-remote) instead of one.

Concretely, moving to MDX-per-project would also break or duplicate things
that already read `PROJECTS` (`lib/data/projects.ts`) directly and cheaply:

- `app/projects/projects-client.tsx` — the grid listing (cards, categories, `isLiveProduct` badge)
- `app/projects/opengraph-image.tsx` and per-project OG generation — needs typed `metrics`/`name`/`description`
- SEO JSON-LD (`components/seo/`) — structured data wants typed fields, not parsed prose
- `components/ui/global-recommendations.tsx` — cross-links case studies/articles by slug
- The v1.0 credibility audit process — the project's hard-won lesson (see `.planning/PROJECT.md` Key Decisions: *"the '6' lingered in 2 spots until audit remediation... grep all surfaces incl. OG generators"*) depends on claims being **greppable structured data** (`metrics: [{label, value}]`), not free-form prose a reviewer has to re-read paragraph by paragraph to find every numeric claim.

Extending `Project`/`processStory` keeps every one of those working unchanged
and keeps outcome-proofing auditable by `grep`.

## What's Already In The Repo (verify before adding anything)

| Need | Already exists | Where |
|------|-----------------|-------|
| Long-form typography (measure, leading, blockquote, link styling) | `@tailwindcss/typography` v0.5.19 installed, `@plugin '@tailwindcss/typography';` already active in `app/globals.css`, `prose` classes already proven on `/blog` (`app/blog/layout.tsx`) | package.json, globals.css:1-2 |
| Reading-progress bar | `ScrollProgress` — clean Motion `useScroll`+`useSpring` scaleX bar, already used on `/blog` | `components/ui/scroll-progress.tsx` |
| Card/section shell for callouts | `Card`, `CardHeader`, `CardTitle`, `CardContent` (Radix-based) — `SectionCard` in the current template is a working pattern to extend | `components/ui/card.tsx`, `project-detail-client.tsx:64-95` |
| Quote rendering | `<blockquote>` styling already used for `stakeholderQuotes` | `project-detail-client.tsx:930-932` |
| Animated media (video/image) | `AnimatedVideo`, `AnimatedImage`, `AnimatedIframe`, `VideoPlayer`, `VimeoEmbed` | `components/ui/animated-asset.tsx`, `video-player.tsx`, `vimeo-embed.tsx` |
| Scroll-linked list container | `@radix-ui/react-scroll-area` v1.2.9 installed | package.json |
| Section entrance choreography | `motion` v12.23.12, `VARIANTS_CONTAINER`/`VARIANTS_ITEM` stagger pattern already in template | `project-detail-client.tsx:45-62` |

Two components exist but are **cautionary examples, not reuse candidates**
(see "What NOT to Use" below): `components/ui/reading-progress.tsx` and the
gimmick-laden `app/projects/nagarro/nagarro-client.tsx` /
`app/projects/echo/echo-client-final.tsx` bespoke pages (confetti, Konami
code, custom cursor). These are exactly the one-off, un-auditable pattern
the milestone is replacing with a single evolvable `[slug]` template.

## Recommended Stack

### Core Technologies (already installed — zero new deps)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `@tailwindcss/typography` | 0.5.19 (installed) / 0.5.20 latest — range `^0.5.15` already covers it | `prose` utilities for narrative paragraphs, blockquotes, links | Already active repo-wide via `@plugin`; already battle-tested on `/blog`; zero install cost, zero new mental model |
| `motion` | 12.23.12 (installed) | Reading-progress bar, section stagger, in-page nav active-state transitions | Already the animation system; `useScroll`, `useSpring`, `useInView` cover every scroll-linked need this milestone requires |
| `@radix-ui/react-*` (existing set) | installed | `Card`/`Separator`/`Badge`/`ScrollArea` as building blocks for decision callouts and TOC | Already the design-system primitive layer; no new accessibility surface to audit |

### Supporting Libraries — additions actually needed

**None required.** Every capability in the question (pull-quotes, decision
callouts, in-page nav, reading progress, accessible typography) is reachable
by composing existing primitives. If you want an explicit "what to add"
line for the roadmap, it is a documentation change, not a `package.json`
change:

| "Library" | Version | Purpose | When to Use |
|-----------|---------|---------|-------------|
| *(none — apply `prose`/`prose-invert` classes)* | n/a | Long-form typography | Wrap the narrative sections (background, decisions, outcome, reflection) in a `prose prose-neutral dark:prose-invert max-w-3xl` container the same way `app/blog/layout.tsx` does |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Existing ESLint/Prettier/tsc/Jest chain | Validates new fields/components | No new tooling; new `Decision` type and components must pass `npm run lint` → `npx tsc --noEmit` → `npm test` per repo convention |

## Installation

```bash
# Nothing to install — @tailwindcss/typography, motion, and the Radix set
# used below are already dependencies. Optional: bump the typography plugin
# patch version (0.5.19 -> 0.5.20) opportunistically, not required for this
# milestone:
npm install @tailwindcss/typography@latest
```

## Data Model Addition (the one real "stack" change)

Not a library, but the concrete schema change that makes the narrative
structure renderable — extend `lib/data/types.ts`:

```typescript
// Add alongside existing processStory fields
processStory?: {
  background?: string;      // supports "\n\n"-separated paragraphs -> multiple <p>
  approach?: string;
  methodology?: string;
  keyInsights?: string[];   // KEEP for backward compat, but prefer `decisions` below
  decisions?: {              // NEW — first-class "decision with rationale"
    title: string;           // e.g. "Chose geolocation-first discovery"
    decision: string;        // what I decided
    rationale: string;       // why — the "because Y" the milestone requires
    outcome?: string;        // optional metric tie-back (keeps credibility guard explicit per-decision)
  }[];
  outcome?: string;
  reflection?: string;
  stakeholderQuotes?: { quote: string; author: string; role: string }[];
};
```

Rendering `background`/`approach`/`methodology`/`outcome`/`reflection` as
multiple paragraphs (split on `"\n\n"`, map to `<p>`) inside a `prose`
wrapper is sufficient for first-person narrative prose — no markdown parser
needed since these are structured, deck-backed fields, not freeform
authoring.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|--------------------------|
| Extended typed `Project`/`processStory` fields | MDX-per-project (`next-mdx-remote` or Velite/Contentlayer reading `app/projects/<slug>.mdx`) | Only if case studies become *editorial* content authored outside the deck-verification workflow (e.g., a future blog-style "process journal") where embedding arbitrary React components inline in prose is a real requirement — not the case here |
| `prose` (`@tailwindcss/typography`, already installed) for narrative typography | `react-markdown` + custom renderer | Only if fields need author-supplied inline markdown (bold/links mid-sentence) beyond paragraph breaks — current deck-backed content doesn't need this |
| Hand-rolled `DecisionCard` (Card + Badge + optional metric) | A dedicated "callout" library (e.g., `remark-admonitions`, `docusaurus`-style) | Only relevant in an MDX-based docs site; irrelevant here since content isn't MDX |
| Hand-rolled in-page anchor nav (`IntersectionObserver` + Radix `ScrollArea` if long) | `react-scroll`, `@radix-ui/react-navigation-menu` | Add `react-scroll` only if smooth-scroll-to-anchor behavior beyond native `scroll-behavior: smooth` + `<a href="#id">` is required (unlikely for ~5-7 sections per case study) |
| Existing `ScrollProgress` (`components/ui/scroll-progress.tsx`) for reading progress | `components/ui/reading-progress.tsx` or `scroll-progress-indicator.tsx` | Never for this milestone — see "What NOT to Use" |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|--------------|
| MDX-per-project content pipeline (`next-mdx-remote`, Contentlayer, Velite) | Requires a second content system alongside the existing `@next/mdx`-native blog; breaks direct `PROJECTS` consumers (grid, OG images, JSON-LD, credibility grep-audit); disproportionate to a template/copy milestone | Extend `Project`/`processStory` typed fields (above) |
| `components/ui/reading-progress.tsx` (emoji "Metrics→Initiatives→Impact→Reflection" journey tracker) | Hardcodes a 4-section journey unrelated to the new problem→role→decisions→outcome→reflection structure; a bespoke one-off built for a single abandoned page | `components/ui/scroll-progress.tsx` (already generic, already proven on `/blog`) |
| Bespoke per-project client files like `nagarro-client.tsx` / `echo-client-final.tsx` (confetti particles, Konami easter egg, custom cursor, 3D tilt cards) | 700-1100 lines of unauditable one-off code per project; directly contradicts the milestone's point (one evolvable `[slug]` template, not N bespoke pages); gimmicks undercut a "senior design leadership" narrative aimed at hiring managers | The shared, extended `[slug]` template — this is precisely the tech debt this milestone should not add more of |
| `react-compare-slider` / before-after image libraries | No before/after asset pairs currently exist in `lib/data/projects.ts` (checked); speculative addition with no content to back it | If/when a specific project genuinely has before/after visuals, build a plain two-column `grid` using the existing `AnimatedImage` component — no library needed for two static images |
| `react-markdown`, `remark`/`rehype` toolchain for narrative fields | Deck-backed fields are structured facts, not freeform editorial prose; adds a parsing/sanitization surface for zero current benefit | Paragraph-split strings + `prose` Tailwind classes |
| A new "table of contents" npm package | ~5-7 sections per case study; trivial with `IntersectionObserver` + anchor links, already how `BreadcrumbNav` neighbors do simple client-side nav in this repo | ~40-line custom component using existing `motion`/`cn()` patterns |

## Stack Patterns by Variant

**If a project has 3+ distinct "key decisions":**
- Render each as a `DecisionCard` (title + decision + rationale + optional outcome badge) in a 1-2 col grid, replacing the current fragile `keyInsights` string-split-on-":" pattern (`project-detail-client.tsx:817-819`)
- Because the milestone explicitly requires "decisions *with rationale*" as a distinct concept from the existing loose `keyInsights: string[]`

**If a narrative section (background/outcome/reflection) has multiple paragraphs:**
- Split the string on `"\n\n"`, map to `<p>` inside a `prose prose-neutral dark:prose-invert` container
- Because this gets accessible measure/line-height/spacing for free from the already-installed typography plugin, matching `/blog`'s existing look

**If in-page nav is added:**
- Build one small client component: `IntersectionObserver` over section `id`s, sticky/`fixed` nav rendered via Radix `ScrollArea` only if the section list is long enough to need internal scrolling (unlikely at ~6 sections)
- Because Motion's `useScroll`/`useInView` (already imported throughout the codebase) are sufficient without adding a routing/nav library

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|------------------|-------|
| `@tailwindcss/typography@0.5.19` (installed, range `^0.5.15`) | Tailwind CSS v4 (`^4.1.16`) via `@plugin` directive | Confirmed against current docs (Context7 `/tailwindlabs/tailwindcss-typography`): v4 usage is `@plugin "@tailwindcss/typography";` in CSS, exactly as already configured in `app/globals.css:2` — no config change needed |
| `motion@12.23.12` | React 19 (`^19.0.0`) | Already in use throughout; no version risk introduced |
| Extended `Project` type | `app/projects/[slug]/page.tsx` `generateStaticParams`, `app/projects/opengraph-image.tsx`, `components/seo/*` | All consume `PROJECTS`/`Project` directly — adding optional fields (`decisions?`) is additive/non-breaking; nothing needs updating unless it wants to read the new field |

## Sources

- Context7 `/tailwindlabs/tailwindcss-typography` — verified Tailwind v4 `@plugin` usage matches existing `app/globals.css` config; confirmed `not-prose` escape-hatch pattern for embedding non-prose components (e.g., `DecisionCard`) inside narrative sections
- `npm view @tailwindcss/typography version` — confirmed latest is 0.5.20; installed 0.5.19 is within the existing `^0.5.15` range (HIGH confidence, direct registry check)
- Direct codebase inspection (HIGH confidence, no external source needed): `lib/data/types.ts`, `lib/data/projects.ts`, `app/projects/[slug]/project-detail-client.tsx`, `app/blog/layout.tsx`, `mdx-components.tsx`, `next.config.js` (MDX + `pageExtensions` config), `components/ui/scroll-progress.tsx`, `components/ui/reading-progress.tsx`, `components/ui/scroll-progress-indicator.tsx`, `app/projects/nagarro/nagarro-client.tsx`, `app/projects/echo/echo-client-final.tsx`, `package.json`

---
*Stack research for: Long-form narrative case-study rendering, v2.0 Case-Study Depth milestone*
*Researched: 2026-08-15*
