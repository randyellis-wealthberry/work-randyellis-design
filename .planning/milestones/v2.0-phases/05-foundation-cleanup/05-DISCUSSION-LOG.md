# Phase 5: Foundation & Cleanup - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-15
**Phase:** 5-Foundation & Cleanup
**Areas discussed:** LedgerIQ orphan handling, Deck-coverage audit shape, app/data.ts migration, Proof chips + badge fix, Making "no AI slop" concrete, Deck audit as its own plan, Phase 5 verification approach

---

## Gray Area Selection

| Option | Description | Selected |
|--------|-------------|----------|
| LedgerIQ orphan handling | Delete vs redirect; salvage the 1,144-line bespoke page? | ✓ |
| Deck-coverage audit shape | Deck source, table format, granularity | ✓ |
| app/data.ts migration | 3 live importers + archive-data drift | ✓ |
| Proof chips + badge fix | DEBT-01 chip treatment, DEBT-02 dead zone | ✓ |

**User's choice:** All four.
**Notes:** User added an unprompted standing constraint — *"I want these case studies to not be AI slop, it should be unique using the platform design language and components."* Not scope creep (it's a cross-cutting quality rule, not a new capability), so it was recorded as a milestone-level constraint rather than deferred. It later became its own gray area and is captured as D-16.

---

## LedgerIQ Orphan Handling

### Q1 — How should the orphaned /ledgeriq root route be removed?

| Option | Description | Selected |
|--------|-------------|----------|
| Delete + 301 redirect | Delete `app/ledgeriq/`, add permanent redirect to `/projects/ledgeriq` in `next.config.js`. Insurance for external inbound links; makes canonicalization explicit | ✓ |
| Hard delete, no redirect | Just delete. Never in sitemap, nothing links to it, images 404 | |
| Delete + redirect + verify live | Same as recommended, plus checking Vercel analytics / Search Console for actual traffic first | |

**User's choice:** Delete + 301 redirect.
**Notes:** Scout facts that informed the options — `public/ledgeriq/` is empty so every image the page references 404s; `app/sitemap.ts` only emits `/projects/{slug}` so the route was never submitted.

### Q2 — What happens to the bespoke page's content before deletion?

| Option | Description | Selected |
|--------|-------------|----------|
| Delete outright, flag the conflict | Salvage nothing; log the $2.3M vs $180K metric contradiction as a hard UNBACKED entry in the Phase 5 audit | ✓ |
| Archive the file first, then delete | Copy `ledgeriq-client.tsx` to `.planning/` as a reference artifact for Phase 8 | |
| Salvage the process steps into projectData | Port the 5 process steps into `lib/data/projects.ts` `processStory` now | |

**User's choice:** Delete outright, flag the conflict.
**Notes:** Surfaced mid-question: the two LedgerIQ pages state contradictory metrics for the same project ($2.3M vs $180K annual savings; 40% vs 78%; 60% vs 65%; 85% vs 92%). The orphan survived review precisely *because* it was unlinked. Compounds the pre-existing STATE.md blocker on LedgerIQ's real-vs-composite status.

---

## Deck-Coverage Audit Shape

### Q1 — Where does the 48-page deck come from?

| Option | Description | Selected |
|--------|-------------|----------|
| Commit deck to `.planning/` | Downstream agents read it directly on every future phase; no re-supply, no drift | ✓ |
| Extract to a text reference, don't commit the PDF | Read once, write `.planning/DECK-EXTRACT.md` with verbatim quotes + slide numbers | |
| You supply it per-session | Deck stays outside the repo, path given each time | |

**User's choice:** Commit deck to `.planning/`.

### Q2 — What granularity for the Backed / Partial / Unbacked table?

| Option | Description | Selected |
|--------|-------------|----------|
| Per claim, grouped by project | One row per metric/decision/rationale/outcome with verdict + slide number | ✓ |
| Per project | One row per project with an overall verdict plus notes | |
| Per narrative section, per project | One row per project × section, mapping onto Phase 6 template slots | |

**User's choice:** Per claim, grouped by project.

### Q3 — Does the audit inventory existing claims, unused deck material, or both?

| Option | Description | Selected |
|--------|-------------|----------|
| Both directions | Verdict existing on-site claims AND inventory unused deck material that feeds Phase 8 | ✓ |
| Existing site claims only | Tightly scoped to "is what we ship true" | |
| Deck-forward only | Inventory deck support and treat existing copy as disposable | |

**User's choice:** Both directions.

### Q4 — What happens to a project the deck barely covers?

| Option | Description | Selected |
|--------|-------------|----------|
| Flag + open question list for Randy | Per-project specific asks; Phase 8 can't write those sections until answered | ✓ |
| Flag and let Phase 8 render shallow | Mark Unbacked, omit the section | |
| Flag + propose narrowing milestone scope | If near-zero backing, recommend dropping the project from the 7 | |

**User's choice:** Flag + open question list for Randy.
**Notes:** Key scoping discovery — `.planning/CREDIBILITY-COPY.md` is 100 lines and covers GrowIt only (grep counts: growit 6, all six others 0). FND-03 is therefore a new deep extraction, not a summary of prior work, and is likely the phase's largest item.

---

## app/data.ts Migration

### Q1 — What to do about /archive's fabricated content?

| Option | Description | Selected |
|--------|-------------|----------|
| Unlink + delete the route | Delete `app/archive/` + footer link + both ARCHIVE datasets. Nothing real is lost | ✓ |
| Keep route, empty the data | Repoint to `lib/data` with an empty array, render the empty state | |
| Keep it, populate with real content | Fill with genuine artifacts — but that's Phase 8 content work | |
| Repoint only, defer the fabrication fix | Mechanical FND-01 migration, log fabrication as deferred | |

**User's choice:** Unlink + delete the route.
**Notes:** `/archive` is linked from the site-wide footer (`app/footer.tsx:17`) and crawlable, and renders 4 fabricated articles with `https://example.com/…` links and 404 thumbnails (`public/images/archive/` doesn't exist). The `lib/data` version is a *different* set of 3 fabricated placeholders with different categories — so a plain repoint would have swapped one fabrication for another. Missed by the v1.0 audit because that audit was scoped by REQ-ID to named pages.

**Not asked (resolved by scout, recorded as mechanical):** the remaining `app/data.ts` importers. `lib/data/projects.ts` is a strict superset (8 slugs vs 4) and `WORK_EXPERIENCE` is identical, so `getEmail`, the `Project` type, and the Jest mock repoint cleanly.

### Q2 — How should FND-04 handle `components/case-study/*`?

| Option | Description | Selected |
|--------|-------------|----------|
| Delete all 6, carry the contract forward | Delete everything incl. `case-study-section.tsx`; record that Phase 6 must keep its a11y contract but render headings via `ScrambleSectionTitle` | ✓ |
| Delete 5, keep `case-study-section.tsx` | Preserve the 35-line wrapper as-is for Phase 6 | |
| Delete all 6, no carry-forward note | Clean sweep, let Phase 6 start from scratch | |

**User's choice:** Delete all 6, carry the contract forward.
**Notes:** Research had flagged `case-study-section.tsx` as worth resurrecting. Inspection showed it renders a plain centered `<h2>` while the live template uses `ScrambleSectionTitle` 39× — so resurrecting it as-is would fork the design language, directly against the user's no-slop constraint. The genuinely valuable part is its contract (`id` + `role="region"` + `aria-labelledby`), which Phase 6's `CaseStudyTOC` needs and the live template lacks. `case-study-layout.tsx` was confirmed to hardcode Echo's image paths inside a "generic" component.

---

## Proof Chips + Badge Fix

### Q1 — How should the hero subhead resolve into proof chips? (DEBT-01)

| Option | Description | Selected |
|--------|-------------|----------|
| One-line prose + 3 non-duplicating chips | Short `TextGradientScroll` line, then 3 chips carrying tenure / leadership span / hands-on code | ✓ |
| Chips only — drop the paragraph | Replace the 43-word block entirely; loses the gradient-scroll effect and the positioning thesis | |
| Chips carry the numbers, retire the counter | Move metrics into hero chips, delete `AnimatedNumberBasic` | |

**User's choice:** One-line prose + 3 non-duplicating chips (preview locked).
**Notes:** Root cause identified — the 43-word subhead restates *two of the four* stats in the `AnimatedNumberBasic` block ~200px below (2.5M users, 800 designers). POS-02 read unresolved after v1.0 because the counter duplicated the subhead's job rather than replacing it. Also noted for the audit: "$50M in product value" appears nowhere in `CREDIBILITY-COPY.md`.

### Q2 — How to fix the Live Product badge dead zone? (DEBT-02)

| Option | Description | Selected |
|--------|-------------|----------|
| `pointer-events-none` on the badge | One class; clicks fall through to the `<Link>`. Badge is informational, not interactive | ✓ |
| Move the badge inside the `<Link>` | Correct but restructures JSX and affects the link's accessible name | |
| Wrap the whole card in the Link | Broadest fix, but changes click behavior for the entire grid | |

**User's choice:** `pointer-events-none` on the badge (preview locked).
**Notes:** Confirmed the dead zone exists only at `app/projects/projects-client.tsx:238`. The `waffle-client.tsx:118` badge sits in normal flow with no overlay and needs no change.

---

## Making "No AI Slop" Concrete

### Q1 — How should the rule be made enforceable downstream?

| Option | Description | Selected |
|--------|-------------|----------|
| Named allowlist + bans, enforced at Phase 6's UI-SPEC gate | Concrete list in CONTEXT.md; Phase 6's `UI-SPEC.md` encodes it so `gsd-ui-checker` can BLOCK | ✓ |
| Each component must cite a reference implementation | Every new component names an existing one it's modeled on | |
| Write a design-language rubric doc | `.planning/DESIGN-LANGUAGE.md` standalone reference | |

**User's choice:** Named allowlist + bans, enforced at Phase 6's UI-SPEC gate.
**Notes:** Chosen because Phase 6 is already flagged `UI hint: yes` in ROADMAP.md, so `/gsd:ui-phase` + `gsd-ui-checker` already run there — the rule rides existing machinery instead of adding an unread doc. Prose constraints ("don't be generic") are unenforceable; named allowlists are checkable.

### Q2 — What counts as "AI slop"? (multi-select)

| Option | Description | Selected |
|--------|-------------|----------|
| Generic icon+heading+body cards | The lucide-icon / bold-heading / gray-body card every AI landing page ships | ✓ |
| Uniform template fill across projects | Identical section set in identical order regardless of content support | ✓ |
| New color/type/spacing outside the system | No new palette entries, type-scale steps, or spacing values | ✓ |
| Decorative stock/placeholder imagery | No filler images to pad a section | ✓ |

**User's choice:** All four banned.

---

## Deck Audit As Its Own Plan

| Option | Description | Selected |
|--------|-------------|----------|
| Own plan, parallel to cleanup | Audit = Plan A, cleanup = Plan B; no shared files, no dependency | ✓ |
| Own plan, sequenced first | Audit lands before cleanup starts | |
| One plan for the whole phase | Everything in a single plan | |

**User's choice:** Own plan, parallel to cleanup.
**Notes:** Rationale — the audit can stall on Randy's input (deck delivery, open questions) and must not block mechanical code wins. Plan A is the only Phase 8 blocker.

---

## Phase 5 Verification Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Standard gate: lint + tsc + test | Baseline; catches broken imports | ✓ |
| Link-integrity sweep | Grep for surviving refs to deleted routes/files | ✓ |
| Test-suite audit for deleted surfaces | Find and deliberately update tests asserting on deleted surfaces | ✓ |
| Manual browser check of touched pages | Load `/`, `/projects`, `/projects/ledgeriq` and verify behavior | ✓ |

**User's choice:** All four.

---

## Claude's Discretion

- Audit artifact filename/location — suggested `.planning/DECK-COVERAGE-AUDIT.md`
- Exact Backed / Partial / Unbacked definitions (proposal recorded in CONTEXT.md D-section)
- Whether non-deck verifiable sources (App Store 4.8★, Chameleon URL, LinkedIn) count as Backed — proposed yes, if the row carries a source link
- Exact chip copy/wording and chip component treatment for D-14
- Whether `ArchiveItem` type and `lib/data`'s `ARCHIVE_ITEMS` are deleted or left as unused exports
- File-deletion ordering and commit granularity within Plan B

## Deferred Ideas

- **"$50M in product value"** (`components/core/animated-number-basic.tsx:14`) — unsourced in `CREDIBILITY-COPY.md`. Not touched in Phase 5; logged for the FND-03 audit to verdict and Phase 9 to reconcile
- **Real `/archive` content** — populating an archive with genuine talks/workshops/articles is content work needing Randy input; a future milestone, not v2.0
- **Repo-wide placeholder / `example.com` sweep** — raised after the `/archive` find, not pursued; belongs alongside Phase 9's cross-surface verification if at all
- **`/projects/ledgeriq`'s own metrics** (78%, $180K, 92%, 65%) — also unverified. Not caveated or pulled in Phase 5; they go through the FND-03 audit like every other claim
