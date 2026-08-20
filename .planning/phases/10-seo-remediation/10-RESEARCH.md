# Phase 10: SEO Remediation - Research

**Researched:** 2026-08-20
**Domain:** Technical SEO remediation — service worker cleanup, crawl control, structured data consolidation
**Confidence:** HIGH

## Summary

This phase closes all seven findings from `.planning/research/SEO-AUDIT.md` (2026-08-16) to make the site fully crawlable, consistently indexed, and emit one coherent entity story in structured data. The work builds on Phase 9's reconciled claims — metadata/OG/JSON-LD now derive from `lib/data/projects.ts`, so this phase migrates those schemas to server-rendering and consolidates the entity hierarchy.

**Primary recommendation:** Execute in priority order (T-01/T-02 critical, T-06 high, rest quick wins), sequence structured-data work with/after any remaining Phase 9 claim reconciliation, include mandatory live post-deploy verification.

The most dangerous file on the site is `public/sw.js` — a stale Workbox service worker precaching deleted routes (`/archive`, `/ledgeriq`) and old hashed chunks. Returning visitors get stale content until it's replaced with a kill-switch. The second-most impactful fix is removing `/_next/` from robots.txt disallow list — all JSON-LD is currently client-rendered, so blocking Googlebot from fetching JS/CSS means structured data never gets indexed.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Service worker kill-switch | Browser / Client | — | SW registration/unregistration happens in the browser; executes client-side on returning visitors |
| robots.txt generation | API / Backend | — | Next.js `app/robots.ts` generates robots.txt at build/request time on the server |
| Structured data emission | Frontend Server (SSR) | — | JSON-LD should be in initial HTML from RSC render, not client-hydrated |
| Sitemap generation | API / Backend | — | Next.js `app/sitemap.ts` generates sitemap.xml server-side |
| Test route deletion/blocking | API / Backend | — | Route handlers and middleware run server-side |
| PWA artifact cleanup | CDN / Static | — | `public/` files are static assets served directly |
| Live verification (Rich Results, Search Console) | External | — | Third-party tools, not a tier in the app architecture |

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Structured Data Entity Strategy:**
- **D-01:** Core schema types are Person + WebSite + per-project CreativeWork + blog Article + Wealthberry Organization. This is the consolidated entity hierarchy — Person (Randy) is the primary entity, WebSite is the platform, projects are creative works, blog posts are articles, and Wealthberry Labs Organization represents Randy's company.
- **D-02:** Delete LocalBusiness schema entirely. It has invalid properties (country-only address, fabricated openingHours/paymentAccepted for a remote consultant). Person + service representation (if added later) covers the offering without invalid location cruft.
- **D-03:** Verify Chameleon Collective URL and keep if valid. Check if the URL (appears in about-client.tsx + 3× structured-data.tsx) resolves and points to a real page about Randy or his work. If yes, keep it as a sameAs link in Person schema. If broken or irrelevant, remove it. Known v1.0 carry-over blocker.
- **D-04:** Use `x.com/iamrandyellis` for sameAs (not twitter.com). Current canonical domain after Twitter's rebrand. Resolve the conflict between Person (twitter.com) and LocalBusiness (x.com).
- **D-05:** Selective FAQPage deletion — keep FAQs where they're accurate (e.g., growit's 3 FAQs about 240K+ users, 4.8★, ML plant ID), remove off-topic ones (echo's "AI design system" FAQs for a trucking logistics project, addvanced's financial-advisor FAQs for a career tracker). Note: still violates on-page visibility requirement (Google requires visible Q&A for rich results), but preserves accurate content where it exists.
- **D-06:** Migrate surviving schema to server-rendered components during consolidation. Move Person, WebSite, CreativeWork, Article, Organization from client-rendered `components/seo/structured-data.tsx` ("use client") to server components or inline `<script type="application/ld+json">` in RSC output. More reliable indexing, especially combined with robots.ts `/_next/` fix.
- **D-07:** Keep Wealthberry Labs Organization schema — it represents Randy's company. Ensure the relationship to Person (Randy) is clear in schema and the external URL (buildyourlegacywithai.com) is correct.

