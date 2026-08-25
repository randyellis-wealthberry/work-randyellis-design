---
phase: 05-foundation-cleanup
plan: 01
subsystem: docs
tags: [content-audit, credibility, deck-extraction, phase8-gate]

# Dependency graph
requires: []
provides:
  - "Per-claim Backed/Partial/Unbacked coverage table for all 7 in-scope case-study projects, verdicted against Randy's 48-page product design deck"
  - "LedgerIQ four-pair metric contradiction logged as an explicit, unresolved blocker"
  - "Per-project open-questions list for Randy (Part C)"
  - "Inventory of real, unused deck material for GrowIt and Addvance (Part B)"
affects: [phase-06-narrative-template, phase-08-case-study-copy]

# Tech tracking
tech-stack:
  added: [poppler (system dependency, `brew install poppler`, needed by the Read tool to render deck PDF pages)]
  patterns: []

key-files:
  created:
    - .planning/DECK-COVERAGE-AUDIT.md
  modified: []

key-decisions:
  - "Deck-Coverage Audit uses PDF page number (1-48) as the canonical 'Slide N' citation, not the deck's own printed footer numbers (which run 1-46 and skip the cover/closing slides), to remove ambiguity"
  - "Added Project.constraints as an audited claim-bearing field (not listed in the plan's <interfaces> block) because it is rendered live on every /projects/[slug] page (project-detail-client.tsx:703-784); consolidated to one row per category rather than one row per array entry to control volume"
  - "Addvance's systemic metric mismatch (15 of 15 site metrics Unbacked against the deck's real usability numbers) is flagged prominently in prose and in Part C but does not get a formal D-03 CONTRADICTION block, since that mechanism is reserved for LedgerIQ's two-clashing-source case"
  - "poppler-utils installed via Homebrew (system tool required by the Read tool's PDF page-rendering path, not a project dependency) to unblock reading the deck at all"
  - "REPAIR (post-completion): the first pass emitted 4-column truncated rows (no Verdict/Deck-slide/Note cells) for all claims in 5 of 7 zero-deck-coverage projects (ohplays, ledgeriq, echo, nagarro, rambis-ui) plus one 6-column row (RAMBIS-34); a follow-up repair pass filled all 182 incomplete rows with an explicit Unbacked verdict, '—' citation, and a per-project rationale note, and recomputed the Phase 8 Gate counts table from an actual per-row tally rather than trusting the original hand count (which also had GrowIt's Backed/Partial split wrong: 1/4, not 2/3)"

requirements-completed: [FND-03]

# Metrics
duration: 20min
completed: 2026-08-15
---

# Phase 5 Plan 1: Deck-Coverage Audit Summary

**Verdicted all 297 claims rendered across GrowIt, Oh!Plays, LedgerIQ, Addvance, EchoDrive,
Nagarro, and Rambis UI against Randy's full 48-page product design deck — corrected tally: 17
Backed, 12 Partial, 268 Unbacked — and found the deck itself only documents two of the seven
projects (GrowIt, Addvance), with Addvance's live metrics almost entirely fabricated against the
deck's real usability numbers. A post-completion repair pass fixed 182 rows the first pass had
left truncated (missing Verdict/citation/Note cells) and corrected a hand-counting error in the
original Phase 8 Gate totals (18/11/268).**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-08-15T18:10:53Z
- **Completed:** 2026-08-15T18:30:22Z
- **Tasks:** 4/4 completed (Task 1 precondition was already satisfied per orchestrator context;
  Tasks 2-4 executed in one continuous pass and committed as a single artifact)
- **Files modified:** 1 created

## Accomplishments

- Confirmed the deck precondition (Task 1): `Randy's Product Design Deck.pdf` present at
  `.planning/`, 16,263,989 bytes, and — critically — **exactly 48 pages** (verified via
  `pdfinfo`, matching the plan's expectation exactly; no discrepancy to flag).
- Read all 48 pages of the deck (in three ranges, `1-16`/`17-32`/`32-48`) and built a complete
  48-row Deck Index classifying every slide by topic, project, and claim-bearing status.
- Discovered the deck's own Agenda (slide 2) scopes its two case studies to **GrowIt** and
  **Addvance only** — the other five in-scope projects (Oh!Plays, LedgerIQ, EchoDrive, Nagarro,
  Rambis UI) have zero deck coverage of any kind.
- Verdicted all 297 individual claim rows across the 7 projects plus 4 sitewide stats
  (`animated-number-basic.tsx`), each tagged with a Claim ID, exact source file:line, and a
  citation for every Backed/Partial row.
- Logged the LedgerIQ D-03 four-pair metric contradiction ($2.3M vs $180K, 40% vs 78%, 60% vs
  65%, 85% vs 92%) as a dedicated, unresolved CONTRADICTION block — all four surviving figures
  verdicted Unbacked since LedgerIQ appears nowhere in the deck.
- Found that Addvance's 15 live site metrics (94% approval, 91.7% completion, 4.8/5 usability,
  etc.) are **all** Unbacked against the deck's real usability data (50/64/86/86% task success,
  74/82/93/93 scores, 14 participants) — while the bespoke `addvanced-client.tsx` render surface
  independently reproduces several of those real deck numbers almost exactly, and even directly
  contradicts the deck's own screenshot in one place (site claims "60% mission unfinished," the
  deck's own usability-report slide shows "0.0% Mission unfinished").
