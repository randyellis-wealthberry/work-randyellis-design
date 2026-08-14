# Technology Stack

**Analysis Date:** 2026-08-14

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code (`app/`, `components/`, `lib/`, `hooks/`, `middleware.ts`). Strict mode enabled, target `ES2017`, `moduleResolution: bundler` (`tsconfig.json`).

**Secondary:**
- JavaScript (CommonJS/ESM) - Config files (`next.config.js`, `jest.config.js`, `tailwind.config.js`, `eslint.config.mjs`, `postcss.config.mjs`) and Node scripts (`scripts/*.js`, root-level `performance-test*.js` files).
- CSS - Tailwind v4 entry plus design tokens in `app/globals.css`; legacy theme tokens in `tailwind.config.js`.
- MDX - Blog/case-study content; `.md`/`.mdx` are registered as page extensions in `next.config.js` (`pageExtensions`), so stray markdown files inside `app/` become routes.

## Runtime

**Environment:**
- Node.js 20.x (v20.19.6 on this machine). No `engines` field in `package.json` and no `.nvmrc`/`.tool-versions` — version is unpinned.
- Browser runtime for client components (React 19, WebGL via three.js, service worker).
- Next.js runtimes: default Node runtime plus Edge runtime for `app/api/cdn/optimize/route.ts` (`export const runtime = "edge"`).

**Package Manager:**
- npm 10.x (10.8.2 on this machine)
- Lockfile: `package-lock.json` present (committed)

## Frameworks

**Core:**
- Next.js 15.5.9 - App Router framework (server components, route handlers, middleware, `next/font`). Config: `next.config.js`. Note: `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` are enabled, so `npm run build` passes despite lint/type errors — build is NOT a validation gate.
- React 19.2.0 (`react`/`react-dom` ^19.0.0) - UI layer.
- Tailwind CSS 4.1.17 - Styling via `@tailwindcss/postcss` plugin (`postcss.config.mjs`). Class sorting enforced by `prettier-plugin-tailwindcss`. A v3-style `tailwind.config.js` still exists (darkMode `media`, shadcn HSL color tokens) — do not remove without verifying token usage.
- motion 12.23.24 - Animation library (successor to framer-motion); imported as `motion/react`. Mocked in tests via `__mocks__/motion/react.js`.
- three 0.180.0 + `@react-three/fiber` 9.x, `@react-three/drei` 10.x, `@react-three/postprocessing` 3.x - WebGL/3D scenes (lazy-loaded chunk, see `next.config.js` splitChunks).
- MDX: `@next/mdx` 15.5.6, `@mdx-js/loader` + `@mdx-js/react` 3.x - MDX page compilation (`next.config.js` wraps config with `withMDX`).

**Testing:**
- Jest 30.2.0 + `jest-environment-jsdom` - Unit/integration tests, configured via `next/jest` in `jest.config.js`; setup in `jest.setup.ts` (and legacy `jest.setup.js`).
- @testing-library/react 16.3 + `@testing-library/user-event` + `@testing-library/jest-dom` - Component testing.
- jest-axe 10 - Accessibility assertions.
- msw 2.12.0 - HTTP mocking (`__tests__/mocks/handlers.ts`, `__tests__/mocks/server.ts`).
- puppeteer 24.26.1 (devDependency) - Browser automation for root-level performance test scripts.
- Tests live in `__tests__/` (excluded from `tsconfig.json`, so `tsc` never typechecks them). `moduleNameMapper` in `jest.config.js` aliases `@vercel/analytics` and `motion/react` to root `__mocks__/` — tests depend on those mocks existing.

