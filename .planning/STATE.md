---
gsd_state_version: 1.0
milestone: v3.0
milestone_name: Enterprise Credibility
status: planning
last_updated: "2026-08-22T22:40:11.814Z"
last_activity: 2026-08-22
progress:
  total_phases: 0
  completed_phases: 0
  total_plans: 0
  completed_plans: 0
  percent: 0
---

# STATE — Randy Ellis Portfolio

## Project Reference

See: .planning/PROJECT.md (updated 2026-08-15 after v1.0 milestone)

**Core value:** A hiring manager finds a coherent, senior, *verifiable* story with an obvious way to book a conversation — shipped and audit-verified in v1.0. v2.0 adds proof of *how Randy decides*.
**Current focus:** v3.0 Enterprise Credibility — defining requirements

## Current Position

Phase: Not started (defining requirements)
Plan: —
Status: Defining requirements
Last activity: 2026-08-22 — Milestone v3.0 started

## Performance Metrics

**Velocity:**

- Total plans completed: 18 (v1.0 + v2.0); v3.0 not yet started
- Average duration: —
- Total execution time: —

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 09 | 5 | - | - |

**Recent Trend:** — (no v3.0 plans executed yet)
| Phase 05 P02 | 19min | 5 tasks | 24 files |

## Accumulated Context

### Roadmap Evolution

- Phase 10 added 2026-08-16: SEO Remediation — scoped from `.planning/research/SEO-AUDIT.md` (codebase audit: stale sw.js kill switch, robots `/_next/` block, `/test` noindex, structured-data consolidation sequenced after Phase 9 CRED-09, sitemap lastModified, live post-deploy verification). Depends on Phase 9.

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
- ~~[Phase 07]: `CaseStudyNarrative` composite added so bespoke pages share one component set rather than four hand-copied JSX blocks that drift~~ — **SUPERSEDED 2026-08-22 by Randy.** The convergence it hedged against happened: all 7 case studies now render through `components/case-study/case-study-template.tsx`, which composes `RoleNarrativeSection`, `DecisionCallout`, `ReflectionBlock` and `CaseStudyTOC` itself with each page's own labels. The composite had no remaining caller and was deleted; the four parts it wrapped survive as the template's implementation
- [Phase 05]: FND-01 closed: Project type resolves exclusively from lib/data/types.ts; app/data.ts deleted; Phase 6 decisions[]/roleNarrative fields will typecheck against the live model

### Pending Todos

- **Decision content: 7 of 7 projects populated** (17 decisions total). growit 5, addvanced 2, rambis-ui 2, ohplays 2, echo 2, nagarro 2, ledgeriq 2. Outcomes present on 14 of 17; ledgeriq's 2 and one nagarro decision are absent by choice rather than invented.
- **CNT-01..08 complete 2026-08-16.** Voice pass done: corporate "we/our" went 41 → 14 across the 7 projects, and every surviving instance is deliberate — the 3 Echo stakeholder quotes (other people speaking), genuine team execution on 3-person and 4-person teams, and Nagarro's org-level "our". Not a find/replace: CRED-06 requires "we" where a team executed and "I" only for Randy's own calls. No sections were thin, so nothing needed filling.
- **Voice pass also caught two attribution leftovers**: ohplays' reflection opened "Leading Oh!Plays" (he was UX Researcher & Designer) and leaned on "the success of Oh!Plays", a post-launch outcome he had already said was not his. Both rewritten.
- ~~LedgerIQ composite disclosure surface~~ **RESOLVED 2026-08-16.** Added `Project.isComposite`, driving a "Composite" badge on the grid card and a "Composite Case Study" badge plus a one-line explanation in the detail-page hero. Grid status badges now share one stacking container so Live Product and Composite cannot overlap.
- **Echo NDA line applied (CRED-08 RESOLVED).** Randy set it at process-and-design-only. Removed "$184.4 million" LTL revenue, "16% revenue increase", "12% shipment volume", "1,000 beta downloads" and "10,000+ active drivers" from five surfaces: project data, the bespoke client hero, `processStory.outcome`, two stakeholder quotes, and page metadata (description + OpenGraph).
- **Nagarro NDA: none (CRED-08 RESOLVED).** Randy confirmed a public-facing role; its metrics are publishable and stay.
- ~~Echo stakeholder quote sourcing~~ **RESOLVED 2026-08-16.** Randy confirmed the quotes come from real project retros and emails. They stay, with the business figures already stripped.

### Blockers/Concerns

- Phase 8 requires Randy's sign-off (CRED-08) on NDA/confidentiality depth for Nagarro and Echo before that content ships — not resolvable without his input
- LedgerIQ's real-vs-composite status is ambiguous (existing copy reads hypothetical/composite) — confirm with Randy before deepening its narrative in Phase 8
- ~~Verify 4.8★ App Store rating and 240K+ users~~ RESOLVED 2026-08-16: Randy confirmed both are real and sourceable. They appear on 6 surfaces (homepage, projects metadata, OG image, JSON-LD FAQ, structured data, project metrics) and stay. Optional follow-up: add an as-of date so they age honestly — needs the date from Randy.
- ~~Verify Chameleon Collective URL (carried from v1.0)~~ RESOLVED 2026-08-21 (Phase 10 plan 10-08): `https://chameleoncollective.com` returns HTTP 200 in one hop; both visible occurrences confirmed; the legacy schema module carrying the other references was deleted
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

Last session: 2026-08-22T00:05:40.299Z
Stopped at: Phase 10 context gathered
Resume file: None

## Operator Next Steps

- Start the next milestone with /gsd-new-milestone
