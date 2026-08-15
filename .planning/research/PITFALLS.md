# Pitfalls Research

**Domain:** Rewriting existing portfolio case studies to be deeper/more persuasive (v2.0 Case-Study Depth, post-credibility-purge)
**Researched:** 2026-08-15
**Confidence:** HIGH (grounded directly in this repo's code/data — `lib/data/projects.ts`, `app/projects/[slug]/page.tsx`, `app/projects/{addvanced,echo,nagarro,rambis-ui,waffle}/`, `.planning/CREDIBILITY-COPY.md`, v1.0 audit history) with MEDIUM confidence on general credibility/ghostwriting best-practice framing (industry convention, not tool-verified)

## Critical Pitfalls

### Pitfall 1: Embellishment Creep — Inventing Decisions/Metrics to Fill the Narrative

**What goes wrong:**
The new template demands "problem → my role → key decisions with rationale → measurable outcome → reflection" for all 8 projects. Where the deck is silent on *why* a decision was made, or on a number to prove the outcome, the natural writing impulse is to invent a plausible-sounding rationale or round a number up "because it's probably close enough." This is exactly the failure mode v1.0 was created to purge (fake testimonials, unverifiable "6 Design Awards," invented `aggregateRating`). The risk is structurally *higher* in v2.0 because the template itself requires a "rationale" and "metric" slot per decision — an empty slot is uncomfortable, and filling it convincingly is easy.

**Why it happens:**
Persuasive, decision-driven writing has a narrative shape that real projects don't always fill cleanly. Writers (including an AI assistant executing this milestone) pattern-match "what a good case study sounds like" and produce specific-sounding prose (e.g., LedgerIQ's existing "10 hours of manual audit work per pay cycle," "What if I told you most companies are unknowingly hemorrhaging money") that reads confidently but traces to no verifiable source — this pattern already exists in the current copy (`lib/data/projects.ts:389,505`) and rewriting "deeper" without a source-check step will reproduce and compound it rather than fix it.

**How to avoid:**
- Every new sentence that names a number, a decision rationale, or an outcome must trace to a specific deck slide or `.planning/CREDIBILITY-COPY.md` line. Treat "I'm not sure where this came from" during self-review as a hard stop, not a style note.
- Distinguish rationale you can attribute ("I chose X because the deck confirms Y constraint") from rationale that is plausible-sounding invention. If the deck doesn't state the *why*, either quote the *what* only, or phrase reflection generically without inventing a specific reason.
- Where the deck doesn't cover a project at all (or covers it thinly), flag it for Randy per the PROJECT.md rule — do not backfill with invented specifics to hit the template's five-part structure.
- Add a lightweight "source" annotation convention during drafting (e.g., an inline comment or a companion claims-log per project) that maps each hard claim to its deck slide/section, then strip the annotations before publish. This makes the fact-check step mechanical instead of relying on memory.

**Warning signs:**
- Precise-sounding numbers with no unit qualifier disagreement resolution (e.g., "50% increase in brand recognition," "100+ qualified leads," "40% designer retention improvement," "reached 10,000+ subscribers" — all already present in the Nagarro entry, `lib/data/projects.ts:1057`) that can't be traced to a deck page.
- Rhetorical framing that substitutes for evidence ("What if I told you...", "Our target client was experiencing the perfect storm...") — persuasive voice standing in for a missing fact.
- A case study that reads *more* precisely quantified after the rewrite than the deck actually supports.

**Phase to address:**
Data completeness / outcome-proofing phase — but only if it includes an explicit per-project, per-claim source-check gate (not just "fill in the sections"). This should run *before* narrative polish, not after.

---

### Pitfall 2: Cross-Surface Claim Drift (Copy vs Metadata vs OG vs JSON-LD)

**What goes wrong:**
A claim gets corrected or reworded in the visible case-study copy but the same claim lingers, unchanged, in `generateMetadata()` (title/description/keywords), the OG image generator, or `CreativeWorkStructuredData`/`ProjectFAQStructuredData` schema — because these are separate code paths that pull from the same `PROJECTS` record but aren't all touched in the same edit pass. This is not hypothetical: it is the exact failure that happened in v1.0 ("the '6 awards' claim lingered in OG-image generators and metadata after the visible copy was fixed" — `.planning/PROJECT.md` Key Decisions). v2.0 touches the same surfaces (title/description built from `project.longDescription`/`project.description`, `keywords` array, OG `alt` text, JSON-LD `metrics`) for all 8 projects at once, multiplying the number of places a stale number can hide.

**Why it happens:**
`app/projects/[slug]/page.tsx` builds `generateMetadata()` and `CreativeWorkStructuredData` from the *same* `project` object used by the client template, so a naive assumption is "if I update the object, everything downstream updates automatically." That's true for fields that are read directly (e.g., `project.metrics` flows straight into JSON-LD), but false for anything transformed, cached, or duplicated — e.g., a metric string embedded in `longDescription` prose vs. the same metric stored separately in `metrics`/`awards` arrays can diverge silently, and standalone-route projects (see Pitfall 7) don't share `generateMetadata()` with `[slug]` at all.

