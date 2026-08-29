# Roadmap: Randy Ellis Portfolio

## Milestones

- ✅ **v1.0 Recruiter-Readiness** — Phases 1-4 (shipped 2026-08-15) — [roadmap](milestones/v1.0-ROADMAP.md) · [requirements](milestones/v1.0-REQUIREMENTS.md) · [audit](milestones/v1.0-MILESTONE-AUDIT.md)
- ✅ **v2.0 Case-Study Depth** — Phases 5-10 (shipped 2026-08-22) — [roadmap](milestones/v2.0-ROADMAP.md) · [requirements](milestones/v2.0-REQUIREMENTS.md) · [audit](milestones/v2.0-MILESTONE-AUDIT.md)
- 🚧 **v3.0 Enterprise Credibility** — Phases 11-12 (roadmapped, not started) — [requirements](REQUIREMENTS.md) · [research](research/SUMMARY.md)

## Phases

**Phase Numbering:** continues from v2.0. Phase 10 was the last phase of v2.0 (shipped), so v3.0 starts at 11.

- [x] **Phase 11: Self-Consistency & Proof** - Fix the `/about` OG "6 awards" contradiction, promote the 4 named awards from JSON-LD-only to visible copy, pin award-count consistency with a test, and correct the stale framing that generated the withdrawn metric-removal premise (completed 2026-08-24)
- [ ] **Phase 12: Enterprise Legibility** - Echo and Nagarro reframed for a reader evaluating regulated, large-organization operating experience, with one grouped entry point on `/projects`
- [x] **Phase 13: AEO Remediation** - Answer-engine readiness: collapsed-accordion content mounted in server HTML, FAQPage schema restored, blog dates unified to one source, llms.txt + RSS shipped, homepage gets its own metadata, entity/OG loose ends closed (added 2026-08-29 from `.planning/research/SEO-AEO-AUDIT.md`; completed 2026-08-29)

## Phase Details

### Phase 11: Self-Consistency & Proof

> **Rescoped 2026-08-22.** Was "Metric Integrity Close-Out". The metric-removal premise was
> withdrawn — `DECK-COVERAGE-AUDIT.md:34` states plainly that `Unbacked` means *"not found in
> this deck… **This is not a defect and requires no action**"*, and `:37` records that the
> non-deck-source rule was removed because *"Randy's own account of his engagements is a
> source."* `PROJECT.md` and `MILESTONES.md` had summarized those verdicts as credibility debt.
> The three figures are accurate and stay. CRED-10, CRED-11, CRED-14, CRED-16 and PRF-02 are
> void; see REQUIREMENTS.md "Voided requirements".

**Goal**: The site agrees with itself about how many design awards Randy has won, names those
four awards where a human can read them, pins that consistency with a test, and corrects the
stale framing that generated the withdrawn premise.

**Depends on**: Phase 10 (v2.0, shipped) — first phase of v3.0

**Requirements**: CRED-12, CRED-13, PRF-01, REC-01

**Success Criteria** (what must be TRUE):

  1. Every surface that states an award count states **4** — `app/about/opengraph-image.tsx:238` currently renders `6` while `lib/data/retainer.ts:51`, `app/about/about-client.tsx:26` and `lib/seo/json-ld.ts`'s four-entry `award` array all say 4
  2. The four named awards (Davey ×2, Vega ×2, all GrowIt!) render as visible on-page copy with issuer and category — today they exist only in `lib/seo/json-ld.ts:79-84`, readable by a crawler but not by a person. The Webby appears as *judge*, never as a win
  3. A regression test pins award-count consistency across all four surfaces, verified structurally against the data shape rather than by bare string match (`"4"` collides with `grid-cols-4`, `h-4 w-4`, and much else)
  4. `PROJECT.md`, `MILESTONES.md` and `.planning/milestones/v2.0-MILESTONE-AUDIT.md` each state that `Unbacked` means "absent from the deck", not "unsupported" — so a future audit cannot regenerate the withdrawn premise a fourth time
  5. `npm run lint` → `npx tsc --noEmit` → `npm test` all pass (build is NOT a validation gate — `next.config.js` ignores lint and type errors)

