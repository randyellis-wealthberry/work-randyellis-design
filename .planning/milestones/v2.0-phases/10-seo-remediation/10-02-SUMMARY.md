---
phase: 10-seo-remediation
plan: 02
subsystem: seo-infrastructure
tags: [seo, robots, redirects, middleware, crawlability, tdd]
dependency_graph:
  requires: []
  provides: [open-ai-crawlers, test-route-cleanup, sw-js-no-cache]
  affects: [robots.txt, sitemap-crawlability, middleware-headers]
tech_stack:
  added: []
  patterns: [tdd-red-green, server-metadata, middleware-cache-headers]
key_files:
  created:
    - __tests__/seo/robots.test.ts
    - __tests__/seo/redirects.test.ts
    - __tests__/seo/middleware-indexing.test.ts
  modified:
    - app/robots.ts
    - next.config.js
    - middleware.ts
    - jest.setup.ts
decisions:
  - Open robots.txt to AI crawlers (D-21) with one consistent rule group repeating the 4 disallows (T-10-05)
  - Remove /_next/ from robots disallow to enable Googlebot JS/CSS rendering (T-02)
  - Permanent redirects for deleted /test-glow and /test/:path* to home (D-07)
  - Single merged redirects() in next.config.js fixing duplicate-definition bug
  - /sw.js served with max-age=0 no-immutable cache to force re-fetch of kill switch (D-03)
  - jest.setup.ts conditionally mocks window globals only in jsdom environment (Rule 3 fix)
metrics:
  duration: 15m
  completed: 2026-08-21T19:50:41Z
  tasks_complete: 3
  files_changed: 7
  tests_added: 12
---

# Phase 10 Plan 02: Crawlability Unblocking & Test Route Cleanup Summary

**One-liner:** Opened robots.txt to AI crawlers with consistent 15-bot allow group, removed `/_next/` block to enable Googlebot rendering, added 301s for deleted `/test*` routes, killed dead middleware checks, and no-cached `/sw.js` for immediate kill-switch activation — all test-proven via TDD.

## Overview

Executed three remediation areas from SEO-AUDIT.md:
1. **robots.txt policy** (T-02, T-07): Removed `/_next/` disallow blocking Googlebot's JS/CSS fetch, replaced five separate AI-crawler `disallow: "/"` groups with one 15-bot allow group sharing the 4 standard disallows (T-10-05 mitigation: `/admin/`, `/api/`, `/private/`, `/drafts/` repeated for AI crawlers because they ignore `*`)
2. **Test route cleanup** (T-03): Deleted empty `app/test/` tree and untracked Docusaurus scaffold at repo-root `test/`, added permanent redirects for `/test-glow` and `/test/:path*` to home, merged duplicate `redirects()` in `next.config.js`, removed dead `/test-glow` and `/offline` middleware checks
3. **Service worker cache fix** (D-03): `/sw.js` now served with `max-age=0, must-revalidate` (inserted as first branch in `applyCacheHeaders`) so the kill-switch self-unregisters on returning visitors' first post-deploy visit instead of waiting up to 24h on an immutable cached copy

## Tasks Completed

### Task 1: robots.ts — remove /_next/, open AI crawlers (TDD)

**RED:** Created `__tests__/seo/robots.test.ts` with 5 assertions:
- No `/_next/` in any disallow (T-02)
- No `disallow: "/"` rules (D-21)
- `*` rule has `allow: "/"` + exactly 4 disallows
- AI-crawler group contains all 15 named bots with same 4 disallows
- Sitemap + host fields present

Tests failed against existing 6-group file (one `*` + five separate AI blocks each with `disallow: "/"`).

**GREEN:** Rewrote `app/robots.ts` to emit exactly two rule groups:
1. `{ userAgent: "*", allow: "/", disallow: ["/private/", "/admin/", "/api/", "/drafts/"] }` — removed `/_next/` per D-21/T-02 (Googlebot needs `/_next/static` to render; Next.js never recommends blocking it)
2. `{ userAgent: [15 AI tokens], allow: "/", disallow: ["/private/", "/admin/", "/api/", "/drafts/"] }` — dedicated group required because crawlers matching a specific `User-agent` ignore `*` (T-10-05 mitigation)

AI crawlers: GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web, Claude-SearchBot, Claude-User, anthropic-ai, CCBot, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, Bytespider, meta-externalagent.

Tests pass. `/admin/` appears 2× (both groups). Trade-off: increased AI training/response inclusion vs. AEO/GEO visibility (D-21 accepted).

**Commits:**
- `fb4dfde` test(10-02): add failing robots.ts policy test
- `7a6393c` feat(10-02): open robots.txt to AI crawlers and stop blocking /_next/