**Test Route Handling:**
- **D-08:** Delete `/test/codeblock` and `/test-glow` entirely. They're indexable demo routes that dilute crawl quality. AGENTS.md says "don't add stray routes" — these are the existing strays.
- **D-09:** Audit all `/app` routes for other dev-only pages using this criteria: not linked from nav/sitemap + not in ROADMAP scope. If it's not in the main nav, not in sitemap.ts, and not part of the documented site structure (about, projects, blog, metis), it's a candidate for removal or noindex.
- **D-10:** For routes identified as dev-only during audit: delete if truly internal, noindex if might have future use. Balanced approach — test routes get deleted, but if we find something that might be revived later (like a draft feature page), noindex keeps it accessible internally.

**AI Crawler Policy:**
- **D-11:** Open site to all AI crawlers. Remove GPTBot, CCBot, ChatGPT-User, anthropic-ai, Claude-Web blocks from robots.ts. Allows ChatGPT, Claude, Perplexity, etc. to cite work in AI answers for AEO/GEO visibility. Target queries like "fractional chief design officer" increasingly get AI-answer treatment. Trade-off accepted: content gets ingested into training data.

**Service Worker Migration & PWA Cleanup:**
- **D-12:** Replace `public/sw.js` with kill-switch script. Tiny SW that self-unregisters on install (`self.skipWaiting()`), clears all caches, then calls `self.registration.unregister()` on activate. Ensures returning visitors (who registered the stale Workbox SW from next-pwa era) get the fresh site immediately. Critical — stale SW precaches deleted `/archive` and `/ledgeriq` routes.
- **D-13:** Complete PWA removal: delete `app/manifest.ts`, `public/manifest.json`, `public/fallback-*.js`, `public/workbox-*.js` (if any), `components/pwa/` directory (pwa-provider.tsx, install-prompt.tsx, offline-indicator.tsx, update-prompt.tsx), `app/offline/` route, and `app/sw-register.tsx`. Since next-pwa is permanently disabled and you're certain you won't want installability, clean slate.

**Sitemap & Robots Improvements:**
- **D-14:** Add `lastModified` to sitemap URLs. Build time or content-derived dates for static + project URLs (blog already has dates). Priority hints are hints, but freshness signals improve crawl efficiency.
- **D-15:** Remove `/_next/` from robots.ts disallow list. Critical fix — blocks Googlebot from fetching JS/CSS needed to render pages. All structured data is currently client-rendered (see D-06), so rendering isn't optional — it's the only way crawlers see JSON-LD. Keep `/admin/`, `/api/`, `/private/`, `/drafts/` disallows.

**Live Verification (post-deploy):**
- **D-16:** Mandatory verification step in the plan: fetch live robots.txt and sitemap.xml, run Rich Results Test on `/` (home), `/projects/growit` (one project), and one blog post, confirm Search Console property exists and sitemap is submitted. Record results in verification artifact. Audit ran offline — this step confirms it works in production.

### Claude's Discretion

- Kill-switch script exact implementation (listener structure, cache-clearing approach)
- Sitemap date source (build time vs content-derived for projects)
- Whether to add `/archive` → `/projects` redirect if Search Console shows backlinks
- Commit granularity — suggest: robots/test-routes; SW kill-switch + PWA cleanup; structured-data consolidation + server-render migration; sitemap; live verification
- Helper location for server-rendered schema components (likely in `components/seo/` but as RSCs)
- Whether to reconcile ROADMAP.md checkboxes for Phases 5-9 (all complete but unchecked) in this phase's docs commit — recommended yes

</user_constraints>

<phase_requirements>
## Phase Requirements

This phase addresses SEO-01..SEO-05, derived from audit findings T-01..T-07:

| ID | Description | Research Support |
|----|-------------|------------------|
| SEO-01 | Service worker kill-switch + PWA cleanup | Service Worker Lifecycle section, PWA Artifact Inventory |
| SEO-02 | robots.txt `/_next/` unblocking + AI crawler policy | Crawl Control section, Next.js robots.ts documentation |
| SEO-03 | Test route deletion/blocking | Test Route Handling section, middleware patterns |
| SEO-04 | Structured data consolidation + server-render migration | Server-Rendered JSON-LD section, Schema.org entity relationships |
| SEO-05 | Sitemap lastModified + live verification | Sitemap Optimization section, Live Verification Tools |