**How to avoid:**
- After each project's content rewrite, grep across ALL surfaces for the old claim text/number, not just the visible page: `rg -n "<old number/phrase>" app/ lib/ components/seo/` before considering that project done.
- Treat `generateMetadata()`, OG image `alt` text, and JSON-LD (`CreativeWorkStructuredData`, `ProjectFAQStructuredData`) as required checklist items per project, not incidental — add a literal checklist line per project ("metadata/OG/schema reconciled") mirroring how POS-04 had to be fixed in metadata/OG/JSON-LD during v1.0 audit remediation.
- Run a repo-wide grep for every hard number that changes (old GrowIt "1M+"/"100K" style bugs) as a final gate across all 8 projects together, not per-project in isolation — cross-project consistency (e.g., a stat reused in two places) is easy to miss when reviewing one file at a time.

**Warning signs:**
- Any project record where a number/claim appears in more than one field (`description`, `longDescription`, `metrics`, `outcome`, keywords) — each occurrence is a place it can go stale independently.
- Standalone-route projects (`addvanced`, `echo`, `nagarro`, `rambis-ui`, `waffle`) that have their own `page.tsx`/`*-client.tsx` files with independently-authored metadata — these do not inherit fixes made to `[slug]`'s `generateMetadata()`.

**Phase to address:**
Should be a dedicated verification step at the end of the content-rewrite phase (or its own short audit phase), explicitly modeled on the v1.0 audit remediation that closed CRED-01/CRED-03/POS-04. Do not fold it into "content rewrite" as an assumed side effect — v1.0 proved it needs to be a distinct, deliberate pass.

---

### Pitfall 3: Confidentiality/NDA Exposure From Naming Real Companies and Client Work

**What goes wrong:**
Deepening a case study naturally pulls in more specific detail — internal metrics, org structure, strategic rationale, screenshots of real product UI — for real, named companies and clients (Nagarro, Echo Global Logistics, and whichever real companies back GrowIt/OhPlays/LedgerIQ/AddVanced/RambisUI in the deck). Some of that detail may be under NDA, may be commercially sensitive to the ex-employer, or may simply not be something the named company consented to having republished in more depth than before. The current Nagarro entry already states specific internal figures (employee count 15,000→18,000+, "40% designer retention improvement," "40% website traffic increase," "100+ qualified leads") attributed to a real, currently-operating global consultancy — republishing these *more prominently and persuasively* raises the stakes if any of them were never meant to be public or are now stale/wrong.

**Why it happens:**
"More persuasive" and "more specific" are the same lever a rewrite pulls — the temptation is to add color (internal team dynamics, stakeholder quotes, screenshots, exact financial/business metrics) without re-checking whether the current employer/client relationship still permits disclosure at that level of detail. Confidentiality risk doesn't announce itself; it looks identical to "good, specific case-study writing."

**How to avoid:**
- Before deepening any project tied to a real, identifiable employer or client (especially Nagarro, Echo — both real named companies), explicitly flag to Randy: "this section adds new specificity — confirm still OK to publish at this level of detail," rather than assuming the deck's existing level of disclosure is a blanket license to go deeper.
- Default to describing decisions, process, and outcomes in terms of *design/product reasoning* rather than the client's internal business metrics unless those exact metrics are already public (e.g., in the deck, in a public case study, or in a press release) — precise internal numbers (revenue, headcount deltas, lead counts) are exactly the kind of detail an employer is most likely to consider confidential even years later.
- Do not add new screenshots, mockups, or UI captures of client products beyond what already exists in the deck/site without an explicit "cleared to publish" check — a deeper case study creates pressure to add visual proof that wasn't vetted the first time.
- Apply extra scrutiny to any project where Randy was an employee (Nagarro "Head of Design") vs. a named contractor/freelance engagement — employment relationships often carry broader confidentiality obligations than project-based freelance work.

**Warning signs:**
- New copy adds a specific number, org detail, or strategic rationale that does not appear verbatim in the deck or `CREDIBILITY-COPY.md` — even if it "sounds like something Randy would know," if it's not sourced, it's also not cleared.
- A case study for a still-operating company (as opposed to a defunct startup or a personal/side project) getting materially more detailed than before.
- Screenshots or descriptions of internal tooling, dashboards, or workflows rather than user-facing product surfaces.

**Phase to address:**
Should be a review gate inside the content-rewrite phase, applied per-project at the point deck-backed content is being selected — pair it with the fabrication source-check (Pitfall 1) since both require going back to the deck/Randy per claim. This is a judgment call only Randy can make, so the deliverable is a flagged list, not a unilateral decision by whoever executes the phase.

---

### Pitfall 4: Sole-Credit Over-Claiming — "I" Language on Team/Collaborative Work

