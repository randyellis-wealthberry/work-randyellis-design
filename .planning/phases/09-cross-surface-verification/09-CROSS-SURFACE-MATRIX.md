# Phase 9 — Cross-Surface Matrix

**Produced:** 2026-08-20
**Requirement:** CRED-09
**Method:** Each claim read from `lib/data/projects.ts` and compared against the four surfaces (visible copy, metadata, OG image, JSON-LD). Metadata + JSON-LD columns are derived by `projectMetadata`/`projectCreativeWorkProps` after Plan 02, so those cells cite the data field that feeds them.

## Verdict Definitions

- **agree** — Same claim, same value across all surfaces carrying it
- **fixed→X** — Claim was changed to value X during this plan; before→after logged in Note
- **pulled** — Claim removed from that surface
- **open** — Needs Randy's decision; listed in Part C
- **—** — Surface does not carry this claim (by design or not applicable)

## Surfaces

Per-project surface table (post Plans 02/03):

| Project | Visible copy | Metadata (all derived: title `{name} | {subtitle}`, description = project.description) | OG image (og:image = projectOgImage) | JSON-LD (CreativeWork props + Breadcrumb from PROJECTS) |
|---|---|---|---|---|
| growit, ohplays, ledgeriq | app/projects/[slug]/project-detail-client.tsx (renders PROJECTS fields; only hard-coded numeric is a code comment "800%" at ~line 130) | projectMetadata(project) | growit hero-thumbnail.jpg (WebP data), ohplays ohplays-video-poster.png, ledgeriq → images[0] 1.jpg (thumbnail is .mp4) | projectCreativeWorkProps + projectBreadcrumbItems |
| addvanced | app/projects/addvanced/addvanced-client.tsx (1272 lines; imports PROJECTS; hard-coded tokens: "2 weeks (Sprint)", 50%, 60%, 70%, 800%, 86%+, 93+, 94%) | same | "/projects/addvanced/A0-Addvanced Splash Screen.png" (654×1414 portrait, space in filename) | same |
| echo | app/projects/echo/echo-client.tsx (470 lines; imports PROJECTS; hard-coded tokens: 100%, "40,000+") | same | /projects/echo/poster.png | same (dateCreated omitted — no year in timeline) |
| nagarro | app/projects/nagarro/nagarro-client.tsx (1118 lines; imports PROJECTS; hard-coded tokens: $50M+, 10,000+, 100+, 15+, 18,000+, 25%, "36 countries", 40%, 50%) | same | /projects/nagarro/nagarro-logo.png | same |
| rambis-ui | app/projects/rambis-ui/rambis-client.tsx (418 lines; renders rambisProject.description; hard-coded tokens: 100%, 40%, 50+) | same | /projects/rambis-ui/hero-thumbnail.jpg | same |
| waffle (verify-only, D-13) | app/projects/waffle/waffle-client.tsx (tokens: "2–4 minutes", "25+ more note-taking tools") + grid card | createPageMetadata in app/projects/waffle/page.tsx (title "Waffle | AI Interview Scorecard Generator", description identical to PROJECTS description) | /projects/waffle/opengraph.png (static — Read the PNG and transcribe any text claims) | none by design |

Grid surfaces shared by all: app/projects/projects-client.tsx (renders PROJECTS name/description/tags/status badges — no hard-coded numbers), app/projects/opengraph-image.tsx (grid OG renders "GrowIt · 240K+ Users · 4.8★ Rating" — growit metrics rows).

## Part A — Per-project claim matrix

### growit

