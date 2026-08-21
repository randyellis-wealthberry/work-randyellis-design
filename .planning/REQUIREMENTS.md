# Requirements: Randy Ellis Portfolio — v2.0 Case-Study Depth

**Defined:** 2026-08-15
**Core Value:** A hiring manager finds a coherent, senior, *verifiable* story — and here, proof of *how Randy decides*, not just what he shipped.

**Scope note:** "All 8 projects" reconciles to **7 case studies** getting the deep narrative treatment (growit, ohplays, ledgeriq, addvanced, echo, nagarro, rambis-ui). **Waffle is excluded** — it is a product showcase page shipped in v1.0, not a case study. Only 3 of the 7 (growit, ohplays, ledgeriq) render through the `[slug]` template today; the other 4 are bespoke standalone pages being converged onto the evolved shared template.

## v1 Requirements

### Foundation — Decisions Gate (blocking prerequisites)

- [x] **FND-01**: `Project` type resolves from `lib/data/types.ts` (not stale `app/data.ts`); stale `app/data.ts` PROJECTS array deleted — new narrative fields typecheck against the model actually used
- [x] **FND-02**: Orphaned `/ledgeriq` root route deleted; `/projects/ledgeriq` is the single canonical LedgerIQ page (no crawlable duplicate)
- [x] **FND-03**: Per-project deck-coverage audit produced — a Backed / Partial / Unbacked table for the 7 case studies. **Advisory only**; the gate it once imposed on Phase 8 was removed 2026-08-15
- [x] **FND-04**: Dead code removed — `echo-client-final.tsx` (unused) and abandoned `components/case-study/*` — so rewrites edit only live files

### Template & Data Model

- [x] **TPL-01**: `Project` / `processStory` model extended with structured narrative fields — `decisions[]{title, decision, rationale, outcome}`, `roleNarrative`, and a genuine `reflection` (distinct from outcome summary)
- [x] **TPL-02**: Narrative UI components built from existing primitives + `@tailwindcss/typography` (decision callout, in-page anchor nav, reflection block) — no new npm dependencies, no MDX
- [x] **TPL-03**: Evolved `[slug]` template renders the full arc — problem → *my* role → decisions-with-rationale → measurable outcome → reflection — with no section rendering shallow when data is present
- [x] **TPL-04**: Evolved template piloted and validated on growit (pure-data) before mass rollout

### Bespoke Convergence

- [x] **MIG-01**: addvanced migrated from bespoke JSX onto the evolved shared template
- [x] **MIG-02**: echo migrated onto the shared template (live `echo-client`, not the dead `-final` variant)
- [x] **MIG-03**: nagarro migrated onto the shared template
- [x] **MIG-04**: rambis-ui migrated onto the shared template

### Content Rewrite (first-person, decision-driven)

- [x] **CNT-01**: growit rewritten — corporate "we" → first-person decision narrative; challenges·solutions·learnings complete; decisions tied to verifiable outcomes
- [x] **CNT-02**: ohplays rewritten to the same bar
- [x] **CNT-03**: ledgeriq rewritten to the same bar
- [x] **CNT-04**: addvanced rewritten to the same bar
- [x] **CNT-05**: echo rewritten to the same bar
- [x] **CNT-06**: nagarro rewritten to the same bar
- [x] **CNT-07**: rambis-ui rewritten to the same bar
- [x] **CNT-08**: Where they genuinely happened, decisions include "alternatives considered" and leadership signals (mentoring/influence/strategy) — applied per project, never as uniform template fill

### Credibility Guardrails (cross-cutting — v1.0 discipline, intensified)

- [x] **CRED-06**: "I vs we vs led" credit rule applied per project — team-led work (teamSize 3–15, director titles) is not misattributed as solo IC work
- [x] **CRED-07**: Every decision/metric/outcome comes from Randy's firsthand account; the writer never invents one to fill a narrative slot. Figures a reader can independently check (store ratings, download counts) should be right, and the site must not contradict itself across surfaces
- [x] **CRED-08**: NDA / named-company disclosure signed off by Randy for live companies (Nagarro, Echo) before their internal metrics are narrated deeper
- [ ] **CRED-09**: Cross-surface verification pass — visible copy vs metadata vs OG image vs JSON-LD reconciled across every touched project (modeled on v1.0 audit remediation)

