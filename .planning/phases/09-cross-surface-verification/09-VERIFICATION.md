---
phase: 09-cross-surface-verification
verified: 2026-08-20T20:45:00Z
status: gaps_found
score: 17/18 must-haves verified
re_verification: false
gaps:
  - truth: "ROADMAP.md reflects reality: Phases 6–8 (done, previously unchecked) are checked and their progress-table rows read Complete (Claude's-discretion item, CONTEXT.md)"
    status: failed
    reason: "Commit 5e2a914 (dated after Plan 09-05's dd96ccf fix) reverted the Phase 7-8 checkbox updates and Progress table changes"
    artifacts:
      - path: ".planning/ROADMAP.md"
        issue: "Phase 7 checkbox unchecked (should be [x]), Progress table row 7 says 'Structural wiring complete' (should be 'Complete')"
      - path: ".planning/ROADMAP.md"
        issue: "Phase 8 checkbox unchecked (should be [x]), Progress table row 8 says 'Not started' (should be 'pre-GSD (traced) | Complete | 2026-08-16')"
    missing:
      - "Re-apply commit dd96ccf changes to ROADMAP.md (check Phases 7-8, update Progress table rows to 'Complete')"
---

# Phase 9: Cross-Surface Verification — Verification Report

**Phase Goal:** For every project touched this milestone, what a hiring manager reads on the page matches what a recruiter sees in metadata, the OG image, and the page source — closing the milestone the way v1.0's audit remediation did.

