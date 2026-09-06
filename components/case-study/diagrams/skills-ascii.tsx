"use client";

/**
 * Agent Skills — the thumbnail, as terminal output.
 *
 * Every other project in the grid shows a product still, because every other
 * project has a product to photograph. This one ships as markdown files you
 * install from a command line, so a mocked-up interface would be inventing a
 * surface that does not exist. Block-character word art is what the thing
 * actually looks like where you actually meet it.
 *
 * The prompt line is the real command, not a stylised one. Someone who reads
 * only the thumbnail and never opens the case study has still been told
 * exactly how to install it, which is more than a screenshot would have done.
 *
 * Drawn as an SVG rect grid rather than a <pre> block or an SVG <text> run,
 * so it scales with the card and does not depend on which face the browser
 * picks for U+2588. Chrome and caption come from the `--dg-*` tokens on
 * `.diagram-figure`, so one element serves light and dark. The wordmark
 * itself is this collection's one accent hue — the purple of the skills page
 * hero and install banner — carried by a `--dg-accent` token scoped to this
 * figure, with an SVG blur beneath it supplying the same soft glow the
 * page's wordmark carries.
 */

/**
 * The shared "RANDY'S / SKILLS" wordmark from lib/data/skill-word-art.ts,
 * restated here as literal rows. The diagram must render in case-study and
 * archive contexts without dragging page data into their bundles, so the
 * rows are pinned instead of imported — same generation rules (5-column
 * glyphs, single space join), so a drift shows up as a visible
 * misalignment rather than a silent one.
 */
const ART = [
  "████   ███  █   █ ████  █   █ █  ████",
  "█   █ █   █ ██  █ █   █ █   █ █ █",
  "████  █████ █ █ █ █   █  ███    █████",
  "█  █  █   █ █  ██ █   █   █         █",
  "█   █ █   █ █   █ ████    █      ████",
  "",
  " ████ █   █ ███ █     █      ████",
  "█     █  █   █  █     █     █",
  "█████ ███    █  █     █     █████",
  "    █ █  █   █  █     █         █",
  " ████ █   █ ███ █████ █████  ████",
];

/** Cell size and origin. 37 columns x 7px starts at x=28 and ends at 287,
 *  inside the 320-wide viewBox; eleven rows (with the blank spacer row)
 *  plus the 6px inter-word gap bottom out at 125, leaving the caption its
 *  line. */
const CELL = 7;
const X0 = 28;
const Y0 = 44;
const GAP = 6;

/** One rect per filled cell, per pass. An SVG <text> run of block
 *  characters falls back to a different face than the spaces around it, so
 *  the advance widths stop matching and the letterforms merge into each
 *  other — legible in a real terminal, unreadable here. Drawing the grid
 *  removes the font from the equation entirely. Pass one blurs a purple
 *  underlay; pass two draws the crisp fill on top. */
function cells(pass: number) {
  return ART.flatMap((row, r) =>
    [...row].map((ch, c) =>
      ch === "█" ? (
        <rect
          key={`${pass}-${r}-${c}`}
          x={X0 + c * CELL}
          y={Y0 + r * CELL + (r >= 5 ? GAP : 0)}
          width={CELL}
          height={CELL}
        />
      ) : null,
    ),
  );
}

export function SkillsAsciiDiagram() {
  return (
    <svg
      viewBox="0 0 320 180"
      className="diagram-figure h-full w-full"
      role="img"
      aria-label="Terminal word art reading RANDY'S SKILLS in purple above the install command, npx skills add"
    >
      <rect x="0" y="0" width="320" height="180" fill="var(--dg-paper)" />

      <defs>
        <filter
          id="skills-wordmark-glow"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur stdDeviation="1.8" />
        </filter>
      </defs>

      {/* Window chrome — three dots, the least amount of terminal that still
          reads as one. */}
      <g>
        <circle cx="16" cy="16" r="3" fill="var(--dg-edge)" />
        <circle cx="27" cy="16" r="3" fill="var(--dg-edge)" />
        <circle cx="38" cy="16" r="3" fill="var(--dg-edge)" />
        <line
          x1="0"
          y1="32"
          x2="320"
          y2="32"
          stroke="var(--dg-hairline)"
          strokeWidth="1"
        />
      </g>

      <g
        fill="var(--dg-accent)"
        opacity="0.5"
        filter="url(#skills-wordmark-glow)"
      >
        {cells(0)}
      </g>
      <g fill="var(--dg-accent)" shapeRendering="crispEdges">
        {cells(1)}
      </g>

      <text
        x="24"
        y="168"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="10"
        fill="var(--dg-quiet)"
      >
        $ npx skills add
      </text>
    </svg>
  );
}
