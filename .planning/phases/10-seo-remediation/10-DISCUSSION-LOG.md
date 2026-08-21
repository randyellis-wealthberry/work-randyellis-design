# Phase 10: SEO Remediation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-20
**Phase:** 10-seo-remediation
**Areas discussed:** PWA cleanup scope, Test route disposition, Structured data entity story, Live verification workflow

---

## PWA Cleanup Scope

### Question 1: What level of PWA cleanup for Phase 10?

| Option | Description | Selected |
|--------|-------------|----------|
| Complete removal (Recommended) | Delete manifest.ts, components/pwa/, app/offline/, public/manifest.json + kill-switch SW. PWA was never functional (next-pwa disabled), so removing dead code is cleaner than maintaining it. | ✓ |
| Kill-switch only | Replace public/sw.js with unregister script but keep manifest/components. Preserves structure for future PWA reactivation. | |

**User's choice:** Complete removal (Recommended)

### Question 2: Should SW registration code in app/layout.tsx be removed or commented?

| Option | Description | Selected |
|--------|-------------|----------|
| Remove entirely | Delete app/sw-register.tsx import and <ServiceWorkerRegister /> from layout. Clean break. | ✓ |
| Comment out | Leave code in place but disabled. Makes future reactivation easier to find. | |
| You decide | Claude picks based on complete-removal decision | |

**User's choice:** Remove entirely

### Question 3: What happens to fallback files in public/ (fallback-*.js)?

| Option | Description | Selected |
|--------|-------------|----------|
| Delete with other PWA artifacts | Part of the stale Workbox SW; delete along with manifest/offline page. | ✓ |
| Keep for now | Leave until confirming they're unused elsewhere. | |

**User's choice:** Delete with other PWA artifacts

### Question 4: Timeline for SW kill-switch to complete cleanup?

| Option | Description | Selected |
|--------|-------------|----------|
| Immediate (one-time activation) | Kill-switch SW activates once, clears cache, unregisters itself, then gone. Returning visitors cleaned on first visit post-deploy. | ✓ |
| Grace period (keep kill-switch deployed) | Leave kill-switch SW in place for X days/weeks to catch infrequent visitors, then remove. | |

**User's choice:** Immediate (one-time activation)

---

## Test Route Disposition

### Question 1: How should /test routes be handled?

| Option | Description | Selected |
|--------|-------------|----------|
| Delete entirely (Recommended) | /test/codeblock and /test-glow are dev-only pages with no production value. Audit suggests deletion. (middleware already noindexes test-glow) | ✓ |
| Keep with X-Robots-Tag noindex | Preserve routes but ensure they're noindexed. Useful if routes are referenced elsewhere. | |

**User's choice:** Delete entirely (Recommended)

### Question 2: Should we audit app/ for other dev-only routes?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, scan and decide per-route | Grep app/ for routes with 'test', 'demo', 'debug', 'dev' and evaluate each. Thorough but more work. | ✓ |
| No, just the known /test routes | Delete /test/codeblock and /test-glow only. Faster; trust no other dev routes exist. | |
| You decide | Claude judges based on codebase scan | |

**User's choice:** Yes, scan and decide per-route

### Question 3: What about /admin routes (email-test page)?

| Option | Description | Selected |
|--------|-------------|----------|
| Keep with robots.txt disallow | Useful internal tools; already disallowed in robots.ts. Keep but ensure crawlers can't reach them. | ✓ |
| Delete if unused | Remove if no longer needed for operations. | |
| You decide | Claude evaluates usage | |

**User's choice:** Keep with robots.txt disallow

### Question 4: After deletion, should we add redirects for /test URLs?

| Option | Description | Selected |
|--------|-------------|----------|
| No redirects needed | Dev-only routes were never public/linked. Let them 404. | |
| 301 redirect to home | Clean UX if anyone bookmarked them. | ✓ |

**User's choice:** 301 redirect to home

---

## Structured Data Entity Story

### Question 1: Which structured data schemas should the site emit?