</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.x | robots.ts, sitemap.ts, server components | [VERIFIED: Context7 /vercel/next.js] File-based metadata routes are the official approach for robots/sitemap; App Router server components are the default rendering mode |
| schema.org | 2024 vocab | Structured data vocabulary | [CITED: schema.org] The standard vocabulary for search engine structured data; Google's structured data testing tools expect schema.org types |

### Supporting

No additional libraries needed — this phase uses existing Next.js features and removes client-side dependencies.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| File-based robots.ts | Static public/robots.txt | Dynamic generation allows environment-based rules (preview vs prod), but static file works if rules never change |
| Native script tags | next/script component | next/script is optimized for executable JavaScript, not structured data — docs explicitly recommend native script tags for JSON-LD [VERIFIED: Context7] |
| Kill-switch service worker | Browser DevTools unregister | Manual unregister only affects users who visit while dev tools are open; kill-switch reaches all returning visitors automatically |

**Installation:**

No new packages to install. This phase removes client-side PWA dependencies and uses native Next.js features.

**Version verification:**

Current Next.js version confirmed via package.json (already installed, no upgrade needed).

## Architecture Patterns

### System Architecture Diagram

```
Entry Points                Processing Stages                    External Dependencies
────────────────           ──────────────────────               ─────────────────────

Googlebot Request          Next.js Server (SSR)                 Google Search Console
      │                            │                                    │
      │                            ├─► robots.ts generates            │
      │                            │   robots.txt (allow /_next/)     │
      │                            │                                   │
      ├──────────────────────────►├─► Page RSC renders with          │
                                   │   inline JSON-LD <script>         │
                                   │   (Person, WebSite, CreativeWork) │
                                   │                                   │
                                   ├─► sitemap.ts generates           │
                                   │   sitemap.xml (with lastModified) │
                                   │                                   │
                                   └─► HTML response with              │
                                       - structured data in <head>     │
                                       - crawler-renderable JS/CSS     │
                                                                       │
Returning Visitor                  Browser                            │
      │                                 │                             │
      │ (has stale SW registered)       │                             │
      ├──────────────────────────────►  │                             │
                                        ├─► Kill-switch SW activates  │
                                        │   - skipWaiting()            │
                                        │   - clear all caches         │
                                        │   - unregister()             │
                                        │                              │
                                        └─► Fetch fresh page (no SW)  │
                                                                       │
Post-Deploy Verification                                              │
      │                                                                │
      ├─► Fetch live robots.txt ────────────────────────────────────►│
      ├─► Fetch live sitemap.xml ───────────────────────────────────►│
      ├─► Rich Results Test (/, /projects/growit, /blog/post) ──────►│
      └─► Confirm Search Console sitemap submission ────────────────►│
```

### Recommended Project Structure

No new directories — this phase refactors existing files.

```
app/
├── robots.ts              # Remove /_next/, remove AI crawler blocks
├── sitemap.ts             # Add lastModified to static/project URLs
├── layout.tsx             # Render Person + WebSite + Organization schema (server-rendered)
├── projects/
│   └── [slug]/page.tsx    # Render CreativeWork schema (server-rendered)
└── blog/
    └── [slug]/page.tsx    # Render Article schema (server-rendered)

components/seo/
├── structured-data.tsx    # DELETE (or refactor to RSC helpers)
└── project-faq.tsx        # DELETE per Phase 9 D-09

public/
├── sw.js                  # REPLACE with kill-switch
└── fallback-*.js          # DELETE
```

### Pattern 1: Server-Rendered JSON-LD in Next.js RSC

**What:** Inline structured data directly in server component JSX using native `<script type="application/ld+json">` tags.

**When to use:** Always for JSON-LD — it's structured data, not executable JavaScript.

**Example:**

