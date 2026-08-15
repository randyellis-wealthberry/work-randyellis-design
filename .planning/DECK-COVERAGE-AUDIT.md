# Deck-Coverage Audit

> **SUPERSEDED AS A GATE — 2026-08-15.** Randy's firsthand knowledge of his own engagements is
> a valid source. The deck is one record of that work, not the boundary of it. This document is
> now a **reference index of what the deck happens to document** — it does not decide what may
> be written. "Unbacked" below means *"not found in this 48-page PDF,"* nothing more. It is not
> a finding of falsehood and does not require Randy to justify a claim.
>
> Two things survive this change, and neither is a deck rule:
> 1. **Self-consistency** — where the site contradicts *itself* across surfaces (GrowIt scope,
>    LedgerIQ's CONTRADICTION block), that is a defect a reader can catch with no source at all.
>    Still tracked; see Part C.
> 2. **NDA / attribution judgment** (CRED-06, CRED-08) — unchanged, unrelated to sourcing.

**Source:** Randy's Product Design Deck.pdf (48pp, 16,263,989 bytes, verified on disk 2026-08-15)
**Produced:** 2026-08-15
**Requirement:** FND-03
**Gates:** nothing — advisory reference only

**Page-count check:** The deck is exactly 48 pages (`pdfinfo` confirms `Pages: 48`), matching
D-04's expectation. No discrepancy to flag.

---

## Verdict Definitions

These verdicts are **descriptive labels about the deck's contents**, not permissions. They
answer "did this 48-page PDF happen to mention this?" and nothing else.

- **Backed** — the claim appears in the deck, or in another linked verifiable source, and the
  row carries a slide number or a source URL.
- **Partial** — the deck supports the substance of the claim but not the exact figure or
  wording (e.g. deck says "cut audit time significantly", site says "65% time savings per cycle").
- **Unbacked** — not found in this deck. **This is not a defect and requires no action.** The
  deck's own Agenda scopes it to two case studies; five of seven projects were never in it.

**Removed — non-deck source rule.** The prior rule demoted real, verifiable facts to Unbacked
whenever a row lacked a cited URL (it did this to the 4.8★ App Store rating and the Chameleon
Collective claim). That rule is gone. Randy's own account of his engagements is a source.

---

## How To Read This

A large number of Unbacked rows is the **correct result** of this audit, not a failure (D-08).
`.planning/CREDIBILITY-COPY.md` (the v1.0 extraction, 100 lines) covers **GrowIt only**. The
deck itself is more generous than that document: its Agenda (slide 1, PDF page 2) states its
scope explicitly — **"Case Study One: GrowIt"** and **"Case Study Two: Addvance"** — and nothing
else. So this audit finds deck coverage for **two** of the seven in-scope projects (GrowIt,
Addvance), not just one. The other five (Oh!Plays, LedgerIQ, EchoDrive, Nagarro, Rambis UI) have
**zero** verified source anywhere in the deck. There is no target Backed percentage anywhere in
this document.

**Slide numbering.** The deck's own printed footer numbers run 1–46 across PDF pages 2–47; the
cover (PDF p.1) and the closing "Thank You" slide (PDF p.48) carry no printed number. To avoid
ambiguity between "printed slide number" and "PDF page," **every citation in this audit uses the
PDF page number (1–48)** and calls it "Slide N." Where useful, the printed footer number is
noted in parentheses, e.g. "Slide 27 (printed 26)."

**Claim-bearing field scope.** Per the plan's `<interfaces>` block, rows are drawn from
`description`, `longDescription` (metrics/decisions embedded in prose only — not every
sentence), `metrics[]`, `challenges[]`, `solutions[]`, `learnings[]`, `role`, `teamSize`,
`timeline`, `status`, and `processStory.*` (`background`, `approach`, `methodology`,
`keyInsights[]`, `outcome`, `reflection`, `stakeholderQuotes[]`). `processStory.reflection` is
almost universally pure qualitative opinion with no independently checkable claim; rows are
omitted for reflection text that contains nothing new, and that omission is noted once per
project rather than repeated.

**Deviation — `constraints` field added to scope.** The plan's `<interfaces>` block did not
list `Project.constraints` (`environmental`/`technical`/`location`) as claim-bearing, but
`app/projects/[slug]/project-detail-client.tsx:703-784` renders it live on every project page.
Since D-06 half (a) requires verdicting "every claim currently rendered," `constraints` is
audited here for the two deck-covered projects (GrowIt, Addvance) as one consolidated row per
category (environmental/technical/location), rather than one row per array entry, to keep this
already-large audit tractable. `constraints` for the five zero-coverage projects is not
separately audited — every one of those rows would uniformly verdict Unbacked for the same
reason every other field in those projects does (no deck coverage exists), so enumerating them
individually would add volume without new information. This is called out explicitly, not
silently skipped.

**Grep baseline (from CONTEXT.md D-08):** growit 6, ohplays 0, ledgeriq 0, addvanced 0, echo 0,
nagarro 0, rambis-ui 0 — counts of lines in `CREDIBILITY-COPY.md` per project. This audit
supersedes that baseline with a full deck read; see the counts table under `## Phase 8 Gate`.

---

## Deck Index

| Slide | Topic | Project(s) referenced | Claim-bearing? (Y/N) |
|---|---|---|---|
| 1 | Cover — "Randy Ellis, UX/Product Design Leadership Presentation" | — | N |
| 2 | Agenda (About Me, Design/Leadership Philosophy, Case Study One: GrowIt, Q&A, Case Study Two: Addvance, Q&A, What Colleagues Say) | growit, addvanced | N |
| 3 | About Me — "Hi, I'm Randy!" (20-year design professional, last 10 years Product Design/UX/Leadership; hobbies; volunteering incl. Webby Awards Judge) | sitewide | Y |
| 4 | More About Me (Lead Adjunct Instructor at 5 universities; AI tool exploration; patent in development; former VC-funded eCommerce fashion-tech founder; travel) | sitewide | Y |
| 5 | "My Design Philosophy" section divider | — | N |
| 6 | Design Philosophy — "Human, Trust, And Realistic" (be human, build trust, promises based on data) | — | N |
| 7 | Design Philosophy — "Helpful" (online solutions for design community, LinkedIn posts, book photos) | — | N |
| 8 | "Leadership" section divider — Product Design Management | — | N |
| 9 | Leadership 6-box grid (Collaboration, Embrace Innovation, Stay Agile, Emphasize User Research, Human-Centered Design, Continuous Learning) | — | N |
| 10 | "GrowIt!" section divider — New Feature Exercise | growit | Y |
| 11 | GrowIt! app screenshot (login screen) | growit | N |
| 12 | Project Overview — Role/Deliverables, Who I Worked With, Timeline (4-weeks pilot), Tools Used | growit | Y |
| 13 | Product Background — App Background, Feature Request (Lurie Garden self-guided tour) | growit | Y |
| 14 | Design Challenge — "Build an interactive self-guided tour feature inside the GrowIt! app to increase user engagement" | growit | Y |
| 15 | The Design — "Understanding GrowIt!" (garden forums, App/Play Store reviews as research inputs) | growit | Y |
| 16 | The Design — "What Did We Learn?" (Visuals, Functionality, Determination) | growit | Y |
| 17 | Research — Persona "Gregory Hamner" (age 51, LeafDepot manager, goals/frustrations/bio) | growit | Y |
| 18 | The Design — Brainstorming (day-one engineering conversations, sketching, BiP: Bad Idea Party, stakeholders) | growit | Y |
| 19 | Early on Roadblocks — "Design Challenge: Side Quest" (what constraints to consider) | growit | N |
| 20 | Constraints — "Constraints For The GrowIt! App" (Environmental: Chicago climate; Technical: iBeacon signal strength/blocking; Location: mounting, radio frequencies, null states) | growit | Y |
| 21 | Designing with Key Data — "Ideation With Constraints" (seamless wayfinding, resume-tour-if-lost, simple onboarding; 99% Invisible podcast link) | growit | Y |
| 22 | Focus of Work — "Customer Needs" (garden knowledge access, join horticulture community, personal garden offerings, find arboretums) | growit | Y |
| 23 | User Flows — "Self-Guided Tour" (New User, Existing User, User Engagement flows; client = GrowIt, agency = Eight Bit Studios) | growit | Y |
| 24 | Hi-Fi Wireframes — "Self-Guided Tour Prototype" (Tour Ad, OnBoarding, Tour Checkpoints, Tour Ends: CTA) | growit | Y |
| 25 | Impact — "Research Insights" Internally Tested (badge as trigger indicator, resume-tour need, completion notification need) | growit | Y |
| 26 | Reflection — "Validation & Results" (prototype "tested exceptionally well," no usability problems understanding tour process) | growit | Y |
| 27 | "GrowIt! w/ Self Guided Tour Update" stats — NAUs 209K→240K (+15%), Photo Activity 120K→320K (+164%), Engagement/Photo Ratings 2.3M→3.4M (+48%) | growit | Y |
| 28 | Conclusion — Awards (Silver × 2, The Davey Awards; 3rd Place × 2, Vega Digital Awards) | growit | Y |
| 29 | Q&A divider | — | N |
| 30 | "Addvance" section divider — Lean UX Exercise | addvanced | Y |
| 31 | Addvance app screens (splash screen, "My Job Boards" home) | addvanced | N |
| 32 | Product Background — "Background" (Alight's Innovation Lab, 1871 Chicago; lean startup/UX methodology) & "The Solution" (PWA for job search tracking) | addvanced | Y |
| 33 | Role & Team — Project Overview (Lead UX Designer; team: Frontend Developer, Creative Director, Assoc. Director of UX (me), PM; Timeline: 2-week Sprint (Concept); Tools: InVision, Miro, Maze ×2, Whiteboard/Sharpie+Paper) | addvanced | Y |
| 34 | Research — "What Did We Learn?" Competitive Analysis (Trello indirect, Huntr CRM direct, Apple Notes aspirational; observations: light, clean, easy to use, complex) | addvanced | Y |
| 35 | Research — "Additional Learnings" (Fitts Law utilization, differentiators: Dashboard/Simplicity, Goals: Reachability/Heuristics/Direct) | addvanced | Y |
| 36 | Research — Design Challenge ("Create a helpful tool for job seekers to browse, save, and manage the candidate path for a professional career") | addvanced | Y |
| 37 | Research — "Addvance Sitemap" (first release: Pull from URL — LinkedIn & Indeed; Upload & Store Documents; View network connections in-app; Track professional networks social activity) | addvanced | Y |
| 38 | Key Screens (A1: Home; A5: Connection Details; A17c: Moved To Offer) | addvanced | Y |
| 39 | Research — "Addvance usability session" (4 task scenarios: Import job post, View resume, View network, View social activity; 14-participant open-lab moderated testing, MAC/PC, no timeboxing, randomized 1:1) | addvanced | Y |
| 40 | Research — "Addvance usability report" (Import SEO Manager Job Post: 50.0% direct success, 0.0% mission unfinished, 14 total testers, 1.3% misclick rate) | addvanced | Y |
| 41 | Research — "Addvance usability report" heatmap (50% of testers deviated from expected path; 7 testers got lost) | addvanced | Y |
| 42 | Research — "Results" (Task #1 [Import Job Post] needed optimization; heaviest cognitive load presented first by design) | addvanced | Y |
| 43 | Research — "More Results" (Task 1: 74 score/50% success; Task 2: 82/64%; Task 3: 93/86%; Task 4: 93/86%) | addvanced | Y |
| 44 | Research — "What did we learn?" (optimize import URL flow; create a dark mode option; white-labeling option for B2B; research accessibility strategy Level AA) | addvanced | Y |
| 45 | Q&A divider | — | N |
| 46 | "What Colleagues Say" section divider — Recommendations | sitewide | N |
| 47 | Final Pitch — "What Colleagues Say" (Paul Grachen, VP/Director of Experience Design at Digitas/Leo Burnett; Donald Wu, Senior Graphic Designer at Hickory Farms, LLC) | sitewide | Y |
| 48 | "Thank You" / LinkedIn network CTA | — | N |

`grep -c '^| *[0-9]\+ *|' .planning/DECK-COVERAGE-AUDIT.md` on the table above returns 48.

---

## Part A — Rendered Claims

Columns: `Claim ID | Claim | Type | Source file:line | Verdict | Deck slide / source URL | Note`

### growit

| Claim ID | Claim | Type | Source file:line | Verdict | Deck slide / source URL | Note |
|---|---|---|---|---|---|---|
| GROWIT-01 | metrics: Active Users 240K+ | metric | lib/data/projects.ts:59 | Partial | Slide 27 | Deck's NAU range is 209K→240K ("New Active Users" after the tour update), not a static "active users" total; ending figure matches. |
| GROWIT-02 | metrics: Photo Ratings 3.4M | metric | lib/data/projects.ts:60 | Backed | Slide 27 | Deck Engagement (Photo Ratings) ends at 3.4M, up from 2.3M (+48%). |
| GROWIT-03 | metrics: Photo Uploads 350K | metric | lib/data/projects.ts:61 | Partial | Slide 27 | Deck's Photo Activity range ends at 320K (+164% from 120K), not 350K; direction/substance matches, exact figure doesn't. |
| GROWIT-04 | metrics: Cities Served 25K+ | metric | lib/data/projects.ts:62 | Unbacked | — | No city count anywhere in the deck. |
| GROWIT-05 | metrics: App Store Rating 4.8★ | metric | lib/data/projects.ts:63 | Unbacked | — | Not in deck; PROJECT.md already flags as an unverified carry-over. |
| GROWIT-06 | metrics: Community Engagement 73% | metric | lib/data/projects.ts:64 | Unbacked | — | No such figure anywhere in the deck. |
| GROWIT-07 | challenge: Building authentic gardening community from zero user base | challenge | lib/data/projects.ts:67 | Unbacked | — | Deck's GrowIt content is scoped to a self-guided-tour feature add-on to an already-live app, not a zero-to-one community build. |
| GROWIT-08 | challenge: Scaling social features for rapid geographic expansion | challenge | lib/data/projects.ts:68 | Unbacked | — | |
| GROWIT-09 | challenge: Integrating expert horticultural knowledge with user-generated content | challenge | lib/data/projects.ts:69 | Unbacked | — | |
| GROWIT-10 | challenge: Balancing novice accessibility with expert-level functionality | challenge | lib/data/projects.ts:70 | Unbacked | — | |
| GROWIT-11 | challenge: Creating sustainable engagement across seasonal gardening cycles | challenge | lib/data/projects.ts:71 | Unbacked | — | |
| GROWIT-12 | solution: Developed three-phase growth strategy prioritizing community foundation | decision | lib/data/projects.ts:74 | Not in deck (inference void) | — | Deck covers one 4-week feature pilot; it does not speak to the engagement's phase structure either way. Independent artifact support exists in-repo: `public/projects/growit/phase{1,2,3}-screen{1,2,3}.jpg` — 9 screenshots across 3 phases. |
| GROWIT-13 | solution: Built microservices architecture supporting global scaling | decision | lib/data/projects.ts:75 | Unbacked | — | |
| GROWIT-14 | solution: Established Ball Horticultural partnership for expert content validation | decision | lib/data/projects.ts:76 | Unbacked | — | "Ball Horticultural" never appears in the deck. |
| GROWIT-15 | solution: Implemented ML-powered plant recognition with community verification | decision | lib/data/projects.ts:77 | Unbacked | — | |
| GROWIT-16 | solution: Created geolocation-based discovery for regional gardening relevance | decision | lib/data/projects.ts:78 | Unbacked | — | |
| GROWIT-17 | learning: Community-first approach essential for social platform success | learning | lib/data/projects.ts:81 | Unbacked | — | |
| GROWIT-18 | learning: Strategic partnerships amplify credibility and content quality | learning | lib/data/projects.ts:82 | Unbacked | — | |
| GROWIT-19 | learning: Seasonal user behavior requires adaptive engagement strategies | learning | lib/data/projects.ts:83 | Unbacked | — | |
| GROWIT-20 | learning: Geographic relevance crucial for gardening content effectiveness | learning | lib/data/projects.ts:84 | Unbacked | — | |
| GROWIT-21 | learning: Expert validation builds trust in user-generated plant identification | learning | lib/data/projects.ts:85 | Unbacked | — | |
| GROWIT-22 | role: "Product Designer & Frontend Lead" | attribution | lib/data/projects.ts:88 | Partial | Slide 12 | Deck lists Randy's role as "Lead Product Designer" (deliverables: features vision, evaluative UX research, user flow, interaction design, hi-fi prototyping) and separately "UX Designer/Researcher (Me)" on the team roster; deck never names a "Frontend Lead" function — a separate "Software Engineer (iOS + Android)" teammate is listed. |
| GROWIT-23 | teamSize: 8 | attribution | lib/data/projects.ts:87 | Not in deck (inference void) | — | Deck's "Who I worked with" lists 4 collaborators — that is the roster of the **4-week tour pilot** (Slide 12), not of the 30-month engagement. Reading it as a ceiling on total team size was a scope-inference error. No conflict. |
| GROWIT-24 | timeline: "Q1 2014 - Q2 2016" | outcome | lib/data/projects.ts:45 | Confirmed by Randy | — | **Corrected 2026-08-15**: was "Q1 2014 - Q4 2016" (36 months), which contradicted `timelineDuration: "30 months"` on the same project. Randy confirmed 30 months is correct; end quarter changed Q4→Q2. The earlier "Unbacked" verdict rested on reading the deck's "4-weeks (pilot)" (Slide 12) as refuting a multi-year engagement — a scope-inference error, now void: the deck documents one feature pilot nested inside the engagement, not the engagement. |
| GROWIT-25 | status: "completed" | outcome | lib/data/projects.ts:46 | Partial | Slide 26 | Deck's Validation & Results slide states the prototype "tested exceptionally well," implying a finished pilot; it does not independently confirm a multi-year completed engagement matching the site's 2014-2016 dates. |
| GROWIT-26 | processStory.methodology: "beta community of 500+ gardening enthusiasts" | metric | lib/data/projects.ts:145 | Unbacked | — | |
| GROWIT-27 | processStory.methodology: "94% plant identification accuracy" (ML models) | metric | lib/data/projects.ts:145 | Unbacked | — | |
| GROWIT-28 | processStory.keyInsights[0]: Community-First Development | rationale | lib/data/projects.ts:147 | Unbacked | — | |
| GROWIT-29 | processStory.keyInsights[1]: Strategic Partnership Impact (Ball Horticultural) | rationale | lib/data/projects.ts:148 | Unbacked | — | |
| GROWIT-30 | processStory.keyInsights[2]: Geographic Relevance Essential | rationale | lib/data/projects.ts:149 | Unbacked | — | |
| GROWIT-31 | processStory.keyInsights[3]: Seasonal Engagement Patterns | rationale | lib/data/projects.ts:150 | Unbacked | — | |
| GROWIT-32 | processStory.outcome: "expert-validated content for 15,000+ plant varieties" | outcome | lib/data/projects.ts:153 | Unbacked | — | |
| GROWIT-33 | processStory.outcome: "87% improved gardening success rates among novice users" (user survey) | outcome | lib/data/projects.ts:153 | Unbacked | — | |
| GROWIT-34 | constraints.environmental (3 entries: seasonal patterns, climate variation, regional expertise) | rationale | lib/data/projects.ts:122-126 | Unbacked | — | Deck's actual GrowIt constraints (Slide 20) are Chicago climate/weather — unrelated content. |
| GROWIT-35 | constraints.technical (4 entries: real-time photo processing, geolocation precision, scalable social features, Ball integration) | rationale | lib/data/projects.ts:127-132 | Unbacked | — | Deck's actual technical constraints (Slide 20) are iBeacon signal strength and physical/body signal blocking — unrelated content. |
| GROWIT-36 | constraints.location (3 entries: global 25K+ cities, climate-specific care, regional expert network) | rationale | lib/data/projects.ts:133-137 | Unbacked | — | Deck's actual location constraints (Slide 20) are iBeacon mounting (trees/lampposts), radio frequencies, and null-state UX for dropped connections — unrelated content. |

`processStory.reflection` (lib/data/projects.ts:154-155) contains no claim beyond what GROWIT-12/28-31 already cover; no additional row.

### ohplays

Deck has **zero** coverage of Oh!Plays — the Agenda (Slide 2) names only GrowIt and Addvance as
case studies, and no other slide in the 48-page deck mentions Oh!Plays, Eight Bit Studios'
sports-video product, or student-athlete testing. Every row below is Unbacked for the same
reason; the Note column is not repeated per row.

| Claim ID | Claim | Type | Source file:line | Verdict | Deck slide / source URL | Note |
|---|---|---|---|---|---|---|
| OHPLAYS-01 | metric: User Testing Success Rate 93% | metric | lib/data/projects.ts:204-207 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-02 | metric: User Onboarding Completion 89.7% | metric | lib/data/projects.ts:208-212 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-03 | metric: Student Recommendation Rate 87% | metric | lib/data/projects.ts:213-217 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-04 | metric: Feature Discovery Rate 76.4% | metric | lib/data/projects.ts:218-222 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-05 | metric: Video Quality Satisfaction 4.7★ | metric | lib/data/projects.ts:223-227 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-06 | metric: Video Export Success Rate 97.8% | metric | lib/data/projects.ts:230-234 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-07 | metric: Video Processing Speed 2.1x faster | metric | lib/data/projects.ts:235-239 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-08 | metric: Cross-Platform Compatibility 94.5% | metric | lib/data/projects.ts:240-244 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-09 | metric: Crash-Free Sessions 99.3% | metric | lib/data/projects.ts:245-249 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-10 | metric: Time to First Video 47 sec | metric | lib/data/projects.ts:250-254 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-11 | metric: Weekly Active Users 15K+ | metric | lib/data/projects.ts:257 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-12 | metric: Daily Active Users 8.2K | metric | lib/data/projects.ts:258 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-13 | metric: Average Session Duration 12.3 min | metric | lib/data/projects.ts:259-263 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-14 | metric: User Retention (7-day) 68.9% | metric | lib/data/projects.ts:264-268 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-15 | metric: Highlight Reels Created 50K+ | metric | lib/data/projects.ts:269-273 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-16 | metric: Social Share Success Rate 91.2% | metric | lib/data/projects.ts:276-280 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-17 | metric: Editing Time Reduction 67% | metric | lib/data/projects.ts:281-285 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-18 | metric: App Store Rating 4.6★ | metric | lib/data/projects.ts:286-290 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-19 | challenge: Simplifying complex video editing for mobile-first experience | challenge | lib/data/projects.ts:293 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-20 | challenge: Balancing feature richness with intuitive student athlete workflow | challenge | lib/data/projects.ts:294 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-21 | challenge: Optimizing video processing performance across iOS/Android | challenge | lib/data/projects.ts:295 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-22 | challenge: Creating engaging social features enhancing rather than distracting | challenge | lib/data/projects.ts:296 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-23 | challenge: Validating usability with real student athletes in authentic environments | challenge | lib/data/projects.ts:297 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-24 | solution: Gesture-based editing interface for mobile touchscreens | decision | lib/data/projects.ts:300 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-25 | solution: Preset sports-specific filters and transitions | decision | lib/data/projects.ts:301 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-26 | solution: Cloud-based video processing for cross-device performance | decision | lib/data/projects.ts:302 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-27 | solution: Social sharing integration (Instagram, Twitter, Facebook) | decision | lib/data/projects.ts:303 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-28 | solution: User testing with 15 high school students in school settings | decision | lib/data/projects.ts:304 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-29 | learning: Student athletes prioritize speed/simplicity over advanced features | learning | lib/data/projects.ts:307 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-30 | learning: Real-world testing reveals usability issues missed in lab settings | learning | lib/data/projects.ts:308 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-31 | learning: Sports content requires specialized editing tools | learning | lib/data/projects.ts:309 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-32 | learning: Social validation crucial for student athlete engagement | learning | lib/data/projects.ts:310 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-33 | learning: Cross-platform consistency essential for team sharing | learning | lib/data/projects.ts:311 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-34 | role: "UX Designer & Mobile Product Lead" | attribution | lib/data/projects.ts:314 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-35 | teamSize: 6 | attribution | lib/data/projects.ts:313 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-36 | timeline: "Q2 2017 - Q4 2017" | outcome | lib/data/projects.ts:189 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-37 | status: "completed" | outcome | lib/data/projects.ts:190 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-38 | processStory.keyInsights[0]: Speed Over Complexity (<3 min highlight reel) | rationale | lib/data/projects.ts:370 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-39 | processStory.keyInsights[1]: Social Validation Essential | rationale | lib/data/projects.ts:371 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-40 | processStory.keyInsights[2]: Environment-Specific Challenges | rationale | lib/data/projects.ts:372 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-41 | processStory.keyInsights[3]: Cross-Platform Expectations | rationale | lib/data/projects.ts:373 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |
| OHPLAYS-42 | processStory.outcome: "78% of content shared across social media platforms" | outcome | lib/data/projects.ts:376 | Unbacked | — | Deck's Agenda (Slide 2) scopes case studies to GrowIt and Addvance only; Oh!Plays never appears in the 48-page deck. |

All 42 rows above: **Unbacked** — Deck slide / source URL: **—**.

### ledgeriq

Deck has **zero** coverage of LedgerIQ — no slide in the 48-page deck mentions LedgerIQ, payroll
fraud detection, or anomaly-detection AI. See the dedicated CONTRADICTION block below for the
D-03 hard entry, which applies independently of this table.

| Claim ID | Claim | Type | Source file:line | Verdict | Deck slide / source URL | Note |
|---|---|---|---|---|---|---|
| LEDGERIQ-01 | metric: Payroll Error Reduction 78% | metric | lib/data/projects.ts:428 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-02 | metric: Annual Cost Savings $180K | metric | lib/data/projects.ts:429 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-03 | metric: Anomaly Detection Rate 92% | metric | lib/data/projects.ts:430 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-04 | metric: Time Savings Per Cycle 65% | metric | lib/data/projects.ts:431 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-05 | metric: False Positive Rate <10% | metric | lib/data/projects.ts:432 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-06 | metric: ROI Achievement 6 months | metric | lib/data/projects.ts:433 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-07 | challenge: 10 hours manual audit work per pay cycle | challenge | lib/data/projects.ts:436 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-08 | challenge: Persistent small errors slipping through rule-based systems | challenge | lib/data/projects.ts:437 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-09 | challenge: Growing fraud risk exposure with manual oversight | challenge | lib/data/projects.ts:438 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-10 | challenge: Reactive problem-solving damaging employee trust | challenge | lib/data/projects.ts:439 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-11 | challenge: Legacy payroll systems with complex integration requirements | challenge | lib/data/projects.ts:440 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-12 | challenge: Balancing fraud detection accuracy with false-positive minimization | challenge | lib/data/projects.ts:441 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-13 | solution: Hybrid AI models (isolation forests + neural networks) | decision | lib/data/projects.ts:444 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-14 | solution: Real-time data pipeline for immediate anomaly detection | decision | lib/data/projects.ts:445 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-15 | solution: Context-aware intelligence understanding payroll patterns | decision | lib/data/projects.ts:446 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-16 | solution: Iterative feedback loops for continuous model improvement | decision | lib/data/projects.ts:447 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-17 | solution: Intuitive dashboard for actionable insights | decision | lib/data/projects.ts:448 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-18 | solution: Microservice architecture for scalable enterprise deployment | decision | lib/data/projects.ts:449 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-19 | learning: Human-centered AI amplifies rather than replaces human judgment | learning | lib/data/projects.ts:452 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-20 | learning: Context-aware ML crucial for minimizing false positives | learning | lib/data/projects.ts:453 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-21 | learning: Real-time processing must balance system performance | learning | lib/data/projects.ts:454 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-22 | learning: Continuous feedback loops essential for user trust | learning | lib/data/projects.ts:455 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-23 | learning: Enterprise AI requires modular white-label architecture | learning | lib/data/projects.ts:456 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-24 | role: "AI Product Lead & Technical Architect" | attribution | lib/data/projects.ts:459 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-25 | teamSize: 8 | attribution | lib/data/projects.ts:458 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-26 | timeline: "Q1 2023 - Q3 2023" | outcome | lib/data/projects.ts:412 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-27 | status: "completed" | outcome | lib/data/projects.ts:413 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-28 | processStory.keyInsights[0]: Human-Centered AI | rationale | lib/data/projects.ts:511 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-29 | processStory.keyInsights[1]: Context-Aware Intelligence | rationale | lib/data/projects.ts:512 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-30 | processStory.keyInsights[2]: Iterative Feedback Loops | rationale | lib/data/projects.ts:513 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-31 | processStory.keyInsights[3]: Real-Time + Batch Hybrid | rationale | lib/data/projects.ts:514 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-32 | processStory.outcome: "$50,000 in prevented fraud losses" | outcome | lib/data/projects.ts:517 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-33 | processStory.outcome: "zero compliance penalties post-implementation" | outcome | lib/data/projects.ts:517 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-34 | processStory.outcome: "15% increase in employee payroll satisfaction" | outcome | lib/data/projects.ts:517 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |
| LEDGERIQ-35 | processStory.outcome: "90%+ precision with minimal false positives" | outcome | lib/data/projects.ts:517 | Unbacked | — | No slide in the 48-page deck mentions LedgerIQ, payroll fraud detection, or anomaly-detection AI. |

All 35 rows above: **Unbacked** — Deck slide / source URL: **—**.

#### CONTRADICTION — unresolved, blocks Phase 8 LedgerIQ copy

Per D-03, the two LedgerIQ sources in this codebase state contradictory metrics for the same
project. Reproduced here verbatim from CONTEXT.md, with every surviving figure verdicted:

| Metric | Bespoke `/ledgeriq` (deleted in 05-02) | Data-driven `/projects/ledgeriq` (live) | Verdict (both sides) |
|---|---|---|---|
| Cost savings | $2.3M annual cost savings | $180K annual savings | **Unbacked** — the deck contains no LedgerIQ content at all; neither figure appears anywhere in the 48 pages. |
| Productivity/error | 40% productivity increase | 78% payroll error reduction | **Unbacked** — same reason. |
| Processing/time | 60% processing-time reduction | 65% time savings per cycle | **Unbacked** — same reason. |
| Satisfaction/detection | 85% user satisfaction | 92% anomaly detection rate | **Unbacked** — same reason. |

This compounds the pre-existing STATE.md blocker that LedgerIQ's real-vs-composite status is
ambiguous. **Randy must resolve both** — which figure set (if either) is real, and whether
LedgerIQ is a genuine client engagement or a composite/spec project — before Phase 8 writes any
LedgerIQ copy. See Part C `### ledgeriq` question #1 below.

### addvanced

Addvance is the **second** deck-covered project (Slides 30-44). Unlike GrowIt, the site's
`lib/data/projects.ts` numeric claims for Addvance are almost entirely **absent** from the deck
— the deck's actual usability numbers (50/64/86/86% success rates, 74/82/93/93 usability
scores, 14 participants) never match a single one of the 15 metrics on the live data-model page.
By contrast, the **bespoke** `addvanced-client.tsx` render surface independently reproduces
several of the deck's real numbers almost exactly. This is a significant, systemic
discrepancy — flagged prominently here and carried into Part C as an open question — though it
does not meet D-03's bar for a formal CONTRADICTION block (that mechanism is reserved for
LedgerIQ's two-source clash).

**lib/data/projects.ts fields:**

| Claim ID | Claim | Type | Source file:line | Verdict | Deck slide / source URL | Note |
|---|---|---|---|---|---|---|
| ADDVANCED-01 | metrics: Prototype Approval Rate 94% | metric | lib/data/projects.ts:573-576 | Unbacked | — | Deck shows per-task success rates of 50/64/86/86%, not a single 94% approval figure. |
| ADDVANCED-02 | metrics: User Task Completion 91.7% | metric | lib/data/projects.ts:577-581 | Unbacked | — | Deck's task success rates range 50-86%, no 91.7% aggregate. |
| ADDVANCED-03 | metrics: Mobile Usability Score 4.8/5 | metric | lib/data/projects.ts:582-586 | Unbacked | — | Deck's usability scores are on a 0-100 scale (74/82/93/93), not a 5-point scale. |
| ADDVANCED-04 | metrics: Feature Discovery Rate 89.2% | metric | lib/data/projects.ts:587-591 | Unbacked | — | |
| ADDVANCED-05 | metrics: User Recommendation Rate 87% | metric | lib/data/projects.ts:592-596 | Unbacked | — | |
| ADDVANCED-06 | metrics: Mobile Load Time < 2 sec | metric | lib/data/projects.ts:599-603 | Unbacked | — | |
| ADDVANCED-07 | metrics: Cross-Platform Compatibility 98.5% | metric | lib/data/projects.ts:604-608 | Unbacked | — | |
| ADDVANCED-08 | metrics: API Integration Success 100% | metric | lib/data/projects.ts:609-613 | Unbacked | — | |
| ADDVANCED-09 | metrics: Data Sync Accuracy 99.1% | metric | lib/data/projects.ts:614-618 | Unbacked | — | |
| ADDVANCED-10 | metrics: Touch Interaction Response < 100ms | metric | lib/data/projects.ts:619-623 | Unbacked | — | |
| ADDVANCED-11 | metrics: Job Search Time Reduction 67% | metric | lib/data/projects.ts:626-630 | Unbacked | — | |
| ADDVANCED-12 | metrics: Application Organization Efficiency 73% | metric | lib/data/projects.ts:631-635 | Unbacked | — | |
| ADDVANCED-13 | metrics: Network Contact Discovery 156% increase | metric | lib/data/projects.ts:636-640 | Unbacked | — | |
| ADDVANCED-14 | metrics: Sprint Delivery Success 100% | metric | lib/data/projects.ts:641-645 | Unbacked | — | |
| ADDVANCED-15 | metrics: Stakeholder Satisfaction 4.9/5 | metric | lib/data/projects.ts:646-650 | Unbacked | — | |
| ADDVANCED-16 | challenge: Market Fragmentation (47 applications, 12+ platforms, 67% efficiency loss) | challenge | lib/data/projects.ts:653 | Unbacked | — | |
| ADDVANCED-17 | challenge: Intelligence Gap (predictive insights vs. tracking) | challenge | lib/data/projects.ts:654 | Unbacked | — | |
| ADDVANCED-18 | challenge: Network Blindness (78% roles filled through referrals) | challenge | lib/data/projects.ts:655 | Unbacked | — | |
| ADDVANCED-19 | challenge: Mobile-First Imperative (89% of job search on mobile) | challenge | lib/data/projects.ts:656 | Unbacked | — | |
| ADDVANCED-20 | challenge: Sprint Constraints (2-week timeline) | challenge | lib/data/projects.ts:657 | Partial | Slide 32 | Deck confirms the sprint timeline as "2-week Sprint (Concept)"; the added framing ("enterprise-grade UX standards") is not itself a deck claim. |
| ADDVANCED-21 | challenge: API Integration Complexity (LinkedIn, Google, Twitter) | challenge | lib/data/projects.ts:658 | Unbacked | — | Deck's Addvance sitemap (Slide 37) names only LinkedIn and Indeed for URL import — not Google or Twitter. |
| ADDVANCED-22 | challenge: Behavioral Psychology (stress reduces decision quality) | challenge | lib/data/projects.ts:659 | Unbacked | — | |
| ADDVANCED-23 | solution: Unified Intelligence Platform (12+ platforms consolidated) | decision | lib/data/projects.ts:662 | Unbacked | — | |
| ADDVANCED-24 | solution: Predictive Network Mining (156% contact discovery) | decision | lib/data/projects.ts:663 | Unbacked | — | |
| ADDVANCED-25 | solution: Progressive Mobile Architecture (sub-2s load) | decision | lib/data/projects.ts:664 | Unbacked | — | |
| ADDVANCED-26 | solution: Multi-Platform OAuth Orchestra (LinkedIn/Google/Twitter) | decision | lib/data/projects.ts:665 | Unbacked | — | Deck's sitemap (Slide 37) shows only LinkedIn/Indeed URL-paste, not an OAuth orchestration layer. |
| ADDVANCED-27 | solution: Behavioral UX Psychology (4.8/5 under pressure) | decision | lib/data/projects.ts:666 | Unbacked | — | |
| ADDVANCED-28 | solution: Sprint-Driven MVP Strategy (MoSCoW, 100% critical path) | decision | lib/data/projects.ts:667 | Unbacked | — | |
| ADDVANCED-29 | solution: Social Activity Intelligence (real-time feed aggregation) | decision | lib/data/projects.ts:668 | Partial | Slide 37 | Deck's sitemap lists "View network connections in-app" and "Track your professional networks social activity" — substance matches; the "optimal engagement timing" framing does not. |
| ADDVANCED-30 | learning: Market Leadership Through Niche Focus (89% mobile trend) | learning | lib/data/projects.ts:671 | Unbacked | — | |
| ADDVANCED-31 | learning: Network Effects Drive Adoption (156% discovery) | learning | lib/data/projects.ts:672 | Unbacked | — | |
| ADDVANCED-32 | learning: Behavioral Psychology Trumps Feature Lists (4.8/5 vs 3.2/5) | learning | lib/data/projects.ts:673 | Unbacked | — | |
| ADDVANCED-33 | learning: API Strategy as Competitive Moat (30% retention) | learning | lib/data/projects.ts:674 | Unbacked | — | |
| ADDVANCED-34 | learning: Sprint Constraints Foster Innovation (67% career-app bloat) | learning | lib/data/projects.ts:675 | Unbacked | — | |
| ADDVANCED-35 | learning: Enterprise UX Thinking in Consumer Context | learning | lib/data/projects.ts:676 | Unbacked | — | |
| ADDVANCED-36 | learning: Predictive Intelligence Over Reactive Tracking (3x value) | learning | lib/data/projects.ts:677 | Unbacked | — | None of the deck's real four "What did we learn?" points (Slide 44 — optimize import URL, dark mode, white-labeling, accessibility Level AA) appear anywhere in this array. See Part B. |
| ADDVANCED-37 | role: "Product Design Director & Strategic UX Lead" | attribution | lib/data/projects.ts:680 | Partial | Slide 33 | Deck names the role "Lead UX Designer"; the "Director" title and "Strategic" framing are not backed. |
| ADDVANCED-38 | teamSize: 3 | attribution | lib/data/projects.ts:679 | Partial | Slide 33 | Deck's "Who I worked with" lists 3 collaborators (Frontend Developer, Creative Director, PM) besides Randy; site's `teamMembers` array lists 3 total *including* "(Me)" — a minor internal inconsistency in how "Me" is counted, not a fabrication. |
| ADDVANCED-39 | timeline: "2-week sprint (Alight Case Study)" | outcome | lib/data/projects.ts:558 | Backed | Slide 32-33 | Deck: "Associate Director of UX for Alight's Innovation Lab at 1871 in Chicago, IL" and "Timeline: 2-week Sprint (Concept)." |
| ADDVANCED-40 | status: "completed" | outcome | lib/data/projects.ts:559 | Partial | Slide 42 | Deck confirms the sprint/testing cycle concluded with results ("Results" slide); does not confirm the concept shipped as a product. |
| ADDVANCED-41 | processStory.background: "$4.2B career services market" | metric | lib/data/projects.ts:722 | Unbacked | — | Market-sizing figure not in deck. |
| ADDVANCED-42 | processStory.methodology: "Maze unmoderated testing (n=127 users) and in-person moderated sessions (n=15 users)" | metric | lib/data/projects.ts:726 | Unbacked | — | Deck states one 14-participant open-lab moderated study (Slide 39) — not a 127+15 split; this inflates the real participant count roughly 10×. |
| ADDVANCED-43 | processStory.methodology: "43% decision-quality reduction under job-search stress" | metric | lib/data/projects.ts:726 | Unbacked | — | |
| ADDVANCED-44 | processStory.methodology: "23 reusable mobile components" | metric | lib/data/projects.ts:726 | Unbacked | — | |
| ADDVANCED-45 | processStory.keyInsights[0]: Blue Ocean Strategy Validation (3x engagement, zero competitors) | rationale | lib/data/projects.ts:728 | Unbacked | — | |
| ADDVANCED-46 | processStory.keyInsights[1]: Behavioral Psychology as UX Differentiator (43% reduction) | rationale | lib/data/projects.ts:729 | Unbacked | — | |
| ADDVANCED-47 | processStory.keyInsights[2]: Network Effects as Growth Engine (156%, 67% referrals) | rationale | lib/data/projects.ts:730 | Unbacked | — | |
| ADDVANCED-48 | processStory.keyInsights[3]: API Integration as Competitive Moat (18-month lead) | rationale | lib/data/projects.ts:731 | Unbacked | — | |
| ADDVANCED-49 | constraints.technical (4 entries: mobile-first responsive, social API complexity, real-time aggregation, cross-platform) | rationale | lib/data/projects.ts:707-712 | Unbacked | — | |
| ADDVANCED-50 | constraints.environmental (4 entries: competitive job market, privacy, workflow integration, varying user proficiency) | rationale | lib/data/projects.ts:713-718 | Unbacked | — | |

**`app/projects/addvanced/addvanced-client.tsx` bespoke render surface** (introduces claims not
in `lib/data/projects.ts`, or independently re-derives deck-accurate figures):

| Claim ID | Claim | Type | Source file:line | Verdict | Deck slide / source URL | Note |
|---|---|---|---|---|---|---|
| ADDVANCED-51 | "35% Job Placement Success" / "Job Placement Improvement" | metric | app/projects/addvanced/addvanced-client.tsx:188, 863, 1261 | Unbacked | — | New figure, appears nowhere in `projects.ts` or the deck. |
| ADDVANCED-52 | "800% higher success rate for optimized paths" / "800% success rate improvement" | metric | app/projects/addvanced/addvanced-client.tsx:800, 834, 1277 | Unbacked | — | Deck's maximum task success rate is 86%; no 800%-class multiplier appears anywhere in the deck. |
| ADDVANCED-53 | "60% mission unfinished rate for problematic flows" | metric | app/projects/addvanced/addvanced-client.tsx:781 | Unbacked | — | Deck's own usability-report screenshot (Slide 40) shows "0.0% Mission unfinished" for the tested flow — this directly contradicts the deck's own captured data, not merely lacking support. |
| ADDVANCED-54 | "B2C Market" — validated beyond enterprise focus | rationale | app/projects/addvanced/addvanced-client.tsx:876-879 | Unbacked | — | |
| ADDVANCED-55 | "White-Label" — foundation for B2B product offerings, achieved | outcome | app/projects/addvanced/addvanced-client.tsx:888-892 | Partial | Slide 44 | Deck's real "What did we learn?" slide lists "White-labeling option for B2B Opportunities" as a forward-looking idea/next step, not an accomplished foundation — the site overstates deck substance as a completed outcome. |
| ADDVANCED-56 | "Accessibility Standards" — "Set Level AA compliance standards" | outcome | app/projects/addvanced/addvanced-client.tsx:923-926 | Partial | Slide 44 | Deck literally says "Research accessibility strategy (Level AA)" — a research to-do, not a standard already set. |
| ADDVANCED-57 | 14 Participants, open-lab moderated usability testing | metric | app/projects/addvanced/addvanced-client.tsx:629-633 | Backed | Slide 39 | Exact match. |
| ADDVANCED-58 | 4 Task Scenarios via Maze | metric | app/projects/addvanced/addvanced-client.tsx:639-643 | Backed | Slide 39 | Exact match. |
| ADDVANCED-59 | Cross-Platform: "MAC/PC devices, virtual desktop/laptop sessions" | metric | app/projects/addvanced/addvanced-client.tsx:648-654 | Backed | Slide 39 | Deck: "Virtual on Desktop/Laptop." |
| ADDVANCED-60 | "No Time Limits" — natural user behavior encouraged | metric | app/projects/addvanced/addvanced-client.tsx:656-664 | Backed | Slide 39 | Deck: "No timeboxing." |
| ADDVANCED-61 | Task Performance Results table (Import Job Post 50%/74; View Resume 64%/82; View Network 86%/93; View Social Activity 86%/93) | metric | app/projects/addvanced/addvanced-client.tsx:675-699 | Backed | Slides 40, 43 | Exact match to deck's "More Results" slide. |
| ADDVANCED-62 | "7 testers became completely lost during Task #1" | metric | app/projects/addvanced/addvanced-client.tsx:775-777 | Backed | Slide 41 | Deck: "7 testers got lost." |
| ADDVANCED-63 | "50% of testers deviated from expected path for Job Import" | metric | app/projects/addvanced/addvanced-client.tsx:768-771 | Backed | Slide 41 | Exact match. |
| ADDVANCED-64 | Fitts Law Implementation whiteboard section | decision | app/projects/addvanced/addvanced-client.tsx:584-608 | Backed | Slide 35 | Deck: "Utilization of Fitts Law." |
| ADDVANCED-65 | Competitive analysis (Trello indirect, Huntr CRM direct, Apple Notes aspirational) | rationale | app/projects/addvanced/addvanced-client.tsx:411-449 | Backed | Slide 34 | Exact match to deck's competitive table. |
| ADDVANCED-66 | Innovation Lab context: "1871, Chicago, IL," lean-startup methodology, "fast movers, collect data, synthesize, and take action" | rationale | app/projects/addvanced/addvanced-client.tsx:993-1023 | Backed | Slide 32 | Near-verbatim quote match. |
| ADDVANCED-67 | Tools: InVision, Miro, Maze, Whiteboard/Sharpie | rationale | app/projects/addvanced/addvanced-client.tsx:1058-1231 | Backed | Slide 33 | Exact match to "Tools Used." |
| ADDVANCED-68 | Design Goals: Reachability, Heuristic Compliance, Direct Navigation, Purposeful Tasks | decision | app/projects/addvanced/addvanced-client.tsx:517-559 | Partial | Slide 35 | Deck's goals are "Reachability, Heuristics, Direct" plus "Make all tasks purposeful" — concepts map closely; exact naming ("Heuristic Compliance," "Direct Navigation") is a paraphrase. |
| ADDVANCED-69 | Stakeholder Feedback quotes section (renders `processStory.stakeholderQuotes`) | quote | app/projects/addvanced/addvanced-client.tsx:947-969 | Unbacked | — | `lib/data/projects.ts`'s `addvanced` entry defines no `stakeholderQuotes`; this section renders an empty array on the live site — not a false claim, but a stub with no content to verdict. Not itself a Phase 5 code fix (out of scope); flagged for Phase 6/8 awareness. |

`processStory.reflection` (lib/data/projects.ts:736) restates ADDVANCED-45/48 with no new claim; no additional row.

### echo

Deck has **zero** coverage of EchoDrive — no slide mentions Echo Global Logistics, ELD
compliance, or trucking/logistics of any kind.

| Claim ID | Claim | Type | Source file:line | Verdict | Deck slide / source URL | Note |
|---|---|---|---|---|---|---|
| ECHO-01 | metric: Active Drivers 10,000+ | metric | lib/data/projects.ts:787 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-02 | metric: LTL Revenue Increase 16% | metric | lib/data/projects.ts:788 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-03 | metric: Shipment Volume Growth 12% | metric | lib/data/projects.ts:789 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-04 | metric: Beta Downloads 1,000+ | metric | lib/data/projects.ts:790 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-05 | metric: Call Center Stress Reduction "Significant" | metric | lib/data/projects.ts:791 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-06 | metric: ELD Compliance 100% | metric | lib/data/projects.ts:792 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-07 | challenge: Outdated coordination methods between shippers/drivers/dispatch | challenge | lib/data/projects.ts:795 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-08 | challenge: ELD Mandate compliance need | challenge | lib/data/projects.ts:796 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-09 | challenge: Limited truckload visibility stressing call centers | challenge | lib/data/projects.ts:797 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-10 | challenge: Underperforming LTL revenues requiring self-serve booking | challenge | lib/data/projects.ts:798 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-11 | challenge: Low driver engagement/adoption of digital solutions | challenge | lib/data/projects.ts:799 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-12 | challenge: Complex driver/dispatch/customer communication workflows | challenge | lib/data/projects.ts:800 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-13 | solution: On-site interviews with drivers and dispatch officers | decision | lib/data/projects.ts:803 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-14 | solution: Dual-platform (native mobile + web dispatch) architecture | decision | lib/data/projects.ts:804 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-15 | solution: Onboarding tutorials + communication platform | decision | lib/data/projects.ts:805 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-16 | solution: Electronic logging for ELD compliance | decision | lib/data/projects.ts:806 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-17 | solution: Invoice/payment tracking functionality | decision | lib/data/projects.ts:807 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-18 | solution: Driver-focused mobile UX for varied working conditions | decision | lib/data/projects.ts:808 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-19 | learning: Field research critical for real-world workflows | learning | lib/data/projects.ts:811 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-20 | learning: Cross-platform consistency ensures seamless UX transitions | learning | lib/data/projects.ts:812 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-21 | learning: Stakeholder engagement ensures business/user fit | learning | lib/data/projects.ts:813 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-22 | learning: Scalability planning enables beta-to-thousands growth | learning | lib/data/projects.ts:814 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-23 | learning: Industry-specific logistics domain expertise essential | learning | lib/data/projects.ts:815 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-24 | learning: Driver feedback integration improves adoption | learning | lib/data/projects.ts:816 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-25 | role: "Product Designer & Frontend Lead" | attribution | lib/data/projects.ts:819 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-26 | teamSize: 6 | attribution | lib/data/projects.ts:818 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-27 | timeline: "Alpha → Beta → Launch" | outcome | lib/data/projects.ts:771 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-28 | status: "completed" | outcome | lib/data/projects.ts:772 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-29 | processStory.keyInsights[0]: Field Research Critical | rationale | lib/data/projects.ts:874 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-30 | processStory.keyInsights[1]: ELD Compliance as Innovation Driver | rationale | lib/data/projects.ts:875 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-31 | processStory.keyInsights[2]: Driver Experience Design Challenges | rationale | lib/data/projects.ts:876 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-32 | processStory.keyInsights[3]: Cross-Platform Integration Essential | rationale | lib/data/projects.ts:877 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-33 | processStory.keyInsights[4]: Industry-Specific Workflows Matter | rationale | lib/data/projects.ts:878 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-34 | processStory.outcome: "16% increase in LTL shipment revenues to $184.4 million" | outcome | lib/data/projects.ts:881 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. |
| ECHO-35 | quote: Operations Director, Echo Global Logistics — "16% revenue increase..." | quote | lib/data/projects.ts:886-889 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. This quote is attributed only to a generic title with no named individual — a lesser version of the v1.0 fabricated-testimonial pattern (PROJECT.md); still Unbacked regardless of naming style, since no deck or external source confirms EchoDrive exists as a real engagement at all. |
| ECHO-36 | quote: Fleet Manager, Echo Global Logistics — "10,000+ active adoption..." | quote | lib/data/projects.ts:892-895 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. This quote is attributed only to a generic title with no named individual — a lesser version of the v1.0 fabricated-testimonial pattern (PROJECT.md); still Unbacked regardless of naming style, since no deck or external source confirms EchoDrive exists as a real engagement at all. |
| ECHO-37 | quote: Dispatch Team Lead, Echo Global Logistics — "field research approach..." | quote | lib/data/projects.ts:898-901 | Unbacked | — | No slide in the 48-page deck mentions Echo Global Logistics, ELD compliance, or trucking/logistics. This quote is attributed only to a generic title with no named individual — a lesser version of the v1.0 fabricated-testimonial pattern (PROJECT.md); still Unbacked regardless of naming style, since no deck or external source confirms EchoDrive exists as a real engagement at all. |

All 37 rows above: **Unbacked** — Deck slide / source URL: **—**. Note (applies to
ECHO-35/36/37): these quotes are attributed only to generic titles ("Operations Director,"
"Fleet Manager," "Dispatch Team Lead") with no named individual — this is a lesser version of the
v1.0 fabricated-testimonial pattern (PROJECT.md) and is Unbacked regardless of naming style,
since no deck or external source confirms EchoDrive exists as a real engagement at all.

### nagarro

Deck has **zero** coverage of the Nagarro design-leadership role — no slide mentions Nagarro, IT
consulting, or an 18,000-person design organization.

| Claim ID | Claim | Type | Source file:line | Verdict | Deck slide / source URL | Note |
|---|---|---|---|---|---|---|
| NAGARRO-01 | metric: Nagarrians Impacted 18,000+ | metric | lib/data/projects.ts:956 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-02 | metric: Brand Recognition Growth 50% | metric | lib/data/projects.ts:957 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-03 | metric: Design Event Leads Generated 100+ | metric | lib/data/projects.ts:958 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-04 | metric: Content Subscribers Reached 10K+ | metric | lib/data/projects.ts:959 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-05 | metric: Junior Designer Retention +40% | metric | lib/data/projects.ts:960 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-06 | metric: Website Traffic Improvement +40% | metric | lib/data/projects.ts:961 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-07 | metric: Lead Generation Increase +25% | metric | lib/data/projects.ts:962 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-08 | metric: Global Design Team Growth 15+ | metric | lib/data/projects.ts:963 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-09 | challenge: Scaling design leadership across 18,000+ employees/36 countries | challenge | lib/data/projects.ts:966 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-10 | challenge: Building unified design culture in growing organization | challenge | lib/data/projects.ts:967 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-11 | challenge: Establishing enterprise-wide accessibility compliance | challenge | lib/data/projects.ts:968 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-12 | challenge: Creating inclusive design frameworks for cultural contexts | challenge | lib/data/projects.ts:969 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-13 | challenge: Balancing design innovation with IT consulting requirements | challenge | lib/data/projects.ts:970 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-14 | challenge: Design evangelism during competitive market expansion | challenge | lib/data/projects.ts:971 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-15 | solution: Digital Accessibility Strategy 2023 | decision | lib/data/projects.ts:974 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-16 | solution: Inclusive design framework for multi-cultural teams | decision | lib/data/projects.ts:975 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-17 | solution: Design evangelism strategy (50% brand recognition) | decision | lib/data/projects.ts:976 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-18 | solution: Mentor-coaching program (+40% retention) | decision | lib/data/projects.ts:977 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-19 | solution: Content strategy (10K+ subscribers, 100+ leads) | decision | lib/data/projects.ts:978 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-20 | solution: Healthcare tech partnerships (ADT Health) | decision | lib/data/projects.ts:979 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-21 | learning: Enterprise leadership balances innovation with scalability | learning | lib/data/projects.ts:982 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-22 | learning: Accessibility-first drives compliance + competitive advantage | learning | lib/data/projects.ts:983 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-23 | learning: Inclusive design frameworks more critical at global scale | learning | lib/data/projects.ts:984 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-24 | learning: Content strategy directly impacts business development | learning | lib/data/projects.ts:985 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-25 | learning: Designer retention foundational to design maturity | learning | lib/data/projects.ts:986 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-26 | learning: Cross-industry partnerships accelerate accessibility innovation | learning | lib/data/projects.ts:987 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-27 | role: "Head of Design" | attribution | lib/data/projects.ts:990 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-28 | teamSize: 15 | attribution | lib/data/projects.ts:989 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-29 | timeline: "Mar 2022 - Oct 2022" | outcome | lib/data/projects.ts:942 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-30 | status: "completed" | outcome | lib/data/projects.ts:943 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-31 | processStory.keyInsights[0]: Design Evangelism Over Enforcement (3x adoption) | rationale | lib/data/projects.ts:1051 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-32 | processStory.keyInsights[1]: Accessibility as Competitive Advantage | rationale | lib/data/projects.ts:1052 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-33 | processStory.keyInsights[2]: Global Team Development ROI | rationale | lib/data/projects.ts:1053 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-34 | processStory.keyInsights[3]: Content Strategy Business Impact | rationale | lib/data/projects.ts:1054 | Unbacked | — | No slide in the 48-page deck mentions Nagarro, IT consulting, or an 18,000-person design organization. |
| NAGARRO-35 | app/projects/nagarro/nagarro-client.tsx: "$50M+ in business impact" | metric | app/projects/nagarro/nagarro-client.tsx:575 | Unbacked | — | New figure not present in `lib/data/projects.ts`'s nagarro entry; coincidentally echoes the sitewide "$50M in product value" stat (SITE-03) but is a distinct, separately-fabricated claim scoped to Nagarro. |

Rows NAGARRO-01 through NAGARRO-34: **Unbacked** — Deck slide / source URL: **—**.

### rambis-ui

Deck has **zero** coverage of Rambis UI — no slide mentions a design system, component library,
or a Chakra UI fork.

| Claim ID | Claim | Type | Source file:line | Verdict | Deck slide / source URL | Note |
|---|---|---|---|---|---|---|
| RAMBIS-01 | metric: Components 50+ | metric | lib/data/projects.ts:1116 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-02 | metric: Weekly Downloads 2.5K+ | metric | lib/data/projects.ts:1117 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-03 | metric: GitHub Stars 150+ | metric | lib/data/projects.ts:1118 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-04 | metric: Contributors 12 | metric | lib/data/projects.ts:1119 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-05 | metric: Test Coverage 94% | metric | lib/data/projects.ts:1120 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-06 | metric: Accessibility Score 100% | metric | lib/data/projects.ts:1121 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-07 | challenge: Maintaining backward compatibility with breaking improvements | challenge | lib/data/projects.ts:1124 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-08 | challenge: Balancing flexibility with opinionated design decisions | challenge | lib/data/projects.ts:1125 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-09 | challenge: Optimizing bundle size without sacrificing functionality | challenge | lib/data/projects.ts:1126 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-10 | challenge: Comprehensive documentation for complex APIs | challenge | lib/data/projects.ts:1127 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-11 | challenge: Consistent behavior across React versions | challenge | lib/data/projects.ts:1128 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-12 | challenge: Building sustainable open-source community | challenge | lib/data/projects.ts:1129 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-13 | solution: Semantic versioning + migration guides | decision | lib/data/projects.ts:1132 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-14 | solution: Composable primitives (flexibility + convenience) | decision | lib/data/projects.ts:1133 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-15 | solution: Tree-shaking optimizations (40% bundle reduction) | decision | lib/data/projects.ts:1134 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-16 | solution: Interactive documentation with live playground | decision | lib/data/projects.ts:1135 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-17 | solution: Testing matrix for React 16/17/18 | decision | lib/data/projects.ts:1136 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-18 | solution: Contributor guidelines + automated PR review | decision | lib/data/projects.ts:1137 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-19 | learning: Adoption requires balancing innovation with familiarity | learning | lib/data/projects.ts:1140 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-20 | learning: Performance must be measured against real-world usage | learning | lib/data/projects.ts:1141 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-21 | learning: Documentation quality correlates with adoption | learning | lib/data/projects.ts:1142 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-22 | learning: Accessibility must be built-in, not bolted-on | learning | lib/data/projects.ts:1143 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-23 | learning: Open source success depends on maintainer engagement | learning | lib/data/projects.ts:1144 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-24 | learning: APIs should prioritize intuition over flexibility | learning | lib/data/projects.ts:1145 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-25 | role: "Lead Design System Architect" | attribution | lib/data/projects.ts:1148 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-26 | teamSize: 4 | attribution | lib/data/projects.ts:1147 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-27 | timeline: "Q3 2024 - Present" | outcome | lib/data/projects.ts:1098 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-28 | status: "in-progress" | outcome | lib/data/projects.ts:1099 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-29 | processStory.keyInsights[0]: Developer Ergonomics Matter (+60% adoption) | rationale | lib/data/projects.ts:1205 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-30 | processStory.keyInsights[1]: Performance is a Feature | rationale | lib/data/projects.ts:1206 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-31 | processStory.keyInsights[2]: Accessibility Drives Innovation | rationale | lib/data/projects.ts:1207 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-32 | processStory.keyInsights[3]: Documentation as Code (-40% support questions) | rationale | lib/data/projects.ts:1208 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-33 | processStory.keyInsights[4]: Community-Driven Development | rationale | lib/data/projects.ts:1209 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |
| RAMBIS-34 | processStory.methodology: "80% of developers used only 20% of component props" | metric | lib/data/projects.ts:1203 | Unbacked | — | No slide in the 48-page deck mentions a design system, component library, or a Chakra UI fork. |

All 34 rows above: **Unbacked** — Deck slide / source URL: **—**.
`app/projects/rambis-ui/rambis-client.tsx` introduces no numeric claims beyond what
`lib/data/projects.ts` already states (40%, 50+, 100% all restated verbatim from the same
array); no additional rows.

### Sitewide claims

| Claim ID | Claim | Type | Source file:line | Verdict | Deck slide / source URL | Note |
|---|---|---|---|---|---|---|
| SITE-01 | "2.5M+ Users Impacted" | metric | components/core/animated-number-basic.tsx:12; app/about/about-client.tsx:31 | Unbacked | — | No aggregate cross-product user-impact figure anywhere in the deck; GrowIt's own largest deck figure is 240K users. |
| SITE-02 | "4 Design Awards" | metric | components/core/animated-number-basic.tsx:13; app/about/about-client.tsx:37 | Backed | Slide 28 | Deck lists exactly 4 awards (2 Davey Silver + 2 Vega 3rd Place) for GrowIt. |
| SITE-03 | "$50M in product value" | metric | components/core/animated-number-basic.tsx:14; app/about/about-client.tsx:43 | Unbacked | — | Not in deck anywhere; flagged in CONTEXT.md §Deferred as a claim this audit must verdict. |
| SITE-04 | "800+ Designers Mentored" | metric | components/core/animated-number-basic.tsx:15; app/about/about-client.tsx:49 | Unbacked | — | No such aggregate figure anywhere in the deck. |
| SITE-05 | Person schema `award` array — 4 named awards (Davey ×2, Vega ×2) | metric | components/seo/structured-data.tsx:182-186 | Backed | Slide 28 | Exact match to the deck's award list. |
| SITE-06 | GrowIt `aggregateRating`/description "4.8★ rating" | metric | components/seo/structured-data.tsx:225 | Unbacked | — | Same figure as GROWIT-05; not in deck. |
| SITE-07 | Testimonial — Paul Grachen, VP/Director of Experience Design, Digitas/Leo Burnett | quote | lib/data/testimonials.ts:14-19 | Backed | Slide 47 | Near-verbatim match to deck quote and attribution. |
| SITE-08 | Testimonial — Donald Wu, Senior Graphic Designer, Hickory Farms | quote | lib/data/testimonials.ts:21-26 | Backed | Slide 47 | Substance and attribution match; site quote is a tightened paraphrase of the deck's longer quote. |
| SITE-09 | "Chameleon Collective" fractional VP / partnership affiliation | attribution | app/about/about-client.tsx:57-59; components/seo/structured-data.tsx:133,610,669 | Unbacked | — | Never appears in the deck; PROJECT.md already flags this as an unverified carry-over needing its own source link per the non-deck-source rule. |

---

## Part B — Deck Material Not Yet On The Site

Columns: `Deck ref (slide) | Material | Project | Phase 8 usable as | Notes`

### growit

| Deck ref (slide) | Material | Project | Phase 8 usable as | Notes |
|---|---|---|---|---|
| Slide 17 | Persona "Gregory Hamner" — 51, LeafDepot manager, Boise ID, goals ("finding new plants," "help people become educated," "budget-conscious"), frustrations ("limited mobile resources," "problems with available solutions"), motivation profile (Incentive/Social high), preferred channels (online/social, referral) | growit | decision | Grounds *why* the self-guided tour was designed the way it was — could back a "Decision" card ("designed for X persona") in Phase 6/8's decision-with-rationale narrative. |
| Slide 18 | Brainstorming process — day-one engineering conversations (gain clarity, know constraints, contribution, involve), "LOTS of sketching," "BiP: Bad Idea Party," stakeholder reporting/guidance loop with PM + client | growit | approach / roleNarrative | Concrete process detail entirely absent from the live case study; usable as roleNarrative ("how I worked") or approach content. |
| Slide 20 | Constraints — Environmental (Chicago's continental climate), Technical (iBeacon signal strength/attenuation, physical/body signal blocking), Location (mounting on trees/lampposts/barriers, radio-frequency interference, null-state UX for dropped connections) | growit | decision / alternatives-considered | The live `constraints` object (GROWIT-34/35/36) is entirely different, fabricated content. This is the *real* constraint set and should replace it. |
| Slide 21 | Ideation goals — seamless in-app wayfinding, reduce barriers to resume tour if connection lost, simplistic onboarding for new/existing accounts; cites a 99% Invisible podcast episode as design inspiration | growit | rationale | Grounds the "why" behind onboarding/resume-flow decisions; the podcast citation is a nice authentic-voice detail for reflection. |
| Slide 23 | User flow diagrams built by Eight Bit Studios for GrowIt (New User, Existing User, User Engagement flows) — confirms the agency/client relationship | growit | roleNarrative | Establishes Randy's collaborator context (Eight Bit Studios as the design agency, GrowIt as the client) — useful for an accurate attribution line, distinct from the fabricated Ball Horticultural partnership. |
| Slide 24 | Hi-Fi prototype screen sequence — Tour Ad → OnBoarding → Tour Checkpoints ("Northwest Shade Plate" example) → Tour Ends: CTA ("Support Lady Bird Johnson," "Follow Lurie Garden on GrowIt!") | growit | outcome | Concrete deliverable screens; could illustrate the case study visually or back an "outcome" claim about the shipped feature. |
| Slide 25 | Research Insights (internally tested) — badge was a clear trigger indicator; need to resume tour if disconnected; need to notify on full completion | growit | decision | Real usability-informed design decisions, unused on site; stronger than the fabricated "solutions[]" array currently there. |

### addvanced

| Deck ref (slide) | Material | Project | Phase 8 usable as | Notes |
|---|---|---|---|---|
| Slide 44 | "What did we learn?" — (1) optimize import URL flow (low success rate), (2) create a dark mode option, (3) white-labeling option for B2B opportunities, (4) research accessibility strategy (Level AA) | addvanced | reflection | These are the deck's **real** four learnings. None of the 7 fabricated `learnings[]` entries in `lib/data/projects.ts` (ADDVANCED-30 through 36) match any of these. Phase 8 should replace the array with this real content. |
| Slide 38 | Key Screens detail — A1 Home (fixed search, job board cards, footer nav across Boards/Documents/Dashboard/Account), A5 Connection Details (contact scan via LinkedIn/Indeed, notes feature), A17c Moved To Offer (multi-tier hiring-process view, job comparison via long-press) | addvanced | outcome | Specific, real deliverable detail not reflected anywhere in the live case study's metrics or solutions arrays. |
| Slide 36 | Design Challenge statement, verbatim: "Create a helpful tool for job seekers to browse, save, and manage the candidate path for a professional career." | addvanced | decision | A cleaner, deck-accurate problem statement than the site's embellished "$4.2B market disruption" framing. |
| Slide 37 | Addvance Sitemap — exact first-release scope: Pull from URL (LinkedIn, Indeed), Upload & Store Documents, View network connections in-app, Track professional networks' social activity | addvanced | decision | Grounds a real, scoped feature list — smaller and more credible than the site's "12+ platforms consolidated" and "OAuth Orchestra" claims. |
| Slide 34 | Competitor observations — "Light, Clean, Easy to use, Complex" as the four IDI-framework takeaways from Trello/Huntr/Apple Notes | addvanced | rationale | Already partially reflected via ADDVANCED-65 (Backed); the specific 4-word observation list itself is not quoted on the live site and could sharpen the rationale copy. |

### Unattributed / cross-project

| Deck ref (slide) | Material | Project | Phase 8 usable as | Notes |
|---|---|---|---|---|
| Slides 3-4 | "20-year design professional... last 10 years focused on Product Design, UX, and Design Leadership"; Lead Adjunct Instructor at University of Wisconsin, University of Miami, Kansas State, NJIT, General Assembly Chicago; Webby Awards Judge; volunteer work (AIGA Chicago, ADP List, Amicus Curiae 303 Creative v. Elenis) | growit, addvanced (n/a — Sitewide/bio) | roleNarrative | Rich, real bio detail not currently surfaced anywhere on work.randyellis.design (About page currently uses different framing). Usable for an About-page roleNarrative rewrite in a future phase — out of this plan's scope, flagged for awareness. |
| Slides 6-9 | Design/Leadership philosophy statements ("Be human," "Build trust," "Make promises based on data," "Collaboration," "Embrace innovation," "Stay Agile," "Emphasize user research," "Human-Centered Design," "Continuous Learning") | Sitewide | reflection | General leadership-philosophy language that could ground a reflection/pull-quote block if a future phase wants first-person voice grounded in verified material rather than generic copy. |

---

## Part C — Open Questions For Randy

### growit

1. ~~Which is the real scope — the deck's 4-week pilot or the site's 30-month build?~~
   **RESOLVED 2026-08-15.** Both. The deck documents one 4-week self-guided-tour pilot
   (Slide 12) nested inside a 30-month engagement; it was never an inventory of the whole
   engagement. The question rested on a scope-inference error. Separately, a real arithmetic
   defect surfaced and was fixed: `timeline` read "Q1 2014 - Q4 2016" (36 months) against
   `timelineDuration: "30 months"` on the same project. Randy confirmed 30 months; timeline
   corrected to "Q1 2014 - Q2 2016" (`lib/data/projects.ts:45`).
2. The deck frames the client relationship as GrowIt ↔ Eight Bit Studios (Slide 23) and never
   mentions Ball Horticultural. Not a conflict — just a gap worth filling: how did the Ball
   partnership (GROWIT-14/18/29) actually work, and is it worth a sentence of narrative in the
   rewrite?
3. The 4.8★ App Store rating (GROWIT-05/SITE-06) and 25,000+ city count (GROWIT-04) are
   figures a reader can go check independently. Worth confirming they're still accurate before
   they carry more narrative weight — not because a rule demands a citation, but because a
   stale public number is the one kind of error that costs credibility on its own.
4. Should the live `constraints` object for GrowIt (currently: seasonal patterns, ML
   processing, global 25K-city deployment) be replaced with the deck's real constraints
   (Chicago climate, iBeacon signal strength, mounting/RF interference — Slide 20, see Part B)?

### ohplays

1. Oh!Plays does not appear anywhere in the 48-page deck. Is there a separate source document
   (a different deck, a case-study PDF, a live shipped app) that can back any of the 18 metrics
   currently on `/projects/ohplays`, or should this project be treated as unverifiable until a
   new source is supplied?
2. If Oh!Plays is real but undocumented here, can you provide the specific figure for at least
   the headline claims — 93% user testing success rate and 15,000+ weekly active users — with a
   dated analytics export or Eight Bit Studios case-study link?

### ledgeriq

1. **[D-03 resolution ask — answer first.]** Which LedgerIQ metric set is real — the deleted
   bespoke page's ($2.3M savings, 40% productivity, 60% processing-time reduction, 85%
   satisfaction) or the live data-model page's ($180K savings, 78% error reduction, 65% time
   savings, 92% anomaly detection) — and is LedgerIQ a real client engagement or a
   composite/spec project? Neither figure set nor the LedgerIQ project itself appears anywhere
   in the 48-page deck.
2. If LedgerIQ is a composite/spec project (not a real client engagement), should Phase 8 label
   it explicitly as illustrative/concept work rather than a verified case study with dollar
   figures?
3. What is the actual GitHub repository status for `randyellis-wealthberry/LedgerIQDashboard`
   (`lib/data/projects.ts:403`) — is it a real, inspectable codebase that could serve as an
   alternate verifiable source for at least the technical claims (Python/TensorFlow model,
   Kafka pipeline)?

### addvanced

1. The deck's real Addvance usability numbers (50/64/86/86% task success, 74/82/93/93 scores,
   14 participants — Slides 39-43) are completely different from all 15 metrics currently
   published on `/projects/addvanced` (94% approval, 91.7% completion, 4.8/5 usability, etc.).
   Should Phase 8 replace the fabricated metrics wholesale with the deck's real usability
   report numbers?
