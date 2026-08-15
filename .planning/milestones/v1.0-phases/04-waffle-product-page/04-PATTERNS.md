# Phase 4: Waffle Product Page - Pattern Map

**Mapped:** 2026-08-14
**Files analyzed:** 6 (2 new route files, 1 optional OG route, N static assets, 2 modified data/UI files)
**Analogs found:** 6 / 6

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|-----------------|----------------|
| `app/projects/waffle/page.tsx` | route (server component) | request-response | `app/projects/echo/page.tsx` | exact |
| `app/projects/waffle/waffle-client.tsx` | component (client) | transform (static content render) | `app/projects/addvanced/addvanced-client.tsx` (dual-CTA, icon-circle, section rhythm) + `app/projects/nagarro/nagarro-client.tsx` (modern `motion/react` import, external-link CTA) | role-match (composite — no single existing bespoke page matches the "product showcase" depth; all existing bespoke pages are full case studies) |
| `app/projects/waffle/opengraph-image.tsx` (optional) | route (edge/ImageResponse) | transform | `app/projects/opengraph-image.tsx` | role-match (pattern only — UI-SPEC recommends **skipping** this file, see Shared Patterns note) |
| `public/projects/waffle/*` | static asset | file-I/O (copy) | `public/projects/echo/*` (dir convention) | exact (directory convention only, not code) |
| `lib/data/projects.ts` (MODIFIED) | model / data | CRUD (append entry + type extension) | existing `PROJECTS` array entries (`echo`, `nagarro`) + `lib/data/types.ts` `Project` type | exact |
| `app/projects/projects-client.tsx` (MODIFIED) | component (client) | transform (grid render) | itself — this file already renders every card; the badge is a targeted insertion, analog for the badge overlay itself is `components/ui/global-article-grid.tsx` | exact (self) + role-match (badge overlay) |

---

## Pattern Assignments

### `app/projects/waffle/page.tsx` (route, request-response)

**Analog:** `app/projects/echo/page.tsx` (38 lines, full file read)

This is the established `page.tsx` (server) + `*-client.tsx` (`"use client"`) split used by every bespoke project folder. Echo's `page.tsx` hand-rolls the `Metadata` object rather than calling `createPageMetadata` — **do not copy that part**. CONTEXT.md canonical refs explicitly call out `lib/metadata.ts` → `createPageMetadata` as the pattern to use instead (see Shared Patterns below), since it centralizes canonical URL / OG / Twitter card generation and matches how the rest of the site (e.g. `app/about/page.tsx`-style pages) builds metadata.

**Structure to copy** (`app/projects/echo/page.tsx:1-38`):
```typescript
import { Metadata } from "next";
import EchoClientPage from "./echo-client";

export const metadata: Metadata = { /* ... */ };

export default function EchoDriveCaseStudy() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <EchoClientPage />
    </div>
  );
}
```

**Page wrapper class** (copy verbatim, UI-SPEC confirms this is the correct container): `<div className="container mx-auto max-w-6xl px-4 py-16">`.

**Replace the metadata body with `createPageMetadata`** — see Shared Patterns → Metadata below for the exact call shape.

---

### `app/projects/waffle/waffle-client.tsx` (component, transform)

No existing bespoke page matches this phase's "Product Showcase" (medium-depth, non-case-study) format — every existing bespoke folder (`echo`, `addvanced`, `nagarro`, `rambis-ui`) is a full case study with 8-12 sections (Challenge/Approach/Methodology/Insights/Testimonials/Resources). Compose from these narrower excerpts instead of one analog:

**Imports pattern** — prefer the **modern** import used by `nagarro-client.tsx` (`motion/react`), not the legacy `framer-motion` import in `addvanced-client.tsx` (`app/projects/addvanced/addvanced-client.tsx:6` — flagged as stale, do not copy):
```typescript
// app/projects/nagarro/nagarro-client.tsx:2-8 (imports, condensed)
import { motion, useInView, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { PROJECTS } from "@/lib/data/projects";
```
Add `ExternalLink` from `lucide-react` for the primary CTA icon (per UI-SPEC Component Inventory).