**Verified:** 2026-08-20T20:45:00Z  
**Status:** gaps_found  
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | For every project in PROJECTS, projectMetadata(project) returns title `{name} \| {subtitle}`, description = project.description, canonical `/projects/{slug}`, og:type article, og:image = thumbnail-or-first-image, and mechanical keywords (D-02..D-08) | ✓ VERIFIED | lib/metadata.ts exports projectMetadata; 588 tests pass in project-metadata.test.ts covering all 8 PROJECTS entries |
| 2 | projectCreativeWorkProps(project) and projectBreadcrumbItems(project) derive every value from the PROJECTS entry so JSON-LD on all 7 routes can be fed from one source (D-11, D-12) | ✓ VERIFIED | lib/metadata.ts exports both helpers; 588 tests verify derivation from PROJECTS; all routes use helpers |
| 3 | A Jest regression test fails CI if any of the above stops deriving from the data (D-14) | ✓ VERIFIED | __tests__/seo/project-metadata.test.ts (303 lines, 588 tests pass); __tests__/seo/project-route-wiring.test.ts (130 lines, 52 tests pass) |
| 4 | All 5 project route files (`[slug]` + addvanced/echo/nagarro/rambis-ui) produce their `<head>` metadata via projectMetadata(project) — no hand-typed title/description/OG strings remain (D-01, D-02) | ✓ VERIFIED | grep confirms all 5 routes call `projectMetadata(project)`; no literal `openGraph:` keys in route files |
| 5 | All 7 case-study routes emit CreativeWorkStructuredData and BreadcrumbStructuredData (Home › Projects › {name}) fed from their PROJECTS entry (D-11, D-12) | ✓ VERIFIED | grep confirms all 5 routes (growit/ohplays/ledgeriq via [slug], plus addvanced/echo/nagarro/rambis-ui) render both structured data components |
| 6 | `[slug]` no longer emits FAQPage JSON-LD and components/seo/project-faq.tsx no longer exists (D-09) | ✓ VERIFIED | `test ! -f components/seo/project-faq.tsx` succeeds; `grep -rn "ProjectFAQStructuredData\|seo/project-faq" app lib components/seo` returns 0 hits |
| 7 | Waffle keeps createPageMetadata and gains no CreativeWork/Breadcrumb (D-13) | ✓ VERIFIED | app/projects/waffle/page.tsx uses `createPageMetadata`, does NOT call `projectMetadata`; no CreativeWorkStructuredData or BreadcrumbStructuredData |
| 8 | A route-wiring Jest test fails if any of the 5 routes stops calling the helpers or reintroduces ProjectFAQStructuredData (D-14) | ✓ VERIFIED | __tests__/seo/project-route-wiring.test.ts exists (130 lines), 52 tests pass, verifies all 5 routes use helpers and Waffle exclusion |
| 9 | components/seo/structured-data.tsx exports only schema components with importers; zero-importer FAQStructuredData, OrganizationStructuredData, ProfessionalServiceStructuredData, FractionalCDOServiceStructuredData are gone (D-10) | ✓ VERIFIED | `grep -c "^export function" structured-data.tsx` returns 6 (live exports); `grep -wc "OrganizationStructuredData\|ProfessionalServiceStructuredData\|FAQStructuredData\|FractionalCDOServiceStructuredData"` returns 0 |
| 10 | Every career-wide $50M surface reads `$50M` + `product value` (no `+`); Nagarro-specific `$50M+ in business impact` stays on nagarro-client.tsx (D-15, D-18) | ✓ VERIFIED | `grep -c '$50M product value delivered' lib/metadata.ts app/about/page.tsx` returns 1 each; `grep -rn '50M+' app lib components` returns exactly 1 hit (nagarro-client.tsx:552) |
| 11 | The Chameleon Collective link on /about points at a URL that returns 200 without a redirect chain; structured-data.tsx has no Chameleon URL (name mentions only) (D-16) | ✓ VERIFIED | `grep -c "chameleoncollective.com" app/about/about-client.tsx lib/data/static-data.ts` returns 2 (both fixed); `grep -rn "chameleon\.co\"" app lib components/seo` returns 0 hits; curl confirms 200 response |
| 12 | No `example.com`, lorem, or placeholder copy remains in app/, lib/, components/ apart from HTML `placeholder=` attributes (D-17) | ✓ VERIFIED | `grep -rn "example\.com" app lib components \| grep -v "placeholder=" \| grep -v "README"` returns 0 hits; `grep -rni "lorem\|ipsum" app lib components` returns 0 hits |
| 13 | 09-CROSS-SURFACE-MATRIX.md exists with one row per project claim for all 7 case studies, columns visible copy · metadata · OG · JSON-LD, every cell one of agree / fixed→X / pulled / open / — , plus per-project 'open for Randy' list (D-14) | ✓ VERIFIED | .planning/phases/09-cross-surface-verification/09-CROSS-SURFACE-MATRIX.md exists (430 lines); grep shows 166 claim rows; Part C has open items for each project |
| 14 | Every claim changed, pulled or conformed by Plans 02/03 appears as a matrix row (titles, descriptions, og:type, og:image, dateCreated, FAQ removal, dead exports, $50M wording, Chameleon URL, placeholder links, addvanced breadcrumb name) (D-18) | ✓ VERIFIED | Matrix Part A rows document all Plan 02/03 changes (title fixed→, og:type fixed→article, FAQ pulled, breadcrumb name fixed→Addvance); Parts D-F document site-wide changes |
| 15 | Waffle is recorded as verify-only: grid card, /projects/waffle page, metadata and OG image self-consistent, no unification applied (D-13) | ✓ VERIFIED | Matrix Part B section exists with Waffle verify-only table (8 rows); explicitly states "no helper, no CreativeWork/Breadcrumb added by design" |
| 16 | A stale-claim grep across app/, lib/, components/seo/ finds no claim that Phase 8/9 changed on one surface but left on another — every pattern returns 0 (or only the documented allowed hit) (D-19, ROADMAP SC2) | ✓ VERIFIED | Matrix Part G has 17 grep patterns; all return 0 or documented allowed hits (G09: 1 nagarro $50M+, G13: 1 email-test placeholder=) |
| 17 | `npm run lint`, `npx tsc --noEmit`, `npm test` pass clean across the touched surface, with known-flaky animation-load-testing baseline tolerated (D-19, ROADMAP SC3) | ✓ VERIFIED | `npm run lint` exits 0 (deprecation notice but no errors); `npx tsc --noEmit` exits 0; `npx jest __tests__/seo` 640/640 tests pass (588 project-metadata + 52 route-wiring across all suites) |
| 18 | ROADMAP.md reflects reality: Phases 6–8 (done, previously unchecked) are checked and their progress-table rows read Complete (Claude's-discretion item, CONTEXT.md) | ✗ FAILED | Phase 6: ✓ checked. Phase 7: ✗ NOT checked (should be `[x]`), Progress table says "Structural wiring complete" (should be "Complete"). Phase 8: ✗ NOT checked (should be `[x]`), Progress table says "Not started" (should be "pre-GSD (traced) \| Complete \| 2026-08-16"). Root cause: Commit 5e2a914 (dated after Plan 09-05's dd96ccf fix) reverted the checkbox updates. |

