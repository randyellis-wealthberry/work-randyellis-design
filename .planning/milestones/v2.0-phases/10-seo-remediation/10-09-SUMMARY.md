---
phase: 10-seo-remediation
plan: 09
subsystem: seo
tags: [seo, verification, post-deploy, live, curl, production]
dependency_graph:
  requires: ["10-01", "10-02", "10-03", "10-04", "10-05", "10-06", "10-07", "10-08"]
  provides: [SEO-01, SEO-02, SEO-03, SEO-04, SEO-05]
  affects: ["10-10"]
tech_stack:
  added: []
  patterns: [live-verification, proof-capture, curl-testing]
key_files:
  created:
    - .planning/phases/10-seo-remediation/10-verification-screenshots/robots.txt
    - .planning/phases/10-seo-remediation/10-verification-screenshots/sitemap.xml
    - .planning/phases/10-seo-remediation/10-verification-screenshots/sw.js.txt
    - .planning/phases/10-seo-remediation/10-verification-screenshots/redirects.txt
    - .planning/phases/10-seo-remediation/10-verification-screenshots/jsonld-home.txt
    - .planning/phases/10-seo-remediation/10-verification-screenshots/jsonld-growit.txt
    - .planning/phases/10-seo-remediation/10-verification-screenshots/jsonld-blog.txt
  modified:
    - .planning/phases/10-seo-remediation/10-VERIFICATION-CHECKLIST.md
decisions:
  - D-22: All verification against production domain only (never preview)
  - D-23: Rich Results Test errors block phase completion (warnings expected)
  - Browser automation unavailable (Playwright not installed) - RRT and SW checks deferred to human verification in Plan 10-10
requirements_completed: [SEO-01, SEO-02, SEO-03, SEO-04, SEO-05]
metrics:
  duration: 15
  completed_date: "2026-08-21"
  task_count: 3
  file_count: 8
  commits:
    - 208d334: docs(10-09) record live curl verification results (rows 1-8)
    - f9a1ffc: docs(10-09) record Rich Results / service worker automation results (rows 9-12)
completed: 2026-08-21
---

# Phase 10 Plan 09: Live Verification — Curl Checks + Deployment Proof

**Phase 10 SEO fixes confirmed live on production (commit 69e214a): robots.txt with AI crawler allowlist and no /_next/ blocks, sitemap.xml with 19 timestamped URLs, kill-switch sw.js serving with max-age=0, permanent redirects for /test routes, 404s for deleted PWA routes, and server-rendered JSON-LD (Person+WebSite on home, CreativeWork+Breadcrumb on projects, Article+Breadcrumb on blog) — all 8 curl checks passed with raw proof files; browser automation unavailable (Playwright not installed) leaving RRT and SW checks pending for Plan 10-10.**

## What Shipped

**Production deployment verified:** Commit `69e214a37ffe1e9da7369311e6a7ecf237d9403f` confirmed live on https://work.randyellis.design via kill-switch sw.js presence check (`registration.unregister` found in body, no `precacheAndRoute`).

**Curl verification (rows 1-8) — all passed with proof files:**

1. **robots.txt** (646 bytes): Zero `/_next/` Disallow blocks, `User-agent: GPTBot` group present with `Allow: /`, sitemap declaration, `/admin/` blocked (2 occurrences)
2. **sitemap.xml** (3454 bytes): 19 `<url>` entries each with `<lastmod>` timestamp, includes `/privacy-policy` and `/terms-of-service`
3. **sw.js** (2381 bytes total): Kill-switch active (`registration.unregister` present), no `precacheAndRoute`, `Cache-Control: max-age=0` in headers (2 occurrences)
4. **Redirects**: `/test-glow` and `/test/codeblock` both → 308 permanent redirect to `/`; `/ledgeriq` → 308 to `/projects/ledgeriq`
5. **Deleted PWA routes**: `/offline` → 404, `/manifest.webmanifest` → 404 (as expected)
6. **Home JSON-LD** (144678 bytes): 4 `application/ld+json` scripts, contains `"@type":"Person"` and `"@type":"WebSite"`, uses `x.com/iamrandyellis` (not `twitter.com`), no `Organization` or `FAQPage` types
7. **GrowIt project JSON-LD** (207039 bytes): Contains `"@type":"CreativeWork"` and `"@type":"BreadcrumbList"`, no `FAQPage`
8. **Blog post JSON-LD** (83946 bytes): Contains `"@type":"Article"`, `"@type":"BreadcrumbList"`, and `"@id":"https://work.randyellis.design/#person"` reference

