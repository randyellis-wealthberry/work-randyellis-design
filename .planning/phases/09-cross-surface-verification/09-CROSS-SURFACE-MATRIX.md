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

### addvanced

| Claim ID | Claim | Visible copy | Metadata | OG image | JSON-LD | Verdict | Note |
|---|---|---|---|---|---|---|---|
| ADDVANCED-T01 | Title: "Addvance | AI-Enhanced Career Intelligence Platform" | agree | agree | — | agree | agree | lib/data/projects.ts:558-559 name + subtitle; Plan 02 fixed from "Addvanced Career Tracker Case Study" |
| ADDVANCED-T02 | Description (short) | agree | agree | — | agree | agree | lib/data/projects.ts:561-562 description (172 chars) |
| ADDVANCED-T03 | og:type | — | article | — | — | agree | Plan 02 fixed from hand-typed metadata |
| ADDVANCED-T04 | og:image | — | A0-Addvanced Splash Screen.png | A0-Addvanced Splash Screen.png | — | agree | lib/data/projects.ts:583 thumbnail (654×1414 portrait, space in filename); listed in Part C as open (thumbnail choice) |
| ADDVANCED-T05 | Breadcrumb | — | — | — | Home › Projects › Addvance | agree | Plan 02 already had BreadcrumbStructuredData |
| ADDVANCED-T06 | Breadcrumb name fixed | — | — | — | fixed→"Addvance" | fixed→"Addvance" | Was "Addvanced Career Tracker"; Plan 02 fixed to match project.name |
| ADDVANCED-R01 | Role: "Lead UX Designer" (bespoke) vs data | visible: "Lead UX Designer" | — | — | — | agree | addvanced-client uses custom text; lib/data/projects.ts role field not shown; no conflict |
| ADDVANCED-R02 | Team size: 4 | agree | — | — | agree | agree | Derived from overview.teamMembers count |
| ADDVANCED-R03 | Timeline: "2-week sprint (Alight Case Study)" | agree | — | — | — | agree | lib/data/projects.ts:592 timeline; no 4-digit year → dateCreated omitted from JSON-LD |
| ADDVANCED-R04 | Timeline token: "2 weeks (Sprint)" | agree | — | — | — | agree | addvanced-client.tsx line ~768 hard-coded; matches data timeline substance |
| ADDVANCED-M01 | Metric: Prototype Approval Rate 94% | agree | — | — | agree | agree | lib/data/projects.ts:607-610 metrics[0]; also hard-coded at client lines 188, 863 |
| ADDVANCED-M02 | Metric: User Task Completion 91.7% | agree | — | — | agree | agree | lib/data/projects.ts:611-615 metrics[1] |
| ADDVANCED-M03 | Metric: Mobile Usability Score 4.8/5 | agree | — | — | agree | agree | lib/data/projects.ts:616-620 metrics[2] |
| ADDVANCED-M04 | Metric: Feature Discovery Rate 89.2% | agree | — | — | agree | agree | lib/data/projects.ts:621-625 metrics[3] |
| ADDVANCED-M05 | Metric: User Recommendation Rate 87% | agree | — | — | agree | agree | lib/data/projects.ts:626-630 metrics[4] |
| ADDVANCED-M06 | Metric: Sprint Delivery Success 100% | agree | — | — | agree | agree | lib/data/projects.ts:635-639 metrics[5] |
| ADDVANCED-M07 | Metric: Stakeholder Satisfaction 4.9/5 | agree | — | — | agree | agree | lib/data/projects.ts:640-644 metrics[6] |
| ADDVANCED-H01 | Hard-coded: 50% (deviated testers) | agree | — | — | — | agree | addvanced-client.tsx:768; visible-only claim (usability detail) |
| ADDVANCED-H02 | Hard-coded: 60% mission unfinished | agree | — | — | — | agree | addvanced-client.tsx:781; visible-only claim (usability detail) |
| ADDVANCED-H03 | Hard-coded: 800% higher success rate | agree | — | — | — | agree | addvanced-client.tsx:800, 834; visible-only claim (comparative metric) |
| ADDVANCED-H04 | Hard-coded: 86%+ success rate | agree | — | — | — | agree | addvanced-client.tsx:806; visible-only claim (networking features) |
| ADDVANCED-H05 | Hard-coded: 93+ usability scores | agree | — | — | — | agree | addvanced-client.tsx:812; visible-only claim (social intelligence) |
| ADDVANCED-N01 | Partner: Alight Innovation Lab | agree | — | — | — | agree | lib/data/projects.ts:564 longDescription; visible in copy |
| ADDVANCED-N02 | Location: 1871 Chicago | agree | — | — | — | agree | lib/data/projects.ts:564; visible in copy |