```tsx
// Source: Context7 /vercel/next.js - JSON-LD guide
// app/layout.tsx (server component)

export default async function RootLayout({ children }) {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Randy Ellis',
    jobTitle: 'Fractional Chief Design Officer',
    url: 'https://work.randyellis.design',
    sameAs: [
      'https://www.linkedin.com/in/iamrandyellis/',
      'https://x.com/iamrandyellis',
    ],
  };

  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Key points:**
- Use native `<script>` tag, NOT `next/script` [VERIFIED: Context7 — next/script is for executable JS]
- Escape `<` characters with `\\u003c` to prevent XSS [VERIFIED: Context7]
- Server components render this in initial HTML — no client hydration needed
- Multiple schemas can coexist in the same page (e.g., Person + WebSite in layout, CreativeWork in page)

### Pattern 2: Next.js Metadata Routes (robots.ts, sitemap.ts)

**What:** File-based routes that export typed metadata objects, compiled to robots.txt and sitemap.xml at build/runtime.

**When to use:** Always for robots.txt and sitemap.xml in Next.js — the official metadata API.

**Example:**

```ts
// Source: Context7 /vercel/next.js - robots.txt API
// app/robots.ts

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/private/'],
    },
    sitemap: 'https://work.randyellis.design/sitemap.xml',
  };
}
```

```ts
// Source: Context7 /vercel/next.js - sitemap.xml API
// app/sitemap.ts

import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://work.randyellis.design',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ];
}
```

**Key points:**
- `lastModified` is optional but recommended [VERIFIED: Context7 type definition]
- Accepts `Date` object or ISO string
- `changeFrequency` and `priority` are hints to crawlers, not guarantees
- Can be static (return hardcoded array) or dynamic (fetch from CMS/database)

### Pattern 3: Service Worker Kill-Switch

**What:** A minimal service worker that unregisters itself and clears caches, replacing a stale service worker.

**When to use:** When transitioning away from PWA or when a stale SW precaches deleted routes.

**Example:**

```js
// Source: [ASSUMED — MDN Service Worker API patterns]
// public/sw.js

self.addEventListener('install', (event) => {
  // Take control immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clear all caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
      
      // Unregister this service worker
      const registration = await self.registration;
      await registration.unregister();
      
      // Take control of all clients
      await self.clients.claim();
    })()
  );
});

