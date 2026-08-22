# Feature Research

**Domain:** Senior design-leader case studies (portfolio content/structure, not infra)
**Researched:** 2026-08-15
**Confidence:** MEDIUM-HIGH (patterns cross-verified across multiple independent sources: UX portfolio guides, a design-leadership-specific source (DoorDash Design), and hiring-manager-perspective articles; no single source treated as ground truth)

## Context Recap (from PROJECT.md / CREDIBILITY-COPY.md)

- Existing `[slug]` template (`app/projects/[slug]/project-detail-client.tsx`) already renders: hero, metrics, background/challenge, tech list, "Project Overview" (role/team/timeline/tools), "Approach & Methodology," "Constraints" (environmental/technical, **each illustrated with a generic Unsplash stock photo unrelated to the actual project** — a live anti-pattern instance), "Key Insights," Challenges/Solutions/Learnings 3-card grid, Outcome/Reflection/Stakeholder Quotes, gallery, related projects, CTA.
- `Project` type (`lib/data/types.ts`) has **no field for "alternatives considered"** and no distinct "what I'd do differently" field — `processStory.reflection` today reads as a summary/moral-of-the-story paragraph, not genuine self-critique. This is a data-model gap requirements must close.
- Copy today is corporate "we developed / we designed" voice (verified in `lib/data/projects.ts` GrowIt entry) — directly contradicts the milestone's first-person mandate.
- `CREDIBILITY-COPY.md` already flags **reused fake stakeholder names** across unrelated projects and **unbacked metrics** as shipped defects from v1.0 — i.e., this codebase has already committed some of the anti-patterns below and the audit trail proves hiring-manager-caliber readers can catch them.

## Feature Landscape

### Table Stakes (Hiring Managers Expect These — Missing = Reads Junior or Incomplete)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Specific problem/context framing (not generic industry problem) | Recruiters skim-triage in seconds; a vague opener ("gardening was fragmented") reads as filler if not grounded in specifics | LOW | `processStory.background` field exists; needs specificity edit, not new structure |
| Explicit role & team disambiguation ("I did X, the team did Y") | On multi-person projects, hiring managers cannot credit work they can't attribute; ambiguity is read as inflation | LOW | `overview.deliverables` / `overview.teamMembers` fields exist; enforce first-person split in copy, not schema |
| Constraints named (time, budget, technical, org, stakeholder) | Constraints are what make a decision meaningful — "no constraints" reads as either dishonest or trivial | LOW | `constraints.environmental/technical/location` exist; content-only fix. **Drop the stock Unsplash images** — decorative, not evidentiary |
| First-person voice throughout | This is the single most direct signal separating "I led this" from "a team shipped this and I was there" | LOW | Pure copy rewrite across all 8 `processStory` bodies; zero new components |
| At least one verifiable, sourced outcome metric per project | Hiring managers actively distrust metrics they can't trace; the project's own credibility guard (CREDIBILITY-COPY.md) already treats this as non-negotiable | LOW–MEDIUM | Metrics field exists; the work is reconciliation (one true number per claim) not new UI |
| Decisions with stated rationale ("I chose X because Y") | THE core signal of seniority per every source reviewed — a case study that shows only the winning solution with no reasoning reads as execution, not judgment | MEDIUM | No current field for this; `processStory.keyInsights` is the closest analog but is framed as retrospective insight, not in-the-moment decision — needs new structured field, see MVP below |
| Skimmable structure (headers, short paragraphs, scannable in under ~2 min) | Hiring managers "skim for metrics, outcomes, evidence of strategic thinking" before deciding to read deeper | LOW | Existing section/card layout is already skimmable structurally; risk is prose-density inside each card, not layout |
| Real visual proof (actual screens/artifacts, not stock imagery) | A case study with placeholder or unrelated photography signals the writer padded for length | LOW–MEDIUM | Real project images/galleries already exist for most projects; the stock-photo constraint illustrations are the specific violation to remove |
| Reflection / lessons learned, including genuine imperfection | Intellectual honesty about what didn't fully work is read as a leadership trust signal, not a weakness | LOW–MEDIUM | `processStory.reflection` exists but currently reads as triumphant summary, not self-critique — needs a distinct "what I'd do differently" beat, likely a new sub-field |
| Clear entry (one-line thesis) and exit (CTA) | Recruiters decide to keep reading in the first few seconds; the CTA at the bottom already exists site-wide | LOW | Already present (hero subhead + closing CTA section) — verify each project's hero copy states a thesis, not just a description |

