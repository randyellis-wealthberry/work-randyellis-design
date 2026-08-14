# Coding Conventions

**Analysis Date:** 2026-08-14

## Naming Patterns

**Files:**
- kebab-case for all source files: `components/ui/enhanced-metrics-grid.tsx`, `app/projects/echo/echo-client.tsx`, `lib/email-storage.ts`
- Route pages are always `app/<route>/page.tsx`; the client half is `<route>-client.tsx` in the same folder (e.g. `app/projects/projects-client.tsx`, `app/projects/echo/echo-client.tsx`)
- API route handlers are `app/api/<path>/route.ts` (e.g. `app/api/newsletter/subscribe/route.ts`)
- Test files: `*.test.ts` / `*.test.tsx` under `__tests__/` mirroring the area under test (`__tests__/components/text-loop.test.tsx`, `__tests__/lib/env.test.ts`); a few co-located `__tests__/` folders exist (`components/ui/__tests__/`, `app/__tests__/header.test.tsx`)
- Hooks are inconsistent — new code should use kebab-case: `hooks/use-feature-flag.ts` (kebab) vs legacy `hooks/useClickOutside.tsx`, `hooks/useWebGLRenderer.tsx` (camelCase)
- One legacy PascalCase test file exists (`__tests__/components/AnimatedMetricCard.test.tsx`); use kebab-case for new tests
- Stray `.bak` files exist (`__tests__/projects/nagarro/nagarro-responsive.test.tsx.bak`); never create or revive these

**Functions:**
- camelCase for all functions (`getBaseUrl`, `parseMetricValue`)
- React components use PascalCase function declarations: `function Button(...)` in `components/ui/button.tsx`
- Event handlers: `handle*` prefix (`handleSubmit`, `handleIndexChange`)
- No special prefix for async functions; API route handlers are `export async function POST/GET`

**Variables:**
- camelCase for variables and props
- UPPER_SNAKE_CASE for module-level constants (`PROJECTS` in `lib/data/projects.ts`, `buttonVariants` is camelCase as a cva builder)
- No underscore prefix convention; unused destructured props are named `_`, `__`, etc. (see `__mocks__/motion/react.js`)

**Types:**
- PascalCase interfaces, no `I` prefix (`EnvironmentConfig` in `lib/env.ts`, `EnhancedMetricsGridProps` in `components/ui/enhanced-metrics-grid.tsx`)
- Props types named `<ComponentName>Props`, usually declared as `interface` or inline `React.ComponentProps<"element"> & ...` intersections
- `type` aliases PascalCase (`Project` in `lib/data/types.ts`)

## Code Style

**Formatting:**
- Prettier enforced through ESLint (`plugin:prettier/recommended`); config in `.prettierrc`
- Double quotes (`"singleQuote": false`), semicolons required, trailing commas everywhere (`"trailingComma": "all"`), 2-space indent, printWidth 80
- `prettier-plugin-tailwindcss` sorts Tailwind classes — keep class strings sortable, do not hand-order them

**Linting:**
- ESLint 9 flat config in `eslint.config.mjs`: extends `next/core-web-vitals`, `next/typescript`, `plugin:prettier/recommended`, `plugin:mdx/recommended`
- Run: `npm run lint` (uses `next lint`), fix: `npm run lint:fix`
- Type gate: `npx tsc --noEmit` (no `type-check` script exists). `tsconfig.json` **excludes `__tests__/`**, so tests are never typechecked — keep test code correct by running tests, not tsc
- WARNING: `next.config.js` sets `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true` — `npm run build` passes despite lint/type errors. Always verify with `npm run lint` → `npx tsc --noEmit` → `npm test`

## Component Patterns

**Server/client split (App Router convention):**
- `app/<route>/page.tsx` is a server component that exports `metadata` (title, description, openGraph, twitter) and renders the client component (`app/projects/echo/page.tsx`)
- Client components start with `"use client";` on line 1 (~88 of 98 files in `components/ui/` are client components)
- New route checklist: create `app/<route>/page.tsx` (server, metadata) + `app/<route>/<route>-client.tsx` (`"use client"`)

**shadcn/ui style components:**
- Function declaration + named export, `data-slot` attribute, cva variants, `cn()` merge (`components/ui/button.tsx`):

```tsx
function Button({ className, variant, size, asChild = false, ...props }:
  React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
export { Button, buttonVariants };
```

