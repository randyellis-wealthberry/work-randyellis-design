# Phase 9: Cross-Surface Verification - Context

**Gathered:** 2026-08-16
**Status:** Ready for planning

<domain>
## Phase Boundary

For every one of the 7 in-scope case studies (growit, ohplays, ledgeriq,
addvanced, echo, nagarro, rambis-ui), what a hiring manager reads on the page
matches what a recruiter sees in `<head>` metadata, the OG/link-preview image,
and the JSON-LD in page source. Closes **CRED-09** and the v2.0 milestone the
way v1.0's audit remediation did.

**Requirements:** CRED-09

**In scope:** unifying how the 5 project routes (`[slug]` + 4 standalone
`page.tsx` files) produce metadata and JSON-LD so they derive from
`lib/data/projects.ts`; deleting fabricated / dead schema in
`components/seo/`; a claim×surface reconciliation sweep with a written matrix
and a regression test; verifying the two v1.0 carry-overs (Chameleon Collective
URL, `$50M` wording); a bounded placeholder/`example.com` grep; lint → tsc →
test clean.

**Out of scope:** any new case-study copy (Phase 8 is done — this phase makes
surfaces *agree*, it does not author); Waffle's product-page metadata/branding
(verify-only); visual polish; a general dead-code hunt outside
`components/seo/*`.

</domain>

<decisions>
## Implementation Decisions

### Metadata source-of-truth (all 7 case-study routes)

