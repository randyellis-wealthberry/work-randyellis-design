"use client";

/**
 * Waffle — what arrives, and when.
 *
 * The decision this illustrates is "generative UI over plain text streaming",
 * and that decision is a claim about *when* a scorecard becomes usable. A claim
 * about time deserves a time axis, so this is a timing chart — a waterfall, or
 * a logic-analyser trace — rather than boxes joined by arrows. Everything is a
 * bar positioned on one shared horizontal axis; where a bar starts is the whole
 * argument, and no arrangement of nodes can say that as plainly as a measured
 * left edge.
 *
 * The axis is ordinal on purpose. The case study records no latencies, so the
 * ticks mark the order things arrive in, not milliseconds, and the figure says
 * so in its own type rather than letting a reader infer a benchmark that was
 * never run.
 *
 * Two traces share the axis. The upper one — plain text, the path not built —
 * is a single buffer bar running the length of the stream, a parse-and-hydrate
 * gate standing after the last token, and an interactive interval that cannot
 * begin until the gate clears. The lower one — the typed UI parts Waffle ships
 * — is four short arrival bars, each spawning its own interactive interval that
 * starts the moment that part lands and runs to the end, so usable area
 * accumulates left to right as a staircase. The position where the upper
 * trace's gate falls is deliberately empty on the lower trace: there is nothing
 * left to parse, and that emptiness is part of the argument.
 *
 * Between the traces sits the payoff — a measure line spanning the two first
 * interactive moments. It is the one device on the site that measures rather
 * than connects.
 *
 * Encoding: the path not taken is washed fill and quiet type, never dashes.
 * Solid ink is reserved for what shipped, and inversion (ink fill, paper text)
 * is spent exactly once, on the first part's interactive interval, because
 * "the rubric works before the second part arrives" is the claim.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark.
 */