2. The bespoke `addvanced-client.tsx` claims "800% higher success rate for optimized paths" and
   "60% mission unfinished rate," but the deck's own usability-report screenshot (Slide 40)
   shows 0.0% mission-unfinished for the tested flow. Where did the 800% and 60% figures come
   from, and should they be removed?
3. Is the "35% Job Placement Success" metric (ADDVANCED-51) real? It has no deck source and no
   analogue anywhere in `lib/data/projects.ts`'s own metrics array for this project.
4. `addvanced-client.tsx` renders a "Stakeholder Feedback" section that is currently empty
   (`processStory.stakeholderQuotes` is undefined for this project). Do you have real,
   attributable quotes from the Alight Innovation Lab team (Creative Director, Frontend
   Developer, or PM named on Slide 33) that could fill this section, or should it be removed?

### echo

1. EchoDrive does not appear anywhere in the 48-page deck. Is there a separate Echo Global
   Logistics / Eight Bit Studios case-study document that can verify the 16% LTL revenue
   increase, 10,000+ active drivers, and the $184.4 million revenue figure?
2. The three stakeholder quotes (ECHO-35/36/37) are attributed only to generic titles
   ("Operations Director," "Fleet Manager," "Dispatch Team Lead") with no named person. Can you
   supply named, attributable quotes (matching the standard already set by the real GrowIt
   testimonials from Paul Grachen and Donald Wu), or should this quote block be removed?