// No fetch handler — this SW does nothing except unregister itself
```

**Key points:**
- `skipWaiting()` bypasses the waiting phase so the new SW activates immediately [ASSUMED]
- `caches.keys()` lists all cache storage names; delete them all to prevent stale content [ASSUMED]
- `registration.unregister()` removes the SW entirely [ASSUMED]
- `clients.claim()` takes control of all open tabs [ASSUMED]
- No fetch handler means requests go directly to the network after activation

### Anti-Patterns to Avoid

- **Client-rendered JSON-LD with next/script:** Current implementation in `components/seo/structured-data.tsx` delays indexing and relies on JS execution. Google can usually render it, but other crawlers may not, and it's fragile when combined with `/_next/` blocking in robots.txt.
- **Blocking `/_next/` in robots.txt when using client-rendered content:** Creates a catch-22 where crawlers can't fetch the JS needed to render the page.
- **Fabricated schema properties:** LocalBusiness with `openingHoursSpecification`/`paymentAccepted` for a remote consultant, or using non-existent properties like `offeredThrough`, signals to Google that the markup is synthetic.
- **Leaving a stale service worker in place:** Precaching deleted routes means returning visitors get 404s or old content indefinitely.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Service worker lifecycle management | Custom SW registration/update logic | Kill-switch pattern → complete unregister | SW update mechanics are complex (waiting worker, clients.claim timing, cache versioning). A kill-switch is 20 lines and guaranteed to work. |
| Robots.txt generation with environment logic | String concatenation in middleware | Next.js `app/robots.ts` with typed return | The MetadataRoute.Robots type prevents syntax errors, the file-based convention is self-documenting, and Next.js handles the HTTP response automatically. |
| Sitemap.xml generation | Manual XML construction | Next.js `app/sitemap.ts` with typed return | The MetadataRoute.Sitemap type handles XML escaping, the built-in route serves it at /sitemap.xml, and changeFrequency/priority enums prevent typos. |
| Schema.org entity relationships | Copy-paste from examples, hope it validates | Use schema.org documentation for required/recommended properties | Schema.org has nuanced rules (e.g., LocalBusiness requires `address` with `addressLocality` or it's invalid; Organization can link to Person via `founder` or `member`). The official docs are the source of truth. |

**Key insight:** Next.js provides first-class metadata APIs (robots.ts, sitemap.ts) that are type-safe, file-based, and handle edge cases (XML escaping, content-type headers, caching). Using them is less code and fewer bugs than manual implementations.

## Runtime State Inventory

> This section applies to rename/refactor/migration phases only. Phase 10 is a cleanup/consolidation phase, not a rename, but the PWA removal touches runtime state.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — service workers use Cache API (browser-managed), not persistent database records | None (kill-switch clears caches) |
| Live service config | Service worker registered in user browsers from next-pwa era (unknown count of returning visitors) | Kill-switch SW replaces on next visit |
| OS-registered state | None — PWA was never fully deployed (manifest exists but SW was stale) | None |
| Secrets/env vars | None — SEO work is public-facing configuration | None |
| Build artifacts | `public/fallback-*.js` generated by next-pwa, `.next/` cache may have stale SW references | Delete fallback files, clean build recommended |

**Nothing found in category:** Stored data, OS-registered state, Secrets/env vars all verified as not applicable to this phase.

## Common Pitfalls

### Pitfall 1: Forgetting to escape `<` in JSON-LD

**What goes wrong:** When `<script type="application/ld+json">` contains a `<` character in the JSON (e.g., a description with HTML entities or a comparison like "less than 5"), React treats it as the start of a tag and throws a hydration error or XSS warning.

**Why it happens:** `dangerouslySetInnerHTML` bypasses React's escaping, so literal `<` in JSON can confuse the parser.

**How to avoid:** Always replace `<` with `\\u003c` when stringifying JSON-LD [VERIFIED: Context7].

**Warning signs:** Hydration errors in browser console mentioning "invalid JSON-LD" or "unexpected token."

**Example:**

```tsx
// BAD
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
/>

// GOOD
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
  }}
/>
```

### Pitfall 2: Blocking `/_next/` in robots.txt while using client-rendered content

**What goes wrong:** Googlebot can't fetch the JavaScript bundles needed to render the page, so client-rendered JSON-LD never gets indexed. Rich results don't appear in search, and structured data testing tools show "No structured data found."

**Why it happens:** Developer assumes blocking `/_next/` prevents Googlebot from crawling internal chunks, not realizing those chunks are necessary for rendering.

**How to avoid:** Either (a) remove `/_next/` from disallow list, OR (b) server-render all critical content including JSON-LD. This phase does both.

**Warning signs:** Google Search Console shows "Page is not indexed: Crawled - currently not indexed" or Rich Results Test shows empty structured data despite code emitting it.

### Pitfall 3: Stale service worker precaching deleted routes

**What goes wrong:** A service worker registered before routes were deleted continues serving cached versions of those routes from Cache API. Users see 404 pages that work (cached HTML), or outdated content, or the SW returns a fallback for a route that no longer exists.

**Why it happens:** Service workers persist until explicitly unregistered. Deleting a route in code doesn't invalidate the SW's precache manifest.

**How to avoid:** When removing PWA or deleting routes, replace the SW with a kill-switch that unregisters itself and clears all caches.

**Warning signs:** Users report seeing pages that shouldn't exist anymore, or DevTools Application tab shows a service worker with a stale precache list.

### Pitfall 4: Invalid LocalBusiness schema for non-local businesses

**What goes wrong:** Schema validation fails or Google doesn't show rich results because the LocalBusiness address is incomplete (country-only, no `addressLocality` or `streetAddress`) or properties like `openingHours` are fabricated for a remote-only consultant.

**Why it happens:** Developer uses LocalBusiness because it has fields for services, not realizing it requires a physical location.

**How to avoid:** Use `Person` with `offers` or `makesOffer` for service representation, or `Organization` with `location` only if there's a real physical presence. LocalBusiness is for storefronts, restaurants, offices — not fractional consultants.

**Warning signs:** Rich Results Test shows errors like "Missing field 'addressLocality'" or "Invalid value for openingHoursSpecification."

### Pitfall 5: Mixing twitter.com and x.com in sameAs arrays

**What goes wrong:** Duplicate entity signals confuse Google's Knowledge Graph merge logic — is this one person or two? Canonical URLs should be consistent.

**Why it happens:** Twitter rebranded to X, but old schema examples still reference twitter.com.

**How to avoid:** Use `x.com` as the canonical domain (it's where the URLs redirect). Update all sameAs references.

**Warning signs:** Knowledge Graph shows wrong profile picture or bio, or Google Search Console shows conflicting entity signals.

## Code Examples

### Server-Rendered Person Schema in Layout

```tsx
// Source: Context7 /vercel/next.js JSON-LD guide + Phase 9 projectMetadata pattern
// app/layout.tsx