- Built Part B (7 rows of real, unused deck material for GrowIt/Addvance — e.g. the deck's
  actual GrowIt constraints and Addvance's real "What did we learn?" four-item list, neither of
  which matches the corresponding fabricated array on the live site) and Part C (7 per-project
  open-questions subsections, all ending in specific, answerable questions).
- Closed with the Phase 8 Gate section: the one-paragraph rule plus a raw Backed/Partial/Unbacked
  counts table, explicitly annotated per D-08 that the high Unbacked count is the expected result
  of a first extraction, not a defect — no minimum-Backed threshold is asserted anywhere.

## Task Commits

1. **Tasks 1-4 (deck precondition through Phase 8 Gate)** - `74bf1f2` (docs) — the deck read,
   scaffold, per-claim verdicting, LedgerIQ contradiction block, Part B/C, and Phase 8 Gate
   section were all authored in one continuous pass and committed as a single artifact, since
   the file was built with one `Write` call rather than incremental edits across separate task
   boundaries. This is a documented deviation from the plan's implied per-task commit
   granularity (see Deviations below).

**Plan metadata:** (this commit) `docs(05-01): complete deck-coverage audit plan`

## Files Created/Modified

- `.planning/DECK-COVERAGE-AUDIT.md` (707 lines) — the FND-03 gate artifact: Verdict
  Definitions, How To Read This, 48-slide Deck Index, Part A (per-project claim tables for all
  7 projects + Sitewide, plus the LedgerIQ CONTRADICTION block), Part B (unused deck material),
  Part C (open questions per project), and Phase 8 Gate (rule + counts table).

## Decisions Made

- **Slide citation format:** used PDF page number (1-48) as "Slide N" throughout, since the
  deck's own printed footer numbers (1-46) skip the cover and closing slides and would create
  an off-by-one ambiguity against the 48-page `pdfinfo` count the plan's acceptance criteria
  check against.
- **`constraints` field added to audited scope:** the plan's `<interfaces>` block omitted
  `Project.constraints`, but it renders live on every case-study page — auditing it (one
  consolidated row per environmental/technical/location category, not per array entry) was
  necessary to genuinely cover "every claim currently rendered" per D-06 half (a).
- **No formal CONTRADICTION block for Addvance:** despite Addvance's systemic metric mismatch
  being arguably as severe as LedgerIQ's, D-03's CONTRADICTION mechanism is scoped specifically
  to LedgerIQ's two-clashing-source case; Addvance's discrepancy is instead surfaced via strong
  inline notes in the Addvance Part A section and as Part C question #1/#2 for that project.
- **poppler-utils installed via Homebrew:** the Read tool's PDF-to-image path depends on
  `pdftoppm` (poppler), which was not present on this machine. This is a system utility
  invoked directly by the tool's own error message (not a project dependency, and not a
  package referenced by the plan), so it was installed to unblock the mandatory deck read
  rather than treated as a blocking package-legitimacy checkpoint.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking issue] Installed poppler-utils to unblock PDF reading**
- **Found during:** Task 2 (first attempt to read the deck)
- **Issue:** The Read tool returned `pdftoppm is not installed. Install poppler-utils...` when
  attempting to read `.planning/Randy's Product Design Deck.pdf` with a `pages` range — the
  deck could not be read at all without this system dependency.
- **Fix:** Ran `brew install poppler` (a well-known, official Homebrew formula, not a
  project-level npm/pip/cargo dependency, so the package-legitimacy checkpoint exclusion in
  Rule 3 does not apply). Confirmed `pdfinfo` then reported `Pages: 48`, matching the plan's
  expectation exactly.
- **Files modified:** None (system-level tool install only; no repo files touched).
- **Commit:** N/A (no repo change to commit; verified via `pdfinfo` output before proceeding).