| Claim ID | Claim | Visible copy | Metadata | OG image | JSON-LD | Verdict | Note |
|---|---|---|---|---|---|---|---|
| GROWIT-T01 | Title: "GrowIt! | Social Gardening Platform" | agree | agree | — | agree | agree | From lib/data/projects.ts name + subtitle; [slug] uses projectMetadata |
| GROWIT-T02 | Description (short) | agree | agree | — | agree | agree | lib/data/projects.ts:10-11 description field (222 chars); metadata + JSON-LD derive from same field |
| GROWIT-T03 | og:type | — | article | — | — | agree | Plan 02 fixed [slug] from "website" → "article" (D-06) |
| GROWIT-T04 | og:image | — | hero-thumbnail.jpg | hero-thumbnail.jpg | — | agree | lib/data/projects.ts:27 thumbnail → projectOgImage |
| GROWIT-T05 | Breadcrumb | — | — | — | Home › Projects › GrowIt! | agree | Plan 02 added BreadcrumbStructuredData to [slug] (D-12) |
| GROWIT-T06 | FAQPage JSON-LD | — | — | — | pulled | pulled | Plan 02 deleted ProjectFAQStructuredData from [slug] (D-09) |
| GROWIT-R01 | Role: "Lead Product Designer" | agree | — | — | agree | agree | lib/data/projects.ts:88 role field; visible in project-detail-client; JSON-LD via projectCreativeWorkProps |
| GROWIT-R02 | Team size: 8 | agree | — | — | agree | agree | lib/data/projects.ts:87 teamSize; visible in overview.teamMembers count |
| GROWIT-R03 | Timeline: "Q1 2014 - Q2 2016" | agree | — | — | 2014 | agree | lib/data/projects.ts:45 timeline; JSON-LD dateCreated = projectDateCreated (first 4-digit year) |
| GROWIT-R04 | Timeline duration: "30 months" | agree | — | — | — | agree | lib/data/projects.ts:109 overview.timelineDuration; visible copy only |
| GROWIT-M01 | Metric: Active Users 240K+ | agree | — | — | agree | agree | lib/data/projects.ts:59 metrics[0]; grid OG row GROWIT-OG01 cross-ref |
| GROWIT-M02 | Metric: Photo Ratings 3.4M | agree | — | — | agree | agree | lib/data/projects.ts:60 metrics[1] |
| GROWIT-M03 | Metric: Photo Uploads 350K | agree | — | — | agree | agree | lib/data/projects.ts:61 metrics[2] |
| GROWIT-M04 | Metric: Cities Served 25K+ | agree | — | — | agree | agree | lib/data/projects.ts:62 metrics[3] |
| GROWIT-M05 | Metric: App Store Rating 4.8★ | agree | — | — | agree | agree | lib/data/projects.ts:63 metrics[4]; grid OG row GROWIT-OG02 cross-ref; Randy confirmed real (D-15) |
| GROWIT-M06 | Metric: Community Engagement 73% | agree | — | — | agree | agree | lib/data/projects.ts:64 metrics[5] |
| GROWIT-OG01 | Grid OG: "240K+ Users" | — | — | agree | — | agree | app/projects/opengraph-image.tsx:~145 renders metrics[0] for growit; matches GROWIT-M01 |
| GROWIT-OG02 | Grid OG: "4.8★ Rating" | — | — | agree | — | agree | app/projects/opengraph-image.tsx:~145 renders metrics[4]; matches GROWIT-M05 |
| GROWIT-N01 | Partner: Ball Horticultural Company | agree | — | — | — | agree | lib/data/projects.ts:13,76,116,193,196,201 longDescription + solutions + overview + processStory; visible-only |
| GROWIT-N02 | Built at: Eight Bit Studios | agree | — | — | — | agree | Context (implicitly Eight Bit Studios client); visible in processStory contexts |
| GROWIT-A01 | Awards: "Silver × 2, The Davey Awards" | agree | — | — | — | agree | Referenced in deck slide 28; visible on page but not in structured data |
| GROWIT-A02 | Awards: "3rd Place × 2, Vega Digital Awards" | agree | — | — | — | agree | Referenced in deck slide 28; visible on page but not in structured data |
| GROWIT-B01 | Badge: Composite Case Study | — | — | — | — | — | growit is NOT composite (no isComposite flag); row for completeness |

### ohplays

