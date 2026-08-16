# Phase 9: Cross-Surface Verification - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-16
**Phase:** 9-Cross-Surface Verification
**Areas discussed:** Metadata source-of-truth, FAQ JSON-LD disposition, JSON-LD parity on standalone pages, Proof artifact & unresolved claims

---

## Metadata source-of-truth

**Q1 — How should the 4 standalone pages agree with page copy and lib/data?**

| Option | Description | Selected |
|--------|-------------|----------|
| Derive from lib/data | Each standalone page.tsx builds metadata from its PROJECTS entry; rambis-ui already does; drift can't recur | ✓ |
| Hand-reconcile strings in place | Edit hardcoded strings to match; smallest diff; drift can reappear | |
| Shared helper for all project routes | Extract projectMetadata(project) used by [slug] and standalone pages | (became the outcome via Q7) |

**Q2 — Description field for [slug] (currently longDescription, 475–848 chars)?**

| Option | Description | Selected |
|--------|-------------|----------|
| Use project.description | Exists on every project, 131–222 chars, no data-model change | ✓ |
| Keep longDescription | Truncated in SERPs/unfurls; polish issue only | |
| Add dedicated metaDescription field | 7 new hand-written strings — content work in a verification phase | |

**Q3 — OG image rule when deriving from data?**

| Option | Description | Selected |
|--------|-------------|----------|
| project.thumbnail everywhere | Same as [slug]; thumbnail else first real image; bespoke OG files unused | ✓ |
| Keep bespoke OG per standalone page | Second hand-maintained surface | |
| You decide per project | Claude picks strongest 1200×630 | |

**Q4 — Title format?**

| Option | Description | Selected |
|--------|-------------|----------|
| "{name} \| {subtitle}" everywhere | Matches [slug]; waffle keeps its own | ✓ |
| "{name} Case Study \| {subtitle}" | Adds keyword; longer | |
| You decide | | |

**Q5 — og:type?**

| Option | Description | Selected |
|--------|-------------|----------|
| "article" for all 7 | Case studies are authored long-form; [slug] switches from website | ✓ |
| "website" for all 7 | Match [slug]; drops publishedTime/authors | |
| You decide | | |

**Q6 — Keywords rule?**

| Option | Description | Selected |
|--------|-------------|----------|
| Mechanical from data, everywhere | Same builder for all 7; hand-listed extras dropped unless promoted to tags | ✓ |
| Mechanical + preserve hand-listed extras | Union; keeps a per-page list | |
| You decide | | |

**Q7 — Implement as one shared projectMetadata(project) helper touching [slug] too?**

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, one shared helper | Single implementation; [slug] refactored | ✓ |
| No — leave [slug] untouched | Two copies of same rules | |

**Q8 — Helper location?**

| Option | Description | Selected |
|--------|-------------|----------|
| You decide | Likely lib/metadata.ts next to createPageMetadata | ✓ |
| lib/metadata.ts | | |
| lib/data/ or components/seo/ | | |

**User's choice:** Derive from data via one shared helper; description = project.description; OG = thumbnail; title "{name} | {subtitle}"; og:type article; mechanical keywords; location = Claude's discretion.
**Notes:** User asked for "More questions" once (Q5–Q8), then moved on.

---

## FAQ JSON-LD disposition

**Q1 — What happens to project-faq.tsx (off-project FAQs for echo/addvanced, orphan metis, none visible on-page)?**

| Option | Description | Selected |
|--------|-------------|----------|
| Delete FAQPage schema from project pages | Same as v1.0 fabricated-schema purge; Google requires visible Q&A; growit's 3 already covered by other schema | ✓ |
| Keep growit only, delete the rest | Still invisible-on-page schema | |
| Rewrite from Randy's account for all 7 | Content + UI work — its own phase | |

**Q2 — Dead/unimported schema exports found during sweep (e.g. site-level FAQStructuredData)?**

