# Phase 11 Discussion Log

**Date:** 2026-08-22
**Mode:** default (interactive)
**Outcome:** Phase rescoped mid-discussion — premise withdrawn

> Human reference only. Downstream agents read `11-CONTEXT.md`, not this file.

## Areas presented

Four gray areas, all selected: Proof band composition · The attribution footnote ·
Root OG image stats row · Count-up animation on `/services`.

Three of the four dissolved when the premise was withdrawn — they existed only as
consequences of removing figures that are no longer being removed.

## Area 1 — Proof band composition

**Options presented:** replace band with named list (recommended) / four named cells in the
existing grid / keep the "4" cell and add a list below.

**Randy:** *"Stop with the unbacked data all data is fine."*

**What this means:** the three sitewide figures (`2.5M+`, `$50M`, `800+`) are accurate. The
`Unbacked` verdicts that staged this milestone were a **descriptive statement about a 48-page
PDF**, not a credibility finding.

**Verified against the source before acting.** `.planning/DECK-COVERAGE-AUDIT.md` says so in
its own verdict definitions:
- `:34` — *"**Unbacked** — not found in this deck. **This is not a defect and requires no
  action.** The deck's own Agenda scopes it to two case studies; five of seven projects were
  never in it."*
- `:6` — *"'Unbacked' … means 'not found in this 48-page PDF,' nothing more. It is not a
  finding of falsehood."*
- `:37` — non-deck-source rule **removed**: *"Randy's own account of his engagements is a
  source."*

`PROJECT.md` and `MILESTONES.md` had summarized those verdicts as credibility debt, and v3.0
was staged from those summaries rather than the audit. Four researchers read the audit file
and none surfaced line 34 — they inherited the framing from the planning docs.

**Consequence:** CRED-10, CRED-11, CRED-14, CRED-16 and PRF-02 voided before any code changed.

## Areas 2-4 — dissolved

| Area | Why it dissolved |
|---|---|
| Attribution footnote | *"Every figure above is career to date…"* stays **true** now that all four figures remain. It would have become false under the removal plan (all 4 awards are GrowIt!, one product) — noted in CONTEXT.md `<specifics>` in case that plan is ever revived |
| Root OG stats row | Keeps its three figures; no empty row to redesign |
| Count-up on `/services` | Only bit if awards landed in that band; D-08 scopes PRF-01 to `/about` |

## Follow-up questions after rescope

**Q: Where do the four named awards render on `/about`?**
Options: named list below the band (recommended) / expand the cell's description line /
its own Recognition section.
**Randy chose: expand the cell's description line.**
Concern stated in the option itself — that span is `text-xs` and already holds a one-line
qualifier; four award names with issuers would overflow it visually. Chosen anyway.
Captured as D-04 (placement locked) + D-05 (render as a compact in-cell list, not a run-on
sentence — format left to the planner).

**Q: Should the awards appear beyond `/about`?**
**Randy chose: `/about` only for now.** Root OG image and the GrowIt case study both
considered and deferred (D-08).

## Decisions carried in, not re-asked

- Firsthand-account policy (established v2.0, 2026-08-15 deck-gate reversal)
- Webby = judge credential, never a win
- Incorporate-don't-delete for unused components
- One `<Link>`, no filter bar for Phase 12's entry point

## Scope creep

None. Discussion narrowed rather than expanded.

## Deferred

CRED-15 (dead modules) · awards on root OG · awards on the GrowIt case study · MI-4 ·
the `/services` dual-reader question.

## Claude's discretion

In-cell award list markup · REC-01 correction wording · test file location.