### Task 2: next.config.js + middleware cleanup (TDD)

**RED:** Created two test files:
- `__tests__/seo/redirects.test.ts`: asserts `/ledgeriq` preserved, `/test-glow` and `/test/:path*` redirect to `/`, exactly one `redirects()` definition, zero `next-pwa`/`withPWA` references
- `__tests__/seo/middleware-indexing.test.ts` (node env): `/sw.js` gets `max-age=0` no-immutable, `/admin/*` and `/api/*` noindexed, prod host allows indexing, preview hosts block, source contains no `/test-glow` or `/offline` strings

Tests failed (missing redirects, duplicate `redirects()`, dead middleware checks).

**Blocking issue (Rule 3):** `jest.setup.ts` unconditionally accessed `window.matchMedia`, crashing node-environment tests with "window is not defined". Fixed by wrapping all window-dependent mocks in `if (typeof window !== "undefined")` guard. This is a pre-existing configuration bug, not a plan deviation — the fix unblocks test execution.

**GREEN:**

**next.config.js:**
- Deleted commented-out `next-pwa` block (lines 1-58) and trailing PWA comment lines (D-01 clean break)
- Merged two `async redirects()` definitions into one (duplicate-definition bug: second silently won), keeping first position
- Added redirects: `{ source: "/test-glow", destination: "/", permanent: true }`, `{ source: "/test/:path*", destination: "/", permanent: true }` (D-07: deleted dev routes 301 to home; `:path*` covers `/test/codeblock` and any future bookmark)

**middleware.ts:**
- Inserted new first branch in `applyCacheHeaders`: `if (pathname === "/sw.js") { set "Cache-Control": "public, max-age=0, must-revalidate", "CDN-Cache-Control": "max-age=0", "Vercel-CDN-Cache-Control": "max-age=0"; return response; }` (D-03: kill-switch must always be re-fetched)
- Removed `/test-glow` and `/offline` from `shouldBlockIndexing` (routes deleted: `/test-glow` redirected before middleware runs per pipeline order; `/offline` deleted by Plan 10-01)

**Header triplication check:** `next.config.js headers()` and `vercel.json` define NO Cache-Control rule matching `/sw.js` or generic `*.js` — middleware is the only place. No sync edit needed. (Triplication rule: headers set in middleware, next.config headers(), and vercel.json must stay in sync. For `/sw.js`, only middleware applies.)

Tests pass. `npm run lint` → `npx tsc --noEmit` clean.

**Commits:**
- `e7caa51` test(10-02): add failing redirect and middleware indexing tests
- `d4bdfa3` feat(10-02): redirect deleted test routes, merge redirects(), drop dead middleware checks, no-cache sw.js

### Task 3: Remove app/test tree, D-05 dev-route audit, dispose root test/ scaffold

**Disposal (performed on primary checkout path per untracked-dirs exemption):**

1. **app/test:** Confirmed `find app/test -type f` empty, then `rmdir app/test/codeblock app/test`. Verified `app/test-glow` already absent. D-04 satisfied: no test route files or directories remain.

2. **Root test/ Docusaurus scaffold:** Verified all markers exist (intro.mdx, first-blog-post.mdx, index.tsx, "@docusaurus/core" in package.json, `git ls-files test | wc -l` == 0) → stock `create-docusaurus` output with no project content. Ran `rm -rf /Users/MacBook/Developer/work.randyellis.design/test`. It was untracked, not served by Next, not type-checked, and its `node_modules` was not excluded by jest's custom ignore list — pure hazard.

3. **D-05 route audit:** Classified every `app/**/page.{tsx,mdx}` and `app/**/route.ts` found by `find` + `grep -rln -i "test|demo|debug|dev"` inspection:

**Route Audit Table:**