**Planning constraints** (hard, do not route around):

  - **Do not remove `2.5M+`, `$50M`, or `800+` from any surface.** They are accurate and in scope to keep. `__tests__/integration/home-page-argument.test.tsx:59-66` asserts they are present and is **correct as written** — do not touch it.
  - **PRF-01's copy is already written — do not re-derive it.** `.planning/CREDIBILITY-COPY.md` §1 carries all 4 awards traced to deck slide 28 (GrowIt!) with issuer and category, plus a ready-to-use awards block. Its own Phase-1 recommendation was to *"drop the bare counter and show the named list below"* — written in v1.0, never executed, which is why `/about` ships the numeral `4` today.
  - **§1's "Where to change in code" list is STALE — do not follow it.** It names `components/core/animated-number-basic.tsx` (dead code) and `components/seo/structured-data.tsx` (deleted in Phase 10). Its JSON-LD item is already done. The live targets are `app/about/about-client.tsx` and `app/about/opengraph-image.tsx`.
  - **The proof bands keep all four entries.** `grid-cols-2 sm:grid-cols-4` on the homepage, `/services` and `/about` stays as-is — there is no collapse to design around. PRF-01 is additive: where the named awards appear relative to the existing `4` cell is the open design decision.
  - **Both bands carry a shared footnote** — *"Every figure above is career to date, across roles at Nagarro, Chameleon Collective, and Wealthberry Labs"* (`app/page.tsx`, `app/services/services-client.tsx`). All four awards are from GrowIt!, a single product. If the named awards land inside those bands, that sentence needs to stay true.
  - **`/services` wraps values in `AnimatedMetricValue`** (counts up from zero); the homepage deliberately does not — a documented Phase-10 choice. Award names cannot count up. Any award content added to `/services` must account for this.
  - ~~**`app/page.tsx` is the cross-phase file conflict with Phase 12.** Complete this phase before Phase 12 opens it.~~ **CORRECTED 2026-08-22 (REC-01):** there is no cross-phase `app/page.tsx` conflict — it assumed figure removal and a `home-page-argument.test.tsx` rewrite that were both voided. Phase 11 touches only `app/about/opengraph-image.tsx`, `app/about/about-client.tsx` and one new test file. `app/page.tsx` remains off-limits this phase for a separate reason: D-08 scopes PRF-01 to `/about` only.

**Suggested internal order**:

  1. Fix the `/about` OG `6` → `4` as its own independently-shippable commit — pure bug, nothing blocks it
  2. REC-01 record corrections — cheap, and stops the withdrawn premise propagating while the rest is in flight
  3. PRF-01 named-awards copy on `/about`, honouring the footnote and animation constraints above
  4. CRED-12 consistency test last, once the final shape is settled

**Plans**: 5 plans in 4 waves

- [x] 11-01-PLAN.md — CRED-13: `/about` OG image states 4 Design Awards, not 6 (wave 1, standalone commit per D-02)
- [x] 11-02-PLAN.md — REC-01: verify the withdrawn-premise corrections across the planning record, remediate only gaps (wave 2, sequenced after 11-01 per D-10's "second" and to make D-02's "first" commit deterministic)
- [x] 11-03-PLAN.md — PRF-01: the four named awards as visible copy inside `/about`'s Design awards cell (wave 2)
- [x] 11-04-PLAN.md — CRED-12: award-count consistency regression test across five stating surfaces (wave 3, written last per D-14)
- [x] 11-05-PLAN.md — Phase gate: `lint` → `tsc` → `test` plus blocking human verification of the rendered band (wave 4)

**UI hint**: yes

### Phase 12: Enterprise Legibility

**Goal**: Echo and Nagarro read, across every rendered surface, as proof Randy can operate inside a regulated, large-organization environment — Echo recategorized and demonstrably promoted, its one qualitative metric resolved at the data layer, Nagarro's raw metrics reframed only after each has a recorded backing disposition — and the `/projects` page carries one real, accessible entry point into that regulated/field-operations work.

