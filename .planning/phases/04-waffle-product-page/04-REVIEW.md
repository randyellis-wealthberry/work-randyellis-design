---
phase: 04-waffle-product-page
reviewed: 2026-08-15T13:09:07Z
depth: deep
files_reviewed: 8
files_reviewed_list:
  - app/projects/waffle/page.tsx
  - app/projects/waffle/waffle-client.tsx
  - app/projects/projects-client.tsx
  - lib/data/projects.ts
  - lib/data/types.ts
  - __tests__/projects/waffle/waffle-page.test.tsx
  - __tests__/projects/waffle/waffle-grid-card.test.tsx
  - public/projects/waffle/logo.svg
findings:
  critical: 0
  warning: 2
  info: 7
  total: 9
status: issues_found
---

# Phase 04: Code Review Report

**Reviewed:** 2026-08-15T13:09:07Z
**Depth:** deep
**Files Reviewed:** 8
**Status:** issues_found

## Summary

Reviewed the Waffle product showcase page (server route + client component), the
`isLiveProduct` grid badge added to `projects-client.tsx`, the new Waffle
`PROJECTS` entry, the `Project` type extension, both test suites, and the SVG
logo asset. Review was performed against the committed phase-04 state (commits
`e9d0553` → `6c5e0d8`); none of the 8 in-scope files carry uncommitted edits, so
the concurrent session's working-tree changes are excluded.

Cross-file analysis verified (all clean):

- `trackEvent(action, category, label)` calls in `waffle-client.tsx` match the
  committed `lib/analytics.ts` signature; `createPageMetadata({ title,
  description, path, image, keywords })` matches the committed `lib/metadata.ts`
  export.
- Route precedence: the static `app/projects/waffle/` segment shadows
  `app/projects/[slug]/` for `/projects/waffle`. HEAD's `[slug]/page.tsx` has no
  `generateStaticParams`, so there is no build-time path collision.
- Every consumer of `PROJECTS` (home page random selection, sitemap,
  `related-content.tsx`, `global-case-study-grid.tsx`,
  `global-recommendations.tsx`, projects grid) tolerates the minimal Waffle
  entry: `video: ""` falls through all video branches in both `ProjectThumbnail`
  implementations, and optional fields (`metrics`, `teamSize`, `githubLink`,
  `processStory`) are guarded at every use site.
- `"AI/ML"` and `"Web Dev"` both exist in `PROJECT_CATEGORIES`, so the Waffle
  card is reachable from category tabs; the grid card's "View Details" link
  resolves to the new static route.
- Assets exist and match declared dimensions: `opengraph.png` is exactly
  1200x630 (matches the OG metadata claim), `screenshot.png` is 1440x900
  (matches the declared `width`/`height`). `dangerouslyAllowSVG: true` +
  restrictive image CSP are set in `next.config.js`, so `logo.svg` via
  `next/image` works.
- Badge class overrides (`bg-amber-600 text-zinc-950` over the default
  `bg-primary text-primary-foreground`) are deterministic because `cn()` uses
  `tailwind-merge`.
- All new-tab links carry `rel="noopener noreferrer"`. No secrets, no dangerous
  functions, no injection surface.
- Gates: both test suites pass (36/36), `npx tsc --noEmit` reports zero errors
  in the in-scope files, ESLint clean on all five source files.

Remaining findings are two robustness warnings and a set of maintainability
issues.

## Narrative Findings (AI reviewer)

### Warnings

#### WR-01: "Live Product" badge overlay creates a click dead-zone over the thumbnail link

**Severity:** WARNING
**File:** `app/projects/projects-client.tsx:238-244`
**Issue:** The badge wrapper (`absolute top-3 right-3 z-10`) stacks above the
thumbnail `<Link href={/projects/${project.slug}}>` but is a *sibling* of it,
and neither the wrapper nor the `Badge` disables pointer events. Hovering the
badge still triggers the card's `group-hover` zoom (the `group` class is on the
`Card`), signaling clickability — but clicking the badge navigates nowhere. On
the one card this phase ships (Waffle), a ~90x28px region of the primary click
target is dead and the hover affordance is actively misleading.
**Fix:**
```tsx
{project.isLiveProduct && (
  <div className="pointer-events-none absolute top-3 right-3 z-10">
    <Badge className="bg-amber-600 text-sm font-bold text-zinc-950 dark:bg-amber-500">
      Live Product
    </Badge>
  </div>
)}
```

#### WR-02: Feature-grid test cannot fail for the feature it guards (keyword collision)

**Severity:** WARNING
**File:** `__tests__/projects/waffle/waffle-page.test.tsx:56-67`
**Issue:** The "Feature grid (6 features)" block asserts
`screen.getAllByText(keyword).length > 0` against the whole document. The
`/PDF/i` probe also matches the "How It Works" section ("Export to PDF or share
with your team" step title and its description in
`waffle-client.tsx:97-99`), so deleting the entire "PDF Export" feature card
leaves this test green — false confidence for exactly the regression it exists
to catch. The block is also named "(6 features)" but never asserts that six
feature cards render, so dropping any card whose keyword appears elsewhere goes
undetected.
**Fix:** Scope queries to the feature section and assert the count:
```tsx
const featureSection = screen.getByRole("heading", { name: "Key Features" })
  .closest("section")!;
expect(within(featureSection).getAllByRole("heading", { level: 3 }))
  .toHaveLength(6);
expect(within(featureSection).getByText("PDF Export")).toBeInTheDocument();
```