| Route | Class | Action | Rationale |
|-------|-------|--------|-----------|
| `/` | nav-linked | keep | Homepage, nav link |
| `/about` | nav-linked + documented | keep | Nav link, documented structure |
| `/projects` | nav-linked | keep | Nav link |
| `/projects/[slug]` | documented | keep | Dynamic template (3 projects) |
| `/projects/addvanced` | documented | keep | Bespoke static route |
| `/projects/echo` | documented | keep | Bespoke static route |
| `/projects/nagarro` | documented | keep | Bespoke static route |
| `/projects/rambis-ui` | documented | keep | Bespoke static route |
| `/projects/waffle` | documented | keep | Bespoke static route |
| `/blog` | nav-linked | keep | Nav link |
| `/blog/claude-obsidian-workflows` | documented | keep | Blog post (MDX) |
| `/blog/create-professional-videos-claude-code-guide` | documented | keep | Blog post (MDX) |
| `/blog/exploring-the-intersection-of-design-ai-and-design-engineering` | documented | keep | Blog post (MDX) |
| `/blog/profits-not-pixels` | documented | keep | Blog post (MDX) |
| `/metis` | sitemap-listed + documented | keep | Documented structure (sitemap static URL) |
| `/privacy-policy` | documented | keep | Footer legal page |
| `/terms-of-service` | documented | keep | Footer legal page |
| `/admin/email-test` | admin | keep + noindex | D-06: admin tooling, robots disallow + X-Robots-Tag |
| `/admin/test-results-demo` | admin | keep + noindex | D-06: admin tooling, robots disallow + X-Robots-Tag |
| `/offline` | deleted | ignore | Deleted by Plan 10-01 (parallel wave) |
| `/test-glow` | deleted | n/a | Already deleted (no route file found) |
| `/test/codeblock` | deleted | n/a | Empty dir removed (step 1) |
| `/api/cdn/optimize` | API | n/a | Not a page route |
| `/api/csp-report` | API | n/a | Not a page route |
| `/api/newsletter/*` | API | n/a | Not page routes (5 endpoints) |

**Outcome:** Every page route classified. Only candidates were `/offline` (Plan 10-01), `/test/*` (removed step 1), and `/admin/*` (kept + noindexed per D-06). No other dev-only routes found. `app/data/` directory does not exist (no route — Next ignores dirs without page files). `/admin/` still disallowed in `app/robots.ts` (verified: 2 occurrences, one per group).

**Commits:**
- `173c03c` chore(10-02): remove empty app/test dirs, record dev-route audit, dispose root test/ scaffold (empty commit — untracked dirs removed on primary, SUMMARY is the record)

## Verification

All tasks verified via automated checks:

```bash
# Task 1
npx jest __tests__/seo/robots.test.ts  # 5 passing
grep -c "/_next/" app/robots.ts  # 1 (comment only, not in disallow)
grep -A1 'disallow:' app/robots.ts | grep '_next'  # no output
grep -c 'disallow: "/"' app/robots.ts  # 0
grep -c "GPTBot\|ClaudeBot\|PerplexityBot\|Google-Extended" app/robots.ts  # 4
grep -c '"/admin/"' app/robots.ts  # 2

# Task 2
npx jest __tests__/seo/redirects.test.ts __tests__/seo/middleware-indexing.test.ts  # 7 passing
grep -c "async redirects()" next.config.js  # 1
grep -c "next-pwa\|withPWA" next.config.js  # 0
grep -c 'source: "/test-glow"' next.config.js  # 1
grep -c 'source: "/test/:path\*"' next.config.js  # 1
grep -c '"/test-glow"\|"/offline"' middleware.ts  # 0
grep -c 'pathname === "/sw.js"' middleware.ts  # 1
grep -c 'startsWith("/admin")' middleware.ts  # 1
npm run lint  # ✔ No ESLint warnings or errors
npx tsc --noEmit  # no output (clean)

# Task 3
test ! -d app/test  # success
test ! -d app/test-glow  # success
test ! -d /Users/MacBook/Developer/work.randyellis.design/test  # success
ls app/admin/email-test/page.tsx app/admin/test-results-demo/page.tsx  # both exist
grep -c "/admin/" app/robots.ts  # 2
```

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking Issue] Fixed jest.setup.ts window globals for node environment tests**
- **Found during:** Task 2 RED phase
- **Issue:** `jest.setup.ts` unconditionally accessed `window.matchMedia` and other window properties, causing "window is not defined" error when running `/** @jest-environment node */` tests. `__tests__/seo/middleware-indexing.test.ts` requires node environment so NextRequest/Headers globals exist.
- **Fix:** Wrapped all window-dependent mocks (`matchMedia`, `IntersectionObserver`, `requestIdleCallback`, `cancelIdleCallback`) in `if (typeof window !== "undefined")` guard so they only run in jsdom environment.
- **Files modified:** `jest.setup.ts`
- **Commit:** `d4bdfa3` (bundled with Task 2 GREEN — fix was prerequisite for test execution)
- **Rationale:** Pre-existing configuration bug, not a plan deviation. The plan explicitly called for node environment tests. Fixing the shared setup file unblocks all future node-environment test files (e.g., server-side metadata tests, API route tests).

No other deviations. Plan executed exactly as written.

## Threat Surface Scan

