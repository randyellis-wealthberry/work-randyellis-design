# Architecture Research: v3.0 Enterprise Credibility Integration

**Domain:** Next.js 15 App Router portfolio — integrating 3 capabilities into a shipped v2.0 codebase
**Researched:** 2026-08-22
**Confidence:** HIGH — every claim below is traced to file:line in the actual worktree, not the prompt's assumed map. Where a claim could not be verified live, it is marked LOW and flagged.

---

## 0. Headline correction to the brief

The brief's propagation map (`animated-number-basic.tsx` → `/about`, `/services`,
`lib/metadata.ts`, both OG generators, `PROOF_EXHIBITS`) **is not how the code is wired.**
Verified against the tree:

1. **`components/core/animated-number-basic.tsx` is dead code.** `grep -rn
   "AnimatedNumberBasic\|animated-number-basic"` across `app/`, `components/`, `lib/`
   returns **zero import sites**. The only files that reference it are `.planning/`
   history and one stale accessibility report. Nothing imports it, so editing it
   propagates to nothing live.
2. **It was retired by `8de7262` "refactor(home): rewrite the homepage as one
   argument"** (same day as this research, 2026-08-22). That commit's own message says
   the four-stat counter "used to count up from zero... The proof band states its
   figures in the markup" now, and "the retainer ledger and the proof exhibits move to
   `lib/data/retainer.ts`." The homepage counter component was replaced; the file was
   simply never deleted.
3. **What actually happened is independent duplication, not propagation-by-import.**
   Six live surfaces each hold their own **hand-typed literal copy** of the same three
   numbers. There is no shared constant, no shared data source, no import graph
   connecting them. "They propagate" (the phrasing used in
   `.planning/milestones/v2.0-MILESTONE-AUDIT.md:138` and repeated in this brief) is
   editorial shorthand for "the same mistake was pasted six times," not an
   architectural fact. This distinction changes the fix: there is no single source to
   edit — there are 6-8 independent edits, and a missed one is invisible until grepped.
4. **A genuinely new, previously-unflagged defect:** `app/about/opengraph-image.tsx:238`
   still renders **"6"** for Design Awards — the exact fabricated number v1.0's
   `CRED-01` was supposed to have purged sitewide. It never got fixed in the OG
   generator; every other surface (including the *root* `app/opengraph-image.tsx`,
   which has no awards figure at all) says 4 or omits awards entirely. `v1.0-ROADMAP.md`
   and `CREDIBILITY-COPY.md` both warned "grep all surfaces incl. OG generators" — this
   is the exact failure mode they warned about, still live in the current tree.
5. **One deck-audit finding is now stale.** `.planning/DECK-COVERAGE-AUDIT.md:494`
   (`NAGARRO-35`) and the Phase 9 matrix both document `"$50M+ in business impact"` at
   `nagarro-client.tsx:552/577`. That file no longer exists in that form — it was
   rewritten from 1,118 lines to 119 lines by `4c15468` "converge 8 case studies on one
   editorial template," and the current file (read in full) contains no `$50M` text
   anywhere. **This finding should be dropped from the v3.0 scope**, not carried
   forward as a blocker — it was resolved as a side effect of unrelated template work.

---

## 1. Corrected propagation map (metric integrity)

### 1a. Where the four figures actually live, structurally

`components/core/animated-number-basic.tsx:5-16` — four independent `useState` hooks,
each set by its own `setTimeout` in one `useEffect`, each rendered in its own sibling
`<div className="flex flex-col items-center py-1">` grid cell (lines 22-129, four
cells in a `grid-cols-2 md:grid-cols-4`):

| State | Value | Cell (lines) | Renders as | Label |
|---|---|---|---|---|
| `value1` | `2.5` | 22-48 | `{AnimatedNumber}M` | "Users Impacted" |
| `value2` | `4` | 50-73 | `{AnimatedNumber}` (bare, no prefix/suffix) | "Design Awards" |
| `value3` | `50` | 75-104 | `${AnimatedNumber}M` | "in product value" |
| `value4` | `800` | 106-129 | `{AnimatedNumber}` (bare, no `+`) | "Designers Mentored" |

**The four are not interdependent** — no shared state, no derived values, four fully
separate JSX blocks with their own SVG icon markup. Deleting cells 1, 3, 4 and keeping
cell 2 (`value2` / "Design Awards") is mechanically trivial *in this file*. But per
finding #1 above, **this file is unreachable from any route** — editing it has zero
effect on the live site. It should be deleted outright as dead code, not "fixed," unless
Phase 11 wants to keep it around as a documented historical artifact (not recommended —
dead components that still hold fabricated numbers are exactly the kind of thing a
future grep-based audit re-flags as a false positive).

Every *live* surface reproduces the same "4 independent entries, no shared source"
shape — confirmed by reading each one:

