# Phase 10: SEO Remediation - Context

**Gathered:** 2026-08-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Close every finding from `.planning/research/SEO-AUDIT.md` (2026-08-16) so the site is fully crawlable, consistently indexed, and emits one coherent entity story in structured data. Five remediation areas: (1) service worker kill-switch + complete PWA cleanup, (2) robots.txt `/_next/` unblocking + AI crawler policy, (3) test route deletion + dev-route audit, (4) structured data consolidation + server-render migration, (5) sitemap lastModified + live post-deploy verification.

Builds on Phase 9's reconciled claims—all metadata/OG/JSON-LD already single-sourced from `lib/data/projects.ts`. This phase delivers technical SEO fixes, not content authoring.

</domain>

<decisions>
## Implementation Decisions

### PWA Cleanup
- **D-01:** Complete removal of PWA artifacts. Delete `app/manifest.ts`, `components/pwa/` directory, `app/offline/` directory, `public/manifest.json`, fallback files in `public/` (`fallback-*.js`). PWA was never functional (next-pwa disabled in `next.config.js` since Next 15 incompatibility); maintaining dead code adds no value.
- **D-02:** Remove SW registration code entirely from `app/layout.tsx`. Delete `app/sw-register.tsx` import and `<ServiceWorkerRegister />` component. Clean break—no commented code.
- **D-03:** Replace `public/sw.js` with kill-switch service worker: self-unregisters on install, clears all caches on activate, then removes itself. Immediate one-time activation pattern—returning visitors cleaned on first post-deploy visit, then kill-switch is gone.

### Test Routes & Dev-Only Pages
- **D-04:** Delete `/test/codeblock` and `/test-glow` entirely (directories + route files). Dev-only pages with no production value.
- **D-05:** Audit `app/` for other dev-only routes—grep for 'test', 'demo', 'debug', 'dev' patterns and evaluate each route. Decision per-route rather than blanket rule.
- **D-06:** Keep `/admin/email-test` and other `/admin` routes; ensure `robots.txt` disallows `/admin/*` (already disallowed per `app/robots.ts`).
- **D-07:** Add 301 redirects for deleted `/test` URLs to home (`/`). Clean UX if anyone bookmarked them.

### Structured Data Entity Story
- **D-08:** Site emits four schema types only: **Person** (Randy), **WebSite** (portfolio), **CreativeWork** (case studies), **Article** (blog posts). No Organization, LocalBusiness, ProfessionalService, or FAQ schemas. Clean, verifiable, matches Phase 9's single-sourced metadata.
- **D-09:** Delete all FAQ structured data. Phase 9 deleted project FAQ due to fabrication (D-09); site-level FAQ also has fabricated content ('25K+ cities'). CRED-07 no-fabrication rule applies.
- **D-10:** Migrate all structured data from client components to server-rendered. Current `components/seo/structured-data.tsx` is `"use client"`—migrate to server-side `<script type="application/ld+json">` tags in RSC pages (`app/layout.tsx`, `app/projects/[slug]/page.tsx`, `app/blog/[slug]/page.tsx`). Google indexes server-rendered JSON-LD more reliably, especially with robots.txt `/_next/` fix.
- **D-11:** Chameleon Collective URL in current structured data—verify URL resolves before deciding to keep or remove. **Claude's discretion** based on URL check.
- **D-12:** Person schema includes both jobTitle values: `["Head of Product", "Fractional Chief Design Officer"]`. Schema.org Person allows array; accurately reflects dual focus.
- **D-13:** WebSite schema includes search action using `/projects` page category filter. Not fabricated—filter functionality exists.
- **D-14:** CreativeWork schema includes `teamSize` and `role` properties (existing project data from Phase 6/8). CRED-06 credit-attribution rule requires differentiating solo vs team work. These are not standard Schema.org CreativeWork properties but are valid extensions.
- **D-15:** Article schema for blog posts—**Claude's discretion** whether to add author Person reference linking to Randy's Person schema or keep current Article-only schema.

### Live Verification Workflow
- **D-16:** Manual checklist with recorded proof artifacts. Create `VERIFICATION-CHECKLIST.md` with steps: robots.txt fetch, Rich Results Test for sampled URLs, Search Console sitemap submission. Executor records completion. Follows Phase 9's CROSS-SURFACE-MATRIX.md documentation pattern.
- **D-17:** Rich Results Test sampling: home + 1 project (any of the 7 case studies) + 1 blog post. Representative coverage testing Person/WebSite (home), CreativeWork (project), Article (blog). Not exhaustive.
- **D-18:** Search Console sitemap submission is **required**, not optional. Audit flags this as mandatory post-deploy step.
- **D-19:** Verification proof format: markdown table with one row per check (robots.txt fetch, Rich Results Test per sampled URL, Search Console sitemap submission). Screenshot column for proof. Follows Phase 9's matrix pattern.
- **D-20:** `app/sitemap.ts` adds `lastModified` for static routes + project URLs. Blog posts can use publication date if accessible in sitemap.ts context.
- **D-21:** `app/robots.txt` allows AI crawlers (GPTBot, Claude-Web, CCBot, etc.). Increases Randy's work visibility in AI training/responses. Also removes `/_next/` from disallow list so Googlebot can render client-side content.
- **D-22:** Verification checklist runs post-deploy only (production deployment), not on preview deployments. Tests live deployment as audit requires.
- **D-23:** If Rich Results Test finds errors, phase blocks until fixed. Audit goal is "fully crawlable, consistently indexed"—errors violate that; phase not complete until clean.

