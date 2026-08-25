# Phase 5: Foundation & Cleanup - Pattern Map

**Mapped:** 2026-08-15
**Files analyzed:** 12 (6 edits/additions, 6 deletion-safety groups)
**Analogs found:** 10 / 12 (2 are pure deletions with no analog needed)

**Note:** This phase is dominated by deletions and mechanical import repoints, not
new-feature scaffolding. Plan A (deck-coverage audit) has no code files and is
not covered here — RESEARCH.md/CONTEXT.md D-04..D-08 are its only inputs.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `app/page.tsx:544` (hero chip row, DEBT-01) | component (JSX fragment, not new file) | request-response (static render) | `app/projects/[slug]/project-detail-client.tsx:226-232` (tag `Badge` row) | exact |
| `next.config.js` (add `redirects()`, D-01) | config | request-response | `next.config.js` `headers()` at line 239 (same file, same export shape) | exact |
| `app/about/about-client.tsx:22` (`getEmail` repoint, D-10) | component import edit | request-response | `app/page.tsx:27-32` (`getEmail` already imported from `@/lib/data`) | exact |
| `app/projects/[slug]/project-detail-client.tsx:42` (`Project` type repoint, D-10) | component import edit | request-response | `components/ui/enhanced-metrics-grid.tsx:4` (`import { Project } from "@/lib/data/types"`) | exact |
| `__tests__/about-professional-experience.test.tsx:46` (jest mock path, D-10) | test | request-response | same file, existing `jest.mock` block (self-analog, mechanical string swap) | exact |
| `app/projects/projects-client.tsx:238-244` (badge wrapper, DEBT-02) | component (JSX edit) | event-driven (click passthrough) | `app/projects/waffle/waffle-client.tsx:117-119` (same `Badge` treatment, contrasting non-overlay layout) | exact (contrast case) |
| `app/ledgeriq/` deletion | route | N/A (deletion) | — | no analog needed |
| `app/archive/` + `app/footer.tsx:17` deletion | route + link removal | N/A (deletion) | — | no analog needed |
| `app/data.ts` deletion | model/data | CRUD (static data module) | `lib/data/index.ts` + `lib/data/types.ts` (surviving superset) | exact |
| `components/case-study/` deletion | component | N/A (deletion, zero importers) | — | no analog needed |
| `app/projects/echo/echo-client-final.tsx` deletion | component | N/A (deletion, zero importers) | — | no analog needed |
| `ARCHIVE_ITEMS`/`ARCHIVE_CATEGORIES`/`ArchiveItem` removal from `lib/data/static-data.ts` + `lib/data/types.ts` (D-09, Claude's discretion) | model | CRUD (static data module) | same files, other exported const arrays (`WORK_EXPERIENCE`, `BLOG_POSTS`) as the pattern for what remains | role-match |

## Pattern Assignments

### `app/page.tsx` — hero proof chips (DEBT-01, D-14)

**Analog:** `app/projects/[slug]/project-detail-client.tsx:226-232` (tag row) and
`:512-525` (technologies grid), plus `app/about/about-client.tsx:630-643` (skills row).
These are the platform's only existing "chip row" treatments — all three use the
same primitive: `Badge` inside a `flex flex-wrap gap-*` container. No other
pill/chip pattern exists in the codebase; this is the correct (and only) analog
per the D-16 allowlist (`components/ui/badge.tsx` is explicitly allowlisted).

**Current state at the insertion point** (`app/page.tsx:534-568`, imports at
`app/page.tsx:1-45`):
```tsx
<ScrambleSectionTitle className="mb-3 text-lg font-medium text-zinc-500 dark:text-zinc-400">
  Head of Product & Fractional CDO
</ScrambleSectionTitle>
<p className="mb-5 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
  Design leader who ships AI products.
</p>
<TextGradientScroll
  text="I turn startups into design-led organizations — and write the code to prove it. 20 years in design and 8+ years leading design teams, now focused on AI: I've led products for 2.5M+ users, mentored 800+ designers, and build in React, Next.js, and TypeScript."
  type="letter"
  textOpacity="soft"
  className="max-w-2xl text-base leading-snug tracking-tight text-zinc-600 dark:text-zinc-400"
/>
<div className="mt-6 flex flex-wrap gap-3">
  <a href={BOOKING_URL} ...>Book a 30-min call</a>
  <Link href="/projects" ...>View work</Link>
</div>
```
D-14 requires: shortening the `TextGradientScroll` line, inserting a 3-chip row
between it and the existing CTA `<div>`, and leaving `AnimatedNumberBasic`
(line 574) untouched.

**Chip row pattern to copy** (from `project-detail-client.tsx:226-232`):
```tsx
<div className="flex flex-wrap gap-1.5">
  {project.tags.map((tag) => (
    <Badge key={tag} variant="outline" className="text-xs">
      {tag}
    </Badge>
  ))}
</div>
```
`about-client.tsx:636-642` is the same shape with `gap-2` and `variant="secondary"`
`text-sm` — either `variant`/size combination is in-system; pick one and apply it
uniformly to all 3 chips (do not mix variants across the 3 chips — no existing
row in the codebase mixes `outline` and `secondary` in the same row).

**Import needed:** `Badge` is not currently imported in `app/page.tsx`. Add:
```tsx
import { Badge } from "@/components/ui/badge";
```
(matches the import path used in `project-detail-client.tsx` and `about-client.tsx`.)

**Amber accent — for reference only, do NOT apply to the 3 proof chips.** The
established amber accent (`bg-amber-600 text-sm font-bold text-zinc-950
dark:bg-amber-500`) is reserved for the "Live Product" status badge only — used at:
- `app/projects/projects-client.tsx:240` — `<Badge className="bg-amber-600 text-sm font-bold text-zinc-950 dark:bg-amber-500">Live Product</Badge>`
- `app/projects/waffle/waffle-client.tsx:117` — identical class string
Reusing it on the proof chips would blur that semantic (status indicator vs.
informational fact) and is not required by D-14's spec — plain `outline`/`secondary`
badges are correct here, consistent with every other non-status Badge row in the app.

**Banned per D-16:** no `lucide-react` icons inside the chips (that's the
icon+heading+body card pattern explicitly banned), no new color tokens, no
`Card`-wrapping of each chip (Card is for the richer allowlisted treatments
like `EnhancedMetricsGrid`/`AnimatedMetricCard`, not a 3-word chip).

---

### `next.config.js` — add `redirects()` (D-01)

**Analog:** the file's own `headers()` function (same file — this is a
same-file structural analog, the strongest possible match).

