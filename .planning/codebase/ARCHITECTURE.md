<!-- refreshed: 2026-08-14 -->
# Architecture

**Analysis Date:** 2026-08-14

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                     Edge / Request Boundary                  │
├──────────────────┬──────────────────┬───────────────────────┤
│  Vercel config   │    Middleware    │   Security headers    │
│  `vercel.json`   │  `middleware.ts` │ `lib/security-headers │
│                  │                  │        .ts`           │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                  │                     │
         ▼                  ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js 15 App Router (app/)                    │
│  Server pages `app/**/page.tsx` + MDX `app/blog/**/page.mdx` │
│  Client halves `app/**/*-client.tsx`                         │
├─────────────────────────────────────────────────────────────┤
│  API routes `app/api/**/route.ts`                            │
│  (newsletter, cdn/optimize, csp-report)                      │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  Shared layers: `components/` (UI), `lib/` (logic/data),     │
│  `context/` + `hooks/` (client state), `data/` (JSON store)  │
└────────┬─────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│  External: Loops.so email API, Vercel Analytics, Google      │
│  Analytics, Vercel CDN/image optimizer, local JSON files     │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Root layout | Fonts, metadata, providers, header/footer, structured data, analytics scripts | `app/layout.tsx` |
| Middleware | Cache-control headers per asset type (JS/CSS, images, fonts, API, pages) | `middleware.ts` |
| Page server components | Metadata (`metadata` / `generateMetadata`), structured data, data lookup, `notFound()` | `app/**/page.tsx` |
| Page client components | All interactive UI, motion animations, event tracking | `app/**/*-client.tsx` |
| Newsletter API | Subscribe/unsubscribe/stats/export/analytics via Loops.so + local JSON backup | `app/api/newsletter/*/route.ts` |
| Email storage | JSON-file subscription persistence | `lib/email-storage.ts` → `data/email-subscriptions.json` |
| CDN optimize endpoint | Edge runtime image/font/static URL optimization | `app/api/cdn/optimize/route.ts` |
| CSP report endpoint | Rate-limited CSP violation ingestion | `app/api/csp-report/route.ts` |
| SEO metadata files | robots, sitemap, manifest, OG images, icons | `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts`, `app/opengraph-image.tsx`, `app/icon.tsx`, `app/apple-icon.tsx` |
| MDX component mapping | Custom `Cover`, code block rendering for blog posts | `mdx-components.tsx` |
| Mobile menu state | Global open/close state via React Context | `context/mobile-menu-context.tsx` |
| Feature flags | Env-var-driven flag reads (client + server) | `lib/feature-flags.ts`, `hooks/use-feature-flag.ts` |

## Pattern Overview

**Overall:** Next.js App Router monolith — server-component shell with client-component islands, file-based routing, no database (JSON file + external SaaS for the only stateful feature).

**Key Characteristics:**
- Server/client page split: `page.tsx` (server, owns metadata + SEO) renders a sibling `*-client.tsx` (`"use client"`) for interactivity
- Content is code, not CMS: all projects/posts/experience live in typed TS modules under `lib/data/`
- Blog posts are MDX pages compiled via `@next/mdx` (`pageExtensions` includes `md`/`mdx`)
- Heavy client-side animation stack (motion, three.js, lottie) isolated via dynamic imports and custom webpack `splitChunks`
- Only persistence is `data/email-subscriptions.json` written by `lib/email-storage.ts`; email delivery via Loops.so
- PWA is disabled (`next-pwa` commented out in `next.config.js`) but PWA components and `app/sw-register.tsx` remain wired into `app/layout.tsx`

## Layers

**Routing & Page Layer:**
- Purpose: URL → page resolution, metadata/SEO, structured data, 404 handling
- Location: `app/` (routes), `app/layout.tsx` (root shell), `app/blog/layout.tsx` (blog post chrome)
- Contains: `page.tsx` server components, `*-client.tsx` client components, `page.mdx` blog posts, `error.tsx`, `global-error.tsx`, `not-found.tsx`, `offline/page.tsx`
- Depends on: `lib/data/`, `lib/metadata.ts`, `components/seo/`, `components/`
- Used by: Next.js router

**API Layer:**
- Purpose: Server-side endpoints for newsletter, CDN optimization, CSP reports
- Location: `app/api/**/route.ts`
- Contains: Route handlers (`POST`/`GET`), zod validation, edge runtime (`app/api/cdn/optimize/route.ts`)
- Depends on: `lib/email-storage.ts`, `loops` SDK, `lib/cdn/optimization.ts`, `lib/security/csp-utils.ts`
- Used by: Client components (`components/ui/newsletter-signup.tsx`), browsers (CSP reports)

