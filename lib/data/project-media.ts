import type { MediaItem } from "@/components/case-study/case-study-template";

/**
 * Curated, verified media per case study.
 *
 * Every entry points at a file that exists on disk, and every width/height is
 * the file's real pixel size — measured, not guessed, so `next/image` reserves
 * the right box and nothing is letterboxed or stretched.
 *
 * Also excluded as duplicates: ledgeriq's `4.jpg` is the same dashboard as
 * `1.jpg`, and addvanced's `1.png` is the demo video's own poster frame — both
 * would have shown the same picture twice in one section.
 *
 * Deliberately excluded:
 * - `growit`'s `app-screens-overview.jpg` and `dashboard-overview.jpg` — the
 *   same stock photograph of Lurie Garden in Chicago saved under two
 *   product-sounding filenames, previously captioned as the app's core flow and
 *   as a user dashboard. `mobile-interface.jpg` and `app-mockup-1.jpg` are the
 *   same kind of thing and were never listed. A case study that shows stock
 *   photography as product work is worse than one that shows less.
 * - `nagarro` — its six entries in PROJECTS.images are placeholder SVGs (a
 *   navy rectangle with a dashed red border), not artifacts of the work.
 * - `rambis-ui`'s seven image paths and two of `addvanced`'s — those files are
 *   referenced in PROJECTS.images but do not exist in `public/`.
 *
 * Alt text and captions are written from the images themselves. They used to
 * be written from the filenames, and the filenames turned out to be unreliable
 * in both directions: ohplays' `app-screenshot-2.jpg` and `-3.jpg` are a
 * project timeline and a brand platform sheet, while the file called
 * `marketing-material-3.jpg` is the one showing actual app screens. Nothing
 * here describes a file that was not opened.
 */
