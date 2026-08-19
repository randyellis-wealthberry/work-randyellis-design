# Phase 6: Narrative Template & Data Model - Context

**Gathered:** 2026-08-19
**Status:** Ready for planning (retroactive documentation)

<domain>
## Phase Boundary

Build and pilot a reusable set of narrative components that render the full problem → *my role* → decisions-with-rationale → measurable outcome → reflection arc on at least one project (growit), de-risking the pattern before applying it to 6 more case studies in Phases 7-8.

**Requirements:** TPL-01, TPL-02, TPL-03, TPL-04

**In scope:** extending `Project` type with decisions/roleNarrative fields, creating narrative UI components from existing primitives (no new dependencies), evolving the `[slug]` template to render the full arc, piloting on growit before mass rollout.

**Out of scope:** bespoke page migration (Phase 7), content rewriting (Phase 8), cross-surface verification (Phase 9), any visual redesign beyond what the narrative components require.

</domain>

<decisions>
## Implementation Decisions

### Data Model Extension (TPL-01)

- **D-01:** Add `decisions[]` field to `Project` type with four sub-fields: `title` (string), `decision` (string), `rationale` (string — carries the weight: what was rejected and why), `outcome` (optional string). `outcome` is optional by design — omitting it is how the model declines to state a result instead of inventing one (CRED-07).
- **D-02:** Add `roleNarrative` field (optional string) to `Project` — what Randy personally owned on this engagement, in his own voice. Distinct from `role` (title) and `overview.deliverables` (artifacts). Exists so team-executed work is credited accurately (CRED-06).
- **D-03:** `processStory.reflection` already exists in the type — no new field needed. The narrative arc renders it from data when present.

### Component Architecture (TPL-02)

- **D-04:** Create `CaseStudyNarrative` as a composite component that renders in-page nav + "my role" + decisions-with-rationale in one block. Rationale: the 4 bespoke project pages (addvanced, echo, nagarro, rambis-ui) and any future surface render an identical component set instead of four hand-copied JSX blocks that drift (MIG-01..04). Reflection is deliberately NOT included — every bespoke page already owns a reflection section in its own layout, and including it here would duplicate the copy.
- **D-05:** `CaseStudyNarrative` renders nothing until `roleNarrative` or `decisions` data exists — safe to wire up early without showing empty scaffolding.
- **D-06:** Create `DecisionCallout` component for one decision with its fork made explicit. Uses Badge primitive for "Decision N" chip, ScrambleSectionTitle for heading, no Card wrapper (D-16 ban: surrounding section already uses cards for prose blocks, nesting another card flattens visual hierarchy exactly where the reader should slow down). Subtle `bg-muted/30 hover:bg-muted/50` background provides separation without excessive weight.
- **D-07:** Create `RoleNarrativeSection` component — renders `roleNarrative` string plus optional metadata (role, teamSize, deliverables). Uses section id + role="region" + aria-labelledby contract for accessibility.
- **D-08:** Create `CaseStudyTOC` component for in-page anchor navigation — generates anchor links from array of `{id, label}` items. Allows bespoke pages to pass extra items for their own sections (hero, results, reflection) that the shared narrative doesn't own.
- **D-09:** Create `ReflectionBlock` component — renders `processStory.reflection` with proper heading and prose styling.

### Accessibility (TPL-02, carries forward from Phase 5 D-12)

- **D-10:** Preserve the section id + role="region" + aria-labelledby="{id}-heading" contract from the deleted `components/case-study/case-study-section.tsx`. Phase 6's section wrappers MUST keep that contract but render headings via `ScrambleSectionTitle` (used 39× in the live template — it IS this platform's section-heading language). Resurrecting the old plain centered `<h2>` would fork the design language.
- **D-11:** `ScrambleSectionTitle` component was fixed to remove `role="button"` and `tabIndex` attributes — they overrode heading semantics on every site-wide use, so screen readers got buttons instead of a document outline. Verified `role="button"` count is now 0 across all 7 case-study pages.

### Design Constraints (TPL-02, enforces Phase 5 D-16)

- **D-12:** Narrative components built from existing primitives + `@tailwindcss/typography` only — zero new npm dependencies, no MDX. Allowlist from D-16:
  - `components/ui/scramble-section-title.tsx` (section heading language)
  - `components/ui/badge.tsx` (for "Decision N" chips)
  - `@tailwindcss/typography` prose/prose-invert (already installed, proven on /blog)
  - Motion primitives (in-view, text-effect, scroll-progress, glow-effect)
  - No Card wrapper for DecisionCallout (nesting cards flattens hierarchy)
- **D-13:** Banned patterns from D-16 enforced: no lucide icons in narrative components, no generic icon+heading+body cards, no new color/type/spacing tokens, no decorative stock imagery, no uniform template fill. Amber accent reserved for the Live Product badge only.

### Template Evolution (TPL-03)

- **D-14:** Evolved `[slug]` template renders the full arc when data is present: problem (existing `challenges`) → *my role* (new `roleNarrative`) → decisions-with-rationale (new `decisions[]`) → measurable outcome (existing `processStory.outcome`) → reflection (existing `processStory.reflection`). No section renders shallow when data exists — the template supports the full narrative but gracefully degrades when data is sparse.
- **D-15:** TOC items accumulate from multiple sources: "My Role" anchor (if roleNarrative exists), "Key Decisions" anchor (if decisions[] exists), plus any `extraTocItems` passed by bespoke pages for their own sections. Each bespoke page owns its section names — the shared narrative doesn't impose them.