export function WaffleStreamDiagram() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 960 520"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="waffle-stream-title waffle-stream-desc"
    >
      <title id="waffle-stream-title">
        Time to first interaction, two ways
      </title>
      <desc id="waffle-stream-desc">
        A timing chart. One horizontal axis marks the order in which a scorecard
        stream arrives — stream start, parts one through four, stream end, and
        the region after the last token — as ordinal sequence, not measured
        milliseconds. Two traces of bars share that axis, and both are the same
        model emitting the same tokens on the same clock; only the client
        differs. The upper trace, plain-text streaming, is the path Waffle did
        not build: one long washed bar shows a text buffer accumulating across
        the whole stream without ever becoming a component, a parse-and-hydrate
        gate stands after the last token, and only past that gate does a short
        interactive interval begin. The lower trace, the typed UI parts Waffle
        ships, shows four short arrival bars — competency one, competency two,
        the behavioral question set, and the rubric — each spawning its own
        interactive interval that starts the moment that part lands and runs to
        the end, so the interactive area accumulates left to right as a
        staircase. The first of those intervals is drawn solid because a working
        rubric exists before the second part has arrived. A measure line between
        the two traces spans their first interactive moments, and the column
        where the upper trace&apos;s gate falls is left empty on the lower
        trace: there is nothing there to parse.
      </desc>

      <rect width="100%" height="100%" fill="var(--dg-paper)" />

      <defs>
        <marker
          id="wf-measure"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-ink)" />
        </marker>
      </defs>

      {/* ============ TIME AXIS ============ */}
      <text
        x="40"
        y="60"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        SEQUENCE
      </text>

      <text
        x="216"
        y="46"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        STREAM START
      </text>
      <text
        x="320"
        y="46"
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
        y="46"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        PART 02
      </text>
      <text
        x="528"
        y="46"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        PART 03
      </text>
      <text
        x="632"
        y="46"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        PART 04
      </text>
      <text
        x="736"
        y="46"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        STREAM END
      </text>
      <text
        x="840"
        y="46"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.10em"
      >
        AFTER THE LAST TOKEN
      </text>

      <line
        x1="216"
        y1="56"
        x2="920"
        y2="56"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <line
        x1="216"
        y1="50"
        x2="216"
        y2="62"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <line
        x1="320"
        y1="50"
        x2="320"
        y2="62"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <line
        x1="424"
        y1="50"
        x2="424"
        y2="62"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <line
        x1="528"
        y1="50"
        x2="528"
        y2="62"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <line
        x1="632"
        y1="50"
        x2="632"
        y2="62"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <line
        x1="736"
        y1="50"
        x2="736"
        y2="62"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />

      {/* The axis is ordinal. Say so, rather than let a reader read a benchmark. */}
      <text
        x="216"
        y="78"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.06em"
      >
        ORDINAL SEQUENCE, NOT MEASURED TIME · TICKS MARK ORDER OF ARRIVAL, NOT
        MILLISECONDS
      </text>
      {/* Load-bearing: without this the figure reads as two models, not two clients. */}
      <text
        x="216"
        y="94"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.06em"
      >
        SAME MODEL · SAME TOKENS · SAME CLOCK — THE ONLY VARIABLE IS WHAT THE
        CLIENT DOES WITH EACH PART
      </text>

      {/* ============ PLOT FRAME + GRID ============ */}
      <line
        x1="40"
        y1="104"
        x2="920"
        y2="104"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <line
        x1="40"
        y1="394"
        x2="920"
        y2="394"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <line
        x1="200"
        y1="104"
        x2="200"
        y2="394"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />

      <line
        x1="216"
        y1="104"
        x2="216"
        y2="394"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <line
        x1="320"
        y1="104"
        x2="320"
        y2="394"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <line
        x1="424"
        y1="104"
        x2="424"
        y2="394"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <line
        x1="528"
        y1="104"
        x2="528"
        y2="394"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <line
        x1="632"
        y1="104"
        x2="632"
        y2="394"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <line
        x1="736"
        y1="104"
        x2="736"
        y2="394"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <line
        x1="920"
        y1="104"
        x2="920"
        y2="394"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />

      {/* ============ TRACE A — PLAIN TEXT (washed: the path not taken) ============ */}
      <text
        x="40"
        y="134"
        fill="var(--dg-quiet)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
      >
        Plain-text streaming
      </text>
      <text
        x="40"
        y="150"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        THE PATH NOT TAKEN
      </text>

      {/* One accumulating buffer, the whole length of the stream */}
      <rect
        x="216"
        y="122"
        width="520"
        height="24"
        rx="2"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="476"
        y="137"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        text buffer accumulates · still one unparsed blob
      </text>

      {/* The terminal gate: nothing crosses it until the whole blob has been read */}
      <line
        x1="768"
        y1="114"
        x2="768"
        y2="186"
        stroke="var(--dg-quiet)"
        strokeWidth="1.2"
      />
      <line
        x1="761"
        y1="114"
        x2="775"
        y2="114"
        stroke="var(--dg-quiet)"
        strokeWidth="1.2"
      />
      <line
        x1="761"
        y1="186"
        x2="775"
        y2="186"
        stroke="var(--dg-quiet)"
        strokeWidth="1.2"
      />
      <text
        x="780"
        y="132"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.08em"
      >
        PARSE + HYDRATE GATE
      </text>
      <text
        x="780"
        y="144"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.08em"
      >
        ONE PASS OVER THE BLOB
      </text>

      {/* Its interactive interval can only start past the gate */}
      <rect
        x="768"
        y="166"
        width="152"
        height="18"
        rx="8"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="844"
        y="178"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        INTERACTIVE
      </text>

      {/* ============ THE MEASURE — time to first interaction ============ */}
      <rect x="428" y="214" width="232" height="34" fill="var(--dg-paper)" />
      <line
        x1="320"
        y1="206"
        x2="320"
        y2="258"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <line
        x1="768"
        y1="206"
        x2="768"
        y2="258"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <line
        x1="434"
        y1="232"
        x2="322"
        y2="232"
        stroke="var(--dg-ink)"
        strokeWidth="1"
        markerEnd="url(#wf-measure)"
      />
      <line
        x1="654"
        y1="232"
        x2="766"
        y2="232"
        stroke="var(--dg-ink)"
        strokeWidth="1"
        markerEnd="url(#wf-measure)"
      />
      <text
        x="544"
        y="228"
        fill="var(--dg-ink)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        TIME TO FIRST INTERACTION
      </text>
      <text
        x="544"
        y="242"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.08em"
      >
        THREE MORE PARTS AND ONE PARSE PASS
      </text>

      {/* ============ TRACE B — TYPED UI PARTS (what shipped) ============ */}
      <text
        x="40"
        y="325"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
      >
        Typed UI parts
      </text>
      <text
        x="40"
        y="341"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        WHAT SHIPPED
      </text>

      {/* Four parts, arriving in sequence */}
      <rect
        x="320"
        y="272"
        width="96"
        height="20"
        rx="2"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="368"
        y="286"
        fill="var(--dg-ink)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        competency 01
      </text>

      <rect
        x="424"
        y="272"
        width="96"
        height="20"
        rx="2"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="472"
        y="286"
        fill="var(--dg-ink)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        competency 02
      </text>

      <rect
        x="528"
        y="272"
        width="96"
        height="20"
        rx="2"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="576"
        y="286"
        fill="var(--dg-ink)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        questions
      </text>

      <rect
        x="632"
        y="272"
        width="96"
        height="20"
        rx="2"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="680"
        y="286"
        fill="var(--dg-ink)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        rubric
      </text>

      {/* FOCAL: the first part is usable before the second one exists */}
      <rect
        x="320"
        y="304"
        width="600"
        height="16"
        rx="8"
        fill="var(--dg-ink)"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
      />
      <text
        x="332"
        y="316"
        fill="var(--dg-paper)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        COMPETENCY 01 · INTERACTIVE FROM THE MOMENT IT LANDS
      </text>

      <rect
        x="424"
        y="326"
        width="496"
        height="16"
        rx="8"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="436"
        y="338"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        COMPETENCY 02 · INTERACTIVE
      </text>

      <rect
        x="528"
        y="348"
        width="392"
        height="16"
        rx="8"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="540"
        y="360"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        QUESTIONS · INTERACTIVE
      </text>

      <rect
        x="632"
        y="370"
        width="288"
        height="16"
        rx="8"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="644"
        y="382"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        RUBRIC · INTERACTIVE
      </text>

      {/* The absence is the argument: the gate column is empty on this trace */}
      <text
        x="844"
        y="410"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        THE GATE ABOVE FALLS HERE
      </text>
      <text
        x="844"
        y="422"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        NOTHING LEFT TO PARSE
      </text>

      {/* ============ LEGEND (horizontal bottom strip) ============ */}
      <line
        x1="40"
        y1="452"
        x2="920"
        y2="452"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="40"
        y="482"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        LEGEND
      </text>

      <rect
        x="140"
        y="472"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="158"
        y="482"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        A part arrives
      </text>

      <rect
        x="250"
        y="473"
        width="20"
        height="10"
        rx="5"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="278"
        y="482"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Interactive interval
      </text>

      <rect
        x="400"
        y="473"
        width="20"
        height="10"
        rx="5"
        fill="var(--dg-ink)"
      />
      <text
        x="428"
        y="482"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Focal — usable first
      </text>

      <rect
        x="550"
        y="472"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="568"
        y="482"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        The path not taken
      </text>

      <line
        x1="691"
        y1="478"
        x2="681"
        y2="478"
        stroke="var(--dg-ink)"
        strokeWidth="1"
        markerEnd="url(#wf-measure)"
      />
      <line
        x1="691"
        y1="478"
        x2="701"
        y2="478"
        stroke="var(--dg-ink)"
        strokeWidth="1"
        markerEnd="url(#wf-measure)"
      />
      <text
        x="712"
        y="482"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Measured interval
      </text>
    </svg>
  );
}
