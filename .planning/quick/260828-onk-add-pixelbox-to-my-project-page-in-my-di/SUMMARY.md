---
quick_id: 260828-onk
slug: add-pixelbox-to-my-project-page-in-my-di
date: 2026-08-28
status: complete
---

# Summary: Add Pixelbox to the projects page

## What shipped

A `pixelbox` entry in `PROJECTS`, positioned between `waffle` and `skills`,
with a registered grid thumbnail and a three-image detail gallery.

| File | Change |
| --- | --- |
| `lib/data/projects.ts` | New `pixelbox` entry: 4 decisions, `roleNarrative`, `processStory.reflection`, no `metrics` |
| `lib/data/project-thumbnails.tsx` | `pixelbox` grid thumbnail (hero, 1200×843, cover) |
| `lib/data/project-media.ts` | 3-item gallery, captions labelling sample data |
| `public/projects/pixelbox/` | `hero.png`, `readiness-gate.png`, `index-dial.png` (top-cropped 1200×560) |
| `__tests__/seo/json-ld.test.tsx` | Narrowed one over-broad assertion — see below |

## The test change, stated plainly

`buildCreativeWorkSchema › schema contains no forbidden patterns` failed on the
new entry. The guard was `expect(json).not.toContain("license")`, run over the
whole serialized JSON-LD — so it read project *prose*, not just schema keys.
Pixelbox's description says "fully-licensed", which is the product's own
language and accurate.

`lib/seo/json-ld.ts` never emits a `license` property, and the assertion's
neighbours (`'"Organization"'`, `roleName`) are property-name guards, so the
intent was structural. Narrowed it to `'"license":'` — the keyed form, matching
how `'"Organization"'` was already written — with a comment explaining why.

Worth recording: the same bare-word check would already have failed on the
`skills` entry, which lists `"MIT License"` in `technologies` (serialized into
`keywords`). It survived only because the check is case-sensitive.

## Verification

- `npm run lint` — clean
- `npx tsc --noEmit` — clean
- `npx jest` (excluding `.claude/worktrees`) — **1839 passed, 0 failed**, 604 skipped
- 4 suites still fail to *load*: `__tests__/mocks/{server,handlers}.ts` and
  `__tests__/utils/{performance,webgl}-test-utils.ts` (`TransformStream is not
  defined`, msw in jsdom). Confirmed pre-existing by stashing all changes and
  re-running — identical 4 failures on a clean tree. Not caused by this task.
- Live render verified in a browser: `/projects` row in the right position with
  `AI/ML` + `In progress` and no metric line; `/projects/pixelbox` renders role,
  4 decisions, gallery, and reflection, with zero broken images and no Proof
  section (correct — there are no metrics).

Note: `npm test` unscoped reports ~85 failing suites because Jest crawls stale
git worktrees under `.claude/worktrees/`, each with its own `node_modules`.
That is a workspace-hygiene issue, unrelated to this change.

## Open item — now closed

**`https://test.pixelbox.space` is public as of 2026-08-28.** It previously
returned `302 → vercel.com/sso-api` (Vercel Deployment Protection); the operator
disabled that protection. Re-verified: `HTTP/2 200`, no redirect, and the body
is the real build — zero occurrences of `Optimus`, `NETFLIX`, or `Meridian
Labs`, the markers of the v0 template still sitting on the apex domain.

The apex `pixelbox.space` was rejected as the link target and still should be:
it serves that v0 template, carrying fabricated Netflix/Stripe/Linear logos and
an invented CTO testimonial — the last thing to point a hiring manager at from
a portfolio built on verifiable claims.

## Noted for the operator, not acted on

The live build surfaces earnings figures (`$60–160 estimated supplemental
monthly range`, `$30–85`). The product repo's own `PRODUCT.md:144-145` records
`TIER_EARNINGS` as **unsourced placeholders** that "must not be presented as
researched figures." They are hedged as estimates on the page, so this is the
product's call rather than the portfolio's — but the portfolio now links there,
and a reader who clicks through meets a dollar range before anything else. The
case study itself claims no figures.

## What this entry deliberately does not claim

Pre-launch means no users, no scans, no signups, no buyer conversations, no
revenue. So: no `metrics`, no `outcome` on any decision, and no `isLiveProduct`.
`technologies` lists only what `package.json` actually installs — Prisma, Neon,
Clerk, Stripe, Arcjet, Resend, PostHog and Sentry are planned and unwired, and
were left out.
</content>
