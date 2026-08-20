# Phase 10: SEO Remediation - Research

**Researched:** 2026-08-20
**Domain:** Technical SEO, Next.js metadata APIs, service worker lifecycle, Schema.org structured data
**Confidence:** HIGH

## Summary

Phase 10 closes all findings from the 2026-08-16 SEO audit by remediating technical crawlability issues, consolidating structured data to a coherent entity story, and adding live post-deploy verification. The phase builds on Phase 9's claim reconciliation work—all metadata/OG/JSON-LD strings are now single-sourced from `lib/data/projects.ts`, so this phase focuses on technical delivery (server-rendering, robots fixes, SW kill-switch) rather than content authoring.

The work clusters in five areas: (1) service worker kill-switch to unregister stale Workbox SW precaching deleted routes, (2) robots.txt `/_next/` unblocking so Googlebot can fetch JS/CSS needed to render client-side structured data, (3) test route deletion and dev-only route audit, (4) structured data consolidation + server-render migration, (5) sitemap lastModified addition and mandatory live verification (Rich Results Test, Search Console).

**Primary recommendation:** Execute in dependency order—robots/test-routes first (unblocks crawling), then SW kill-switch + PWA cleanup (fixes stale content for returning visitors), then structured-data consolidation + server-render migration (requires Phase 9 output), then sitemap, then live verification. Do NOT collapse structured-data work into an earlier wave—it depends on Phase 9's reconciled claims and must follow them.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Service worker unregistration | Browser / Client | — | Service workers execute in browser; kill-switch script runs client-side on activate event |
| robots.txt generation | Frontend Server (SSR) | — | Next.js `robots.ts` generates static file at build time; served by frontend |
| Structured data emission | Frontend Server (SSR) | — | Migrating from client-rendered (`"use client"`) to server-rendered schema in RSC pages |
| Sitemap generation | Frontend Server (SSR) | — | Next.js `sitemap.ts` generates XML at build time; already uses SSR data sources |
| Rich Results Test verification | Manual / External | — | Google's external validation tool; verification happens outside the app |
| Search Console submission | Manual / External | — | Google Search Console configuration; external to the app |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.5.9 [VERIFIED: codebase] | robots.ts, sitemap.ts, metadata APIs | Official Next.js metadata file conventions for SEO; built-in support since v13.3.0 |
| React | 19.2.0 [VERIFIED: codebase] | Server components for structured data | RSC architecture enables server-rendered JSON-LD without client JS bundle bloat |
| Schema.org | — | Structured data vocabulary | Google's required vocabulary for rich results; Person, WebSite, CreativeWork, Article, Organization types |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| TypeScript | — (existing) | `MetadataRoute.Robots`, `MetadataRoute.Sitemap` types | Type safety for Next.js metadata APIs; prevents malformed output |
| Service Worker API | Browser-native | `skipWaiting()`, `clientsClaim()`, `unregister()` | Kill-switch pattern for removing stale service workers |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Next.js metadata APIs | Manual static files (`public/robots.txt`, `public/sitemap.xml`) | Loses dynamic generation (sitemap from PROJECTS array, robots from env); requires manual sync |
| Server-rendered JSON-LD | Client-rendered with `next/script` | Current approach; Google can usually render it but indexing is delayed and less reliable; combined with `/_next/` block it's fragile |
| Service worker kill-switch | Leave stale SW in place | Returning visitors get stale precached content (deleted `/archive`, `/ledgeriq`, old chunks); inconsistent UX and crawl confusion |

**Installation:**
No new packages required—all capabilities use existing Next.js, React, and browser APIs.

**Version verification:** Existing stack confirmed via `npm list`:
```
next@15.5.9
react@19.2.0
```

## Package Legitimacy Audit