**Browser automation (rows 9-12) — marked pending:** Playwright Node.js module not installed in project (not in `package.json`). Per plan guidance, rows 9-12 (Rich Results Test × 3, service worker unregistration check) marked as `pending` with note "Browser automation unavailable — human verification in Plan 10-10". No screenshots fabricated.

**Proof files saved:** All 7 curl outputs written to `10-verification-screenshots/` as raw evidence (robots.txt, sitemap.xml, sw.js.txt with headers, redirects.txt, jsonld-home.txt, jsonld-growit.txt, jsonld-blog.txt).

**Checklist updated:** Run log filled with deployed commit SHA `69e214a`, production URL, timestamp, and executor. Rows 1-8 status: `pass`. Rows 9-12 status: `pending`. Row 13 (Search Console) remains `pending` for Plan 10-10.

## Task Breakdown

### Task 1: Production Deployment Gate (human-action checkpoint)

**Checkpoint reached:** Presented deployment instructions to user after confirming:
- Git status: Some unrelated modifications to test/demo files (not Phase 10 work)
- HEAD SHA: `69e214a37ffe1e9da7369311e6a7ecf237d9403f`
- No PR exists for branch `gsd/phase-10-seo-remediation`
- 20+ Phase 10 commits ready to deploy

**User response:** "Deployment confirmed ready. Deployed commit SHA: 69e214a37ffe1e9da7369311e6a7ecf237d9403f. Production URL: https://work.randyellis.design. Pre-verification checks: ✅ sw.js serving kill-switch version, ✅ robots.txt has AI crawler group, ✅ robots.txt `/_next/` removed from Disallow"

**Verification passed:**
- `curl https://work.randyellis.design/sw.js | grep -c "registration.unregister"` → 1 ✓
- `curl https://work.randyellis.design/robots.txt | grep -vc "Disallow: /_next/"` → 30 ✓

**Outcome:** Deployment confirmed; proceeded to automated verification tasks.

### Task 2: Live Curl Verification (rows 1-8) — commit 208d334

**Created 7 proof files:**
- `robots.txt` (646 bytes)
- `sitemap.xml` (3454 bytes)
- `sw.js.txt` (2381 bytes — headers + body)
- `redirects.txt` (redirect test results for 5 routes)
- `jsonld-home.txt` (144678 bytes — raw HTML)
- `jsonld-growit.txt` (207039 bytes — raw HTML)
- `jsonld-blog.txt` (83946 bytes — raw HTML)

**Verification results:**

| Check | Expected | Result | Status |
|-------|----------|--------|--------|
| robots.txt /_next/ blocks | 0 | 0 | ✓ pass |
| robots.txt GPTBot | ≥1 | 1 | ✓ pass |
| robots.txt Sitemap | 1 | 1 | ✓ pass |
| robots.txt /admin/ | ≥1 | 2 | ✓ pass |
| sitemap.xml `<url>` | 19 | 19 | ✓ pass |
| sitemap.xml `<lastmod>` | 19 | 19 | ✓ pass |
| sitemap.xml /privacy-policy | 1 | 1 | ✓ pass |
| sitemap.xml /terms-of-service | 1 | 1 | ✓ pass |
| sw.js registration.unregister | ≥1 | 1 | ✓ pass |
| sw.js precacheAndRoute | 0 | 0 | ✓ pass |
| sw.js Cache-Control max-age=0 | ≥1 | 2 | ✓ pass |
| /test-glow redirect | 308→/ | 308→/ | ✓ pass |
| /test/codeblock redirect | 308→/ | 308→/ | ✓ pass |
| /ledgeriq redirect | 308→/projects/ledgeriq | 308→/projects/ledgeriq | ✓ pass |
| /offline status | 404 | 404 | ✓ pass |
| /manifest.webmanifest status | 404 | 404 | ✓ pass |
| Home ld+json scripts | ≥2 | 4 | ✓ pass |
| Home Person type | ≥1 | 1 | ✓ pass |
| Home WebSite type | ≥1 | 1 | ✓ pass |
| Home x.com (not twitter.com) | 0 twitter | 0 twitter, 2 x.com | ✓ pass |
| Home no Organization/FAQPage | 0 | 0 | ✓ pass |
| GrowIt CreativeWork | ≥1 | 1 | ✓ pass |
| GrowIt BreadcrumbList | ≥1 | 1 | ✓ pass |
| GrowIt no FAQPage | 0 | 0 | ✓ pass |
| Blog Article | ≥1 | 1 | ✓ pass |
| Blog BreadcrumbList | ≥1 | 1 | ✓ pass |
| Blog Person reference | ≥1 | 1 | ✓ pass |

