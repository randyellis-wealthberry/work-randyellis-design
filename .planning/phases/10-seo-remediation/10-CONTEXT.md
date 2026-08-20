# Phase 10: SEO Remediation - Context

**Gathered:** 2026-08-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Close every finding from `.planning/research/SEO-AUDIT.md` (2026-08-16) so the site is fully crawlable, consistently indexed, and emits one coherent entity story in structured data — built on top of Phase 9's reconciled claims, not duplicating that work.

**Requirements:** SEO-01..SEO-05 (to be derived from audit T-01..T-07)

**In scope:** Stale service worker kill-switch or removal, robots.txt `/_next/` unblocking, `/test` route cleanup + dev-only route audit, structured-data consolidation (server-rendered Person/WebSite/CreativeWork/Article/Organization, delete LocalBusiness, selective FAQ cleanup), sitemap lastModified, live post-deploy verification (robots.txt fetch, Rich Results Test, Search Console submission).

**Out of scope:** Content quality/E-E-A-T improvements (covered by CRED-* work), new SEO features beyond audit remediation, visual/UX polish, general dead-code hunt outside PWA/test artifacts.

</domain>

<decisions>
## Implementation Decisions

### Structured Data Entity Strategy

- **D-01:** Core schema types are **Person + WebSite + per-project CreativeWork + blog Article + Wealthberry Organization**. This is the consolidated entity hierarchy — Person (Randy) is the primary entity, WebSite is the platform, projects are creative works, blog posts are articles, and Wealthberry Labs Organization represents Randy's company.
- **D-02:** **Delete LocalBusiness schema entirely.** It has invalid properties (country-only address, fabricated openingHours/paymentAccepted for a remote consultant). Person + service representation (if added later) covers the offering without invalid location cruft.
- **D-03:** **Verify Chameleon Collective URL and keep if valid.** Check if the URL (appears in about-client.tsx + 3× structured-data.tsx) resolves and points to a real page about Randy or his work. If yes, keep it as a sameAs link in Person schema. If broken or irrelevant, remove it. Known v1.0 carry-over blocker.
- **D-04:** **Use `x.com/iamrandyellis` for sameAs** (not twitter.com). Current canonical domain after Twitter's rebrand. Resolve the conflict between Person (twitter.com) and LocalBusiness (x.com).
- **D-05:** **Selective FAQPage deletion** — keep FAQs where they're accurate (e.g., growit's 3 FAQs about 240K+ users, 4.8★, ML plant ID), remove off-topic ones (echo's "AI design system" FAQs for a trucking logistics project, addvanced's financial-advisor FAQs for a career tracker). Note: still violates on-page visibility requirement (Google requires visible Q&A for rich results), but preserves accurate content where it exists.
- **D-06:** **Migrate surviving schema to server-rendered components** during consolidation. Move Person, WebSite, CreativeWork, Article, Organization from client-rendered `components/seo/structured-data.tsx` ("use client") to server components or inline `<script type="application/ld+json">` in RSC output. More reliable indexing, especially combined with robots.ts `/_next/` fix.
- **D-07:** **Keep Wealthberry Labs Organization schema** — it represents Randy's company. Ensure the relationship to Person (Randy) is clear in schema and the external URL (buildyourlegacywithai.com) is correct.

### Test Route Handling

- **D-08:** **Delete `/test/codeblock` and `/test-glow` entirely.** They're indexable demo routes that dilute crawl quality. AGENTS.md says "don't add stray routes" — these are the existing strays.
- **D-09:** **Audit all `/app` routes for other dev-only pages** using this criteria: not linked from nav/sitemap + not in ROADMAP scope. If it's not in the main nav, not in sitemap.ts, and not part of the documented site structure (about, projects, blog, metis), it's a candidate for removal or noindex.
- **D-10:** For routes identified as dev-only during audit: **delete if truly internal, noindex if might have future use.** Balanced approach — test routes get deleted, but if we find something that might be revived later (like a draft feature page), noindex keeps it accessible internally.

### AI Crawler Policy

- **D-11:** **Open site to all AI crawlers.** Remove GPTBot, CCBot, ChatGPT-User, anthropic-ai, Claude-Web blocks from robots.ts. Allows ChatGPT, Claude, Perplexity, etc. to cite work in AI answers for AEO/GEO visibility. Target queries like "fractional chief design officer" increasingly get AI-answer treatment. Trade-off accepted: content gets ingested into training data.

### Service Worker Migration & PWA Cleanup