### Tech-Debt Fold-In

- [x] **DEBT-01**: POS-02 proof-chips — dense subhead resolved to the intended chip treatment
- [x] **DEBT-02**: WAF-02 — Waffle "Live Product" badge click dead-zone fixed

### SEO Remediation

- [ ] **SEO-01**: Service worker kill-switch + PWA cleanup — replace stale Workbox SW with self-unregistering kill-switch, delete PWA artifacts (manifest, fallback files, components/pwa/, app/offline/)
- [ ] **SEO-02**: robots.txt `/_next/` unblocking + AI crawler policy — remove `/_next/` from disallow list so Googlebot can render client-side content, open site to AI crawlers (GPTBot, CCBot, Claude-Web, etc.)
- [ ] **SEO-03**: Test route deletion/blocking — delete `/test/codeblock` and `/test-glow` entirely, audit all `/app` routes for other dev-only pages and delete or noindex
- [ ] **SEO-04**: Structured data consolidation + server-render migration — emit only Person, WebSite, CreativeWork, Article (server-rendered in RSC pages); delete LocalBusiness, Organization, ProfessionalService, and all FAQ schema (CONTEXT D-08/D-09, CRED-07 no-fabrication)
- [ ] **SEO-05**: Sitemap lastModified + live verification — add lastModified dates to sitemap URLs; mandatory post-deploy verification (robots.txt fetch, Rich Results Test, Search Console sitemap submission)

## v2 Requirements (deferred)

### Polish

- **POL-01**: Visual polish pass beyond case-study surfaces
- **POL-02**: Waffle converged onto shared template (only if it ever becomes a case study rather than a product page)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Waffle rewritten as a case study | It's a product showcase shipped in v1.0; different intent than a career case study |
| MDX / second content pipeline | Forks content systems, breaks greppable-claims credibility audit; typed-data model chosen |
| New narrative libraries (before/after sliders, reading-progress emoji tracker) | No asset pairs exist; existing primitives + typography cover it |
| Inventing "alternatives considered" where the deck is silent | Fabrication risk — the exact failure v1.0 purged |
| Visual redesign / rebrand | Substance over aesthetics (carried from v1.0) |
| Restoring the elaborate bespoke `/ledgeriq` design | Canonicalizing on the auditable shared template; richer-but-un-auditable loses |

## Traceability

Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FND-01 | Phase 5 | Complete |
| FND-02 | Phase 5 | Complete |
| FND-03 | Phase 5 | Complete (advisory) |
| FND-04 | Phase 5 | Complete |
| TPL-01 | Phase 6 | Complete |
| TPL-02 | Phase 6 | Complete |
| TPL-03 | Phase 6 | Complete |
| TPL-04 | Phase 6 | Complete |
| MIG-01 | Phase 7 | Complete |
| MIG-02 | Phase 7 | Complete |
| MIG-03 | Phase 7 | Complete |
| MIG-04 | Phase 7 | Complete |
| CNT-01 | Phase 8 | Complete |
| CNT-02 | Phase 8 | Complete |
| CNT-03 | Phase 8 | Complete |
| CNT-04 | Phase 8 | Complete |
| CNT-05 | Phase 8 | Complete |
| CNT-06 | Phase 8 | Complete |
| CNT-07 | Phase 8 | Complete |
| CNT-08 | Phase 8 | Complete |
| CRED-06 | Phase 8 | Complete |
| CRED-07 | Phase 8 | Complete |
| CRED-08 | Phase 8 | Complete |
| CRED-09 | Phase 9 | Pending |
| SEO-01 | Phase 10 | Pending |
| SEO-02 | Phase 10 | Pending |
| SEO-03 | Phase 10 | Pending |
| SEO-04 | Phase 10 | Pending |
| SEO-05 | Phase 10 | Pending |
| DEBT-01 | Phase 5 | Complete |
| DEBT-02 | Phase 5 | Complete |

**Coverage:**
- v1 requirements: 26 total
- v2 requirements (SEO): 5 total
- Mapped to phases: 31/31 ✓
- Unmapped: 0

---
*Requirements defined: 2026-08-15*
*Last updated: 2026-08-20 — SEO requirements added (Phase 10)*