**What goes wrong:**
The milestone explicitly wants the voice shifted from "we developed…" to first-person "I chose X because Y." For solo or clearly-led work this is accurate and appropriately senior. But several of these projects have real team sizes (`teamSize: 8`, `6`, `8`, `3`, `6`, `15`, `4` across the 8 projects) and titles that imply orchestration of others (e.g., Nagarro "Head of Design" over 15 people, GrowIt "Product Designer & Frontend Lead" with a team of 8). A blanket find-replace of "we" → "I" risks misrepresenting collaborative/delegated work as solo individual-contributor work — which is a *different* kind of credibility problem than fabricated numbers, but just as damaging to a senior-hire audience who will read case studies expecting to distinguish "I personally decided/designed this" from "I led a team that decided/designed this."

**Why it happens:**
"First-person, decision-driven" is easy to over-apply mechanically (swap pronouns) rather than accurately (attribute the *level* at which Randy operated — individual decision vs. team leadership vs. organizational strategy). The instruction to sound senior and ownership-driven creates pressure toward "I" even where "I led the team that decided" or "I set the direction; the team executed X" is the honest and, for a *leadership* audience, actually more credible framing.

**How to avoid:**
- Establish an explicit "I vs. we vs. led" rule before rewriting: use "I" only for decisions Randy personally made or drove; use "I led/directed the team that…" for team-executed work under his direction; never claim solo authorship of work a stated team of 3–15 people did.
- For each project, cross-check the claimed decision against `role` and `teamSize` in `lib/data/projects.ts` — a claim like "I built the design system" on a project with `teamSize: 8` and role "Product Designer & Frontend Lead" needs to read as leadership/ownership of direction, not solo execution, unless the deck specifically attributes that piece of work to Randy alone.
- Remember: for a hiring-manager audience evaluating a *design leadership* hire, "I led a team of 8 to decide X" is a stronger signal than a falsely-solo "I decided X" — over-claiming solo credit doesn't even serve the persuasive goal, it just adds risk.
- Watch `teamMembers`/`stakeholderQuotes` fields in the data model — if a project has named collaborators, the rewritten narrative should be internally consistent with crediting them, not erase them to make Randy's role read bigger.

**Warning signs:**
- "I" attached to work items on a project where `teamSize` > 1 and Randy's `role` is a lead/director title implying delegation (Nagarro, GrowIt, LedgerIQ).
- Complete absence of "we"/"the team"/named collaborators in a rewritten case study that has substantial team size in its own data record — the vanishing of a team that's on record elsewhere on the same page is a visible inconsistency, not just an ethics concern.
- Reflection sections that claim strategic outcomes ("I improved retention by 40%") for outcomes that are organization-level metrics, not individually attributable.

**Phase to address:**
Content-rewrite phase, as an explicit style rule applied per project (not left to case-by-case judgment during drafting) — pair with a lightweight per-project check against `role`/`teamSize` before finalizing "I" statements.

---

### Pitfall 5: Generic Voice and Process-Theater Reading Junior Despite Added Depth

**What goes wrong:**
Adding length and a "decisions with rationale" structure doesn't automatically read as senior — it can just as easily read as *more* generic if the added content is process narration ("first we did discovery, then we did research, then we ideated, then we tested") rather than judgment narration (what was actually hard, what was uncertain, what Randy chose to prioritize and why, what he'd do differently). The existing LedgerIQ copy already shows this pattern: marketing-style rhetorical hooks ("What if I told you...") and generic textbook process description ("Rule-based systems catch obvious problems but miss the subtle patterns") rather than specific, decision-level reasoning tied to this project. Deepening in that direction produces *more* words that still read junior.

**Why it happens:**
Process description is easier to write than judgment narration — it doesn't require recalling or sourcing a specific hard tradeoff, and it fills space convincingly. Under deadline/volume pressure (8 rewrites), the path of least resistance is generic "here's the standard design process applied to this project" rather than "here's the one thing that was genuinely difficult and how I resolved it."

**How to avoid:**
- For each project, identify 1–3 *specific, non-obvious* decisions before writing prose — decisions where a reasonable alternative existed and Randy chose against it for a stated reason. If none can be identified from the deck, that's a signal the project is thin (see Pitfall 6), not a cue to generate generic process narrative to fill the gap.
- Ban template process-language as a default ("we conducted user research," "we ideated multiple solutions," "we iterated based on feedback") unless it's anchoring a specific, named finding or decision — generic process description should be the exception that supports a specific point, not the narrative's backbone.
- Read each rewritten case study asking "could this paragraph be copy-pasted into a different project's page and still sound plausible?" — if yes, it's generic and needs a project-specific decision or number swapped in (that is itself deck-verified, not invented — see Pitfall 1).

