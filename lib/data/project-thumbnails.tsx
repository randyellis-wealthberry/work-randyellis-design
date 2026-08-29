import { NagarroAuthorityDiagram } from "@/components/case-study/diagrams/nagarro-authority";
import { RambisForkCostDiagram } from "@/components/case-study/diagrams/rambis-fork-cost";
import { SkillsAsciiDiagram } from "@/components/case-study/diagrams/skills-ascii";

/**
 * The one still each project shows in a list row.
 *
 * Chosen by opening every candidate rather than trusting a filename, because
 * the filenames lie in places: growit's `app-screens-overview.jpg` is a
 * photograph of a public garden, and two of ohplays' `app-screenshot-*.jpg`
 * are a brand strategy sheet and a project timeline chart. What is listed here
 * is what the file actually shows.
 *
 * Video is deliberately absent even where a project leads with one on its own
 * page. A list of eight rows is the wrong place to start eight downloads, and
 * a poster frame carries the same information for none of the weight.
 *
 * Two projects have no product image at all. Nagarro's folder holds only
 * placeholder SVGs; rambis-ui's holds one purple title card, which is neither
 * the product nor on the palette. Those two show a case-study figure instead —
 * real work, made for this site, and legible once the lightbox opens it.
 */
export type ProjectThumbnail =
  | {
      kind: "image";
      src: string;
      alt: string;
      width: number;
      height: number;
      /** How to seat the image in a 16:10 tile. */
      fit: "cover" | "contain";
    }
  | {
      kind: "diagram";
      /** Names the figure for the lightbox trigger and the dialog. */
      alt: string;
      Diagram: () => React.ReactElement;
    };

export const PROJECT_THUMBNAILS: Record<string, ProjectThumbnail> = {
  waffle: {
    kind: "image",
    src: "/projects/waffle/scorecard-overview.png",
    alt: "A Waffle scorecard for a Grocery Store Clerk role, competency cards on the left and a weighted 7.5 out of 10 rolled up on the right",
    width: 1920,
    height: 1218,
    fit: "cover",
  },
  echo: {
    kind: "image",
    src: "/projects/echo/showcase1.jpg",
    alt: "A driver holding the EchoDrive app in a truck yard, showing an on-time pickup history and 80 per cent on-time for the month",
    width: 1500,
    height: 1000,
    fit: "cover",
  },
  growit: {
    kind: "image",
    src: "/projects/growit/hero-mockup.jpg",
    alt: "The GrowIt! Rate Plants screen on a phone, showing a community plant photo above a single-tap rating with 5 left it and 9 love it",
    width: 2000,
    height: 1251,
    fit: "cover",
  },
  ledgeriq: {
    kind: "image",
    src: "/projects/ledgeriq/1.jpg",
    alt: "The LedgerIQ payroll anomaly dashboard: 354 anomalies this cycle, $92,000 of high-risk exposure, an anomaly-trend chart and a live table of flagged payments",
    width: 3360,
    height: 2796,
    fit: "cover",
  },
  addvanced: {
    kind: "image",
    src: "/projects/addvanced/A1-Home.png",
    alt: "The Addvance My Job Boards prototype screen on a phone, listing saved boards for manager, logistics and design roles with annotation pins",
    width: 654,
    height: 1426,
    fit: "contain",
  },
  ohplays: {
    kind: "image",
    src: "/projects/ohplays/ohplays-video-poster.png",
    alt: "The Oh!Plays editor mid-edit: a baseball clip on a trim strip with a selected range, a Glitch effect tile, and Effects, Replace and Remove controls",
    width: 1920,
    height: 1080,
    fit: "cover",
  },
  nagarro: {
    kind: "diagram",
    alt: "The Nagarro figure: one accessibility strategy meeting the limit of authority two ways, a mandate that cannot cross and a public argument that teams pull across themselves",
    Diagram: NagarroAuthorityDiagram,
  },
  "rambis-ui": {
    kind: "diagram",
    alt: "The Rambis UI figure: a relearning fee charged at every adopter of a clean-sheet system, against one inherited foundation paid for once",
    Diagram: RambisForkCostDiagram,
  },
  pixelbox: {
    kind: "image",
    src: "/projects/pixelbox/hero.png",
    alt: "The Pixelbox landing hero on a near-black ground, reading 'Your portfolio is raw metal. Have it assayed.' beside an engraved plate whose dial is unmoved and labelled un-assayed, reading not taken",
    width: 1200,
    height: 843,
    fit: "cover",
  },
  skills: {
    kind: "diagram",
    alt: "The agent skills thumbnail: block-character word art reading AGENT SKILLS above the install command",
    Diagram: SkillsAsciiDiagram,
  },
};

/** The thumbnail for a slug, or nothing. */
export const projectThumbnail = (slug: string): ProjectThumbnail | undefined =>
  PROJECT_THUMBNAILS[slug];