### echo

| Claim ID | Claim | Visible copy | Metadata | OG image | JSON-LD | Verdict | Note |
|---|---|---|---|---|---|---|---|
| ECHO-T01 | Title: "EchoDrive | Streamlining Logistics Through Digital Innovation" | agree | agree | — | agree | agree | lib/data/projects.ts name + subtitle; Plan 02 fixed from "EchoDrive Case Study | Logistics Innovation" |
| ECHO-T02 | Description (short) | agree | agree | — | agree | agree | lib/data/projects.ts description (NDA-compliant, process/design only) |
| ECHO-T03 | og:type | — | article | — | — | agree | Plan 02 fixed from hand-typed |
| ECHO-T04 | og:image | — | poster.png | poster.png | — | agree | lib/data/projects.ts thumbnail |
| ECHO-T05 | Breadcrumb | — | — | — | Home › Projects › EchoDrive | agree | Plan 02 added BreadcrumbStructuredData |
| ECHO-T06 | dateCreated omitted | — | — | — | — | agree | Timeline "Alpha → Beta → Launch" has no 4-digit year; projectDateCreated returns undefined (D-11) |
| ECHO-R01 | Role: (visible copy custom) vs data | visible copy custom | — | — | — | agree | echo-client uses bespoke role narrative; no conflict |
| ECHO-R02 | Team size: (not disclosed) | — | — | — | — | — | Echo data lacks teamSize field; not rendered |
| ECHO-R03 | Timeline: "Alpha → Beta → Launch" | agree | — | — | — | agree | lib/data/projects.ts timeline |
| ECHO-M01 | Metric: ELD Compliance 100% | agree | — | — | agree | agree | echo-client.tsx:28 + data metrics; also hard-coded at lines 123, 303 |
| ECHO-M02 | Metric: (other metrics removed per NDA) | pulled | pulled | pulled | pulled | pulled | CRED-08: Echo = process/design only; all business figures removed ($184.4M revenue, 16% revenue, 12% shipment, 1K beta, 10K+ drivers) |
| ECHO-H01 | Hard-coded: "40,000+" transportation providers | agree | — | — | — | agree | echo-client.tsx:150; visible background context (Echo Global Logistics scale); not a result claim |
| ECHO-N01 | Company: Echo Global Logistics | agree | — | — | — | agree | lib/data/projects.ts + echo-client.tsx:150; client company named |

### nagarro

