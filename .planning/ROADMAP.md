# ROADMAP — Recruiter-Readiness Milestone

**4 phases** | **18 requirements mapped** | All v1 requirements covered ✓
Granularity: coarse. Order: credibility first (highest liability), then excitement,
then conversion. Phase 4 (Waffle product page) added post-milestone as a
ship-proof portfolio addition.

---

### Phase 1: Credibility Fixes

**Goal:** Every public claim on the site is accurate and verifiable — nothing fails a recruiter's source-view or a reference check.
**Mode:** mvp
**Requirements:** CRED-01, CRED-02, CRED-03, CRED-04, CRED-05
**Input:** `.planning/CREDIBILITY-COPY.md` (verified source-of-truth copy)
**Success Criteria**:

1. Site shows 4 named awards (Davey ×2, Vega ×2) with issuers; no "6 Design Awards" anywhere; Webby listed as Judge
2. All visible testimonials map to real, named people with title + company; no name reused across companies
3. Each metric resolves to a single consistent value site-wide (GrowIt users reconciled to deck figures)
4. No fabricated JSON-LD: `aggregateRating`, placeholder telephone, and placeholder verification code removed
5. `fractional-cdo-hidden-seo.tsx` hidden-keyword block removed; `npm run lint` + `npx tsc --noEmit` + `npm test` green

### Phase 2: Positioning & Messaging

**Goal:** A hiring manager understands Randy's seniority and unique value in ~10 seconds.
**Mode:** mvp
**Requirements:** POS-01, POS-02, POS-03, POS-04, POS-05
**Success Criteria**:

1. Above-the-fold hero states leadership role + value + 3 proof chips (no 60-word paragraph)
2. Visible copy and metadata agree on one title lane (leadership-forward)
3. The design-leader-who-ships + AI differentiator appears in the first screen
4. Brand name is consistent across site, schema, and contact surfaces

### Phase 3: Candidate Readiness

**Goal:** Remove every friction between an interested hiring manager and a booked conversation.
**Mode:** mvp
**Requirements:** RDY-01, RDY-02, RDY-03, RDY-04
**Success Criteria**:

1. Above-the-fold one-click booking CTA works (scheduling link) alongside email
2. Resume PDF downloads and fires `trackResumeDownload()`
3. Client logo bar renders recognizable employers/clients
4. Testimonials section surfaces the Phase-1 verified quotes

### Phase 4: Waffle Product Page

**Goal:** Prove Randy is a design leader who *ships* + AI — a standalone `/projects/waffle` page showcasing Waffle (waffle.cards), his own live, monetized AI SaaS (AI interview-scorecard generator).
**Mode:** mvp
**Requirements:** WAF-01, WAF-02, WAF-03, WAF-04
**Input:** `.planning/phases/04-waffle-product-page/04-CONTEXT.md`; product source-of-truth `/Users/MacBook/Developer/waffle.cards`
**Plans:** 2/3 plans executed
Plans:
**Wave 1**

- [x] 04-01-PLAN.md — Waffle product showcase page (/projects/waffle) + brand assets + dual tracked CTA [wave 1]

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 04-02-PLAN.md — Badged "Live Product" card in the /projects grid routing to the page [wave 2]

**Wave 3** *(blocked on Wave 2 completion)*

- [ ] 04-03-PLAN.md — Visual/contrast/provenance verification checkpoint (light + dark) [wave 3]

**Success Criteria**:

1. `/projects/waffle` renders a product showcase: hero (product + Randy's role) → 6-feature grid → 3-step how-it-works → product screenshot → CTA row
2. Dual CTA (`View live product ↗` + `Try free`) both link to waffle.cards and fire `trackEvent`
3. `/projects` grid shows a Waffle card with a "Live Product" badge that routes to `/projects/waffle` (not the `[slug]` case-study template)
4. Waffle-orange accent + logo applied within the portfolio design system, contrast-safe in light + dark; `npm run lint` + `npx tsc --noEmit` + `npm test` green

---

## Coverage

All 18 requirements mapped to exactly one phase. Phases 1–3 (14 v1 reqs) traced in
`REQUIREMENTS.md`; Phase 4 `WAF-*` reqs defined below (add to `REQUIREMENTS.md` when
traceability is next refreshed).

### Phase 4 requirements (WAF-*)

- **WAF-01:** Standalone product page at `/projects/waffle` (showcase depth).
- **WAF-02:** Badged "Live Product" card in the `/projects` grid linking to the page.
- **WAF-03:** Dual CTA to waffle.cards, both tracked via `trackEvent`.
- **WAF-04:** Portfolio design system + waffle-orange accent + Waffle logo assets.

---
*Last updated: 2026-08-15 (Phase 4 planned: 3 plans across 3 waves)*