- **D-12:** **Replace `public/sw.js` with kill-switch script.** Tiny SW that self-unregisters on install (`self.skipWaiting()`), clears all caches, then calls `self.registration.unregister()` on activate. Ensures returning visitors (who registered the stale Workbox SW from next-pwa era) get the fresh site immediately. Critical — stale SW precaches deleted `/archive` and `/ledgeriq` routes.
- **D-13:** **Complete PWA removal:** delete `app/manifest.ts`, `public/manifest.json`, `public/fallback-*.js`, `public/workbox-*.js` (if any), `components/pwa/` directory (pwa-provider.tsx, install-prompt.tsx, offline-indicator.tsx, update-prompt.tsx), `app/offline/` route, and `app/sw-register.tsx`. Since next-pwa is permanently disabled and you're certain you won't want installability, clean slate.

### Sitemap & Robots Improvements

- **D-14:** **Add `lastModified` to sitemap URLs.** Build time or content-derived dates for static + project URLs (blog already has dates). Priority hints are hints, but freshness signals improve crawl efficiency.
- **D-15:** **Remove `/_next/` from robots.ts disallow list.** Critical fix — blocks Googlebot from fetching JS/CSS needed to render pages. All structured data is currently client-rendered (see D-06), so rendering isn't optional — it's the only way crawlers see JSON-LD. Keep `/admin/`, `/api/`, `/private/`, `/drafts/` disallows.

### Live Verification (post-deploy)

- **D-16:** **Mandatory verification step in the plan:** fetch live robots.txt and sitemap.xml, run Rich Results Test on `/` (home), `/projects/growit` (one project), and one blog post, confirm Search Console property exists and sitemap is submitted. Record results in verification artifact. Audit ran offline — this step confirms it works in production.

### Claude's Discretion

- Kill-switch script exact implementation (listener structure, cache-clearing approach)
- Sitemap date source (build time vs content-derived for projects)
- Whether to add `/archive` → `/projects` redirect if Search Console shows backlinks
- Commit granularity — suggest: robots/test-routes; SW kill-switch + PWA cleanup; structured-data consolidation + server-render migration; sitemap; live verification
- Helper location for server-rendered schema components (likely in `components/seo/` but as RSCs)
- Whether to reconcile ROADMAP.md checkboxes for Phases 5-9 (all complete but unchecked) in this phase's docs commit — recommended yes

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Audit & Requirements
- `.planning/research/SEO-AUDIT.md` — 2026-08-16 codebase audit (T-01..T-07 findings, prioritized action plan, limitation note about live verification)
- `.planning/ROADMAP.md` §Phase 10 — goal, 5 success criteria, dependency on Phase 9
- `.planning/REQUIREMENTS.md` §SEO (to be created — SEO-01..SEO-05 from audit findings)

### Prior Phase Context
- `.planning/phases/09-cross-surface-verification/09-CONTEXT.md` — Phase 9 completed; claim reconciliation across metadata/OG/JSON-LD done; structured data builds on this work
- `.planning/PROJECT.md` §Key Decisions — v1.0 lesson "remove fabricated schema", v2.0 credibility discipline
- `.planning/STATE.md` §Accumulated Context — Chameleon Collective URL verification carry-over

### Codebase Maps
- `.planning/codebase/ARCHITECTURE.md` — component responsibilities (structured data, middleware, SEO metadata files)
- `.planning/codebase/STACK.md` — next-pwa disabled, PWA components still wired, service worker state
- `.planning/codebase/CONVENTIONS.md` — server/client split pattern

### Project Instructions
- `CLAUDE.md` §Verifying Changes — lint → tsc → test order; build is NOT a gate

</canonical_refs>

<code_context>
## Existing Code Insights

### Files This Phase Modifies

**Structured Data:**
- `components/seo/structured-data.tsx` — client-rendered ("use client" line 1); exports Person, WebSite, Organization (Wealthberry), LocalBusiness, 2× ProfessionalService, FAQPage, CreativeWork, Article, Breadcrumb; contains orphaned useEffect in LocalBusinessStructuredData; to be migrated to server components
- `components/seo/project-faq.tsx` — ProjectFAQStructuredData component, only used by `app/projects/[slug]/page.tsx`; selective deletion per D-05
- `lib/metadata.ts` — site-level metadata defaults; sameAs twitter.com → x.com update

