---
phase: 09-cross-surface-verification
plan: 03
subsystem: seo
tags: [seo, json-ld, credibility, sweep]
dependency_graph:
  requires: [09-01]
  provides: [dead-schema-purge, $50M-alignment, chameleon-url-fix, placeholder-sweep]
  affects: [components/seo/structured-data.tsx, lib/metadata.ts, app/about]
tech_stack:
  added: []
  patterns: [cross-surface-verification, claim-alignment]
key_files:
  created: []
  modified:
    - components/seo/structured-data.tsx
    - lib/metadata.ts
    - app/about/page.tsx
    - app/about/about-client.tsx
    - app/blog/exploring-the-intersection-of-design-ai-and-design-engineering/page.mdx
decisions: []
metrics:
  duration: 576
  completed_date: "2026-08-20"
  task_count: 3
  file_count: 5
  commits:
    - f821933: refactor(09-03) remove dead schema exports
    - e5fd03a: feat(09-03) align $50M wording
    - 1d82ca9: fix(09-03) Chameleon URL and placeholder sweep
---

# Phase 09 Plan 03: Cross-Surface Cleanup Summary

Purged dead schema exports, aligned career-wide $50M wording, fixed Chameleon Collective URL, and completed bounded placeholder sweep.

## What Shipped

**Leaner structured-data.tsx:** Four zero-importer schema exports deleted (300 lines removed), keeping only six live components with active importers.

**Uniform $50M wording:** Career-wide surfaces now read `$50M product value delivered` (no `+`); Nagarro-specific `$50M+ in business impact` isolated to its page copy.

**Chameleon URL fixed:** Updated to `https://chameleoncollective.com` (returns 200 directly, avoiding 2-hop redirect chain).

**Placeholder sweep complete:** Removed "Further Reading" section with three `example.com` fake links from blog post; confirmed zero hits for lorem/ipsum/TODO/TBD.

## Tasks Completed

### Task 1: Delete Dead Schema Exports (D-10)

**Outcome:** Deleted four zero-importer exports from `components/seo/structured-data.tsx` (300 lines removed).

**What was deleted:**

1. **OrganizationStructuredData** (lines 36-74)
   - Contained: Wealthberry Labs org claims (founder, employee, industry)
   - Reason deleted: 0 importers

2. **ProfessionalServiceStructuredData** (lines 276-329)
   - Contained: Randy Ellis Design Services catalog (AI Product Design, Design Systems, Product Leadership offers)
   - Reason deleted: 0 importers

3. **FAQStructuredData** (lines 331-372)
   - Contained: Site-level FAQ with "240K+ active users across 25K+ cities" scaling answer
   - Reason deleted: 0 importers (the `project-faq.tsx` comment was not an actual import)

4. **FractionalCDOServiceStructuredData** (lines 539-699)
   - Contained: Fractional CDO service claims, Chameleon Collective partnership mentions (lines ~605, ~664), Go Fractional / Catalant / Toptal platforms
   - Reason deleted: 0 importers

**What was kept:** Six live exports with active importers:
- BreadcrumbStructuredData (6+ importers)
- PersonStructuredData (1 importer: app/layout.tsx)
- WebsiteStructuredData (1 importer: app/layout.tsx)
- ArticleStructuredData (4+ importers: blog mdx pages)
- CreativeWorkStructuredData (1+ importers: [slug] + Plan 02 routes)
- LocalBusinessStructuredData (1 importer)

**Shared imports kept:** `useEffect`, `trackStructuredDataView` (used by LocalBusinessStructuredData), `createAbsoluteUrl` (used by Person/Website/Article/CreativeWork/LocalBusiness).

**Note for Phase 10:** All deleted exports are recoverable from git history (commit f821933) if Phase 10 selects one as the agreed service representation.

**Gates:** `npm run lint` ✓, `npx tsc --noEmit` ✓, `npx jest __tests__/seo` ✓ (196 tests passed)

**Commit:** f821933

---

### Task 2: Align $50M Wording (D-15, D-18)

**Outcome:** Career-wide surfaces now uniformly read `$50M product value` (no `+`); Nagarro-specific claim isolated.

**Changes made:**

1. **lib/metadata.ts** line 25
   - Before: `$50M+ product value delivered.`
   - After: `$50M product value delivered.` (removed `+`)

2. **app/about/page.tsx** line 25
   - Before: `$50M value delivered.`
   - After: `$50M product value delivered.` (added `product value`)

**Rationale:** Per D-18, visible copy wins. All visible surfaces (about card, animated counter, homepage terminal, both OG images) say `$50M` with `product value` and no `+`, so metadata conforms.

**Final $50M surface inventory** (for Plan 04 matrix Part D):