**Score:** 17/18 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `lib/metadata.ts` | Exports projectMetadata, projectOgImage, projectDateCreated, projectCreativeWorkProps, projectBreadcrumbItems | ✓ VERIFIED | 7280 bytes; `grep -c "^export function project"` returns 5; all helpers exist and tested |
| `__tests__/seo/project-metadata.test.ts` | D-14 regression test, min_lines: 80 | ✓ VERIFIED | 303 lines; 588 tests pass; covers all PROJECTS entries against D-03..D-08, D-11, D-12 contracts |
| `components/seo/structured-data.tsx` | CreativeWorkStructuredData with optional dateCreated; live schema components only (6 exports) | ✓ VERIFIED | `grep -q "dateCreated?: string"` succeeds; 6 exports remain (Breadcrumb, Person, Website, Article, CreativeWork, LocalBusiness); 4 dead exports deleted |
| `app/projects/[slug]/page.tsx` | generateMetadata via projectMetadata; CreativeWork + Breadcrumb from helpers; no FAQ | ✓ VERIFIED | `grep -q "projectMetadata(project)"` succeeds; both structured data components present; `grep -c "ProjectFAQStructuredData"` returns 0 |
| `app/projects/addvanced/page.tsx` | metadata + CreativeWork + Breadcrumb derived from PROJECTS | ✓ VERIFIED | `grep -q "projectMetadata(project)"` succeeds; both structured data components present; no literal openGraph keys |
| `app/projects/echo/page.tsx` | metadata + CreativeWork + Breadcrumb derived from PROJECTS | ✓ VERIFIED | `grep -q "projectMetadata(project)"` succeeds; both structured data components present; no literal openGraph keys |
| `app/projects/nagarro/page.tsx` | metadata + CreativeWork + Breadcrumb derived from PROJECTS | ✓ VERIFIED | `grep -q "projectMetadata(project)"` succeeds; both structured data components present; no literal openGraph keys |
| `app/projects/rambis-ui/page.tsx` | metadata + CreativeWork + Breadcrumb derived from PROJECTS | ✓ VERIFIED | `grep -q "projectMetadata(project)"` succeeds; both structured data components present; no literal openGraph keys |
| `__tests__/seo/project-route-wiring.test.ts` | Source-level drift guard over 5 routes + Waffle exclusion, min_lines: 40 | ✓ VERIFIED | 130 lines; 52 tests pass; verifies all routes call helpers, no FAQ reintroduction, Waffle uses createPageMetadata |
| `.planning/phases/09-cross-surface-verification/09-CROSS-SURFACE-MATRIX.md` | Per-claim × surface reconciliation for all 7 case studies + Waffle + site-wide + open items, min_lines: 150 | ✓ VERIFIED | 430 lines; 166 claim rows across Part A (7 projects); Parts B (Waffle verify-only), C (open items), D-G (site-wide + grep sweep) |
| `.planning/ROADMAP.md` | Phases 6–8 checked; progress-table rows Complete | ✗ PARTIAL | Phase 6: ✓ checked. Phases 7-8: ✗ NOT checked; Progress table rows NOT "Complete" (reverted by commit 5e2a914 after executor completed Plan 09-05) |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| `lib/metadata.ts` | `lib/data/types.ts` | import type { Project } | ✓ WIRED | `grep -q 'import type { Project } from' lib/metadata.ts` succeeds |
| `lib/metadata.ts` | `lib/constants.ts` | WEBSITE_URL for absolute JSON-LD urls | ✓ WIRED | `grep -q 'WEBSITE_URL' lib/metadata.ts` succeeds |
| `__tests__/seo/project-metadata.test.ts` | `lib/metadata.ts` | imports helpers and iterates PROJECTS | ✓ WIRED | `grep -q 'projectMetadata(' __tests__/seo/project-metadata.test.ts` succeeds |
| All 5 route files | `lib/metadata.ts` | `import { projectMetadata, projectCreativeWorkProps, projectBreadcrumbItems }` | ✓ WIRED | All 5 routes import from `@/lib/metadata`; grep confirms usage in each |
| Standalone routes (addvanced, echo, nagarro, rambis-ui) | `lib/data/projects.ts` | `PROJECTS.find((p) => p.slug === ...)` | ✓ WIRED | `grep -c 'PROJECTS\.find\(\(p\) => p\.slug ===' ` returns 4 (all standalone routes) |
| All route files | `components/seo/structured-data.tsx` | `<CreativeWorkStructuredData>` and `<BreadcrumbStructuredData>` | ✓ WIRED | All 5 routes render both components; verified by grep |
| Matrix Part A rows | `lib/data/projects.ts` fields | Each row cites data field or file:line | ✓ WIRED | Matrix rows reference `lib/data/projects.ts` line numbers for claims |
| Matrix Parts D/E/F | 09-03-SUMMARY.md findings | Copied verbatim (dead exports, $50M table, Chameleon chain, placeholder hits) | ✓ WIRED | Parts D-F content matches 09-03-SUMMARY.md findings lists |
| Part G grep table | `app/`, `lib/`, `components/seo/` | grep -rn patterns with counts | ✓ WIRED | 17 grep patterns executed and results recorded with file:line hits |

