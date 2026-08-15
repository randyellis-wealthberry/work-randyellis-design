---
phase: 04-waffle-product-page
plan: 01
subsystem: ui
tags: [nextjs, react, tailwind-v4, motion, lucide-react, trackEvent, seo-metadata]

# Dependency graph
requires: []
provides:
  - Standalone /projects/waffle showcase page (server route + client component)
  - Waffle brand assets under public/projects/waffle/ (logo, OG image, cropped screenshot)
  - Dual tracked CTA pattern (trackEvent on both hero + closing-band occurrences)
  - Component test contract for the Waffle page happy path
affects: [04-waffle-product-page (plan 02 — /projects grid badge card)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "createPageMetadata for page metadata instead of hand-rolled Metadata object"
    - "Literal amber-600/amber-500 + text-zinc-950 Tailwind utilities as the D-08 OKLCH token equivalent (no CSS variable needed)"
    - "Duplicated (not shared-component) CTA JSX blocks per occurrence to keep source-level trackEvent call sites individually greppable/auditable"

key-files:
  created:
    - app/projects/waffle/page.tsx
    - app/projects/waffle/waffle-client.tsx
    - public/projects/waffle/logo.svg
    - public/projects/waffle/logo-512.png
    - public/projects/waffle/logo-1024.png
    - public/projects/waffle/opengraph.png
    - public/projects/waffle/screenshot.png
    - __tests__/projects/waffle/waffle-page.test.tsx
  modified: []

key-decisions:
  - "Extracted CATEGORY/VIEW_LIVE_LABEL/TRY_FREE_LABEL constants so the trackEvent(\"waffle_view_live\"/\"waffle_try_free\" ...) call sites stay under Prettier's 80-col printWidth without wrapping across lines"
  - "Inlined the CTA row markup separately in the hero and closing-band sections (no shared CTARow() component) so both trackEvent call sites and both rel=noopener noreferrer pairs are literally present twice in source, per the plan's grep-based acceptance criteria"
  - "D-08 amber accent implemented via literal bg-amber-600/dark:bg-amber-500 Tailwind utilities, not a CSS custom property (tailwind.config.js is dead code in this Tailwind v4 setup — confirmed no @config directive in app/globals.css)"

requirements-completed: [WAF-01, WAF-03, WAF-04]

# Metrics
duration: 35min
completed: 2026-08-15
---

# Phase 4 Plan 01: Waffle Product Showcase Page Summary

**Standalone `/projects/waffle` page (hero → 6-feature grid → 3-step how-it-works → screenshot → dual tracked CTA → back nav) built server+client split with `createPageMetadata`, literal amber accent, and a 26-assertion component test proving the full happy path.**

## Performance

- **Duration:** ~35 min
- **Started:** 2026-08-15T05:59:00Z
- **Completed:** 2026-08-15T06:31:00Z
- **Tasks:** 3
- **Files modified:** 8 (all new)

## Accomplishments
- Failing component test written first (RED), encoding the full contract: hero copy, 6 feature keywords, 3 step labels, both CTA hrefs/targets/rel, both `trackEvent` call signatures, amber+zinc-950 contrast classes, back-nav link
- Waffle brand assets copied byte-for-byte from the read-only `waffle.cards` source repo (logo SVG with fixed `#f97316` fill, 512/1024 PNG fallbacks, 1200×630 OG image), plus a verified 1440×900 single-viewport hero screenshot crop produced via Pillow (source captures were ~1:8 full-page scrolls, unusable as-is)
- Server route (`page.tsx`) + client component (`waffle-client.tsx`) built to GREEN: all 26 test assertions pass, `npm run lint` clean, `npx tsc --noEmit` clean, full `npm test` shows no regressions beyond the pre-existing flaky `animation-load-testing.test.tsx` suite documented in CLAUDE.md

## Task Commits

Each task was committed atomically:

1. **Task 1: Write failing component test for the Waffle showcase page** - `e9d0553` (test)
2. **Task 2: Copy Waffle brand assets and produce the 1440×900 screenshot crop** - `6bd62e8` (feat)
3. **Task 3: Build the Waffle showcase page (server route + client component) — GREEN** - `68cf912` (feat)

_TDD gate sequence verified: `test(04-01)` commit precedes the `feat(04-01)` GREEN commit for Task 3._

## Files Created/Modified
- `__tests__/projects/waffle/waffle-page.test.tsx` - 26-assertion component test (hero, headings, features, steps, both CTAs, analytics, contrast, back-nav)
- `public/projects/waffle/logo.svg` - Waffle logo mark, fixed `#f97316` fill, works unmodified in both themes
- `public/projects/waffle/logo-512.png` / `logo-1024.png` - PNG logo fallbacks
- `public/projects/waffle/opengraph.png` - 1200×630 OG image, byte copy from waffle.cards
- `public/projects/waffle/screenshot.png` - 1440×900 single-viewport hero crop (Pillow top-crop of `~prd/waffle-1.1.png`, which is 1440×11969 full-page)
- `app/projects/waffle/page.tsx` - Server route; `metadata` via `createPageMetadata` (no hand-rolled `Metadata` object)
- `app/projects/waffle/waffle-client.tsx` - Client component: hero, 6-feature grid, 3-step how-it-works, framed screenshot, closing CTA band, back-to-projects nav

## Decisions Made
- Used the D-08 conscious deviation already recorded in the plan objective: literal `amber-600`/`amber-500` Tailwind utilities instead of a scoped CSS accent token, since Tailwind v4's built-in amber values match D-08's OKLCH tokens digit-for-digit and `app/globals.css` has no `@config` directive wiring `tailwind.config.js` custom tokens.
- Extracted `CATEGORY`, `VIEW_LIVE_LABEL`, `TRY_FREE_LABEL` string constants (module scope) so both `trackEvent(...)` call sites fit under Prettier's 80-column `printWidth` without the formatter wrapping the call across multiple lines — a purely mechanical fix that preserves the exact runtime argument values the plan's Task 1 test asserts on.
- Inlined the CTA row JSX separately at the hero and closing-band locations instead of extracting a shared `CTARow()` component, so the plan's grep-based acceptance criteria (`trackEvent("waffle_view_live"` × 2, `trackEvent("waffle_try_free"` × 2, `rel="noopener noreferrer"` × 4) are satisfied by literal source occurrences, not just rendered-output behavior.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Prettier line-wrapping broke the plan's grep-based acceptance criteria**
- **Found during:** Task 3 (verification step, after initial GREEN implementation)
- **Issue:** The first implementation used a shared `CTARow()` helper function called twice, and the `trackEvent("waffle_view_live", "waffle_product_page", "View live product CTA")` call (98 chars unindented) exceeded Prettier's 80-column `printWidth` at its JSX nesting depth, so `npm run lint:fix` wrapped it across multiple lines. This broke two acceptance-criteria grep checks: `grep -c 'trackEvent("waffle_view_live"'` returned 0 instead of 2, and the shared-component approach meant even the shorter `waffle_try_free` call only appeared once in source (not twice), also failing its grep count and the `rel="noopener noreferrer"` ≥4 count.
- **Fix:** Extracted `CATEGORY`/`VIEW_LIVE_LABEL`/`TRY_FREE_LABEL` constants to shorten the call sites under 80 columns, and inlined the CTA row markup separately in the hero and closing-band sections (removing the shared `CTARow()` function) so both call sites are literal, separate occurrences in source.
- **Files modified:** app/projects/waffle/waffle-client.tsx
- **Verification:** All grep-based acceptance criteria now pass (`trackEvent("waffle_view_live"` × 2, `trackEvent("waffle_try_free"` × 2, `rel="noopener noreferrer"` × 4); `npx jest __tests__/projects/waffle/waffle-page.test.tsx` still GREEN (26/26); `npm run lint` clean; `npx tsc --noEmit` clean.
- **Committed in:** 68cf912 (Task 3 commit — fixed before commit, not a separate follow-up commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix, formatting/tooling-driven — not a behavioral change)
**Impact on plan:** No scope creep. The runtime behavior (trackEvent arguments, CTA hrefs, contrast classes) is identical to the original design; only the source-code structure changed to satisfy the plan's literal grep-based acceptance criteria under Prettier's formatting constraints.

## Issues Encountered
None beyond the deviation documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `/projects/waffle` is live and fully wired: hero → 6-feature grid → 3-step how-it-works → screenshot → closing CTA → back nav, matching ROADMAP Phase 4 success criteria #1 and #2.
- WAF-01 (standalone product page), WAF-03 (dual tracked CTA), and the page/accent portion of WAF-04 (portfolio design system + waffle-orange accent + logo) are satisfied.
- Not yet addressed (deferred to plan 02 per phase scope): WAF-02 — the badged "Live Product" card in the `/projects` grid linking to this page. `lib/data/projects.ts` and `app/projects/projects-client.tsx` were intentionally NOT touched by this plan.
- Manual visual verification (light/dark theme render, amber contrast, screenshot PII check) remains deferred to the 04-03 checkpoint per the plan's `<verification>` section — not yet performed.

---
*Phase: 04-waffle-product-page*
*Completed: 2026-08-15*