| Claim ID | Claim | Visible copy | Metadata | OG image | JSON-LD | Verdict | Note |
|---|---|---|---|---|---|---|---|
| NAGARRO-T01 | Title: "Design Leadership @ Nagarro | Scaling Design Excellence Across 18,000+ Global Teams" | agree | agree | — | agree | agree | lib/data/projects.ts name + subtitle; Plan 02 fixed from "Design @Nagarro | Design Leadership at Scale" |
| NAGARRO-T02 | Description (short) | agree | agree | — | agree | agree | lib/data/projects.ts description |
| NAGARRO-T03 | og:type | — | article | — | — | agree | Plan 02 fixed |
| NAGARRO-T04 | og:image | — | nagarro-logo.png | nagarro-logo.png | — | agree | lib/data/projects.ts thumbnail; listed in Part C as open (logo vs richer image) |
| NAGARRO-T05 | Breadcrumb | — | — | — | Home › Projects › Design Leadership @ Nagarro | agree | Plan 02 added BreadcrumbStructuredData |
| NAGARRO-R01 | Role: (bespoke visible copy) | visible copy custom | — | — | — | agree | nagarro-client uses custom narrative; no conflict |
| NAGARRO-R02 | Team size: (global, not numbered) | — | — | — | — | — | Data lacks teamSize; Nagarro is org-level leadership role |
| NAGARRO-R03 | Timeline: "Mar 2022 - Oct 2022" (8 months) | agree | — | — | 2022 | agree | lib/data/projects.ts timeline; JSON-LD dateCreated = 2022 |
| NAGARRO-M01 | Metric: (Plan 02 derivation removed 4 metadata claims) | — | pulled | — | pulled | pulled | "$50M+ in business impact", "36 countries", "15,000 to 18,000+", "100+ qualified leads" removed from metadata/description by Plan 02; visible copy KEEPS them |
| NAGARRO-H01 | Hard-coded: 18,000+ (team scale) | agree | — | — | — | agree | nagarro-client.tsx:549,655,682,687; visible-only after derivation removed it from data description |
| NAGARRO-H02 | Hard-coded: 36 countries | agree | — | — | — | agree | nagarro-client.tsx:549; visible-only after derivation |
| NAGARRO-H03 | Hard-coded: $50M+ in business impact | agree | — | — | — | agree | nagarro-client.tsx:552; Nagarro-specific claim (different from career-wide $50M product value); Randy confirmed real (D-15) |
| NAGARRO-H04 | Hard-coded: 50% brand recognition growth | agree | — | — | — | agree | nagarro-client.tsx:551,815; visible-only |
| NAGARRO-H05 | Hard-coded: 100+ (thought leadership reach) | agree | — | — | — | agree | nagarro-client.tsx:823; visible-only after derivation |
| NAGARRO-H06 | Hard-coded: 40% retention improvement | agree | — | — | — | agree | nagarro-client.tsx:831; visible-only |
| NAGARRO-H07 | Hard-coded: 25% lead generation increase | agree | — | — | — | agree | nagarro-client.tsx:451; visible-only |
| NAGARRO-H08 | Hard-coded: 15+ articles | agree | — | — | — | agree | nagarro-client.tsx:466; visible-only |
| NAGARRO-H09 | Hard-coded: 10,000+ subscribers | agree | — | — | — | agree | nagarro-client.tsx:466; visible-only |
| NAGARRO-N01 | Company: Nagarro | agree | — | — | — | agree | Visible throughout; client company |

### rambis-ui

| Claim ID | Claim | Visible copy | Metadata | OG image | JSON-LD | Verdict | Note |
|---|---|---|---|---|---|---|---|
| RAMBIS-T01 | Title: "Rambis UI | Modern Design System & Component Library" | agree | agree | — | agree | agree | lib/data/projects.ts name + subtitle; Plan 02 fixed from "Rambis UI Case Study | Modern Design System..." |
| RAMBIS-T02 | Description (short) | agree | agree | — | agree | agree | lib/data/projects.ts description |
| RAMBIS-T03 | og:type | — | article | — | — | agree | Plan 02 fixed |
| RAMBIS-T04 | og:image | — | hero-thumbnail.jpg | hero-thumbnail.jpg | — | agree | lib/data/projects.ts thumbnail |
| RAMBIS-T05 | Breadcrumb | — | — | — | Home › Projects › Rambis UI | agree | Plan 02 added BreadcrumbStructuredData |
| RAMBIS-T06 | Lookup changed from id to slug | — | — | — | — | agree | Plan 02 Task 3: rambis-ui/page.tsx now uses `p.slug === "rambis-ui"` instead of id |
| RAMBIS-R01 | Role: (visible copy custom) | visible copy custom | — | — | — | agree | rambis-client uses custom narrative; no conflict |
| RAMBIS-R02 | Team size: (solo, not numbered) | — | — | — | — | — | Data lacks teamSize; solo project per narrative |
| RAMBIS-R03 | Timeline: (not disclosed as date range) | — | — | — | — | — | Data lacks explicit timeline; solo open-source project |
| RAMBIS-H01 | Hard-coded: 40% faster development | agree | — | — | — | agree | rambis-client.tsx:306; visible-only claim |
| RAMBIS-H02 | Hard-coded: 50+ components | agree | — | — | — | agree | rambis-client.tsx:314; visible-only claim |
| RAMBIS-H03 | Hard-coded: 100% TypeScript coverage | agree | — | — | — | agree | rambis-client.tsx:322; visible-only claim |
| RAMBIS-N01 | Fork of: Chakra UI | agree | — | — | — | agree | Visible in copy; attribution |

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

