# Phase 11: Self-Consistency & Proof - Context

**Gathered:** 2026-08-22
**Status:** Ready for planning

<domain>
## Phase Boundary

The site agrees with itself about how many design awards Randy has won, names those four
awards where a human can read them, pins that consistency with a test, and corrects the stale
framing that generated the withdrawn metric-removal premise.

**Rescoped mid-discussion (2026-08-22).** This phase was "Metric Integrity Close-Out" —
removing `2.5M+ Users Impacted`, `$50M in product value`, and `800+ Designers Mentored`
because `DECK-COVERAGE-AUDIT.md` verdicted them `Unbacked`. **That inverted the audit.** Its
own definitions say `Unbacked` means *"not found in this deck… not a defect and requires no
action"* (`:34`), and the non-deck-source rule was removed because *"Randy's own account of his
engagements is a source"* (`:37`). Randy confirmed: **the figures are accurate and stay.**
CRED-10, CRED-11, CRED-14, CRED-16 and PRF-02 are void. Do not remove those figures.

**In scope:** CRED-13 (OG `6`→`4`), PRF-01 (named awards visible on `/about`),
CRED-12 (award-count consistency test), REC-01 (correct the record).
**Out of scope:** removing or altering the three sitewide figures; touching
`__tests__/integration/home-page-argument.test.tsx` (correct as written); any change to
`lib/data/projects.ts` (Phase 12 territory).

</domain>

<decisions>
## Implementation Decisions

### Award count self-consistency (CRED-13)
- **D-01:** `app/about/opengraph-image.tsx:238` renders `6`; every other surface says 4
  (`lib/data/retainer.ts:51`, `app/about/about-client.tsx:26`, `lib/seo/json-ld.ts`'s
  four-entry `award` array). Fix the OG to **4**. This is a self-contradiction, not a backing
  question — it stands independently of the withdrawn premise.
- **D-02:** Ship this as its **own independently-shippable commit, first**. It is a pure bug
  with no design decision blocking it, and it has now survived two milestone audits.

### Named awards placement (PRF-01)
- **D-03:** The `/about` proof band keeps **all four cells unchanged**, including
  `4 / Design awards`. There is no collapse to design around.
- **D-04:** The four named awards render **inside the existing `4 / Design awards` cell's
  description slot** — the `<span className="mt-1 block text-xs …">` at
  `app/about/about-client.tsx:463-466`. Not a separate block, not a new section.
- **D-05:** *Implementation constraint:* that span currently holds a **single one-line
  qualifier** ("Recognition for innovative design work"). Four award names with issuers will
  not fit as one run-on sentence. Render as a **compact list inside the cell** — the decision
  is placement (in-cell), not a specific single-line format.
- **D-06:** **No decorative glyphs.** `CREDIBILITY-COPY.md` §1 drafts the awards with medal
  emoji (🥈🥈🥉🥉); the established design voice rejects them —
  `about-client.tsx:15-18`: *"No icons: the Proof Exhibit signature is a figure over a context
  line, and a decorative glyph above each one adds nothing the number does not already say."*
  Use §1's content, not its ornamentation.
- **D-07:** The Webby appears as **judge**, never as a win, never counted among the four
  (`CREDIBILITY-COPY.md` §1, deck slide 2).
- **D-08:** **`/about` only** this phase. Not the homepage band, not `/services`, not the root
  OG image, not the GrowIt case study. The JSON-LD already carries the names for crawlers.

