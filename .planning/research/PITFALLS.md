# Pitfalls Research

**Domain:** v3.0 Enterprise Credibility — removing unbacked sitewide figures, reframing NDA-bound case studies, adding project filtering (subsequent milestone on a shipped Next.js 15 portfolio)
**Researched:** 2026-08-22
**Confidence:** HIGH — every pitfall below is grounded in direct codebase inspection of this exact repo (file:line evidence), the project's own audit trail (`v1.0`/`v2.0` MILESTONE-AUDIT.md, `DECK-COVERAGE-AUDIT.md`), and a currently-live, currently-passing test suite that will collide with this milestone's work. Nothing here is generic web-dev advice.

## How this research was done

Before writing anything, the actual removal/reframe surfaces were traced end to end:
`rg` for `2.5M`, `$50M`, `800+` across the whole repo (excluding `node_modules`/`.next`), the `AnimatedNumberBasic` import graph, `PROOF_EXHIBITS` and `about-client.tsx` consumers, `lib/data/projects.ts` for Echo/Nagarro's actual `category`, `metrics`, `tags`, and `timeline` fields, `GlobalCaseStudyGrid`'s sort implementation, `filterProjectsByCategory`'s matching logic, `lib/seo/json-ld.ts`'s schema builders, and `.planning/DECK-COVERAGE-AUDIT.md`'s per-claim verdicts for Echo and Nagarro. Several of the findings below are things the task brief does not mention and the milestone context does not name — they were found by reading the code, not inferred from the prompt.

---

## Critical Pitfalls

### Pitfall 1: The audit's own "source" file is dead code — the real edit surfaces are two independently-hand-duplicated arrays it doesn't name

**What goes wrong:**
`v2.0-MILESTONE-AUDIT.md` and `.planning/PROJECT.md` both cite `components/core/animated-number-basic.tsx:12-15` as *the* source of SITE-01/03/04. It is not. `rg -rn "AnimatedNumberBasic|animated-number-basic"` across the entire repo returns **only the component's own definition file** — it is imported nowhere. It is 2026's version of the `app/data.ts` dead-code landmine the v1.0 retro already warned about ("stale dead code... unimported dead code, landmine if re-imported").

The figures that actually render live in **two separately-authored copies with different shapes**:
- `lib/data/retainer.ts` → `PROOF_EXHIBITS` (`{value, context}[]`, order: 2.5M+, $50M, 800+, 4) — rendered by **both** `app/page.tsx:165` (homepage) and `app/services/services-client.tsx:189` (`/services`).
- `app/about/about-client.tsx:19-40` → local `achievements` const (`{value, label, description}[]`, order: 2.5M+, 4, $50M, 800+) — rendered at `about-client.tsx:456`.

These are not the same object, don't share field names, and don't share order. There is no single constant to edit once.

**Why it happens:**
An executor who trusts the audit's file:line citation as ground truth will open `animated-number-basic.tsx`, edit or delete lines 12-15, run the tests, see green, and believe the work is done — because nothing consumes that file, nothing will break, and nothing will look different on the live site.

**Consequences:**
All four live surfaces stay unchanged; the "removal" is invisible and reverts nothing. This is a stealthier version of the exact v1.0 failure ("the '6' lingered in 2 spots") — here it could linger in *all four* spots while the diff looks plausible.

**Prevention:**
Do not start from the cited file. Start from `rg -n '"2\.5M\+"|"\$50M"|"800\+"' app components lib` and treat every hit as a real edit site. Treat a zero-import result for the cited component as a canary that the citation is stale, not as confirmation there's nothing to do. Once edited, delete `components/core/animated-number-basic.tsx` outright rather than leaving its stale values in place — it is unused, and editing-but-not-deleting a dead file just creates the next milestone's landmine.

**Detection / warning sign:** `git diff --stat` after "removal" touches only `components/core/animated-number-basic.tsx` and nothing under `app/about`, `app/services`, `app/page.tsx`, `lib/metadata.ts`, or `app/*opengraph-image.tsx`.

**Owning phase:** Phase 11 (metric integrity).

---

### Pitfall 2: Deleting 3-of-4 items collapses a `grid-cols-4` stats band into one lonely cell — in three separate places

**What goes wrong:**
Both live homepage/`/services` `PROOF_EXHIBITS` renders and the `/about` `achievements` render use `grid grid-cols-2 ... sm:grid-cols-4` (confirmed at `app/services/services-client.tsx:188`, and the equivalent pattern in `about-client.tsx:455`). This layout is authored assuming exactly four peer items with `gap-x-16`/`gap-y-10` spacing. Removing three leaves a single `<dd>/<dt>` pair sitting in a 4-track grid — visually a stray number floating in the left column with three empty tracks beside/below it, not a redesigned "one honest stat" callout.

**Why it happens:**
The task is framed as a content deletion ("remove three figures"), but the container is fixed-column CSS authored for a specific count. Deleting array items without touching the grid definition is a data change masquerading as a layout change.

**Consequences:**
Ships a page that "still builds, still passes tests" (nothing asserts grid-track occupancy) but visibly reads as broken or unfinished to exactly the enterprise-credibility-conscious reader this milestone exists to convince.

**Prevention:**
Treat this as a UI decision, not a copy edit. Options, in order of preference: (a) replace the grid with a single prominent stat treatment (the "4 Design Awards" figure deserves to read as a headline claim, not a leftover grid cell); (b) if Randy wants to backfill with other *backed* facts (years in practice, named clients, testimonial count) to keep a multi-item band, that is a scope decision for Randy, not a default; (c) at minimum, change `sm:grid-cols-4` to a layout that matches a 1-item count at every one of the three render sites — this must be an explicit, verified edit in each of `app/page.tsx`, `app/services/services-client.tsx`, and `app/about/about-client.tsx`, because they are three independent JSX blocks, not one shared component.