**Exact surrounding structure** (`next.config.js:61, 239-274, 276-285`):
```js
const nextConfig = {
  // ... other config keys (eslint, typescript, images, etc.) ...

  // OUTPUT OPTIMIZATION
  trailingSlash: false,

  // HEADERS FOR CACHING - Enhanced
  async headers() {
    return [
      {
        source: "/_next/static/(.*)",
        headers: [ /* ... */ ],
      },
      // ...
    ];
  },
};   // <-- end of nextConfig object, line 274

const withMDX = require("@next/mdx")({ /* ... */ });

// Temporarily disable PWA to test build
module.exports = withMDX(nextConfig);
// module.exports = withPWA(withMDX(nextConfig));
```
There is **no `redirects()` block anywhere in the file today** (confirmed via
grep for `redirects` — zero matches). Add a sibling `async redirects()` method
inside `nextConfig`, next to `async headers()` (both are Next.js config
functions with identical `async () => [...]` shape), e.g. immediately after the
`headers()` closing `},` and before the final `};` at line 274:
```js
async redirects() {
  return [
    {
      source: "/ledgeriq",
      destination: "/projects/ledgeriq",
      permanent: true, // 301
    },
  ];
},
```

**Multi-site header-sync concern (from CLAUDE.md) does NOT apply to redirects.**
CLAUDE.md's warning is specifically about *headers* being duplicated across
`middleware.ts`, `next.config.js`'s `headers()`, and `vercel.json`. Verified:
`vercel.json` and `middleware.ts` were checked and neither defines any
`redirects`/route-rewrite block — redirects are next.config.js-only in this
repo, so no other file needs to be touched for D-01.