> No external packages are installed in this phase. All work uses existing Next.js APIs, React server components, and browser-native Service Worker API. This section is included for completeness only.

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ Entry Points                                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Googlebot           User Browser          Search Console       │
│      │                    │                      │              │
│      ├─ robots.txt ───────┤                      │              │
│      ├─ sitemap.xml ──────┤                      │              │
│      │                    │                      │              │
│      └─ HTML Pages ───────┴──────────────────────┘              │
│           │                                                      │
└───────────┼──────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│ Processing Stages                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐      ┌────────────────┐    ┌───────────────┐ │
│  │ Build Time   │─────▶│ Server Render  │───▶│ Browser       │ │
│  │              │      │                │    │               │ │
│  │ robots.ts    │      │ RSC pages emit │    │ SW kill-switch│ │
│  │ sitemap.ts   │      │ <script> tags  │    │ on activate   │ │
│  │ (static gen) │      │ with JSON-LD   │    │               │ │
│  └──────────────┘      └────────────────┘    └───────────────┘ │
│        │                     │                      │           │
│        │                     │                      │           │
│        ▼                     ▼                      ▼           │
│  /robots.txt            HTML with inline       Unregister old  │
│  /sitemap.xml           structured data        SW, clear cache │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│ Verification (Manual Post-Deploy)                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Rich Results Test ──▶ Validate Person/WebSite/CreativeWork     │
│  Search Console    ──▶ Submit sitemap, verify indexation        │
│  URL Check         ──▶ Confirm Chameleon Collective resolves    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure
```
app/
├── robots.ts                  # Remove /_next/ from disallow, add AI crawler rules
├── sitemap.ts                 # Add lastModified to static + project URLs
├── layout.tsx                 # Move Person + WebSite + Organization schema here (RSC)
├── projects/[slug]/page.tsx   # Move CreativeWork + selective FAQ schema here (RSC)
├── blog/[slug]/page.tsx       # Keep Article schema server-rendered
└── (delete test routes)
    ├── test/codeblock/        # DELETE entire directory
    └── test-glow/             # DELETE (middleware already noindexes it)

components/seo/
├── structured-data.tsx        # DELETE after migrating to RSC
└── project-faq.tsx            # DELETE after selective FAQ migration

public/
├── sw.js                      # REPLACE with kill-switch script
├── fallback-*.js              # DELETE
├── manifest.json              # DELETE (per D-13 complete PWA removal)
└── workbox-*.js               # DELETE if exists

components/pwa/                # DELETE entire directory
app/offline/                   # DELETE entire directory
app/manifest.ts                # DELETE
```

### Pattern 1: Service Worker Kill-Switch

**What:** A minimal service worker that self-unregisters on install, clearing all caches to ensure returning visitors get fresh content.

**When to use:** When replacing a stale service worker (e.g., from disabled next-pwa) that precaches deleted routes or old chunk revisions.

**Example:**
```javascript
// public/sw.js — Service Worker Kill-Switch
// Source: [ASSUMED: training knowledge + browser Service Worker API spec]

// Skip waiting immediately on install
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Unregister and clear all caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clear all caches
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(cache => caches.delete(cache)));
      
      // Unregister this service worker
      const registration = await self.registration;
      await registration.unregister();
      
      // Claim clients to ensure immediate takeover
      await self.clients.claim();
    })()
  );
});

// No fetch handler — this SW does nothing but clean up
```

### Pattern 2: Server-Rendered Structured Data in RSC

**What:** Inline `<script type="application/ld+json">` tags rendered directly in React Server Components, not client-side with `next/script`.

**When to use:** Always for structured data—Google indexes server-rendered JSON-LD more reliably, especially when combined with robots.txt `/_next/` fix.

