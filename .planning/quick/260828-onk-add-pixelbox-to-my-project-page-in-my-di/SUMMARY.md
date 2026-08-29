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

## Open item — carried, not closed

**`https://test.pixelbox.space` is not publicly reachable.** It returns
`302 → vercel.com/sso-api` (Vercel Deployment Protection). The entry links to
it on the operator's stated intent to disable that protection. Until they do,
the card's link sends visitors to a Vercel login page.

The alternative is worse and was rejected: `pixelbox.space` serves a v0
"Optimus" template carrying fabricated Netflix/Stripe/Linear logos and an
invented CTO testimonial — the last thing to point a hiring manager at from a
portfolio built on verifiable claims.

## What this entry deliberately does not claim

Pre-launch means no users, no scans, no signups, no buyer conversations, no
revenue. So: no `metrics`, no `outcome` on any decision, and no `isLiveProduct`.
`technologies` lists only what `package.json` actually installs — Prisma, Neon,
Clerk, Stripe, Arcjet, Resend, PostHog and Sentry are planned and unwired, and
were left out.
</content>