**Detection / warning sign:** Render `/`, `/about`, `/services` locally after the edit and look — this is not catchable by `npm run lint`/`tsc`/`npm test` alone; it requires an actual visual check (or a Playwright/RTL snapshot of the grid's rendered column count).

**Owning phase:** Phase 11 (the collapse is a direct, immediate consequence of the removal work).

---

### Pitfall 3: OG image generators re-break the exact "OG unfurl contradicts on-page" failure v1.0 already had — and one of them still carries a THIRD, undetected recurrence of the "6 awards" bug right now

**What goes wrong:**
`app/opengraph-image.tsx` and `app/about/opengraph-image.tsx` hardcode their own `flex`/`justify-content: space-around` stat rows with per-item colors (`#60a5fa`, `#a78bfa`, `#34d399`) — a third and fourth independent copy of these figures, in `edge` runtime JSX-as-image code that render tooling (lint/tsc/jest) does not visually check. Deleting 2 of 3 divs in a `space-around` flex row re-centers the remaining one oddly instead of producing an intentional single-stat card.

**Separately, and more urgently:** `app/about/opengraph-image.tsx:238` currently renders **`"6"`** next to "Design Awards" — not `4`. This is the *identical* bug v1.0's CRED-01 blocker described (`about OG "6 awards won"`), fixed once in `514de29`, and confirmed absent from `about-client.tsx`'s own `achievements` array (which correctly says `"4"`). It has silently reappeared in the OG generator specifically, undetected by both the v1.0 remediation grep and the entire v2.0 audit (which only checked `LocalBusiness`/`Organization`/`ProfessionalService`/`FAQPage` schema counts, not this stat). This is currently live in the working tree, not hypothetical.

**Why it happens:** OG generators are visually-composed JSX that nobody reads as "content" the way page copy is; they get audited by grep-for-the-old-number, and greps for "6 Design Awards" as a phrase don't match a bare `"6"` sitting next to a decorative dot and a separate "Design Awards" label three lines later in unrelated JSX.

**Consequences:** A recruiter's link-preview (Slack, iMessage, Twitter/X, LinkedIn) for `/about` currently shows 6 awards while every rendered page says 4 — the exact flow-break v1.0's audit flagged as its #1 E2E risk ("pre-click OG impression contradicts on-page hero").

**Prevention:** While editing either OG generator for CRED-10/11/12, explicitly diff the awards figure against `CREDIBILITY-COPY.md §1` (4 named awards, Davey + Vega Digital). Do not treat "not named in the task's 4-surface list" as "not in scope" — both OG files ARE two of the four named surfaces, and this bug sits inside one of them. After editing, actually render `/opengraph-image` and `/about/opengraph-image` in a browser (or via the OG debugger) rather than trusting that the file compiles.

**Detection / warning sign:** `rg -n '"6"' app/about/opengraph-image.tsx` — already reproducible today, before any v3.0 edits are made.

**Owning phase:** Phase 11 (it's inside the exact files CRED-10/11/12 already touches).

---

### Pitfall 4: The task's 4-named-surface list undercounts by at least 5 real files

**What goes wrong:** Beyond `/about`, `/services`, `lib/metadata.ts`, and both OG generators, the following files contain the same figures and sit outside `.planning/` (so they are not covered by the task's stated .planning exemption) and outside the named list:
- `components/seo/related-content.tsx:255` — `"Explore projects that have impacted 2.5M+ users"` (a contextual internal-link description rendered on `/about`).
- `PRODUCT.md` (repo root, 3 occurrences) — a live-looking positioning reference doc, not a planning artifact.
- `README.md:11` — states `"$50M+ product value... 2.5M+ users globally"`.
- `SEO_OPTIMIZATION_REPORT.md` — a historical before/after report that *also* still contains the old "6 design awards" wording as a documented past state (arguably fine to leave — it's a report of history — but worth an explicit decision, not a silent skip).
- `docs/reports/accessibility/implementation-roadmap.md:636,693` — an accessibility-audit artifact with HTML-escaped copy (`&rsquo;`) that appears to be a captured snapshot of prior site copy, including `"$50M in product value"`.

**Why it happens:** This is precisely the v1.0 lesson restated — "claim fixes need a repo-wide grep per claim (all renderable surfaces), not a per-page fix list" — except this time the miss-risk is root-level docs and report artifacts, not OG generators.

**Consequences:** A future audit (v4.0-style) finds the same lingering-claim pattern a third time, in files nobody thought to name because they aren't `app/`/`components/`/`lib/` and aren't `.planning/` either — a genuine gray zone the task's own exemption list doesn't resolve.

**Prevention:** Before starting CRED-10/11/12, run the repo-wide grep and explicitly triage every hit into one of three buckets, recorded in the plan or commit message: **(a) live renderable surface — must fix** (the 4 named + `related-content.tsx`); **(b) historical/report artifact — leave, note why** (`SEO_OPTIMIZATION_REPORT.md`, `docs/reports/...`); **(c) illustrative code example, not a claim — leave** (see Pitfall 6). Do not silently omit `PRODUCT.md`/`README.md` — decide explicitly whether they count as "the site" for this milestone's purposes (they are read by humans and by any LLM/agent tooling that greps the repo, even though Google never indexes them).

**Detection / warning sign:** `rg -rn '2\.5M\+|\$50M|800\+' --glob '!node_modules' --glob '!.next' --glob '!.planning' .` finding hits outside the four named files.

**Owning phase:** Phase 11.

---

### Pitfall 5: A currently-passing test asserts the exact values being removed — it will fail the moment PROOF_EXHIBITS shrinks, and nobody discovers this by writing the new regression test alone

**What goes wrong:** `__tests__/integration/home-page-argument.test.tsx:59-66` — `"states the proof figures in the markup rather than counting up to them"` — does:
```ts
["2.5M+", "$50M", "800+", "4"].forEach((value) => {
  expect(screen.getByText(value)).toBeInTheDocument();
});
```
This is a real, currently-green assertion on the rendered homepage. The instant `PROOF_EXHIBITS` drops to one item, `screen.getByText("$50M")` throws and this suite goes red — deterministically, not hypothetically. Writing a *new* regression test (task B) does nothing to fix this; it is a separate file that will happily pass alongside a red `home-page-argument.test.tsx` unless someone also finds and edits this one.

**Why it happens:** The task brief describes writing a new test but doesn't mention auditing existing tests for collisions. `npm test` will catch this — but only if someone runs the full suite and reads the failure, rather than running only the new test file and calling it done.

**Consequences:** A red baseline suite shipped alongside a green new test — exactly the kind of "looks done" gap this milestone is trying to eliminate in the product copy, reproduced in the test suite instead.

**Prevention:** Before writing the new regression test, run `rg -rln '2\.5M\+|\$50M|800\+' __tests__/` and treat every hit as a required edit in the *same* plan/commit as the removal. Update this test's assertion to whatever the post-removal proof band actually contains (likely just `"4"` plus its context), and re-derive its adjacent assertions (`expect(screen.queryByText("0")).not.toBeInTheDocument()` still makes sense; the section still needs `id="proof"` / `aria-labelledby="proof-heading"` per the `"anchors every section it labels"` test at line 68-77 — verify that test also still passes with a 1-item proof section).

**Detection / warning sign:** `npm test` (full run, not a single file) after the removal — the project's own documented verify order (`lint` → `tsc --noEmit` → `test`) already requires this; skipping straight to a single new test file circumvents it.

**Owning phase:** Phase 11.

---

### Pitfall 6: A naive grep-based regression test is either too loose (misses reworded reappearance) or too tight (trips on `.planning/`, `DESIGN.md`'s illustrative example, SVG `rx="6"`, and the legitimate "4")

**What goes wrong, concretely, in this repo:**
- **Too loose:** matching only the literal old numeric strings misses a "laundered" reappearance (see Pitfall 9) — e.g. if `$50M` becomes "tens of millions in product value" somewhere, a string-match test for `"$50M"` stays green while the underlying claim survives in prose.
- **Too tight, false positive #1:** `.planning/` legitimately contains **22 files** mentioning `2.5M` (deck audits, credibility copy, milestone history) — a test that walks the whole repo fails immediately against its own project history.
- **Too tight, false positive #2:** `DESIGN.md:231` and `components/ui/animated-metric-value.tsx:38` both cite `"2.5M+"` as an *illustrative example* of "The True Precision Rule" (a general animation/precision convention), not as a live claim. A test that flags any file containing the string `2.5M+` anywhere will trip on these permanently, forcing either an ignore-list hack or a test nobody trusts.
- **Too tight, false positive #3 (the dangerous one):** the number `"4"` — the figure that must survive — is a single character with essentially unlimited legitimate occurrences in this codebase: `grid-cols-4`, `h-4 w-4`, `teamSize: 4`, SVG `rx="6"`/`markerHeight="6"` (not "4" but same class of problem for a bare-digit approach to "6"), array indices, etc. A test asserting *presence* of `"4"` via `getByText("4")` on a page (as the existing home-page test already does) is only safe because it's scoped to one page's rendered DOM text nodes — a source-level regex for bare `"4"` across `app/`/`components/`/`lib/` would be useless (millions of false hits).

**Correct scoping, derived from this repo's own precedent** (`__tests__/seo/no-legacy-schema.test.ts`, the closest sibling test):
1. **Reuse that test's file-walk pattern exactly.** Its `collectSourceFiles([app, components, lib])` helper already excludes `node_modules`, `.next`, `out`, `.git`, `dist`, and — by construction, since it never lists them as roots — `.planning/`, `docs/`, and root `*.md` files. Copy this root list, don't invent a new one.
2. **Match on the full authored value string, not a bare number.** `"2.5M+"`, `"$50M"`, `"800+"` are each distinctive enough (decimal + `M+`, dollar sign, `+` after 3 digits) that a literal-string search for these exact tokens has near-zero collision risk in this codebase (verified: no false hits found for these three exact strings outside the known-legitimate ones). Do **not** use a numeric regex like `/\b50\b/` or `/\b4\b/` — those explode into false positives immediately (`50%` metrics on Nagarro, `4`-anything everywhere).
3. **Verify the "4 Design Awards" side structurally, not textually.** Rather than asserting `"4"` is absent-or-present as a bare string, assert the actual data shape: `PROOF_EXHIBITS` (or whatever it's renamed to) has exactly one entry, and that entry's `value === "4"` and `context`/`label` matches `/design award/i`. This is precise, doesn't care about grid classes or SVG markup, and directly encodes "the backed figure survived unchanged" rather than "some digit 4 exists somewhere."
4. **Explicitly exempt, by comment, the two known illustrative false positives** (`DESIGN.md`, `animated-metric-value.tsx`'s comment) if the test's root list would otherwise reach them — better yet, don't add `docs/`-style prose files to the walk at all, matching point 1.
5. **Layer a rendered-output check on top of the source-level one**, mirroring `home-page-argument.test.tsx`'s own pattern: render `/`, `/about`, `/services` with RTL and `screen.queryByText(...)` for the old values — this catches cases where the *data* was fixed but a hardcoded JSX string wasn't (or vice versa), which pure source-grep can't.

**Prevention (summary):** Two-layer test — (1) structural assertions on the actual TS data (`PROOF_EXHIBITS`/`achievements` array length + exact remaining entry), scoped to `lib/data/retainer.ts` and `app/about/about-client.tsx` directly by import, not by grep; (2) a source-text sweep for the three *exact* removed value strings, scoped to `app`/`components`/`lib` only, reusing `no-legacy-schema.test.ts`'s directory walk. Do not attempt a single regex clever enough to catch both directions at once — it will be either unreadable or wrong.

**Owning phase:** Phase 11.

---

### Pitfall 7: "Resolve the `Significant` metric" without a pattern risks trading one anti-pattern for another — and the anti-pattern already exists live, right now, as precedent for what NOT to repeat

**What goes wrong:** Echo's `metrics` array (`lib/data/projects.ts`, Echo project block) already contains:
```ts
{ label: "Call Center Stress Reduction", value: "Significant" }
```
This sits in the same array, rendered by the same `AnimatedMetricValue`/exhibit component, as `{ label: "ELD Compliance", value: "100%" }` and `{ label: "Platforms Designed", value: "2" }` — a qualitative adjective standing shoulder-to-shoulder with two hard numbers, in a visual grammar (`case-study-template.tsx`'s `Exhibit` rendering, `.slice(0, 4)` of `metrics`) built for quantities. `AnimatedMetricValue` already has an explicit fallback for this (`isNumeric` check → renders plain text, no fake count-up) — the component doesn't crash, but the *rhetorical* problem remains: a reader scanning a metrics row reads "Significant" as commensurate with the numbers beside it, which is exactly the kind of implied-magnitude claim CRED-07 ("never invent a figure") exists to prevent, just in adjective form instead of digit form. This value was already ruled `Unbacked` by `DECK-COVERAGE-AUDIT.md` (ECHO-05).

**Why it happens:** "Resolve the qualitative value" is easy to satisfy with a better adjective ("meaningful," "substantial") rather than a structural fix — the deleted-figure-but-kept-implication failure mode (see Pitfall 9) applied to a single metrics-array cell instead of a whole claim.

**Prevention:** Don't reach for a stronger or weaker adjective. Either (a) replace the row with a verifiable **mechanism** claim, not a magnitude claim — e.g. "Replaced phone-based status checks with an in-app tracker" describes what was built, not how much it helped, and needs no backing beyond "this is what Randy designed"; or (b) drop the row from the `metrics` array entirely and let any qualitative color live in `roleNarrative`/`processStory` prose, where it isn't visually paired with `100%` and `2` in a grid that primes the reader to read it as data.

**Detection / warning sign:** Any `metrics[].value` that is an adjective rather than a number/percentage/count is a tell — grep `metrics:` blocks in `lib/data/projects.ts` for non-numeric `value` fields after this change and confirm none remain, or that any that do are deliberate structural choices (b), not a swapped-in adjective.

**Owning phase:** Phase 12 (enterprise legibility — this is Echo's reframe, not the sitewide figure removal).

---

### Pitfall 8: "Removing the number but keeping the implication" is laundering, not disclosure — and it can hide in a *different* sentence of the same project entry

**What goes wrong:** Echo's `roleNarrative` already sets the correct precedent — its code comment reads *"Client business figures (adoption counts, revenue and volume growth) removed per the CRED-08 line Randy set for Echo: process and design only."* — and the narrative text explicitly states the business specifics "stay with the client" rather than restating them more softly. That is the bar. The failure mode to avoid when reframing Nagarro (or extending Echo further) is deleting a number from the `metrics` array while leaving the *same magnitude* restated in `challenges[]`, `solutions[]`, or `processStory` prose a few hundred lines later in the same object — e.g. removing `{label: "Brand Recognition Growth", value: "50%"}` from `metrics` while `processStory.outcome` still says "Brand recognition increased by 50%." The number reappears in prose form, in the same file, in the same project entry — a place no metrics-array-scoped check would ever look.

**How to tell a rewrite respected the line vs. laundered it:** A genuine disclosure rewrite removes the *quantity* and replaces it with either nothing, or a claim about *what was designed/decided* (a decision, a mechanism, a scope) — never a same-magnitude paraphrase ("significant," "substantial," "meaningfully increased") standing in the vacated slot. If you can mentally substitute the deleted number back into the new sentence and it still reads true, the rewrite laundered rather than removed.

**Prevention:** When editing a project's `metrics` array for CRED-08 framing, `rg` the specific number (e.g. `"50%"`, `"18,000"`) across the *entire* project object in `lib/data/projects.ts` — `challenges`, `solutions`, `learnings`, `overview`, `processStory.background/approach/methodology/keyInsights/outcome/reflection` — not just the `metrics` block. Nagarro's `processStory.keyInsights` and `outcome` fields already restate `"50% brand recognition increase"`, `"100+ qualified leads"`, `"40% website traffic"` multiple times outside the `metrics` array — any Phase 12 edit to the metrics band that doesn't also touch these will leave the exact same magnitude claims live in prose, unaudited.

**Owning phase:** Phase 12.

---

### Pitfall 9: `DECK-COVERAGE-AUDIT.md` already ruled ALL EIGHT of Nagarro's metrics `Unbacked` — reframing the *labels* to org-design language without resolving the *values* repeats the exact v2.0 Phase 9 mistake one milestone later

**What goes wrong:** `.planning/DECK-COVERAGE-AUDIT.md` (NAGARRO-01 through NAGARRO-08) shows the deck has **zero** coverage of Nagarro at all — every metric (`18,000+`, `50%`, `100+`, `10K+`, `+40%` ×2, `+25%`, `15+`) is verdict `Unbacked`, for the stated reason "No slide in the 48-page deck mentions Nagarro" (the audit even raises an open question at line 673-680 asking whether alternate backing — LinkedIn, a Nagarro case study, press — exists). The task frames Nagarro's work as purely a *terminology* exercise ("agency-growth metrics → organizational-design terms," under "CRED-08: Nagarro = unrestricted"). "Unrestricted" resolves the *disclosure* question (no NDA blocks it) but says nothing about the *backing* question the deck audit already raised and left open.

If Phase 12 relabels ("Brand Recognition Growth: 50%" → some org-design-sounding label) while leaving the same `Unbacked` value untouched, that is structurally identical to what the project's own retrospective already flags as a mistake: *"Phase 9's 09-03-PLAN aligned the `$50M` wording across surfaces — harmonising a claim the audit had already ruled unsupported, which made the problem harder to see because afterwards every surface agreed."* Polishing the presentation of an unresolved truth question makes it look more finished, not more true — and specifically makes it *harder* for the next audit to notice, because well-worded numbers don't stand out the way clumsy ones do.

**Prevention:** Before touching Nagarro's copy, force an explicit disposition for each of NAGARRO-01..08, recorded somewhere durable (a plan doc, a code comment, an update to `DECK-COVERAGE-AUDIT.md` itself): **Backed-by-alternate-source** (if Randy can point to LinkedIn/press/an internal Nagarro reference), **Downgraded-to-qualitative** (same treatment as Pitfall 7), or **Accepted-as-firsthand-account** (Randy directly experienced this as Head of Design — arguably not the same evidentiary bar as a third-party deck slide, and worth stating as a conscious policy rather than an implicit one). "Unrestricted" should not silently come to mean "un-investigated."

**Detection / warning sign:** After Phase 12 ships, check whether `DECK-COVERAGE-AUDIT.md`'s Nagarro rows still say `Unbacked` with no accompanying disposition recorded anywhere — if so, the reframe changed words, not truth-status.

**Owning phase:** Phase 12.

---

### Pitfall 10: "Promote Echo to first in project ordering" is ambiguous across three unrelated mechanisms — and Echo's own `timeline` field will silently defeat one of them

**What goes wrong:** There is **no `order` field** on `Project` (`lib/data/types.ts`) — "project ordering" resolves to at least three independent, non-unified mechanisms in this codebase, and fixing one does nothing to the others:

1. **Homepage featured order** — a hardcoded array in `app/page.tsx:55`: `const FEATURED_SLUGS = ["waffle", "echo", "growit"];`. Echo is already 2nd. Promoting it to "first" here means editing this literal array — a one-line fix, but easy to think is the *only* ordering that matters because it's the most visible.
2. **`/projects` grid list order** — literal array position in `lib/data/projects.ts` (`PROJECTS`), preserved as-is through `filterProjectsByCategory` (filtering only, never sorting) and consumed directly by `projects-client.tsx`'s `.map()`. Moving Echo's object earlier in the array literal changes this and also changes `sitemap.ts`'s iteration order (cosmetic for SEO, but changes URL-list ordering nonetheless).
3. **"Related/Featured Case Studies" recommendation widgets** (`components/ui/global-case-study-grid.tsx`, used on project detail pages) — sorts at **runtime** by `featured` boolean, then by `views` (rarely populated), then by **a year parsed out of the `timeline` string** via regex (`timeline.match(/\d{4}/g)`, most recent wins). Echo's `timeline` field is the literal string `"Alpha → Beta → Launch"` — **it contains no year at all**, so the regex match returns nothing and the fallback year is `0`. In this sort, Echo will rank **last**, not first, behind every project whose `timeline` contains a real year — the *opposite* of the intended promotion, and it fails with zero errors or warnings; it just silently ranks wrong.

**Why it happens:** "Ordering" reads as a single concept from the outside; in this codebase it is three unrelated implementations that happen to coincidentally usually agree, because nobody has needed to force a specific promotion before.

**Prevention:** Treat "promote Echo to first" as three separate, independently-verified edits: (a) reorder `FEATURED_SLUGS` in `app/page.tsx`; (b) reorder Echo's object in `lib/data/projects.ts` if `/projects` array-order visibly matters for "first"; (c) either give Echo's `timeline` field a real year (e.g. `"2022 · Alpha → Beta → Launch"`) so `GlobalCaseStudyGrid`'s regex-based sort has something to key on, or accept — explicitly, in writing — that recommendation widgets will keep ranking it by whatever the sort produces regardless of intent. Do not assume moving one array fixes the others.

**Detection / warning sign:** Render each of the three surfaces (`/` featured list, `/projects` grid, a project detail page's "Featured Case Studies" widget) after the change and check Echo's position in each independently — a single "it's now first on the homepage" check will not catch the other two.

**Owning phase:** Phase 12.

---

### Pitfall 11: `PROJECT_CATEGORIES` is a dead, already-drifted enum — a new filter/grouping will either bypass it or discover it's wrong

**What goes wrong:** `lib/data/types.ts:105` exports `PROJECT_CATEGORIES = ["All", "Enterprise (SaaS)", "Mobile App", "Web Dev", "Design Systems", "UI/UX", "AI/ML"]`. It is re-exported from `lib/data/index.ts` and consumed **nowhere else** — no filter chips, no dropdown, no validation ties `Project.category` (typed as plain `string`) to this list. Proof it has already drifted: Nagarro's live `category` is `"Design Leadership"` — not a member of this list — and nothing caught it, because nothing checks.

**Consequences:** Building Task D's filter UI on top of this stale const either (a) invents a fresh grouping mechanism that bypasses it entirely, compounding the drift (now there are two disagreeing sources of "what categories exist"), or (b) tries to wire the const into new chip UI and discovers mid-build that it doesn't match live data, including whatever new category value gets chosen for Echo's reframe.

**Prevention:** Before adding the filter, compute the *actual* live category surface: `[...new Set(PROJECTS.flatMap(p => [p.category, ...(p.categories ?? [])]))]`. Reconcile `PROJECT_CATEGORIES` against that output — update the const to match reality, or delete it if the new filter UI is going to derive its options from live data instead (safer long-term, since it can't drift again). Decide explicitly whether the new "regulated / field-operations" grouping is a `category` value, a `categories[]` member, or a separate concept — don't let the choice fall out implicitly from whichever field happens to be easiest to filter on.

**Owning phase:** Phase 12.

---

### Pitfall 12: `filterProjectsByCategory`'s all-fields substring match can silently pull Nagarro into an "Echo-only" regulated-work filter

**What goes wrong:** `lib/project-utils.ts`'s `filterProjectsByCategory` matches a search term against `name`, `category`, `categories[]`, **and every entry in `tags[]`**, case-insensitively, as substring OR-across-fields. Nagarro's live `tags` already include `"Accessibility Compliance"`. If the new regulated/field-operations grouping is implemented as (or matched against) a term like `"compliance"` — a natural word choice for Echo's ELD-compliance framing — it will *also* match Nagarro via `"Accessibility Compliance"`, silently pulling an unrestricted org-design case study into a filter whose entire point is "this work happened inside a regulated, constrained organization." That's a false positive that directly undermines the enterprise-legibility argument this milestone exists to make.

**Prevention:** Before choosing the filter term, `rg -n '<candidate term>' lib/data/projects.ts` against every project's existing `tags`/`categories`/`category` to check for accidental collisions. If precision matters here (it does — a wrong match is worse than no filter), consider bypassing the loose OR-search for this specific grouping in favor of an explicit boolean/enum field, rather than reusing the general-purpose fuzzy matcher built for free-text search.

**Owning phase:** Phase 12.

---

### Pitfall 13: New filter UI risks reintroducing the exact Suspense/prerender failure the existing code comment already warns about — invisibly, because `npm run build` isn't the verify gate

**What goes wrong:** `app/projects/page.tsx` already wraps `ProjectsClient` in `<Suspense fallback={null}>` specifically because `ProjectsClient` calls `useSearchParams()` and Next 15 requires this for a statically prerendered route — the comment says outright: *"without it `next build` fails; build is not in the verify gate, so do not remove."* Any new filter-chip component that calls `useSearchParams()` (or a hook that wraps it) from a *different* location — e.g. a standalone `<CategoryFilterChips />` rendered directly from `page.tsx` as a sibling of the Suspense boundary, rather than as a child of `ProjectsClient` inside it — reintroduces the same class of failure. Because `next.config.js` sets `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors`, and because the project's own documented verify order is `lint` → `tsc --noEmit` → `test` (explicitly **not** `build`), this exact failure mode will pass every command an executor is told to run, and only surface on `next build` / Vercel deploy.

**Prevention:** Add any new `useSearchParams()`-consuming filter UI **inside** `ProjectsClient`, under the existing Suspense boundary — don't create a second call site. As an explicit extra step beyond the documented verify order, run `npm run build` locally at least once after adding filter UI specifically to catch this class of regression, even though it isn't the formal gate.

**Owning phase:** Phase 12.

---

### Pitfall 14: A new filter can silently misdescribe the `WebSite` SearchAction schema Phase 10 shipped — a structured-data regression of the exact kind Phase 10 spent a whole phase eliminating

**What goes wrong:** `lib/seo/json-ld.ts:108` already emits a `WebSite` schema with a `SearchAction` advertising `/projects?category={term}` as the canonical search URL, and `lib/project-utils.ts`'s own doc comment says explicitly: *"Backs the `/projects?category=` URL filter that the WebSite SearchAction advertises (Phase 10 D-13)."* If the new filter UI introduces a **different** query-param shape — a `?filter=` param, multi-select `?category=a,b`, or a client-only state that doesn't touch the URL at all — the schema keeps advertising a search pattern the site no longer actually implements. That's a structured-data-accuracy regression, silently shipped, on the exact axis (schema truthfully describing the site) Phase 10's SEO-04 requirement was built to guarantee.

**Prevention:** Reuse the existing `category` param name and single-value semantics exactly for any new filter UI. If a materially different filter shape is genuinely needed, update `lib/seo/json-ld.ts`'s `SearchAction` definition in the same change, and re-run `__tests__/seo/no-legacy-schema.test.ts` plus a live Rich Results Test on `/projects` afterward — mirroring Phase 10's own verification pattern rather than assuming schema and UI stay in sync automatically (nothing currently enforces that they do).

**Owning phase:** Phase 12.

---

### Pitfall 15: New filter/grouping UI risks repeating the exact heading-semantics accessibility bug from v2.0 — right next to the element it broke

**What goes wrong:** `/projects`'s `<h1>` is rendered via `ScrambleSectionTitle` (`projects-client.tsx:164`, `as="h1"`) — the same `TextScramble`-family component whose `ScrambleSectionTitle` wrapper was found in v2.0 to set `role="button"`/`tabIndex` on every section title sitewide, overriding heading semantics for screen readers. Any new filter chip/tab UI added near this heading is at risk of repeating the same class of mistake: interactive-looking elements (chips) built as `<div role="button">` instead of real `<button>`/`<a>`, or a chip group missing `role="group"`/an accessible name, or duplicating the announcement mechanism.

The page **already has a working live region** for filter state — `role="status"` at `projects-client.tsx:177-205`, announcing match count and offering a "Clear filter" link. A second, independently-triggered announcement from new chip UI (e.g. its own `aria-live` region) would produce **two competing announcements** for one user action.

**Prevention:** Build any new filter chips as real `<Link>`/`<button>` elements, matching this file's own established focus-ring convention (`focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 dark:focus-visible:ring-white`, already used on `ProjectRow` and the "Clear filter" links). Route all state changes through the existing `category` URL param so the existing `role="status"` paragraph's copy naturally reflects the new state — do not add a second live region.

**Owning phase:** Phase 12.

---

### Pitfall 16: A new grouping badge would be the third status badge on the grid card, diluting the deliberate single-hue-exception rule

**What goes wrong:** The grid card badge row (`projects-client.tsx:96-118`) already carries a deliberate, documented rule: `isLiveProduct` gets the **only** amber badge in the whole system, with a code comment stating *"The single hue exception in the whole system: a product a reader can open today is a different kind of claim."* `isComposite` uses the neutral `secondary` variant specifically so it doesn't compete visually. If Task D expresses the regulated/field-operations grouping as a *third* inline badge — especially with any new color — it dilutes the one color the codebase intentionally reserves for "Live Product," and adds a third simultaneous badge to a row that currently holds at most two (status + one of live-product/composite).

**Prevention:** If a visual badge is wanted at all for the new grouping, use the existing neutral `secondary` variant, not a new color, and confirm against `DESIGN.md`'s conventions first. Prefer expressing the grouping purely as a filter (chips + URL param, no card-level badge) — lower-risk, and it's what Phase 10's infrastructure was already built to support.

**Owning phase:** Phase 12.

---

### Pitfall 17: JSON-LD `additionalProperty` is *derived* from `metrics`/`category` — editing those fields by hand for CRED-10/11/12 or the Echo/Nagarro reframe changes live structured data without a separate edit

**What goes wrong:** `lib/seo/json-ld.ts:166-169` maps every project's `metrics[]` 1:1 into `additionalProperty: PropertyValue[]` on its `CreativeWork` schema, and `genre: props.category` feeds the same schema directly from the `category` string. This is good architecture (single source of truth) but means the JSON-LD for `/projects/echo` and `/projects/nagarro` **will change** the moment Task C edits either project's `metrics` array or `category` field — without anyone touching `json-ld.ts` at all. That's usually fine (it's the intended behavior), but it means Phase 10's SEO-04 guarantee ("zero banned schema types, clean structured data") needs to be **re-verified for these two specific URLs after Task C**, not assumed to still hold because `no-legacy-schema.test.ts` (which checks for banned `@type` strings, not correctness of `additionalProperty` content) still passes.

**Prevention:** After Task C's Echo/Nagarro edits, run `no-legacy-schema.test.ts` (regression, should still be green) **and** fetch/render `/projects/echo` and `/projects/nagarro`'s live JSON-LD to confirm `additionalProperty` reflects the new metrics — mirroring Phase 10's own "verified against production, not source" method (its SEO-04 row explicitly checked live homepage output, not just source code). These are exactly the two URLs this milestone changes; they should be the two URLs re-run through Rich Results Test, same as Phase 10 sampled 3 URLs at its own close.

**Owning phase:** Phase 11 for the CRED-10/11/12-triggered version (metadata.ts is touched here and is the file the project's own Key Decisions table already flags as a silent-removal risk for the Search Console verification token — a reminder to not touch anything unrelated in that file while editing it); Phase 12 for the Task C-triggered version (Echo/Nagarro `metrics`/`category` edits).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|-----------------|------------------|
| Edit `animated-number-basic.tsx`'s dead values instead of deleting the file | Looks like "the audit's cited fix" is done | Landmine if ever re-imported (identical to v1.0's `app/data.ts`) — carries stale figures forward | Never — delete it |
| Replace a removed metric's adjective with a softer adjective ("Significant" → "Meaningful") | Satisfies "resolve the qualitative value" literally | Keeps the implied-magnitude anti-pattern CRED-07 exists to prevent, just reworded | Never |
| Relabel Nagarro's metrics for org-design tone without resolving their `Unbacked` deck-audit status | Ships CRED-08's terminology ask quickly | Repeats the Phase 9 `$50M`-harmonization mistake the retro already names as a lesson | Never without an explicit per-metric disposition recorded |
| Reorder only `FEATURED_SLUGS` and call Echo "promoted" | Homepage visibly changes, fastest win | `/projects` array order and `GlobalCaseStudyGrid`'s year-based sort still disagree | Only if explicitly scoped as "homepage-only" promotion, stated as such |
| Add filter chips reading URL state without reusing the `category` param | Faster to build in isolation | Silently breaks the WebSite SearchAction schema's truthfulness (Pitfall 14) | Never |
| Skip re-running Rich Results Test on `/projects/echo` and `/projects/nagarro` after Task C | Saves a manual step | JSON-LD `additionalProperty`/`genre` changes go unverified against the exact SEO-04 bar Phase 10 set | Never for these two specific URLs — they're the ones this milestone changes |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|-----------------|-------------------|
| Search Console apex TXT verification | Assuming `lib/metadata.ts` edits for CRED-10/11/12 are copy-only and can't touch the verification token | Confirm the DNS-based verification (not a meta tag) is untouched — this milestone doesn't need to touch it, but `lib/metadata.ts` is exactly the file the project's own Key Decisions table flags as a silent-removal risk |
| `next/og` (`ImageResponse`, edge runtime) | Treating OG generator edits as "just delete two divs" | Edge-runtime JSX-as-image isn't visually checked by lint/tsc/jest — render the actual OG route after editing |
| `useSearchParams()` + Next 15 static prerender | Adding a second unguarded `useSearchParams()` call site for new filter UI | Keep all `useSearchParams()` usage inside the existing `<Suspense>` boundary in `ProjectsClient` |
| WebSite `SearchAction` schema (Phase 10 D-13) | Building filter UI with different param semantics than the schema advertises | Reuse the `category` param exactly, or update the schema in the same change |

## Performance Traps

Not a major concern for this milestone's scope (no new data fetching, no scale change) — the one relevant item:

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|-----------------|
| Leaving `animated-number-basic.tsx` in the tree with edited-but-still-fake values | None immediately — it's unimported | A future page/PR re-imports it for a "quick stat block" and ships stale/fabricated figures again | The moment anyone re-imports it |

## Security Mistakes

Reframed for this domain as **disclosure/confidentiality mistakes**, since the live risk here is client-confidentiality boundary violations, not conventional appsec:

| Mistake | Risk | Prevention |
|---------|------|------------|
| Softening a removed client figure into a same-magnitude adjective | Functionally discloses the withheld business result while claiming compliance with CRED-08 | Apply the "could you substitute the number back in and have it still read true?" test from Pitfall 8 to every rewritten sentence, not just the metrics array |
| Editing Echo's `metrics` array but not `challenges`/`solutions`/`processStory` for the same restated figures | Ships an inconsistent disclosure boundary within one project object | `rg` the specific number across the *entire* project block, not just the array being edited |
| Treating "CRED-08: Nagarro = unrestricted" as "no verification needed" | Ships Unbacked figures polished into more-persuasive prose (Pitfall 9) | Record an explicit per-metric disposition before reframing language |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|--------------|-------------------|
| 4-item stat grid collapsed to 1 item, layout untouched | Reads as an unfinished/broken page to the exact enterprise-credibility-conscious reader this milestone targets | Redesign the container for the new item count in all three render sites (Pitfall 2) |
| OG card stat row re-centers awkwardly after deleting 2 of 3 flex children | Recruiter/hiring-manager link-preview looks broken before they even click through | Recompose the OG layout deliberately, verify by rendering the route |
| New filter chips built as non-semantic elements near an already-broken `<h1>` | Screen-reader users get an ambiguous document outline on the one page adding new interactive chrome | Real `<button>`/`<a>` elements, existing focus-ring convention, single live region |
| A third badge color on grid cards for the new grouping | Dilutes the one deliberate color-as-signal convention (`isLiveProduct`) | Neutral `secondary` variant, or no badge — filter-only |

## "Looks Done But Isn't" Checklist

- [ ] **Figure removal (CRED-10/11/12):** Often "done" after editing only the audit-cited `animated-number-basic.tsx` — verify by re-running the repo-wide grep (Pitfall 4's command) and confirming zero hits in `app/`, `components/`, `lib/`, including `related-content.tsx`, both OG generators (check the actual rendered figure, not just presence of the file diff), and the existing `home-page-argument.test.tsx`.
- [ ] **Regression test (task B):** Often "done" once the new test file is green — verify it is not vacuously true by checking it out against the pre-removal commit and confirming it fails there (a red-then-green check, not just green).
- [ ] **Echo `Significant` metric resolved:** Often "done" once the string changes — verify the new value isn't a same-weight adjective standing in the same visual slot (Pitfall 7), and that no other file in the project's `processStory`/`challenges`/`solutions` restates the withheld magnitude in prose.
- [ ] **Nagarro reframe:** Often "done" once labels sound org-design-y — verify each of NAGARRO-01..08's backing disposition is recorded somewhere, not silently inherited from "CRED-08 unrestricted."
- [ ] **Echo promoted to first:** Often "done" once the homepage visibly shows it first — verify `/projects` grid order and any `GlobalCaseStudyGrid` recommendation widget independently; check that Echo's `timeline` field has a parseable year if that widget's ranking matters.
- [ ] **Category/grouping added:** Often "done" once a new filter param works locally — verify the WebSite `SearchAction` schema still matches, `PROJECT_CATEGORIES` reconciled against live data, and `npm run build` (not just lint/tsc/test) succeeds.
- [ ] **JSON-LD still clean:** Often assumed "still fine" because `no-legacy-schema.test.ts` passes — verify the *content* of `/projects/echo` and `/projects/nagarro`'s `additionalProperty`/`genre` fields reflects the actual post-edit metrics/category, via a live render or Rich Results Test, not just the absence-of-banned-types check.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|-----------------|------------------|
| Figures lingered in an unnamed surface (Pitfall 1, 3, 4) | LOW | Repo-wide grep for the 3 exact value strings scoped to `app`/`components`/`lib`; fix each hit; re-render affected OG routes |
| Stats-band layout still visually collapsed | LOW-MEDIUM | Revisit the grid/flex container definition at each of the 3 (page)/(OG) render sites; this is a design decision, may need Randy's input on the replacement treatment |
| Existing test suite red after removal | LOW | Update `home-page-argument.test.tsx`'s assertions to the new proof-band contents in the same commit |
| Nagarro's `Unbacked` metrics reframed but not resolved | MEDIUM | Retroactively record a disposition per NAGARRO-0X row; if no alternate backing exists, downgrade to qualitative post-hoc — cheaper now than after a future audit flags it a second time |
| Echo promoted on homepage only, not elsewhere | LOW | Check and fix `/projects` array order and `GlobalCaseStudyGrid` sort input (timeline year) independently |
| New filter breaks `next build` via a second `useSearchParams()` site | LOW | Move the offending hook call inside the existing `ProjectsClient`/Suspense boundary |
| SearchAction schema now describes a filter that no longer exists as specified | LOW | Update `lib/seo/json-ld.ts`'s `SearchAction` target to match the shipped param shape |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|-------------------|----------------|
| 1. Dead-code "source" file misleads the edit scope | Phase 11 | Repo-wide grep for exact value strings finds zero hits outside intentional exceptions; `animated-number-basic.tsx` deleted |
| 2. Stats-band grid collapse (3 render sites) | Phase 11 | Visual render check of `/`, `/about`, `/services`; grid/flex container redefined, not just data-thinned |
| 3. OG generators re-break/still-broken awards count | Phase 11 | Render `/opengraph-image` and `/about/opengraph-image`; awards figure matches `CREDIBILITY-COPY.md` |
| 4. Undercounted surface list (`PRODUCT.md`, `README.md`, `related-content.tsx`, report docs) | Phase 11 | Explicit triage table of every grep hit, committed as part of the plan |
| 5. Existing test collides with the removal | Phase 11 | `npm test` full run green, not just the new test file |
| 6. Regression-test scoping (too loose / too tight) | Phase 11 | Two-layer test: structural data assertions + scoped literal-string sweep reusing `no-legacy-schema.test.ts`'s directory walk |
| 7. "Significant" metric traded for another adjective | Phase 12 | No `metrics[].value` is a bare adjective unless deliberately chosen as a mechanism claim |
| 8. Number removed but restated in nearby prose | Phase 12 | `rg` the specific figure across the whole project object, not just `metrics[]` |
| 9. Nagarro's 8 Unbacked metrics relabeled, not resolved | Phase 12 | Explicit per-metric disposition recorded (backed / downgraded / firsthand-accepted) |
| 10. "Promote to first" ambiguous across 3 mechanisms | Phase 12 | Independent check of `FEATURED_SLUGS`, `PROJECTS` array order, and `GlobalCaseStudyGrid`'s rendered order |
| 11. `PROJECT_CATEGORIES` dead/drifted enum | Phase 12 | Const reconciled against live `PROJECTS` category/tag values before filter ships |
| 12. Loose substring filter cross-matches Nagarro into regulated-work grouping | Phase 12 | Candidate filter term checked against all existing `tags`/`categories` for collisions |
| 13. New filter UI reintroduces Suspense/prerender failure | Phase 12 | `npm run build` run manually post-change (outside the normal verify gate) |
| 14. Filter shape diverges from SearchAction schema | Phase 12 | `category` param reused exactly, or schema updated in the same change; `no-legacy-schema.test.ts` + Rich Results Test rerun |
| 15. Filter chips repeat heading-semantics/live-region bugs | Phase 12 | Real interactive elements, single `role="status"` region reused |
| 16. Third badge color dilutes `isLiveProduct` signal | Phase 12 | Neutral variant or no badge; checked against `DESIGN.md` |
| 17. JSON-LD `additionalProperty`/`genre` silently changes with data edits | Phase 11 (CRED-10/11/12 trigger) / Phase 12 (Task C trigger) | Live-render or Rich Results Test on `/projects/echo` and `/projects/nagarro` post-edit |

## Sources

- `.planning/PROJECT.md` — Key Decisions table (Outcome column), current milestone scope
- `.planning/MILESTONES.md` — v1.0/v2.0 accomplishments and known-deferred items
- `.planning/RETROSPECTIVE.md` — v1.0 lessons ("claim fixes need a repo-wide grep per claim," "OG image generators are content surfaces")
- `.planning/milestones/v1.0-MILESTONE-AUDIT.md` — CRED-01/CRED-03/POS-04 blocker evidence (the original "6 awards"/"100K+" lingering-surface findings)
- `.planning/milestones/v2.0-MILESTONE-AUDIT.md` — CRED-07 gap carried to v3.0, Phase 9 `$50M`-harmonization lesson, governance findings on missing GSD artifacts
- `.planning/DECK-COVERAGE-AUDIT.md` — per-claim Backed/Unbacked verdicts for Echo (ECHO-01..33) and Nagarro (NAGARRO-01..14+), award backing detail
- `.planning/CREDIBILITY-COPY.md` — the 4 named awards' issuer/category sourcing
- Direct repo inspection (2026-08-22): `components/core/animated-number-basic.tsx`, `app/opengraph-image.tsx`, `app/about/opengraph-image.tsx`, `lib/data/retainer.ts`, `app/about/about-client.tsx`, `lib/data/projects.ts` (Echo/Nagarro full entries), `lib/data/types.ts`, `app/projects/projects-client.tsx`, `app/projects/page.tsx`, `app/page.tsx`, `components/ui/global-case-study-grid.tsx`, `lib/project-utils.ts`, `lib/seo/json-ld.ts`, `components/ui/animated-metric-value.tsx`, `app/robots.ts`, `app/sitemap.ts`, `middleware.ts`, `__tests__/seo/no-legacy-schema.test.ts`, `__tests__/integration/home-page-argument.test.tsx`
- Repo-wide `rg` sweeps for `2.5M+`, `$50M`, `800+` across the working tree (`.planning/` = 22 files; live surfaces = 9+ files; root docs = `PRODUCT.md`, `README.md`, `SEO_OPTIMIZATION_REPORT.md`, `docs/reports/accessibility/implementation-roadmap.md`)

---
*Pitfalls research for: v3.0 Enterprise Credibility (Phases 11-12)*
*Researched: 2026-08-22*
