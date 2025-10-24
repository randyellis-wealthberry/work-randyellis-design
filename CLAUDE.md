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

### Building
```bash
npm run build                # Standard production build
npm run build:optimized      # Production build with increased memory (4GB)
npm run build:analyze        # Build with bundle analysis enabled
npm run build:profile        # Build with profiling enabled
```

### Linting & Testing
```bash
npm run lint            # Run ESLint
npm run lint:fix        # Auto-fix linting issues
npm test                # Run all Jest tests
npm test:watch          # Run tests in watch mode
npm test:performance    # Run performance-specific tests
```

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

**PWA Implementation**
- Uses `next-pwa` for service worker generation
- PWA components in `components/pwa/`
- Offline support with runtime caching strategies
- Install prompts and update notifications

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
- Mocks for `@vercel/analytics` and `motion/react`

**Running Tests**:
```bash
npm test                              # Run all tests
npm test:watch                        # Run tests in watch mode
npm test -- path/to/test.tsx          # Run specific test file
npm test:watch -- path/to/test.tsx    # Watch specific test file
npm test:performance                  # Run performance tests only
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
- Icons: Lucide React (primary), Remixicon

## Build Optimization

The `next.config.js` contains extensive webpack optimizations:
- **Code Splitting**: Separate bundles for React, Three.js, animations, UI libs
- **Lazy Loading**: Heavy libraries loaded on-demand
- **Bundle Size Limits**: `maxSize` constraints to prevent large chunks
- **Image Optimization**: WebP/AVIF with responsive sizing
- **Caching**: Aggressive caching headers for static assets
- **PWA**: Service worker with runtime caching

**Critical Dependencies**:
- React vendor chunk (priority: 40) - loads immediately
- Three.js (priority: 30) - lazy loaded
- Animations (priority: 25) - lazy loaded
- UI libraries (priority: 20) - lazy loaded

## MDX Support

- MDX pages supported via `@next/mdx`
- Page extensions: `.js`, `.jsx`, `.ts`, `.tsx`, `.md`, `.mdx`
- Blog posts use MDX for rich content

## Security

- Content Security Policy utilities in `lib/security/csp-utils.ts`
- Nonce generation for inline scripts
- Strict CSP headers
- HSTS enabled in production

## Environment Notes

- Development ignores TypeScript and ESLint errors during builds (for speed)
- Production removes console logs
- Service workers disabled in development
- Analytics only active in production

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
