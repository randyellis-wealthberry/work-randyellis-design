---
phase: 10-seo-remediation
plan: 10
subsystem: seo
tags: [seo, verification, rich-results, search-console, human-gate, blocked]
dependency_graph:
  requires: ["10-09"]
  provides: []
  affects: []
tech_stack:
  added: []
  patterns: [live-verification, proof-capture, authenticated-browser-verification]
key_files:
  created:
    - .planning/phases/10-seo-remediation/10-verification-screenshots/rrt-blog-warnings.png
  modified:
    - .planning/phases/10-seo-remediation/10-VERIFICATION-CHECKLIST.md
    - .planning/phases/10-seo-remediation/10-verification-screenshots/rrt-home.png
    - .planning/phases/10-seo-remediation/10-verification-screenshots/rrt-growit.png
    - .planning/phases/10-seo-remediation/10-verification-screenshots/rrt-blog.png
decisions:
  - D-17/D-23 satisfied — Rich Results Test ran clean on all 3 sampled URLs, zero errors
  - Rows 9-11 cleared by re-running RRT in Randy's authenticated Chrome session (explicitly authorized), overriding the standing isolated-Playwright preference for this run
  - automation-results.json rows 9-11 "fail" confirmed a false negative; the checklist is authoritative
  - T-10-23 applied — the account avatar was cropped from all RRT screenshots before they entered the public repo
  - D-18 NOT satisfied — no Search Console property exists; ownership was never verified
requirements_completed: []
requirements_blocked: [SEO-05]
metrics:
  completed_date: "2026-08-22"
  task_count: 3
  file_count: 5
status: blocked
---

# Phase 10 Plan 10: Live Verification Close-Out — RRT Clean, Search Console Blocked

**The three Rich Results Tests that had been stuck behind a Google login wall since Plan 10-09 ran clean in Randy's authenticated browser — zero errors on home, `/projects/growit` and `/blog/profits-not-pixels`, satisfying D-17 and D-23 — but Search Console (D-18) cannot proceed: no property exists for work.randyellis.design and the site carries no verification meta tag, so ownership has never been established. Checklist stands at 13/14 pass, row 13 blocked.**

## What Shipped

### Rows 9–11 — Rich Results Test, now genuinely verified

Plan 10-09 could not authenticate and left these `blocked`. Re-run 2026-08-22 in
Randy's signed-in Chrome session, with his explicit authorization to use the
primary profile (his standing preference is isolated Playwright, which by
construction cannot pass a login wall).

| URL | Result | Errors |
|-----|--------|--------|
| `/` | "No items detected" — expected; Person and WebSite are not rich-result types | 0 |
| `/projects/growit` | 1 valid item — Breadcrumbs | 0 |
| `/blog/profits-not-pixels` | 3 valid items — Articles, Breadcrumbs, Paywalled Content | 0 |

All three crawled successfully. **D-23 satisfied: zero errors.** The blog Article
carries 5 issues, every one marked `(optional)` by the tool — the warning class
D-23 declares non-blocking.

The D-14 `teamSize` exception raised no RRT warning on GrowIt, because RRT only
evaluates rich-result-eligible types and CreativeWork is not one. Row 14's
schema.org validator run remains the vocabulary-conformance evidence.

### The earlier `fail` was a false negative

`automate-verification.js` had recorded rows 9–11 as `fail` with "Rich Results
Test reported errors in page content". The script matched error text on the page
without distinguishing Google's *"Something went wrong — Log in and try again"*
dialog from a structured-data finding. RRT had never run. This is recorded in the
checklist's D-23 Gate section; `automation-results.json` is superseded and should
not be read as a verdict.

### Row 13 — blocked, and further from done than the plan assumed

The plan framed this as "submit the sitemap." It is not reachable:

- Search Console returns "Oops, you don't have access to this property" for `https://work.randyellis.design/`
- The property picker returns "No matching property" — the signed-in account holds **zero** properties
- No `google-site-verification` meta tag exists in `app/layout.tsx`, `lib/metadata.ts`, or the live production HTML

So the property was never created and ownership was never verified. Submission
requires first establishing ownership: a DNS TXT record at the registrar, a
deployed meta tag via `metadata.verification.google`, or an HTML file in
`public/`. The meta-tag route is a code change Claude can make once Randy starts
the Add-property flow and supplies the token.

The sitemap itself is healthy — HTTP 200, 19 URLs, verified live during this plan.

### Privacy handling

T-10-23 in this plan's threat model instructs cropping account identifiers before
screenshots enter the repo. The repo is **public**. All four RRT screenshots were
cropped to remove the Google account avatar from the header bar. The Search
Console page, which displayed the account email, was **not** saved to disk.

## STATE.md Updates

- **Chameleon blocker — resolved.** Carried from v1.0 and re-verified in 10-08:
  `https://chameleoncollective.com` returns HTTP 200 in one hop; both visible
  occurrences confirmed; zero schema references remain. The open bullet in STATE
  "Blockers/Concerns" can be struck.
- **Phase 10 verification outcome:** 13/14 rows pass. Row 13 blocked on D-18.
  Phase 10 is not complete until row 13 closes or D-18 is formally waived.

## Observations Carried for Randy

- **Blog dates have no time or timezone.** `datePublished` and `dateModified`
  both serialize as bare `2025-07-21`, producing four of the five Article
  warnings. Full ISO-8601 with an offset clears them.
- **The Article has no `image`.** Optional for validity; images unlock richer
  Search treatment.
- **`Paywalled Content` is detected** on a post that is not paywalled — worth
  confirming the `isAccessibleForFree` markup is intentional.
- **The `profits-not-pixels` headline** renders as "PROFITS, NOT PIXELS: The story
  of world's most expensive (yet, valuable?) cup of coffee" — missing article
  before "world's", and the parenthetical reads awkwardly.
- **Person carries two `jobTitle` values** — "Head of Product" and "Fractional
  Chief Design Officer" — relevant to the reader question logged in
  `.planning/MILESTONE-CONTEXT.md`.

## Blocked

**SEO-05 cannot be marked complete.** D-18 makes Search Console submission
required, and it needs Randy to create and verify the property. Two paths:

1. Randy creates a domain property via DNS TXT at the registrar, then submits `sitemap.xml`
2. Randy starts Add-property → meta tag, hands Claude the token → Claude wires `metadata.verification.google` and ships → Randy clicks Verify, then submits

Alternatively, waive D-18 for this milestone and carry the submission forward.
