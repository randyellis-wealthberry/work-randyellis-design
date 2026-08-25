# Requirements — v3.0 Enterprise Credibility

**Status:** 🔨 IN PROGRESS
**Defined:** 2026-08-22 · **Rescoped:** 2026-08-22 (metric-integrity premise withdrawn)
**Phases:** 11-12 (numbering continues from v2.0)
**Core Value:** A hiring manager finds a coherent, senior, *verifiable* story — and here, the
site agrees with itself, names its proof, and the two large-organization engagements read as
proof of operating under constraint.

## Scope Correction (read before planning)

**The staged metric-integrity premise was wrong and has been withdrawn (2026-08-22, Randy).**

v3.0 was staged around removing three figures — `2.5M+ Users Impacted`, `$50M in product value`,
`800+ Designers Mentored` — because `DECK-COVERAGE-AUDIT.md` verdicted them `Unbacked`. That
inverted what the audit actually says:

> **`:34`** — *"**Unbacked** — not found in this deck. **This is not a defect and requires no
> action.**"*
>
> **`:6`** — *"'Unbacked' below means 'not found in this 48-page PDF,' nothing more. It is not a
> finding of falsehood and does not require Randy to justify a claim."*
>
> **`:37`** — the non-deck-source rule was **removed**: *"Randy's own account of his engagements
> is a source."*

`PROJECT.md` and `MILESTONES.md` summarized those verdicts as credibility debt. They are not.
**The figures are accurate and stay.**

This is the milestone's own target failure, one level up: the 2026-08-15 deck-gate reversal was
recorded in the audit, and every downstream summary kept the pre-reversal framing. REC-01 exists
so it cannot regenerate a fourth time.

### What survives, and why

Neither surviving item was ever about deck backing.

- **`/about`'s OG image renders `6` Design Awards** (`app/about/opengraph-image.tsx:238`) while
  `lib/data/retainer.ts:51`, `app/about/about-client.tsx:26` and the four named awards in
  `lib/seo/json-ld.ts` all say 4. The site contradicts itself, and "6" was explicitly retired in
  v1.0. → **CRED-13**