| Option | Description | Selected |
|--------|-------------|----------|
| Person + WebSite + CreativeWork + Article (Recommended) | Core entity story: Randy (Person) has a portfolio (WebSite) with case studies (CreativeWork) and blog posts (Article). Clean, accurate, matches Phase 9's single-sourced metadata. | ✓ |
| Add Organization/ProfessionalService | Include business entity schemas for Wealthberry/Chameleon Collective affiliations. Research flags LocalBusiness has invalid properties. | |
| You decide based on audit | Claude picks schemas based on SEO-AUDIT.md findings and CRED-07 no-fabrication rule | |

**User's choice:** Person + WebSite + CreativeWork + Article (Recommended)

### Question 2: What about the existing FAQ schema?

| Option | Description | Selected |
|--------|-------------|----------|
| Delete all FAQ schemas (Recommended) | Phase 9 deleted project FAQ due to fabrication (D-09). Research suggests site-level FAQ also has fabricated content ('25K+ cities'). Remove to maintain CRED-07 integrity. | ✓ |
| Keep accurate FAQs only | Audit each FAQ; delete fabricated ones, keep verifiable Q&A. | |
| Move FAQs on-page | Google requires FAQ be visible; render as accordion components + schema. More work. | |

**User's choice:** Delete all FAQ schemas (Recommended)

### Question 3: Should structured data migrate from client to server components?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, server-render all schemas (Recommended) | Research: Google indexes server-rendered JSON-LD more reliably. Current components/seo/structured-data.tsx is client-side. Migrate to RSC in layout/page components. | ✓ |
| Keep current client-side | Works today; Googlebot renders JS. No migration needed. | |

**User's choice:** Yes, server-render all schemas (Recommended)

### Question 4: Chameleon Collective URL in current structured data — verify or remove?

| Option | Description | Selected |
|--------|-------------|----------|
| Verify resolves, keep if valid | CRED-07 requires verifiable claims. Check URL resolves; if broken, remove reference. | |
| Remove entirely | Simplify entity story; Randy's Person schema doesn't need employer affiliation. | |
| You decide after checking URL | Claude verifies URL and makes call | ✓ |

**User's choice:** You decide after checking URL

### Question 5: Should Person schema include both jobTitle values (Head of Product + Fractional CDO)?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, both (Recommended) | Accurately reflects dual focus. Schema.org Person allows array for jobTitle. | ✓ |
| Primary only (Fractional CDO) | Simplify to current positioning focus. | |
| You decide | Claude picks based on homepage/about content | |

**User's choice:** Yes, both (Recommended)

### Question 6: WebSite schema — include search action or skip?

| Option | Description | Selected |
|--------|-------------|----------|
| Skip search action | Site has no search functionality. Don't fabricate schema for missing feature. | |
| Add search with /projects filter | Projects page has category filter; model as search. Stretch but technically accurate. | ✓ |
| You decide | Claude evaluates based on existing functionality | |

**User's choice:** Add search with /projects filter

### Question 7: CreativeWork schema — should teamSize and role be included?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, include both (Recommended) | Differentiates solo vs team work. Already in project data from Phase 6/8. CRED-06 credit-attribution rule. | ✓ |
| Skip — not standard properties | Schema.org CreativeWork doesn't define teamSize/role. Keep schema strict. | |
| You decide | Claude weighs SEO value vs schema validity | |

**User's choice:** Yes, include both (Recommended)

### Question 8: Article schema for blog posts — keep or standardize further?

| Option | Description | Selected |
|--------|-------------|----------|
| Keep current Article schema | Blog posts already emit Article via app/blog/layout. Working; no changes needed. | |
| Add author Person reference | Link blog Article schema to Randy's Person schema via author property. More connected entity graph. | |
| You decide | Claude picks based on SEO best practices | ✓ |

**User's choice:** You decide

---

## Live Verification Workflow

### Question 1: How should post-deploy SEO verification be documented?

| Option | Description | Selected |
|--------|-------------|----------|
| Manual checklist + recorded proof (Recommended) | Create VERIFICATION-CHECKLIST.md with steps (robots.txt fetch, Rich Results Test URLs, Search Console screenshots). Executor records completion per Phase 9's matrix pattern. | ✓ |
| Automated script | Script hits robots.txt/sitemap.xml, runs headless Rich Results Test. More robust but harder to build. | |
| You decide | Claude picks verification approach based on audit requirements | |