- `lib/data/retainer.ts:44-52` `PROOF_EXHIBITS` — a 4-element readonly array literal,
  each `{ value, context }`. Comment at line 41 explicitly says "The period is shared by
  all four" — i.e. the design already treats this as a 4-item unit, not arbitrary rows.
- `app/about/about-client.tsx:19-40` `achievements` — a 4-element array literal,
  `{ value, label, description }`, structurally parallel to `PROOF_EXHIBITS` but a
  separate, non-shared array in a separate file.
- `app/opengraph-image.tsx:96-179` — a hand-built 3-cell flex row (Users Impacted,
  Product Value, Designers Mentored — **no awards cell at all** in the root OG image).
- `app/about/opengraph-image.tsx:166-276` — a hand-built 3-cell "Career Impact" card
  (Users Impacted, **Design Awards = "6" [BUG]**, Product Value) plus a *separate*
  bullet list at lines 145-163 that independently states "Mentored 800+ Designers
  Globally" in prose, not a stat cell. So this one file carries the 800 figure in a
  *different shape* than every other surface.

### 1b. Full corrected surface list, file:line, live vs. dead

| # | Surface | File:line | Figures present | Status |
|---|---|---|---|---|
| 1 | Homepage proof band | `app/page.tsx:165-179` (renders `PROOF_EXHIBITS`) + `lib/data/retainer.ts:48-51` (data) | 2.5M+, $50M, 800+, 4 | **LIVE** |
| 2 | Homepage FAQ copy | `app/page.tsx:85` | "mentored 800+ designers" (prose, not a stat) | **LIVE** |
| 3 | `/services` proof band | `app/services/services-client.tsx:189-199` (renders `PROOF_EXHIBITS`) — same data as #1 | 2.5M+, $50M, 800+, 4 | **LIVE** |
| 4 | `/services` metadata description | `app/services/page.tsx:10` | 2.5M+, $50M | **LIVE** |
| 5 | `/about` stats grid | `app/about/about-client.tsx:19-40` (data) + `:455-469` (render) | 2.5M+, 4, $50M, 800+ | **LIVE** |
| 6 | `/about` bio metadata description | `app/about/page.tsx:10` | 2.5M+ ("100+ leads, 40% retention boost" is Nagarro-specific, separate claim) | **LIVE** |
| 7 | `/about` OG metadata description | `app/about/page.tsx:27` | 2.5M+, 4 awards, $50M | **LIVE** |
| 8 | Root OG image | `app/opengraph-image.tsx:118,143,168` | 2.5M+, $50M, 800+ (no awards cell) | **LIVE** |
| 9 | About OG image | `app/about/opengraph-image.tsx:212,238,264,161` | 2.5M+, **"6" [BUG]**, $50M, "800+" (prose bullet, not a cell) | **LIVE** |
| 10 | Sitewide base metadata | `lib/metadata.ts:25` | 2.5M+, $50M | **LIVE** — feeds every page's default `<meta name="description">` unless overridden by `createPageMetadata`/`projectMetadata` |
| 11 | Homepage regression test | `__tests__/integration/home-page-argument.test.tsx:59-66` | asserts `["2.5M+", "$50M", "800+", "4"]` are present in rendered HTML | **LIVE TEST — will fail the moment #1 changes; must be rewritten in the same commit** |
| 12 | `AnimatedNumberBasic` component | `components/core/animated-number-basic.tsx:12-15` | 2.5, 4, 50, 800 | **DEAD** — unreferenced by any route |
| 13 | `RelatedContent` component | `components/seo/related-content.tsx:255` | "2.5M+ users" (one prose line) | **DEAD** — import is commented out at `app/blog/layout.tsx:4`; component is never rendered |
| 14 | Nagarro "$50M+ business impact" | previously `nagarro-client.tsx:552/577` per `.planning/DECK-COVERAGE-AUDIT.md:494` | — | **NO LONGER EXISTS** — file was rewritten to 119 lines by `4c15468`; confirmed absent by full read |
| 15 | `projects/opengraph-image.tsx` | `app/projects/opengraph-image.tsx` (full file read) | none of the three figures | **NOT A CONSUMING SURFACE** — worth ruling out explicitly since it's a third OG generator the brief didn't ask about but a naive grep might hit |
| 16 | Doc/comment mentions | `PRODUCT.md:19,43,57`, `README.md:11`, `SEO_OPTIMIZATION_REPORT.md:52-53` (still says "6 design awards" too), `docs/reports/accessibility/implementation-roadmap.md:636,693`, `.impeccable/design.json:366` (generated artifact, `generatedAt` field, not hand-authored) | all three | **NOT SHIPPED HTML** — repo docs, not rendered pages. Low priority; `PRODUCT.md`/`README.md` are worth a pass for hygiene but are not a credibility surface a recruiter's browser renders. |
| 17 | Design-system doc-comment | `components/ui/animated-metric-value.tsx:10,38` | "2.5M+", "$50M" cited as *examples* in JSDoc | **NOT A CLAIM** — documents the "True Precision Rule" (a figure renders at the precision it was authored with); no edit needed unless the example itself should be swapped for hygiene |