### Record correction (REC-01)
- **D-09:** Correct all three places the withdrawn premise is recorded: `PROJECT.md` (Current
  Milestone goal, Active requirements, Key Decisions), `MILESTONES.md` (v2.0 "Known deferred
  items"), and `.planning/milestones/v2.0-MILESTONE-AUDIT.md`. Each must state that `Unbacked`
  means "absent from the deck", not "unsupported".
- **D-10:** Sequence REC-01 **second**, right after the OG fix — cheap, and it stops the
  withdrawn premise propagating while the rest of the phase is in flight.
  *(Already applied during this discussion; the planner should verify rather than redo.)*

### Consistency test (CRED-12)
- **D-11:** The test pins the award count as **consistent across every surface that states
  it**, rather than banning strings. Inverted from the original ban-the-figures design.
- **D-12:** Verify **structurally against the data shape**, never by bare string match — `"4"`
  collides with `grid-cols-4`, `h-4 w-4`, and much else.
- **D-13:** Reuse `__tests__/seo/no-legacy-schema.test.ts`'s `collectSourceFiles` directory
  walker. It already excludes `node_modules`, `.next`, `out`, `.git`, `dist`, and — by
  construction, since it never lists them as roots — `.planning/` and root `*.md`, so the
  audit record stays intact.
- **D-14:** Write it **last**, once the PRF-01 shape is settled, so it pins the final state.

### Claude's Discretion
- Exact markup for the in-cell award list (D-05) — placement is locked, format is not.
- Exact wording of the REC-01 correction notes.
- Whether the consistency test lives in `__tests__/seo/` alongside its precedent or a new
  `__tests__/credibility/` directory.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### The withdrawn premise — read first
- `.planning/DECK-COVERAGE-AUDIT.md` §"Verdict Definitions" (lines 25-45) — **the definitions
  that void CRED-10/11/14/16 and PRF-02.** `:34` `Unbacked` = "not found in this deck… not a
  defect and requires no action"; `:6` "not a finding of falsehood"; `:37` non-deck-source rule
  removed, "Randy's own account of his engagements is a source"
- `.planning/REQUIREMENTS.md` §"Scope Correction" and §"Voided requirements" — what is void and why

### Awards content (PRF-01)
- `.planning/CREDIBILITY-COPY.md` §1 — all 4 awards traced to deck slide 28 (GrowIt!) with
  issuer and category; the Webby-as-judge rule; the ready-to-use awards block.
  **Its "Where to change in code" list is STALE** — names `components/core/animated-number-basic.tsx`
  (dead code) and `components/seo/structured-data.tsx` (deleted in Phase 10); its JSON-LD item
  is already done. Use the content, ignore the file list.

### Research
- `.planning/research/SUMMARY.md` — surface map with file:line. **Note:** its "Authoritative
  Surface List" was built for figure *removal*; the file:line data is accurate, the framing is
  superseded.
- `.planning/research/PITFALLS.md`, `STACK.md`, `ARCHITECTURE.md` — same caveat.

### Phase scope
- `.planning/ROADMAP.md` §"Phase 11: Self-Consistency & Proof" — goal, criteria, hard constraints

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `__tests__/seo/no-legacy-schema.test.ts` — `collectSourceFiles` recursive walker; direct
  precedent for CRED-12, already excludes the right directories
- `lib/seo/json-ld.ts:79-84` — the four named awards, already correct. **Source of truth for
  PRF-01's copy**; the visible page should agree with it
- `components/ui/animated-metric-value.tsx` — handles non-numeric values (e.g. `"On-site"`);
  relevant only if awards ever reach `/services`, which D-08 excludes this phase

### Established Patterns
- Proof band shape: `dl.grid.grid-cols-2.sm:grid-cols-4` with `dd` (figure, `tabular-nums
  text-3xl`) over `dt` (context). Identical on `app/page.tsx:164`,
  `app/services/services-client.tsx:189`, `app/about/about-client.tsx:455`
- `/about`'s cells carry a **third** element the other two lack: a `text-xs` description span.
  That span is PRF-01's target
- **No decorative icons in the proof band** — stated design rule (D-06)
- OG generators are hand-built flex, no shared component, each with its own literal copy —
  which is exactly how `6` survived while three other surfaces said 4

### Integration Points
- `app/about/about-client.tsx:19-40` (`achievements` array) + `:455-469` (render) — PRF-01
- `app/about/opengraph-image.tsx:238` — CRED-13
- New test file — CRED-12
- `.planning/PROJECT.md`, `.planning/MILESTONES.md`,
  `.planning/milestones/v2.0-MILESTONE-AUDIT.md` — REC-01 (already applied; verify)

</code_context>

<specifics>
## Specific Ideas

- Randy, on the premise: *"Stop with the unbacked data all data is fine."* The three sitewide
  figures are accurate; the deck simply does not contain them.
- `CREDIBILITY-COPY.md` §1's own v1.0 recommendation — *"drop the bare counter and show the
  named list below"* — was never executed. PRF-01 finally acts on it, though Randy chose
  in-cell placement over a separate block.
- The shared band footnote (*"Every figure above is career to date, across roles at Nagarro,
  Chameleon Collective, and Wealthberry Labs"*, `app/page.tsx` + `services-client.tsx`) stays
  **true and untouched** now that all four figures remain. It would have become false under the
  original removal plan — worth remembering if that plan is ever revived.

</specifics>

<deferred>
## Deferred Ideas

- **CRED-15** — dead modules `animated-number-basic.tsx` (zero imports) and
  `related-content.tsx` (import commented out at `app/blog/layout.tsx:4`). Files kept per the
  incorporate-don't-delete preference. A background task is already logged for the wiring
  question.
- **Awards on the root OG image** — its stats row has no awards cell at all. Considered,
  deferred by D-08.
- **Awards on the GrowIt case study** — all four are GrowIt! wins, so arguably their most
  natural home; `CREDIBILITY-COPY.md` §1 names it as a target. Deferred by D-08; would also
  pull `lib/data/projects.ts` into a phase that otherwise does not touch it.
- **MI-4** — consolidate `about-client.tsx`'s local `achievements` into `retainer.ts`'s
  `PROOF_EXHIBITS`. Two hand-authored arrays holding the same claims is why `6` could drift.
- **The `/services` dual-reader question** — unchanged, still a positioning decision for Randy.

</deferred>