**Crawl Control:**
- `app/robots.ts` — disallows `/_next/`, blocks GPTBot/CCBot/ChatGPT-User/anthropic-ai/Claude-Web (lines 13-31), allows `/` for `*`
- `app/sitemap.ts` — static + project + blog URLs; blog has lastModified (lines 42-59), others don't
- `middleware.ts` — shouldBlockIndexing covers /admin, /api, /test-glow, /offline (lines 92-99); NOT /test

**PWA Artifacts (all to be deleted per D-13):**
- `public/sw.js` — stale Workbox SW precaching deleted routes + old chunks
- `public/fallback-*.js` — Workbox fallbacks
- `app/manifest.ts`, `public/manifest.json` — PWA manifest
- `components/pwa/` — pwa-provider.tsx, install-prompt.tsx, offline-indicator.tsx, update-prompt.tsx
- `app/offline/page.tsx` — PWA offline fallback
- `app/sw-register.tsx` — commented-out registration
- `app/layout.tsx` — PWAProvider import (to be removed)

**Test Routes (to be deleted per D-08):**
- `app/test/codeblock/page.tsx`
- `app/test-glow/page.tsx` (if exists)

### Reusable Assets

- Phase 9's `projectMetadata()` helper (`lib/metadata.ts` or wherever it landed) — already derives metadata from `lib/data/projects.ts`; structured data should follow the same pattern
- `lib/data/projects.ts` — single source of truth for project content post-Phase 9; CreativeWork schema derives from this
- `app/layout.tsx` — root layout that renders Person + WebSite schema on every page (server component); natural home for consolidated entity schema
- Next.js App Router server component pattern — pages are server components by default; `<script type="application/ld+json">` inlined in RSC output is the standard approach

### Established Patterns

- **Server/client split:** page.tsx (server, owns metadata + schema) renders sibling *-client.tsx for interactivity
- **Phase 9 source-of-truth discipline:** metadata/OG/JSON-LD all derive from `lib/data/projects.ts`, not hand-typed strings
- **Credibility guardrails:** no fabricated schema (CRED-06..09), claims must be verifiable, conflicts surfaced not silently resolved

### Integration Points

- Structured-data migration touches: `app/layout.tsx` (Person + WebSite + Organization), `app/projects/[slug]/page.tsx` (CreativeWork + selective FAQ), `app/blog/[slug]/page.tsx` or blog layout (Article), bespoke project pages (CreativeWork)
- Robots.ts changes affect: Googlebot's ability to fetch `/_next/` chunks (enables JS rendering), AI crawler visibility
- Service worker kill-switch: returning visitors who registered the old SW (next-pwa era) get unregistered on next visit
- Test route deletion: removes `/test/codeblock` and `/test-glow` from crawlable surface; dev-only audit may find more
- PWA cleanup: removes 8+ files across `public/`, `components/`, `app/`

</code_context>

<specifics>
## Specific Ideas

- **Chameleon Collective verification** is explicit user input — check the URL works before deciding to keep or remove. Don't skip this.
- **Wealthberry Organization** represents Randy's company (buildyourlegacywithai.com) — user confirmed it belongs on this site despite being an external URL. Ensure Person → Organization relationship is clear in schema (e.g., Person's `affiliation` or `worksFor`).
- **Selective FAQ approach** chosen over blanket deletion — user wants to keep accurate FAQs (growit) even though they violate on-page visibility requirement. Flag this compromise in the plan.
- **Complete PWA removal** including manifest — user is certain about no future installability, so clean slate preferred over partial cleanup.
- **Dev-only route audit** should use the criteria defined in D-09 (nav/sitemap/ROADMAP scope check), not just pattern matching on "test"/"demo" in paths.

</specifics>

<deferred>
## Deferred Ideas

- **Visible on-page FAQ content** — the only legitimate way to bring FAQPage schema back with rich-result eligibility. Would require authoring FAQ UI components and content, likely from Phase 8 decision content. Its own phase if ever.
- **Service representation schema** (ProfessionalService or similar) — user chose minimal set for now (D-01); could be added later if search visibility for "fractional CDO services" needs a boost beyond Person schema.
- **Broader placeholder/example.com sweep** — Phase 9 scoped to project claims; a site-wide grep for placeholder content in non-project surfaces wasn't pursued. Could surface in a future quality pass.
- **Privacy policy / terms of service in sitemap** — audit notes they're absent (defensible either way). Recommend include since they're indexed via footer links, but not blocking.

</deferred>

---

*Phase: 10-seo-remediation*
*Context gathered: 2026-08-20*