export default async function RootLayout({ children }) {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Randy Ellis',
    jobTitle: 'Fractional Chief Design Officer',
    description: 'Fractional Chief Design Officer specializing in AI product design and design systems.',
    url: 'https://work.randyellis.design',
    image: 'https://work.randyellis.design/images/randy-ellis-official-avatar.png',
    sameAs: [
      'https://www.linkedin.com/in/iamrandyellis/',
      'https://github.com/randyellis-wealthberry',
      'https://x.com/iamrandyellis', // Note: x.com, not twitter.com
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Wealthberry Labs',
      url: 'https://www.buildyourlegacywithai.com',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Randy Ellis — Fractional Chief Design Officer',
    url: 'https://work.randyellis.design',
    description: 'Portfolio and case studies showcasing AI product design and design systems leadership.',
    author: {
      '@id': 'https://work.randyellis.design#person',
    },
  };

  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personSchema).replace(/</g, '\\u003c'),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Server-Rendered CreativeWork Schema in Project Page

```tsx
// Source: Phase 9 projectMetadata() helper pattern + Context7 JSON-LD guide
// app/projects/[slug]/page.tsx

import { PROJECTS } from '@/lib/data/projects';

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.description,
    url: `https://work.randyellis.design/projects/${project.slug}`,
    image: project.thumbnail,
    dateCreated: project.timeline?.start || '2024',
    author: {
      '@type': 'Person',
      name: 'Randy Ellis',
      url: 'https://work.randyellis.design',
    },
    keywords: [
      ...project.technologies,
      ...project.tags,
      project.category,
    ].join(', '),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(creativeWorkSchema).replace(/</g, '\\u003c'),
        }}
      />
      {/* Page content */}
    </div>
  );
}
```

### Robots.txt Without `/_next/` Block

```ts
// Source: Context7 /vercel/next.js robots.txt API + current app/robots.ts
// app/robots.ts

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/private/', '/drafts/'],
        // NOTE: /_next/ removed — crawlers need JS/CSS to render pages
      },
      // AI crawlers unblocked per D-11 — all blocks removed
    ],
    sitemap: 'https://work.randyellis.design/sitemap.xml',
  };
}
```

### Sitemap with lastModified for All URLs

```ts
// Source: Context7 /vercel/next.js sitemap API + current app/sitemap.ts
// app/sitemap.ts