- **D-01:** The 4 standalone pages (`app/projects/{addvanced,echo,nagarro,rambis-ui}/page.tsx`)
  **derive** their metadata from their `PROJECTS` entry in `lib/data/projects.ts`.
  Hand-typed title/description/OG strings in those files are removed.
  (`rambis-ui/page.tsx` already imports `rambisProject` — that's the direction.)
- **D-02:** One shared **`projectMetadata(project)` helper** is the single
  implementation, called by `app/projects/[slug]/page.tsx#generateMetadata`
  **and** the 4 standalone pages. `[slug]/page.tsx` is refactored to use it —
  the rules below are uniform, so two copies would drift.
- **D-03:** Meta description and OG/Twitter description = **`project.description`**
  (131–222 chars), not `project.longDescription` (475–848 chars, truncated in
  SERPs and unfurls). `longDescription` stays for on-page copy only. No new
  data field.
- **D-04:** Title = **`"{name} | {subtitle}"`** for all 7 (matches `[slug]`
  today; `subtitle` exists on every project). Standalone pages' hand-written
  taglines ("Logistics Innovation", "Design Leadership at Scale") are dropped.
- **D-05:** OG image = **`project.thumbnail`**, with the existing `[slug]`
  image-fallback (first image-typed entry in `project.images` when the
  thumbnail is a video — LedgerIQ's `.mp4`). Grid card, detail page and link
  unfurl show the same shot. Bespoke OG files referenced today
  (`nagarro/digital-accessibility-strategy.png`, echo's, etc.) are unused
  unless they *are* the thumbnail.
- **D-06:** `openGraph.type` = **`"article"`** for all 7 (`[slug]` switches
  from `"website"`); keep `authors`/`publishedTime` where the data supports it.
- **D-07:** Keywords = the **mechanical builder** already in `[slug]`
  (`name + technologies + tags + category + "Randy Ellis", "AI Product Design",
  "Design Engineering"`) for all 7. Hand-listed extras on standalone pages
  ("Innovation Lab", "Career Intelligence", …) are dropped unless the planner
  judges one worth promoting into that project's `tags`.
- **D-08:** `alternates.canonical` = `/projects/{slug}` for all 7 (unchanged
  behavior, now produced by the helper).

### FAQ JSON-LD disposition

- **D-09:** **Delete `FAQPage` JSON-LD from project pages.** Remove the
  `<ProjectFAQStructuredData>` call from `app/projects/[slug]/page.tsx` and
  delete `components/seo/project-faq.tsx` (that page is its only importer —
  verified). Rationale: `echo`'s FAQs describe an "AI design system" (Echo is
  EchoDrive, trucking logistics), `addvanced`'s describe a financial-advisor
  onboarding tool with "70% less paperwork / SOC 2" (it's a career tracker),
  and `metis` is not a project — the same fabricated-schema class v1.0 purged.
  Google's FAQ rich result also requires the Q&A be visible on-page, and no
  project page renders any. growit's 3 on-topic FAQs (240K+, 4.8★, ML plant
  ID) lose nothing that `CreativeWork`/`Person` schema doesn't already carry.
- **D-10:** **Dead / unimported schema exports found in `components/seo/*`
  during the sweep are deleted and logged** in the matrix (e.g. the site-level
  `FAQStructuredData` in `structured-data.tsx` — zero importers, carries
  "25K+ cities"). This is bounded to `components/seo/*`; it is not a general
  dead-code hunt. Same reasoning as v1.0's `app/data.ts` landmine.

### JSON-LD parity on standalone pages

- **D-11:** **All 7 case-study routes emit `CreativeWorkStructuredData`** fed
  from their `PROJECTS` entry (name, description, url, dateCreated,
  technologies, category, metrics, imageUrl, teamSize, role) — the 4 standalone
  `page.tsx` files add the same call `[slug]/page.tsx` already makes.
  `description` passed to it follows D-03 (`project.description`).
- **D-12:** **All 7 emit `BreadcrumbStructuredData`** (Home › Projects ›
  {name}). `[slug]`, `echo`, `nagarro`, `rambis-ui` add it; `addvanced` already
  has it.
- **D-13:** **Waffle is out** of the unification: it keeps
  `createPageMetadata` + its product-page title and no CreativeWork/Breadcrumb
  is added. Phase 9 only verifies Waffle's claims are self-consistent across
  grid card, `/projects/waffle` page and its OG image (per PROJECT.md: "Waffle
  stays as its v1.0 product-showcase page").

### Proof artifact & unresolved claims

- **D-14:** Evidence is **both** of:
  1. `.planning/phases/09-cross-surface-verification/09-CROSS-SURFACE-MATRIX.md`
     — one row per project claim (metric, role/title, team size, timeline,
     named partner, award…), columns = visible copy · metadata · OG · JSON-LD,
     each cell `agree` / `fixed→X` / `pulled` / `open`, plus a per-project
     "open for Randy" list. Modeled on `.planning/DECK-COVERAGE-AUDIT.md`.
  2. A **Jest regression test** asserting that, for every project in
     `PROJECTS`, the metadata produced by `projectMetadata(project)` and the
     `CreativeWork` props derive from that entry (title/description/canonical/
     og:image/type match the data), so future drift fails CI rather than
     waiting for the next audit.
- **D-15:** **`$50M` — Randy confirmed real for BOTH readings** (career-wide
  "$50M in product value" on homepage OG, about OG and the `AnimatedNumberBasic`
  counter; Nagarro-specific "$50M+ business impact" on `nagarro/page.tsx` and
  `nagarro-client.tsx`). **Keep everywhere; align wording** so each surface
  says the same thing for the same claim; record the basis in the matrix. This
  closes the Phase 5 deferred item.
- **D-16:** **Chameleon Collective URL** (`app/about/about-client.tsx` + 3×
  `components/seo/structured-data.tsx`) — verify it resolves; fix the URL or
  remove the link/reference if it doesn't. Log outcome in the matrix. Closes
  the v1.0 carry-over.
- **D-17:** **Bounded placeholder sweep is in scope:** grep `app/`, `lib/`,
  `components/` for `example.com`, `lorem`, `placeholder` (copy, not the HTML
  attribute), TODO-copy markers; log every hit in the matrix and fix or delete.
  Closes the Phase 5 deferred item.
- **D-18:** **Conflict rule:** when the same claim differs across surfaces and
  neither side is obviously stale, **visible page copy wins** (it is the Phase 8
  rewritten, Randy-reviewed source); metadata / OG / JSON-LD are conformed to
  it. Every such fix is a matrix row so Randy can veto. Do NOT silently pick a
  winner and do NOT invent a third value.
- **D-19:** Verification gate is unchanged from Phases 5–8: `npm run lint` →
  `npx tsc --noEmit` → `npm test` (build is NOT a gate), plus the matrix,
  plus a stale-claim grep across `app/`, `lib/`, `components/seo/` mirroring
  the v1.0 remediation's "stale-content grep clean" line. Known baseline:
  `__tests__/performance/animation-load-testing.test.tsx` is flaky.

### Claude's Discretion

- **Helper location** — likely `lib/metadata.ts` next to `createPageMetadata()`
  (reuse its site-URL/OG defaults); `lib/data/` or `components/seo/` acceptable.
- Whether any hand-listed standalone keyword is worth promoting into `tags` (D-07).
- Exact matrix column/row layout and claim granularity, as long as every
  changed or pulled claim is a row.
- Test file placement and shape for D-14 (e.g. `__tests__/seo/project-metadata.test.ts`).
- Whether `authors`/`publishedTime` are emitted under `og:type article` (D-06)
  and where the date comes from (`project.timeline`).
- Commit granularity — suggest: helper + `[slug]` refactor; standalone pages;
  schema deletions; matrix + test; sweep fixes.
- Whether the ROADMAP.md checkboxes for Phases 6–8 (done, still unchecked)
  are reconciled in this phase's docs commit — recommended yes, via
  `gsd-sdk` roadmap handlers, not direct edits.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone & Requirements
- `.planning/ROADMAP.md` §Phase 9 — goal + 3 success criteria (SC1 names the standalone routes explicitly)
- `.planning/REQUIREMENTS.md` §Credibility Guardrails — CRED-06..09 wording; CRED-09 is the only open one
- `.planning/PROJECT.md` §Key Decisions — v1.0 lesson "grep all surfaces incl. OG generators"; §Context — verify order
- `.planning/STATE.md` §Accumulated Context — CRED-08 outcomes (Echo = process/design only; Nagarro unrestricted), 4.8★/240K+ confirmed real, LedgerIQ = composite

### The model this phase copies
- `.planning/milestones/v1.0-MILESTONE-AUDIT.md` — the v1.0 audit-remediation pattern (CRED-01/03, POS-04 fixed across About card, OG images, `lib/metadata.ts`, `structured-data.tsx`), incl. its post-fix verification line
- `.planning/DECK-COVERAGE-AUDIT.md` — per-claim table format the matrix (D-14) is modeled on
- `.planning/phases/05-foundation-cleanup/05-CONTEXT.md` — D-16 no-AI-slop constraint (still binding), and the `<deferred>` items this phase closes (`$50M`, placeholder sweep)

### Credibility source-of-truth
- `.planning/CREDIBILITY-COPY.md` — v1.0 verified extraction (GrowIt only)
- `lib/data/projects.ts` — the data every surface must derive from (Phase 8 rewrote it; it is the freshest reviewed source)

### Codebase maps
- `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/CONVENTIONS.md`, `.planning/codebase/STACK.md`

### Project instructions
- `CLAUDE.md` §Verifying Changes — lint → tsc → test; `npm run build` is not a gate; no `type-check` script

</canonical_refs>

<code_context>
## Existing Code Insights

### Surfaces this phase reconciles (per project)
| Surface | Where |
|---|---|
| Visible copy | `app/projects/[slug]/project-detail-client.tsx` (growit, ohplays, ledgeriq) · `app/projects/{addvanced,echo,nagarro,rambis-ui}/*-client.tsx` |
| Metadata | `app/projects/[slug]/page.tsx#generateMetadata` · `export const metadata` in the 4 standalone `page.tsx` |
| OG image | `project.thumbnail` via `[slug]`; bespoke paths in standalone metadata; `app/projects/opengraph-image.tsx` (grid card — renders "240K+ Users / 4.8★ Rating", both verified) |
| JSON-LD | `CreativeWorkStructuredData` + `ProjectFAQStructuredData` in `[slug]/page.tsx` only; `BreadcrumbStructuredData` in `addvanced/page.tsx` only; nothing on echo/nagarro/rambis-ui |
| Grid card | `app/projects/projects-client.tsx` (name, description, badges) |

### Reusable Assets
- `lib/metadata.ts#createPageMetadata` — existing metadata builder with site-URL/OG defaults; natural home/pattern for `projectMetadata()`
- `app/projects/[slug]/page.tsx` — already contains the title/keywords/canonical/OG-image-fallback logic that becomes the helper body
- `components/seo/structured-data.tsx#CreativeWorkStructuredData`, `#BreadcrumbStructuredData` — the two schema components every route will emit
- `lib/data/projects.ts` — every project has `name`, `subtitle`, `description`, `longDescription`, `thumbnail`, `images`, `technologies`, `tags`, `category`, `timeline`, `teamSize`, `role`, `metrics`; `rambis-ui/page.tsx` already imports its entry
- `__tests__/` — Jest + RTL in place; `app/projects/echo/__tests__/` shows the co-located pattern

### Established Patterns
- Static route dirs shadow `[slug]` — the 4 standalone pages bypass `generateMetadata`, which is *why* their metadata drifted; the helper closes that gap without touching routing
- Additive, data-driven changes (`isLiveProduct`, `isComposite`) — Phase 9 adds no data fields (D-03 reuses `description`)
- v1.0 remediation precedent: fix inline across all surfaces in one pass, then one verification line (lint/tsc/tests/grep)

### Integration Points
- `[slug]/page.tsx` — loses `ProjectFAQStructuredData`, gains `BreadcrumbStructuredData`, calls the helper
- 4 standalone `page.tsx` — replace hardcoded `metadata` with helper call; add CreativeWork + Breadcrumb; keep their `*-client.tsx` untouched except for claim-wording fixes logged in the matrix
- `components/seo/project-faq.tsx` — deleted; `structured-data.tsx` — dead exports removed
- `app/opengraph-image.tsx`, `app/about/opengraph-image.tsx`, `components/core/animated-number-basic.tsx`, `nagarro/*` — `$50M` wording alignment (D-15)

### Findings already known (seed rows for the matrix)
- FAQ JSON-LD off-project for echo/addvanced; `metis` orphan (D-09)
- Standalone metadata hand-typed; nagarro metadata carries `$50M+`, `50%`, `100+ leads`, `36 countries`, `18,000` — present in client and data, but wording differs per surface
- `[slug]` description = `longDescription` (475–848 chars) (D-03)
- echo/nagarro/rambis-ui emit no JSON-LD (D-11/12)
- Site-level `FAQStructuredData` export unused (D-10)

</code_context>

<specifics>
## Specific Ideas

- Same discipline as Phase 5/v1.0: prefer surfacing a contradiction for Randy
  over quietly picking a winner (D-18 makes page copy the default *and* logs it).
- Randy answered the `$50M` question directly in this session (D-15) — the
  planner should NOT re-open it as a blocker.
- Every metadata rule was chosen to be uniform on purpose so the whole thing is
  one function (D-02) — the planner should resist per-page special cases.

</specifics>

<deferred>
## Deferred Ideas

- **As-of date for 4.8★ / 240K+** — optional honesty improvement carried in
  STATE.md; needs a date from Randy. Not blocking CRED-09; can land whenever
  the date arrives.
- **Visible on-page FAQ authored from Phase 8 decisions** — the only legitimate
  way to bring `FAQPage` schema back. Content + UI work; its own phase if ever.
- **POL-01 visual polish** — still deferred to v2.x/v3.
- **`wealthberry` branch** — 2 local-only commits (WealthBerry AI estate
  project data, hydration fix), unrelated to v2.0; rebase onto main after this
  milestone if wanted.

</deferred>

---

*Phase: 9-Cross-Surface Verification*
*Context gathered: 2026-08-16*