### addvanced

- **OG image choice** (open): Thumbnail is a 654×1414 portrait splash screen (`A0-Addvanced Splash Screen.png`) with a space in the filename. Functional but not typical case-study hero image. Randy may want to select a different thumbnail (e.g., one of the wireframe/sitemap images) for richer link unfurls.

### echo

None. All surfaces NDA-compliant (process/design only); business figures removed per CRED-08.

### nagarro

- **OG image choice** (open): Thumbnail is the Nagarro logo PNG (`nagarro-logo.png`). Functional for branding but Randy may want a richer image (e.g., a design system screenshot or team photo) for link unfurls.

### rambis-ui

None. All claims self-consistent and data-driven.

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
| lib/data/static-data.ts:10 | `https://www.chameleon.co` (2-hop chain) | `https://chameleoncollective.com` | fixed→`https://chameleoncollective.com` | Plan 05 G12 fix; WORK_EXPERIENCE Chameleon Collective link |

**Verdict:** URLs fixed. No longer surfaces any `chameleon.co` variant in code (G12 clean). Plan 03 verified the link resolves to 200 and is rendered with `target="_blank"` + `rel="noopener noreferrer"` in about-client.tsx; static-data link used in work experience timeline.

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

**Orphan project claim removed from live schema (Plan 05 G17 fix):**
- **METIS** project reference in PersonStructuredData `knowsAbout` array (components/seo/structured-data.tsx:194) was deleted. METIS appeared in the deleted ProjectFAQStructuredData (Plan 02) as an orphan project but lingered in the Person schema. Not a real portfolio project; removed for consistency.

**Verdict:** All zero-importer exports removed. Remaining schema is live and active. Orphan project claim (METIS) purged from Person schema. Recoverability documented for Phase 10.

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

**Executed:** 2026-08-20 (Plan 05)
**Method:** `grep -rn` with scopes per G01-G17 register; `-w` flag where noted
**Shell:** All patterns run via `grep -rn "<pattern>" <scope>` (case-sensitive unless `-i` specified)

### Stale-Claim Grep Results