### Data-Flow Trace (Level 4)

Not applicable to this phase — Phase 9 is a verification/reconciliation phase that documents existing data flows (matrix) rather than creating new rendering components. The data-flow verification is embedded in the cross-surface matrix itself (visible copy vs metadata vs OG vs JSON-LD comparison for each claim).

### Behavioral Spot-Checks

Not applicable to this phase — Phase 9 produces planning documentation artifacts (matrix, test suites) and refactors existing routes to use shared helpers. No new user-facing behavior was introduced that requires runtime spot-checking. The route-wiring test suite (`__tests__/seo/project-route-wiring.test.ts`) serves as the behavioral guard by verifying source-level helper usage.

### Probe Execution

No probes declared or implied in Phase 9 plans. This phase is a verification/documentation phase with test-suite-based validation (Jest) rather than shell-based probes.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|---------|----------|
| CRED-09 | All 5 plans | Cross-surface verification pass — visible copy vs metadata vs OG image vs JSON-LD reconciled across every touched project (modeled on v1.0 audit remediation) | ✓ SATISFIED | 09-CROSS-SURFACE-MATRIX.md exists with 166 claim rows across 7 projects + Waffle verify-only; all surfaces agree or documented as fixed→/pulled/open; no orphaned claims |

**Orphaned requirements:** None. REQUIREMENTS.md maps CRED-09 to Phase 9, and all 5 plans declare `requirements: [CRED-09]`.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| None | - | - | - | No TBD/FIXME/XXX markers found in modified files; no stubs/placeholders introduced by Phase 9 |