**Component Layer:**
- Purpose: Reusable UI, animation primitives, SEO/PWA/analytics/performance/CDN widgets
- Location: `components/` — subdirs `ui/`, `core/`, `magicui/`, `motion-primitives/`, `seo/`, `pwa/`, `analytics/`, `performance/`, `cdn/`, `blog/`, `case-study/`, `animations/`, `examples/`, `test/`
- Contains: React components (mostly `"use client"`), Radix-based primitives, motion effects
- Depends on: `lib/utils.ts` (`cn`), `lib/data/`, motion/radix/three packages
- Used by: Page client components and `app/layout.tsx`

**Logic & Data Layer:**
- Purpose: Content data, metadata builders, env resolution, analytics, monitoring, security, feature flags
- Location: `lib/` — `lib/data/`, `lib/utils/`, `lib/security/`, `lib/monitoring/`, `lib/cdn/`, `lib/hooks/`, plus top-level modules
- Contains: Typed content (`lib/data/projects.ts`, `lib/data/static-data.ts`), helpers (`lib/utils.ts`, `lib/env.ts`, `lib/metadata.ts`, `lib/analytics.ts`), storage (`lib/email-storage.ts`)
- Depends on: Node built-ins (`fs` in email-storage), `loops`, `@vercel/analytics`
- Used by: Pages, API routes, components

**Client State Layer:**
- Purpose: Cross-component client state
- Location: `context/mobile-menu-context.tsx`, `hooks/` (root), `lib/hooks/`
- Contains: MobileMenuProvider context; hooks for feature flags, click-outside, morphing dialog, WebGL renderer, animation performance, lazy loading, reduced motion
- Depends on: React only
- Used by: `app/layout.tsx` (provider), client components

## Data Flow

### Primary Request Path (page render)

1. Request hits Vercel edge; `vercel.json` applies security/cache headers
2. `middleware.ts:86` matches path and stamps Cache-Control headers by asset type (`middleware.ts:42` `applyCacheHeaders`)
3. App Router resolves route; server `page.tsx` runs (e.g., `app/projects/[slug]/page.tsx:62`)
4. Server page reads content from `lib/data/projects.ts`, builds metadata via `generateMetadata` (`app/projects/[slug]/page.tsx:8`), renders structured data (`components/seo/structured-data.tsx`)
5. Server page renders the client half (e.g., `ProjectDetailClient` from `app/projects/[slug]/project-detail-client.tsx`)
6. Client component hydrates, runs motion animations, fires analytics via `lib/analytics.ts` (GA `window.gtag` + Vercel `track`)

### Newsletter Subscribe Flow

1. `components/ui/newsletter-signup.tsx` POSTs to `/api/newsletter/subscribe`
2. `app/api/newsletter/subscribe/route.ts:12` checks `LOOPS_API_KEY`, validates body with zod schema (`route.ts:6`)
3. Subscription appended to local JSON via `lib/email-storage.ts` (`data/email-subscriptions.json`) — failure tolerated
4. Contact created/updated in Loops.so via `LoopsClient` with mailing-list mapping
5. JSON response returned; stats/export/analytics endpoints read the same JSON store (`app/api/newsletter/stats/route.ts`, `app/api/newsletter/export/route.ts`, `app/api/newsletter/analytics/route.ts`)

### Blog Post Flow (MDX)

1. `app/blog/page.tsx` lists posts from `lib/utils/blog-data.ts`
2. Post routes are `app/blog/<slug>/page.mdx` (compiled by `@next/mdx`, see `next.config.js:285`)
3. `mdx-components.tsx` maps `pre` → `CodeBlock`, `code` → `InlineCode`, provides `Cover`
4. `app/blog/layout.tsx` wraps posts with progress bar, breadcrumbs, recommendations

**State Management:**
- No global store. Server components are stateless; content is static TS data
- Client state: local `useState`, `MobileMenuProvider` context (`context/mobile-menu-context.tsx`), theme via `next-themes` (`components/ui/theme-provider.tsx`)
- Feature flags read from `NEXT_PUBLIC_*` env vars at runtime (`lib/feature-flags.ts`)

## Key Abstractions