### Differentiators (What Separates a Senior/Leadership Narrative from a Merely Competent One)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Explicit "alternatives considered" beat per key decision (2–3 options weighed against constraints, then rationale for the one chosen) | This is the specific structural element multiple sources call out as the line between mid-level and senior — "no alternatives considered" reads as less mature even with a good outcome | MEDIUM | Needs a new structured unit (e.g., `decisions: [{ decision, alternativesConsidered, rationale, tradeoff }]`) and a new template section — real new work, not copy-only |
| Leadership-specific signals beyond decisions: stakeholder alignment/influence, mentoring, cross-functional negotiation, raising team/org design maturity | Distinguishes a Head of Product / Fractional CDO narrative from an IC portfolio — per DoorDash Design source, leadership narratives must balance "team capability-building" alongside "strategic product impact," not execution alone | MEDIUM | Only applies where true — `overview.teamMembers`/`role` gives raw material, but needs 1–2 sentences per project on how Randy moved people, not just artifacts. Do not force this into projects where it isn't true (violates credibility guard) |
| Dual-metric framing: outcome tied to BOTH a business result and a user result in the same breath | Signals product-leader judgment (not just design craft) — matches the "Head of Product & Fractional CDO" positioning already locked in PROJECT.md | LOW–MEDIUM | Content-only if both metric types exist per project (GrowIt has both user metrics and reach numbers); some projects may only have one — do not fabricate the missing half |
| Honest imperfection: naming a decision that only partly worked or a metric that was mixed | The DoorDash/portfolio-hiring sources agree this reads as MORE credible, not less — it also directly serves this project's existing "credibility guard" doctrine | LOW | Pure copy discipline — pick at most one candid admission per project so it doesn't undercut the overall narrative |
| Real, named, attributable stakeholder quotes (not reused personas) | Already identified as a v1.0 defect in CREDIBILITY-COPY.md; done right, a real named quote from Paul Grachen or Donald Wu is a strong differentiator precisely because it's verifiable | LOW (2 real quotes exist) / MEDIUM (auditing and possibly removing quotes on the other 6 projects) | `processStory.stakeholderQuotes` field already exists — the differentiator is REPLACING fabricated entries, not adding a new feature |
| Cross-case-study throughline (a recognizable leadership pattern/POV that recurs — e.g., "I always negotiate scope down before negotiating timeline up") | Turns 8 discrete stories into a coherent leadership brand across the whole site — this is what separates "8 good case studies" from "obviously the same senior operator wrote all 8" | MEDIUM (editorial, cross-cuts all 8 rewrites) | Not a component — an editorial pass after individual rewrites, checking for a consistent voice/POV across projects |
| Progressive disclosure for process depth (headline decision visible by default, deeper "why" expandable) | Serves the two audiences simultaneously: the skimmer (30 seconds) and the qualifier who wants to press on judgment (5+ minutes) | MEDIUM | New interaction pattern (accordion/expand) on top of the decisions section; not required for MVP legibility since section-based skimming already exists |

### Anti-Features (Reads as Junior, Inflated, or Actively Damages Credibility)

