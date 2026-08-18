# AGENTS.md

Next.js 15 (App Router) + React 19 + Tailwind v4 + `motion` portfolio site. `CLAUDE.md` has a fuller tour, but its PWA section is stale (see below). Deeper maintained docs: `.planning/codebase/` (ARCHITECTURE, STACK, CONVENTIONS).

## Commands

- Dev server: use `npm run dev:auto` or `npm run dev:direct`. Plain `npm run dev` prompts interactively to kill port 3000 and will hang non-interactive shells. `npm run clean-port` frees port 3000.
- Verify in this order: `npm run lint` → `npx tsc --noEmit` → `npm test`. There is no CI — verification is local-only (a `precommit` script exists but nothing enforces it).
- There is **no typecheck script** (README's `npm run type-check` does not exist); `npx tsc --noEmit` is the only type gate.
- Single test: `npx jest __tests__/path/to/file.test.tsx` (or `npm test -- <path>`). `npm run test:performance` runs only `__tests__/performance/`.
- `npm run build` is **not** a validation step: it runs `env -u NODE_ENV next build` with `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` enabled, so it succeeds despite lint/type errors.

## Testing gotchas

- Jest + jsdom + React Testing Library; setup in `jest.setup.ts`. `motion/react` and `@vercel/analytics` are mocked via `moduleNameMapper` to root `__mocks__/` — tests rely on those mocks existing.
- Known baseline: 37 `describe.skip` blocks across 32 test files are intentional (stale/TDD-red), and `__tests__/performance/animation-load-testing.test.tsx` is flaky — it measures FPS inside jsdom and fails on slower runs. Don't treat those failures as regressions.
- `tsconfig.json` excludes `__tests__/`, so `tsc` never typechecks test files.

## Architecture notes

- Page convention: `app/<route>/page.tsx` (server component, exports metadata) renders `app/<route>/<route>-client.tsx` (`"use client"`). Follow this for new routes.
- Project routing is split: only 3 projects are served by the dynamic `app/projects/[slug]` template. `addvanced`, `echo`, `nagarro`, `rambis-ui`, and `waffle` have static route dirs that shadow `[slug]` (static segments win) with bespoke JSX — editing `[slug]` reaches only the dynamic 3.
- Project types/data live in `lib/data/` (`types.ts`, `projects.ts`); `app/data/` is an empty leftover — don't recreate `app/data.ts`.
- Path alias: `@/*` → repo root.
- PWA is **disabled**: `next-pwa` is commented out in `next.config.js` (Next 15 incompatibility). No service worker is generated; don't rely on or claim offline behavior. `app/manifest.ts` still ships.
- `pageExtensions` includes `.md`/`.mdx` (MDX via `@next/mdx`) — stray markdown files inside `app/` become routes. Stray routes already exist (`/test-glow`, `/test/codeblock`, `/admin/*`); don't add more accidentally.
- `next.config.js` declares `redirects()` **twice**; the second key silently wins — edit that one (or dedupe).
- Cache/security headers are set in three places that must stay in sync: `middleware.ts`, `next.config.js` `headers()`, and `vercel.json`.
- Custom webpack `splitChunks` in `next.config.js` (react-vendor / threejs / animations / ui-libs with size caps) is intentional and **production-only** — dev chunking is deliberately left to Next defaults because a hand-rolled vendor cache group corrupts the dev module graph (see comment in the file).
- Newsletter API (`app/api/newsletter/*`) requires `LOOPS_API_KEY`; everything else runs without `.env.local` (see `.env.example`).
- Deploys to Vercel (`vercel.json`, region iad1); `npm run deploy:vercel` for production.

## Style

- Prettier is enforced through ESLint (`plugin:prettier/recommended`): double quotes, trailing commas, printWidth 80, Tailwind class sorting via `prettier-plugin-tailwindcss`.
- Icons: `lucide-react`. Avoid indigo/blue palettes unless explicitly requested (`.cursor/rules/design.mdc`).