**Build/Dev:**
- TypeScript 5.9.3 - Type checking only via `npx tsc --noEmit` (no `typecheck` script exists; README's `npm run type-check` is stale).
- ESLint 9.39.1 (flat config `eslint.config.mjs`) - Extends `next/core-web-vitals`, `next/typescript`, `plugin:prettier/recommended`, `plugin:mdx/recommended`. Prettier is enforced through ESLint.
- Prettier 3.6.2 - Formatting (`.prettierrc`: double quotes, trailing commas, printWidth 80) with `prettier-plugin-tailwindcss`.
- PostCSS 8 + `@tailwindcss/postcss` - CSS pipeline (`postcss.config.mjs`).
- webpack (bundled with Next) - Custom `splitChunks` in `next.config.js` (react-vendor / lazy-loading / threejs / animations / ui-libs / utils / vendor cache groups with size caps). Intentional; don't simplify.
- @next/bundle-analyzer 15.5.6 - Bundle analysis via `ANALYZE=true npm run build` (`build:analyze`).
- Custom Node scripts in `scripts/`: `dev-clean.js`, `dev-auto.js` (port-3000 cleanup wrappers — plain `npm run dev` prompts interactively and hangs non-interactive shells), `analyze-performance.js`, `build-analyzer.js`, `clean-vercel-deployments.js`.

## Key Dependencies

**Critical:**
- next 15.5.9 - Framework core; pinned exact (no caret).
- react / react-dom 19.2.0 - UI runtime.
- motion 12.23.24 - Primary animation system across `components/animations`, `components/motion-primitives`.
- loops 6.0.1 - Loops.so SDK; the only real third-party API client in server code (`app/api/newsletter/subscribe/route.ts`). Requires `LOOPS_API_KEY`.
- @vercel/analytics 1.5.0 - Vercel Web Analytics + event tracking (`lib/analytics.ts`, `<Analytics />` in `app/layout.tsx`).
- zod 4.1.12 - Request validation in API routes (`app/api/newsletter/*`).
- react-hook-form 7.61 + `@hookform/resolvers` 5.x - Form handling.
- flags 4.0.2 + `@flags-sdk/statsig` 0.2.5 - Installed but NOT imported anywhere in source; active feature flags are env-var based (`lib/feature-flags.ts`). Treat as unused/aspirational.
- next-pwa 5.6.0 - Installed but DISABLED (commented out in `next.config.js` due to Next 15 incompatibility). No service worker is generated at build; a stale prebuilt `public/workbox-00a24876.js` (Workbox 6.5.4) plus `app/sw-register.tsx` referencing `/sw.js` remain. Do not rely on or claim offline behavior. `app/manifest.ts` and `public/manifest.json` still ship.

**Infrastructure:**
- Radix UI primitives (12 `@radix-ui/react-*` packages + `radix-ui` meta) + `class-variance-authority`, `clsx`, `tailwind-merge` - shadcn/ui-style component foundation (`components/ui/`, config in `components.json`, baseColor zinc).
- lucide-react 0.546 - Icon library (project standard; also mandated by `components.json`). `@remixicon/react` also present.
- next-themes 0.4.6 - Dark/light theme switching (`components/ui/theme-provider.tsx`).
- embla-carousel-react 8.6, vaul 1.1.2 - Carousel and drawer primitives.
- @lottiefiles/dotlottie-react 0.17.5 - Lottie animations.
- sugar-high 0.9.3 - Code syntax highlighting for MDX/blog.
- @tailwindcss/typography 0.5.15 - Prose styling plugin (declared but `plugins: []` in `tailwind.config.js` — verify before relying on it).
- web-vitals 5.1.0 (devDependency) - Referenced indirectly; Web Vitals reporting uses `next/web-vitals` (`components/performance/web-vitals.tsx`).
- MCP tooling in dependencies (dev-tooling only, not app code): `@modelcontextprotocol/server-github`, `@modelcontextprotocol/server-puppeteer`, `github-mcp-server`.
- jsrepo (`jsrepo.json`) - Pulls components from reactbits.dev registry.

## Configuration

**Environment:**
- `.env.local` (gitignored) copied from `.env.example` (239-line template covering analytics, flags, email, DB, monitoring — most sections are aspirational, not wired in code).
- Actually read by application code (grep of `process.env.*` in `app/`, `lib/`, `components/`, `hooks/`, `middleware.ts`): `NODE_ENV`, `PORT`, `LOOPS_API_KEY`, `ADMIN_API_KEY`, `ZAPIER_WEBHOOK_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GA4_SECONDARY_ID` (via `lib/tag-config.ts`), `NEXT_PUBLIC_CUSTOM_TAGS`, `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_VERCEL_ENV`, `NEXT_PUBLIC_VERCEL_URL`, `VERCEL_ENV`, `VERCEL_REGION`, `VERCEL_GIT_COMMIT_SHA`, the `NEXT_PUBLIC_*` feature flags, plus monitoring stubs (`NEXT_PUBLIC_SENTRY_DSN`, `ERROR_WEBHOOK_URL`, `ANALYTICS_ENDPOINT`, `ANALYTICS_API_KEY`, `NEXT_PUBLIC_DATADOG_APPLICATION_ID`).
- Only hard requirement for full functionality: `LOOPS_API_KEY` (newsletter subscribe returns 500 without it). Everything else degrades gracefully.
- Feature flags: simple env-based booleans in `lib/feature-flags.ts` (`getFlags()`/`getFlag()`) with React hooks in `hooks/use-feature-flag.ts`. Flags: `experimentalAnimations`, `maintenanceMode`, `newProjectShowcase`, `newsletterEnabled`, `analyticsEnhanced`, `betaFeatures`, `performanceMode`.

**Build:**
- `next.config.js` - Next config: MDX wrapper, `optimizePackageImports`, production `removeConsole`, custom webpack splitChunks, image optimization (`images.unsplash.com`, `picsum.photos`, `**.vercel.app` allowed), cache/security `headers()`.
- `tsconfig.json` - Strict TS, path alias `@/*` → repo root, excludes `__tests__/` and several legacy dirs (`react-email-starter`, `email-list`, `claude-remotion-demo`, `portfolio-feature-flags`, `open-websearch`).
- `jest.config.js` - next/jest, jsdom, coverage from `app/`, `components/`, `lib/`.
- `eslint.config.mjs`, `.prettierrc`, `postcss.config.mjs`, `tailwind.config.js` - Lint/format/CSS.
- `vercel.json` - Deployment config (region `iad1`, security/cache headers, `maxDuration: 10` for `app/api/*/route.ts`).
- `components.json` - shadcn/ui CLI config (style default, RSC true, zinc base, lucide icons).
- `.mcp.json` + `.claude/mcp-config.json` - MCP dev tooling (shadcn-ui server, Serena via Docker, GitHub MCP). `Dockerfile.serena` / `docker-compose.serena.yml` exist for the Serena MCP server only — not part of the app runtime.

## Platform Requirements

**Development:**
- Node.js 20.x + npm. Port 3000 (`npm run clean-port` frees it).
- Use `npm run dev:auto` or `npm run dev:direct` — plain `npm run dev` is interactive and hangs non-interactive shells.
- Verification order: `npm run lint` → `npx tsc --noEmit` → `npm test`. Single test: `npx jest __tests__/path/to/file.test.tsx`. `npm run test:performance` runs `__tests__/performance/` (includes a flaky FPS-in-jsdom test: `__tests__/performance/animation-load-testing.test.tsx`).
- No database, Redis, or Docker required for local dev (Docker files are Serena MCP tooling only).
- Known baseline: ~76 test suites pass, 33 are intentionally `describe.skip` (stale/TDD-red).

**Production:**
- Vercel (framework `nextjs`, region `iad1`), production domain `https://work.randyellis.design` (`lib/env.ts`, `vercel.json`).
- Deploy via `npm run deploy:vercel` (`vercel --prod`) or Git push auto-deploy; preview deployments per PR. `scripts/clean-vercel-deployments.js` prunes orphaned previews via Vercel REST API (needs `VERCEL_BEARER_TOKEN`).
- Serverless constraints: API route `maxDuration` 10s (`vercel.json`); filesystem-based storage in `data/email-subscriptions.json` (`lib/email-storage.ts`) is ephemeral on Vercel serverless.

---

*Stack analysis: 2026-08-14*
*Update after major dependency changes*
