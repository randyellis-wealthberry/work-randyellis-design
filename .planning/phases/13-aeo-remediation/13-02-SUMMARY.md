# 13-02 Summary — accordion SSR + FAQPage schema (T-01, T-02)

**Status:** Complete · lint ✅ tsc ✅ affected suites 26/26 ✅

## What shipped

- `components/core/accordion.tsx` — `AccordionContent` keeps children mounted:
  `motion.div` with `initial={false}` animating `height: 0 ↔ "auto"`,
  `aria-hidden` + `inert` while collapsed. FAQ answers and blog-archive post
  links now exist in server HTML.
- `lib/data/faqs.ts` — FAQS moved out of `app/page.tsx` so the accordion and
  the schema read one array.
- `lib/seo/json-ld.ts` — `buildFaqPageSchema()`; D-08 header amended (FAQPage
  permitted now that the Q&A is server-rendered visible content).
- `app/page.tsx` — mounts `<JsonLd id="faqpage-jsonld">` inside the questions
  section; stale "FAQ structured data" comment replaced with a true one.
- Tests: `__tests__/seo/accordion-ssr.test.tsx` (5) pins mounted-collapsed
  contract, blog-archive link crawlability, schema↔data mirroring, and the
  page-level single-source import.
- `__tests__/seo/no-legacy-schema.test.ts` — FAQPage removed from the
  forbidden list with the amendment rationale.
- `__tests__/components/blog-archive-accordion.test.tsx` — 3 assertions
  updated to the mounted-but-aria-hidden contract.

## Deviations

- The audit flagged Rambis UI as using the Radix accordion; it actually uses
  the core accordion (`rambis-client.tsx:17`), so the core fix covers all
  three live surfaces. The Radix wrapper's only consumer
  (`components/ui/user-testing-section.tsx`) is itself dead code — left for
  13-04's cleanup notes.

## Pre-existing baseline (NOT from this plan)

7 suites fail on unmodified main: 5 `analytics-*` suites,
`award-count-consistency`, `motion-reduced`. Verified via stash-baseline run.
Flagged for operator attention — award-count-consistency was Phase 11's gate.