### Pilot & Validation (TPL-04)

- **D-16:** growit chosen as the pilot project — pure data-driven render through `[slug]` template (no bespoke page), so it validates the template evolution without bespoke-page interference. Pilot must pass lint → tsc → test clean before any other project is touched.
- **D-17:** Verification criteria for Phase 6: (1) `lib/data/types.ts` has typed decisions/roleNarrative fields with TSDoc, (2) narrative components render from props only (no project-specific strings/paths baked in), (3) growit's page renders the full arc with no shallow sections, (4) `npm run lint` + `npx tsc --noEmit` + `npm test` all pass clean, (5) `role="button"` count is 0 across case-study pages (accessibility regression check).

### Claude's Discretion

- Component file organization — suggest `components/case-study/` directory for the 4 new components (CaseStudyNarrative, DecisionCallout, RoleNarrativeSection, CaseStudyTOC, ReflectionBlock).
- Exact prose styling for decision rationale block — recommend @tailwindcss/typography `prose-sm` classes.
- Whether `CaseStudyTOC` scrollspy/active-section highlighting is needed — recommend defer to Phase 7 if bespoke pages request it.
- Exact heading levels for nested narrative sections — recommend h2 for top-level, h3 for decision callout titles.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Milestone & Requirements
- `.planning/ROADMAP.md` §Phase 6 — phase goal, 4 success criteria, "UI hint: yes" flag
- `.planning/REQUIREMENTS.md` §Template & Data Model — TPL-01..04 wording, Out-of-Scope table
- `.planning/PROJECT.md` §Key Decisions — v2.0 milestone goal (first-person decision-driven narrative)
- `.planning/STATE.md` §Accumulated Context — carries forward D-12 accessibility contract from Phase 5, D-16 no-AI-slop allowlist/bans

### Research & Prior Phase Context
- `.planning/phases/05-foundation-cleanup/05-CONTEXT.md` — D-12 (accessibility contract), D-16 (design allowlist/bans), D-18 (verification order)
- `.planning/codebase/CONVENTIONS.md` — component patterns (shadcn/ui style, cva variants, cn() merging), import organization, server/client split
- `.planning/codebase/STACK.md` — framework inventory (motion, Radix primitives, @tailwindcss/typography, lucide-react)

### Project Instructions
- `CLAUDE.md` §Verifying Changes — lint → tsc → test order; build is NOT a validation gate
- `CLAUDE.md` §TypeScript Configuration — path aliases (`@/*` → root)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/ui/scramble-section-title.tsx` — the platform's section-heading language (39 uses in live template); supports `as` prop for h2/h3 semantic control
- `components/ui/badge.tsx` — already used for Live Product badge; variant="outline" treatment established
- `lib/data/types.ts` — type definitions with TSDoc; exports Project, WorkExperience, getEmail
- `@tailwindcss/typography` — already installed (proven on /blog), provides prose/prose-invert classes for long-form content

### Established Patterns
- **Server/client split:** `app/projects/[slug]/page.tsx` (server, exports metadata) imports `project-detail-client.tsx` (client component with "use client")
- **Props-only rendering:** components receive all data as props, no project-specific hardcoded strings/paths (echoes the lesson from the failed `case-study-layout.tsx` that hardcoded Echo's image paths)
- **Graceful degradation:** guard-clause early returns when data is missing (`if (!metrics || metrics.length === 0) return null;`)
- **Accessibility:** section id + role="region" + aria-labelledby="{id}-heading" contract (carried from Phase 5 D-12)
- **Design language:** zinc-based palette, amber accent for Live Product badge only, ScrambleSectionTitle for all section headings

### Integration Points
- `lib/data/types.ts` — add decisions[] and roleNarrative fields here; already imported by `app/projects/[slug]/project-detail-client.tsx` after Phase 5's FND-01 type-import fix
- `app/projects/[slug]/project-detail-client.tsx` — evolved template integrates CaseStudyNarrative component; receives project data from parent server component
- `lib/data/projects.ts` — populate growit's decisions/roleNarrative data for pilot validation

</code_context>

<specifics>
## Specific Ideas

- Phase 5's D-16 anti-slop directive, verbatim: *"I want these case studies to not be AI slop, it should be unique using the platform design language and components."* Enforced via concrete allowlist/bans that Phase 6's narrative components must respect.
- ScrambleSectionTitle is the established section-heading treatment (39 uses) — do not introduce a competing plain `<h2>` just because it's simpler; that forks the design language.
- The `outcome` field in decisions[] is optional **on purpose** — it's how the model declines to state a result instead of inventing one (CRED-07). Do not treat missing outcomes as incomplete data that needs filling.

</specifics>

<deferred>
## Deferred Ideas

- **Alternatives-considered callouts** — showing what Randy rejected alongside what he chose. Not uniform template fill; only where it genuinely happened on a project. CNT-08 addresses this in Phase 8 content rewriting, not Phase 6 component scaffolding.
- **Leadership-signal callouts** (mentoring, influence, strategy) — same rationale as alternatives-considered; CNT-08 handles this during content authoring.
- **Scrollspy / active-section highlighting in TOC** — not requested for Phase 6 pilot; defer until bespoke pages request it in Phase 7.
- **Before/after visual comparisons** — no asset pairs exist; deferred per REQUIREMENTS.md Out-of-Scope
- **Reading-progress indicators** — not part of the narrative arc; belongs in polish phase if at all

</deferred>

---

*Phase: 06-narrative-template-data-model*
*Context gathered: 2026-08-19 (retroactive documentation of completed implementation)*