**Net correction:** the brief names 6 surfaces; the true count is **9 live rendering
surfaces + 1 live regression test + 3 confirmed-dead files + 1 stale audit finding to
drop.** The single most important miss in the brief's map is `app/about/opengraph-image.tsx`
carrying the **live "6 Design Awards" bug** — exactly the class of surface (an OG
generator) that the v1.0 postmortem already warned gets missed.

### 1c. "4 Design Awards must survive" — surgical shape

The backed figure is never entangled with the three unbacked ones at the data level —
every surface stores it as one array element or one JSX cell alongside, not intermixed
with, the others:

- `retainer.ts:51` — `{ value: "4", context: "Design awards won" }` is PROOF_EXHIBITS[3].
- `about-client.tsx:25-29` — `{ value: "4", label: "Design awards", ... }` is
  achievements[1].
- `animated-number-basic.tsx:50-73` — its own grid cell, independent state.
- Root OG image (`app/opengraph-image.tsx`) carries **no awards cell at all** — nothing
  to touch there.
- About OG image (`app/about/opengraph-image.tsx:230-248`) has the buggy "6" cell to
  fix →  "4".
- `lib/seo/json-ld.ts:80-85` (`personSchema`, read during this research) already lists
  the 4 named awards verbatim with issuer/category as `Person.award` — this is the
  canonical backed source and does not need to change.

**Surgical rule for every surface:** remove the array element / JSX block / state hook
for the other three; do not touch the "4" element. Because every surface stores these as
independent array entries or independent JSX blocks (never a single interpolated string
mixing multiple figures), there is no risk of a regex/string edit clipping the awards
figure by accident — each removal is a discrete block deletion.