---

### `lib/data` import surface (D-10)

**Analog:** `lib/data/index.ts` (barrel) and `lib/data/types.ts` (source of
`Project` and `getEmail`), already consumed correctly elsewhere in the codebase.

**Confirmed export shape** (`lib/data/types.ts:2-57, 108-119`):
```ts
export type Project = { id: string; name: string; ... };
// ...
export const getEmail = () => { /* base64 decode, SSR/CSR safe */ };
```
**Confirmed barrel re-export** (`lib/data/index.ts:1-19`):
```ts
export * from "./types";
export * from "./static-data";
// ...
export {
  WORK_EXPERIENCE,
  BLOG_POSTS,
  SOCIAL_LINKS,
  ARCHIVE_ITEMS,
} from "./static-data";
export { getEmail, EMAIL_ENCODED, PROJECT_CATEGORIES } from "./types";
```
Both `Project` and `getEmail` are available from **either** `@/lib/data` (barrel)
or `@/lib/data/types` (direct). CONTEXT.md's D-10 already pins the exact target
module per file — follow it exactly rather than picking the other valid path,
for consistency with each file's existing style:

1. **`app/projects/[slug]/project-detail-client.tsx:42`**
   Current: `import type { Project } from "../../data";`
   Target (per D-10, and matching the direct-import style already used in
   `components/ui/enhanced-metrics-grid.tsx:4` and `components/ui/archive-thumbnail.tsx:4`):
   ```ts
   import type { Project } from "@/lib/data/types";
   ```

2. **`app/about/about-client.tsx:22`**
   Current: `import { getEmail } from "../data";`
   Target — match the barrel-import style already used in `app/page.tsx:27-32`
   (`import { WORK_EXPERIENCE, BLOG_POSTS, getEmail, SOCIAL_LINKS } from "@/lib/data";`):
   ```ts
   import { getEmail } from "@/lib/data";
   ```

3. **`__tests__/about-professional-experience.test.tsx:46`**
   Current:
   ```ts
   jest.mock("@/app/data", () => ({
     getEmail: () => "test@example.com",
   }));
   ```
   Target — mock the new module path the component will actually import from:
   ```ts
   jest.mock("@/lib/data", () => ({
     getEmail: () => "test@example.com",
   }));
   ```
   Note: `about-client.tsx` also imports `testimonials` from `@/lib/data/testimonials`
   (unrelated module, already correct) — do not touch that import.

**Confirmed superset claim (D-10):** `lib/data/projects.ts` has 8 project slugs
including `ledgeriq` (line 382-410) vs `app/data.ts`'s 4; `WORK_EXPERIENCE` exists
in both files. No data-loss risk in the repoint.

---

### `ARCHIVE_ITEMS`/`ARCHIVE_CATEGORIES`/`ArchiveItem` removal (D-09)

**All definitions and references found** (repo-wide grep, `app/`, `components/`,
`lib/`, `__tests__/`):