| Feature | Why It Seems Appealing | Why It's Problematic | Alternative |
|---------|------------------------|-----------------------|-------------|
| Wall of text / dense unbroken paragraphs per section | Feels "thorough" | Hiring managers skim first — density reads as low-signal padding, and "the presentation of rigor overshadows clarity" | Short paragraphs, bolded decision headlines, one idea per card (matches existing card-per-section layout — just needs prose discipline) |
| Decorative process artifacts added for length (generic personas, journey maps, stock imagery not tied to the actual project) | Looks "complete," mimics agency-style deliverables | Signals decoration over substance; **directly present in this codebase today** — the Unsplash stock photos illustrating "Environmental"/"Technical" constraints are exactly this anti-pattern | Remove decorative images that aren't real project artifacts; if no real image exists, ship the section as text-only rather than backfill with stock photography |
| Vanity metrics without baseline/context (raw big numbers, no before/after or %) | Big numbers feel impressive | A number with no comparison point invites skepticism ("240K of what, compared to what?") — worse, it's exactly what CREDIBILITY-COPY.md already caught (conflicting "1M+" vs "100K" vs deck's real 240K) | Always pair a headline number with its baseline/delta, and cite the single source-of-truth number per CREDIBILITY-COPY.md |
| Fake/reused personas or stakeholder quotes across unrelated projects | Fills a "social proof" gap cheaply | Already identified by this project's own audit as fabricated/reused ("Sarah Chen," "Maria Rodriguez," "David Thompson" recur across unrelated companies) — a hiring manager who notices repeated names across "different" clients reads the whole site as fiction | Use the 2 verified real quotes where they fit; for projects with no real quote, omit the section rather than invent one |
| Generic "we"-voice masking individual contribution | Feels safer/more modest, avoids overclaiming | On a personal portfolio positioned as a leadership hire, "we" is read as either false modesty or an inability to isolate your own contribution — the opposite of the milestone's stated goal | First-person throughout; use "we" only for genuinely joint moments, explicitly naming who else was involved |
| Over-polished, frictionless narrative (every decision was obviously correct, no tension, no wrong turn) | Reads as "professional," avoids looking bad | Reads as staged/fictional to an experienced hiring manager — real senior work has visible friction; a frictionless story is a credibility red flag, not a strength | Keep at least one real constraint/tradeoff/partial-miss per project (ties directly to the "Honest imperfection" differentiator above) |
| Uniform positive-icon/visual treatment for negative content (e.g., a green checkmark next to every "Challenge") | Consistent visual system, low design effort | Visual-semantic mismatch undercuts the seriousness of the content — currently present in the codebase (`CheckCircle` used for the Challenges card, not just Solutions/Learnings) | Use distinct iconography/tone per card type so "Challenges" reads as friction, not another win |
| Boilerplate/templated subtext repeated near-verbatim across projects (e.g., a canned "Key Achievement" blurb) | Fast to ship, keeps template consistent | A hiring manager reading 2+ case studies back-to-back will notice repeated phrasing and conclude the "insight" is generic filler, not project-specific judgment | Every callout must reference something specific to that project; if there's nothing specific to say, cut the callout |
| Fabricated or unbacked structured data / metrics outside visible copy (schema, OG images, FAQ) | "No one reads that" | Recruiters and technical hiring managers DO view source/schema; this project's own v1.0 audit found and had to remediate exactly this (fabricated `aggregateRating`, stale "6 awards" lingering in OG/schema after visible copy was fixed) | Any new decision/metric copy must be greppable across visible copy + metadata + OG + JSON-LD, per the v1.0 lesson already logged in PROJECT.md |

## Feature Dependencies

```
First-person voice rewrite (table stakes)
    └──requires──> Role & team disambiguation (table stakes)
                       (can't write "I decided" credibly without first stating "here was my role")

Decisions-with-rationale beat (differentiator, new data field)
    └──requires──> Role & team disambiguation (table stakes)
    └──requires──> Constraints named (table stakes)
                       (a decision only reads as judgment when the constraints it navigated are visible)

Reflection / "what I'd do differently" (table stakes)
    └──requires──> Outcome tied to verifiable metric (table stakes)
                       (can't credibly reflect on a result that was never stated)

Alternatives-considered treatment (differentiator)
    └──enhances──> Decisions-with-rationale beat
                       (alternatives are the evidence that makes rationale credible, not just asserted)

Real stakeholder quotes (differentiator)
    └──conflicts with──> Fake/reused stakeholder quotes (anti-feature)
                       (must REPLACE, not add alongside — can't ship both)

Metric reconciliation (table stakes, credibility guard)
    └──conflicts with──> Vanity metrics without baseline (anti-feature)
                       (one true number per claim, everywhere it appears)

Progressive disclosure / expandable process depth (differentiator)
    └──enhances──> Skimmable structure (table stakes)
                       (not required for MVP — section-based layout is already skimmable without it)

Dual-metric framing (differentiator)
    └──requires──> Metric reconciliation (table stakes)
                       (can't pair business + user metrics if the user metric itself is still unreconciled)
```

