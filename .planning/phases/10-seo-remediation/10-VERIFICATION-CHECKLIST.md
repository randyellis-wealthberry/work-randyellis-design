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
| 1 | robots.txt live | `curl -s https://work.randyellis.design/robots.txt` | No `/_next/` in any Disallow; `User-agent: GPTBot` group present with `Allow: /`; `Sitemap: https://work.randyellis.design/sitemap.xml` | | | pending | |
| 2 | sitemap.xml live | `curl -s https://work.randyellis.design/sitemap.xml` | 19 `<url>` entries, every one has `<lastmod>`; includes /privacy-policy and /terms-of-service | | | pending | |
| 3 | sw.js live | `curl -sI https://work.randyellis.design/sw.js` + `curl -s https://work.randyellis.design/sw.js` | Body contains `registration.unregister` and no `precacheAndRoute`; `Cache-Control` contains `max-age=0` | | | pending | |
| 4 | /test-glow and /test/codeblock redirects | `curl -sI -o /dev/null -w "%{http_code} %{redirect_url}" https://work.randyellis.design/test-glow` + same for /test/codeblock | 301 or 308 with Location ending in `/` | | | pending | |
| 5 | Deleted PWA routes | `curl -sI https://work.randyellis.design/offline` + same for /manifest.webmanifest | HTTP 404 | | | pending | |
| 6 | Home raw HTML JSON-LD | `curl -s https://work.randyellis.design/ \| grep -o 'application/ld+json' \| wc -l` | ≥ 2 and body contains `"@type":"Person"` and `"@type":"WebSite"` (server-rendered proof, D-10) | | | pending | |
| 7 | /projects/growit raw HTML | `curl -s https://work.randyellis.design/projects/growit` | Contains `"@type":"CreativeWork"` and `"@type":"BreadcrumbList"`, no `FAQPage` | | | pending | |
| 8 | /blog/profits-not-pixels raw HTML | `curl -s https://work.randyellis.design/blog/profits-not-pixels` | Contains `"@type":"Article"` and `"@type":"BreadcrumbList"` | | | pending | |
| 9 | Rich Results Test — Home | https://search.google.com/test/rich-results?url=https://work.randyellis.design/ | No errors; detected items listed | | rrt-home.png | pending | D-17 |
| 10 | Rich Results Test — GrowIt project | https://search.google.com/test/rich-results?url=https://work.randyellis.design/projects/growit | No errors | | rrt-growit.png | pending | D-17 |
| 11 | Rich Results Test — Blog post | https://search.google.com/test/rich-results?url=https://work.randyellis.design/blog/profits-not-pixels | No errors; Article detected | | rrt-blog.png | pending | D-17 |
| 12 | Returning-visitor SW unregistration | Browser DevTools → Application → Service Workers (or `navigator.serviceWorker.getRegistrations()` in console) after loading the site | Zero registrations | | sw-registrations.png | pending | |
| 13 | Search Console | https://search.google.com/search-console | Property for work.randyellis.design exists; sitemap `https://work.randyellis.design/sitemap.xml` submitted with status Success (D-18) | | gsc-sitemap.png | pending | |

## Run Log

- **Deployment commit SHA:** (to be filled post-deploy)
- **Production URL:** https://work.randyellis.design
- **Date/Time:** (to be filled post-deploy)
- **Executor:** Phase 10 Plan 09/10

## Open for Randy

(To be populated post-verification if any manual steps or decisions required)