**Warning signs:**
- Reflection/learnings sections that state universal design truisms ("I learned the importance of user research") rather than something specific to this project's outcome.
- Rhetorical/marketing framing devices (questions to the reader, "the perfect storm," dramatic reveals) substituting for concrete specifics.
- A case study that got measurably longer in the rewrite without gaining new *facts* — length added via elaboration/repetition of already-stated points rather than new deck-backed detail.

**Phase to address:**
Content-rewrite phase — this is a craft/quality bar that should be part of the per-project acceptance criteria (e.g., "at least N deck-backed, non-obvious decisions with stated rationale per project"), not just a "make it deeper" instruction.

---

### Pitfall 6: Thin-Data Projects Render Empty or Padded Sections

**What goes wrong:**
The milestone explicitly names this risk ("Data completeness — fill thin/empty challenges·solutions·learnings so no section renders shallow"), but the failure mode has two opposite bad outcomes, not one: (a) a section stays visibly empty/thin in the shipped page because the deck genuinely doesn't cover it, which looks unfinished; or (b) the fix for (a) is to invent content to fill the section, which reintroduces Pitfall 1's fabrication risk under a different name ("data completeness" as an excuse to backfill). The deck coverage is uneven across the 8 projects — `CREDIBILITY-COPY.md` only backs awards/testimonials/GrowIt metrics/schema cleanup in detail; it does not provide deck-sourced depth for all 8 projects' challenges/solutions/learnings equally, and PROJECT.md itself flags "any project the deck doesn't back → flag for Randy, do not invent" as a live open risk, not a solved problem.

**Why it happens:**
A template with five mandatory narrative slots (problem, role, decisions, outcome, reflection) per project creates structural pressure to fill every slot for every project, even when the underlying source material doesn't support equal depth across all 8. Treating "fill the section" and "have a deck-backed source for the section" as the same task is the root error.

**How to avoid:**
- Before rewriting, run a deck-coverage audit across all 8 projects: for each, mark challenges/solutions/learnings as Backed (deck/CREDIBILITY-COPY has specifics) / Partial (deck has some detail, needs Randy for the rest) / Unbacked (deck is silent). This gate should run *before* content rewriting starts, not be discovered mid-rewrite project-by-project.
- For Unbacked/Partial sections, the template needs a legitimate "less depth here, and that's fine" path — not every project needs to hit the same narrative density. A shorter, honest section beats a padded, invented one. Ship variable depth across projects rather than forcing uniform depth through embellishment.
- Route Unbacked findings to Randy as a concrete question list, not a blocking unknown absorbed silently into "best guess" prose.

**Warning signs:**
- A project section that reads noticeably more generic/vague than the others once all 8 are drafted — often the tell that it was padded rather than sourced.
- Any project where the rewrite required "inference" or "reasonable assumption" language during drafting (even internally) rather than direct sourcing.
- LedgerIQ specifically warrants a check: existing copy already uses hypothetical/composite framing ("Our target client was experiencing...") that suggests this may be a concept/speculative project rather than a real client engagement — deepening it without resolving that ambiguity risks presenting a hypothetical as if it were a verified real-world outcome.

**Phase to address:**
Should be its own gate at the start of the content-rewrite work (a "deck-coverage audit," producing a per-project Backed/Partial/Unbacked table) feeding into, but distinct from, the "data completeness" work item in PROJECT.md — the roadmap should treat coverage-auditing and content-writing as sequential, not the same step.

---

### Pitfall 7: Inconsistent Template Treatment Across 8 Pages — Route Shadowing Breaks "Extend the [slug] Layout"

**What goes wrong:**
Of the 8 projects, only 3 (`growit`, `ohplays`, `ledgeriq`) are actually served by the dynamic `app/projects/[slug]/page.tsx` route at runtime. The other 5 (`addvanced`, `echo`, `nagarro`, `rambis-ui`, `waffle`) each have their own static route directory (`app/projects/addvanced/page.tsx`, etc.) with independent `page.tsx` + `*-client.tsx` files that **shadow** the dynamic route — Next.js App Router resolves static/explicit path segments before dynamic ones, so `/projects/nagarro` is served by `app/projects/nagarro/page.tsx`, never by `[slug]`, even though `nagarro` also exists as a record in `PROJECTS`. This is not a hypothetical risk — v1.0's own Key Decisions log confirms this pattern was used deliberately for waffle ("static route shadowing `[slug]` route... Additive data-model change, zero routing special-cases"). If the roadmap's "extend the `[slug]` layout" work only touches `app/projects/[slug]/project-detail-client.tsx`, 5 of 8 case studies will not receive the new narrative template at all — they'll keep whatever bespoke structure their standalone client component already has, producing a site where 3 pages have the new deep-narrative treatment and 5 don't, undermining the milestone's core goal of a consistent, senior narrative across all 8.

**Why it happens:**
The `[slug]` route and the standalone routes both read from the same `PROJECTS` data array, which creates the illusion of a single unified template — but the *presentation* layer (the client components and their JSX/layout) is not shared. A plan written at the "update the project template" level of abstraction can miss that this actually means 6 different template implementations to update (1 shared `[slug]` template + 5 independent standalone templates), not 1.

