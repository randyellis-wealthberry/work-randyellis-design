# Phase 4: Waffle Product Page - Context

**Gathered:** 2026-08-14
**Status:** Ready for planning

> **Note on provenance:** Added post-milestone. `ROADMAP.md` covers the completed
> Recruiter-Readiness milestone (Phases 1–3); Phase 4 was scoped ad-hoc via
> `/gsd:discuss-phase` and appended to the roadmap (reqs `WAF-01..04`). Ready for
> `/gsd:plan-phase 4`.

<domain>
## Phase Boundary

Deliver a standalone **product page at `/projects/waffle`** that showcases
**Waffle** (waffle.cards) — Randy's own live, monetized AI SaaS: an AI-powered
interview-scorecard generator. The page presents the product as a
**"design leader who ships + AI"** proof point for recruiters/hiring managers,
and links out to the live product.

**In scope:** the `/projects/waffle` page, a badged card in the `/projects` grid,
page metadata/OG, and copying the needed Waffle brand assets into this repo.

**Out of scope (deferred):** a full case-study narrative, a full 5-tier pricing
table, embedded live demo, testimonials section, and any changes to the Waffle
product itself. See Deferred Ideas.
</domain>

<decisions>
## Implementation Decisions

### Page depth & format
- **D-01:** Build a **Product Showcase** page (medium depth), not a full sales
  landing and not a lean teaser. Section order:
  `hero → feature grid → how-it-works (3 steps) → product screenshot → CTA`.
- **D-02:** Feature grid uses the 6 key features (see Specifics). No full pricing
  table on the page (pricing may appear as a one-line mention at most).

