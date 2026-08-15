---
gsd_state_version: 1.0
milestone: v2.0
milestone_name: Case-Study Depth
status: executing
stopped_at: "Phase 6 complete (narrative components + growit pilot); Phase 7 structural wiring complete across 4 bespoke pages"
last_updated: "2026-08-15T18:25:29.172Z"
last_activity: 2026-08-15
progress:
  total_phases: 5
  completed_phases: 0
  total_plans: 2
  completed_plans: 1
  percent: 0
---

# STATE — Randy Ellis Portfolio

## Project Reference

See: .planning/PROJECT.md (updated 2026-08-15 after v1.0 milestone)

**Core value:** A hiring manager finds a coherent, senior, *verifiable* story with an obvious way to book a conversation — shipped and audit-verified in v1.0. v2.0 adds proof of *how Randy decides*.
**Current focus:** Phase 8 — content rewrite (blocked on per-project decision content from Randy)

## Current Position

Phase: 07 (bespoke-convergence) — STRUCTURE COMPLETE
Plan: narrative components wired to all 7 in-scope case studies
Status: Phase 8 content is the critical path
Last activity: 2026-08-15

Progress: [█████░░░░░] 50%

## Performance Metrics

**Velocity:**

- Total plans completed: 0 (v2.0 not yet started)
- Average duration: —
- Total execution time: —

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:** — (no v2.0 plans executed yet)
| Phase 05 P02 | 19min | 5 tasks | 24 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table. Recent decisions affecting current work:

- Roadmap: bespoke-page convergence strategy = insert shared narrative components into the 5 existing bespoke routes (Phase 7), NOT collapse them onto a single generic template — de-risked per architecture research
- Roadmap: `ledgeriq` orphan-route deletion (FND-02) scheduled before its content rewrite so copy isn't authored twice
- ~~Roadmap: deck-coverage audit (FND-03) is a hard gate before Phase 8 content~~ — **REVERSED 2026-08-15 by Randy.** The deck is one record of his work, not its boundary; his firsthand account is a valid source. Audit demoted to advisory reference. Surviving guardrails: self-consistency across surfaces, credit attribution (CRED-06), NDA judgment (CRED-08)
- Roadmap: CRED-09 cross-surface verification is its own final phase (9), not folded into "content done" — modeled on v1.0 audit remediation
- [Phase 05]: D-12 accessibility contract carried forward for Phase 6: preserve deleted case-study-section.tsx's section id / role=region / aria-labelledby->{id}-heading contract while rendering the heading via ScrambleSectionTitle, not a plain h2
- [Phase 05]: D-16 no-AI-slop chip allowlist for Phase 6 UI-SPEC.md: Badge primitive only, no lucide icons, no Card wrapper, no new tokens, amber accent reserved for the Live Product status badge
- [Phase 06]: `TextScramble` no longer sets `role="button"`/`tabIndex` — it overrode heading semantics on every `ScrambleSectionTitle` site-wide, so screen readers got buttons instead of a document outline. Verified `role="button"` count is now 0 across all 7 case-study pages
- [Phase 06]: `decisions[].outcome` is optional by design — omitting it is how the model declines to state a result instead of inventing one (CRED-07)
- [Phase 07]: `CaseStudyNarrative` composite added so bespoke pages share one component set rather than four hand-copied JSX blocks that drift
- [Phase 05]: FND-01 closed: Project type resolves exclusively from lib/data/types.ts; app/data.ts deleted; Phase 6 decisions[]/roleNarrative fields will typecheck against the live model

### Pending Todos

- **Phase 8 — decision content: 3 of 7 done.** growit (5 decisions, all with outcomes), addvanced (2, both with outcomes), rambis-ui (2, outcomes pending). Remaining: ohplays, ledgeriq, echo, nagarro.
- **addvanced claim purge done 2026-08-15.** Randy confirmed it was a 2-week prototype sprint only, never shipped. Removed 8 production-scale metrics, rewrote description/outcome/5 learnings that claimed retention drivers, competitor benchmarks and market capture. Kept the 7 genuine prototype-test figures.
- **rambis-ui open questions.** (a) `status: "in-progress"` and `timeline: "Q3 2024 - Present"` contradict a reflection written entirely in past tense as a finished project. (b) The reflection claims 2,500+ weekly npm downloads, perfect Lighthouse a11y scores across all components, and 40% bundle reduction — the most independently checkable claims on the site. Confirm before they carry more narrative weight. (c) Its 2 decisions have no outcomes yet.
- ~~MIG-01 deviation — addvanced bespoke reflection~~ **RESOLVED 2026-08-15.** Randy chose to standardize. SpotlightCard/Award chrome retired; addvanced now renders `ReflectionBlock` like the other six. The 3-column metric grid was deleted with it after verifying all three figures (35%, 2 weeks, 800%) are already restated elsewhere on the same page — no unique claim lost.
- **Echo data duplication (Phase 9).** `echo-client.tsx` defines a local `enhancedProcessStory` with its own `reflection`, overriding `PROJECTS`. Two sources of truth for one claim — exactly the cross-surface drift CRED-09 exists to catch.
- ~~growit decision outcomes~~ **RESOLVED 2026-08-15.** All 5 now carry an outcome, sourced qualitatively from Randy (no invented figures). Two are honestly negative/mixed: experts complained about buried features under progressive disclosure, and radius-widening thinned relevance exactly where it filled the feed.

### Blockers/Concerns

- Phase 8 requires Randy's sign-off (CRED-08) on NDA/confidentiality depth for Nagarro and Echo before that content ships — not resolvable without his input
- LedgerIQ's real-vs-composite status is ambiguous (existing copy reads hypothetical/composite) — confirm with Randy before deepening its narrative in Phase 8
- Verify Chameleon Collective URL and 4.8★ App Store rating before either lands in deeper copy (carried from v1.0)

## Deferred Items

Items acknowledged and carried forward from previous milestone close:

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| Tech debt | POS-02 proof-chips deviation | Folded into Phase 5 (DEBT-01) | v1.0 close |
| Tech debt | WAF-02 badge click dead-zone | Folded into Phase 5 (DEBT-02) | v1.0 close |
| Tech debt | Stale `app/data.ts` PROJECTS array | Folded into Phase 5 (FND-01) | v1.0 close |
| Polish | Visual polish pass beyond case-study surfaces | Deferred to v2.x/v3 (POL-01) | v1.0 close |

## Session Continuity

Last session: 2026-08-15T18:25:29.096Z
Stopped at: Completed 05-02-PLAN.md (foundation cleanup: FND-01, FND-02, FND-04, DEBT-01, DEBT-02)
Resume file: None

---
*Last updated: 2026-08-15 — v2.0 roadmap created*