**User's choice:** Manual checklist + recorded proof (Recommended)

### Question 2: Which URLs should be tested with Rich Results Test?

| Option | Description | Selected |
|--------|-------------|----------|
| Home + 1 project + 1 blog post (Recommended) | Audit suggests sampling. Tests Person/WebSite (home), CreativeWork (project), Article (blog). Representative coverage. | ✓ |
| All 7 case studies + all blog posts | Exhaustive but time-consuming. Ensures every page passes. | |
| You decide based on risk | Claude picks coverage level | |

**User's choice:** Home + 1 project + 1 blog post (Recommended)

### Question 3: Should Search Console sitemap submission be required or optional?

| Option | Description | Selected |
|--------|-------------|----------|
| Required (Recommended) | Audit flags this as mandatory post-deploy step. Ensures Google knows sitemap exists and can track indexation. | ✓ |
| Optional — sitemap.xml auto-discovered | Google finds sitemaps via robots.txt. Manual submission is nice-to-have, not blocker. | |

**User's choice:** Required (Recommended)

### Question 4: What format should verification proof take?

| Option | Description | Selected |
|--------|-------------|----------|
| Markdown table + screenshots (Recommended) | Follow Phase 9's CROSS-SURFACE-MATRIX.md pattern. One row per check (robots fetch, Rich Results per URL, sitemap submission). Screenshot column for proof. | ✓ |
| Text-only checklist | Simple markdown list with checkboxes. No proof artifacts; trust executor attestation. | |
| You decide | Claude picks format based on audit rigor needs | |

**User's choice:** Markdown table + screenshots (Recommended)

### Question 5: Should sitemap.ts add lastModified for all URLs or static only?

| Option | Description | Selected |
|--------|-------------|----------|
| Static + project URLs (Recommended) | Audit suggests lastModified for static and project pages. Blog posts can use publication date if available. | ✓ |
| All URLs including blog | Complete lastModified coverage. Requires extracting blog post dates. | |
| You decide based on data availability | Claude checks what dates are accessible in sitemap.ts context | |

**User's choice:** Static + project URLs (Recommended)

### Question 6: robots.txt AI crawler policy — allow or block?

| Option | Description | Selected |
|--------|-------------|----------|
| Allow AI crawlers (GPTBot, Claude-Web, etc.) | Audit suggests opening to AI crawlers. Increases Randy's work visibility in AI training/responses. | ✓ |
| Block AI crawlers | Opt out of AI training. Privacy-focused but reduces discoverability. | |
| You decide based on professional benefit | Claude weighs portfolio visibility vs training concerns | |

**User's choice:** Allow AI crawlers (GPTBot, Claude-Web, etc.)

### Question 7: Should verification checklist run pre-deploy or post-deploy?

| Option | Description | Selected |
|--------|-------------|----------|
| Post-deploy only (Recommended) | Audit calls it 'live post-deploy verification'. Tests production deployment, not preview. | ✓ |
| Both preview + production | Verify on preview deployment first, then rerun on production. Catches issues earlier. | |
| You decide | Claude picks based on verification rigor vs deploy-cycle speed | |

**User's choice:** Post-deploy only (Recommended)

### Question 8: If Rich Results Test finds errors, should phase block until fixed?

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, block on errors (Recommended) | Audit goal is 'fully crawlable, consistently indexed'. Errors violate that; phase not complete until clean. | ✓ |
| Record errors, proceed anyway | Document findings for future fix. Don't block deploy. | |
| You decide based on error severity | Claude judges whether each error type blocks completion | |

**User's choice:** Yes, block on errors (Recommended)

---

## Claude's Discretion

- Chameleon Collective URL disposition (verify URL resolves first)
- Article schema author Person reference (decide based on SEO best practices)
- Exact verification checklist markdown table layout and screenshot storage
- Helper function location for structured data builders
- Commit granularity

## Deferred Ideas

None — all discussion stayed within Phase 10 scope.
