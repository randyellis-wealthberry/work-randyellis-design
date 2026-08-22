import type { MediaItem } from "@/components/case-study/case-study-template";

/**
 * Curated, verified media per case study.
 *
 * Every entry points at a file that exists on disk, and every width/height is
 * the file's real pixel size — measured, not guessed, so `next/image` reserves
 * the right box and nothing is letterboxed or stretched.
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
 * Alt text is written from the filenames and page context; a pass over the
 * actual images would sharpen it.
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
      src: "/projects/ohplays/app-screenshot-3.jpg",
      alt: "Oh!Plays app screens showing highlight playback and team feeds",
      width: 2845,
      height: 2134,
    },
    {
      src: "/projects/ohplays/app-screenshot-2.jpg",
      alt: "Oh!Plays mobile screen showing a single game highlight reel",
      width: 1382,
      height: 2848,
    },
    {
      src: "/projects/ohplays/marketing-material-3.jpg",
      alt: "Oh!Plays marketing material presenting the app to prospective users",
      width: 1800,
      height: 1200,
    },
  ],
  ledgeriq: [
    {
      src: "/projects/ledgeriq/ledgeriq-glitch.mp4",
      kind: "video",
      alt: "Motion study of the LedgerIQ financial dashboard",
      width: 1920,
      height: 1080,
      caption: "The dashboard in motion.",
    },
    {
      src: "/projects/ledgeriq/1.jpg",
      alt: "LedgerIQ dashboard overview with account balances and AI-generated summaries",
      width: 3360,
      height: 2796,
    },
    {
      src: "/projects/ledgeriq/2.jpg",
      alt: "LedgerIQ transaction view with automated categorisation",
      width: 3360,
      height: 2100,
    },
    {
      src: "/projects/ledgeriq/3.jpg",
      alt: "LedgerIQ reporting screen showing period-over-period comparison",
      width: 3360,
      height: 2100,
    },
    {
      src: "/projects/ledgeriq/4.jpg",
      alt: "LedgerIQ detail view of a reconciled ledger entry",
      width: 3360,
      height: 2100,
    },
  ],
  addvanced: [
    {
      src: "/projects/addvanced/addvanced-demo-video.mp4",
      poster: "/projects/addvanced/1.png",
      kind: "video",
      alt: "Prototype walkthrough of the Addvance benefits experience",
      width: 3360,
      height: 1854,
      caption: "The prototype built inside the two-week sprint.",
    },
    {
      src: "/projects/addvanced/1.png",
      alt: "Addvance product overview screen from the Alight sprint",
      width: 3360,
      height: 1854,
    },
    {
      src: "/projects/addvanced/A1-Home.png",
      alt: "Addvance mobile home screen showing a member's benefits summary",
      width: 654,
      height: 1426,
    },
    {
      src: "/projects/addvanced/addvanced-whiteboard-fitts-law.png",
      alt: "Whiteboard working through Fitts's Law for the Addvance tap targets",
      width: 1090,
      height: 814,
      caption: "Working the tap-target sizing out on the board.",
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
      alt: "On-site discovery research with drivers and dispatch teams",
      width: 3418,
      height: 1800,
      caption: "Discovery ran in truck cabs and dispatch offices, not a lab.",
    },
    {
      src: "/projects/echo/research1.jpg",
      alt: "EchoDrive research artefacts mapping the driver journey",
      width: 1500,
      height: 1000,
    },
    {
      src: "/projects/echo/showcase1.jpg",
      alt: "EchoDrive mobile driver application screens",
      width: 1500,
      height: 1000,
    },
    {
      src: "/projects/echo/brand3.png",
      alt: "EchoDrive brand and interface system applied across the platform",
      width: 3600,
      height: 2400,
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
      src: "/projects/waffle/dashboard.png",
      alt: "Waffle dashboard listing a team's saved scorecards and recent activity",
      width: 1920,
      height: 1171,
    },
  ],
};