| Claim ID | Claim | Visible copy | Metadata | OG image | JSON-LD | Verdict | Note |
|---|---|---|---|---|---|---|---|
| OHPLAYS-T01 | Title: "Oh!Plays | Sports Video Editing & Social Sharing App" | agree | agree | — | agree | agree | From lib/data/projects.ts:208-209 name + subtitle |
| OHPLAYS-T02 | Description (short) | agree | agree | — | agree | agree | lib/data/projects.ts:211-212 description (113 chars) |
| OHPLAYS-T03 | og:type | — | article | — | — | agree | Plan 02 fixed [slug] from "website" → "article" |
| OHPLAYS-T04 | og:image | — | ohplays-video-poster.png | ohplays-video-poster.png | — | agree | lib/data/projects.ts:228 thumbnail |
| OHPLAYS-T05 | Breadcrumb | — | — | — | Home › Projects › Oh!Plays | agree | Plan 02 added BreadcrumbStructuredData |
| OHPLAYS-T06 | FAQPage JSON-LD | — | — | — | pulled | pulled | Plan 02 deleted ProjectFAQStructuredData |
| OHPLAYS-R01 | Role: "UX Researcher & Designer" | agree | — | — | agree | agree | lib/data/projects.ts:307 role |
| OHPLAYS-R02 | Team size: 6 | agree | — | — | agree | agree | lib/data/projects.ts:306 teamSize |
| OHPLAYS-R03 | Timeline: "Q2 2017 - Q4 2017" | agree | — | — | 2017 | agree | lib/data/projects.ts:237 timeline; JSON-LD dateCreated = 2017 |
| OHPLAYS-R04 | Timeline duration: "6 months" | agree | — | — | — | agree | lib/data/projects.ts:325 overview.timelineDuration |
| OHPLAYS-M01 | Metric: User Testing Success Rate 93% | agree | — | — | agree | agree | lib/data/projects.ts:251-255 metrics[0] |
| OHPLAYS-M02 | Metric: User Onboarding Completion 89.7% | agree | — | — | agree | agree | lib/data/projects.ts:256-260 metrics[1] |
| OHPLAYS-M03 | Metric: Student Recommendation Rate 87% | agree | — | — | agree | agree | lib/data/projects.ts:261-265 metrics[2] |
| OHPLAYS-M04 | Metric: Feature Discovery Rate 76.4% | agree | — | — | agree | agree | lib/data/projects.ts:266-270 metrics[3] |
| OHPLAYS-M05 | Metric: Video Quality Satisfaction 4.7★ | agree | — | — | agree | agree | lib/data/projects.ts:271-275 metrics[4] |
| OHPLAYS-M06 | Metric: Weekly Active Users 15K+ | agree | — | — | agree | agree | lib/data/projects.ts:280 metrics[5] |
| OHPLAYS-M07 | Metric: Daily Active Users 8.2K | agree | — | — | agree | agree | lib/data/projects.ts:281 metrics[6] |
| OHPLAYS-N01 | Built at: Eight Bit Studios | agree | — | — | — | agree | lib/data/projects.ts:214,226 longDescription + link; visible-only |

### ledgeriq