**All 8 checklist rows: PASS**

**Checklist updated:** Rows 1-8 filled with Result (observed values), Proof (relative path to proof file), Status (`pass`), Notes (key observations). Run log filled with commit SHA, URL, timestamp.

**Committed:** `208d334` — docs(10-09): record live curl verification results (rows 1-8)

### Task 3: Browser Automation Attempt (rows 9-12) — commit f9a1ffc

**Attempted:** Playwright automation for Rich Results Test and service worker registration check.

**Blocker found:** Playwright Node.js module not installed in project:
- `command -v playwright` → found (CLI exists)
- `cat package.json | grep -i playwright` → "Playwright not in package.json"
- Attempted to run Node.js script using `require('playwright')` → `Error: Cannot find module 'playwright'`

**Decision:** Per plan Task 3 guidance: "If NO browser tool is available, or the tool is blocked (consent wall/captcha) after two attempts: leave rows 9–12 as `pending`, write 'automation unavailable — human step in 10-10' in Notes, and do NOT fabricate screenshots."

**Action taken:**
- Marked rows 9-12 as `pending` status
- Added note: "Browser automation unavailable (Playwright not installed) — human verification in Plan 10-10"
- Result column: `N/A`
- Proof column: `N/A`
- Did NOT create fabricated screenshots
- Did NOT attempt to install Playwright (package installation requires human verification per deviation rules)

**Checklist updated:** Rows 9-12 all show `pending` status with appropriate notes.

**Committed:** `f9a1ffc` — docs(10-09): record Rich Results / service worker automation results (rows 9-12)

## Performance

- **Duration:** ~15 minutes
- **Started:** 2026-08-21 (UTC)
- **Completed:** 2026-08-21 (UTC)
- **Tasks:** 3 (1 human checkpoint, 2 automated)
- **Files modified:** 8 (1 checklist + 7 proof files)
- **Commits:** 2

## Decisions Made

1. **Browser automation unavailable** — Playwright module not installed, not in package.json. Per plan guidance and deviation rules (package installs require human verification), marked rows 9-12 as pending for human execution in Plan 10-10 rather than attempting installation.

2. **Proof file formats** — Saved raw outputs exactly as received from curl: robots.txt and sitemap.xml as-is, sw.js.txt includes both headers (`curl -sI`) and body (`curl -s`) separated by `---BODY---` marker, redirects.txt includes both redirect checks and deleted route checks in one file, JSON-LD proof files are full raw HTML (not extracted JSON).

3. **No fabrication** — When browser automation unavailable, marked rows as `pending` with explicit notes rather than fabricating screenshots or skipping rows (honoring D-17, D-22, D-23 verification requirements).

## Deviations from Plan

None — plan executed exactly as written. Task 1 was a blocking human checkpoint (user confirmed deployment), Task 2 ran all curl checks and saved proof files, Task 3 attempted browser automation and correctly marked rows as pending when tools were unavailable per explicit plan guidance.

## Issues Encountered

None. All curl checks passed on first attempt. Browser automation unavailability was anticipated by the plan ("If NO browser tool is available... leave rows 9–12 as `pending`").

## Next Phase Readiness

**Ready for Plan 10-10 (Human Verification + Search Console):**
- Rows 1-8: Complete with proof files (curl-automated checks)
- Rows 9-12: Pending for human browser verification (Rich Results Test × 3, service worker unregistration)
- Row 13: Pending for human Search Console verification (sitemap submission)
- All proof files available for review/audit
- Production deployment confirmed and verified

**Blockers:** None. Plan 10-10 can proceed immediately.

## Self-Check: PASSED

✓ All 7 proof files exist and are non-empty:
- robots.txt: 646 bytes
- sitemap.xml: 3454 bytes
- sw.js.txt: 2381 bytes
- redirects.txt: (includes 5 route tests)
- jsonld-home.txt: 144678 bytes
- jsonld-growit.txt: 207039 bytes
- jsonld-blog.txt: 83946 bytes

✓ Checklist verification:
- `grep -c '| pass |' 10-VERIFICATION-CHECKLIST.md` → 8 (rows 1-8)
- `grep -c '| pending |' 10-VERIFICATION-CHECKLIST.md` → 5 (rows 9-13)

✓ Commits exist:
- `git log --oneline | grep 208d334` → found
- `git log --oneline | grep f9a1ffc` → found

---
*Phase: 10-seo-remediation*
*Plan: 09*
*Completed: 2026-08-21*
