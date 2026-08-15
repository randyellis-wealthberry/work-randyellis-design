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

Phase: 08 (content rewrite) — IN PROGRESS
Plan: decisions + attribution + claim purge done for all 7; prose voice conversion remains
Status: Phase 9 cross-surface sweep run once (role-title drift found and fixed)
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

- **Decision content: 7 of 7 projects populated** (17 decisions total). growit 5, addvanced 2, rambis-ui 2, ohplays 2, echo 2, nagarro 2, ledgeriq 2. Outcomes present on 14 of 17; ledgeriq's 2 and one nagarro decision are absent by choice rather than invented.
- **CNT-01..08 are NOT complete.** Decisions, roleNarrative, attribution corrections and the false-claim purge are done for all 7. What remains is converting the existing `challenges`/`solutions`/`learnings`/`processStory` prose from corporate "we" into first person, and filling genuinely thin sections. That is the rest of Phase 8.
- **LedgerIQ composite disclosure needs a stronger surface.** It is currently stated in the first sentence of `roleNarrative`, which renders inside the "My Role" section. Consider a visible badge at the top of the page — an unlabeled composite is the single riskiest item in the portfolio.
- **Echo NDA line applied (CRED-08 RESOLVED).** Randy set it at process-and-design-only. Removed "$184.4 million" LTL revenue, "16% revenue increase", "12% shipment volume", "1,000 beta downloads" and "10,000+ active drivers" from five surfaces: project data, the bespoke client hero, `processStory.outcome`, two stakeholder quotes, and page metadata (description + OpenGraph).
- **Nagarro NDA: none (CRED-08 RESOLVED).** Randy confirmed a public-facing role; its metrics are publishable and stay.
- **Two Echo stakeholder quotes were edited, not removed.** Both are attributed to named roles at Echo Global Logistics and contained business figures. Figures stripped, attribution kept. If these quotes are not independently sourceable, they should come out entirely — Randy's call.

### Blockers/Concerns

- Phase 8 requires Randy's sign-off (CRED-08) on NDA/confidentiality depth for Nagarro and Echo before that content ships — not resolvable without his input
- LedgerIQ's real-vs-composite status is ambiguous (existing copy reads hypothetical/composite) — confirm with Randy before deepening its narrative in Phase 8
- Verify Chameleon Collective URL and 4.8★ App Store rating before either lands in deeper copy (carried from v1.0)
- ~~LedgerIQ real-vs-composite ambiguity~~ RESOLVED 2026-08-15: it is a composite, now disclosed in roleNarrative
- ~~Phase 8 requires Randy's sign-off (CRED-08) on Nagarro and Echo~~ RESOLVED 2026-08-15: Echo = process/design only, Nagarro = unrestricted

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
