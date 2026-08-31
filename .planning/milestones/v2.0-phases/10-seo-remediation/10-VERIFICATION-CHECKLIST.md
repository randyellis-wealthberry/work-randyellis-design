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
| 9 | Rich Results Test — Home | https://search.google.com/test/rich-results?url=https://work.randyellis.design/ | No errors; detected items listed | "No items detected" — zero errors. Crawled successfully Aug 22 2026, 3:39:06 PM. Person/WebSite are not rich-result types, so "no items" is the expected outcome, not an error | 10-verification-screenshots/rrt-home.png | pass | Re-run 2026-08-22 in Randy's signed-in Chrome session (authorized). Earlier login wall cleared |
| 10 | Rich Results Test — GrowIt project | https://search.google.com/test/rich-results?url=https://work.randyellis.design/projects/growit | No errors | "1 valid item detected" — Breadcrumbs, green. Crawled successfully Aug 22 2026, 3:40:17 PM. Zero errors, zero warnings | 10-verification-screenshots/rrt-growit.png | pass | The D-14 `teamSize` exception raises no RRT warning: CreativeWork is not a Google rich-result type, so RRT never evaluates it. Row 14 remains the vocabulary-conformance evidence |
| 11 | Rich Results Test — Blog post | https://search.google.com/test/rich-results?url=https://work.randyellis.design/blog/profits-not-pixels | No errors; Article detected | "3 valid items detected" — Articles, Breadcrumbs, Paywalled Content, all green. Crawled successfully Aug 22 2026, 3:41:22 PM. **Zero errors.** 5 non-critical issues on the Article item: missing field "image" (optional); invalid datetime value for "datePublished" (optional); "datePublished" missing a timezone (optional); invalid datetime value for "dateModified" (optional); "dateModified" missing a timezone (optional) | 10-verification-screenshots/rrt-blog.png, 10-verification-screenshots/rrt-blog-warnings.png | pass | Every issue is marked (optional) → warnings, non-blocking per D-23. Both dates render as bare `2025-07-21` with no time or offset. Carried as an observation for Randy, not a Phase 10 gate |
| 12 | Returning-visitor SW unregistration | Browser DevTools → Application → Service Workers (or `navigator.serviceWorker.getRegistrations()` in console) after loading the site | Zero registrations | `navigator.serviceWorker.getRegistrations()` returned `[]` after a full production page load | 10-verification-screenshots/sw-registrations.png | pass | Kill-switch confirmed: no registration survives on a returning visit |
| 13 | Search Console | https://search.google.com/search-console | Property for work.randyellis.design exists; sitemap `https://work.randyellis.design/sitemap.xml` submitted with status Success (D-18) | **Success.** Created a **domain property** `sc-domain:randyellis.design` (superset of the plan's URL-prefix wording — it covers work., hire., www. and the apex, across http and https). Ownership auto-verified via **Domain name provider** using a TXT record at the apex. Sitemap `https://work.randyellis.design/sitemap.xml` submitted 2026-08-22: Type Sitemap, Last read Aug 22 2026, **Status Success, 19 discovered pages, 0 videos** | 10-verification-screenshots/gsc-sitemap.png | pass | Verification TXT added to Vercel DNS (Vercel is both registrar and nameserver) alongside the existing hostedemail SPF record; both resolve on the authoritative and public resolvers. Chose DNS over a meta tag deliberately: v3.0 CRED-11 edits `lib/metadata.ts`, and a verification token living in the file being swept is a silent-removal risk. Account avatar cropped from the proof per T-10-23 |
| 14 | schema.org validator (substitute for rows 9–11) | `curl -s -X POST https://validator.schema.org/validate --data-urlencode url=<page>` for all three URLs | No severe errors other than the D-14 `teamSize`/`role` exception | Home: 0 errors (WebSite, Person, SearchAction). Blog: 0 errors (Article, BreadcrumbList, Person, WebPage). GrowIt: 1 error — `INVALID_PREDICATE teamSize on CreativeWork`, the expected D-14 exception. All three `isRendered: true` | 10-verification-screenshots/schemaorg-home.json, schemaorg-projects-growit.json, schemaorg-blog-profits-not-pixels.json | pass | Not a like-for-like RRT substitute: this validates schema.org vocabulary conformance, not Google's rich-result eligibility. It does establish that no malformed markup exists for RRT to report |

## Run Log

- **Deployment commit SHA:** 69e214a37ffe1e9da7369311e6a7ecf237d9403f
- **Production URL:** https://work.randyellis.design
- **Date/Time:** 2026-08-22 00:00:12 UTC
- **Executor:** Claude (Phase 10 Plan 09)
- **Rows 9–14 run:** 2026-08-22 (Playwright for rows 9–12, curl for row 14)

## D-23 Gate

**Not blocked.** All three Rich Results Tests ran clean on 2026-08-22 against
production: home reported "No items detected" (expected — Person and WebSite are
not rich-result types), `/projects/growit` reported 1 valid Breadcrumbs item with
no errors and no warnings, and the blog post reported 3 valid items (Articles,
Breadcrumbs, Paywalled Content). **Zero errors on all three URLs.** The five
issues on the blog Article are each marked `(optional)` by the tool, which is the
warning class D-23 declares non-blocking.

### History — the earlier `fail` was a false negative

`automate-verification.js` previously recorded rows 9–11 as `fail` with "Rich
Results Test reported errors in page content". That was wrong: the script matched
error text on the page without distinguishing Google's *"Something went wrong —
Log in and try again"* dialog from a structured-data finding. RRT had refused to
run at all, because it now requires a signed-in Google account and the headless
run could not authenticate. Rows 9–11 were then correctly reclassified `blocked`.
The 2026-08-22 re-run in Randy's authenticated session cleared them properly.
`automation-results.json` is superseded by this checklist and should not be read
as a verdict.

## Observations for Randy (not Phase 10 gates)

- **Blog article dates carry no time or timezone.** `datePublished` and
  `dateModified` both serialize as `2025-07-21`. Google flags each twice —
  invalid datetime value, and missing timezone — four of the five warnings on the
  Article. Emitting full ISO-8601 with an offset would clear them.
- **The Article has no `image`.** Optional for validity, but articles with an
  image are eligible for richer treatment in Search.
- ~~**`Paywalled Content` is being detected** on a post that is not paywalled. Worth
  confirming the `isAccessibleForFree` markup says what is intended.~~ **RESOLVED
  2026-08-29:** it says what is intended. `isAccessibleForFree: true` with no
  `hasPart` is Google's markup for freely accessible content; the green
  "Paywalled Content" item means the property was recognized. Not a defect.
- **The Person carries two `jobTitle` values** — "Head of Product" and "Fractional
  Chief Design Officer". Valid, and consistent with the v1.0 single-title-lane
  decision, but worth a deliberate look given the reader question logged in
  `MILESTONE-CONTEXT.md`.

## Outcome — 14/14 pass — Phase 10 SC5 satisfied (D-16/D-17/D-18/D-22/D-23)

Every row passes with proof on disk.

- **D-17** — Rich Results Test run on home, one project page and one blog post
- **D-23** — zero Rich Results errors on all three; the five Article findings are each `(optional)`
- **D-18** — Search Console property created, ownership verified, sitemap submitted with status Success and 19 pages discovered
- **D-22** — every check run against production, never a preview deployment
- **D-16/D-19** — proof artifacts captured and committed

**SEO-05 is complete.** Phase 10 is ready to close.