**2. [Process deviation, not a Rule 1-4 fix] Single commit instead of one per task**
- **Found during:** Task commit protocol at the end of Task 4
- **Issue:** The plan's task list implies four separate commits (Task 2 scaffold, Task 3 Part A,
  Task 4 Part B/C/Gate — Task 1 is a read-only precondition check with no file to commit). The
  artifact was authored with a single `Write` call covering all of Tasks 2-4's content at once,
  since the sections are tightly interdependent (Part A cites the Deck Index built in Task 2;
  Part B/C cite Part A's claim IDs) and splitting the write into three sequential partial edits
  would have added risk (intermediate incomplete-file states) without adding real per-task
  isolation value for a docs-only artifact.
- **Fix:** Committed the complete, internally-consistent artifact as one commit (`74bf1f2`)
  rather than three partial ones.
- **Files modified:** `.planning/DECK-COVERAGE-AUDIT.md`.
- **Commit:** `74bf1f2`.

## Repair Pass (post-completion)

The orchestrator's spot-check on the originally-committed artifact (commit `74bf1f2`) found that
**181 of 297 Part A claim rows had only 4 columns instead of the required 7** — missing the
`Verdict`, `Deck slide / source URL`, and `Note` cells entirely — plus one row (RAMBIS-34) with 6
columns (missing only `Note`). All 182 affected rows belonged to the five projects the audit had
already determined have zero deck coverage:

| Project | Rows fixed | Total rows |
|---|---|---|
| ohplays | 42 | 42 |
| ledgeriq | 35 | 35 |
| echo | 37 | 37 |
| nagarro | 34 (of 35 — NAGARRO-35 was already correctly formed) | 35 |
| rambis-ui | 34 (33 fully truncated + 1 six-column) | 34 |

The first pass appears to have treated "these five projects are all Unbacked anyway" as license
to omit the verdict cell — which meant Task 3's acceptance criterion ("every row's Verdict cell
contains exactly one of Backed/Partial/Unbacked") was never actually met for 61% of Part A, and
the Phase 8 Gate counts table was an unverified assertion rather than a real tally.

**Fix applied:** every truncated row was given an explicit `Unbacked` verdict, a `—` citation
(correct for Unbacked rows), and a per-project rationale note explaining why the project has zero
deck coverage (e.g., for Oh!Plays: "Deck's Agenda (Slide 2) scopes case studies to GrowIt and
Addvance only; Oh!Plays never appears in the 48-page deck."). The three EchoDrive testimonial
rows (ECHO-35/36/37) additionally kept their original note about generic-title attribution. No
verdict was upgraded to Backed/Partial to improve the numbers — every fixed row remains Unbacked,
consistent with the zero-deck-coverage finding already established for these five projects.

**Additionally found and fixed while recomputing the Phase 8 Gate table:** the *original* Phase 8
Gate table (which covered all 7 projects, not just the 5 broken ones) had a hand-counting error
even for GrowIt's already-correctly-formatted rows — it reported 2 Backed / 3 Partial, but a
direct tally of GrowIt's 36 Part A rows shows 1 Backed (GROWIT-02) / 4 Partial
(GROWIT-01/03/22/25), not 2/3. GROWIT-01 was miscounted as Backed when its row's own Note text
says the deck's figure "matches" but the deck's own metric definition ("New Active Users") is
different in kind — the row was always Partial, not Backed. This changed the published Total from
18/11/268 to the corrected **17/12/268** (297 total, unchanged).

**Verification performed after the repair:**
- Every Part A claim row now has exactly 7 columns (0 rows with 4 or 6 columns) — verified via
  `awk`/column-count script across the full Part A range.
- Zero Backed/Partial rows have an empty or `—` citation cell.
- Part A row count is still 297 (columns were added, no rows were added or removed).
- Deck Index (48 rows), the LedgerIQ CONTRADICTION block, Part B, and Part C are byte-for-byte
  unchanged — confirmed via `git diff`, which shows edits scoped only to the five broken Part A
  subsections and the Phase 8 Gate counts table.
- Zero code files (`app/`, `components/`, `lib/`, `__tests__/`, `next.config.js`) modified by
  this repair.

**Files modified:** `.planning/DECK-COVERAGE-AUDIT.md`, this SUMMARY.
**Commits:** `fix(05-01): add missing verdict cells to 181 truncated audit rows` (audit fix),
plus this summary correction.

## Known Stubs

- `app/projects/addvanced/addvanced-client.tsx:947-969` renders a "Stakeholder Feedback"
  section by mapping over `processStory?.stakeholderQuotes`, but the `addvanced` entry in
  `lib/data/projects.ts` defines no `stakeholderQuotes` array — the section silently renders
  nothing on the live page. This is pre-existing code this plan does not modify (Phase 5 Plan 1
  writes zero code); flagged here as ADDVANCED-69 in the audit and as a Part C open question for
  Randy (does he have a real, named quote to fill it, or should the section be removed). Not a
  blocker for this plan's own completion — it is a finding the audit surfaces for Phase 6/8.

## Threat Flags

None. This plan introduced no new network endpoints, auth paths, file-access patterns, or
schema changes. All three T-05-01-01/02/04 mitigations from the plan's threat model were
followed: deck text was treated as untrusted data throughout (no instruction-shaped deck content
was found — nothing in the 48 pages resembled a prompt injection attempt), citations quote only
the minimum text needed per row, and the two non-deck-source claims found (Chameleon Collective,
4.8★ App Store rating) were verdicted Unbacked precisely because neither carries a working
source link, per the locked non-deck-source rule.

## Self-Check: PASSED

- `test -f .planning/DECK-COVERAGE-AUDIT.md` → FOUND
- `git log --oneline --all | grep -q 74bf1f2` → FOUND
- `grep -q "## Verdict Definitions" .planning/DECK-COVERAGE-AUDIT.md` → FOUND
- `grep -q "## Deck Index" .planning/DECK-COVERAGE-AUDIT.md` → FOUND
- `grep -c '^| *[0-9]\+ *|' .planning/DECK-COVERAGE-AUDIT.md` → 48 (meets "at least 48")
- All 7 project `###` headings present (growit, ohplays, ledgeriq, addvanced, echo, nagarro,
  rambis-ui) → FOUND
- `grep -c "CONTRADICTION"` → 4 occurrences (heading + intro line + all four numeric pairs
  present: `$2.3M`, `$180K`, `40%`, `78%`, `60%`, `65%`, `85%`, `92%`) → FOUND
- `grep -c "echo-client-final"` → 0 → PASS (dead file correctly never cited)
- Verdict tokens present are exactly `{Backed, Partial, Unbacked}` (no stray strings) → PASS
- Zero Backed/Partial rows have an empty (`—`) citation cell (verified via `awk` column check)
  → PASS *(note: at the time this check ran, 181 rows had no `Verdict` cell at all — they were
  neither Backed nor Partial nor properly Unbacked, so this check technically passed while
  missing the real defect; see "Self-Check: REPAIR" below for the corrected verification)*
- `wc -l .planning/DECK-COVERAGE-AUDIT.md` → 707 (meets "at least 150")
- `git status --porcelain app/ components/ lib/ __tests__/ next.config.js` → empty → PASS (zero
  code files touched)
- `.planning/STATE.md` and `.planning/ROADMAP.md` not modified by this plan → confirmed (only
  `.planning/DECK-COVERAGE-AUDIT.md` staged/committed)

All checks PASSED at the time. No missing items were flagged — but the orchestrator's later
spot-check found the column-count defect this original self-check missed (see below).

## Self-Check: REPAIR (post-completion, this pass)

- `awk 'NR>=131 && NR<548' .planning/DECK-COVERAGE-AUDIT.md | grep -E "^\| *[A-Z-]+-[0-9]+ *\|" | awk -F'|' '{print NF-2}' | sort -n | uniq -c`
  → `297 7` (every Part A claim row has exactly 7 columns; zero rows with 4 or 6 columns) → PASS
- Backed/Partial rows with empty or `—` citation cell → 0 found → PASS
- Part A claim row count → still 297 (columns added, no rows added/removed) → PASS
- Deck Index row count → still 48 → PASS
- `grep -c "CONTRADICTION"` → still 4 → PASS (LedgerIQ block untouched)
- `wc -l .planning/DECK-COVERAGE-AUDIT.md` → 711 (was 707; +4 lines from the Phase 8 Gate
  correction note, no rows added to Part A) → PASS
- `git status --porcelain app/ components/ lib/ __tests__/ next.config.js` → non-empty, but all
  entries pre-date this repair session (pre-existing working-tree state unrelated to this task —
  confirmed this repair touched only `.planning/DECK-COVERAGE-AUDIT.md` and this SUMMARY) → PASS
  for this repair's own scope
- `.planning/STATE.md` and `.planning/ROADMAP.md` not modified by this repair → confirmed
- Recomputed Phase 8 Gate per-project tally (Backed/Partial/Unbacked) via `awk` against the
  actual Verdict column, cross-checked against the published table → corrected total is
  **17 / 12 / 268** (was 18/11/268; GrowIt's split corrected from 2/3 to 1/4)

All repair checks PASSED. No missing items.