No new security-relevant surface introduced. Changes are policy/cleanup:
- robots.txt policy change is intentional (D-21 trade-off: AI visibility vs. scraping)
- Redirects are literal `/` destination (no user input, no open redirect — T-10-06 mitigated)
- /sw.js cache rule weakens caching for kill-switch path only (does not loosen security headers — T-10-07 mitigated)
- /admin/* retained and noindexed per D-06 (no secrets in those pages — T-10-08 accepted)

All threats in plan's STRIDE register accounted for.

## Known Stubs

None. No data-flow stubs introduced.

## Key Files

### Created
- `__tests__/seo/robots.test.ts` — 5 tests asserting robots() output shape (no /_next/, AI allow group, disallow list, sitemap URL)
- `__tests__/seo/redirects.test.ts` — 3 tests asserting next.config.js redirects() entries and single definition
- `__tests__/seo/middleware-indexing.test.ts` — 4 tests (node env) asserting /sw.js cache, /admin+/api noindex, host-based indexing, no dead route checks in source

### Modified
- `app/robots.ts` — Two rule groups: `*` and AI-crawler list, both allow `/` with 4 disallows; sitemap + host
- `next.config.js` — Single `redirects()` with `/ledgeriq`, `/test-glow`, `/test/:path*` entries; no next-pwa comment block
- `middleware.ts` — `shouldBlockIndexing` = `/admin` + `/api` only; `/sw.js` cache rule inserted as first branch in `applyCacheHeaders`
- `jest.setup.ts` — Window-dependent mocks guarded by `typeof window !== "undefined"` check

## Integration Points

**Pipeline order confirmation:** next.config `headers` → `redirects` → middleware → rewrites. A `/test-glow` request is redirected to `/` before middleware runs, so the removed `/test-glow` check in `shouldBlockIndexing` was dead code.

**Header triplication (ARCHITECTURE.md anti-pattern):** Verified `/sw.js` Cache-Control set ONLY in `middleware.ts`. `next.config.js headers()` has no `/sw.js` or `*.js` rule (only `/_next/static` gated to prod). `vercel.json` has no `/sw.js` or `*.js` rule. No sync edit needed.

**Plan 10-01 parallel coordination:** Did not touch `app/offline/`, `app/manifest.ts`, `components/pwa/`, or `public/sw.js` content (Plan 10-01 owns those deletions). Middleware removed `/offline` check (safe: Plan 10-01 deletes the route file).

## Success Criteria

✅ ROADMAP Phase 10 SC2 satisfied at code level:
- robots.txt no longer disallows `/_next/` (Googlebot can render)
- `/test/*` routes deleted with 301s to home
- AI crawler policy is one consistent 15-bot allow group (no more separate `disallow: "/"` rules)

✅ D-04, D-05, D-06, D-07, D-21 implemented and cited in code comments and SUMMARY

✅ All tests green (12 new assertions across 3 test files)

✅ Lint + tsc clean

✅ Dev-route audit table complete (every `app/` route classified)

✅ Root `test/` Docusaurus scaffold disposed of (stock scaffold markers verified, deleted from primary checkout)

## Self-Check: PASSED

**Created files exist:**
```bash
[ -f "__tests__/seo/robots.test.ts" ] && echo "FOUND"  # FOUND
[ -f "__tests__/seo/redirects.test.ts" ] && echo "FOUND"  # FOUND
[ -f "__tests__/seo/middleware-indexing.test.ts" ] && echo "FOUND"  # FOUND
```

**Commits exist:**
```bash
git log --oneline --all | grep fb4dfde  # FOUND (test robots)
git log --oneline --all | grep 7a6393c  # FOUND (feat robots)
git log --oneline --all | grep e7caa51  # FOUND (test redirects+middleware)
git log --oneline --all | grep d4bdfa3  # FOUND (feat redirects+middleware)
git log --oneline --all | grep 173c03c  # FOUND (chore test cleanup)
```

**Modified files have expected content:**
```bash
grep -q "GPTBot" app/robots.ts  # yes
grep -q "ClaudeBot" app/robots.ts  # yes
grep -q "/test-glow" next.config.js  # yes (redirect source)
grep -q 'pathname === "/sw.js"' middleware.ts  # yes
grep -q 'typeof window !== "undefined"' jest.setup.ts  # yes
```

All claims verified.

---

**Execution:** 2026-08-21T19:34:40Z to 2026-08-21T19:50:41Z (15 minutes)  
**Commits:** 5 (2 RED, 2 GREEN, 1 cleanup)  
**Tests added:** 12 (5 robots, 3 redirects, 4 middleware)  
**Files changed:** 7 (3 created, 4 modified)  
**Requirements:** SEO-02 ✓, SEO-03 ✓