### Primary goal & CTA
- **D-03:** **Dual purpose / dual CTA.** Position as recruiter proof ("I designed
  AND built a real, paid AI product") *and* offer product interest. CTA row:
  **`View live product ↗`** (→ waffle.cards) + **`Try free`** (→ waffle.cards
  signup). `View live product` is the primary/left CTA; `Try free` secondary.
- **D-04:** Both CTA clicks fire analytics via `trackEvent` (e.g.
  `waffle_view_live`, `waffle_try_free`).

### Grid visibility
- **D-05:** Add a **card to the `/projects` grid** alongside the case studies,
  visually distinguished with a **"Live Product"** badge so it reads as a product
  Randy owns, not a client case study.
- **D-06:** The Waffle card links to the bespoke **`/projects/waffle`** landing
  page — NOT the `[slug]` case-study detail template.

### Brand treatment
- **D-07:** **Portfolio design system + waffle-orange accent.** Keep the site's
  typography, spacing, dark-mode, and layout so the page feels native; use
  Waffle's orange as the accent (buttons, badge, tags) and show the Waffle logo.
  Do NOT reskin the page in full Waffle branding.
- **D-08:** Waffle orange = `oklch(0.666 0.179 58.318)` (light) /
  `oklch(0.769 0.188 70.08)` (dark), from Waffle's design system. Introduce as a
  scoped accent token; must pass contrast in both themes. Portfolio design rule
  (avoid indigo/blue) is satisfied — orange is allowed.

### Claude's Discretion
- Exact grid-card mechanism for the badge — extend the `Project` type in
  `lib/data/projects.ts` with an optional field (e.g. `badge`/`isLiveProduct`)
  vs. a separate standalone card entry. Planner decides.
- Which specific screenshot to use and whether to lightly frame/crop it.
- Whether the bespoke page reuses the `echo/`-style folder pattern or the
  `[slug]` detail scaffold (recommend bespoke folder — it is not a case study).
- Copy wording (draft from Waffle's positioning docs; Randy approves).
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Waffle product — source of truth (external repo: `/Users/MacBook/Developer/waffle.cards`)
- `/Users/MacBook/Developer/waffle.cards/README.md` — product overview, the 6 key
  features, 5-tier pricing, tech stack. Primary copy source.
- `/Users/MacBook/Developer/waffle.cards/marketing/inputs/messaging_positioning.md` — approved positioning/messaging for hero + section copy.
- `/Users/MacBook/Developer/waffle.cards/marketing/inputs/product_brief.md` — product brief.
- `/Users/MacBook/Developer/waffle.cards/marketing/inputs/brand_guidelines.md` — brand voice + usage.
- `/Users/MacBook/Developer/waffle.cards/marketing/inputs/target_personas.md` — who Waffle serves (informs recruiter-facing framing).
- `/Users/MacBook/Developer/waffle.cards/packages/design-system/styles/globals.css` §L155–157, L252–254 — `--brand` orange OKLCH tokens (light/dark).

### Waffle assets to copy into this repo (→ `public/waffle/` or similar)
- Logo (SVG, themeable): `/Users/MacBook/Developer/waffle.cards/logos/brand/icon-on-transparent.svg`
  (+ `icon-on-white.svg`, `icon-on-dark.svg` for light/dark).
- Logo PNG fallbacks: `/Users/MacBook/Developer/waffle.cards/logos/brand/png/waffle-on-transparent-icon-512.png` (and `-1024`).
- OpenGraph: `/Users/MacBook/Developer/waffle.cards/logos/generated/opengraph-1200x630.png`.
- Screenshot candidates (design mocks): `/Users/MacBook/Developer/waffle.cards/~prd/waffle-1.1.png`, `~prd/waffle-1.png`, `~prd/homepage-1.jpg`, `~prd/screencapture-localhost-3001-2026-02-12-15_38_46.png`. ⚠ These are mocks; a fresh clean screenshot of the live product would be preferable if obtainable (site is behind Arcjet / returns 403 to bots).

### Portfolio (this repo) — patterns to follow
- `app/projects/projects-client.tsx` — the `/projects` grid renderer (where the badged card is added).
- `lib/data/projects.ts` — `PROJECTS: Project[]` data + `Project` type (grid card data source).
- `app/projects/echo/` (`page.tsx` + `echo-client.tsx`) — bespoke per-project folder pattern to mirror for `app/projects/waffle/`.
- `app/projects/[slug]/` — case-study detail scaffold (for contrast; Waffle does NOT use this).
- `lib/metadata.ts` → `createPageMetadata` — page metadata pattern.
- `app/projects/opengraph-image.tsx` — per-route OG image pattern.
- `lib/analytics.ts` → `trackEvent` — CTA click tracking.
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `createPageMetadata` (`lib/metadata.ts`): generate `/projects/waffle` metadata + keywords.
- `trackEvent` (`lib/analytics.ts`): wire the two CTAs.
- Motion primitives (`components/motion-primitives/`) + UI cards (`components/ui/`): reuse for hero/feature/how-it-works sections and the grid card.
- `next-themes` dark mode + Tailwind v4 tokens: the orange accent must be defined for both themes.

### Established Patterns
- `page.tsx` (server, exports `metadata`) + `*-client.tsx` (`"use client"`) split — mirror for `app/projects/waffle/`.
- Bespoke project folders (`echo/`, `nagarro/`, `rambis-ui/`, `addvanced/`) already break from the `[slug]` template — precedent for a custom Waffle page.
- Grid cards are data-driven from `lib/data/projects.ts`; the badge likely needs a small `Project`-type extension.

### Integration Points
- `/projects` grid card → add entry/flag driving a card that links to `/projects/waffle` with a "Live Product" badge.
- New route `app/projects/waffle/page.tsx` (+ client, + optional `opengraph-image.tsx`).
- New static assets under `public/` (copied from the waffle.cards repo).
- Header/nav + sitemap: confirm `/projects/waffle` is crawlable/listed if applicable.
</code_context>

<specifics>
## Specific Ideas

**The 6 key features (from Waffle README) for the feature grid:**
1. Chat-based scorecard generation (Claude + Vercel AI SDK 6)
2. Generative UI — scorecards stream in as interactive React components
3. PDF export (print-ready)
4. Universal transcript ingestion — Granola, Otter, Fathom, Fireflies, Gong + 25 more
5. EEOC-compliant / bias-reducing AI content
6. Team collaboration — multi-tenant orgs with role-based access

**One-liner:** "AI-powered interview scorecard generator — paste a job
description, get weighted competencies, behavioral questions, and scoring rubrics
in 2–4 minutes."

**How-it-works (3 steps):** Paste job description → AI streams the scorecard live
→ export to PDF / share with the team.

**Recruiter-proof framing (Randy's angle):** designed AND built a real, paid,
production AI SaaS (Next.js 16, AI SDK 6 + Claude, Stripe, Neon/Prisma, Clerk).

**Live URLs:** product `https://waffle.cards`; "Try free" → waffle.cards signup.
</specifics>

<deferred>
## Deferred Ideas

- **Full 5-tier pricing table** (Free/Starter/Growth/Scale/PAYG) — omitted from the
  showcase; add later if the page shifts toward acquisition.
- **Case-study narrative version** (problem → role → process → outcome) — if Randy
  later wants Waffle told as a full case study like echo/nagarro.
- **Embedded live demo / interactive scorecard preview** — richer but heavier.
- **Testimonials section** — source: `waffle.cards/marketing/inputs/testimonials.md`.
- **Deep-dive on transcript-ingestion integrations** (30+ note-takers) as its own content block.

### Reviewed Todos (not folded)
None — no pending todos matched this phase.
</deferred>

---

*Phase: 4-Waffle Product Page*
*Context gathered: 2026-08-14*