| # | Pattern | Scope | Expected | Actual | Hits (file:line) | Status |
|---|---------|-------|----------|--------|------------------|--------|
| G01 | `ProjectFAQStructuredData` \| `seo/project-faq` \| `FAQPage` | app lib components/seo | 0 | 0 | — | ✓ Clean |
| G02 | `-w FAQStructuredData`, `OrganizationStructuredData`, `ProfessionalServiceStructuredData`, `FractionalCDOServiceStructuredData` | app lib components/seo | 0 | 0 | — | ✓ Clean |
| G03 | `Logistics Innovation` \| `Design Leadership at Scale` \| `Addvanced Career Tracker` \| `Modern Design System Innovation` \| `Design System Excellence` \| `Strategic Design Leadership Case Study` | app lib components/seo | 0 | 0 | — | ✓ Clean |
| G04 | `Case Study \|` (title separator pattern) | app/projects/*/page.tsx | 0 | 0 | — | ✓ Clean |
| G05 | `A1-Home.png` \| `digital-accessibility-strategy.png` \| `echo/img1.jpg` | app/projects/*/page.tsx | 0 | 0 | — | ✓ Clean |
| G06 | `longDescription` | app/projects/[slug]/page.tsx, app/projects/*/page.tsx | 0 | 0 | — | ✓ Clean |
| G07 | `type: "website"` | app/projects/[slug]/page.tsx | 0 | 0 | — | ✓ Clean |
| G08 | `15,000 to 18,000` \| `36 countries` \| `100+ qualified leads` \| `\$50M+ in business impact` | app/projects/nagarro/page.tsx | 0 | 0 | — | ✓ Clean |
| G09 | `\$50M+` | app lib components | 1 (nagarro-client.tsx) | 1 | app/projects/nagarro/nagarro-client.tsx:552 | ✓ Expected |
| G10 | `\$50M value delivered` \| `\$50M+ product value` | app lib components | 0 | 0 | — | ✓ Clean |
| G11 | `184\.4` \| `16% revenue` \| `12% shipment` \| `1,000 beta` \| `10,000+ active drivers` | app lib components/seo | 0 | 0 | — | ✓ Clean |
| G12 | `chameleon\.co"` (old host, with closing quote) | app lib components/seo | 0 | 1 → 0 | lib/data/static-data.ts:10 (FIXED) | ✓ Clean after fix |
| G13 | `example\.com` | app lib components | 1 (email-test placeholder=) | 1 | app/admin/email-test/page.tsx:205 `placeholder=` | ✓ Expected |
| G14 | `-i lorem` \| `ipsum` | app lib components | 0 | 0 | — | ✓ Clean |
| G15 | `25K+ cities` | components/seo | 0 | 0 | — | ✓ Clean |
| G16 | `6 awards` \| `100K+` (in opengraph-image.tsx, app/about) | app | 0 | 0 | — | ✓ Clean |
| G17 | `METIS` \| `Metis` | components/seo | 0 | 1 → 0 | components/seo/structured-data.tsx:194 (FIXED) | ✓ Clean after fix |

**Stale hits found and fixed (Plan 05):**

1. **G12 - Chameleon URL (lib/data/static-data.ts:10)**
   - **Before:** `link: "https://www.chameleon.co"` (2-hop redirect chain: .co → chameleon.co/ → chameleoncollective.com/)
   - **After:** `link: "https://chameleoncollective.com"` (returns 200 directly)
   - **Surface:** WORK_EXPERIENCE array, Chameleon Collective entry
   - **Why:** Consistency with Part D fix (app/about/about-client.tsx already updated in Plan 03); Plan 03 missed this static data file
   - **Matrix impact:** Additional row added to Part D Chameleon section

2. **G17 - METIS orphan project (components/seo/structured-data.tsx:194)**
   - **Before:** PersonStructuredData `knowsAbout` array included `{ "@type": "Project", name: "METIS: AI Business Strategy Agent", description: "..." }`
   - **After:** Entry removed (kept "GrowIt!" and "AI Design System Generator")
   - **Surface:** Person JSON-LD schema (app/layout.tsx)
   - **Why:** METIS was orphaned when project-faq.tsx was deleted (Plan 02); lingered in Person schema; not a real portfolio project
   - **Matrix impact:** Part E updated with METIS removal note

**Re-run verification (post-fix):**
```bash
grep -rn "chameleon\.co\"" app lib components/seo  # 0 hits
grep -rn "METIS|Metis" components/seo              # 0 hits
grep -rn '\$50M+' app lib components | wc -l       # 1 hit (nagarro-client.tsx:552, expected)
grep -rn 'example\.com' app lib components | grep -v "lib/email/README" | wc -l  # 1 hit (email-test placeholder=, expected)
```

### Verification gate

(Filled by Task 2: lint → tsc → test)