- Class merging always via `cn(...)` from `@/lib/utils` (`clsx` + `tailwind-merge`)
- Variants via `class-variance-authority` (`cva`)
- Icons from `lucide-react` only
- Styling: Tailwind v4 utility classes with `dark:` variants; zinc-based palette. Avoid indigo/blue palettes unless explicitly requested (`.cursor/rules/design.mdc`)
- Guard-clause empty states in components: `if (!metrics || metrics.length === 0) return null;` (`components/ui/enhanced-metrics-grid.tsx`)

## Import Organization

**Order (observed pattern):**
1. `"use client"` directive (line 1, when needed)
2. React / Next (`react`, `next/link`, `next/server`)
3. External packages (`lucide-react`, `motion/react`, `zod`, `loops`)
4. Internal modules via alias (`@/components/ui/card`, `@/lib/data/projects`)
5. Relative imports (`./echo-client`)

**Path Aliases:**
- `@/*` → repo root (defined in `tsconfig.json` `paths` and mirrored in `jest.config.js` `moduleNameMapper`)
- Prefer `@/` over deep relative paths; relative `./` is used for same-folder siblings

## Error Handling

**API route handlers** (`app/api/newsletter/subscribe/route.ts` is the reference implementation):
- Wrap the whole handler in try/catch; return `NextResponse.json({ error: "..." }, { status })` — never throw out of a route
- Validate input with zod `safeParse`; on failure return 400 with `result.error.issues[0]?.message`
- Check required env vars first and return 500 with a generic message (never leak the variable name)
- Non-critical side effects (local storage, analytics events, webhooks) get their own nested try/catch that logs and continues — the main request must not fail because of them
- Generic user-facing error messages ("Failed to subscribe. Please try again."); details go to `console.error` only

**Client/server components:**
- `app/error.tsx` and `app/global-error.tsx` are the Next.js error boundaries
- Defensive fallbacks: `|| "unknown"`, `|| ""`, optional chaining on headers and data lookups
- Non-null assertion on known-good data: `PROJECTS.find((p) => p.id === "echo")!` (`app/projects/echo/echo-client.tsx`)

## Logging

**Framework:** `console.*` only — no structured logger exists

**Patterns:**
- `console.error("Context label:", error)` at failure points (25 occurrences across `app/` and `lib/`)
- `console.log` for success milestones in API routes (`Successfully added contact to Loops: ...`)
- No log levels, no log library; do not add one without explicit request

## Comments

**When to Comment:**
- JSDoc-style file header blocks on lib utilities explaining purpose (`lib/env.ts`, `lib/test-utils.ts`)
- JSDoc on exported functions documenting priority order / behavior (`getBaseUrl` in `lib/env.ts`)
- Inline comments explain why, especially for non-obvious fallbacks and env detection
- Test files carry header comments explaining polyfills/mocks (`__tests__/components/text-loop.test.tsx`)

**TODO Comments:**
- Plain `// TODO:` — no username/issue convention observed

## Function Design

**Size:**
- Small pure helpers in `lib/utils/*` (`lib/utils/parseMetricValue.ts`, `lib/utils/read-time.ts`)
- Route handlers can be long (~170 lines in `app/api/newsletter/subscribe/route.ts`) but are structured as sequential guarded steps

**Parameters:**
- Destructure props in the signature with typed defaults: `function EnhancedMetricsGrid({ metrics = [], className = "" }: EnhancedMetricsGridProps)`
- Options objects for anything beyond 2–3 params

**Return Values:**
- Early `return null` guards for empty data in components
- API routes always return a `NextResponse.json(...)` object, success shape `{ success: true, message }`, error shape `{ error }`

## Module Design

**Exports:**
- Named exports for components and utilities (`export { Button, buttonVariants }`)
- Default exports only for Next.js special files: `page.tsx`, `layout.tsx`, `error.tsx`, `not-found.tsx`
- Server pages are `export default function <RouteName>()`

**Barrel Files:**
- Used sparingly: `lib/data/index.ts`, `components/motion-primitives/index.ts`, `components/ui/webgl-scenes/index.ts`, `components/ui/animated-buttons/index.ts`
- Most imports go directly to the file (`@/components/ui/card`), not through barrels

## Environment & Config Conventions

- Client-visible env vars must use `NEXT_PUBLIC_` prefix; env resolution pattern in `lib/env.ts` (`getBaseUrl`): manual override → Vercel URL → environment detection
- `.env.example` documents all variables; only `LOOPS_API_KEY` (newsletter) is required for full functionality — everything else must run without `.env.local`
- Cache/security headers are defined in three places that must stay in sync: `middleware.ts`, `next.config.js` `headers()`, and `vercel.json`
- `pageExtensions` includes `.md`/`.mdx` — never drop stray markdown files inside `app/` (they become routes)

---

*Convention analysis: 2026-08-14*
*Update when patterns change*