export const PROJECT_MEDIA: Record<string, readonly MediaItem[]> = {
  growit: [
    {
      src: "/projects/growit/growit-hero-video.mp4",
      poster: "/projects/growit/hero-thumbnail.jpg",
      kind: "video",
      alt: "Walkthrough of the GrowIt! plant identification and gardening app",
      width: 2000,
      height: 1251,
      caption: "The shipped app, end to end.",
    },
    {
      src: "/projects/growit/before-after-comparison.jpg",
      alt: "The GrowIt! Explore screen on a phone, headed \u201cViewing plants within 100 miles of Chicago, IL\u201d above a feed of community plant photos",
      width: 1000,
      height: 667,
      caption:
        "Discovery, scoped to a radius. The header states the distance it is drawing from, which is the same rule that widens when a local feed comes up short.",
    },
    {
      src: "/projects/growit/persona-research.png",
      alt: "GrowIt! persona board for Gregory Hamner, 51, a garden centre manager in Boise \u2014 goals, frustrations, motivations and preferred channels",
      width: 1200,
      height: 855,
      caption: "Persona work that set who the app was actually for.",
    },
  ],
  ohplays: [
    {
      src: "/projects/ohplays/ohplays-hero-video.mp4",
      poster: "/projects/ohplays/ohplays-video-poster.png",
      kind: "video",
      alt: "Walkthrough of the Oh!Plays sports highlights app",
      width: 1920,
      height: 1080,
      caption: "The shipped app.",
    },
    {
      src: "/projects/ohplays/marketing-material-3.jpg",
      alt: "Oh!Plays store marketing: the splash screen held in one hand, a Top Replays feed of clips from nearby athletes, and a fan recording their own reaction to a play",
      width: 1800,
      height: 1200,
      caption:
        "The store listing. Watching, reacting and recording are the three things it leads with — the editing is what gets you there.",
    },
    {
      src: "/projects/ohplays/app-screenshot-2.jpg",
      alt: "A three-track project timeline running January to March across UXD, Android and iOS, each with its own milestones, and a fourth chart overlaying all three",
      width: 1382,
      height: 2848,
      caption:
        "Design ran ahead of both platforms and waited for them. The fourth chart is the three tracks laid over each other, which is where the waiting is visible.",
    },
    {
      src: "/projects/ohplays/app-screenshot-3.jpg",
      alt: "A brand platform sheet written under the Good Game name: tagline, elevator pitch, positioning, mission, four target audiences, personality do-and-do-not lists, and three consumer pillars",
      width: 2845,
      height: 2134,
      caption:
        "The brand platform, written under the Good Game name. Sports presets are downstream of this page: the pillars are what made a preset defensible instead of arbitrary.",
    },
  ],
  ledgeriq: [
    {
      src: "/projects/ledgeriq/ledgeriq-glitch.mp4",
      kind: "video",
      alt: "Motion study of the LedgerIQ dashboard",
      width: 1920,
      height: 1080,
      caption: "The dashboard in motion.",
    },
    {
      src: "/projects/ledgeriq/1.jpg",
      alt: "The LedgerIQ payroll anomaly dashboard: 354 anomalies this cycle, $92,000 of high-risk exposure across 6 of 9 departments, an anomaly-trend chart split by risk level, a live table of flagged payments with AI confidence per row, and an insights panel suggesting a timesheet integration error as the root cause",
      width: 3360,
      height: 2796,
      caption:
        "The engine ranks and the auditor decides: every row carries a confidence figure and a status, and the panel on the right proposes a cause rather than asserting one.",
    },
    {
      src: "/projects/ledgeriq/3.jpg",
      alt: "The LedgerIQ anomaly reports screen: 127 reports, 23 critical, categories broken out by severity from duplicate pay down to tax calculation, and average resolution times compared between complex and simple issues",
      width: 3360,
      height: 2100,
      caption:
        "Where the caseload gets read as a caseload — which categories recur, and which ones cost hours rather than minutes to close.",
    },
    {
      src: "/projects/ledgeriq/2.jpg",
      alt: "The LedgerIQ admin settings screen: 12 pending approvals including a request to lower the anomaly detection threshold from 85% to 75%, a two-factor authentication policy, and an audit-log retention extension",
      width: 3360,
      height: 2100,
      caption:
        "Changing the threshold is an approval with a name attached to it, not a slider. The decision about false positives is enforced here as much as in the model.",
    },
  ],
  addvanced: [
    {
      src: "/projects/addvanced/addvanced-demo-video.mp4",
      poster: "/projects/addvanced/1.png",
      kind: "video",
      alt: "Prototype walkthrough of the Addvance career experience",
      width: 3360,
      height: 1854,
      caption: "The prototype built inside the two-week sprint.",
    },
    {
      src: "/projects/addvanced/A1-Home.png",
      alt: "The Addvance My Job Boards screen: a search field, buttons to create a board or a job post, and saved boards for manager, logistics and design roles, each showing how long ago it was updated and how many jobs it holds",
      width: 654,
      height: 1426,
      caption:
        "The tracking half, at the depth it shipped at. Boards, counts and dates — and no more than that, which is the trade the sprint made on purpose.",
    },
    {
      src: "/projects/addvanced/addvanced-whiteboard-fitts-law.png",
      alt: "A whiteboard of paper phone wireframes taped in a flow: a first screen branching into wish list, applied, contacted, offers and no-contact states, with each state defined in marker beside it and the Fitts's Law equation written in the corner",
      width: 1090,
      height: 814,
      caption:
        "The application states worked out in paper before anything was drawn — every state defined in a sentence so the prototype could not quietly invent a sixth.",
    },
  ],
  echo: [
    {
      src: "/projects/echo/echodrive-mockup-video.mp4",
      poster: "/projects/echo/poster.png",
      kind: "video",
      alt: "Walkthrough of the EchoDrive driver and dispatch applications",
      width: 1920,
      height: 1080,
      caption: "EchoDrive across both platforms.",
    },
    {
      src: "/projects/echo/discovery1.png",
      alt: "A workshop board headed \u201cEcho: User Assumptions\u201d, divided into three columns \u2014 carrier reps, drivers, and carrier dispatchers \u2014 each holding a wall of goal and pain-point notes, with the drivers column labelled ASSUMPTIONS",
      width: 3418,
      height: 1800,
      caption:
        "What the team believed before anyone went to a truck. The drivers column says ASSUMPTIONS in its own heading, which is the honest part — and the reason the next photograph exists.",
    },
    {
      src: "/projects/echo/research1.jpg",
      alt: "A researcher sitting in a truck cab beside a driver, both looking at paperwork spread over the steering wheel, with a loading dock visible through the open door",
      width: 1500,
      height: 1000,
      caption:
        "The same questions, asked in the cab. What read as resistance to digital tools from a workshop wall looked like tools built for a desk once anyone sat in the seat.",
    },
    {
      src: "/projects/echo/showcase1.jpg",
      alt: "A driver holding the EchoDrive app in a truck yard, showing a month-by-month history of on-time pickups and 80 per cent on-time for August",
      width: 1500,
      height: 1000,
      caption:
        "The driver side, in the hand it was designed for: one number the driver is measured on, legible at arm's length.",
    },
    {
      src: "/projects/echo/brand3.png",
      alt: "Two EchoDrive icons on a light ground: a green diamond holding a white stacked pallet on a blue base, and a second diamond holding a blue highway running to the horizon between green fields",
      width: 3600,
      height: 2400,
      caption:
        "The two halves of the business as two marks — the freight and the road it moves on.",
    },
  ],
  "rambis-ui": [
    {
      src: "/projects/rambis-ui/rambis.mp4",
      poster: "/projects/rambis-ui/hero-thumbnail.jpg",
      kind: "video",
      alt: "Walkthrough of the Rambis UI component library and theming engine",
      width: 800,
      height: 450,
      caption: "The component library in use.",
    },
  ],
  waffle: [
    {
      src: "/projects/waffle/scorecard-overview.png",
      alt: "Waffle scorecard for a Grocery Store Clerk role showing a 7.5/10 overall score weighted across five competencies",
      width: 1920,
      height: 1218,
      caption:
        "A generated scorecard: competency cards on the left, a weighted overall score rolled up from all five on the right.",
    },
    {
      src: "/projects/waffle/scorecard-questions.png",
      alt: "Waffle side panel listing behavioral interview questions with follow-ups and what each question assesses",
      width: 1920,
      height: 1218,
      caption:
        "Each competency opens into behavioral questions, follow-up prompts, and a note on what the question is actually assessing.",
    },
    {
      src: "/projects/waffle/scorecard-templates.png",
      alt: "Waffle scorecard template library filtered by Engineering, Product and Design, Sales and Marketing, and Operations",
      width: 1920,
      height: 1218,
      caption:
        "Pre-built templates for common roles, so teams start from a reviewed rubric instead of a blank prompt.",
    },
    {
      src: "/projects/waffle/landing.png",
      alt: "waffle.cards landing page: 'Untangle Your Hiring Process', with a job-description field that generates a scorecard",
      width: 1920,
      height: 1159,
      caption:
        "The public landing page at waffle.cards: paste a job description and watch the scorecard build itself live.",
    },
    {
      src: "/projects/waffle/chat-home.png",
      alt: "The Waffle chat home: a greeting, four role starter cards for software engineer, product manager, sales representative and designer, locked interview-prep and candidate-compare actions, and an input reading \u201cDescribe the role you're hiring for\u201d",
      width: 1920,
      height: 1033,
      caption:
        "Where a scorecard starts: a sentence about the role, not a form. The starter cards are a way in for anyone who would rather not begin from a blank field.",
    },
  ],
};
