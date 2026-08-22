# Phase 10 SEO Remediation — Live Verification Checklist

**Produced:** 2026-08-21 (post-execution; to be filled post-deploy)
**Requirement:** SEO-05 (Live post-deploy verification)
**Method:** Each check run against production https://work.randyellis.design per D-22; proof saved under `10-verification-screenshots/`

## Status Definitions

- **pending** — Not yet run (post-deploy step)
- **pass** — Check completed successfully; proof recorded
- **fail** — Check failed; issue documented; phase blocks until fixed (D-23)
- **blocked** — Cannot run until prerequisite satisfied

## D-23 Blocking Rule

Any Rich Results Test **ERROR** blocks phase completion until fixed and re-verified. Warnings for the non-standard CreativeWork keys `teamSize`/`role` (D-14) and for SearchAction not being a rich result are **expected and NOT blocking**.

## Verification Checks

| # | Check | Command / URL | Expected | Result | Proof (screenshot/file) | Status | Notes |
|---|-------|--------------|----------|--------|-------------------------|--------|-------|
| 1 | robots.txt live | `curl -s https://work.randyellis.design/robots.txt` | No `/_next/` in any Disallow; `User-agent: GPTBot` group present with `Allow: /`; `Sitemap: https://work.randyellis.design/sitemap.xml` | 0 /_next/ blocks, GPTBot present, Sitemap declared, /admin/ blocked | 10-verification-screenshots/robots.txt | pass | All AI crawlers allowed; /_next/ accessible |
| 2 | sitemap.xml live | `curl -s https://work.randyellis.design/sitemap.xml` | 19 `<url>` entries, every one has `<lastmod>`; includes /privacy-policy and /terms-of-service | 19 url, 19 lastmod, includes privacy & terms pages | 10-verification-screenshots/sitemap.xml | pass | All pages timestamped |
| 3 | sw.js live | `curl -sI https://work.randyellis.design/sw.js` + `curl -s https://work.randyellis.design/sw.js` | Body contains `registration.unregister` and no `precacheAndRoute`; `Cache-Control` contains `max-age=0` | Kill-switch active, no precache, max-age=0 in headers | 10-verification-screenshots/sw.js.txt | pass | Unregisters existing SW, prevents caching |
| 4 | /test-glow and /test/codeblock redirects | `curl -sI -o /dev/null -w "%{http_code} %{redirect_url}" https://work.randyellis.design/test-glow` + same for /test/codeblock | 301 or 308 with Location ending in `/` | Both: 308 → https://work.randyellis.design/ | 10-verification-screenshots/redirects.txt | pass | Permanent redirects to home |
| 5 | Deleted PWA routes | `curl -sI https://work.randyellis.design/offline` + same for /manifest.webmanifest | HTTP 404 | /offline: 404, /manifest.webmanifest: 404 | 10-verification-screenshots/redirects.txt | pass | PWA routes removed |
| 6 | Home raw HTML JSON-LD | `curl -s https://work.randyellis.design/ \| grep -o 'application/ld+json' \| wc -l` | ≥ 2 and body contains `"@type":"Person"` and `"@type":"WebSite"` (server-rendered proof, D-10) | 4 ld+json scripts, Person + WebSite types, x.com (not twitter.com), no Organization/FAQPage | 10-verification-screenshots/jsonld-home.txt | pass | Server-rendered Person + WebSite schemas |
| 7 | /projects/growit raw HTML | `curl -s https://work.randyellis.design/projects/growit` | Contains `"@type":"CreativeWork"` and `"@type":"BreadcrumbList"`, no `FAQPage` | CreativeWork + BreadcrumbList present, no FAQPage | 10-verification-screenshots/jsonld-growit.txt | pass | Server-rendered project schemas |
| 8 | /blog/profits-not-pixels raw HTML | `curl -s https://work.randyellis.design/blog/profits-not-pixels` | Contains `"@type":"Article"` and `"@type":"BreadcrumbList"` | Article + BreadcrumbList + Person reference present | 10-verification-screenshots/jsonld-blog.txt | pass | Server-rendered blog schemas |
| 9 | Rich Results Test — Home | https://search.google.com/test/rich-results?url=https://work.randyellis.design/ | No errors; detected items listed | N/A | N/A | pending | Browser automation unavailable (Playwright not installed) — human verification in Plan 10-10 |
| 10 | Rich Results Test — GrowIt project | https://search.google.com/test/rich-results?url=https://work.randyellis.design/projects/growit | No errors | N/A | N/A | pending | Browser automation unavailable — human verification in Plan 10-10 |
| 11 | Rich Results Test — Blog post | https://search.google.com/test/rich-results?url=https://work.randyellis.design/blog/profits-not-pixels | No errors; Article detected | N/A | N/A | pending | Browser automation unavailable — human verification in Plan 10-10 |
| 12 | Returning-visitor SW unregistration | Browser DevTools → Application → Service Workers (or `navigator.serviceWorker.getRegistrations()` in console) after loading the site | Zero registrations | N/A | N/A | pending | Browser automation unavailable — human verification in Plan 10-10 |
| 13 | Search Console | https://search.google.com/search-console | Property for work.randyellis.design exists; sitemap `https://work.randyellis.design/sitemap.xml` submitted with status Success (D-18) | | gsc-sitemap.png | pending | |

## Run Log

- **Deployment commit SHA:** 69e214a37ffe1e9da7369311e6a7ecf237d9403f
- **Production URL:** https://work.randyellis.design
- **Date/Time:** 2026-08-22 00:00:12 UTC
- **Executor:** Claude (Phase 10 Plan 09)

## Open for Randy

(To be populated post-verification if any manual steps or decisions required)
