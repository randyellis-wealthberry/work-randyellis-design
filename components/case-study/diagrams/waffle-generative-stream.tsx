"use client";

/**
 * Waffle — what arrives, and when.
 *
 * The decision this illustrates is "generative UI over plain text streaming".
 * Both lanes are the same model emitting the same tokens on the same clock, so
 * the clock runs across the top and is shared: the only variable is what the
 * client does with each part. That is why the top lane collapses into one
 * undifferentiated buffer that cannot be touched until a terminal parse-and-
 * hydrate gate has run over the whole blob, while the bottom lane is four
 * discrete cells that each mount straight into the page. The two `interactive`
 * bars are the payoff — the not-taken path earns one only in the last column,
 * the shipped path earns one from the first part onward.
 *
 * The focal cell is the first competency, because that is the whole claim: the
 * rubric is a working document before the second part has arrived.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark.
 */
export function WaffleStreamDiagram() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 960 560"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="waffle-stream-title waffle-stream-desc"
    >
      <title id="waffle-stream-title">The same stream, rendered two ways</title>
      <desc id="waffle-stream-desc">
        Two lanes share one clock of four streamed parts and a stream-end
        column. The upper lane, drawn dashed as the path not taken, streams
        plain text: the four parts accumulate into a single text buffer that is
        not yet a component, which must pass one parse-and-hydrate gate over the
        whole blob before a first paint appears, so its interactive interval
        begins only in the final column. The lower lane, what Waffle ships,
        streams typed UI parts: competency one, competency two, the behavioral
        question set, and the rubric each mount straight into the page as they
        arrive, so the interactive interval runs from the first part onward and
        the stream-end column has no parse step left to perform.
      </desc>

      <rect width="100%" height="100%" fill="var(--dg-paper)" />

      <defs>
        <marker
          id="wf-arrow"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-prose)" />
        </marker>
      </defs>

      {/* ============ SHARED CLOCK HEADER ============ */}
      <text
        x="280"
        y="48"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        PART 01
      </text>
      <text
        x="424"
        y="48"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        PART 02
      </text>
      <text
        x="568"
        y="48"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        PART 03
      </text>
      <text
        x="712"
        y="48"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        PART 04
      </text>
      <text
        x="856"
        y="48"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        STREAM ENDS
      </text>

      {/* ============ LANE STRUCTURE ============ */}
      <line
        x1="40"
        y1="62"
        x2="920"
        y2="62"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <line
        x1="40"
        y1="252"
        x2="920"
        y2="252"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <line
        x1="40"
        y1="452"
        x2="920"
        y2="452"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <line
        x1="176"
        y1="62"
        x2="176"
        y2="452"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />

      {/* Lane labels */}
      <text
        x="108"
        y="146"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        STREAMED AS
      </text>
      <text
        x="108"
        y="160"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        PLAIN TEXT
      </text>
      <text
        x="108"
        y="178"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        NOT BUILT
      </text>
      <text
        x="108"
        y="326"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        STREAMED AS
      </text>
      <text
        x="108"
        y="340"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        UI PARTS
      </text>
      <text
        x="108"
        y="358"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        SHIPPED
      </text>

      {/* ============ ARROWS (drawn before boxes) ============ */}
      {/* Lane A — the buffer can only reach the page through the gate */}
      <line
        x1="634"
        y1="128"
        x2="646"
        y2="128"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#wf-arrow)"
      />
      <line
        x1="778"
        y1="128"
        x2="790"
        y2="128"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#wf-arrow)"
      />
      {/* Lane A — and only then does anything become interactive */}
      <line
        x1="856"
        y1="168"
        x2="856"
        y2="190"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#wf-arrow)"
      />
      {/* Lane B — every part mounts straight in, with no gate in between */}
      <line
        x1="280"
        y1="366"
        x2="280"
        y2="392"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#wf-arrow)"
      />
      <line
        x1="424"
        y1="366"
        x2="424"
        y2="392"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#wf-arrow)"
      />
      <line
        x1="568"
        y1="366"
        x2="568"
        y2="392"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#wf-arrow)"
      />
      <line
        x1="712"
        y1="366"
        x2="712"
        y2="392"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#wf-arrow)"
      />

      {/* ============ LANE A — PLAIN TEXT (dashed: the path not taken) ============ */}
      <rect
        x="216"
        y="92"
        width="416"
        height="72"
        rx="6"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="424"
        y="120"
        fill="var(--dg-quiet)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Text buffer grows
      </text>
      <text
        x="424"
        y="136"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        tokens append · nothing is a component yet
      </text>
      <text
        x="424"
        y="150"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        one blob, still unparsed
      </text>

      <rect
        x="648"
        y="92"
        width="128"
        height="72"
        rx="6"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="712"
        y="120"
        fill="var(--dg-quiet)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Parse + hydrate
      </text>
      <text
        x="712"
        y="136"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        one pass
      </text>
      <text
        x="712"
        y="150"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        over the blob
      </text>

      <rect
        x="792"
        y="92"
        width="128"
        height="72"
        rx="6"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="856"
        y="120"
        fill="var(--dg-quiet)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        First paint
      </text>
      <text
        x="856"
        y="136"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        unstyled flash
      </text>
      <text
        x="856"
        y="150"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        then usable
      </text>

      {/* Lane A interactive interval — one column wide, at the very end */}
      <rect
        x="792"
        y="196"
        width="128"
        height="16"
        rx="3"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="856"
        y="207"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        INTERACTIVE
      </text>

      {/* ============ THE SHARED CONDITION (plated over the lane divider) ============ */}
      <rect x="450" y="244" width="236" height="16" fill="var(--dg-paper)" />
      <text
        x="568"
        y="255"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        SAME MODEL · SAME TOKENS · SAME CLOCK
      </text>

      {/* ============ LANE B — UI PARTS (what Waffle ships) ============ */}

      {/* FOCAL: the first part is already a working component */}
      <rect
        x="216"
        y="290"
        width="128"
        height="72"
        rx="6"
        fill="var(--dg-ink)"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
      />
      <text
        x="280"
        y="318"
        fill="var(--dg-paper)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Competency 01
      </text>
      <text
        x="280"
        y="334"
        fill="var(--dg-paper)"
        opacity="0.78"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        weighted · live
      </text>
      <text
        x="280"
        y="348"
        fill="var(--dg-paper)"
        opacity="0.58"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        expand · export
      </text>

      <rect
        x="360"
        y="290"
        width="128"
        height="72"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="424"
        y="318"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Competency 02
      </text>
      <text
        x="424"
        y="334"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        mounts beside 01
      </text>
      <text
        x="424"
        y="348"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        no reflow
      </text>

      <rect
        x="504"
        y="290"
        width="128"
        height="72"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="568"
        y="318"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Questions
      </text>
      <text
        x="568"
        y="334"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        behavioral set
      </text>
      <text
        x="568"
        y="348"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        per competency
      </text>

      <rect
        x="648"
        y="290"
        width="128"
        height="72"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="712"
        y="318"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Rubric
      </text>
      <text
        x="712"
        y="334"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        scoring bands
      </text>
      <text
        x="712"
        y="348"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        1 to 5, defined
      </text>

      {/* The stream-end column is empty on purpose — there is no gate to run */}
      <text
        x="856"
        y="318"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.10em"
      >
        NO PARSE STEP
      </text>
      <text
        x="856"
        y="334"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.10em"
      >
        NOTHING TO HYDRATE
      </text>

      {/* Lane B interactive interval — the full clock */}
      <rect
        x="216"
        y="398"
        width="704"
        height="16"
        rx="3"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="568"
        y="409"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        INTERACTIVE FROM THE FIRST PART
      </text>

      {/* ============ LEGEND (horizontal bottom strip) ============ */}
      <line
        x1="40"
        y1="492"
        x2="920"
        y2="492"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="40"
        y="522"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        LEGEND
      </text>

      <rect
        x="140"
        y="512"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="158"
        y="522"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Mounted component
      </text>

      <rect
        x="268"
        y="512"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-ink)"
      />
      <text
        x="286"
        y="522"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Focal — usable on arrival
      </text>

      <rect
        x="434"
        y="513"
        width="20"
        height="10"
        rx="3"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="462"
        y="522"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        The path not taken
      </text>

      <rect
        x="576"
        y="512"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="594"
        y="522"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Interactive interval
      </text>

      <line
        x1="718"
        y1="518"
        x2="740"
        y2="518"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#wf-arrow)"
      />
      <text
        x="750"
        y="522"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Mounts into the page
      </text>
    </svg>
  );
}