**Design-system side effect (flag for Phase 11 planning, not just data deletion):**
`retainer.ts:39-43`'s own comment says the proof band is deliberately "four fields... so
the band is scannable by structure" and DESIGN.md's grids are all `grid-cols-2
sm:grid-cols-4`. Deleting 3 of 4 entries leaves a 4-column grid with 1 item — every one
of surfaces #1, #3, #5, #8, #9 needs a **layout decision**, not just a data edit (e.g.
collapse to a single stated credential, or replace the removed slots with new
deck-backed figures if any exist). This is the single biggest scope-sizing risk for
Phase 11: it is not "delete 3 array elements," it is "redesign 5 stat bands around 1
surviving figure."

---

## 2. Echo + Nagarro reframing (enterprise legibility)

### 2a. What changes and what doesn't

**The `Project` type does not need to change.** `lib/data/types.ts:2-81` already has
every field ENT-01..03 needs: `category: string` (freeform — see below), `categories?:
string[]`, `metrics?: {label,value,performanceLevel?}[]`, `featured: boolean`. No new
field is required for recategorization or reframing.

**`category` is already freeform text, not a constrained enum, in practice.** `lib/data/types.ts:105-113`
exports `PROJECT_CATEGORIES` (`"All" | "Enterprise (SaaS)" | "Mobile App" | ...`), but
grepping actual data shows it is **not enforced**: `nagarro`'s category is
`"Design Leadership"` (`lib/data/projects.ts:952`) and `rambis-ui`'s is
`"Design System"` (singular — not `"Design Systems"`, the enum's plural form) — neither
value is in the enum. `PROJECT_CATEGORIES` itself is dead — it's re-exported by
`lib/data/index.ts:14` but never imported into any filter UI. **This means Echo's
`category` can be changed to any string, including a brand-new one shared with Nagarro,
with zero type friction.**

Current `category` values, all 8 projects (`lib/data/projects.ts`):

| Project | slug | category (line) |
|---|---|---|
| GrowIt! | growit | "Mobile App" (:14) |
| Oh!Plays | ohplays | "Mobile App" (:215) |
| LedgerIQ | ledgeriq | "Enterprise (SaaS)" (:406) |
| Addvance | addvanced | "Mobile App" (:565) |
| **EchoDrive** | echo | **"Mobile App" (:764/766)** |
| **Design Leadership @ Nagarro** | nagarro | **"Design Leadership" (:952)** |
| Rambis UI | rambis-ui | "Design System" (:1128) |
| Waffle | waffle | "AI/ML" (:1305) |

### 2b. Downstream effects of changing Echo's `category` — traced, not assumed

1. **`/projects` grid row label** — `app/projects/projects-client.tsx:88`:
   `<span>{project.category}</span>` renders the raw string directly. Change is
   immediate and visible.
2. **Related-projects on the detail page — the one genuine behavioral dependency.**
   `app/projects/[slug]/page.tsx:42-44`:
   ```ts
   const relatedProjects = PROJECTS.filter(
     (p) => p.id !== project.id && p.category === project.category,
   ).slice(0, 2);
   ```
   This is **exact string equality**, computed server-side, passed to
   `ProjectDetailClient`. Today, three projects share `"Mobile App"`: Oh!Plays,
   Addvance, EchoDrive. If Echo's category changes:
   - Echo's own related-projects list changes (currently would show 2 of the other
     "Mobile App" projects, but Echo has its *own* standalone route/client — verify
     whether `echo-client.tsx` even consumes `relatedProjects`; it does not — Echo,
     Nagarro, Addvance, Rambis UI and Waffle are the 5 standalone routes and none of
     them import `ProjectDetailClient`; only `[slug]` (serving growit/ohplays/ledgeriq)
     does). **So changing Echo's category has no effect on Echo's own page's related
     list** — it only affects growit/ohplays/ledgeriq's rendering, if any of those
     shared Echo's category. They don't (Oh!Plays does, growit/ledgeriq don't).
   - Oh!Plays and Addvance's related-projects picks: today, each other + Echo (2 of 2
     slots filled from a pool of "the other 2 Mobile App projects"). After Echo moves
     off "Mobile App," Oh!Plays and Addvance each only have one remaining match (each
     other) — not a break, just a smaller related-list. Worth a note in the plan, not a
     blocker.
   - **If Echo's new `category` is set to match Nagarro's** (e.g. both become
     `"Enterprise (SaaS)"` or a new value like `"Enterprise & Regulated"`), this same
     exact-match mechanism makes them **mutually related for free** — no new code, just
     a shared string. This directly serves ENT-04 (see §3).
3. **JSON-LD `CreativeWork.genre`** — `lib/seo/json-ld.ts:140` (`buildCreativeWorkSchema`)
   sets `genre: props.category`, and `props` comes from
   `lib/metadata.ts:271-279` (`projectCreativeWorkProps`), which passes
   `category: project.category` straight through. No code change needed in either file
   — output changes automatically when the data changes.
4. **`projectMetadata()` title and keywords** — `lib/metadata.ts:223-241`. Title is
   `${project.name} | ${project.subtitle ?? project.category}` — Echo has a `subtitle`
   (`"Streamlining Logistics Through Digital Innovation"`), so **the category change
   does not touch the page `<title>`.** But `keywords` at line 237 includes
   `project.category` directly in the array, so Echo's SEO keywords list changes.
5. **OG image** — `projectOgImage()` (`lib/metadata.ts:199-208`) reads
   `project.thumbnail`/`project.images`, never `category`. **No effect.**
6. **`/projects?category=` search filter** — `lib/project-utils.ts:23-44`
   `filterProjectsByCategory` does a case-insensitive **substring** match across
   `name`, `category`, `categories[]`, and `tags[]` combined — not an exact match on
   `category` alone. So Echo is *already* findable under many terms via its `tags`
   array (`lib/data/projects.ts` echo tags include "Logistics Technology," "Fleet
   Management," etc. — none currently overlap Nagarro's tags). Recategorizing changes
   what `?category=Mobile%20App` returns for Echo, and what a new shared term (e.g.
   `?category=Enterprise`) would return once both `category` and/or `tags` carry it.

### 2c. "Promoted" — what infrastructure already exists

Echo is **already featured** on the homepage: `app/page.tsx:55`
`const FEATURED_SLUGS = ["waffle", "echo", "growit"];`. "Promoted" per ENT-01 most
plausibly means promoted *within the enterprise framing* (category, badge, grouped
listing) rather than needing new homepage-featured plumbing — that part is done.

### 2d. Echo's qualitative metric — exact location and clean removal options

`lib/data/projects.ts` echo entry, `metrics` array (comment at the line above it reads
*"Client business figures... removed per the CRED-08 line Randy set for Echo: process
and design only"*):
```ts
metrics: [
  { label: "ELD Compliance", value: "100%" },
  { label: "Platforms Designed", value: "2" },
  { label: "Call Center Stress Reduction", value: "Significant" },  // ← the qualitative row
],
```
`metrics.value` is typed `string` (`lib/data/types.ts:32`), so `"Significant"` is not a
type violation — it's a content problem, not a schema problem.

**Where it actually renders — this is the one non-obvious finding for this question.**
Echo's own visible page does **not** show this array: `echo-client.tsx:67-71` passes an
explicit `proof` prop to `CaseStudyTemplate`, which **overrides** the template's default
`(project.metrics ?? []).slice(0,4)` fallback (`case-study-template.tsx:281-283`). The
hand-authored `proof` array already reads `100%`, `2`, `"On-site"` (a *different*,
intentional qualitative value used for "Research method" — that one is fine, it's
explicitly a method label, not a metric standing in for a number). **So the qualitative
"Significant" row is invisible on the rendered page.** It is not invisible everywhere,
though: `lib/metadata.ts:271-284` (`projectCreativeWorkProps`) passes `metrics:
project.metrics` straight through, and `lib/seo/json-ld.ts:166-171`
(`buildCreativeWorkSchema`) maps every entry to a schema.org `PropertyValue`:
```ts
if (props.metrics && props.metrics.length > 0) {
  schema.additionalProperty = props.metrics.map((metric) => ({
    "@type": "PropertyValue", name: metric.label, value: metric.value,
  }));
}
```
**So `"Significant"` ships live today in Echo's server-rendered JSON-LD
`additionalProperty` array on `/projects/echo`** — a structured-data surface, invisible
on the page itself. This is the same class of miss as the About OG "6" bug: a
non-visible-copy surface holding a problem the visible page already fixed.

**Options, cleanest first:**
1. **Delete the row.** `buildCreativeWorkSchema` already guards with `.length > 0`, so
   dropping to a 2-entry `metrics` array requires no other code change anywhere. This is
   the surgical fix — it matches what the visible page already implicitly decided
   (the page's own `proof` override never showed this row).
2. Replace `"Significant"` with a real number if Randy's source material has one for
   call-center stress reduction — same shape, no structural change either way.
3. Move the claim into prose (`processStory` / a `capabilities` entry) if it's worth
   keeping qualitatively — do **not** leave it in `metrics[]`, which is the one field
   both the type comment and the JSON-LD builder treat as quantitative-shaped data.

Cross-check: no other project's `metrics[]` has a qualitative value — growit,
addvanced (both read in full) are 100% numeric/percentage-styled. Echo is the only
offender, confirming the brief's framing.

---

## 3. `/projects` filter / grouping

### 3a. What's already built — this changes the entire question

`app/projects/page.tsx` is a **server component** (default export, no `"use client"`,
static `export const metadata`). It renders `<ProjectsClient />` inside
`<Suspense fallback={null}>` — the code comment at line 38 explains this Suspense
wrapper exists specifically because Next 15 requires it for `useSearchParams()` on a
statically prerendered route.

`app/projects/projects-client.tsx` **is a client component that already reads a URL
search param and filters with it — this infrastructure exists today, unused by any
visible UI:**
```ts
// projects-client.tsx:143-145
const searchParams = useSearchParams();
const categoryTerm = searchParams?.get("category")?.trim() ?? "";
const visibleProjects = filterProjectsByCategory(PROJECTS, categoryTerm);
```
This was built in Phase 10 (D-13) **to back the `WebSite` JSON-LD `SearchAction`**
(`lib/seo/json-ld.ts:108-111`: `urlTemplate:
"${WEBSITE_URL}/projects?category={search_term_string}"`), i.e. so Google's sitelinks
search box can deep-link into a filtered view — not originally built for a human-facing
filter UI. But the plumbing is generic and already includes:
- Case-insensitive substring match across name/category/categories/tags
  (`lib/project-utils.ts:23-44`).
- An accessible result-count summary: `role="status"` region
  (`projects-client.tsx:177-205`) that announces "Showing N projects matching 'X'" or
  "No projects match 'X'" with a "Clear filter" link back to `/projects`.
- A real `<Link href="/projects?...">`-based navigation model (shareable, bookmarkable,
  works without JS beyond the client-component hydration Next already requires here).

**There is currently no visible trigger UI** — no buttons/pills/dropdown that set
`?category=`. A user can only reach a filtered view via a typed URL or Google's search
box. That's the gap ENT-04 needs to close.

### 3b. Status badge container — confirmed shared stacking container

`projects-client.tsx:86-119`, inside `ProjectRow`:
```tsx
<span className="flex flex-wrap items-center gap-x-2 gap-y-1.5 ...">
  <span>{project.category}</span>
  <span aria-hidden="true">·</span>
  <Badge ...>{STATUS_LABEL[project.status]}</Badge>
  {project.isLiveProduct && <Badge className="...bg-amber-600...">Live Product</Badge>}
  {project.isComposite && <Badge variant="secondary">Composite</Badge>}