**Stagger/entrance pattern** — reuse `projects-client.tsx`'s `VARIANTS_CONTAINER`/`VARIANTS_ITEM` (UI-SPEC Component Inventory explicitly calls this out):
```typescript
// app/projects/projects-client.tsx:31-50
const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const VARIANTS_ITEM = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
```

**Feature-grid icon-circle pattern** (Component Inventory: "copied from `addvanced-client.tsx`", swap color to amber):
```typescript
// app/projects/addvanced/addvanced-client.tsx:320-324 (pattern, color swapped)
<div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-600/10 dark:bg-amber-500/10">
  <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-500" />
</div>
```
Note: source uses `bg-{color}-500/10` + `text-{color}-500` (single value); UI-SPEC's Color section requires the **light/dark split** (`amber-600` light / `amber-500` dark) — apply both variants, don't copy the single-shade original literally.

**Gradient-border card shell** (screenshot frame only, per UI-SPEC Component Inventory — feature/step cards use flatter secondary-surface instead):
```typescript
// app/projects/echo/echo-client.tsx:32-33 (MetricCard pattern, reusable shell)
<div className="relative overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30">
  <div className="relative h-full w-full rounded-[15px] bg-white p-6 dark:bg-zinc-950">
    {/* content */}
  </div>
</div>
```

**Dual-CTA row pattern** (closest existing two-button row; adapt colors/labels per UI-SPEC Copywriting Contract):
```typescript
// app/projects/addvanced/addvanced-client.tsx:1302-1312
<div className="flex flex-wrap gap-3">
  <Button asChild size="lg" className="bg-amber-600 text-zinc-950 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 min-h-[44px]">
    <a href="https://waffle.cards" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("waffle_view_live", "waffle_product_page", "View live product CTA")}>
      View live product ↗
    </a>
  </Button>
  <Button variant="outline" size="lg" asChild className="min-h-[44px]">
    <a href="https://app.waffle.cards/sign-up" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("waffle_try_free", "waffle_product_page", "Try free CTA")}>
      Try free
    </a>
  </Button>
</div>
```
Note: `Button` `size="lg"` = `h-10` (40px) per `components/ui/button.tsx:27` — UI-SPEC requires 44px minimum touch target, hence the added `min-h-[44px]` override (UI-SPEC Spacing Scale → Exceptions).

**External-CTA-with-icon pattern** (motion-wrapped external link, optional richness — `ExternalLink` rotate-on-hover):
```typescript
// app/projects/nagarro/nagarro-client.tsx:992-1013 (condensed, strip the AI-generated "Open" wording)
<Button asChild size="lg" className="...">
  <motion.a
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-center gap-2"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <span className="font-semibold">View live product ↗</span>
  </motion.a>
</Button>
```

**Back-to-projects nav** (copy verbatim per UI-SPEC "reuse `echo/page.tsx`'s exact treatment"):
```typescript
// app/projects/echo/echo-client.tsx:454-462
<section className="mb-16 border-t border-zinc-200 px-4 pt-8 sm:mb-20 sm:px-6 lg:mb-24 lg:px-8 dark:border-zinc-700">
  <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
    <Link
      href="/projects"
      className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-6 py-3 text-zinc-900 transition-all duration-200 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
    >
      ← Back to Projects
    </Link>
  </div>
</section>
```
Drop the second "Explore More Projects" link in Echo's version — Waffle's section order (UI-SPEC) ends with just the back-nav, no secondary internal CTA at the bottom (the dual product CTA already repeats in the closing band above it).

**Section rhythm wrapper** — do **not** copy Echo's `space-y-32 sm:space-y-24` (UI-SPEC flags this as an unintentional inversion). Use the UI-SPEC-mandated ascending rhythm instead:
```typescript
<main className="relative space-y-16 sm:space-y-24">
```

**No analog for:** "How it works" numbered-step-circle layout (amber step circles 1/2/3) — nothing in the codebase currently uses a numbered-step pattern. Build fresh using the icon-circle pattern above (swap Lucide icon for a numeral) + UI-SPEC Layout Details section.

---

### `app/projects/waffle/opengraph-image.tsx` (optional route, transform)

