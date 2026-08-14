# ROADMAP — Recruiter-Readiness Milestone

**3 phases** | **14 requirements mapped** | All v1 requirements covered ✓
Granularity: coarse. Order: credibility first (highest liability), then excitement,
then conversion.

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

---

## Coverage

All 14 v1 requirements mapped to exactly one phase. See `REQUIREMENTS.md` traceability.

---
*Last updated: 2026-08-14*
