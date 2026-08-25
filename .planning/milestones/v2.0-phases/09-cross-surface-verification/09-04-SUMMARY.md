---
phase: 09-cross-surface-verification
plan: 04
subsystem: credibility
tags: [credibility, audit, cross-surface-verification, matrix]
dependency_graph:
  requires: [09-02, 09-03]
  provides: [cross-surface-matrix, cred-09-proof-artifact]
  affects: [.planning/phases/09-cross-surface-verification/09-CROSS-SURFACE-MATRIX.md]
tech_stack:
  added: []
  patterns: [claim-reconciliation, surface-parity-audit]
key_files:
  created:
    - .planning/phases/09-cross-surface-verification/09-CROSS-SURFACE-MATRIX.md
  modified: []
decisions: []
metrics:
  duration_minutes: 18
  tasks_completed: 2
  files_changed: 1
  completed_at: "2026-08-20"
---

# Phase 09 Plan 04: Cross-Surface Matrix Summary

**One-liner:** Created D-14 proof artifact: 09-CROSS-SURFACE-MATRIX.md reconciling all 7 case studies across visible copy, metadata, OG, and JSON-LD surfaces with 178 claim rows and per-project open items.

## What Was Built

Authored the CRED-09 proof artifact (`09-CROSS-SURFACE-MATRIX.md`) by reading every claim on each of the 7 case-study surfaces (visible copy, metadata, OG image, JSON-LD) against `lib/data/projects.ts`, recording agree / fixed→X / pulled / open per cell, and listing per-project items only Randy can close. Waffle got a verify-only section (D-13). Plans 02/03 outcomes are folded in as rows (title changes, FAQPage removal, dead schema, $50M alignment, Chameleon URL, placeholder sweep).

## Tasks Completed

### Task 1: Create matrix skeleton, [slug] trio rows, Waffle verify-only, and site-wide Parts D–F

**Commit:** `bfa11f1`

- Created `.planning/phases/09-cross-surface-verification/09-CROSS-SURFACE-MATRIX.md` with:
  - Verdict Definitions (agree / fixed→X / pulled / open / —)
  - Surfaces table (per-project surface mapping post Plans 02/03)
  - Part A: growit (23 rows), ohplays (18 rows), ledgeriq (18 rows) — full claim reconciliation
  - Part B: Waffle verify-only (8 rows) — no helper, no CreativeWork/Breadcrumb by design (D-13)
  - Part C: Open for Randy (as-of date for 4.8★/240K+; LedgerIQ metrics source note)
  - Part D: $50M wording + Chameleon URL from Plans 02/03
  - Part E: Dead schema exports from Plan 03 (5 exports deleted, 6 kept)
  - Part F: Placeholder sweep from Plan 03 (example.com hits)
  - Part G: placeholder heading for Plan 05 stale-claim grep
- 105 total table rows after Task 1
- All Plan 02/03 outcomes recorded as matrix rows
- No code changes (documentation only)

**Files:** `.planning/phases/09-cross-surface-verification/09-CROSS-SURFACE-MATRIX.md`

**Rows by project (Task 1):**
- growit: 23 rows (title/desc/og/breadcrumb/FAQ/role/team/timeline/6 metrics/grid OG/partners/awards/composite badge)
- ohplays: 18 rows (title/desc/og/breadcrumb/FAQ/role/team/timeline/7 metrics/built-at)
- ledgeriq: 18 rows (title/desc/og/breadcrumb/FAQ/role/team/timeline/6 metrics/composite badge/source note)

### Task 2: Reconcile the 4 bespoke projects — rows, D-18 conformance fixes, open items

**Commit:** `ab87958`

- Added 4 bespoke project sections to Part A:
  - addvanced: 24 rows (title/desc/og/breadcrumb/role/team/timeline/7 metrics/5 hard-coded tokens/2 partners)
  - echo: 13 rows (title/desc/og/breadcrumb/dateCreated omitted/role/team/timeline/ELD metric/NDA-removed metrics/40K+ token/company)
  - nagarro: 21 rows (title/desc/og/breadcrumb/role/team/timeline/derivation-removed metrics/9 hard-coded tokens/company)
  - rambis-ui: 13 rows (title/desc/og/breadcrumb/lookup fix/role/team/timeline/3 hard-coded tokens/Chakra fork)
- Updated Part C with open items for all 7 projects:
  - growit: as-of date for 4.8★/240K+ (optional, non-blocking)
  - ohplays: none
  - ledgeriq: metrics source verification note (composite, non-blocking)
  - addvanced: OG image choice (portrait splash vs richer image)
  - echo: none
  - nagarro: OG image choice (logo vs richer image)
  - rambis-ui: none