**Server page + client half:**
- Purpose: Keep metadata/SEO server-side while shipping interactivity as client components
- Examples: `app/about/page.tsx` + `app/about/about-client.tsx`; `app/projects/page.tsx` + `app/projects/projects-client.tsx`; `app/projects/[slug]/page.tsx` + `app/projects/[slug]/project-detail-client.tsx`; `app/metis/page.tsx` + `app/metis/metis-client.tsx`
- Pattern: Server page exports `metadata`/`generateMetadata`, renders structured data, then `<XClient />`. Exception: `app/page.tsx` is itself `"use client"` (home page has no server half)

**Content modules:**
- Purpose: All site content as typed TS data
- Examples: `lib/data/projects.ts` (PROJECTS), `lib/data/static-data.ts` (WORK_EXPERIENCE, BLOG_POSTS, SOCIAL_LINKS, ARCHIVE_ITEMS), `lib/data/types.ts` (`Project` type also mirrored in `app/data.ts`), `lib/data/wireframes-data.ts`
- Pattern: Barrel `lib/data/index.ts` re-exports plus lazy loaders (`loadProjects()` dynamic import)

**Structured data components:**
- Purpose: JSON-LD injection for SEO
- Examples: `components/seo/structured-data.tsx` (Person, Website, FAQ, Breadcrumb, CreativeWork…), `components/seo/project-faq.tsx`
- Pattern: Server components rendering `<script type="application/ld+json">`

**Dynamic import registry:**
- Purpose: Centralized code-splitting for heavy components (WebGL, video, animation)
- Examples: `lib/dynamic-imports.ts` (React.lazy wrappers), `components/performance/lazy-components.tsx`, `components/performance/lazy-webgl.tsx`
- Pattern: `lazy(() => import(...))` + `<Suspense>` at call sites

**Analytics facade:**
- Purpose: Dual-write event tracking
- Examples: `lib/analytics.ts` (`trackEvent`, `trackProjectHover`, `trackProjectView`, `trackContactIntent`)
- Pattern: One function fans out to `window.gtag` and `@vercel/analytics` `track()`

## Entry Points

**Application shell:**
- Location: `app/layout.tsx`
- Triggers: Every route render
- Responsibilities: Fonts (Geist/Geist Mono), `createBaseMetadata()`, CSP nonce (`lib/security/nonce.tsx`), structured data, PWAProvider → ThemeProvider → MobileMenuProvider nesting, Header/Footer, analytics scripts

**Home page:**
- Location: `app/page.tsx`
- Triggers: `/`
- Responsibilities: Hero, selected projects (random 2 via `lib/project-utils.ts`), experience, blog list, FAQ

**Middleware:**
- Location: `middleware.ts`
- Triggers: All paths except `_next/static`, `_next/image`, `favicon.ico` (matcher at `middleware.ts:108`)
- Responsibilities: Cache header stamping only (no auth/redirects)

**API endpoints:**
- Location: `app/api/newsletter/{subscribe,unsubscribe,stats,export,analytics}/route.ts`, `app/api/cdn/optimize/route.ts`, `app/api/csp-report/route.ts`
- Triggers: Client fetches, browser CSP reports
- Responsibilities: Newsletter CRUD, CDN URL optimization (edge), violation logging

**Dev/build tooling:**
- Location: `scripts/dev-clean.js` (`npm run dev`), `scripts/dev-auto.js` (`npm run dev:auto`), `scripts/analyze-performance.js`, `scripts/build-analyzer.js`, `scripts/clean-vercel-deployments.js`
- Triggers: npm scripts in `package.json`

## Architectural Constraints

- **Runtime:** Node.js server for pages/API; `app/api/cdn/optimize/route.ts` opts into `runtime = "edge"`. Newsletter routes use Node `fs`, so they must stay on the Node runtime
- **Global state:** Module-level singletons — `emailStorage` instance in `lib/email-storage.ts`, in-memory rate-limit `Map` in `app/api/csp-report/route.ts:10` (resets on cold start/redeploy)
- **Persistence:** File-based JSON in `data/` — not safe for multi-instance serverless scale; Vercel filesystem is ephemeral, so Loops.so is the source of truth
- **Build validation disabled:** `next.config.js:63-68` sets `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors` — `npm run build` passes even with lint/type errors; use `npm run lint` + `npx tsc --noEmit` as real gates
- **Header triplication:** Cache/security headers are defined in three places that can drift: `middleware.ts`, `next.config.js` `headers()` (`next.config.js:248`), and `vercel.json` `headers`
- **PWA half-wired:** `next-pwa` disabled in `next.config.js:1-58` but `components/pwa/*` and `app/sw-register.tsx` still render; no service worker is generated, so offline/update-prompt code paths are inert
- **MDX routing gotcha:** `pageExtensions` includes `.md`/`.mdx` (`next.config.js:223`) — any stray markdown file inside `app/` becomes a route
- **Test exclusion:** `tsconfig.json` excludes `__tests__`, so tests are not typechecked by `tsc --noEmit`