### Info

#### IN-01: Debug `console.log` fires on every render of the projects grid

**Severity:** INFO
**File:** `app/projects/projects-client.tsx:168-171`
**Issue:** `console.log("ProjectsClient: Rendering with PROJECT_CATEGORIES:", ...)`
executes on every render, including each category-tab state change, and pollutes
the output of every test that renders `ProjectsClient` (visible in this phase's
`waffle-grid-card.test.tsx` run). Pre-existing (predates phase 04; commit
`5e3f16` removed a sibling log but left this one) and stripped in production by
`compiler.removeConsole`, so it is dev/test noise only — but phase 04 touched
this file and added a test that renders it, so the noise is now exercised on
every CI run.
**Fix:** Delete the statement.

#### IN-02: Waffle data entry is internally inconsistent (`status` vs `timeline`, en dash vs hyphen)

**Severity:** INFO
**File:** `lib/data/projects.ts:1233-1234`
**Issue:** `timeline: "2025 – Present"` with `status: "completed"` renders a
"completed" status badge next to "2025 – Present" on the grid card — a live,
actively developed product described as both finished and ongoing. Separately,
the timeline uses an en dash (`–`) while every other entry uses `" - "`
(hyphen); `app/projects/[slug]/page.tsx:91` derives `dateCreated` via
`timeline.split(" - ")[0]`, which would silently yield the whole string
`"2025 – Present"`. Currently unreachable for Waffle (the static route shadows
`[slug]`), but it is a latent trap if the static page is ever removed and the
entry falls back to the generic detail route.
**Fix:** Use `timeline: "2025 - Present"` for consistency, and pick the status
that matches intent (other shipped-and-live entries use `"completed"`; if so,
accept the pairing deliberately and document it).

#### IN-03: Magic number + duplicated class strings drive the How It Works layout

**Severity:** INFO
**File:** `app/projects/waffle/waffle-client.tsx:227-231`
**Issue:** The full-width third card is selected by `step.number === 3`, and the
ternary duplicates the entire card class string except `md:col-span-2`. Adding a
fourth step or reordering steps silently breaks the "cap at 2 columns per line"
layout decision (commit `d3acf0a`), and the duplicated strings can drift.
**Fix:**
```tsx
className={cn(
  "rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50",
  index === STEPS.length - 1 && STEPS.length % 2 === 1 && "md:col-span-2",
)}
```

#### IN-04: CTA block duplicated verbatim between hero and closing band

**Severity:** INFO
**File:** `app/projects/waffle/waffle-client.tsx:149-178` and `272-301`
**Issue:** The two CTA `Button`/anchor pairs (URLs, class strings, analytics
wiring) are copy-pasted. Any future change to the URL, label, or tracking has
two edit sites; the page-level tests would catch a URL divergence but not a
class or label drift on only one instance.
**Fix:** Extract a `WaffleCtas` component (or map over a `CTAS` constant, as
already done for `FEATURES`/`STEPS`) and render it in both sections.

#### IN-05: "Live Product" badge markup duplicated across two files

**Severity:** INFO
**File:** `app/projects/waffle/waffle-client.tsx:117-119` and `app/projects/projects-client.tsx:240-242`
**Issue:** The identical badge (`bg-amber-600 text-sm font-bold text-zinc-950
dark:bg-amber-500` + "Live Product" text) is hardcoded in both the hero and the
grid overlay. The D-05 contrast rule (amber fill + zinc-950 text, never white)
is only test-enforced on the hero instance
(`waffle-page.test.tsx:152-163`); the grid instance can drift unchecked.
**Fix:** Export a shared `LiveProductBadge` component (or a shared className
constant) consumed by both call sites.

#### IN-06: Page wrapper's `max-w-6xl` is inert and `px-4` double-pads inside the root layout

**Severity:** INFO
**File:** `app/projects/waffle/page.tsx:20`
**Issue:** The root layout (committed `app/layout.tsx:152`) constrains children
to `max-w-screen-md` (768px) with its own responsive horizontal padding, so
`container mx-auto max-w-6xl px-4` renders at 768px with doubled gutters — the
class promises a 1152px layout that can never happen. This copies the existing
`rambis-ui/page.tsx` wrapper, so it is convention-consistent, but the phase
propagates a misleading pattern.
**Fix:** Either drop to `<div className="py-16">` (letting the layout own width
and gutters) or, if a genuinely wider product page is intended, that requires a
layout-level change — flagging so the intent is decided consciously.

#### IN-07: Static Waffle page skips the structured data that `[slug]` case-study pages emit

**Severity:** INFO
**File:** `app/projects/waffle/page.tsx`
**Issue:** Pages served by `app/projects/[slug]/page.tsx` emit
`CreativeWorkStructuredData` and `ProjectFAQStructuredData`; because the static
route shadows the dynamic one, `/projects/waffle` ships only base metadata — an
SEO parity gap for the one project the phase is explicitly promoting, on a site
whose stated architecture leans heavily on JSON-LD structured data.
**Fix:** Render `<CreativeWorkStructuredData …>` (fed from the Waffle `PROJECTS`
entry) in `WaffleProductPage`, or note the omission as intentional in the phase
docs.

---

_Reviewed: 2026-08-15T13:09:07Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: deep_