- 178 total table rows after Task 2 (was 105)
- **No D-18 code conformance needed:** All claims either agree (data-rendered) or are visible-only (hard-coded context tokens). No same-claim conflicts found across surfaces.
- Echo NDA compliance verified: grep for banned figures (`184.4`, `16% revenue`, `12% shipment`, `1,000 beta`, `10,000+ active drivers`) returned 0 hits

**Files:** `.planning/phases/09-cross-surface-verification/09-CROSS-SURFACE-MATRIX.md`

**Key findings:**
- All Plan 02 title changes recorded as rows (addvanced, echo, nagarro, rambis-ui)
- Nagarro $50M+ isolated as Nagarro-specific claim (different from career-wide $50M product value)
- All hard-coded numeric tokens documented as visible-only claims (no data conflicts)
- addvanced breadcrumb name fix recorded (was "Addvanced Career Tracker" → "Addvance")
- rambis-ui lookup change recorded (id → slug)
- Echo dateCreated omission explained (timeline "Alpha → Beta → Launch" has no 4-digit year)

## Deviations from Plan

None. Plan executed exactly as written. No D-18 conformance fixes were needed (Rule 2 did not trigger).

## Verification Evidence

**Matrix file validation:**
- `test -f .planning/phases/09-cross-surface-verification/09-CROSS-SURFACE-MATRIX.md`: ✓
- All required headings present: Verdict Definitions, Surfaces, Part A-G, all 7 project subsections ✓
- Table row count: 178 (need ≥130) ✓
- Key terms present: 240K+, 4.8★, Composite, project-faq.tsx, FractionalCDOServiceStructuredData, chameleoncollective, example.com ✓
- Part C has open items for 7 projects ✓

**Code changes:**
- `git diff --quiet HEAD -- lib app components`: ✓ (exit 0, no code changes)
- Echo NDA grep: `grep -rn "184\.4\|16% revenue\|12% shipment\|1,000 beta\|10,000+ active drivers" lib app components`: 0 hits ✓

**Gates (Task 2 plan condition: only if code edited):**
- No code was edited → no lint/tsc/test runs needed per plan
- Matrix is documentation only

## Known Stubs

None. The matrix is a documentation artifact, not executable code. All claims are read from existing data and code surfaces.

## Threat Flags

None. Matrix is a read-only audit artifact; no new surface introduced.

## Fixed→ Rows (Code Changes)

**None.** No D-18 conformance was needed. All claims either:
- **agree** (same value across data + all surfaces carrying it)
- **—** (surface does not carry that claim)
- **visible-only** (hard-coded context token in client file, not in data, by design)

No same-claim conflicts were found where visible copy and data carried different values for the same claim. All hard-coded numeric tokens in the 4 bespoke clients are either:
1. Data-rendered (match metrics[] exactly)
2. Visible-only context (e.g., addvanced "800% higher success rate" comparative, nagarro "18,000+ Nagarrians" org scale after derivation removed it)

## Open Rows (Need Randy)

From Part C:

**growit:**
- As-of date for 4.8★ / 240K+ metrics (optional, non-blocking) — Randy confirmed both real; adding date lets them age honestly

**ledgeriq:**
- Metrics source verification note (non-blocking) — composite case study, metrics never independently source-verified per 05-CONTEXT; disclosed in roleNarrative

**addvanced:**
- OG image choice — 654×1414 portrait splash screen functional but not typical hero; Randy may want richer thumbnail

**nagarro:**
- OG image choice — logo PNG functional but Randy may want richer image (design system screenshot, team photo)

**ohplays, echo, rambis-ui:** None

## Commits

1. `bfa11f1` — feat(09-04): create cross-surface matrix skeleton with growit/ohplays/ledgeriq/waffle + Parts D-F
2. `ab87958` — feat(09-04): reconcile 4 bespoke projects in cross-surface matrix

## Self-Check: PASSED

**Created files exist:**
- `.planning/phases/09-cross-surface-verification/09-CROSS-SURFACE-MATRIX.md` ✓

**Commits exist:**
- `bfa11f1` ✓
- `ab87958` ✓

**Matrix content validation:**
- 178 table rows (≥130 required) ✓
- All 7 `### <slug>` subsections in Part A ✓
- Part B Waffle verify-only section ✓
- Part C open items for all 7 projects ✓
- Parts D-F site-wide sections from Plans 02/03 ✓
- Part G placeholder for Plan 05 ✓
- No code changes (`git diff` clean) ✓
- Echo NDA grep clean (0 hits) ✓