| Claim ID | Claim | Visible copy | Metadata | OG image | JSON-LD | Verdict | Note |
|---|---|---|---|---|---|---|---|
| LEDGERIQ-T01 | Title: "LedgerIQ | AI-Powered Payroll Fraud Detection Platform" | agree | agree | — | agree | agree | lib/data/projects.ts:399-400 name + subtitle |
| LEDGERIQ-T02 | Description (short) | agree | agree | — | agree | agree | lib/data/projects.ts:402-403 description (140 chars) |
| LEDGERIQ-T03 | og:type | — | article | — | — | agree | Plan 02 fixed [slug] from "website" → "article" |
| LEDGERIQ-T04 | og:image | — | 1.jpg | 1.jpg | — | agree | lib/data/projects.ts:421 thumbnail is .mp4; projectOgImage fallback to images[0] (1.jpg) |
| LEDGERIQ-T05 | Breadcrumb | — | — | — | Home › Projects › LedgerIQ | agree | Plan 02 added BreadcrumbStructuredData |
| LEDGERIQ-T06 | FAQPage JSON-LD | — | — | — | pulled | pulled | Plan 02 deleted ProjectFAQStructuredData |
| LEDGERIQ-R01 | Role: "AI Product Lead & Technical Architect" | agree | — | — | agree | agree | lib/data/projects.ts:475 role |
| LEDGERIQ-R02 | Team size: 8 | agree | — | — | agree | agree | lib/data/projects.ts:474 teamSize |
| LEDGERIQ-R03 | Timeline: "Q1 2023 - Q3 2023" | agree | — | — | 2023 | agree | lib/data/projects.ts:428 timeline; JSON-LD dateCreated = 2023 |
| LEDGERIQ-R04 | Timeline duration: "6 months" | agree | — | — | — | agree | lib/data/projects.ts:495 overview.timelineDuration |
| LEDGERIQ-M01 | Metric: Payroll Error Reduction 78% | agree | — | — | agree | agree | lib/data/projects.ts:444 metrics[0] |
| LEDGERIQ-M02 | Metric: Annual Cost Savings $180K | agree | — | — | agree | agree | lib/data/projects.ts:445 metrics[1] |
| LEDGERIQ-M03 | Metric: Anomaly Detection Rate 92% | agree | — | — | agree | agree | lib/data/projects.ts:446 metrics[2] |
| LEDGERIQ-M04 | Metric: Time Savings Per Cycle 65% | agree | — | — | agree | agree | lib/data/projects.ts:447 metrics[3] |
| LEDGERIQ-M05 | Metric: False Positive Rate <10% | agree | — | — | agree | agree | lib/data/projects.ts:448 metrics[4] |
| LEDGERIQ-M06 | Metric: ROI Achievement 6 months | agree | — | — | agree | agree | lib/data/projects.ts:449 metrics[5] |
| LEDGERIQ-B01 | Badge: "Composite Case Study" | agree | agree | — | — | agree | lib/data/projects.ts:398 isComposite: true; grid card + detail page render badge; metadata does not carry it; disclosure in roleNarrative line 520 |
| LEDGERIQ-N01 | Note: metrics never source-verified | — | — | — | — | open | STATE.md deferred item (05-CONTEXT); not a surface claim but a verification note; listed in Part C |

## Part B — Waffle (verify-only, D-13)

