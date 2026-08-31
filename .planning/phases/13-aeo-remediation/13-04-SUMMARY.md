# 13-04 Summary — homepage split, entity polish, cleanup (T-08/09/10/13/14/16)

**Status:** Complete · lint ✅ tsc ✅ SEO suites 560/560 ✅ · full suite = true baseline only

## What shipped

- **T-09** `app/page.tsx` content moved verbatim to `app/home-client.tsx`
  (`git mv`, default export renamed `Home` → `HomeClient`); new server
  `app/page.tsx` exports homepage metadata (values intentionally identical to
  the root-layout defaults — declaration point, zero live-behavior change)
  and mounts the FAQPage JsonLd from 13-02 server-side. Both homepage suites
  pass unchanged (they render the default export of `@/app/page`).
- **T-08** `Person` JSON-LD gains `email: "hello@randyellis.design"`; /about
  certifications section now links `/randy-ellis-resume.pdf` ("Download
  résumé (PDF)", OutboundLink style).
- **T-10** Waffle converted to the echo pattern: `projectMetadata` +
  `CreativeWork`/`BreadcrumbList` JSON-LD, bespoke 1200×630 OG card kept via
  explicit override. `projectOgImage` is raster-only (SVG → file-convention
  fallback); `projectMetadata` omits `openGraph.images`/`twitter.images`
  instead of emitting `[]` (an explicit empty array suppressed the
  opengraph-image.tsx fallback).
- **T-13** `WebSite.potentialAction` (SearchAction advertising the
  `?category=` filter) removed.
- **T-14** Deleted: `components/seo/related-content.tsx` (+ commented import),
  `getMetadataBase()`, `SEO_IMPLEMENTATION.md`, `SEO_OPTIMIZATION_REPORT.md`.
  Sitemap test corrected to the real 9 static pages (was titled "exactly 7"
  and missing /services and /skills).
- **T-16** `app/not-found.tsx` exports `robots: noindex` +
  `alternates.canonical: null` — it no longer canonicals every dead URL to
  the homepage.

## Decision amendments (recorded here + STATE.md)

- **D-13 amended:** Waffle's exclusion from the shared metadata/JSON-LD
  helpers is reversed — it was the one project route with no CreativeWork
  node, and its hand-typed metadata had drifted. Test block renamed
  "Waffle inclusion".
- Tests updated to the new contracts: `json-ld.test.tsx` (no potentialAction),
  `project-metadata.test.ts` (raster-only, images-absent-not-empty),
  `project-route-wiring.test.ts` (waffle inclusion).

## Phase-12 note

`FEATURED_SLUGS` and the Selected-work paragraph now live in
`app/home-client.tsx` (was `app/page.tsx:55`) — already recorded in STATE.md
Roadmap Evolution.

## Flaky observation

`__tests__/components/test-results.test.tsx` failed once in a full parallel
run, passes in isolation — same class as the documented
`animation-load-testing` flakiness, not a Phase 13 regression.
