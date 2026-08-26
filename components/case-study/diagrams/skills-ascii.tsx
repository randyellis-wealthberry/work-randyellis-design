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
 * picks for U+2588. Colour comes from the `--dg-*` tokens on
 * `.diagram-figure`, so one element serves light and dark.
 */

/**
 * Five rows per word, 28 columns each, solid blocks only.
 *
 * An earlier version used a two-row font with half-blocks and shading
 * (▄ ▀ ░). It read fine as terminal output at 12px and turned into a field
 * of white rectangles once the card scaled it past 500px — the half-height
 * glyphs stop reading as letterforms when they get that big. Five rows of
 * full blocks survive the scale, which is the size that actually ships.
 */
const ART = [
  " ██   ███ ████ █  █ ███     ",
  "█  █ █    █    ██ █  █      ",
  "████ █ ██ ███  █ ██  █      ",
  "█  █ █  █ █    █  █  █      ",
  "█  █  ███ ████ █  █  █      ",
  "████ █  █ ███ █    █    ████",
  "█    █ █   █  █    █    █   ",
  "███  ██    █  █    █    ███ ",
  "   █ █ █   █  █    █       █",
  "████ █  █ ███ ████ ████ ████",
];

/** Cell size and origin. 28 columns x 9px starts at x=24 and ends at 276,
 *  inside the 320-wide viewBox; ten rows plus the 6px inter-word gap bottom
 *  out at 140, leaving the caption its line. */
const CELL = 9;
const X0 = 24;
const Y0 = 44;
const GAP = 6;

export function SkillsAsciiDiagram() {
  return (
    <svg
      viewBox="0 0 320 180"
      className="diagram-figure h-full w-full"
      role="img"
      aria-label="Terminal word art reading AGENT SKILLS above the install command, npx skills add"
    >
      <rect x="0" y="0" width="320" height="180" fill="var(--dg-paper)" />

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

      {/* One rect per filled cell rather than <text>. An SVG <text> run of
          block characters falls back to a different face than the spaces
          around it, so the advance widths stop matching and the letterforms
          merge into each other — legible in a real terminal, unreadable here.
          Drawing the grid removes the font from the equation entirely. */}
      <g fill="var(--dg-ink)" shapeRendering="crispEdges">
        {ART.flatMap((row, r) =>
          [...row].map((ch, c) =>
            ch === "█" ? (
              <rect
                key={`${r}-${c}`}
                x={X0 + c * CELL}
                y={Y0 + r * CELL + (r >= 5 ? GAP : 0)}
                width={CELL}
                height={CELL}
              />
            ) : null,
          ),
        )}
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