- **The four named awards are machine-visible but human-invisible.** `lib/seo/json-ld.ts:79-84`
  serves a crawler four awards with issuer, category and product; `/about` shows a human the
  numeral `4`. Not a fix — an improvement `CREDIBILITY-COPY.md` §1 recommended in v1.0 ("drop the
  bare counter and show the named list below") and that was never executed. → **PRF-01**

### Voided requirements

| REQ-ID | Was | Void because |
|--------|-----|--------------|
| CRED-10 | Remove the three figures from rendered pages | Figures are accurate; nothing to remove |
| CRED-11 | Remove them from metadata and both OG images | Same |
| CRED-14 | Rewrite `home-page-argument.test.tsx` | It asserts those figures are present — **correct as written** |
| CRED-16 | Strip the figures from repo docs | Same |
| PRF-02 | Redesign 5 stat bands around the collapse | No collapse — the bands keep all four entries |

CRED-15 (dead modules) moves to Future: still dead, but with no unbacked claim inside them there
is no reason to force it into v3.0.

## Decisions Taken at Definition (Randy, 2026-08-22)

| # | Question | Decision |
|---|----------|----------|
| 1 | Nagarro's 8 metrics verdicted `Unbacked` | **Firsthand-account policy** — his own account is a source. Later generalized to the three sitewide figures, which withdrew the metric-integrity premise entirely |
| 2 | What fills the stat band after removal? | **Moot** — nothing is removed. The awards work survives as PRF-01, an improvement rather than a backfill |
| 3 | How should the grouped entry point land? | **One `<Link>`, no filter bar** — a multi-chip bar resolving to n=1 is an anti-feature |
| 4 | Are repo docs in scope? | **Moot** — nothing to strip |
| 5 | Dead modules | Files kept per the standing incorporate-don't-delete preference; deferred out of v3.0 |
| 6 | Correct the stale framing? | **Yes, everywhere** — `PROJECT.md`, `MILESTONES.md`, and the v2.0 audit → REC-01 |

## v3.0 Requirements

### Self-Consistency & Proof (Phase 11)

- [x] **CRED-13**: `/about`'s OG image states **4** Design Awards, not 6 — closing the third
      recurrence of the v1.0 CRED-01 defect and removing a live self-contradiction with the three
      other surfaces that say 4

- [x] **PRF-01**: The 4 named awards (Davey ×2, Vega ×2) appear as **visible on-page copy** with
      issuer and category, sourced to `CREDIBILITY-COPY.md` §1 (deck slide 28, GrowIt!). The
      Webby stays listed as *judge*, never as a win. `§1`'s "Where to change in code" list is
      **stale** — it names dead and deleted files, and its JSON-LD item is already done, which is
      exactly how the awards became machine-visible but human-invisible

- [x] **CRED-12**: A regression test pins the award count as **consistent across every surface**
      that states it — `retainer.ts`, `about-client.tsx`, the JSON-LD `award` array, and both OG
      generators — so a figure cannot drift on one surface again. Verified structurally against
      the data shape, not by bare string match (`"4"` alone collides with `grid-cols-4`,
      `h-4 w-4`, and much else). Reuses `__tests__/seo/no-legacy-schema.test.ts`'s directory
      walker, which excludes `.planning/` by construction

- [x] **REC-01**: The withdrawn premise is corrected everywhere it is recorded — `PROJECT.md`'s
      Active requirements and Key Decisions, `MILESTONES.md`'s v2.0 "Known deferred items", and
      `.planning/milestones/v2.0-MILESTONE-AUDIT.md` — each stating that `Unbacked` means "absent
      from the deck", not "unsupported", per the audit's own definitions

### Enterprise Legibility (Phase 12)

- [ ] **ENT-01**: Echo is recategorized off `"Mobile App"` into a regulated / field-operations
      framing. The chosen term is collision-checked against every project's existing
      `category` / `categories[]` / `tags[]` first — `lib/project-utils.ts` matches by
      case-insensitive substring, and Nagarro already carries `"Accessibility Compliance"`

- [ ] **ENT-02**: Echo's `{ label: "Call Center Stress Reduction", value: "Significant" }` is
      resolved at the data layer in `lib/data/projects.ts`. A qualitative word in a numeric slot
      reads as a hole where a number should be. Fixing the data fixes the live JSON-LD
      `additionalProperty` for free — there is no separate schema task

- [ ] **ENT-03**: Nagarro's raw `metrics[]` reads in organizational-design terms — **after** each
      of NAGARRO-01..08 has a recorded disposition (backed-by-alternate-source / downgraded-to-
      qualitative / accepted-as-firsthand-account). Relabeling before dispositioning repeats the
      Phase 9 `$50M` harmonization mistake. `metrics[0]` ("Nagarrians Impacted: 18,000+") is
      already org-scale and stays; the gap is indices 1-7, which flow verbatim into live JSON-LD

- [ ] **ENT-05**: Echo's promotion holds across **all three** independent ordering mechanisms —
      `FEATURED_SLUGS` (`app/page.tsx:55`), `PROJECTS` array position (`lib/data/projects.ts`),
      and `GlobalCaseStudyGrid`'s runtime sort. The third parses a year out of `timeline`; Echo's
      is `"Alpha → Beta → Launch"` with no year, so it currently falls back to `0` and ranks Echo
      **last** — silently, with no error. Each mechanism verified by rendering its surface

### Grouped Entry Point (Phase 12)

- [ ] **ENT-04**: One entry point on `/projects` leads to the regulated / field-operations work,
      built as a real `<Link>` on the `?category=` mechanism already shipped in Phase 10 (D-13)
      and already advertised by the `WebSite` `SearchAction` schema. It must call
      `useSearchParams()` from inside the existing `<Suspense>` boundary in
      `app/projects/projects-client.tsx`, never a second call site, and must never attach an
      interactive role to the section heading — the v2.0 `TextScramble` regression (`26c7bf0`)

## Future Requirements (deferred, not this milestone)

- [ ] **CRED-15**: The two dead modules — `animated-number-basic.tsx` (zero imports) and
      `related-content.tsx` (only import commented out at `app/blog/layout.tsx:4`) — get a
      disposition. Files kept per the incorporate-don't-delete preference; a background task is
      already logged for the wiring question

- [ ] **MI-4**: Consolidate `about-client.tsx`'s local `achievements` array into
      `lib/data/retainer.ts`'s `PROOF_EXHIBITS`. Two independent hand-authored arrays holding the
      same class of claim is a real structural smell. But the Key Decisions
      log's stated preference is "bounded punch-list, not research build"

- [ ] **EL-5**: Surface Echo's already-authored but never-rendered `constraints.environmental`
      data

- [ ] **GE-3**: Reuse the existing `role="status"` filter-state announcement on the new entry point
- [ ] **POL-01**: Visual polish pass beyond case-study surfaces (deferred from v1.0)
- [ ] Dead-code cleanup of `enhanced-metrics-grid.tsx`, `enhanced-hover-cards.tsx`

## Out of Scope

- **Removing the three sitewide figures.** Withdrawn 2026-08-22 — `Unbacked` means "absent from
  the 48-page deck", not "unsupported". The figures are accurate and stay

- **Restoring "6 Design Awards."** Closed in `PROJECT.md` — only if 2 more surface with proof.
  CRED-13 removes the last surface still rendering 6

- **Inventing a figure for Echo's constraint slot.** Breaches the CRED-08 disclosure line
  (Echo = process-and-design only)

- **Rewriting Nagarro's `roleNarrative` / `decisions[]` prose.** Already the strongest asset on
  the page; the gap is narrowly the raw `metrics[]` array

- **A multi-chip filter bar on `/projects`.** Only 1 of 8 projects is genuinely regulated /
  field-ops; a chip bar resolving to n=1 adds ARIA and interaction cost for a grouping a scanning
  reader of an 8-item list gets for free

- **A new `/projects/field-operations` route.** `PROJECT.md` Key Decision: group on `/projects`,
  never a new surface needing its own metadata, OG image, and JSON-LD

- **A decorative "NDA" badge system.** The prose already states the boundary; a badge implies a
  taxonomy the data model doesn't have

- **The `/services` dual-reader question.** `/services` and the retainer funnel own the metadata
  description and primary conversion path on a site whose core value names the hiring manager as
  the reader. Which reader wins is a positioning decision for Randy, not a queued task. Logged so
  it is not silently inherited a third time

- **Site rebuild or visual redesign.** Consistent with v1.0 and v2.0

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| CRED-12 | Phase 11 | Complete |
| CRED-13 | Phase 11 | Complete |
| PRF-01 | Phase 11 | Complete |
| REC-01 | Phase 11 | Complete |
| ENT-01 | Phase 12 | Pending |
| ENT-02 | Phase 12 | Pending |
| ENT-03 | Phase 12 | Pending |
| ENT-04 | Phase 12 | Pending |
| ENT-05 | Phase 12 | Pending |

**Coverage:** 9/9 active v3.0 requirements mapped. No orphans.

**Voided (not mapped):** CRED-10, CRED-11, CRED-14, CRED-16, PRF-02 — see "Voided requirements".
**Deferred (not mapped):** CRED-15, MI-4, EL-5, GE-3, POL-01.
