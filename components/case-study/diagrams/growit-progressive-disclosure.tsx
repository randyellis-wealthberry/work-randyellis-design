"use client";

/**
 * GrowIt! — one interface, read two ways.
 *
 * The decision this illustrates is "one interface for novices and experts, not
 * two". Drawn as an annotated specimen rather than a comparison, because the
 * whole claim is that there is only ever ONE artifact: the product does not
 * fork, so the figure must not either. A two-up would quietly concede the
 * argument by drawing two screens.
 *
 * So the interface is drawn exactly once, in the centre, and the two audiences
 * arrive as annotations pointing at the same object — the novice reading the
 * rows that are always present, the experienced gardener reading the rows that
 * are there but not yet surfaced. The rows are bars, never named features:
 * which specific controls were gated is not something the case study records,
 * and a diagram is a bad place to invent it.
 *
 * The answer that was passed on — two modes behind a first-run choice — sits
 * in its own column, dashed and quiet, because its defect is structural: it
 * asks the question before anyone has used the product.
 *
 * Inversion is spent once, on the specimen's header, because "one interface"
 * is the claim.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark.
 */
export function GrowItProgressiveDisclosureDiagram() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 960 560"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="growit-disclosure-title growit-disclosure-desc"
    >
      <title id="growit-disclosure-title">
        One interface, annotated by who is reading it
      </title>
      <desc id="growit-disclosure-desc">
        A single interface drawn once, with the audiences arriving as
        annotations rather than as separate screens. In its own column on the
        left, dashed and quiet, is the answer that was passed on: a first-run
        question reading &ldquo;Which are you?&rdquo; feeding two mode cards,
        Beginner and Expert, with a note that this doubles the design and build
        surface and asks the question before anyone has used the product. In the
        centre is what shipped — one frame, headed &ldquo;one interface&rdquo;,
        holding six rows. The upper three are filled: controls present from the
        first run. The lower three are outlined and dashed: the same interface,
        with advanced controls that surface as a user demonstrates competence.
        The rows are bars rather than named features because the case study does
        not record which specific controls were gated. Two annotations point at
        that one frame from the right. The first, aimed at the filled rows,
        reads: a novice gets one path in and nothing to identify themselves as.
        The second, aimed at the dashed rows, reads: an experienced gardener
        finds the depth is present but behind behaviour they have to
        demonstrate. Below it is the cost, stated plainly — they knew those
        features existed, and had to earn their way back to them.
      </desc>
      <defs>
        <marker
          id="gd-arrow-quiet"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-quiet)" />
        </marker>
      </defs>

      <rect width="100%" height="100%" fill="var(--dg-paper)" />

      {/* ============ PANEL HEADERS ============ */}
      <text
        x="40"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        THE CLEANER ANSWER, PASSED ON
      </text>
      <text
        x="380"
        y="52"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        WHAT SHIPPED
      </text>
      <line
        x1="40"
        y1="64"
        x2="920"
        y2="64"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <line
        x1="344"
        y1="64"
        x2="344"
        y2="470"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />

      {/* ============ LEFT — THE TWO-MODE ANSWER THAT WAS REFUSED ============ */}
      <rect
        x="60"
        y="104"
        width="240"
        height="56"
        rx="4"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="180"
        y="128"
        fill="var(--dg-quiet)"
        fontSize="13"
        textAnchor="middle"
      >
        &ldquo;Which are you?&rdquo;
      </text>
      <text
        x="180"
        y="146"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        asked before anyone has used it
      </text>

      <path
        d="M 140,160 V 174 Q 140,182 132,182 H 124 Q 116,182 116,190 V 202"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        markerEnd="url(#gd-arrow-quiet)"
      />
      <path
        d="M 220,160 V 174 Q 220,182 228,182 H 236 Q 244,182 244,190 V 202"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        markerEnd="url(#gd-arrow-quiet)"
      />

      <rect
        x="60"
        y="206"
        width="112"
        height="72"
        rx="4"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="116"
        y="238"
        fill="var(--dg-quiet)"
        fontSize="12"
        textAnchor="middle"
      >
        Beginner
      </text>
      <text
        x="116"
        y="256"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        one build
      </text>

      <rect
        x="188"
        y="206"
        width="112"
        height="72"
        rx="4"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="244"
        y="238"
        fill="var(--dg-quiet)"
        fontSize="12"
        textAnchor="middle"
      >
        Expert
      </text>
      <text
        x="244"
        y="256"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        a second build
      </text>

      <text x="60" y="318" fill="var(--dg-prose)" fontSize="11">
        Two surfaces to design, two to maintain —
      </text>
      <text x="60" y="336" fill="var(--dg-prose)" fontSize="11">
        and a question novices answer wrong.
      </text>

      {/* ============ CENTRE — THE ONE INTERFACE (FOCAL) ============ */}
      <rect
        x="392"
        y="96"
        width="250"
        height="340"
        rx="12"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1.4"
      />
      {/* Header — inversion, spent once, on the claim itself */}
      <path
        d="M 392,108 Q 392,96 404,96 H 630 Q 642,96 642,108 V 130 H 392 Z"
        fill="var(--dg-ink)"
      />
      <text
        x="517"
        y="119"
        fill="var(--dg-paper)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        ONE INTERFACE
      </text>

      {/* Rows always present */}
      <rect
        x="412"
        y="150"
        width="210"
        height="26"
        rx="3"
        fill="var(--dg-wash)"
      />
      <rect
        x="424"
        y="160"
        width="128"
        height="6"
        rx="3"
        fill="var(--dg-quiet)"
        opacity="0.55"
      />
      <rect
        x="412"
        y="186"
        width="210"
        height="26"
        rx="3"
        fill="var(--dg-wash)"
      />
      <rect
        x="424"
        y="196"
        width="96"
        height="6"
        rx="3"
        fill="var(--dg-quiet)"
        opacity="0.55"
      />
      <rect
        x="412"
        y="222"
        width="210"
        height="26"
        rx="3"
        fill="var(--dg-wash)"
      />
      <rect
        x="424"
        y="232"
        width="150"
        height="6"
        rx="3"
        fill="var(--dg-quiet)"
        opacity="0.55"
      />

      {/* Rows that surface later */}
      <rect
        x="412"
        y="266"
        width="210"
        height="26"
        rx="3"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
        strokeDasharray="3,3"
      />
      <rect
        x="424"
        y="276"
        width="110"
        height="6"
        rx="3"
        fill="var(--dg-edge)"
      />
      <rect
        x="412"
        y="302"
        width="210"
        height="26"
        rx="3"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
        strokeDasharray="3,3"
      />
      <rect
        x="424"
        y="312"
        width="142"
        height="6"
        rx="3"
        fill="var(--dg-edge)"
      />
      <rect
        x="412"
        y="338"
        width="210"
        height="26"
        rx="3"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
        strokeDasharray="3,3"
      />
      <rect
        x="424"
        y="348"
        width="88"
        height="6"
        rx="3"
        fill="var(--dg-edge)"
      />

      <text
        x="517"
        y="392"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        no mode · no setting · no first-run question
      </text>
      <text
        x="517"
        y="412"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        rows stand for controls, not named features
      </text>

      {/* ============ RIGHT — THE TWO READINGS OF THAT ONE OBJECT ============ */}
      <path
        d="M 690,180 H 664 Q 656,180 656,190 V 199"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <line
        x1="656"
        y1="199"
        x2="642"
        y2="199"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="690"
        y="164"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        NOVICE · FIRST RUN
      </text>
      <text x="690" y="186" fill="var(--dg-prose)" fontSize="11">
        Reads the filled rows. One path
      </text>
      <text x="690" y="204" fill="var(--dg-prose)" fontSize="11">
        in, and nothing to declare
      </text>
      <text x="690" y="222" fill="var(--dg-prose)" fontSize="11">
        themselves as first.
      </text>

      <path
        d="M 690,296 H 664 Q 656,296 656,306 V 315"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <line
        x1="656"
        y1="315"
        x2="642"
        y2="315"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="690"
        y="280"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        EXPERIENCED GARDENER
      </text>
      <text x="690" y="302" fill="var(--dg-prose)" fontSize="11">
        Reads the dashed rows. The depth
      </text>
      <text x="690" y="320" fill="var(--dg-prose)" fontSize="11">
        is present, behind behaviour they
      </text>
      <text x="690" y="338" fill="var(--dg-prose)" fontSize="11">
        have to demonstrate first.
      </text>

      <line
        x1="690"
        y1="366"
        x2="920"
        y2="366"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="690"
        y="388"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        THE COMPLAINT, UNANSWERED
      </text>
      <text x="690" y="410" fill="var(--dg-prose)" fontSize="11">
        They knew those features existed
      </text>
      <text x="690" y="428" fill="var(--dg-prose)" fontSize="11">
        and had to earn their way back.
      </text>

      {/* ============ LEGEND ============ */}
      <line
        x1="40"
        y1="470"
        x2="920"
        y2="470"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="40"
        y="504"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        LEGEND
      </text>
      <rect
        x="140"
        y="494"
        width="24"
        height="12"
        rx="2"
        fill="var(--dg-wash)"
      />
      <text
        x="174"
        y="504"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Present from the first run
      </text>
      <rect
        x="380"
        y="494"
        width="24"
        height="12"
        rx="2"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
        strokeDasharray="3,3"
      />
      <text
        x="414"
        y="504"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Surfaces with competence
      </text>
      <rect
        x="620"
        y="494"
        width="24"
        height="12"
        rx="2"
        fill="var(--dg-ink)"
      />
      <text
        x="654"
        y="504"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Focal — the single surface
      </text>
    </svg>
  );
}