### nagarro

1. The Nagarro design-leadership role does not appear anywhere in the deck (which predates or
   postdates this role — the deck is undated beyond "2024" on the cover, while the Nagarro
   timeline is Mar-Oct 2022). Is there LinkedIn documentation, a Nagarro internal case study,
   or public press coverage (the "healthcare technology partnerships... with ADT Health," 15+
   published articles, etc.) that could back the 18,000+ Nagarrians, 50% brand recognition
   growth, and $50M+ business-impact figures?
2. Can any of the "15+ thought leadership articles" referenced in the process story
   (`lib/data/projects.ts:997,1047,1054`) be linked directly (URLs) so their existence and
   reach (10K+ subscribers) can be independently verified per the non-deck-source rule?

### rambis-ui

1. Rambis UI does not appear anywhere in the deck. The project's own GitHub link
   (`github.com/randyellis-wealthberry/rambus-ui`) is a plausible independent verification
   source per the non-deck-source rule — can the actual GitHub stars, weekly npm downloads, and
   contributor counts be pulled live from that repository/npm to replace or confirm the current
   150+/2.5K+/12 figures?
2. Is the "100% Accessibility Score" (RAMBIS-06) an automated Lighthouse/axe score that can be
   captured as a dated report, or is it an aspirational/rounded figure?

