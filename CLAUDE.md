# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a high-performance Next.js 15 portfolio website for Randy Ellis (Fractional Chief Design Officer & AI Product Designer) built with React 19, Tailwind CSS v4, and Motion. The site emphasizes SEO optimization, performance, animations, and accessibility.

**Live Site**: https://work.randyellis.design

## Development Commands

### Starting Development Server
```bash
npm run dev              # Recommended: Auto-cleans port 3000 with user confirmation
npm run dev:auto         # Alternative with automated port cleanup
npm run dev:direct       # Direct Next.js dev server (no port cleanup)
npm run dev:turbo        # Next.js dev server with Turbo mode
```

The default `npm run dev` uses `scripts/dev-clean.js` which automatically detects and prompts to kill processes on port 3000.

> **Agents / non-interactive shells**: `npm run dev` waits for interactive confirmation and will hang. Use `npm run dev:auto` (automated port cleanup) or `npm run dev:direct` (plain `next dev`) instead. `npm run clean-port` frees port 3000 without confirmation.

### Building
```bash
npm run build                # Standard production build (runs `env -u NODE_ENV next build`)
npm run build:optimized      # Production build with increased memory (4GB)
npm run build:analyze        # Build with bundle analysis enabled
npm run build:profile        # Build with profiling enabled
```

> **`npm run build` is NOT a validation step.** `next.config.js` sets `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors`, so the build succeeds even with lint/type errors. To actually validate a change, run the verify order below.

### Verifying Changes