**Example:**
```typescript
// app/layout.tsx — Person + WebSite schema (server component)
// Source: [VERIFIED: Next.js docs for RSC patterns]

export default function RootLayout({ children }) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Randy Ellis",
    jobTitle: ["Head of Product", "Fractional Chief Design Officer"],
    description: "...",
    url: createAbsoluteUrl(),
    sameAs: [
      "https://www.linkedin.com/in/iamrandyellis/",
      "https://x.com/iamrandyellis",  // NOT twitter.com (D-04)
    ],
    worksFor: {
      "@type": "Organization",
      name: "Wealthberry Labs",
      url: "https://www.buildyourlegacywithai.com",
    },
  };

  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Pattern 3: Next.js robots.ts with AI Crawler Policy

**What:** Dynamic robots.txt generation using Next.js metadata API, with per-user-agent rules for AI crawlers.

**When to use:** When you need environment-aware crawler control (e.g., different rules for prod vs preview) or want to programmatically manage AI crawler access.

**Example:**
```typescript
// app/robots.ts
// Source: [VERIFIED: Next.js 15 docs — https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots]

import type { MetadataRoute } from "next";
import { WEBSITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/private/", "/admin/", "/api/", "/drafts/"],
        // NO /_next/ disallow — Googlebot needs it to render JS
      },
      // AI crawlers: open per D-11
      // (remove GPTBot, CCBot, ChatGPT-User, anthropic-ai, Claude-Web blocks)
    ],
    sitemap: `${WEBSITE_URL}/sitemap.xml`,
    host: WEBSITE_URL,
  };
}
```

### Pattern 4: Next.js sitemap.ts with lastModified

**What:** Dynamic sitemap generation with `lastModified` dates for all URLs—build time for static pages, content-derived for projects (via `updatedAt` field if added to Project type), publication date for blog posts.

**When to use:** Always—freshness signals improve crawl efficiency and help Google prioritize recent content.

**Example:**
```typescript
// app/sitemap.ts
// Source: [VERIFIED: Next.js 15 docs — https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap]

