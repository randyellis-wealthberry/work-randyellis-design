---
quick_id: 260828-onk
slug: add-pixelbox-to-my-project-page-in-my-di
date: 2026-08-28
---

# Quick Task: Add Pixelbox to the projects page

Add a Pixelbox case-study entry to `/projects`, sourced from the real product
repo rather than from the live marketing site.

## Context discovered before planning

The task looked like a one-line data append. Two findings changed it:

1. **`pixelbox.space` does not serve Pixelbox.** Its `<title>` and meta
   description are the real product ("Pixelbox reads your dormant portfolio,
   certifies its AI-readiness, and turns unused work into supplemental income
   through consent-based, fully-licensed datasets. A MetisLayer product."),
   but the rendered body is an unmodified v0.app template for a fictional
   product called "Optimus" — fake Netflix/Stripe/Linear/Notion logos,
   invented testimonials, placeholder metrics. Writing a case study from the
   live site would have described the wrong product entirely.

2. **The real source exists locally.** `/Users/MacBook/Developer/metis-pixelbox`
   (remote `wealthberrylabs/pixelbox`, branch `chore/design-sync-pixelbox`)
   holds the product brief, design PRD, technical architecture, creator
   framework, and the built design system.

`PRODUCT.md:135-149` in that repo sets the binding constraint: Pixelbox is
pre-launch — zero creators scanned, zero signups, zero buyer conversations —
and every number on any surface must be labelled sample or illustrative.

## Decisions taken with the operator

- **Framing:** in-progress product, matching the Agent Skills entry
  (`status: "in-progress"`, `featured: false`, no `metrics`).
- **Link:** `https://test.pixelbox.space`. Operator will disable Vercel
  Deployment Protection on that project — it currently 302s to
  `vercel.com/login`, so it is not publicly reachable yet. **This is an open
  item, not a completed one.**

## Tasks

1. Copy three verified screenshots from the product repo's `ds-bundle` into
   `public/projects/pixelbox/`; open each one first rather than trusting
   filenames, per the standing rule in `project-thumbnails.tsx`.
2. Add the `pixelbox` entry to `PROJECTS` in `lib/data/projects.ts`, placed
   between `waffle` and `skills`. Four decisions, each naming its rejected
   alternative and its cost, all drawn from the product docs. No `outcome`
   fields — nothing has shipped, so there are no outcomes to report.
3. Register the grid thumbnail in `lib/data/project-thumbnails.tsx`.
4. Register the detail-page gallery in `lib/data/project-media.ts`, with
   captions stating that the values shown are sample data.
5. Verify: `npm run lint`, `npx tsc --noEmit`, `npm test`, plus live render of
   `/projects` and `/projects/pixelbox`.

## Constraints

- Only what the source supports. No metrics, no outcomes, no claimed users.
- Only list technologies actually installed in `package.json`. Prisma, Neon,
  Clerk, Stripe, Arcjet, Resend, PostHog and Sentry are *planned* in the
  architecture doc and not wired — they do not belong in `technologies`.
</content>