| File:Line | Exact Wording | Type | Notes |
|-----------|---------------|------|-------|
| app/opengraph-image.tsx:143 | `$50M` + label `Product Value` | career-wide | Already canonical |
| app/about/opengraph-image.tsx:264 | `$50M` + label `Product Value` | career-wide | Already canonical |
| app/about/about-client.tsx:41 | `value: "$50M"`, label `"Product Value"` | career-wide | Already canonical |
| components/core/animated-number-basic.tsx:102 | counter to 50 with `$`/`M`, caption `in product value` | career-wide | Already canonical |
| app/page.tsx:349 | `Portfolio optimized for $50M product value` | career-wide | Already canonical |
| lib/metadata.ts:25 | `$50M product value delivered.` | career-wide | FIXED (was `$50M+`) |
| app/about/page.tsx:25 | `$50M product value delivered.` | career-wide | FIXED (was `$50M value`) |
| app/projects/nagarro/nagarro-client.tsx:552 | `$50M+ in business impact.` | Nagarro-specific | KEPT as-is (different claim, confirmed) |
| app/projects/nagarro/page.tsx:7 | `generating $50M+ in business impact` | Nagarro-specific | Owned by Plan 02 (same wave); not modified here |

**Verification:** `grep -rn '50M+' app lib components | grep -v 'app/projects/nagarro/'` returned 0 hits (only Nagarro has `$50M+`).

**Gates:** `npm run lint` ✓, `npx tsc --noEmit` ✓

**Commit:** e5fd03a

---

### Task 3: Verify/Fix Chameleon URL & Placeholder Sweep (D-16, D-17)

**Outcome:** Chameleon link now resolves 200 in one hop; placeholder sweep hits enumerated and the only real copy hit fixed.

#### D-16: Chameleon Collective URL Fix

**Redirect chain recorded** (as of 2026-08-20):
```
https://www.chameleon.co
  → 308 → https://chameleon.co/
  → 308 → https://chameleoncollective.com/
  → 200
```

**Fix applied:** Set `companyUrl` in `app/about/about-client.tsx` line 56 to `https://chameleoncollective.com` (returns HTTP/2 200 directly, avoiding 2-hop chain).

**Anchor verification:** `companyUrl` is rendered with `target="_blank"` and `rel="noopener noreferrer"` (confirmed by grep, no changes needed).

**structured-data.tsx:** No URL fix needed. After Task 1 deletions, the two remaining "Chameleon" hits are name mentions only (PersonStructuredData description line 87 + knowsAbout line 133). No URLs.

#### D-17: Bounded Placeholder Sweep

**Sweep results** (for Plan 04 matrix Part F):

| Pattern | Hits | Disposition |
|---------|------|-------------|
| `example.com` | 8 total | 1 fixed, 4 excluded (docs), 1 excluded (HTML attr) |
| `lorem` / `ipsum` | 0 | Clean |
| `placeholder` (as copy, not HTML attr) | 0 | Clean (all hits were `placeholder=` props) |
| `TODO` / `TBD` / `FIXME` / `Coming Soon` / `John Doe` / `Acme` | 0 | Clean |

**example.com detail:**

- **FIXED:** `app/blog/exploring-the-intersection-of-design-ai-and-design-engineering/page.mdx` lines 133-137
  - Deleted entire "### Further Reading" section with three fake links:
    - `[Designing for AI](https://example.com/designing-for-ai)`
    - `[The Future of Design Systems](https://example.com/future-design-systems)`
    - `[Ethical AI Guidelines](https://example.com/ethical-ai)`
  - Also deleted redundant `---` separator (left clean transition from "Questions for Reflection" to "Music for Inspiration")
  - Reason: placeholder links, not real references; removal is the honest fix

- **EXCLUDED (documentation, not copy):**
  - `lib/email/README.md` lines 29, 41, 52, 56 — four example email addresses in code examples

- **EXCLUDED (HTML attribute, allowed by D-17):**
  - `app/admin/email-test/page.tsx` line 205 — `placeholder="test@example.com"` attribute

**Verification:** After sweep, `grep -rn "example\.com" app lib components | grep -v 'placeholder="test@example.com"'` returns only the README.md doc hits.

**Gates:** `npm run lint` ✓, `npx tsc --noEmit` ✓

**Commit:** 1d82ca9

---

## Deviations from Plan

None. Plan executed exactly as written. All findings pre-enumerated in plan interfaces matched live scan.

---

## Threat Flags

None. Outbound link change (Chameleon URL) improves UX (fewer redirects) without introducing new surface.

---

## Findings for Plan 04 Matrix

### Part A: Dead Schema Removed