**Debt marker scan scope:** lib/metadata.ts, components/seo/structured-data.tsx, all route files (app/projects/*/page.tsx), test files (__tests__/seo/*.test.ts), matrix file.

**Result:** Clean — all modified files are substantive implementations or documentation. No anti-patterns detected.

### Human Verification Required

None. All Phase 9 verification is code-based (grep sweeps, test suite execution, source-level wiring checks, cross-surface matrix reconciliation). The matrix itself documents open items for Randy (Part C), but those are business decisions (OG image choices, as-of dates for metrics), not technical verification items.

### Gaps Summary

**1 gap blocks full completion:**

**Gap 1: ROADMAP.md Phases 7-8 NOT reconciled (Truth #18 FAILED)**

**What's wrong:**
- Phase 7 checkbox is unchecked (should be `[x]`)
- Phase 7 Progress table row says "Structural wiring complete (content pending Phase 8)" (should be "Complete")
- Phase 8 checkbox is unchecked (should be `[x]`)
- Phase 8 Progress table row says "Not started" (should be "pre-GSD (traced) | Complete | 2026-08-16")

**Root cause:**
Plan 09-05 Task 3 correctly updated ROADMAP.md in commit dd96ccf (2026-08-20 14:24:00), checking Phases 7-8 and updating Progress table rows to "Complete". However, a subsequent commit 5e2a914 (2026-08-20 14:27:38) — a tracking commit titled "docs(phase-09): update tracking after wave 4" — reverted those changes while marking Phase 9 as complete.

**Evidence:**
```bash
# Commit dd96ccf (Plan 09-05 output):
- [x] **Phase 7: Bespoke Convergence** ... (completed 2026-08-15)
- [x] **Phase 8: Content Rewrite & Credibility Guardrails** ... (completed 2026-08-16)
| 7. Bespoke Convergence | v2.0 | 1/1 | Complete | 2026-08-15 |
| 8. Content Rewrite & Credibility Guardrails | v2.0 | pre-GSD (traced) | Complete | 2026-08-16 |

# Commit 5e2a914 (3 minutes later):
- [ ] **Phase 7: Bespoke Convergence** ... (unchecked, completion date removed)
- [ ] **Phase 8: Content Rewrite & Credibility Guardrails** ... (unchecked, completion date removed)
| 7. Bespoke Convergence | v2.0 | 1/1 | Structural wiring complete (content pending Phase 8) | 2026-08-15 |
| 8. Content Rewrite & Credibility Guardrails | v2.0 | 0/TBD | Not started | - |
```

**Fix required:**
Re-apply the changes from commit dd96ccf to ROADMAP.md:
1. Check Phase 7 checkbox: `- [x] **Phase 7: Bespoke Convergence** ... (completed 2026-08-15)`
2. Check Phase 8 checkbox: `- [x] **Phase 8: Content Rewrite & Credibility Guardrails** ... (completed 2026-08-16)`
3. Update Progress table row 7: Status → `Complete`
4. Update Progress table row 8: Status → `pre-GSD (traced) | Complete`, Date → `2026-08-16`

**Impact on phase goal:**
This gap does NOT affect the core phase goal achievement ("what a hiring manager reads on the page matches what a recruiter sees in metadata, the OG image, and the page source"). The ROADMAP reconciliation was a housekeeping task included in Plan 09-05 as a "Claude's discretion" item. All 7 case studies have verified cross-surface consistency. However, it IS a must-have from Plan 09-05's frontmatter, so it blocks a clean "passed" status.

---

**Verification Summary:**
- **Core goal:** ✓ ACHIEVED — All 7 projects have matching visible copy, metadata, OG images, and JSON-LD (documented in 09-CROSS-SURFACE-MATRIX.md with 166 claim rows)
- **ROADMAP SC1:** ✓ VERIFIED — Cross-surface agreement for all 7 projects
- **ROADMAP SC2:** ✓ VERIFIED — Stale-claim grep clean (17 patterns, Part G documented)
- **ROADMAP SC3:** ✓ VERIFIED — lint/tsc/tests pass (640 SEO tests)
- **CRED-09:** ✓ SATISFIED — Cross-surface verification complete
- **Administrative gap:** ROADMAP Phases 7-8 checkboxes and Progress table rows need re-application of dd96ccf changes

---

_Verified: 2026-08-20T20:45:00Z_  
_Verifier: Claude (gsd-verifier)_  
_Context usage: 88%_