### Claude's Discretion
- Chameleon Collective URL disposition—verify resolves, then decide keep or remove based on validity (D-11)
- Article schema author Person reference—add link or keep current Article-only schema (D-15)
- Exact verification checklist markdown table layout and screenshot storage location (following Phase 9's pattern)
- Helper function location for server-rendered structured data builders (`lib/metadata.ts`, `lib/seo/`, or inline in layout/pages)
- Commit granularity—suggest: (1) PWA cleanup, (2) robots + test routes, (3) structured data migration, (4) sitemap + verification checklist, (5) live verification proof

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### SEO Audit & Research
- `.planning/research/SEO-AUDIT.md` — 2026-08-16 crawlability audit; defines all findings (T-01 through T-07) this phase closes
- `.planning/phases/10-seo-remediation/10-RESEARCH.md` — Technical research: Next.js metadata APIs, service worker kill-switch pattern, server-rendered JSON-LD, Schema.org vocabulary

### Cross-Surface Verification (Phase 9 precedent)
- `.planning/phases/09-cross-surface-verification/09-CONTEXT.md` — Metadata source-of-truth decisions (D-01 through D-19); structured data precedents (D-09 FAQ deletion, D-11 CreativeWork, D-12 Breadcrumb); proof artifact pattern (D-14 matrix + regression test)

No external specs—requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/robots.ts` — Existing Next.js metadata file for robots.txt generation; currently disallows `/admin/*` and `/_next/*`. Modify to remove `/_next/` block and add AI crawler allow rules.
- `app/sitemap.ts` — Existing Next.js metadata file for sitemap.xml generation; already uses `PROJECTS` data source. Extend to add `lastModified` field.
- `lib/data/projects.ts` — Single source of truth for all project metadata (Phase 9 D-01). CreativeWork schema will derive from this.
- `components/seo/structured-data.tsx` — Current client-side structured data components (Person, WebSite, FAQ, Breadcrumb, CreativeWork exports). Will be deleted after migration to server-rendered schema in RSC pages.
- `app/layout.tsx` — Root server component; owns site-level metadata, font loading, providers, Header/Footer. Person + WebSite schema will be server-rendered here.
- `app/projects/[slug]/page.tsx` — Server component already emitting metadata via `generateMetadata`; CreativeWork + Breadcrumb schema will be server-rendered here.
- `app/blog/layout.tsx` or `app/blog/[slug]/page.tsx` — Blog post server components; Article schema likely already server-rendered (verify).

### Established Patterns
- Server/client page split: `page.tsx` (server, owns metadata) + `*-client.tsx` (interactivity). Phase 10 works only in server layer—no client component changes needed.
- Next.js metadata APIs: `robots.ts`, `sitemap.ts`, `metadata` export, `generateMetadata` for dynamic routes. Standard Next 15 SEO patterns.
- Phase 9 proof artifact pattern: markdown table with one row per claim/check, columns for each surface (visible copy, metadata, OG, JSON-LD), `agree | fixed→X | pulled | open` status cells. Reuse for VERIFICATION-CHECKLIST.md.

### Integration Points
- Middleware (`middleware.ts`) currently stamps Cache-Control headers; may need update if test routes are deleted and 301 redirects added (check redirect handling).
- Verification gate from Phases 5–9: `npm run lint` → `npx tsc --noEmit` → `npm test` → stale-content grep. Phase 10 adds post-deploy verification checklist as final gate.
- Header triplication (ARCHITECTURE.md anti-pattern): security/cache headers defined in `middleware.ts`, `next.config.js` `headers()`, and `vercel.json`. Verify consistency after robots.txt/test-route changes.

</code_context>

<specifics>
## Specific Ideas

No specific visual/interaction requirements—Phase 10 is technical infrastructure. All user-facing changes are in `robots.txt`, `sitemap.xml`, structured data (invisible to users), and deleted routes.

Verification checklist will produce screenshot proof artifacts stored alongside VERIFICATION-CHECKLIST.md (suggest `10-verification-screenshots/` subdirectory in phase dir).

</specifics>

<deferred>
## Deferred Ideas

None—discussion stayed within phase scope. No todos were reviewed from the cross_reference step.

</deferred>

---

*Phase: 10-seo-remediation*
*Context gathered: 2026-08-20*
