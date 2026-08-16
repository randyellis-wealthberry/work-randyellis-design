# SEO Audit — work.randyellis.design

**Audited:** 2026-08-16 (codebase-level; live-site fetches unavailable from this environment)
**Auditor:** seo-audit skill → GSD routing
**Scope:** Technical SEO (crawlability, indexation, canonicals, headers) + on-page (metadata, H1s, OG) + structured data. Content quality/E-E-A-T largely covered by v2.0 CRED-* work and intentionally out of scope here.

## Executive Summary

Overall health: **moderate — solid fundamentals undermined by structured-data sprawl and a stale service worker.**

Canonicals, per-page metadata, H1 coverage, HTTPS/HSTS, and preview-host noindexing are all done correctly. The problems cluster in three places:

1. **Stale PWA artifact (`public/sw.js`)** actively precaches deleted routes and old chunks for any returning visitor — the single most dangerous file on the site.
2. **Structured data is entity-chaos**: 6+ overlapping schema types, an invalid LocalBusiness, invented properties, conflicting `sameAs`, and hardcoded unverified URLs (Chameleon Collective). This is also the outstanding CRED-09 surface.
3. **Crawler rendering friction**: robots.ts blocks `/_next/` while ALL JSON-LD is client-rendered — Google must render JS to see any structured data, and we're impeding that.

Top priorities: kill the service worker, fix robots `/_next/`, noindex `/test/codeblock`, then the structured-data consolidation (sequenced with/after CRED-09).

### Limitation

This audit ran offline against source. The plan MUST include a live verification step: fetch robots.txt/sitemap.xml, Rich Results Test on `/`, `/projects/growit`, one blog post; confirm Search Console property exists and sitemap is submitted.

---

## Technical SEO Findings

### T-01 — Stale service worker precaching dead routes
- **Issue:** `public/sw.js` is a compiled workbox SW from the next-pwa era. It precaches `/archive` and `/ledgeriq` (both deleted/redirected), ~50 stale hashed chunks with old revisions, and registers StaleWhileRevalidate for `.js`/`.css`. It calls `skipWaiting()` + `clientsClaim()`.
- **Impact:** HIGH. Any visitor who registered it before PWA was disabled gets stale content (including the removed `/archive` page) and stale JS. Since next-pwa is disabled, nothing ever updates or kills it. Inconsistent content for users; potential crawl confusion.
- **Evidence:** `public/sw.js` (precache manifest lists `app/archive/page-*.js`, `app/ledgeriq/page-*.js`, old chunk revisions); `next.config.js` has next-pwa commented out; `components/pwa/pwa-provider.tsx` does not register any SW.
- **Fix:** Replace `public/sw.js` with a tiny kill-switch SW (`self.addEventListener("install", () => self.skipWaiting())` + unregister all caches + `self.registration.unregister()` on activate). Keep `public/fallback-*.js` removal in the same pass. Verify no other SW registration exists.
- **Priority:** 1 (Critical)

### T-02 — robots.txt disallows `/_next/`
- **Issue:** `app/robots.ts` disallows `/_next/` for `*`.
- **Impact:** MEDIUM-HIGH. Blocks Googlebot from fetching the JS/CSS needed to render pages. Every structured-data block on this site is client-rendered (see T-04), so rendering isn't optional — it's the only way crawlers see our JSON-LD.
- **Evidence:** `app/robots.ts:10`.
- **Fix:** Remove `/_next/` from the disallow list (keep `/admin/`, `/api/`, `/private/`, `/drafts/`). Next.js itself does not block `/_next/` by default for exactly this reason.
- **Priority:** 1 (Critical)