**How to avoid:**
- Before planning the template-evolution work, explicitly enumerate all 6 code paths that render a project detail page: `app/projects/[slug]/project-detail-client.tsx` (serves growit/ohplays/ledgeriq) plus the 5 standalone `*-client.tsx` files (`addvanced-client.tsx`, `echo-client.tsx`, `nagarro-client.tsx`, `rambis-client.tsx`, `waffle-client.tsx`). Decide explicitly: (a) migrate the 5 standalone pages onto the shared `[slug]` template and delete the bespoke routes, or (b) apply the new narrative structure independently to each of the 5 standalone components. Do not assume "extend `[slug]`" covers all 8 — verify at the routing level, not the data level.
- If keeping route-shadowing (option b), the acceptance criteria for "consistent template treatment" must be defined at the rendered-output level (does each page visually/structurally follow problem → role → decisions → outcome → reflection?) and checked against each of the 6 files individually, not assumed from a single `[slug]` edit.
- Watch for `echo-client-final.tsx` (734 lines, unused/not imported by `app/projects/echo/page.tsx`, which imports `echo-client.tsx` instead) — dead code that could be mistakenly edited instead of the live file, wasting rewrite effort on a component that never ships.

**Warning signs:**
- A roadmap/plan phrase like "extend the [slug] layout to express problem → role → decisions → outcome → reflection" without an explicit list of which of the 8 project pages that change actually reaches.
- Post-rewrite QA that only spot-checks 1–2 project pages (likely ones served by `[slug]`) and assumes the rest match.
- Any edit made to `echo-client-final.tsx` — confirm it's dead code before spending rewrite effort there.

**Phase to address:**
Narrative-template-evolution phase, at the design/planning step before any content is written — this is a routing/architecture decision (migrate to shared template vs. update 5 bespoke templates independently) that determines the shape of every subsequent content-rewrite task, so it must be resolved first, not discovered mid-rewrite.

---

### Pitfall 8: SEO/OG Regressions From Touching 8 Pages' Metadata at Once

**What goes wrong:**
Rewriting `description`/`longDescription` (which feed `generateMetadata()` title/description/OG/Twitter cards) and adding awards/metrics arrays across 8 projects simultaneously creates a wide blast radius for regressions that are easy to miss individually: OG image `alt` text going stale (Pitfall 2), `keywords` arrays losing previously-present terms during a rewrite, JSON-LD `dateCreated`/`metrics`/`teamSize`/`role` fields not being updated in lockstep with narrative changes to those same facts, and — for the 5 standalone-route projects (Pitfall 7) — metadata that isn't generated through the shared `generateMetadata()` function at all and must be hand-verified per file.

**Why it happens:**
Metadata/OG/schema are "downstream" of the content and easy to treat as auto-derived even where they're actually separately authored strings (e.g., standalone pages' own metadata exports, or hardcoded OG image text). Doing 8 rewrites in the same pass increases the surface area without necessarily increasing the rigor of the per-page metadata check, especially if reviewers focus on the visible page content (which is what's actually "deeper and more persuasive") rather than the SEO surfaces (which don't visually change).

**How to avoid:**
- Treat metadata/OG/JSON-LD verification as an explicit per-project checklist item (same fix as Pitfall 2), run this check for all 8 including the 5 standalone-route pages that don't go through `[slug]`'s `generateMetadata()`.
- Before/after diff each project's rendered `<title>`, meta description, OG image, and JSON-LD script tag (can be scripted with a simple fetch+parse against local dev server) to catch unintended drops (e.g., a keyword silently disappearing) as well as unintended stale carryover (Pitfall 2).
- Confirm `ProjectFAQStructuredData` (referenced per-slug in `app/projects/[slug]/page.tsx`) stays consistent with any new claims — FAQ schema answers are exactly the kind of secondary surface where an old number can hide.

**Warning signs:**
- A project's visible copy changed but its OG image / meta description weren't touched in the same commit.
- Standalone-route projects with metadata exports that were never audited because reviewers assumed they're covered by "the `[slug]` metadata work."