| Export | Stale Claims Carried | Recovery Note |
|--------|---------------------|---------------|
| OrganizationStructuredData | Wealthberry Labs org (founder, employee, industry) | Recoverable from git f821933 if Phase 10 needs org schema |
| ProfessionalServiceStructuredData | Randy Ellis Design Services catalog (AI Product Design, Design Systems, Product Leadership offers) | Recoverable from git f821933 if Phase 10 needs service schema |
| FAQStructuredData | "240K+ active users across 25K+ cities" FAQ answer (site-level, not project-specific) | Recoverable from git f821933 if Phase 10 needs site FAQ |
| FractionalCDOServiceStructuredData | Chameleon Collective / Go Fractional service description, Fractional CDO service catalog with 5 platform names | Recoverable from git f821933 if Phase 10 selects this as agreed service representation |

### Part D: $50M Surface Inventory

(See Task 2 table above for file:line + wording + type breakdown)

**Key:**
- Career-wide claim: `$50M product value` (no `+`) — now uniform across 7 surfaces
- Nagarro-specific claim: `$50M+ in business impact` — isolated to 2 surfaces (nagarro-client.tsx + page.tsx, the latter owned by Plan 02)

### Part D: Chameleon Collective URL Chain

```
Source URL: https://www.chameleon.co
  → 308 Permanent Redirect → https://chameleon.co/
  → 308 Permanent Redirect → https://chameleoncollective.com/
  → 200 OK

Direct test: https://chameleoncollective.com → HTTP/2 200 OK
```

**Result:** `app/about/about-client.tsx` now uses the 200 destination directly.

### Part F: Placeholder Sweep Hits

| Hit | File | Line | Disposition | Detail |
|-----|------|------|-------------|--------|
| example.com | blog MDX | 135-137 | FIXED | Deleted "Further Reading" section with 3 fake links |
| example.com | lib/email/README.md | 29, 41, 52, 56 | EXCLUDED | Documentation code examples |
| example.com | app/admin/email-test/page.tsx | 205 | EXCLUDED | HTML `placeholder=` attribute (allowed) |
| lorem/ipsum | — | — | CLEAN | 0 hits |
| placeholder (copy) | — | — | CLEAN | 0 hits (all were HTML `placeholder=` props) |
| TODO/TBD/FIXME/Coming Soon/John Doe/Acme | — | — | CLEAN | 0 hits |

---

## Self-Check: PASSED

**Created files exist:** None (this plan only modifies existing files).

**Modified files exist:**
```bash
✓ components/seo/structured-data.tsx
✓ lib/metadata.ts
✓ app/about/page.tsx
✓ app/about/about-client.tsx
✓ app/blog/exploring-the-intersection-of-design-ai-and-design-engineering/page.mdx
```

**Commits exist:**
```bash
✓ f821933: refactor(09-03) remove dead schema exports
✓ e5fd03a: feat(09-03) align $50M wording
✓ 1d82ca9: fix(09-03) Chameleon URL and placeholder sweep
```

**Build gates:**
```bash
✓ npm run lint — 0 warnings, 0 errors
✓ npx tsc --noEmit — clean (no errors outside .next/types)
✓ npx jest __tests__/seo — 196 tests passed
```

**Acceptance criteria from plan:**
```bash
✓ grep -cw "OrganizationStructuredData|..." structured-data.tsx → 0
✓ grep -c "^export function" structured-data.tsx → 6
✓ grep -c "25K+ cities|FAQPage" structured-data.tsx → 0
✓ grep -c "Chameleon" structured-data.tsx → 2 (Person desc + knowsAbout only)
✓ grep -c '$50M product value delivered' lib/metadata.ts → 1
✓ grep -c '$50M product value delivered' app/about/page.tsx → 1
✓ grep -rn '50M+' app lib components | grep -v nagarro → 0 hits
✓ grep -c "https://chameleoncollective.com" about-client.tsx → 1
✓ curl -s -o /dev/null -w '%{http_code}' https://chameleoncollective.com → 200
✓ grep -c "Chameleon" structured-data.tsx → 2 (no lowercase URL host)
✓ grep -c "Further Reading|example.com" blog MDX → 0
✓ grep -rn "example\.com" app lib components → 1 allowed HTML attr + 4 README docs
✓ grep -rni "lorem|ipsum" app lib components → 0
```

---

## Success Criteria

- [x] D-10, D-15, D-16, D-17 each have concrete outcome recorded (see tasks above)
- [x] No new schema/claims introduced (only removals and wording alignment)
- [x] Dead-export greps return 0
- [x] $50M+ appears only in nagarro-client.tsx
- [x] example.com only in allowed HTML attribute + docs
- [x] Findings lists written for Plan 04 (Parts A, D, F — see above)

---

**Ready for Plan 04:** Matrix input prepared (dead exports with claims, $50M surface inventory, Chameleon chain, placeholder sweep hits).