import { MetadataRoute } from 'next';
import { PROJECTS } from '@/lib/data/projects';
import { getBlogArticles } from '@/lib/utils/blog-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const buildDate = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: 'https://work.randyellis.design',
      lastModified: buildDate, // Build time for static pages
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: 'https://work.randyellis.design/projects',
      lastModified: buildDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://work.randyellis.design/about',
      lastModified: buildDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  const projectPages: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: `https://work.randyellis.design/projects/${project.slug}`,
    lastModified: buildDate, // Could use project.timeline.end if available
    changeFrequency: 'monthly' as const,
    priority: project.featured ? 0.8 : 0.6,
  }));

  const blogPages: MetadataRoute.Sitemap = getBlogArticles().map((post) => ({
    url: `https://work.randyellis.design/blog/${post.slug}`,
    lastModified: new Date(post.publishedDate), // Content-derived
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
```

### Service Worker Kill-Switch

```js
// Source: [ASSUMED — MDN Service Worker API patterns]
// public/sw.js

self.addEventListener('install', (event) => {
  console.log('[Kill-switch SW] Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Kill-switch SW] Activating...');
  
  event.waitUntil(
    (async () => {
      // Clear all caches
      const cacheNames = await caches.keys();
      console.log('[Kill-switch SW] Clearing caches:', cacheNames);
      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
      
      // Unregister this service worker
      const registration = await self.registration;
      console.log('[Kill-switch SW] Unregistering...');
      await registration.unregister();
      
      // Take control of all clients
      await self.clients.claim();
      
      console.log('[Kill-switch SW] Complete — SW unregistered, caches cleared');
    })()
  );
});

// No fetch handler — requests go directly to network
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Client-rendered JSON-LD via next/script | Server-rendered JSON-LD via native script tags in RSC | Next.js 13+ App Router era | More reliable crawler indexing; initial HTML contains structured data without JS execution |
| Static public/robots.txt | Dynamic app/robots.ts with MetadataRoute.Robots type | Next.js 13 Metadata API | Type-safe, environment-aware (can differ between preview/prod) |
| Manual XML generation for sitemaps | app/sitemap.ts with MetadataRoute.Sitemap type | Next.js 13 Metadata API | Automatic XML escaping, type-safe changeFrequency/priority enums |
| twitter.com URLs in sameAs | x.com URLs | Twitter → X rebrand, 2023 | x.com is the canonical domain; twitter.com redirects |

**Deprecated/outdated:**
- **next-pwa:** Commented out in next.config.js due to Next.js 15 incompatibility. TODO notes mention migrating to `@ducanh2912/next-pwa`, but PWA is being removed entirely per D-13.
- **client-rendered structured data components:** `components/seo/structured-data.tsx` exports like `LocalBusinessStructuredData` are being deleted/migrated to server components.

## Assumptions Log

> Claims tagged [ASSUMED] that need confirmation before execution.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Service worker kill-switch pattern (skipWaiting → clear caches → unregister) successfully replaces stale SWs | Service Worker Kill-Switch, Pattern 3 | Returning visitors continue getting stale content if lifecycle timing is wrong |
| A2 | `caches.keys()` and `caches.delete()` clear all Cache API storage | Service Worker Kill-Switch example | Stale content persists if there's storage the kill-switch doesn't clear |
| A3 | Schema.org Person can link to Organization via `worksFor` | Server-Rendered Person Schema example | Incorrect property if schema.org expects `affiliation` or `memberOf` instead |
| A4 | Build-time `new Date()` is acceptable for static page lastModified | Sitemap example | Google may prefer content-derived dates (e.g., git commit timestamp) if available |

**If this table is empty:** All other claims in this research were verified via Context7 or cited from official sources — no user confirmation needed beyond the 4 assumptions above.

## Open Questions

1. **Chameleon Collective URL verification (D-03)**
   - What we know: URL appears in `app/about/about-client.tsx` + 3× in `components/seo/structured-data.tsx`; it's a known v1.0 carry-over blocker
   - What's unclear: Does the URL resolve? Does it point to a page about Randy or his work?
   - Recommendation: Check URL in browser during planning or Wave 0; if it 404s or is irrelevant, remove it; if valid, keep as Person sameAs link

2. **Sitemap lastModified source for projects (D-14)**
   - What we know: Blog has content-derived dates (post.publishedDate); static pages can use build time; projects are in between
   - What's unclear: Should projects use build time (simple, always fresh) or derive from `project.timeline.end` (accurate but may be stale)?
   - Recommendation: Start with build time (simple, safe); if Search Console shows stale "last crawled" timestamps, switch to timeline-derived

3. **Whether to add /archive → /projects redirect**
   - What we know: Stale SW precaches `/archive` (deleted route); search engines may have indexed it in the past
   - What's unclear: Are there external backlinks pointing to `/archive`? Would a redirect capture that traffic?
   - Recommendation: Check Search Console after deploy; if backlinks exist, add redirect; if not, let 404 stand (cleaner)

## Environment Availability

> Phase 10 depends on live tools for post-deploy verification (D-16).

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Google Rich Results Test | Live verification (D-16) | ✓ (web) | — | Manual structured data validator |
| Google Search Console | Sitemap submission, backlink check | ✓ (web) | — | — (no fallback; required) |
| Browser DevTools | Service worker inspection, cache verification | ✓ (local) | — | — |
| curl / fetch | robots.txt, sitemap.xml live fetch | ✓ (CLI) | — | Browser network tab |

**Missing dependencies with no fallback:**
- None — all dependencies are web-based or built into browsers/terminals

**Missing dependencies with fallback:**
- Rich Results Test: If unavailable, use https://validator.schema.org/ (generic JSON-LD validator, not Google-specific)

## Security Domain

> Required when `security_enforcement` is enabled (absent = enabled). Config shows `security_enforcement` is not set, so enabled by default.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | N/A (public-facing SEO config) |
| V3 Session Management | no | N/A (no user sessions) |
| V4 Access Control | no | N/A (robots.txt controls crawler access, not authenticated users) |
| V5 Input Validation | yes | Escape `<` in JSON-LD to prevent XSS (Context7 pattern) |
| V6 Cryptography | no | N/A (no encryption needed) |

### Known Threat Patterns for SEO/structured data

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via unescaped JSON-LD | Tampering | Replace `<` with `\\u003c` in dangerouslySetInnerHTML [VERIFIED: Context7] |
| Service worker cache poisoning | Tampering | Kill-switch clears all caches; no fetch handler means no caching [ASSUMED] |
| robots.txt information disclosure | Information Disclosure | Acceptable — robots.txt is public by design; keep sensitive paths in disallow list |

**Key security consideration:** The `dangerouslySetInnerHTML` API bypasses React's XSS protections, so escaping `<` characters is critical. This is the same pattern used for rendering user-generated content safely.

## Sources

### Primary (HIGH confidence)

- **Context7 /vercel/next.js** — robots.txt metadata API, sitemap.xml metadata API, JSON-LD implementation guide (native script tags vs next/script), MetadataRoute types
- **Codebase inspection** — current robots.ts (line 10 blocks `/_next/`, lines 12-31 block AI crawlers), current sitemap.ts (blog has lastModified, static/projects don't), current structured-data.tsx (client-rendered via "use client" + Script component), current sw.js (Workbox precaching deleted routes), middleware.ts (shouldBlockIndexing pattern)

### Secondary (MEDIUM confidence)

- **Phase 9 CONTEXT.md** — projectMetadata() helper pattern, claim reconciliation methodology, D-09 FAQPage deletion decision
- **SEO-AUDIT.md** — T-01..T-07 findings with priority rankings, exact file paths affected

### Tertiary (LOW confidence)

- **Service worker kill-switch pattern** — marked [ASSUMED], based on MDN Service Worker API documentation patterns (skipWaiting, caches API, unregister), not verified via live testing in this session
- **Schema.org Person → Organization relationship** — marked [ASSUMED], based on training knowledge; schema.org docs were not fetchable due to tool errors

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Next.js metadata APIs verified via Context7, existing codebase confirms versions
- Architecture patterns: HIGH — Server-rendered JSON-LD pattern verified via Context7, service worker patterns marked [ASSUMED] but low-risk
- Common Pitfalls: HIGH — All pitfalls derived from actual audit findings (T-01..T-07) or Context7 documentation warnings
- Code examples: HIGH — Next.js examples verified via Context7; service worker example marked [ASSUMED]

**Research date:** 2026-08-20
**Valid until:** ~30 days (stable domain — Next.js metadata APIs are stable since v13, service worker APIs unchanged since 2016)

**Validation notes:**
- WebSearch and WebFetch tools failed due to model errors (claude-3-5-haiku-20241022 unavailable)
- Context7 CLI via Bash succeeded for Next.js documentation
- Codebase inspection covered 100% of files mentioned in audit findings
- Service worker kill-switch pattern is [ASSUMED] — recommend testing in staging before deploy