---

## Phase 8 Reference (formerly "Gate" — REMOVED 2026-08-15)

**The gate is gone.** Phase 8 is not restricted to Backed/Partial rows, and Unbacked rows are
not cut. Randy lived these engagements; the deck is a portfolio presentation he assembled for
one audience, not the ledger of his career. A 48-page deck whose own Agenda covers two projects
was never capable of adjudicating seven.

What this document is still good for:

- **Part B** — real deck material that is *not yet on the site*. Free content, already yours.
- **Part C** — questions worth answering because they sharpen the copy, not because a rule
  demands a citation.
- **Contradiction tracking** — the LedgerIQ CONTRADICTION block and the GrowIt duration mismatch
  (see below) are places the site disagrees with *itself*. Those still need fixing; a reader
  catches them with no source at all.

The two rules that never came from the deck still stand: **credit attribution** (CRED-06 — "we"
where a team did it, "I" where you did) and **NDA judgment** on named live clients (CRED-08).

**Raw counts (Backed / Partial / Unbacked), per project.** A high Unbacked count is the expected
result of a first extraction across a mostly-unverified 7-project case-study set, **not a
defect** — see "How To Read This" above.

| Project | Backed | Partial | Unbacked | Total rows |
|---|---|---|---|---|
| growit | 1 | 4 | 31 | 36 |
| ohplays | 0 | 0 | 42 | 42 |
| ledgeriq | 0 | 0 | 35 | 35 |
| addvanced | 12 | 8 | 49 | 69 |
| echo | 0 | 0 | 37 | 37 |
| nagarro | 0 | 0 | 35 | 35 |
| rambis-ui | 0 | 0 | 34 | 34 |
| sitewide | 4 | 0 | 5 | 9 |
| **Total** | **17** | **12** | **268** | **297** |

(Corrected from an earlier 18/11/268 published alongside this table: a per-row tally found
GrowIt's actual split is 1 Backed / 4 Partial, not 2/3 — GROWIT-01 is Partial, not Backed. This
table is now a direct tally of the 297 rows in Part A above, not a hand count.)

(LedgerIQ's 4-pair CONTRADICTION block is tracked separately from the 35-row table above per
D-03 and is not double-counted in this table.)