### T-03 — `/test/codeblock` is indexable
- **Issue:** `middleware.ts` `shouldBlockIndexing` covers `/admin`, `/api`, `/test-glow`, `/offline` — but NOT `/test`. `app/test/codeblock/page.tsx` has no noindex metadata.
- **Impact:** MEDIUM. A demo route can enter the index and dilute crawl quality.
- **Evidence:** `middleware.ts:92-99`, `app/test/codeblock/` exists, no metadata export.
- **Fix:** Change `pathname.startsWith("/test-glow")` → `pathname.startsWith("/test")` (covers both), or delete both test routes outright (AGENTS.md says don't add more stray routes — these are the existing strays).
- **Priority:** 2 (High)

### T-04 — All JSON-LD is client-rendered
- **Issue:** `components/seo/structured-data.tsx` is `"use client"` and emits schema via `next/script` on the client.
- **Impact:** MEDIUM. Google can usually render it, but indexing of structured data is delayed and less reliable for other crawlers; combined with T-02 it's fragile.
- **Evidence:** file header line 1.
- **Fix:** During structured-data consolidation (T-06/CRED-09), move surviving schemas to server components (or inline `<script type="application/ld+json">` in RSC output). Also delete `LocalBusinessStructuredData`'s orphaned `useEffect` (hook sits in a component that may never mount — dead analytics code).
- **Priority:** 3

### T-05 — Sitemap gaps (minor)
- **Issue:** No `lastModified` on static + project URLs (only blog has dates). `/privacy-policy` / `/terms-of-service` absent (defensible either way).
- **Impact:** LOW. Priority hints are hints; freshness signals missing.
- **Evidence:** `app/sitemap.ts:8-41`.
- **Fix:** Add `lastModified` (build time or content-derived for projects). Decide privacy/terms inclusion (recommend include — they're indexed anyway via footer links).
- **Priority:** 4

### T-06 — Structured-data entity chaos and validity errors
- **Issue:** Site emits overlapping/conflicting entities: `Person` + `Website` (layout, every page), `Organization` (Wealthberry Labs, external URL), `LocalBusiness`, two `ProfessionalService`s, `FAQPage`, `CreativeWork`, `Article`. Specific defects:
  - `LocalBusiness`: country-only `PostalAddress` (invalid — needs locality/street or shouldn't be LocalBusiness), `priceRange: "$$$"`, `openingHoursSpecification`, `paymentAccepted` — fabricated-signaling junk for a remote consultant.
  - `FractionalCDOServiceStructuredData`: `offeredThrough` is not a schema.org property; `availableAtOrFrom` expects a `Place`, gets strings.
  - `sameAs` conflicts: `twitter.com/iamrandyellis` (Person) vs `x.com/iamrandyellis` (LocalBusiness).
  - Hardcoded `https://www.buildyourlegacywithai.com` (Wealthberry Labs) and `Chameleon Collective` references — the latter is a **known unverified v1.0 blocker** (STATE.md).
  - Claims duplicated across surfaces: "2.5M+ users", "$50M+ product value", "240K+ users", "25K+ cities" appear in metadata description, Person schema, FAQ schema — the exact CRED-09 reconciliation surface.
- **Impact:** HIGH (entity clarity is how Google decides what to rank; invalid/fabricated markup risks rich-result penalties and directly contradicts v1.0's "remove fabricated schema" decision).
- **Evidence:** `components/seo/structured-data.tsx` (whole file), `lib/metadata.ts:24-25`.
- **Fix:** Consolidate to: `Person` (primary entity, on all pages), `WebSite`, per-project `CreativeWork`, blog `Article`, one service representation (`ProfessionalService` or `ProfilePage`-adjacent — decide). Delete `Organization`(Wealthberry) unless Randy confirms it belongs on this site, delete `LocalBusiness`, fix `sameAs` to x.com, resolve Chameleon Collective URL (Randy input), align every claim with CRED-09 outcome.
- **Priority:** 1 (Critical) — but sequence AFTER/WITH Phase 9 CRED-09, which owns claim reconciliation across metadata/OG/JSON-LD.

### T-07 — AI-crawler blocks: AEO contradiction (decision needed)
- **Issue:** robots.ts blocks GPTBot, CCBot, ChatGPT-User, anthropic-ai, Claude-Web.
- **Impact:** MEDIUM (strategic). Blocks answer-engine citation (AEO/GEO) while the site's target queries ("fractional chief design officer") increasingly get AI-answer treatment. Coverage is also inconsistent (doesn't block Google-Extended, Bytespider, PerplexityBot).
- **Evidence:** `app/robots.ts:13-31`.
- **Fix:** Decision for Randy: keep blocks (content protection) vs open to AI crawlers (visibility). Either way, make the list consistent. Don't fold into code changes silently.
- **Priority:** 3 (decision)

### Verified good (no action)
- Canonicals on every audited route (`lib/metadata.ts`, bespoke pages, `[slug]`); `metadataBase` pinned to prod domain; env-based base URL never emits localhost in prod (`lib/env.ts:30-32`).
- H1 present on all main pages (homepage sr-only, projects/blog/metis via `as="h1"`, bespoke via `motion.h1`).
- `X-Robots-Tag: noindex` on non-prod hosts + admin/api/test-glow/offline (`middleware.ts:86-113`).
- All 8 sitemap project URLs resolve to real routes (5 static + 3 via `[slug]`; ledgeriq still in `PROJECTS`).
- HTTPS + HSTS preload, immutable static caching, clean trailingSlash/cleanUrls consistency.
- Blog posts: canonical + `ArticleStructuredData` + OG hero images.

---

## Prioritized Action Plan

1. **Critical:** T-01 kill-switch service worker · T-02 robots `/_next/` · T-03 noindex `/test`
2. **High:** T-06 structured-data consolidation — sequence with/after Phase 9 CRED-09 remainder (metadata/OG/JSON-LD reconciliation) since they touch the same strings; includes Chameleon Collective + Wealthberry entity decisions (Randy input) and T-04 server-render migration
3. **Quick wins:** T-05 sitemap lastModified · `sameAs` x.com normalization · delete dead `useEffect` · add `/archive` → `/projects` redirect if Search Console shows backlinks
4. **Decisions:** T-07 AI-crawler policy
5. **Verification (live, post-deploy):** robots.txt + sitemap.xml fetch, Rich Results Test (home, one project, one blog post), Search Console property/sitemap submission, confirm returning-visitor SW unregistration

*Audit for: GSD SEO phase planning (v2.0)*
*Audited: 2026-08-16*
