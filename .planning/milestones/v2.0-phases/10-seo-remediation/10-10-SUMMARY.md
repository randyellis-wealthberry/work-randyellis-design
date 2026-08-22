---
phase: 10-seo-remediation
plan: 10
subsystem: seo
tags: [seo, verification, rich-results, search-console, human-gate, dns]
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
    - .planning/phases/10-seo-remediation/10-verification-screenshots/gsc-sitemap.png
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
  - D-18 satisfied — domain property sc-domain:randyellis.design created, DNS-verified, sitemap submitted Success
  - Domain property chosen over URL-prefix: covers work./hire./www./apex in one verification
  - DNS TXT chosen over meta tag: v3.0 CRED-11 edits lib/metadata.ts, where a token would be at risk of silent removal
requirements_completed: [SEO-05]
metrics:
  completed_date: "2026-08-22"
  task_count: 3
  file_count: 6
status: complete
---

# Phase 10 Plan 10: Live Verification Close-Out — 14/14 Pass

**Phase 10 verification is complete at 14/14. The three Rich Results Tests stuck behind a Google login wall since Plan 10-09 ran clean in Randy's authenticated browser — zero errors on all three URLs, satisfying D-17 and D-23. Search Console turned out to need more than a submission: no property existed at all, so a domain property was created for `randyellis.design`, ownership auto-verified via a DNS TXT record on Vercel, and the sitemap submitted with status Success and 19 pages discovered — satisfying D-18. SEO-05 is complete.**

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

### Row 13 — resolved, but it was a bigger task than the plan described

The plan framed this as "submit the sitemap." It wasn't: no Search Console
property existed for the domain at all, the account held zero properties, and no
`google-site-verification` meta tag was present in the code or the live HTML.
Ownership had never been established, so submission was unreachable.

Resolved end to end with Randy's authorization:

1. **Domain property created** — `sc-domain:randyellis.design`. Deliberately a
   domain property rather than the URL-prefix property the plan's wording implies:
   it is a superset, covering `work.`, `hire.`, `www.` and the apex across both
   http and https. Vercel's Connected Projects lists all four.
2. **DNS TXT added** at the apex via Vercel (registrar *and* nameserver), alongside
   the existing hostedemail SPF record. Purely additive — the `*` ALIAS, apex
   ALIAS and `hire` CNAME were untouched. Confirmed resolving on both the
   authoritative nameserver and Google's public resolver before verifying.
3. **Ownership auto-verified** — method "Domain name provider".
4. **Sitemap submitted** — `https://work.randyellis.design/sitemap.xml`,
   **Status Success, 19 discovered pages, 0 videos.**

**Why DNS over a meta tag:** v3.0 Phase 11 (CRED-11) edits `lib/metadata.ts` to
strip the unbacked figures. A verification token living in the exact file a
removal sweep will run over is a silent-unverification risk, and losing
verification loses the property history with it. DNS sits outside that blast
radius and survives every redeploy.

### Privacy handling

T-10-23 in this plan's threat model instructs cropping account identifiers before
screenshots enter the repo. The repo is **public**. All four RRT screenshots were
cropped to remove the Google account avatar from the header bar, and
`gsc-sitemap.png` was cropped the same way. The earlier Search Console screen that
rendered the account email in the page body was **not** saved to disk at all; the
committed Sitemaps proof shows only the property name, the sitemap URL and the
Success row.

## STATE.md Updates

- **Chameleon blocker — resolved.** Carried from v1.0 and re-verified in 10-08:
  `https://chameleoncollective.com` returns HTTP 200 in one hop; both visible
  occurrences confirmed; zero schema references remain. The open bullet in STATE
  "Blockers/Concerns" can be struck.
- **Phase 10 verification outcome:** 14/14 rows pass. SEO-05 complete; Phase 10
  ready to close.
- **New standing dependency:** the apex TXT record `google-site-verification=…`
  on randyellis.design now carries Search Console ownership. Removing it
  unverifies the property and forfeits its history. Worth a note wherever DNS is
  documented.

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

## Status

**SEO-05 complete. Phase 10 ready to close.** All 14 checklist rows pass with
proof committed. `/gsd:complete-milestone` can now run for v2.0, after which
`/gsd:new-milestone` will consume `.planning/MILESTONE-CONTEXT.md` for v3.0.