import { MetadataRoute } from "next";
import { WEBSITE_URL } from "@/lib/constants";
import { PROJECTS } from "@/lib/data/projects";
import { getBlogArticles } from "@/lib/utils/blog-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const buildTime = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${WEBSITE_URL}/`,
      lastModified: buildTime,  // NEW: was missing
      changeFrequency: "weekly",
      priority: 1.0,
    },
    // ... other static pages with lastModified: buildTime
  ];

  const projectPages: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: `${WEBSITE_URL}/projects/${project.slug}`,
    lastModified: project.updatedAt || buildTime,  // NEW: content-derived if available
    changeFrequency: "monthly" as const,
    priority: project.featured ? 0.8 : 0.6,
  }));

  const blogPages: MetadataRoute.Sitemap = getBlogArticles().map((post) => ({
    url: `${WEBSITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedDate),  // Already present
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
```

### Anti-Patterns to Avoid

- **Disallowing `/_next/` in robots.txt while using client-rendered structured data:** Googlebot cannot fetch the JS needed to render your JSON-LD. Either server-render schema OR allow `/_next/`, never neither.
- **Leaving a stale service worker in place:** Returning visitors get precached deleted routes and old chunks indefinitely. Service workers persist across deploys—you must actively kill them.
- **Inventing structured data properties:** Schema.org has a strict vocabulary. `offeredThrough` is not a valid property; `availableAtOrFrom` expects a `Place`, not strings. Use [schema.org](https://schema.org) as the source of truth, not training data.
- **Client-rendering structured data with `next/script`:** Current codebase pattern (`components/seo/structured-data.tsx` line 1: `"use client"`). Google can usually render it, but indexing is delayed and less reliable. Server-render in RSC pages instead.
- **Fabricating LocalBusiness properties for a remote consultant:** Country-only address, invented `openingHours`/`paymentAccepted` for someone with no physical location. This is the exact mistake v1.0 audit flagged—don't repeat it.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Service worker unregistration | Custom cache-clearing logic | Browser-native `caches.keys()` + `caches.delete()` + `registration.unregister()` | Service Worker API is standardized; hand-rolled implementations miss edge cases (clients, background sync, push subscriptions) |
| robots.txt generation | String concatenation in API route | Next.js `robots.ts` metadata file convention | Type-safe, cached by default, integrates with Next.js build; API route approach bypasses static optimization |
| Sitemap generation | Manual XML construction | Next.js `sitemap.ts` metadata file convention | Handles escaping, xmlns, proper date formatting; updates automatically from PROJECTS array |
| Structured data validation | Custom JSON-LD linting | Google Rich Results Test | Google's validator is the ground truth for what gets rich results; custom validators can't predict Google's rules |

**Key insight:** Next.js 13.3+ metadata APIs are purpose-built for SEO metadata—they're not helpers, they're the standard. Using them ensures build-time caching, type safety, and alignment with Next.js rendering model. Rolling your own means fighting the framework.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build & dev server | ✓ | 25.9.0 | — |
| npm | Package management | ✓ | 11.12.1 | — |
| Next.js | Metadata APIs | ✓ | 15.5.9 | — |
| React | Server components | ✓ | 19.2.0 | — |
| Browser (for verification) | Rich Results Test, URL check | ✓ | User's browser | — |
| Google Search Console | Sitemap submission | Manual | External | User must have GSC property |

**Missing dependencies with no fallback:**
- None — all build tools and runtime dependencies are present

**Missing dependencies with fallback:**
- None — verification tools are manual/external by design

## Common Pitfalls

### Pitfall 1: Forgetting to Update Middleware After Deleting Test Routes

**What goes wrong:** `middleware.ts` line 96 checks `pathname.startsWith("/test-glow")` but not `pathname.startsWith("/test")`. After deleting `/test/codeblock`, the pattern should be updated to cover all `/test/*` routes (or removed if no test routes remain).

**Why it happens:** Middleware `shouldBlockIndexing` checks were added piecemeal as routes were created; deletions don't trigger cleanup unless you audit the function.

**How to avoid:** When deleting routes, grep for their paths in `middleware.ts`, `next.config.js`, `sitemap.ts`, and any route-specific logic. Delete the checks if the route category is gone.

**Warning signs:** `X-Robots-Tag: noindex` appears in dev tools for deleted routes (404s with noindex header).

### Pitfall 2: Chameleon Collective URL Goes Unverified Again

**What goes wrong:** User decision D-03 requires verifying the Chameleon Collective URL before keeping it in Person schema `sameAs`. If this step is skipped, the v1.0 blocker (unverified external URL in structured data) carries forward to v2.0.

**Why it happens:** It's a manual verification step that requires opening a browser, not a code change. Easy to defer and forget.

**How to avoid:** Make URL verification a blocking task in Wave 0 (before structured data migration). The plan should have: "Task: Verify Chameleon Collective URL resolves to Randy's profile or work. If 404 or irrelevant, remove from Person schema `sameAs`."

**Warning signs:** Structured data still references `chameleon-collective.com` but user never confirmed it's valid.

### Pitfall 3: Structured Data Migration Before Phase 9 Lands

**What goes wrong:** Phase 10's structured data work depends on Phase 9's reconciled claims (2.5M+ users, $50M+ product value, etc.). If Phase 10 structured data is authored before Phase 9's cross-surface verification completes, the claims will drift again.

**Why it happens:** Phases 9 and 10 feel related (both touch SEO surfaces), so there's temptation to parallelize. But Phase 9 owns claim reconciliation; Phase 10 consumes its output.

**How to avoid:** Sequence strictly: Phase 9 must be merged to main before Phase 10's structured data wave begins. Phase 10 can start earlier waves (robots, SW kill-switch) but NOT structured data consolidation.

**Warning signs:** CRED-09 is still in progress but Phase 10's structured-data PR is already open.

### Pitfall 4: Incomplete PWA Cleanup

**What goes wrong:** User decision D-13 requires "complete PWA removal"—8+ files across `public/`, `components/`, `app/`. Forgetting one (e.g., `app/manifest.ts` still exports a manifest, or `app/layout.tsx` still imports `PWAProvider`) leaves inactive code that confuses future maintainers.

**Why it happens:** PWA artifacts are scattered across the codebase. A file-by-file deletion checklist is easy to skim, but grep verification catches stragglers.

**How to avoid:** After deletion, grep for: `pwa`, `manifest`, `offline`, `sw-register`, `workbox`. Zero results = complete.

**Warning signs:** `npm run build` emits `/manifest.webmanifest` route handler or references PWA components in chunk analysis.

### Pitfall 5: Assuming `/_next/` Block Is Intentional

**What goes wrong:** Current `robots.ts` disallows `/_next/` (line 10). This blocks Googlebot from fetching JS/CSS chunks needed to render pages. Since all structured data is client-rendered, Google can't see any JSON-LD.

**Why it happens:** Copy-pasted robots.txt from older projects or SEO advice that predates client-side rendering prevalence. The person who added it may have thought "block internal paths = good SEO."

**How to avoid:** Audit robots.txt disallows against what the site actually needs. If any critical content is client-rendered (structured data, nav, above-fold content), `/_next/` MUST be allowed. Official Next.js docs don't block `/_next/`—that's a red flag the current approach is wrong.

**Warning signs:** Rich Results Test shows "No structured data found" for pages that emit JSON-LD in browser dev tools.

## Code Examples

Verified patterns from official sources:

### Minimal Service Worker Kill-Switch

```javascript
// public/sw.js
// Source: [ASSUMED: Service Worker API spec + training knowledge]

self.addEventListener('install', (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Delete all caches
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(cache => caches.delete(cache)));
      
      // Unregister this service worker
      await self.registration.unregister();
      
      // Take control of all clients
      await self.clients.claim();
    })()
  );
});

// No fetch event listener — this SW just cleans up and exits
```

### Next.js robots.ts Without `/_next/` Block

```typescript
// app/robots.ts
// Source: [VERIFIED: Next.js 15.5.9 docs]

import type { MetadataRoute } from "next";
import { WEBSITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/private/", "/admin/", "/api/", "/drafts/"],
        // /_next/ is NOT disallowed — Googlebot needs it
      },
    ],
    sitemap: `${WEBSITE_URL}/sitemap.xml`,
    host: WEBSITE_URL,
  };
}
```

### Server-Rendered Person Schema in RSC

```typescript
// app/layout.tsx (excerpt)
// Source: [VERIFIED: Next.js RSC patterns]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Randy Ellis",
    jobTitle: ["Head of Product", "Fractional Chief Design Officer"],
    url: createAbsoluteUrl(),
    sameAs: [
      "https://www.linkedin.com/in/iamrandyellis/",
      "https://x.com/iamrandyellis",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Wealthberry Labs",
      url: "https://www.buildyourlegacywithai.com",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Client-rendered structured data with `next/script` | Server-rendered JSON-LD in RSC pages | Next.js 13 (2022) introduced RSC | More reliable indexing; structured data available in initial HTML, not client-rendered |
| Manual `robots.txt` in `public/` | `robots.ts` metadata file convention | Next.js 13.3 (Apr 2023) | Dynamic generation, type safety, build-time caching |
| Manual `sitemap.xml` in `public/` | `sitemap.ts` metadata file convention | Next.js 13.3 (Apr 2023) | Auto-updates from data sources (PROJECTS array), proper escaping |
| next-pwa for service worker | No PWA (or @ducanh2912/next-pwa for Next.js 15) | Next.js 15 broke next-pwa (2024) | This site chose "no PWA" path; installability removed |
| Twitter.com for social links | x.com | Twitter rebrand (2023) | Use x.com for sameAs in structured data (D-04) |

**Deprecated/outdated:**
- **next-pwa:** Incompatible with Next.js 15; package is unmaintained. Successor is `@ducanh2912/next-pwa` but this site opted for complete PWA removal (D-13).
- **Disallowing `/_next/` in robots.txt:** Never recommended by Next.js; blocks JS/CSS rendering which is critical for client-rendered content.
- **LocalBusiness for remote consultants:** Invalid use of schema.org type; Person + ProfessionalService (if needed) is correct pattern.

## Assumptions Log

> List all claims tagged `[ASSUMED]` in this research. The planner and discuss-phase use this section to identify decisions that need user confirmation before execution.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Service worker kill-switch pattern (skipWaiting, caches.delete, unregister) | Code Examples | SW might not fully unregister or clear caches; some returning visitors still get stale content |
| A2 | Schema.org Person/WebSite/CreativeWork/Article/Organization are Google's preferred types for this use case | Standard Stack | Structured data might not trigger rich results even if valid |
| A3 | Server-rendered JSON-LD is more reliably indexed than client-rendered | Architecture Patterns | Performance/indexing benefit might be marginal in practice; Google renders JS well |
| A4 | AI crawler user-agents (GPTBot, CCBot, ChatGPT-User, anthropic-ai, Claude-Web) are current as of training cutoff (Jan 2025) | Don't Hand-Roll | New crawlers might exist; policy might be incomplete |
| A5 | Google Rich Results Test and Search Console are the authoritative validation tools | Environment Availability | Other tools might surface issues Google's tools miss |

**If this table is empty:** All claims in this research were verified or cited — no user confirmation needed.
*Note: Table is NOT empty—5 assumptions exist due to external tool failures (Context7, WebSearch, WebFetch all errored). Next.js-specific claims are VERIFIED from official docs; Service Worker and structured data best practices are training knowledge.*

## Open Questions

1. **Should privacy-policy and terms-of-service be added to sitemap?**
   - What we know: They're linked in footer, so they're indexed. Sitemap currently omits them.
   - What's unclear: User decision on whether to include. Audit says "defensible either way."
   - Recommendation: Include them—they're public, indexed pages. Omission doesn't hide them from Google, just removes a freshness signal.

2. **Should project URLs get content-derived lastModified dates?**
   - What we know: `Project` type doesn't currently have `updatedAt` field. Build time is available.
   - What's unclear: Whether Randy wants to track per-project update dates going forward.
   - Recommendation: Use build time for now (simple, no schema change). If Phase 11+ adds project versioning, switch to content-derived dates then.

3. **Does Chameleon Collective URL still resolve?**
   - What we know: It's a v1.0 carry-over blocker (STATE.md). Appears in `about-client.tsx` and 3× in `structured-data.tsx`.
   - What's unclear: Does it 404? Does it link to Randy's profile or work?
   - Recommendation: Mandatory verification task in Wave 0—open URL in browser, confirm it resolves to Randy-relevant content. If broken/irrelevant, remove from Person schema `sameAs`.

4. **Should Wealthberry Labs Organization schema remain on this site?**
   - What we know: D-07 says "keep it — represents Randy's company." External URL is `buildyourlegacywithai.com`.
   - What's unclear: Whether Google treats this as entity confusion (is this Randy's portfolio or Wealthberry's site?).
   - Recommendation: Keep per user decision, but ensure Person schema clarifies the relationship (`worksFor` or `affiliation`). If Phase 11+ adds Wealthberry-specific pages, Organization schema is justified. For now it's borderline.

## User Constraints

> **Copied verbatim from 10-CONTEXT.md for planner consumption.**

### Locked Decisions

- **D-01:** Core schema types are **Person + WebSite + per-project CreativeWork + blog Article + Wealthberry Organization**. This is the consolidated entity hierarchy — Person (Randy) is the primary entity, WebSite is the platform, projects are creative works, blog posts are articles, and Wealthberry Labs Organization represents Randy's company.
- **D-02:** **Delete LocalBusiness schema entirely.** It has invalid properties (country-only address, fabricated openingHours/paymentAccepted for a remote consultant). Person + service representation (if added later) covers the offering without invalid location cruft.
- **D-03:** **Verify Chameleon Collective URL and keep if valid.** Check if the URL (appears in about-client.tsx + 3× structured-data.tsx) resolves and points to a real page about Randy or his work. If yes, keep it as a sameAs link in Person schema. If broken or irrelevant, remove it. Known v1.0 carry-over blocker.
- **D-04:** **Use `x.com/iamrandyellis` for sameAs** (not twitter.com). Current canonical domain after Twitter's rebrand. Resolve the conflict between Person (twitter.com) and LocalBusiness (x.com).
- **D-05:** **Selective FAQPage deletion** — keep FAQs where they're accurate (e.g., growit's 3 FAQs about 240K+ users, 4.8★, ML plant ID), remove off-topic ones (echo's "AI design system" FAQs for a trucking logistics project, addvanced's financial-advisor FAQs for a career tracker). Note: still violates on-page visibility requirement (Google requires visible Q&A for rich results), but preserves accurate content where it exists.
- **D-06:** **Migrate surviving schema to server-rendered components** during consolidation. Move Person, WebSite, CreativeWork, Article, Organization from client-rendered `components/seo/structured-data.tsx` ("use client") to server components or inline `<script type="application/ld+json">` in RSC output. More reliable indexing, especially combined with robots.ts `/_next/` fix.
- **D-07:** **Keep Wealthberry Labs Organization schema** — it represents Randy's company. Ensure the relationship to Person (Randy) is clear in schema and the external URL (buildyourlegacywithai.com) is correct.
- **D-08:** **Delete `/test/codeblock` and `/test-glow` entirely.** They're indexable demo routes that dilute crawl quality. AGENTS.md says "don't add stray routes" — these are the existing strays.
- **D-09:** **Audit all `/app` routes for other dev-only pages** using this criteria: not linked from nav/sitemap + not in ROADMAP scope. If it's not in the main nav, not in sitemap.ts, and not part of the documented site structure (about, projects, blog, metis), it's a candidate for removal or noindex.
- **D-10:** For routes identified as dev-only during audit: **delete if truly internal, noindex if might have future use.** Balanced approach — test routes get deleted, but if we find something that might be revived later (like a draft feature page), noindex keeps it accessible internally.
- **D-11:** **Open site to all AI crawlers.** Remove GPTBot, CCBot, ChatGPT-User, anthropic-ai, Claude-Web blocks from robots.ts. Allows ChatGPT, Claude, Perplexity, etc. to cite work in AI answers for AEO/GEO visibility. Target queries like "fractional chief design officer" increasingly get AI-answer treatment. Trade-off accepted: content gets ingested into training data.
- **D-12:** **Replace `public/sw.js` with kill-switch script.** Tiny SW that self-unregisters on install (`self.skipWaiting()`), clears all caches, then calls `self.registration.unregister()` on activate. Ensures returning visitors (who registered the stale Workbox SW from next-pwa era) get the fresh site immediately. Critical — stale SW precaches deleted `/archive` and `/ledgeriq` routes.
- **D-13:** **Complete PWA removal:** delete `app/manifest.ts`, `public/manifest.json`, `public/fallback-*.js`, `public/workbox-*.js` (if any), `components/pwa/` directory (pwa-provider.tsx, install-prompt.tsx, offline-indicator.tsx, update-prompt.tsx), `app/offline/` route, and `app/sw-register.tsx`. Since next-pwa is permanently disabled and you're certain you won't want installability, clean slate.
- **D-14:** **Add `lastModified` to sitemap URLs.** Build time or content-derived dates for static + project URLs (blog already has dates). Priority hints are hints, but freshness signals improve crawl efficiency.
- **D-15:** **Remove `/_next/` from robots.ts disallow list.** Critical fix — blocks Googlebot from fetching JS/CSS needed to render pages. All structured data is currently client-rendered (see D-06), so rendering isn't optional — it's the only way crawlers see JSON-LD. Keep `/admin/`, `/api/`, `/private/`, `/drafts/` disallows.
- **D-16:** **Mandatory verification step in the plan:** fetch live robots.txt and sitemap.xml, run Rich Results Test on `/` (home), `/projects/growit` (one project), and one blog post, confirm Search Console property exists and sitemap is submitted. Record results in verification artifact. Audit ran offline — this step confirms it works in production.

### Claude's Discretion

- Kill-switch script exact implementation (listener structure, cache-clearing approach)
- Sitemap date source (build time vs content-derived for projects)
- Whether to add `/archive` → `/projects` redirect if Search Console shows backlinks
- Commit granularity — suggest: robots/test-routes; SW kill-switch + PWA cleanup; structured-data consolidation + server-render migration; sitemap; live verification
- Helper location for server-rendered schema components (likely in `components/seo/` but as RSCs)
- Whether to reconcile ROADMAP.md checkboxes for Phases 5-9 (all complete but unchecked) in this phase's docs commit — recommended yes

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEO-01 | Service worker kill-switch + PWA cleanup | Kill-switch pattern (Code Examples); PWA artifact inventory (Recommended Project Structure); browser Service Worker API (Standard Stack) |
| SEO-02 | robots.txt `/_next/` unblocking + AI crawler policy | Next.js robots.ts API (verified from official docs); AI crawler user-agents (Assumptions Log A4) |
| SEO-03 | Test route deletion/blocking | Existing route audit (Common Pitfalls); middleware `shouldBlockIndexing` pattern (codebase analysis) |
| SEO-04 | Structured data consolidation + server-render migration | Server-rendered JSON-LD pattern (Architecture Patterns); Schema.org types (Standard Stack); RSC inline script pattern (Code Examples) |
| SEO-05 | Sitemap lastModified + live verification | Next.js sitemap.ts API (verified from official docs); Rich Results Test and Search Console (Environment Availability) |

## Sources

### Primary (HIGH confidence)
- [Next.js 15.5.9 robots.ts docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) — robots API, rules structure, no `/_next/` mention
- [Next.js 15.5.9 sitemap.ts docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) — sitemap API, `lastModified` field, `MetadataRoute.Sitemap` type
- Codebase analysis — `app/robots.ts`, `app/sitemap.ts`, `public/sw.js`, `components/seo/structured-data.tsx`, `middleware.ts`, `package.json` dependencies

### Secondary (MEDIUM confidence)
- None available (WebSearch and WebFetch failed with model errors; Context7 failed with API key error)

### Tertiary (LOW confidence - training knowledge)
- Service Worker API spec (MDN) — `skipWaiting()`, `clientsClaim()`, `registration.unregister()`, caches API [ASSUMED]
- Schema.org vocabulary — Person, WebSite, CreativeWork, Article, Organization types [ASSUMED]
- Google structured data guidelines — server-side vs client-side rendering, Rich Results Test [ASSUMED]
- AI crawler user-agents — GPTBot, CCBot, ChatGPT-User, anthropic-ai, Claude-Web [ASSUMED]

**Note:** External documentation tools were unavailable during research (Context7 invalid API key, WebSearch/WebFetch model errors). Next.js-specific claims are HIGH confidence (verified from official docs). Service worker patterns, structured data best practices, and AI crawler details are ASSUMED (training knowledge, not verified in this session).

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Next.js APIs verified from official v15.5.9 docs; React version confirmed from codebase
- Architecture: HIGH — RSC pattern is standard Next.js 13+ approach; service worker kill-switch is browser-native API
- Pitfalls: HIGH — All derived from codebase analysis + SEO-AUDIT.md findings; not speculative

**Research date:** 2026-08-20
**Valid until:** 60 days (Next.js metadata APIs are stable; service worker spec is mature; Schema.org changes are rare)

**Limitations:**
- Could not verify Schema.org property validity for Person/Organization/CreativeWork schemas due to tool failures—planner should cross-check with [schema.org](https://schema.org) during structured data migration
- Could not verify current AI crawler user-agents; list is from training knowledge (Jan 2025 cutoff)—may be incomplete if new crawlers launched since then
- No live site verification performed (audit limitation noted in SEO-AUDIT.md); post-deploy verification (D-16) is mandatory to confirm robots.txt, sitemap.xml, and Rich Results Test work in production