**Phase to address:**
Cross-surface verification step at the end of the content-rewrite phase (same phase as Pitfall 2's gate) — ideally a single audit pass covering all 8 projects' metadata/OG/schema together, run after content is finalized, mirroring how v1.0's inline audit remediation caught POS-04's metadata/OG/JSON-LD gaps.

---

### Pitfall 9: Accessibility Regressions From Long-Form Narrative Content

**What goes wrong:**
Deepening case studies from "generic corporate summaries" to full narrative sections (problem/role/decisions/outcome/reflection × 8 projects) substantially increases page length and text density. Common regressions when content volume grows without a corresponding accessibility pass: heading hierarchy skipping levels as new subsections get inserted (e.g., a "Key Decisions" subsection added under "Reflection" without checking `h2`/`h3` nesting), long blocks of prose without landmark/skip-navigation affordances, decorative animation (Motion-based scroll reveals, already used heavily per CLAUDE.md's animation system) triggering on long-scroll pages without respecting `prefers-reduced-motion`, and quote/testimonial blocks added without proper `<blockquote>`/citation semantics.

**Why it happens:**
Accessibility is usually verified against the *existing* page shape; when a template gains new sections, each new section needs its own heading-level and landmark decisions, and it's easy to nest new content wherever it fits visually rather than semantically. This project's existing animation-heavy motion system multiplies the surface area for `prefers-reduced-motion` gaps once each of 8 pages gains more scroll-triggered sections.

**How to avoid:**
- When the narrative template is defined (problem/role/decisions/outcome/reflection), decide the heading hierarchy explicitly as part of the template (e.g., project name `h1`, each narrative section `h2`, individual decisions within "Key Decisions" as `h3`) and apply it uniformly — this is easiest to get right once, at the template-definition step, rather than auditing 8 pages after the fact.
- Reuse existing reduced-motion handling (per CLAUDE.md's "Performance-optimized" animation system) for any new scroll-triggered reveal added to accommodate longer content — don't add new Motion variants without checking they inherit the same reduced-motion guard as existing ones.
- If testimonial/stakeholder quotes are added or reformatted as part of the "persuasive" rewrite, use semantic `<blockquote cite="">`/`<cite>` rather than styled `<div>`s, consistent with the real, attributable quotes established in `.planning/CREDIBILITY-COPY.md`.

**Warning signs:**
- New subsections added to a project page whose heading level was chosen by "what looks right visually" rather than checked against the surrounding hierarchy.
- Longer pages with more scroll-triggered animation instances than before, not re-tested with reduced-motion OS setting on.

**Phase to address:**
Narrative-template-evolution phase should fix the heading hierarchy once at the template level; each per-project content-rewrite should inherit it without needing a separate a11y decision per project. A final accessibility spot-check across all 8 (heading order, reduced-motion, quote semantics) belongs in the same cross-surface verification pass as Pitfalls 2 and 8.

---

### Pitfall 10: Scope Creep Across 8 Parallel Rewrites

**What goes wrong:**
"Rewrite all 8" invites drift: fixing unrelated bugs noticed mid-rewrite (e.g., the `echo-client-final.tsx` dead file, POS-02 proof-chips, WAF-02 badge dead-zone — already explicitly called out as in-scope tech debt, which is fine — but also *other* things noticed along the way that weren't scoped), inconsistent depth/quality across the 8 as some get more attention than others under time pressure, and silent divergence in tone/structure per project as "the template" gets reinterpreted slightly differently project-to-project without a fixed reference.

**Why it happens:**
8 independent rewrites naturally invite 8 independent interpretations of "deeper and more persuasive" unless a single reference example is established first. Each project also surfaces its own temptations (fix this button, tighten this schema, polish this animation) that compound across 8 iterations into a much larger diff than "content rewrite" implies.

**How to avoid:**
- Write and get explicit approval on ONE fully-rewritten reference project first (ideally the best-documented one — GrowIt, given it has the most deck-verified specifics per `CREDIBILITY-COPY.md`) before touching the other 7, so structure/tone/depth calibration happens once, not 8 times independently.
- Keep the named tech-debt fold-in items (POS-02, WAF-02, stale `app/data.ts` PROJECTS array) as their own explicit checklist separate from "content rewrite," so incidental fixes discovered during the 8 rewrites get triaged (fix now vs. log for later) rather than silently absorbed into scope.
- Track completion per project against the same fixed checklist (deck-coverage audited, decisions sourced, I/we credit checked, metadata/OG/schema reconciled, a11y heading check) rather than a vague "done" — this keeps the 8 rewrites uniform in rigor even if calendar time per project varies.

**Warning signs:**
- The diff for "content rewrite" phase touching files unrelated to any of the 8 project pages or their data (a sign of drift into unrelated cleanup).
- Reviewing the 8 finished case studies side by side and finding they don't share a recognizable structure/voice (a sign each was interpreted independently rather than against a shared reference).

**Phase to address:**
Content-rewrite phase — sequence a single reference-project pilot before the remaining 7, and keep tech-debt fold-in items on a separate, explicitly-scoped checklist.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|-----------------|------------------|
| Leaving 5 projects on bespoke standalone routes instead of migrating to shared `[slug]` template | Avoids a routing/migration task now | Permanent template drift; every future template change must be applied 6 times, not once | Never for this milestone's stated goal of consistent narrative depth — acceptable only as a deliberate, documented decision with a plan to converge later |
| Backfilling thin sections with plausible-but-unsourced prose to "complete" the template | Every project looks equally deep immediately | Reintroduces the exact fabrication risk v1.0 spent a full milestone purging; recovery cost is high if caught post-publish | Never |
| Mechanical "we" → "I" find/replace across all 8 projects | Fast, uniform-feeling voice shift | Misattributes team/organizational work as solo IC work to a leadership-hire audience who will notice | Never — always apply the I/we/led rule (Pitfall 4) per claim |
| Editing `echo-client-final.tsx` instead of confirming `echo-client.tsx` is the live file | Saves 30 seconds of verification | Wastes the entire rewrite effort on a component that never renders | Never — always confirm the actively-imported file first |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|-----------------|-------------------|
| Deck as source-of-truth | Treating "the deck doesn't explicitly contradict this" as license to include it | Only include claims the deck (or `CREDIBILITY-COPY.md`) affirmatively states; absence of contradiction is not confirmation |
| `generateMetadata()` / OG image generators | Assuming metadata auto-updates when `PROJECTS` data changes | Verify each surface separately per project — metadata/OG for standalone-route projects is hand-authored, not derived |
| JSON-LD (`CreativeWorkStructuredData`, `ProjectFAQStructuredData`) | Updating narrative copy but not the parallel schema fields (`metrics`, `teamSize`, `role`, `dateCreated`) | Reconcile schema fields as part of the same edit that changes the underlying fact, not as an afterthought |
| Cal.com / tracked CTAs referenced inside case-study narratives (if added as persuasive CTAs mid-story) | Adding a new CTA instance without wiring `trackEvent` per the existing analytics pattern | Follow the established `trackEvent("event_name", {...})` pattern from CLAUDE.md; don't hand-roll an untracked link |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|-----------------|
| Longer case-study pages with more scroll-triggered Motion sections per project | Slower initial paint / more JS work on scroll for pages that were already animation-heavy | Reuse existing lazy-loading patterns (`next/dynamic`) for any new heavy section rather than adding more eagerly-loaded animation blocks | Noticeable once 3+ new animated sections are added per page across all 8 projects simultaneously |
| More images/screenshots added per project to support deeper narrative | Larger page weight, slower LCP on project pages | Follow existing WebP/AVIF + responsive sizing conventions already in `next.config.js`; don't add unoptimized images ad hoc | Compounds across 8 pages if each adds 2-3 unoptimized images |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Publishing internal client metrics/screenshots beyond what was previously cleared (Pitfall 3) | NDA/confidentiality exposure, damaged professional relationship with named real companies (Nagarro, Echo) | Explicit per-project "cleared to publish at this depth" check with Randy before adding new specificity to real-client work |
| Reusing `trackEvent` names or analytics properties that leak internal project codenames or unreleased-product details | Minor information leakage via client-side analytics payloads | Keep analytics event/property naming consistent with existing public project names, not internal-only identifiers |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-------------------|
| Long, dense narrative with no skimmability aids | A time-pressed hiring manager bounces before reaching the "decisions" or "outcome" section that actually proves seniority | Give each project a consistent, scannable structure (clear section headers, a short outcome callout near the top) so the proof is reachable even by a skimmer |
| Uniform depth forced onto thin-data projects (Pitfall 6) | Padded, vague sections read as filler and undercut trust in the *better*-sourced projects on the same site | Allow variable depth; a short, honest section is more credible than a long, generic one |
| Inconsistent structure between `[slug]`-served and standalone-route projects (Pitfall 7) | A hiring manager clicking through multiple case studies notices some are "the deep new format" and some aren't, reading as unfinished/inconsistent | Resolve the routing/template question explicitly before content work (see Pitfall 7) |

## "Looks Done But Isn't" Checklist

- [ ] **Content rewrite marked complete for a project:** Often missing a metadata/OG/JSON-LD reconciliation pass — verify by grepping the old claim text across `app/`, `lib/`, `components/seo/` (Pitfall 2).
- [ ] **"All 8 projects use the new template":** Often actually means only the 3 `[slug]`-served projects do — verify by checking each of the 6 rendering files individually (Pitfall 7).
- [ ] **"Decisions have rationale now":** Often means plausible-sounding rationale was added, not deck-sourced rationale — verify each decision traces to a deck slide or `CREDIBILITY-COPY.md` line (Pitfall 1).
- [ ] **"First-person voice applied":** Often means a mechanical we→I swap — verify against `teamSize`/`role` per project that "I" claims are individually attributable, not team output relabeled (Pitfall 4).
- [ ] **"Thin sections filled":** Often means filled with invented specifics rather than deck-sourced ones, or with generic process language — verify against a deck-coverage audit table, not just "does the section have text now" (Pitfalls 1, 5, 6).
- [ ] **"Case study deepened for a real named client":** Often skips a re-confirmation that the added specificity is still OK to publish — verify explicit sign-off exists for any new detail beyond what was previously live (Pitfall 3).

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|----------------|------------------|
| Fabricated/unsourced claim shipped to production | MEDIUM | Same playbook as v1.0's inline audit remediation: grep the claim across copy/metadata/OG/JSON-LD, replace or remove everywhere at once, redeploy, log the lesson in Key Decisions like the "6 awards" entry |
| NDA/confidentiality-sensitive detail published about a real named company | HIGH | Remove immediately (not just soften wording), check search-engine/social caches (Google cache, LinkedIn preview cache, Vercel/CDN cache) for lingering copies of the OG image or cached page, consider direct outreach to the affected company if exposure was material |
| "I" over-claims solo credit for team-led work | LOW-MEDIUM | Rewrite the specific claim to "I led the team that…" or attribute correctly; low cost if caught pre-publish via the role/teamSize check, higher if a specific former colleague notices and raises it publicly |
| Template inconsistency discovered post-ship (some of the 8 didn't get the new structure) | MEDIUM | Requires a follow-up mini-phase to apply the template to the missed standalone-route pages — cheaper if caught during the routing-audit step (Pitfall 7) than after all 8 are "signed off" |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|-------------------|----------------|
| 1. Embellishment/fabrication creep | Data-completeness / outcome-proofing phase, with an explicit per-claim source-check step | Every hard claim traceable to a specific deck slide or `CREDIBILITY-COPY.md` line; unbacked claims flagged to Randy, not invented |
| 2. Cross-surface claim drift | End of content-rewrite phase (dedicated verification step) | Grep old claim text across `app/`, `lib/`, `components/seo/`; per-project metadata/OG/JSON-LD checklist item |
| 3. Confidentiality/NDA exposure | Content-rewrite phase, per-project review gate for real-named-client projects | Explicit "cleared to publish at this depth" sign-off logged per project before deeper content on Nagarro/Echo/other named clients ships |
| 4. Sole-credit over-claiming | Content-rewrite phase, applied as a style rule per claim | "I" claims checked against `role`/`teamSize`; team-executed work uses "I led/directed," not bare "I" |
| 5. Generic voice / process theater | Content-rewrite phase, per-project acceptance criteria | Each project has 1-3 specific, deck-backed, non-obvious decisions; generic process language flagged in review |
| 6. Thin-data empty sections | New up-front deck-coverage-audit step, before content rewriting starts | Per-project Backed/Partial/Unbacked table produced and routed to Randy for gaps, before any prose is written |
| 7. Inconsistent template across 8 pages (route shadowing) | Narrative-template-evolution phase, at the design/planning step (before content work) | Explicit enumeration of all 6 rendering files; documented decision to migrate-to-shared-template vs. update-5-bespoke-templates |
| 8. SEO/OG regressions | Same cross-surface verification step as Pitfall 2 | Before/after diff of title/meta description/OG image/JSON-LD per project, including the 5 standalone-route pages |
| 9. Accessibility of long-form content | Narrative-template-evolution phase (heading hierarchy decided once at template level) | Heading order and reduced-motion check across all 8 in the final cross-surface verification pass |
| 10. Scope creep across 8 rewrites | Content-rewrite phase, sequenced as 1 reference project + 7 following it | Fixed per-project checklist (deck-coverage, credit rule, metadata/OG/schema, a11y) applied uniformly; tech-debt items tracked separately from content changes |

## Sources

- `.planning/PROJECT.md` — v1.0 Key Decisions table (source of the "claims lingered in OG/metadata after copy fix" lesson; v2.0 constraint that unbacked projects get flagged, not invented)
- `.planning/CREDIBILITY-COPY.md` — verified source-of-truth scope and its explicit limits (only awards/testimonials/GrowIt metrics/schema-cleanup are deck-sourced in detail here; other 7 projects' deeper claims are not pre-verified by this file)
- `.planning/MILESTONES.md` — v1.0 CRED-01/CRED-03/POS-04 audit-remediation history (direct precedent for Pitfall 2's cross-surface drift)
- `lib/data/projects.ts` — direct inspection of all 8 project records (`slug`, `teamSize`, `role`, `metrics`, existing narrative copy) that grounds Pitfalls 1, 4, 5, 6
- `app/projects/[slug]/page.tsx` — `generateMetadata()`/`CreativeWorkStructuredData`/`ProjectFAQStructuredData` wiring, grounding Pitfalls 2 and 8
- `app/projects/{addvanced,echo,nagarro,rambis-ui,waffle}/` directory structure — direct code evidence for Pitfall 7 (static route shadowing of `[slug]`) and the `echo-client.tsx` vs `echo-client-final.tsx` dead-code finding
- Next.js App Router routing precedence (static/explicit segments resolve before dynamic `[slug]` segments) — standard, well-documented framework behavior; HIGH confidence, corroborated by this repo's own Key Decisions entry describing "static route shadowing" as a deliberate pattern already used for `waffle`

---
*Pitfalls research for: rewriting portfolio case studies deeper/more persuasive (v2.0 Case-Study Depth)*
*Researched: 2026-08-15*