## Anti-Patterns

### Client page where a server page belongs

**What happens:** `app/page.tsx` is `"use client"`, so the home page cannot export server metadata and relies on `app/layout.tsx` defaults.
**Why it's wrong:** Breaks the site's own server/client split convention; SEO metadata and structured data can't be page-specific.
**Do this instead:** Follow the `app/about/page.tsx` + `app/about/about-client.tsx` pattern — server `page.tsx` with `metadata`, client half for interactivity.

### Duplicated content type definitions

**What happens:** `app/data.ts` defines a `Project` type while `lib/data/types.ts` defines the canonical one used by `lib/data/projects.ts`.
**Why it's wrong:** Two sources of truth drift apart; imports pick the wrong shape.
**Do this instead:** Import from `lib/data/types.ts` (or the `lib/data` barrel); treat `app/data.ts` as legacy.

### Ad-hoc scripts and reports at repo root

**What happens:** Root holds one-off perf scripts (`performance-test.js`, `advanced-perf-test.js`, `simple-perf-test.js`, `final-performance-summary.js`) and ~20 markdown reports (`PERFORMANCE_REPORT.md`, `ECHO_LAUNCH_SUMMARY.md`, etc.).
**Why it's wrong:** Obscures real entry points; scripts duplicate `scripts/` purpose.
**Do this instead:** Put tooling in `scripts/`, docs in `docs/`; don't add new files to the repo root.

## Error Handling

**Strategy:** Next.js file-convention error boundaries + defensive try/catch in API routes.

**Patterns:**
- Route-level client error boundary: `app/error.tsx` (`"use client"`, logs via `console.error`, offers `reset()`)
- Root-level boundary: `app/global-error.tsx`
- 404s: `notFound()` from `next/navigation` in server pages (`app/projects/[slug]/page.tsx:71`) rendered by `app/not-found.tsx`
- API routes: try/catch returning `NextResponse.json({ error }, { status })`; zod `safeParse` for request validation (`app/api/newsletter/subscribe/route.ts:24`)
- Non-critical side effects swallowed: local email-storage failure logged but does not fail subscribe (`app/api/newsletter/subscribe/route.ts:49`)
- Monitoring helpers exist but are analytics-based (no Sentry): `lib/monitoring.ts`, `lib/monitoring/error-tracking.ts`

## Cross-Cutting Concerns

**Logging:** `console.*` only (stripped in prod via `compiler.removeConsole`, `next.config.js:97`); monitoring modules forward events to analytics (`lib/monitoring.ts`)

**Validation:** zod schemas at API boundary (`app/api/newsletter/subscribe/route.ts:6`); TypeScript strict mode (`tsconfig.json`)

**Authentication:** None — no user accounts; `/admin/*` pages (`app/admin/email-test/page.tsx`) are unprotected internal tools, disallowed from crawlers in `app/robots.ts`

**Security:** CSP nonce plumbing (`lib/security/nonce.tsx`, `lib/security/csp-utils.ts`), security header builder `lib/security-headers.ts`, CSP violation endpoint with in-memory rate limit (`app/api/csp-report/route.ts`), baseline headers in `vercel.json`

**Analytics:** Vercel `<Analytics />` + optional GA4 (`components/analytics/google-analytics.tsx`, gated on `NEXT_PUBLIC_GA_MEASUREMENT_ID`); event facade in `lib/analytics.ts`; GTM helpers in `lib/tag-manager.ts`/`lib/tag-config.ts`

**Performance:** custom webpack `splitChunks` groups (`next.config.js:103`), `optimizePackageImports` (`next.config.js:73`), centralized lazy imports (`lib/dynamic-imports.ts`), web-vitals components (`components/performance/web-vitals.tsx`), resource hints (`components/cdn/resource-hints.tsx`)

**Caching:** three-tier header config (`middleware.ts`, `next.config.js` `headers()`, `vercel.json`); CDN cache strategies centralized in `lib/cdn/optimization.ts`

**Feature flags:** env-var based (`lib/feature-flags.ts`, `hooks/use-feature-flag.ts`); `flags` + `@flags-sdk/statsig` packages installed for the demo component `components/feature-flag-demo.tsx`

---

*Architecture analysis: 2026-08-14*
*Update when major patterns change*
