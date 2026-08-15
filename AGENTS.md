# AGENTS.md

Next.js 15 (App Router) + React 19 + Tailwind v4 + `motion` portfolio site. `CLAUDE.md` has a fuller tour, but its PWA section is stale (see below).

## Commands

- Dev server: use `npm run dev:auto` or `npm run dev:direct`. Plain `npm run dev` prompts interactively to kill port 3000 and will hang non-interactive shells. `npm run clean-port` frees port 3000.
- Verify in this order: `npm run lint` → `npx tsc --noEmit` → `npm test`.
- There is **no typecheck script** (README's `npm run type-check` does not exist); `npx tsc --noEmit` is the only type gate.
- Single test: `npx jest __tests__/path/to/file.test.tsx` (or `npm test -- <path>`). `npm run test:performance` runs only `__tests__/performance/`.
- `npm run build` is **not** a validation step: it runs `env -u NODE_ENV next build` with `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` enabled, so it succeeds despite lint/type errors.

## Testing gotchas

- Jest + jsdom + React Testing Library; setup in `jest.setup.ts`. `motion/react` and `@vercel/analytics` are mocked via `moduleNameMapper` to root `__mocks__/` — tests rely on those mocks existing.
- Known baseline: ~76 suites pass, 33 are intentionally `describe.skip` (stale/TDD-red), and `__tests__/performance/animation-load-testing.test.tsx` is flaky — it measures FPS inside jsdom and fails on slower runs. Don't treat those 3 failures as regressions.
- `tsconfig.json` excludes `__tests__/`, so `tsc` never typechecks test files.

## Architecture notes

- Page convention: `app/<route>/page.tsx` (server component, exports metadata) renders `app/<route>/<route>-client.tsx` (`"use client"`). Follow this for new routes.
- Path alias: `@/*` → repo root.
- PWA is **disabled**: `next-pwa` is commented out in `next.config.js` (Next 15 incompatibility). No service worker is generated; don't rely on or claim offline behavior. `app/manifest.ts` still ships.
- `pageExtensions` includes `.md`/`.mdx` (MDX via `@next/mdx`) — stray markdown files inside `app/` become routes.
- Cache/security headers are set in three places that must stay in sync: `middleware.ts`, `next.config.js` `headers()`, and `vercel.json`.
- Custom webpack `splitChunks` in `next.config.js` (react-vendor / threejs / animations / ui-libs with size caps) is intentional; don't simplify it.
- Newsletter API (`app/api/newsletter/*`) requires `LOOPS_API_KEY`; everything else runs without `.env.local` (see `.env.example`).
- Deploys to Vercel (`vercel.json`, region iad1); `npm run deploy:vercel` for production.

## Style

- Prettier is enforced through ESLint (`plugin:prettier/recommended`): double quotes, trailing commas, printWidth 80, Tailwind class sorting via `prettier-plugin-tailwindcss`.
- Icons: `lucide-react`. Avoid indigo/blue palettes unless explicitly requested (`.cursor/rules/design.mdc`).