| Option | Description | Selected |
|--------|-------------|----------|
| Delete dead schema exports found | Bounded to components/seo/*; log each in matrix | ✓ |
| Leave them, log only | Risk of re-import with stale claims | |

**User's choice:** Delete FAQ schema + file; delete dead schema exports in components/seo/* and log.
**Notes:** Scout confirmed [slug]/page.tsx is project-faq.tsx's only importer; site FAQStructuredData has zero importers.

---

## JSON-LD parity on standalone pages

**Q1 — CreativeWork on standalone pages?**

| Option | Description | Selected |
|--------|-------------|----------|
| All 7 emit CreativeWork from data | Standalone page.tsx add the same call [slug] makes | ✓ |
| Leave standalone pages schema-less | Partial SC1 parity | |
| You decide | | |

**Q2 — Breadcrumb (addvanced only today)?**

| Option | Description | Selected |
|--------|-------------|----------|
| All 7 emit Breadcrumb | Cheap, uniform, claim-free | ✓ |
| Remove from addvanced, none emit it | Uniform by subtraction | |
| You decide | | |

**Q3 — Waffle in the unification?**

| Option | Description | Selected |
|--------|-------------|----------|
| Out — verify only, don't unify | Keeps createPageMetadata + product-page title; per PROJECT.md | ✓ |
| In — same helper + CreativeWork/Breadcrumb | 8th project with title override | |

**User's choice:** All 7 emit CreativeWork + Breadcrumb from data; Waffle verify-only.

---

## Proof artifact & unresolved claims

**Q1 — How is reconciliation evidenced?**

| Option | Description | Selected |
|--------|-------------|----------|
| Claim×surface matrix + regression test | 09-CROSS-SURFACE-MATRIX.md + jest test asserting metadata/CreativeWork derive from PROJECTS | ✓ |
| Matrix only | No CI guard | |
| Regression test only | No narrative artifact | |

**Q2 — $50M disposition (deferred from Phase 5)?**

| Option | Description | Selected |
|--------|-------------|----------|
| Ask Randy — hold, don't pull yet | Surface as open question with locations | ✓ (then answered inline, Q3) |
| Pull from all surfaces now | Treat as unbacked | |
| Keep, it's Randy's own figure | Align wording only | |

**Q3 — Direct ask to Randy: is $50M real? (two readings: career-wide product value vs Nagarro business impact)**

| Option | Description | Selected |
|--------|-------------|----------|
| Real, career-wide — keep, drop from nagarro | | |
| Real for both — keep everywhere, align wording | | ✓ |
| Not defensible — pull everywhere | | |
| Not sure — leave open in the matrix | | |

**Q4 — Carry-overs: Chameleon URL verify + placeholder/example.com sweep?**

| Option | Description | Selected |
|--------|-------------|----------|
| Both in | Verify URL; bounded grep; log hits | ✓ |
| Chameleon only | | |
| Neither — strict CRED-09 scope | | |

**Q5 — Conflict rule when surfaces disagree and neither is obviously stale?**

| Option | Description | Selected |
|--------|-------------|----------|
| Prefer visible page copy; log it | Phase 8 rewritten, Randy-reviewed source; every fix is a matrix row | ✓ |
| Prefer lib/data/projects.ts | | |
| Stop and ask each time | | |

**User's choice:** Matrix + test; $50M real for both, keep + align; Chameleon + placeholder sweep in; page copy wins on conflicts, logged.
**Notes:** User is Randy — the $50M question was resolved in-session rather than left as a planner blocker.

---

## Claude's Discretion

- Helper location (lib/metadata.ts suggested)
- Promoting hand-listed standalone keywords into tags
- Matrix layout / claim granularity
- Test file placement and shape
- authors/publishedTime under og:type article
- Commit granularity
- ROADMAP checkbox reconciliation for Phases 6–8

## Deferred Ideas

- As-of date for 4.8★ / 240K+ (needs date from Randy)
- Visible on-page FAQ authored from Phase 8 decisions (only legitimate FAQPage revival)
- POL-01 visual polish (v2.x/v3)
- `wealthberry` branch's 2 unmerged commits — rebase after milestone