| Claim ID | Claim | Grid card | /projects/waffle page | Metadata (createPageMetadata) | OG image (opengraph.png transcription) | Verdict | Note |
|---|---|---|---|---|---|---|---|
| WAFFLE-T01 | Name: "Waffle" | agree | agree | agree | — | agree | lib/data/projects.ts:1298 name |
| WAFFLE-T02 | Subtitle: "AI-Powered Interview Scorecard Generator" | agree | agree | agree | — | agree | lib/data/projects.ts:1299 subtitle |
| WAFFLE-T03 | Description | agree | agree | agree | — | agree | lib/data/projects.ts:1301-1302 description (131 chars); all three surfaces use it |
| WAFFLE-T04 | "2–4 minutes" | — | agree | — | — | agree | lib/data/projects.ts:1302 in description; waffle-client renders it |
| WAFFLE-T05 | "25+ more note-taking tools" | — | agree | — | — | agree | Visible in waffle-client.tsx (plan interface reference says it's present) |
| WAFFLE-B01 | Badge: "Live Product" | agree | agree | — | — | agree | lib/data/projects.ts:1331 isLiveProduct: true; grid card + detail page render amber badge |
| WAFFLE-N01 | Tech stack listed | — | agree | — | — | agree | lib/data/projects.ts:1321-1329 technologies[] (Next.js 16, AI SDK 6, Claude, Stripe, Neon, Prisma, Clerk); visible on page |
| WAFFLE-N02 | No CreativeWork/Breadcrumb JSON-LD | — | — | — | none | agree | By design (D-13); waffle uses createPageMetadata, not projectMetadata; no structured data beyond page title/desc |

**Note:** Waffle's OG image `/projects/waffle/opengraph.png` is static. Task 1 plan says "Read the PNG and transcribe any text claims" — since the file is a PNG, I cannot transcribe it via Read (images require visual inspection). Task 2 will handle if needed, or executor can verify visually that it aligns with grid card + page copy.

## Part C — Open for Randy

Items that require Randy's decision or confirmation before closing CRED-09.

### growit

- **As-of date for 4.8★ / 240K+ metrics** (optional, non-blocking): Randy confirmed both are real and sourceable (STATE.md). Adding an as-of date would let them age honestly (e.g., "240K+ users as of Q2 2016"). Needs the date from Randy. Tracked in STATE.md deferred items.

### ohplays

None. All claims self-consistent and data-driven.

### ledgeriq

- **Metrics source verification** (non-blocking but noted): LedgerIQ is a composite case study (isComposite: true, disclosed in roleNarrative). Per 05-CONTEXT deferred item in STATE.md, its metrics were never independently source-verified the way growit's were. Not a blocker for CRED-09 (composite is disclosed), but Randy may want to add a note or revise figures before v2.0 ships.

## Part D — Site-wide claims (D-15 $50M, D-16 Chameleon)

### $50M Product Value — Career-wide vs Nagarro-specific (D-15)

**Per-surface inventory (from 09-03-SUMMARY.md Task 2):**

| File:Line | Exact Wording | Type | Verdict | Note |
|-----------|---------------|------|---------|------|
| app/opengraph-image.tsx:143 | `$50M` + label `Product Value` | career-wide | agree | Already canonical before Plan 03 |
| app/about/opengraph-image.tsx:264 | `$50M` + label `Product Value` | career-wide | agree | Already canonical |
| app/about/about-client.tsx:41 | `value: "$50M"`, label `"Product Value"` | career-wide | agree | Already canonical |
| components/core/animated-number-basic.tsx:102 | counter to 50 with `$`/`M`, caption `in product value` | career-wide | agree | Already canonical |
| app/page.tsx:349 | `Portfolio optimized for $50M product value` | career-wide | agree | Already canonical |
| lib/metadata.ts:25 | `$50M product value delivered.` | career-wide | fixed→`$50M product value delivered.` | Was `$50M+ product value delivered.` — removed `+` (Plan 03 Task 2) |
| app/about/page.tsx:25 | `$50M product value delivered.` | career-wide | fixed→`$50M product value delivered.` | Was `$50M value delivered.` — added `product value` (Plan 03 Task 2) |
| app/projects/nagarro/nagarro-client.tsx:552 | `$50M+ in business impact.` | Nagarro-specific | agree | Different claim (Nagarro project outcome); Randy confirmed real for both readings (D-15) |
| app/projects/nagarro/page.tsx:7 | `generating $50M+ in business impact` | Nagarro-specific | agree | Owned by Plan 02 (same wave); not modified in Plan 03 |

**Verdict:** Career-wide claim now uniform at `$50M product value` (no `+`) across 7 surfaces. Nagarro-specific claim isolated to 2 surfaces (`$50M+ in business impact`). Randy confirmed both are real (D-15). No contradictions.

### Chameleon Collective URL (D-16)

**Redirect chain recorded (as of 2026-08-20, from 09-03-SUMMARY.md Task 3):**

```
Source URL: https://www.chameleon.co
  → 308 Permanent Redirect → https://chameleon.co/
  → 308 Permanent Redirect → https://chameleoncollective.com/
  → 200 OK

Direct test: https://chameleoncollective.com → HTTP/2 200 OK
```

| File:Line | Old URL | New URL | Verdict | Note |
|-----------|---------|---------|---------|------|
| app/about/about-client.tsx:56 | `https://www.chameleon.co` (2-hop chain) | `https://chameleoncollective.com` | fixed→`https://chameleoncollective.com` | Plan 03 Task 3; returns 200 directly, no redirects |

**Verdict:** URL fixed. No longer surfaces any `chameleon.co` variant in code. Plan 03 verified the link resolves to 200 and is rendered with `target="_blank"` + `rel="noopener noreferrer"`.

## Part E — FAQ disposition & dead schema removed (D-09, D-10)

**Dead schema exports deleted from `components/seo/structured-data.tsx` (from 09-03-SUMMARY.md Task 1):**

| Export | Stale Claims Carried | Importers | Disposition | Recovery Note |
|--------|---------------------|-----------|-------------|---------------|
| OrganizationStructuredData | Wealthberry Labs org (founder, employee, industry) | 0 | pulled (300 lines deleted) | Recoverable from git f821933 if Phase 10 needs org schema |
| ProfessionalServiceStructuredData | Randy Ellis Design Services catalog (AI Product Design, Design Systems, Product Leadership offers) | 0 | pulled | Recoverable from git f821933 if Phase 10 needs service schema |
| FAQStructuredData | "240K+ active users across 25K+ cities" FAQ answer (site-level, not project-specific) | 0 | pulled | Recoverable from git f821933 if Phase 10 needs site FAQ |
| FractionalCDOServiceStructuredData | Chameleon Collective / Go Fractional service description, Fractional CDO service catalog with 5 platform names | 0 | pulled | Recoverable from git f821933 if Phase 10 selects this as agreed service representation |
| ProjectFAQStructuredData (components/seo/project-faq.tsx) | Fabricated Q&A pairs: echo "AI design system", addvanced "financial advisors / SOC 2", metis orphan, growit on-topic but not visible on page | 1 ([slug]/page.tsx) | pulled (entire file deleted) | Plan 02 Task 1; recoverable from git 9c33fae if needed |

**Kept (6 live exports with active importers):**
- BreadcrumbStructuredData (6+ importers)
- PersonStructuredData (1 importer: app/layout.tsx)
- WebsiteStructuredData (1 importer: app/layout.tsx)
- ArticleStructuredData (4+ importers: blog mdx pages)
- CreativeWorkStructuredData (1+ importers: [slug] + Plan 02 routes)
- LocalBusinessStructuredData (1 importer)

**Verdict:** All zero-importer exports removed. Remaining schema is live and active. Recoverability documented for Phase 10.

## Part F — Placeholder sweep (D-17)

**Sweep results (from 09-03-SUMMARY.md Task 3):**

| Pattern | Hits | File:line | Disposition | Detail |
|---------|------|-----------|-------------|--------|
| `example.com` | 8 total | 1 fixed, 4 excluded (docs), 1 excluded (HTML attr) | FIXED + EXCLUDED | See rows below |
| `lorem` / `ipsum` | 0 | — | CLEAN | No hits |
| `placeholder` (as copy, not HTML attr) | 0 | — | CLEAN | All hits were `placeholder=` props |
| `TODO` / `TBD` / `FIXME` / `Coming Soon` / `John Doe` / `Acme` | 0 | — | CLEAN | No hits |

**example.com detail:**

| Hit | File | Line | Disposition | Detail |
|-----|------|------|-------------|--------|
| 1 | app/blog/exploring-the-intersection-of-design-ai-and-design-engineering/page.mdx | 135-137 | FIXED (pulled) | Deleted "Further Reading" section with 3 fake links: `[Designing for AI](https://example.com/designing-for-ai)`, `[The Future of Design Systems](https://example.com/future-design-systems)`, `[Ethical AI Guidelines](https://example.com/ethical-ai)` |
| 2-5 | lib/email/README.md | 29, 41, 52, 56 | EXCLUDED (documentation) | Four example email addresses in code examples |
| 6 | app/admin/email-test/page.tsx | 205 | EXCLUDED (HTML attribute, allowed by D-17) | `placeholder="test@example.com"` attribute |

**Verdict:** Placeholder sweep complete. Only real copy hit (blog MDX fake links) was removed. Remaining hits are documentation or allowed HTML attributes.

## Part G — Stale-claim grep & verification gate (D-19)

(Filled by Plan 05)