There is **no `type-check` script** (the README's `npm run type-check` does not exist). Verify in this order:

```bash
npm run lint        # ESLint (Prettier enforced via plugin:prettier/recommended)
npx tsc --noEmit    # the ONLY type gate; tsconfig excludes __tests__/, so test files aren't typechecked
npm test            # Jest
```

### Linting & Testing
```bash
npm run lint            # Run ESLint
npm run lint:fix        # Auto-fix linting issues
npm test                # Run all Jest tests
npm run test:watch      # Run tests in watch mode
npm run test:performance # Run performance-specific tests (only __tests__/performance/)
```

> Only `npm test` works as a bare alias; the colon scripts need `npm run` (e.g. `npm run test:watch`, not `npm test:watch`). Single file: `npx jest __tests__/path/to/file.test.tsx` or `npm test -- <path>`.

### Deployment & Cleanup
```bash
npm run deploy:vercel         # Deploy to Vercel production
npm run deploy:preview        # Deploy Vercel preview
npm run clean:vercel          # Clean old Vercel deployments
npm run clean:vercel:dry-run  # Preview what would be deleted
npm run clean:build           # Remove .next and out directories
npm run clean:all             # Clean build + reinstall node_modules
```

### Analysis & Optimization
```bash
npm run analyze:performance   # Analyze performance metrics
npm run analyze:bundle        # Full bundle and performance analysis
npm run analyze:build         # Analyze build output
```

## Architecture

### Project Structure
```
/
├── app/                          # Next.js 15 App Router
│   ├── layout.tsx               # Root layout with SEO structured data
│   ├── page.tsx                 # Main homepage (client component)
│   ├── globals.css              # Global styles with Tailwind v4
│   ├── header.tsx & footer.tsx  # Shared layout components
│   ├── projects/                # Projects showcase page
│   ├── blog/                    # MDX-powered blog
│   └── [other-pages]/           # Additional routes
├── components/
│   ├── ui/                      # Core UI components (buttons, cards, etc.)
│   ├── motion-primitives/       # Animation components
│   ├── magicui/                 # Special effect components (terminal, etc.)
│   ├── seo/                     # SEO optimization components
│   ├── pwa/                     # PWA-related components
│   ├── analytics/               # Analytics integration
│   └── core/                    # Fundamental reusable components
├── lib/
│   ├── data/                    # Static data (projects, blog posts, etc.)
│   ├── utils/                   # Utility functions
│   ├── security/                # Security utilities (CSP, nonce)
│   ├── metadata.ts              # SEO metadata configuration
│   └── analytics.ts             # Analytics tracking functions
├── context/                     # React context providers
├── hooks/                       # Custom React hooks
├── public/                      # Static assets
├── scripts/                     # Build and deployment scripts
└── __tests__/                   # Jest test files
```

### Key Technical Patterns

**Next.js App Router with Client/Server Split**
- Most pages use a pattern of `page.tsx` (server component) importing a `*-client.tsx` (client component)
- Example: `app/projects/page.tsx` imports `app/projects/projects-client.tsx`
- This optimizes bundle size and enables server-side rendering where beneficial

**Path Aliases**
- Use `@/` to reference root directory (configured in `tsconfig.json`)
- Example: `import { utils } from "@/lib/utils"`

**SEO Architecture**
- Heavy use of structured data (JSON-LD schemas) in `components/seo/`
- Hidden sr-only content for fractional consulting keyword targeting
- Multiple structured data types: Person, Organization, ProfessionalService, FAQ, LocalBusiness
- Base metadata created via `lib/metadata.ts`

**Animation System**
- Primary animation library: `motion` (Framer Motion)
- Custom animation components in `components/motion-primitives/`
- Performance-optimized with GPU acceleration
- Scroll-triggered animations using intersection observers

**PWA Implementation — currently DISABLED**
- `next-pwa` is commented out in `next.config.js` (Next.js 15 incompatibility; TODO notes migrating to `@ducanh2912/next-pwa`)
- **No service worker is generated** — do not rely on or claim offline behavior
- `app/manifest.ts` still ships (installable metadata), and `components/pwa/` + `app/offline/` remain in the tree but are inactive

**Performance Optimization**
- Extensive webpack bundle splitting in `next.config.js`
- Lazy loading for heavy libraries (Three.js, animations)
- Image optimization with WebP/AVIF formats
- Critical CSS inlining
- Code splitting by route and library

### Component Organization

**UI Components** (`components/ui/`)
- Radix UI-based components with Tailwind styling
- Custom animated components (spotlight, magnetic, hover effects)
- Video components with lazy loading (`lazy-hover-video.tsx`)

**Core Components** (`components/core/`)
- Fundamental building blocks (accordion, animated numbers, etc.)
- Reusable across multiple pages

**Magic UI** (`components/magicui/`)
- Special effects and unique interactions
- Terminal simulation components

## TypeScript Configuration

- Strict mode enabled
- Module resolution: `bundler`
- Path mapping: `@/*` → root directory
- Jest types included for testing

## Testing

**Framework**: Jest with React Testing Library
- Setup file: `jest.setup.ts`
- Environment: jsdom
- Coverage collected from `app/`, `components/`, `lib/`
- `motion/react` and `@vercel/analytics` are mocked via `moduleNameMapper` → root `__mocks__/`; tests depend on those mocks existing
- **Known baseline (not regressions)**: some suites are intentionally `describe.skip` (stale/TDD-red), and `__tests__/performance/animation-load-testing.test.tsx` is flaky (measures FPS inside jsdom, fails on slower runs)

**Running Tests**:
```bash
npm test                              # Run all tests
npm run test:watch                    # Run tests in watch mode
npm test -- path/to/test.tsx          # Run specific test file
npm run test:watch -- path/to/test.tsx # Watch specific test file
npm run test:performance              # Run performance tests only
```

## Styling

**Tailwind CSS v4**
- Configuration: `tailwind.config.js`
- Global styles: `app/globals.css`
- Custom CSS variables for theming
- Dark mode support via `next-themes`

**Design System Notes** (from `.cursor/rules/design.mdc`)
- Avoid indigo/blue colors unless specified
- Responsive design is mandatory
- Use Google Fonts
- Neo-brutalism and modern dark mode style patterns available
- Icons: Lucide React

**Code Style**
- ESLint uses the flat config `eslint.config.mjs`
- Prettier is enforced through ESLint (`plugin:prettier/recommended`): double quotes, trailing commas, printWidth 80, Tailwind class sorting via `prettier-plugin-tailwindcss`

## Build Optimization

The `next.config.js` contains extensive webpack optimizations:
- **Code Splitting**: Separate bundles for React, Three.js, animations, UI libs
- **Lazy Loading**: Heavy libraries loaded on-demand
- **Bundle Size Limits**: `maxSize` constraints to prevent large chunks
- **Image Optimization**: WebP/AVIF with responsive sizing
- **Caching**: Aggressive caching headers for static assets

**Critical Dependencies**:
- React vendor chunk (priority: 40) - loads immediately
- Three.js (priority: 30) - lazy loaded
- Animations (priority: 25) - lazy loaded
- UI libraries (priority: 20) - lazy loaded

## MDX Support

- MDX pages supported via `@next/mdx`
- Page extensions: `.js`, `.jsx`, `.ts`, `.tsx`, `.md`, `.mdx`
- Blog posts use MDX for rich content

## API Routes & Backend

Route handlers live under `app/api/`:
- `app/api/newsletter/*` — subscribe, unsubscribe. Backed by **Loops** (`loops` SDK); requires `LOOPS_API_KEY`. Subscriber state is helper-managed in `lib/email-storage.ts`.
- `app/api/csp-report/` — receives CSP violation reports

## Forms

- `react-hook-form` + `zod` (via `@hookform/resolvers`) for validation
- Prefer schema-first validation with `zod` and wire it through `@hookform/resolvers/zod`

## Middleware & Security

- `middleware.ts` runs on requests (security/cache headers, routing)
- **Headers are set in three places that must stay in sync**: `middleware.ts`, the `headers()` function in `next.config.js`, and `vercel.json`. Change one → check the others.
- Content Security Policy utilities in `lib/security/` (`csp-utils.ts`), plus nonce generation for inline scripts, strict CSP headers, HSTS in production
- Deploys to Vercel (region `iad1` per `vercel.json`)

## Environment Notes

- Builds ignore TypeScript and ESLint errors (`ignoreBuildErrors` / `ignoreDuringBuilds`) — see Verifying Changes above
- Production removes console logs
- Service workers are disabled entirely (PWA commented out), not just in development
- Analytics only active in production
- Most of the app runs without `.env.local`; only the newsletter API needs `LOOPS_API_KEY` (see `.env.example`)

## Common Patterns

**Creating a New Page**:
1. Create `app/[route]/page.tsx` (server component)
2. Create `app/[route]/[route]-client.tsx` (client component with "use client")
3. Import client component in page.tsx
4. Add metadata export in page.tsx
5. (Optional) Add OpenGraph image: `app/[route]/opengraph-image.tsx`

**Adding Analytics Tracking**:
```typescript
import { trackEvent } from "@/lib/analytics";
trackEvent("event_name", { property: "value" });
```

**Using Animations**:
```typescript
import { motion } from "motion/react";
// Use motion.div, motion.span, etc. with animation variants
```

**Lazy Loading Components**:
```typescript
import dynamic from "next/dynamic";
const HeavyComponent = dynamic(() => import("@/components/heavy"), {
  loading: () => <div>Loading...</div>,
});
```

## Port Management

If you encounter "Port 3000 already in use" errors:
- Use `npm run dev` (recommended) - prompts to kill processes
- Use `npm run clean-port` - kills port 3000 processes without confirmation
- Manual cleanup: `lsof -ti:3000 | xargs kill -9`