| File | Reference | Action |
|---|---|---|
| `app/data.ts` | `ArchiveItem` type (line 77), `ARCHIVE_ITEMS` (line 713), `ARCHIVE_CATEGORIES` (line 768) | deleted whole-file per D-10 |
| `lib/data/static-data.ts:1` | `import { ..., ArchiveItem } from "./types"` | remove `ArchiveItem` from this import once type is dropped |
| `lib/data/static-data.ts:85` | `export const ARCHIVE_CATEGORIES = [...]` | delete |
| `lib/data/static-data.ts:93` | `export const ARCHIVE_ITEMS: ArchiveItem[] = [...]` | delete |
| `lib/data/types.ts:81-96` | `export type ArchiveItem = {...}` | delete |
| `lib/data/index.ts:17` | `ARCHIVE_ITEMS` in the re-export list | remove from barrel |
| `app/archive/archive-client.tsx:19,45,78` | `import { ARCHIVE_ITEMS, ARCHIVE_CATEGORIES } from "../data"` + usage | file deleted whole (D-09 route deletion) |
| `components/ui/archive-thumbnail.tsx:4,7` | `import type { ArchiveItem } from "@/lib/data/types"` | **only consumer is `archive-client.tsx`** — becomes an orphan once the route is deleted; flag for deletion alongside the route (not explicitly listed in CONTEXT.md's file list but zero-importer after D-09, same class as `components/case-study/`) |

**Analog for what a clean static-data export list looks like post-removal:**
the other exports in the same barrel (`WORK_EXPERIENCE`, `BLOG_POSTS`,
`SOCIAL_LINKS`) — same file, same pattern, just fewer entries.

---

### `app/projects/projects-client.tsx:238-244` — badge wrapper fix (DEBT-02, D-15)

**Analog A (the file being fixed):**
```tsx
<Card className="group relative flex h-full flex-col gap-0 overflow-hidden p-0 shadow-lg">
  <Link href={`/projects/${project.slug}`} className="block">
    <ProjectThumbnail project={project} />
  </Link>
  {project.isLiveProduct && (
    <div className="absolute top-3 right-3 z-10">
      <Badge className="bg-amber-600 text-sm font-bold text-zinc-950 dark:bg-amber-500">
        Live Product
      </Badge>
    </div>
  )}
  <CardHeader ...>
```
The `<Link>` wraps only the thumbnail (`ProjectThumbnail`), but the `Card` is
absolutely-positioned over the whole card area — the badge `<div>` at
`top-3 right-3 z-10` sits above the `Link`'s stacking context in that corner,
creating the dead click zone DEBT-02 describes. Fix is exactly one class:
```tsx
<div className="pointer-events-none absolute top-3 right-3 z-10">
```
Do not touch the `Badge` itself, the `Link`, or the `Card` structure — D-15
is explicit that this is a one-class fix, not a JSX restructure.

**Analog B (contrast case — do NOT touch):** `app/projects/waffle/waffle-client.tsx:113-126`:
```tsx
<motion.div variants={VARIANTS_ITEM} className="flex items-center gap-3">
  <Badge className="bg-amber-600 text-sm font-bold text-zinc-950 dark:bg-amber-500">
    Live Product
  </Badge>
  <Image src="/projects/waffle/logo.svg" alt="Waffle logo" width={48} height={48} />
</motion.div>
```
This badge is in **normal document flow** (`flex items-center gap-3`, not
`absolute`) — there is no overlapping click target here, so no `pointer-events-none`
is needed or wanted. This is the reference CONTEXT.md cites to prove the two
badges are structurally different; leave this file untouched.

---

## Shared Patterns

### Badge-as-chip (informational, non-interactive)
**Source:** `components/ui/badge.tsx` (Radix `Slot`-based, `cva` variants:
`default`, `secondary`, `destructive`, `outline`)
**Apply to:** DEBT-01 hero chips; consistent with existing tag/skill/tech rows
```tsx
<Badge variant="outline" className="text-xs">{label}</Badge>
```

### `flex flex-wrap gap-*` row container
**Source:** `project-detail-client.tsx:226`, `:515`; `about-client.tsx:572,636`
**Apply to:** any new chip/pill row (DEBT-01)
```tsx
<div className="flex flex-wrap gap-1.5"> ... </div>
```

### `@/lib/data` as the single data-import surface
**Source:** `lib/data/index.ts` (barrel), consumed correctly in `app/page.tsx:27-33`,
`components/ui/enhanced-metrics-grid.tsx:4`, `components/ui/archive-thumbnail.tsx:4`
**Apply to:** all three D-10 repoints — this is the target state `app/data.ts`
importers must converge on before the file is deleted.

### Next.js config function siblings (`headers()` / `redirects()`)
**Source:** `next.config.js:239` (`async headers()`)
**Apply to:** D-01's new `async redirects()` — same object, same `async () => [...]`
return shape, no other file needs edits (confirmed no redirect logic exists in
`middleware.ts` or `vercel.json`).

## No Analog Found

Pure deletions with zero importers — no pattern extraction needed, only a
grep-based deletion-safety check (performed above):

| File/Dir | Role | Data Flow | Reason |
|---|---|---|---|
| `app/ledgeriq/page.tsx`, `app/ledgeriq/ledgeriq-client.tsx` | route | N/A | orphan route being deleted, not modified |
| `app/archive/page.tsx`, `app/archive/archive-client.tsx` | route | N/A | orphan route being deleted, not modified |
| `components/case-study/*.tsx` (6 files) | component | N/A | zero importers confirmed via repo-wide grep; only `case-study-section.tsx`'s a11y contract (`id`+`role="region"`+`aria-labelledby`) is salvaged, into Phase 6 |
| `app/projects/echo/echo-client-final.tsx` | component | N/A | zero importers confirmed; `echo-client.tsx` (no `-final` suffix) is the live file |

## Deletion-Safety Grep Results (D-18 verification input)

Full repo-wide search for surviving references, beyond what CONTEXT.md already listed:

**`/ledgeriq` (bespoke route, NOT `/projects/ledgeriq` which survives):**
- `__tests__/integration/route-coverage.test.tsx:17` — `{ path: "/ledgeriq", name: "LedgerIQ" }` in `EXPECTED_ROUTES`
- `__tests__/integration/route-coverage.test.tsx:132` — `"/ledgeriq/page"` in `expectedManifestRoutes`
- Both must be removed as part of D-18 verification step 3 (test-suite audit
  for deleted surfaces) — they will not fail lint/tsc, only assert incorrectly
  at runtime against a route that no longer exists.
- All other `ledgeriq` hits (`app/data.ts`, `lib/data/projects.ts`,
  `components/ui/search-interface.tsx`, `__tests__/components/selected-projects-thumbnail.test.tsx`,
  `__tests__/lib/project-data.test.ts`, `__tests__/e2e/user-journey.test.tsx`)
  reference the **surviving** `/projects/ledgeriq` data-driven page — correctly
  left untouched.

**`/archive` (route, NOT the unrelated `/blog` "View archive" link or blog-archive-accordion component):**
- `app/footer.tsx:17` — `<a href="/archive">Archive</a>` — matches CONTEXT.md's D-09 exactly, must be removed
- `__tests__/integration/route-coverage.test.tsx:15` — `{ path: "/archive", name: "Archive" }`
- `__tests__/integration/route-coverage.test.tsx:~129` — `"/archive/page"` in `expectedManifestRoutes`
- **False positives correctly excluded:** `app/page.tsx:783` ("View archive" — links to `/blog`, unrelated),
  `app/blog/**`, `lib/utils/blog-data.ts`, `components/blog/blog-archive-accordion.tsx`,
  `__tests__/app/blog-page.test.tsx`, `__tests__/components/blog-archive-accordion.test.tsx`
  — these are the blog's own "archive" naming convention, structurally unrelated
  to the `/archive` route being deleted. Do not touch.

**`echo-client-final` / `components/case-study/`:** no references found outside
their own directories anywhere in `app/`, `components/`, `lib/`, `__tests__/`,
`scripts/` — clean deletes confirmed.

**`components/ui/archive-thumbnail.tsx`:** only importer is
`app/archive/archive-client.tsx:17,119` — becomes dead code once `/archive` is
deleted. Not in CONTEXT.md's explicit file list but same zero-importer class as
`components/case-study/`; recommend the planner add it to the D-09 deletion set
(Claude's discretion per CONTEXT.md, since it's a natural extension of "drop
the now-unused `ArchiveItem` type handling").

## Metadata

**Analog search scope:** `app/`, `components/ui/`, `components/case-study/`,
`lib/data/`, `next.config.js`, `middleware.ts`, `vercel.json`, `__tests__/`
**Files scanned:** ~30 (targeted reads + repo-wide greps, no full-file loads over 300 lines)
**Pattern extraction date:** 2026-08-15