### Dependency Notes

- **Decisions-with-rationale requires role/team disambiguation and named constraints:** a "why I chose X" statement is unreadable as leadership judgment without the reader first knowing what Randy specifically owned and what limits he was working within. Sequence: role/constraints copy pass before decisions copy pass.
- **Reflection requires a stated outcome:** the current `processStory.reflection` field conflates "reflection" with "moral of the story." Splitting it into outcome (what happened) → reflection (what I'd change) is a schema change, not just copy — flag for requirements as a `Project` type addition.
- **Real stakeholder quotes conflict with fake ones:** this is a hard replace across all 8 projects, not additive. Any project without a verified quote should ship with NO quote section rather than a placeholder — omission is safer than fabrication under this project's credibility guard.
- **Metric reconciliation conflicts with vanity metrics:** this was already the subject of a v1.0 remediation (GrowIt "1M+"/"100K"/"240K" conflict). v2.0 must not reintroduce this pattern when adding new decision-outcome pairs — every new number needs a CREDIBILITY-COPY.md-equivalent citation before it ships.
- **Alternatives-considered enhances but does not gate decisions-with-rationale:** ship decisions-with-rationale as the MVP baseline; alternatives-considered can be added per-project where the deck/Randy's memory actually supports 2–3 real options (don't invent alternatives that weren't genuinely considered — that would itself be over-polished fiction).

## MVP Definition

### Launch With (v2.0 — required across all 8 case studies)

- [ ] First-person voice — replace all "we developed/we designed" with "I" + explicit team attribution where genuinely joint
- [ ] Role & team disambiguation made explicit in prose, not just the existing metadata grid
- [ ] Constraints stated with real specifics (keep `constraints` field content; **drop the stock Unsplash illustrations**)
- [ ] At least 2–3 "I chose X because Y" decision beats per project, with the trade-off named (even without full "alternatives considered" comparison) — this is the highest-leverage table-stakes item and the one most clearly missing from the current template (`processStory.keyInsights` must be reframed from retrospective insight to in-the-moment decision)
- [ ] One reconciled, sourced outcome metric per decision or per project, consistent with `CREDIBILITY-COPY.md`
- [ ] Genuine reflection/what-I'd-do-differently beat, distinct from the "outcome" narrative (new field or clearly separated content within `processStory.reflection`)
- [ ] Remove all fabricated/reused stakeholder quotes; keep only the 2 verified real ones where relevant, omit elsewhere
- [ ] Remove boilerplate/templated subtext (e.g., canned "Key Achievement" blurb) and stock constraint imagery

### Add After Validation (v2.x)

- [ ] Explicit "alternatives considered" structured beat (new `decisions[]` data shape) for projects where 2–3 real options genuinely existed — don't force it where it wasn't true
- [ ] Leadership-signal callouts (mentoring, stakeholder influence, org design-maturity impact) for the subset of projects where Randy held genuine people/stakeholder leadership scope
- [ ] Dual-metric framing (business + user outcome paired) wherever both are truthfully available

### Future Consideration (v3+)

- [ ] Progressive disclosure / expandable decision depth (accordion pattern) — defer until the content itself (decisions-with-rationale) exists to disclose
- [ ] Cross-case-study leadership throughline as an explicit editorial/meta layer (e.g., an "About my approach" synthesis page) — only makes sense once all 8 rewrites are individually done and a real pattern is visible, not invented in advance

## Feature Prioritization Matrix

| Feature | User Value (to hiring manager) | Implementation Cost | Priority |
|---------|---------------------------------|----------------------|----------|
| First-person voice rewrite | HIGH | LOW | P1 |
| Decisions-with-rationale beats | HIGH | MEDIUM | P1 |
| Constraints stated (real, no stock imagery) | MEDIUM | LOW | P1 |
| Reconciled/sourced outcome metrics | HIGH | LOW–MEDIUM | P1 |
| Reflection / what I'd do differently | HIGH | LOW–MEDIUM | P1 |
| Remove fake quotes / boilerplate | HIGH (credibility risk if not done) | LOW | P1 |
| Alternatives-considered structured comparison | HIGH | MEDIUM | P2 |
| Leadership-signal callouts (mentoring/influence) | MEDIUM–HIGH (only where true) | LOW–MEDIUM | P2 |
| Dual-metric framing | MEDIUM | LOW | P2 |
| Progressive disclosure UI | LOW–MEDIUM | MEDIUM | P3 |
| Cross-project leadership throughline page | MEDIUM | MEDIUM (editorial) | P3 |

**Priority key:**
- P1: Must have — this milestone fails its own stated goal without these
- P2: Should have where the underlying facts genuinely support it — do not fabricate to fill these
- P3: Nice to have, defer to a future milestone

## Sources

- [Your UX portfolio case study is broken: here's the new framework (Medium/Bootcamp)](https://medium.com/design-bootcamp/your-ux-portfolio-case-study-is-broken-heres-the-new-framework-65342de82989) — MEDIUM confidence, WebSearch-summarized, consistent with other sources
- [UX Case Study Structure: How To Follow UX Recruiters' Logic (uxfol.io)](https://blog.uxfol.io/ux-case-study-structure/) — MEDIUM confidence
- [How to Structure a UX Case Study that Hiring Managers Notice (Medium)](https://medium.com/@maxrichy/how-to-structure-a-ux-case-study-that-hiring-managers-notice-4f0e9bf45fa4) — MEDIUM confidence
- [UX Portfolio Guide: How Senior Designers Get Hired (uxplaybook.org)](https://uxplaybook.org/articles/senior-ux-designer-portfolio-get-hired-2026) — MEDIUM confidence
- [Three tips on design leaders' portfolio presentations — Design @ DoorDash (Medium)](https://medium.com/design-doordash/three-tips-on-design-leaders-portfolio-presentations-5afd4e412bf8) — MEDIUM-HIGH confidence (fetched and read directly via WebFetch, not just search snippet; specifically leadership-level, not generic IC advice — most load-bearing source for the leadership-vs-execution distinction)
- [What Hiring Managers Look for in UX Case Studies (designcase.app)](https://designcase.app/blog/what-hiring-managers-look-for-ux-case-studies/) — MEDIUM confidence
- [UX Design Portfolio Advice from Hiring Managers — Indeed Design](https://indeed.design/article/ux-design-portfolio-advice-from-hiring-managers/) — MEDIUM confidence
- [How to Write UX/UI Design Case Studies (IxDF)](https://ixdf.org/literature/article/how-to-write-great-case-studies-for-your-ux-design-portfolio) — MEDIUM confidence (established/authoritative practitioner publication)
- [When Case Studies Become Anti-UX (Medium)](https://medium.com/design-bootcamp/when-case-studies-become-anti-ux-702ee50def0b) — MEDIUM confidence, corroborates "wall of text as decoration" anti-pattern independently
- [Deceptive Patterns in UX (NN/g)](https://www.nngroup.com/articles/deceptive-patterns/) — HIGH confidence (Nielsen Norman Group is an authoritative UX research source), used for the vanity-metrics framing
- Internal: `lib/data/projects.ts`, `lib/data/types.ts`, `app/projects/[slug]/project-detail-client.tsx` — read directly (HIGH confidence) to ground findings against the actual existing template and identify live anti-pattern instances (stock imagery, fake quotes, "we" voice) already present in the codebase
- `.planning/PROJECT.md`, `.planning/CREDIBILITY-COPY.md` — read directly (HIGH confidence), source-of-truth for credibility guard and milestone scope

---
*Feature research for: senior design-leader case-study content/structure*
*Researched: 2026-08-15*