**Depends on**: Phase 11 — sequenced after it, but the original cross-phase file conflict is gone. That conflict assumed Phase 11 would edit `app/page.tsx` for figure removal and rewrite `home-page-argument.test.tsx`; both were voided when the metric-removal premise was withdrawn (2026-08-22). Phase 11 as planned touches only `app/about/opengraph-image.tsx`, `app/about/about-client.tsx` and a new test file, so `app/page.tsx` is untouched and free for this phase to reword the Selected-work paragraph naming Echo/Nagarro

**Requirements**: ENT-01, ENT-02, ENT-03, ENT-04, ENT-05

**Success Criteria** (what must be TRUE):

  1. Echo leads the ordering under a regulated-operations framing, verified across all THREE independent mechanisms by rendering each surface: `FEATURED_SLUGS` (`app/page.tsx:55`), the `PROJECTS` array position (`lib/data/projects.ts`), and `GlobalCaseStudyGrid`'s runtime year-parse sort — which today ranks Echo **last** because its `timeline` field (`"Alpha → Beta → Launch"`) has no year to parse
  2. No qualitative value sits in a metrics slot — verified in the rendered `CreativeWork` JSON-LD `additionalProperty` output, not only in visible copy — closing Echo's `{ label: "Call Center Stress Reduction", value: "Significant" }` gap
  3. Nagarro's raw `metrics[]` reads in organizational-design terms, with a recorded per-metric disposition (backed-by-alternate-source / downgraded-to-qualitative / accepted-as-firsthand-account) for each of NAGARRO-01..08 completed and logged *before* any reframe copy is written
  4. `/projects` has exactly one working entry point into the regulated/field-operations work — a real `<Link>` on the existing `?category=` mechanism, not a filter bar, and not attached to the section heading
  5. Cross-surface consistency holds per CRED-09 (v2.0's standard) — Echo's and Nagarro's visible copy, metadata, OG images, and JSON-LD agree with each other after this phase's edits

**Planning constraints** (hard, do not route around):

  - **ENT-03 has a HUMAN GATE.** Randy decided Nagarro resolves via firsthand-account policy, which requires a recorded per-metric disposition for NAGARRO-01..08 BEFORE any reframe copy is written — structurally identical to v2.0's CRED-08 sign-off, which was a real blocker there. **Mark the plan carrying ENT-03 `autonomous: false`.**
  - **ENT-01's category term must be collision-checked** against every project's existing `category` / `categories[]` / `tags[]` before selection — `lib/project-utils.ts` matches by case-insensitive substring, and Nagarro already carries `"Accessibility Compliance"`. If the chosen term is compliance-adjacent, the loose matcher will silently pull Nagarro into what's meant to be an Echo-specific filter.
  - **ENT-04 must call `useSearchParams()` from inside the existing `<Suspense>` boundary** in `app/projects/projects-client.tsx`, never a second call site, or static prerender breaks. It must also never attach an interactive role to the section heading — the v2.0 `TextScramble` regression (`26c7bf0`).
  - Do not rewrite Nagarro's `roleNarrative` / `decisions[]` prose — already the strongest asset on the page; the gap is narrowly the raw `metrics[]` array.
  - Do not invent a figure for Echo's constraint slot, compute a replacement aggregate anywhere, or build a multi-chip filter bar — all three are named anti-features in research (recreate CRED-07, breach the CRED-08 NDA line, or add interaction/ARIA cost for a grouping that resolves to n=1).

**Suggested internal order** (from research, deviate only with reason):

  1. ENT-02 (Echo's qualitative metric) — smallest, fully isolated, zero downstream code changes
  2. ENT-01 (Echo recategorized) — everything else in the phase depends on the final category string
  3. ENT-03 (Nagarro reframe) — human gate; dispositions recorded before copy is written
  4. ENT-04 (grouped entry point) — needs ENT-01's settled category value
  5. ENT-05 verified last, by rendering all three ordering mechanisms independently — fixing mechanisms 1 and 2 does nothing to fix the third

**Plans**: TBD

**UI hint**: yes

### Phase 13: AEO Remediation

> Added 2026-08-29, scoped from `.planning/research/SEO-AEO-AUDIT.md` (codebase +
> live-HTML audit). Independent of Phase 12's requirements, but 13-04 moves
> `app/page.tsx`'s content into `app/home-client.tsx` — Phase 12's file
> references to `app/page.tsx:55` (`FEATURED_SLUGS`) and the Selected-work
> paragraph now resolve to `app/home-client.tsx`. Phase 12's human gate
> (ENT-03 dispositions) is untouched.

**Goal**: The content AI crawlers should be citing actually reaches them — collapsed
accordions no longer unmount their children from the server HTML, the visible FAQ
carries FAQPage schema again (D-08 amended), every blog post states one publication
date everywhere, machines get llms.txt and an RSS feed, and the homepage declares its
own metadata.

**Depends on**: Phase 10 (v2.0 SEO remediation, shipped). Not blocked by Phase 12.

**Requirements**: audit findings T-01..T-04, T-06..T-10, T-12..T-14, T-16

**Success Criteria** (what must be TRUE):

  1. `curl` of `/`, `/blog`, and `/projects/rambis-ui` returns the FAQ answers, the
     blog archive's per-post links, and the Rambis accordion content in the raw HTML
     (T-01)
  2. The homepage emits a `FAQPage` JSON-LD node whose questions/answers match the
     visible "Questions founders ask" content verbatim; the stale comment at
     `app/page.tsx:59-61` is gone (T-02)
  3. Each blog post has exactly one publication date, sourced from one place, and the
     sitemap, archive UI, OG `publishedTime`, and Article JSON-LD all agree (T-03)
  4. `/llms.txt` serves a Markdown map of the site (identity, services, case studies,
     posts) and `/rss.xml` serves a valid RSS 2.0 feed linked via
     `<link rel="alternate">` in the root layout (T-04, T-06)
  5. All four blog posts emit complete article OG (title, description, url, image,
     publishedTime) via `createArticleMetadata()` — no longer dead code (T-07)
  6. Person JSON-LD carries `email`; the resume PDF is linked from a rendered page
     (T-08)
  7. `app/page.tsx` is a server component exporting homepage-specific metadata and
     importing `app/home-client.tsx`, per the repo's own convention (T-09)
  8. Waffle emits `CreativeWork` JSON-LD like every other project page;
     `projectMetadata` never emits `openGraph.images: []`; `WebSite.potentialAction`
     is gone (T-10, T-13)
  9. Dead SEO code and stale docs are removed (`related-content.tsx`,
     `getMetadataBase`, two root-level SEO reports); the sitemap test asserts the
     real static-page count (T-14)
  10. `npm run lint` → `npx tsc --noEmit` → `npm test` all pass (build is NOT a gate)

**Planning constraints** (hard, do not route around):

  - **Do not regress the Visible-At-Zero rule** — the accordion fix must keep content
    mounted (height-collapse, `forceMount`, or `<details>`), not re-hide it behind JS.
  - **FAQPage restores a schema D-08 excluded.** Amend D-08 in the decision log rather
    than silently violating it: FAQPage is now permitted *because* the Q&A is visible
    server-rendered content — the original removal predates that.
  - **One date source for blog posts.** `lib/utils/blog-data.ts` must derive from or
    be reconciled with the MDX metadata, not remain a third hand-typed copy. The MDX
    byline + JSON-LD dates are the authoritative ones (they were author-written);
    the mock array's dates are the ones to correct.
  - **The homepage split is a move, not a rewrite** — `home-client.tsx` receives
    `app/page.tsx`'s content verbatim; `__tests__/integration/home-page-argument.test.tsx`
    must stay green (update its import only).
  - **Do not touch** the `/services` HTML-comment memo (T-18, intentional), the
    middleware/vercel.json cache headers (T-17, needs measurement), or
    `/projects/skills` vs `/skills` (T-15, positioning decision).

**Plans**: 5 plans in 3 waves

- [x] 13-01-PLAN.md — T-04/T-06: llms.txt route + RSS 2.0 feed + `rel=alternate` (wave 1)
- [x] 13-02-PLAN.md — T-01/T-02: accordion content mounted in server HTML on all three surfaces; FAQPage JSON-LD on the homepage (wave 1)
- [x] 13-03-PLAN.md — T-03/T-07/T-12: blog date unification + `createArticleMetadata()` adoption in all four MDX posts (wave 1)
- [x] 13-04-PLAN.md — T-08/T-09/T-10/T-13/T-14/T-16: homepage server/client split, Person email, resume link, waffle CreativeWork, projectMetadata OG fallback, drop SearchAction, dead-code/doc cleanup, sitemap test count (wave 2, after 13-02 since both touch `app/page.tsx`)
- [x] 13-05-PLAN.md — Phase gate: lint → tsc → test + raw-HTML verification of success criteria 1–4 (wave 3)

**UI hint**: yes (accordion behavior + homepage split must be visually verified)

## Progress

**Execution Order:** Phases execute in numeric order: 11 → 12 (13 is independent of 12 and may execute first)

| Phase | Milestone | Plans | Status | Completed |
|-------|-----------|-------|--------|-----------|
| 1. Credibility Fixes | v1.0 | pre-GSD (traced) | Complete | 2026-08-14 |
| 2. Positioning & Messaging | v1.0 | pre-GSD (traced) | Complete | 2026-08-14 |
| 3. Candidate Readiness | v1.0 | pre-GSD (traced) | Complete | 2026-08-14 |
| 4. Waffle Product Page | v1.0 | 3/3 | Complete | 2026-08-15 |
| 5. Foundation & Cleanup | v2.0 | 2/2 | Complete | 2026-08-15 |
| 6. Narrative Template & Data Model | v2.0 | 1/1 | Complete | 2026-08-15 |
| 7. Bespoke Convergence | v2.0 | pre-GSD (traced) | Complete | 2026-08-15 |
| 8. Content Rewrite & Credibility Guardrails | v2.0 | pre-GSD (traced) | Complete | 2026-08-16 |
| 9. Cross-Surface Verification | v2.0 | 5/5 | Complete | 2026-08-20 |
| 10. SEO Remediation | v2.0 | 10/10 | Complete | 2026-08-22 |
| 11. Self-Consistency & Proof | v3.0 | 5/5 | Complete   | 2026-08-24 |
| 12. Enterprise Legibility | v3.0 | 0/TBD | Not started | - |
| 13. AEO Remediation | v3.0 | 5/5 | Complete | 2026-08-29 |

## Backlog

- **POL-01** — visual polish pass beyond case-study surfaces (deferred from v1.0
  and v2.0)

- **POL-02** — waffle converged onto the shared template as a *case study* (it
  already shares the template as a product page)

- **Blog Article structured data** — `datePublished`/`dateModified` emit bare
  dates with no time or timezone; no `image`; `Paywalled Content` detected on a
  post that is not paywalled

- **`/services` reader conflict** — `/services` and the retainer funnel were built
  outside GSD and now own the metadata description and primary conversion path on
  a site whose PROJECT.md core value names the hiring manager as the reader.
  A positioning decision, not a queued task

- **MI-4** — consolidate `about-client.tsx`'s local `achievements` array into
  `lib/data/retainer.ts`'s `PROOF_EXHIBITS` (deferred from v3.0 — see REQUIREMENTS.md "Future Requirements")

- **EL-5** — surface Echo's already-authored but never-rendered `constraints.environmental` data (deferred from v3.0)
- **GE-3** — reuse the existing `role="status"` filter-state announcement on the new `/projects` entry point (deferred from v3.0)
- Dead-code cleanup of `enhanced-metrics-grid.tsx`, `enhanced-hover-cards.tsx` (deferred from v3.0)

- **Blog publishing cadence** — the highest-leverage AEO lever is new content;
  4 posts, newest 2025-07-21 (audit T-05). Content work, not a queued code task

- **Visible contact page / section** — email appears only in privacy/terms;
  whether to surface it to humans (vs schema-only) is a positioning decision
  (audit T-08 residue)

- **`/projects/skills` vs `/skills`** near-duplicate URLs (audit T-15) and the
  middleware/vercel.json cache-header conflict on `/projects/*` HTML (audit
  T-17) — each needs a decision/measurement before action

---
*Last updated: 2026-08-29 — Phase 13 AEO Remediation added from SEO/AEO audit (5 plans, 3 waves), executing*