</span>
```
This single `flex flex-wrap` span is the "shared stacking container" the milestone
context refers to — category text, status badge, Live Product badge, and Composite
badge already coexist here without overlap because they're siblings in one wrapping
flex row, not absolutely positioned. **Any new category-driven visual treatment (a
badge, a pill) must be added as another sibling in this same container**, not as a
separately positioned element, or it will reintroduce the overlap problem v2.0 already
solved.

### 3c. Recommendation: extend the existing `?category=` mechanism with a visible link/pill row — not client state, not a new route

**Pick: reuse the existing `searchParams`-driven filter, and add a small set of
visible `<Link href="/projects?category=...">` pills/buttons above the list, styled
consistently with the existing `Badge`/tag vocabulary.**

Rejected alternatives, with reasoning:
- **Client-side `useState` filter** — would duplicate a mechanism that already exists
  and already has an accessible announcement pattern, tests, and SEO wiring
  (`SearchAction`). Building a second, unrelated filter state would fork the "what does
  `/projects?category=X` mean" contract into two inconsistent implementations (one
  driven by URL, one by memory) and orphan the `SearchAction` schema's promise that the
  URL param does something. No reason to introduce this.
- **A brand-new route (e.g. `/projects/enterprise`)** — explicitly ruled out by the
  question's constraint. It would also duplicate `ProjectsClient`'s entire rendering
  path for one grouping, and a new route needs its own metadata/OG/breadcrumb wiring
  that `/projects?category=` gets for free from the existing page.
- **Static section grouping** (hard-split the list into "Enterprise" vs. everything
  else, unconditionally, no filter) — simplest to build, but throws away the one thing
  already built and tested (the `?category=` mechanism, its `SearchAction` schema, its
  accessible status region) and produces a page that never shrinks back to "show
  everything," which is worse for a reader who lands on `/projects` cold.

**The cleanest single integration path, concretely:**
1. Give Echo and Nagarro **the same `category` (or an added shared `tags[]` entry)** —
   e.g. `"Enterprise & Regulated"` — as part of ENT-01/03 (§2). This is a data-only
   change with the downstream effects already traced in §2b: it also makes them
   mutually appear in each other's `relatedProjects` for free via
   `[slug]/page.tsx:42-44`'s existing exact-match logic (a bonus, not the primary
   mechanism, since neither Echo nor Nagarro renders through `[slug]`/`ProjectDetailClient`
   — only the *category label itself* changes on their own pages).
2. Add a small row of `<Link href={`/projects?category=${encodeURIComponent(term)}`}>`
   elements to `projects-client.tsx`, near the page heading (around line 174, before or
   after the existing `categoryTerm` status paragraph) — no new component required, this
   is a few lines inside the existing client component.
3. **No change to `filterProjectsByCategory` or the `SearchAction` schema** — both
   already handle arbitrary terms.
4. **No change to the badge-stacking container** — the grouping is a page-level entry
   point (pills above the list), not a per-card badge, so §3b's container is unaffected
   unless the plan also wants a visible "Enterprise" chip on the grid row itself, in
   which case it must be added as a sibling inside that exact `flex flex-wrap` span.

**Accessibility contract this must meet** (all already established by the existing
code, so this is "match it," not "invent it"):
- Each filter trigger is a real `<a href>` (via `next/link`), not a `<button>` with a
  client-only `onClick` — keyboard/no-JS/share-URL parity, consistent with every other
  nav element on this page (`BreadcrumbNav`, "Clear filter").
- The result-count/empty-state message stays in a `role="status"` live region
  (`projects-client.tsx:177-205` pattern) so screen-reader users get the same
  "Showing N projects" / "No projects match" announcement a sighted user gets visually.
- Active-filter state needs a visible + programmatic indicator (e.g.
  `aria-current="true"` on the active pill) since none of the current three badges
  (`STATUS_LABEL`, Live Product, Composite) currently model an "active/selected" state —
  this is new, not reused, and should not be skipped.
- Minimum 44px touch target on each pill, matching every other interactive control on
  this page (`min-h-[44px]` appears throughout `projects-client.tsx`'s other links).

---

## 4. Suggested build order — Phase 11 (metric integrity) then Phase 12 (enterprise legibility)

### 4a. Why 11 before 12, not interleaved or parallel

- **No data dependency runs 12→11.** Phase 12's Echo/Nagarro work is entirely inside
  `lib/data/projects.ts` and the `app/projects/*` tree; Phase 11's figure removal is
  entirely inside sitewide surfaces (`retainer.ts`, `about-client.tsx`,
  `services/page.tsx`, both root/about OG generators, `lib/metadata.ts`) that never
  touch `lib/data/projects.ts`. They are architecturally independent.
- **But `app/page.tsx` is touched by both**, which is the real reason to sequence
  rather than parallelize:
  - Phase 11 edits `app/page.tsx:85` (FAQ prose: "mentored 800+ designers") and
    consumes `PROOF_EXHIBITS` at `:165` (no code change there, just data change
    upstream in `retainer.ts`, but the rendered section is on this file's route).
  - Phase 12, if the homepage's "Selected work" paragraph (`app/page.tsx`, the text
    naming "EchoDrive carried two logistics platforms..." and "Nagarro's design
    practice reached 18,000 employees across 36 countries") is reworded as part of the
    enterprise reframing, touches the same file.
  - Running them as parallel plan waves risks two uncoordinated edits to the same
    ~250-line client component. Running Phase 11 to completion first removes its edits
    from the diff surface before Phase 12 opens the file.
- **Phase 12's grouped entry point (§3c) benefits from Phase 11 shipping first for a
  narrower reason: test hygiene.** `__tests__/integration/home-page-argument.test.tsx`
  needs rewriting in Phase 11 regardless (its `"2.5M+"/"$50M"/"800+"` assertions will
  fail the moment the figures are removed). If Phase 12 also touches
  `app/page.tsx` (Selected-work copy), doing so against a homepage whose test suite is
  already green post-Phase-11 avoids stacking two waves of red tests on the same file.

### 4b. Phase 11 internal order

1. Fix the live "6 Design Awards" bug (`app/about/opengraph-image.tsx:238`) as its own
   small, independently-shippable commit — it's a pure bug fix (contradicts the
   already-correct "4" everywhere else), not a scope decision, and shouldn't wait on
   the harder "what replaces the 3 unbacked figures" design work.
2. Delete `components/core/animated-number-basic.tsx` and
   `components/seo/related-content.tsx`'s dead `2.5M+` line (or the whole
   commented-out-consumer file, if nothing else needs it — confirm no other planned
   Phase 12 work wants `RelatedContent` revived before deleting it outright).
3. Decide the replacement layout for the "4 items → 1 item" grids (§1c design-system
   side effect) once, and apply that single decision across all five surfaces
   (`retainer.ts` `PROOF_EXHIBITS`, `about-client.tsx` `achievements`, root OG image,
   about OG image, — the FAQ prose and `lib/metadata.ts`/`page.tsx` metadata
   descriptions are prose, not grids, and can be edited independently of the layout
   decision).
4. Update `__tests__/integration/home-page-argument.test.tsx`'s figures assertion to
   pin the new state (assert absence of the removed figures / presence of whatever
   replaces them) — this **is** the "pinned with a regression test" requirement in
   `PROJECT.md`, not a separate new test file.
5. Run the same `grep -rn '2\.5M\|\$50M\|800+' app lib components` sweep this research
   used, as the phase's own closing gate, mirroring how Phase 9 closed the `$50M`
   wording task (`09-03-PLAN.md`'s pattern is a good template to reuse literally).

### 4c. Phase 12 internal order

1. **ENT-02 (Echo qualitative metric) first, smallest and fully isolated** — delete one
   array entry in `lib/data/projects.ts`'s echo `metrics[]`. Zero downstream code
   changes (§2d). Ships independently of everything else in the phase.
2. **ENT-01 (Echo recategorized) next** — change `echo.category` (and/or add to
   `echo.tags`). This is the one edit every other Phase 12 item depends on, because §3c's
   grouped-entry-point pill needs the *final* string. Verify the related-projects
   side effect on Oh!Plays/Addvance (§2b.2) is acceptable (it is — a cosmetic reduction
   from 2 to 1 related items, not a break) as part of this step, not as an
   afterthought.
3. **ENT-03 (Nagarro reframing)** can run in parallel with ENT-01/02 if the plan wants
   — it touches a different object in the same `lib/data/projects.ts` file (the
   `nagarro-design-leadership` entry, not `echo`) and, if it also touches
   `nagarro-client.tsx`, that file is not touched by anything else in either phase. The
   only reason to sequence it after ENT-01 rather than alongside is if the "shared
   category" decision in §3c also changes Nagarro's `category` field (today
   `"Design Leadership"`) — if so, do ENT-01 and ENT-03's category change together, in
   the same plan, since they're setting the same target string.
4. **ENT-04 (grouped entry point) last** — depends on ENT-01/03's final category value
   being settled; adds the pill row to `projects-client.tsx` per §3c.

### 4d. File-level conflict matrix, both phases

| File | Phase 11 touches | Phase 12 touches | Risk |
|---|---|---|---|
| `app/page.tsx` | Yes — FAQ line :85, `PROOF_EXHIBITS` consumption :165 | Maybe — Selected-work paragraph naming Echo/Nagarro, if reworded | **Medium — sequence phases, don't parallelize** |
| `lib/data/retainer.ts` | Yes — `PROOF_EXHIBITS` data | No | None |
| `app/about/about-client.tsx` | Yes — `achievements` data + render | No | None |
| `app/about/opengraph-image.tsx`, `app/opengraph-image.tsx` | Yes | No | None |
| `lib/metadata.ts`, `app/about/page.tsx`, `app/services/page.tsx` | Yes — description strings | No | None |
| `__tests__/integration/home-page-argument.test.tsx` | Yes | No | None |
| `lib/data/projects.ts` | No | Yes — echo + nagarro entries | None (Phase 11 never opens this file) |
| `app/projects/projects-client.tsx` | No | Yes — new pill row | None |
| `app/projects/echo/echo-client.tsx`, `app/projects/nagarro/nagarro-client.tsx` | No | Maybe — if visible copy is reworded alongside the data change | None (Phase 11 doesn't touch these) |
| `components/core/animated-number-basic.tsx` | Yes — deleted | No | None |
| `lib/seo/json-ld.ts`, `lib/project-utils.ts` | No | No (output changes via data, not code edits) | None |

**Single actionable conflict: `app/page.tsx`.** Everything else is a clean split. This
alone is sufficient reason to run Phase 11 to completion (including its
`__tests__/integration/home-page-argument.test.tsx` rewrite) before opening Phase 12
work that might touch the homepage's Selected-work copy.

---

## 5. New vs. modified — explicit per touchpoint

| Touchpoint | New or Modified | Phase |
|---|---|---|
| `app/about/opengraph-image.tsx` "6"→"4" | Modified (bug fix) | 11 |
| `lib/data/retainer.ts` `PROOF_EXHIBITS` (3 entries removed) | Modified | 11 |
| `app/about/about-client.tsx` `achievements` (3 entries removed) | Modified | 11 |
| `app/opengraph-image.tsx`, `app/about/opengraph-image.tsx` (3 figures removed) | Modified | 11 |
| `lib/metadata.ts:25`, `app/about/page.tsx:10,27`, `app/services/page.tsx:10` | Modified | 11 |
| `app/page.tsx:85` FAQ prose | Modified | 11 |
| `components/core/animated-number-basic.tsx` | **Deleted** | 11 |
| `components/seo/related-content.tsx` (2.5M+ line, or whole file) | Modified or deleted | 11 |
| `__tests__/integration/home-page-argument.test.tsx` | Modified (the "pinned regression test") | 11 |
| `lib/data/projects.ts` echo `metrics[]` (1 entry removed) | Modified | 12 |
| `lib/data/projects.ts` echo `category`/`tags` | Modified | 12 |
| `lib/data/projects.ts` nagarro entry (reframing copy/category) | Modified | 12 |
| `app/projects/projects-client.tsx` (pill row) | **New** UI, existing file | 12 |
| `app/projects/echo/echo-client.tsx`, `nagarro-client.tsx` (if copy reworded) | Modified | 12 |
| `Project` type (`lib/data/types.ts`) | **Not touched by either phase** — every field needed already exists | — |
| `lib/project-utils.ts`, `lib/seo/json-ld.ts` | **Not touched by either phase** — generic code, output changes via data only | — |

---

## Sources

All findings sourced directly from the working tree at commit history through
`8de7262` (2026-08-22), read via `Read`/`grep`/`git log` in this session:
- `components/core/animated-number-basic.tsx`, `lib/data/types.ts`, `lib/data/retainer.ts`,
  `lib/metadata.ts`, `lib/seo/json-ld.ts`, `lib/project-utils.ts`
- `app/opengraph-image.tsx`, `app/about/opengraph-image.tsx`, `app/projects/opengraph-image.tsx`
- `app/page.tsx`, `app/about/page.tsx`, `app/about/about-client.tsx`, `app/services/page.tsx`,
  `app/services/services-client.tsx`
- `app/projects/page.tsx`, `app/projects/projects-client.tsx`, `app/projects/[slug]/page.tsx`,
  `app/projects/echo/echo-client.tsx`, `app/projects/nagarro/nagarro-client.tsx`
- `lib/data/projects.ts` (full echo, nagarro, growit entries + all 8 `category` lines)
- `components/case-study/case-study-template.tsx`, `components/ui/badge.tsx`,
  `components/ui/animated-metric-value.tsx`, `components/seo/related-content.tsx`,
  `app/blog/layout.tsx`
- `__tests__/integration/home-page-argument.test.tsx`
- `.planning/PROJECT.md`, `.planning/MILESTONES.md`, `.planning/DECK-COVERAGE-AUDIT.md`,
  `.planning/milestones/v2.0-MILESTONE-AUDIT.md`,
  `.planning/milestones/v2.0-phases/09-cross-surface-verification/09-CROSS-SURFACE-MATRIX.md`
  and `09-03-PLAN.md`/`09-03-SUMMARY.md`, `.planning/CREDIBILITY-COPY.md`
- `git log --oneline` for `app/page.tsx`, `app/projects/nagarro/nagarro-client.tsx`,
  `components/core/animated-number-basic.tsx`, `lib/data/retainer.ts`; `git show 8de7262`

---
*Architecture research for: v3.0 Enterprise Credibility (Phases 11-12)*
*Researched: 2026-08-22*
