# REQUIREMENTS — Recruiter-Readiness Milestone

REQ-ID format: `[CATEGORY]-[NN]`. All are v1 for this milestone.

## v1 Requirements

### Credibility (CRED) — Phase 1
- [ ] **CRED-01**: Awards claim shows 4 named, verifiable awards (2× Davey Silver, 2× Vega 3rd Place) with issuer; "6 Design Awards" removed everywhere (counter, About cards, Person schema, project data)
- [ ] **CRED-02**: Testimonials are real and attributable (Paul Grachen, Donald Wu from deck); reused/fabricated stakeholder names (Sarah Chen, Maria Rodriguez, David Thompson) removed
- [ ] **CRED-03**: Every metric has one consistent value across the site (GrowIt user count reconciled to deck's ~240K; no 1M-vs-100K contradiction)
- [ ] **CRED-04**: Fabricated structured data removed — `aggregateRating` 4.9/15, placeholder `telephone` +1-XXX, placeholder Google verification code
- [ ] **CRED-05**: Hidden keyword-stuffing block (`fractional-cdo-hidden-seo.tsx`) removed; genuine positioning moved to visible copy

### Positioning (POS) — Phase 2
- [ ] **POS-01**: Hero leads with leadership positioning (Head of Product / Fractional CDO) in visible copy, not hidden metadata
- [ ] **POS-02**: Value proposition is skimmable in ~10s — headline + one line + 3 proof chips (replaces the 60-word run-on subhead)
- [ ] **POS-03**: The differentiator (design leader who also ships React/Next/TS + led AI products end-to-end) is front-and-center
- [ ] **POS-04**: Single, consistent title lane across visible copy + metadata (no IC-vs-leadership ambiguity)
- [ ] **POS-05**: Brand naming consistent (Wealthberry Labs vs wealthbrry.com vs buildyourlegacywithai.com resolved)

### Readiness (RDY) — Phase 3
- [ ] **RDY-01**: One-click book-a-call CTA (scheduling link) above the fold, replacing email-only mailto
- [ ] **RDY-02**: Downloadable resume/CV (PDF), wired to the existing unused `trackResumeDownload()`
- [ ] **RDY-03**: Client logo bar with recognizable employers/clients (Nagarro, Alight, Echo Global Logistics, Ball Horticultural, DigitasLBi)
- [ ] **RDY-04**: Dedicated testimonials section surfacing the verified quotes (CRED-02)

## v2 / Deferred
- Visual polish pass, additional case-study rewrites, verified additional awards (if 2 more surface with proof → restore to 6)

## Out of Scope
- Redesign/rebrand — positioning + substance only
- PWA revival — Next 15 incompatibility, not a hiring blocker
- Net-new features/content

## Traceability

| REQ-ID | Phase | Status |
|--------|-------|--------|
| CRED-01 | 1 | ✅ Done (2513864) |
| CRED-02 | 1 | ✅ Done (a686f85) — real testimonials, 8 fake blocks removed |
| CRED-03 | 1 | ✅ Done (a686f85) — GrowIt → 240K active everywhere |
| CRED-04 | 1 | ✅ Done (2513864) |
| CRED-05 | 1 | ✅ Done (2513864) |
| POS-01 | 2 | Pending |
| POS-02 | 2 | Pending |
| POS-03 | 2 | Pending |
| POS-04 | 2 | Pending |
| POS-05 | 2 | Pending |
| RDY-01 | 3 | Pending |
| RDY-02 | 3 | Pending |
| RDY-03 | 3 | Pending |
| RDY-04 | 3 | Pending |

---
*Last updated: 2026-08-14*