**Analog:** `app/projects/opengraph-image.tsx` (244 lines, full file read) — `ImageResponse`-based dynamic OG generator using inline styles (edge runtime).

**UI-SPEC explicitly recommends skipping this file** (see Asset Inventory: "copy this pre-built 1200×630 PNG directly as the static `openGraph.images` entry in `page.tsx` metadata... rather than building a new `ImageResponse` generator"). Only build this route if the planner decides the static PNG approach is insufficient. If built, the pattern is:
```typescript
// app/projects/opengraph-image.tsx:1-9 (header pattern only)
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Waffle — AI-powered interview scorecard generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
```

---

### `public/projects/waffle/*` (static assets, file-I/O)

**Analog:** directory convention only — `public/projects/echo/` contains `logo.svg`, `poster.png`, `img1.jpg`-`img5.jpg`, matching the sibling pattern for `public/projects/{addvanced,growit,ledgeriq,nagarro,ohplays,rambis-ui}/`.

**Destination confirmed by UI-SPEC Asset Inventory** (overrides CONTEXT.md's tentative `public/waffle/`): `public/projects/waffle/`.

**Source → destination copy map** (from CONTEXT.md canonical refs + UI-SPEC Asset Inventory, external repo `/Users/MacBook/Developer/waffle.cards`):
| Source (external) | Suggested destination |
|---|---|
| `logos/brand/icon-on-transparent.svg` | `public/projects/waffle/logo.svg` |
| `logos/brand/png/waffle-on-transparent-icon-512.png` (+`-1024`) | `public/projects/waffle/logo-512.png` (+`-1024.png`) |
| `logos/generated/opengraph-1200x630.png` | `public/projects/waffle/opengraph.png` |
| Screenshot (fresh capture preferred; fallback `~prd/waffle-1.1.png`) | `public/projects/waffle/screenshot.png` |

Note: logo SVG has a **fixed `#f97316` fill**, not `currentColor`-themeable (UI-SPEC verified this by reading the file) — no CSS theming needed, works as-is in both light/dark.

---

### `lib/data/projects.ts` (MODIFIED — model, CRUD)

**Analog:** existing `PROJECTS: Project[]` entries, especially `echo` (`lib/data/projects.ts:740-762` read) and `nagarro` (`slug: "nagarro"`, uses a bespoke folder with the same array + `[slug]`-bypass routing mechanism).

**Key structural insight (routing):** No special-case routing logic is needed for D-06 ("card links to `/projects/waffle`, not the `[slug]` template"). `projects-client.tsx` already renders `<Link href={\`/projects/${project.slug}\`}>` for both the thumbnail and the "View Details" button. Next.js resolves **static routes before dynamic catch-alls** — since `app/projects/waffle/page.tsx` will exist as a literal folder (exactly like `echo`, `addvanced`, `nagarro`, `rambis-ui` already do), setting `slug: "waffle"` on the new `Project` entry automatically routes there instead of `app/projects/[slug]/page.tsx`. No new field or Link override is required for basic routing — only the **badge** requires a new field (see below).

**Entry shape to follow** (condensed from `echo`, `lib/data/projects.ts:740-772`):
```typescript
{
  id: "waffle",
  name: "Waffle",
  subtitle: "AI-Powered Interview Scorecard Generator",
  slug: "waffle",
  description: "AI-powered interview scorecard generator — paste a job description, get weighted competencies, behavioral questions, and scoring rubrics in 2–4 minutes.",
  longDescription: "...", // from messaging_positioning.md
  category: "AI/ML",
  categories: ["AI/ML", "Web Dev"],
  tags: ["AI SaaS", "Interview Tech", "Generative UI", "Recruiting"],
  link: "https://waffle.cards",
  video: "", // no video asset per this phase's scope
  thumbnail: "/projects/waffle/screenshot.png",
  images: ["/projects/waffle/screenshot.png"],
  timeline: "2025 – Present",
  status: "in-progress", // or "completed" — Claude's Discretion; product is live
  technologies: ["Next.js 16", "AI SDK 6", "Claude", "Stripe", "Neon", "Prisma", "Clerk"],
  featured: true,
}
```
(`longDescription`, `challenges`, `solutions`, `learnings`, `overview`, `processStory` are all optional per `Project` type — omit them; this is intentionally NOT a full case study per D-06/Deferred.)

**Type extension required** (`Project` type, `lib/data/types.ts:2-56`, full file read) — no `badge`/`isLiveProduct`-style field currently exists. Add one optional field, e.g.:
```typescript
// lib/data/types.ts:2-56 — add alongside `featured: boolean;` (line 20)
isLiveProduct?: boolean; // drives the "Live Product" grid badge (D-05)
```
This is the Claude's-Discretion decision flagged in CONTEXT.md — recommend the boolean-flag approach (not a standalone card entry) since it reuses all existing grid-render logic in `projects-client.tsx` untouched except for one new conditional badge block.

---

### `app/projects/projects-client.tsx` (MODIFIED — component, transform)

**Analog:** the file's own existing card-render block (`app/projects/projects-client.tsx:228-386`, full file read) + `components/ui/global-article-grid.tsx:161-171` for the overlay-badge positioning precedent.

**Card structure already present** — the `<Card>` wrapper is already `relative` (`app/projects/projects-client.tsx:234`: `className="group relative flex h-full flex-col gap-0 overflow-hidden p-0 shadow-lg"`), so the badge overlay can be inserted as a sibling of the `<Link>`/`ProjectThumbnail` without restructuring:
```typescript
// app/projects/projects-client.tsx:234-237 (existing, for insertion context)
<Card className="group relative flex h-full flex-col gap-0 overflow-hidden p-0 shadow-lg">
  <Link href={`/projects/${project.slug}`} className="block">
    <ProjectThumbnail project={project} />
  </Link>
  {/* insert Live Product badge here, as Card-level sibling */}
```

**Badge overlay positioning pattern** (UI-SPEC: "matches the existing Featured Star Indicator precedent"):
```typescript
// components/ui/global-article-grid.tsx:161-171 (positioning pattern; swap Star for Badge text)
{article.featured && (
  <div className="absolute top-3 right-3 z-10" data-testid="featured-star">
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
    </div>
  </div>
)}
```

**Actual Waffle badge implementation** (per UI-SPEC "Grid Card / Live Product Badge Contract", combining the positioning precedent above with the `Badge` component + contrast rule):
```typescript
{project.isLiveProduct && (
  <div className="absolute top-3 right-3 z-10">
    <Badge className="bg-amber-600 text-sm font-bold text-zinc-950 dark:bg-amber-500">
      Live Product
    </Badge>
  </div>
)}
```
Contrast note (UI-SPEC Color section): `text-zinc-950` on `bg-amber-600`/`bg-amber-500` passes AA/AAA in both themes — never swap to white text.

---

## Shared Patterns

### Metadata (createPageMetadata)
**Source:** `lib/metadata.ts:122-168` (full function read)
**Apply to:** `app/projects/waffle/page.tsx`
```typescript
// lib/metadata.ts:122-168 — call shape
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Waffle | AI Interview Scorecard Generator",
  description: "AI-powered interview scorecard generator — paste a job description, get weighted competencies, behavioral questions, and scoring rubrics in 2–4 minutes.",
  path: "/projects/waffle",
  image: "/projects/waffle/opengraph.png",
  keywords: ["AI interview scorecard", "Waffle", "hiring AI tool", "Randy Ellis AI SaaS"],
});
```
This produces `alternates.canonical`, full `openGraph`/`twitter` blocks with absolute URLs via `createAbsoluteUrl` — do not hand-roll a `Metadata` object like `echo/page.tsx` does.

### Analytics (trackEvent)
**Source:** `lib/analytics.ts:5-32` (function definition, full section read)
**Apply to:** both CTA instances in `waffle-client.tsx` (hero row + closing band)
```typescript
// lib/analytics.ts:5-11 — signature
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  properties?: Record<string, string | number | boolean>,
) => { /* fires to gtag + Vercel Analytics `track()` */ };
```
**Exact calls required by UI-SPEC Interaction & Analytics Contract:**
```typescript
trackEvent("waffle_view_live", "waffle_product_page", "View live product CTA");
trackEvent("waffle_try_free", "waffle_product_page", "Try free CTA");
```
Note: no existing call site in the codebase invokes `trackEvent` directly with 3 args from a component — most existing usage is through the wrapper helpers (`trackNewsletterSignup`, `trackProjectView`, `trackExternalLink` — `lib/analytics.ts:44-57`). Waffle is the first bespoke page to call `trackEvent` directly inline in CTA `onClick`; this is fine per its exported signature, just note there's no existing component-level analog to copy verbatim — construct from the signature directly.

### Shared UI primitives (no modification needed)
**Source:** `components/ui/badge.tsx`, `components/ui/button.tsx`, `components/ui/card.tsx` (all read in full — 46/59/92 lines respectively)
**Apply to:** all new Waffle components
- `Badge` (`components/ui/badge.tsx:7-26`) base variant is `bg-primary text-primary-foreground` which resolves to the **broken token pattern** flagged in UI-SPEC Constraint — always override via `className` with literal `bg-amber-600 dark:bg-amber-500 text-zinc-950`, never rely on `variant="default"` alone for the Live Product badge.
- `Button` (`components/ui/button.tsx:12-13`) same caveat — `variant="default"` uses `bg-primary`; override with literal amber classes for the primary CTA; use `variant="outline"` as-is for the secondary CTA (it resolves to `border bg-background` which — per UI-SPEC — also needs a literal-class check, but the *existing* outline usage across the codebase, e.g. `addvanced-client.tsx:1309` and `projects-client.tsx:360`, already renders correctly in production, so `variant="outline"` is safe to reuse unmodified for the secondary "Try free" CTA).
- `Card`/`CardContent` (`components/ui/card.tsx:5-16`) base references `bg-card text-card-foreground` (broken token) — UI-SPEC says "always pass explicit `className` background/border when reusing." For Waffle's feature/step cards, skip `Card` entirely and use the flatter secondary-surface `div` pattern instead (`bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6`, per UI-SPEC Color/Layout Details) rather than fighting the broken `Card` defaults.

### Sitemap (no file change needed)
**Source:** `app/sitemap.ts:37-43` (read in full)
```typescript
// app/sitemap.ts:37-43 — already generic over PROJECTS
const projectPages = PROJECTS.map((project) => ({
  url: `${WEBSITE_URL}/projects/${project.slug}`,
  lastModified: currentDate,
  changeFrequency: "monthly" as const,
  priority: project.featured ? 0.8 : 0.6,
}));
```
Once the `waffle` entry is added to `PROJECTS` with `slug: "waffle"` and `featured: true`, it is automatically included in the sitemap at priority 0.8 — **no sitemap.ts edit required**. Flag this as a non-file for the planner (confirms CONTEXT.md's "confirm crawlable/listed" integration point is satisfied for free).

---

## No Analog Found

| File/Concern | Role | Data Flow | Reason |
|------|------|-----------|--------|
| "How it works" numbered step-circle layout | UI fragment | transform | No existing bespoke page uses a numbered-step (1/2/3) pattern; nearest building block is the icon-circle from `addvanced-client.tsx` (numeral instead of Lucide icon) — build fresh per UI-SPEC Layout Details |
| Scoped `--brand`/amber CSS custom property | config | n/a | UI-SPEC's Color section resolved this to **plain Tailwind utility classes** (`amber-600`/`amber-500` match D-08's OKLCH values digit-for-digit per `node_modules/tailwindcss/theme.css`) — explicitly **no new CSS variable or `app/globals.css` edit needed** despite CONTEXT.md D-08 suggesting a "scoped accent token" |

---

## Metadata

**Analog search scope:** `app/projects/` (all bespoke folders: `echo/`, `addvanced/`, `nagarro/`, `rambis-ui/`, `[slug]/`), `lib/data/`, `lib/metadata.ts`, `lib/analytics.ts`, `components/ui/` (`badge.tsx`, `button.tsx`, `card.tsx`), `components/ui/global-article-grid.tsx`, `app/sitemap.ts`, `app/projects/opengraph-image.tsx`
**Files scanned:** 16 (all read in full or via targeted non-overlapping offset reads; no file > 2,000 lines encountered)
**Pattern extraction date:** 2026-08-14
