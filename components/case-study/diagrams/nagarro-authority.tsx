"use client";

/**
 * Nagarro — the boundary a mandate could not cross.
 *
 * The decision this illustrates is "evangelism instead of enforcement": Head of
 * Design for 18,000 people, direct authority over 15. The figure is built
 * around a single vertical wall because that is the whole mechanism — the same
 * document, authored twice, meets the same limit of authority and only one
 * version survives the crossing. A mandate arrives on the far side with nothing
 * behind it, so it is drawn as the counterfactual it is: dashed, quiet, and
 * ending in a dead node. The public argument crosses because teams pull it,
 * and the proof it generates travels back to buy the next round of adoption —
 * which is why the only loop in the drawing runs right to left.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark.
 */
export function NagarroAuthorityDiagram() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 900 520"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="nagarro-authority-title nagarro-authority-desc"
    >
      <title id="nagarro-authority-title">
        Why a mandate could not cross the line
      </title>
      <desc id="nagarro-authority-desc">
        One accessibility strategy, authored two ways, meeting a vertical
        boundary that separates 15 designers under direct authority from 18,000
        people across 36 countries under none. The upper route — attaching the
        strategy to a delivery gate — crosses the boundary as a dashed,
        unenforceable line and ends in a dead node labelled compliance theatre,
        with nothing after it. The lower route — arguing the framework in public
        through articles and a keynote — crosses on a solid line labelled teams
        opt in, and reaches the focal node: adoption without a mandate, three
        times the previous rate. That node feeds a business-proof node holding
        100+ leads, 50% brand recognition growth and 10K+ subscribers, and a
        return line carries that proof back across the boundary to the public
        argument, which is the only lever that compounds.
      </desc>
      <defs>
        <marker
          id="ng-arrow"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-prose)" />
        </marker>
        <marker
          id="ng-arrow-focal"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-ink)" />
        </marker>
        <marker
          id="ng-arrow-quiet"
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

      {/* ============ REGION HEADERS ============ */}
      <text
        x="216"
        y="26"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        DIRECT AUTHORITY · 15 DESIGNERS
      </text>
      <text
        x="648"
        y="26"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        NO AUTHORITY · 18,000 IN 36 COUNTRIES
      </text>
      <line
        x1="40"
        y1="42"
        x2="860"
        y2="42"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />

      {/* ============ THE WALL — limit of authority ============ */}
      <rect
        x="424"
        y="48"
        width="12"
        height="382"
        fill="var(--dg-ink)"
        opacity="0.08"
      />
      <line
        x1="424"
        y1="48"
        x2="424"
        y2="430"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <line
        x1="436"
        y1="48"
        x2="436"
        y2="430"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />

      {/* ============ ROUTE CHIPS ============ */}
      <text
        x="232"
        y="100"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        THE INSTINCT
      </text>
      <text
        x="232"
        y="290"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        WHAT I DID
      </text>

      {/* ============ ARROWS (drawn before boxes) ============ */}
      {/* Fork up: the document, written as a rule */}
      <path
        d="M 190,224 H 200 Q 206,224 206,218 V 156 Q 206,150 212,150 H 224"
        fill="none"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#ng-arrow)"
      />
      {/* Fork down: the document, written as an argument */}
      <path
        d="M 190,264 H 200 Q 206,264 206,270 V 334 Q 206,340 212,340 H 224"
        fill="none"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#ng-arrow)"
      />
      {/* Route A crosses the wall with nothing behind it */}
      <line
        x1="392"
        y1="150"
        x2="488"
        y2="150"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        markerEnd="url(#ng-arrow-quiet)"
      />
      {/* FOCAL crossing: pulled across, not pushed */}
      <line
        x1="392"
        y1="340"
        x2="488"
        y2="340"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#ng-arrow-focal)"
      />
      {/* Adoption produces something the business can read */}
      <line
        x1="676"
        y1="340"
        x2="702"
        y2="340"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#ng-arrow)"
      />
      {/* The loop: proof returns across the wall and funds the next round */}
      <path
        d="M 785,380 V 404 Q 785,412 777,412 H 320 Q 312,412 312,404 V 388"
        fill="none"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#ng-arrow)"
      />

      {/* ============ LINE LABELS (plate first, 10px clear of every stroke) ============ */}
      <rect
        x="404"
        y="126"
        width="80"
        height="14"
        rx="2"
        fill="var(--dg-paper)"
      />
      <text
        x="444"
        y="136"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        UNENFORCEABLE
      </text>

      <rect
        x="406"
        y="316"
        width="76"
        height="14"
        rx="2"
        fill="var(--dg-paper)"
      />
      <text
        x="444"
        y="326"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        TEAMS OPT IN
      </text>

      <rect
        x="396"
        y="404"
        width="96"
        height="16"
        rx="2"
        fill="var(--dg-paper)"
      />
      <text
        x="444"
        y="415"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        PROOF COMES BACK
      </text>

      {/* Wall label, in the open corridor between the two routes */}
      <rect
        x="396"
        y="228"
        width="68"
        height="32"
        rx="2"
        fill="var(--dg-paper)"
      />
      <text
        x="430"
        y="241"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        LIMIT OF
      </text>
      <text
        x="430"
        y="255"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        AUTHORITY
      </text>

      {/* ============ ORIGIN — the one document ============ */}
      <rect
        x="40"
        y="200"
        width="150"
        height="88"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="115"
        y="228"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Accessibility
      </text>
      <text
        x="115"
        y="244"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Strategy 2023
      </text>
      <text
        x="115"
        y="262"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        one document
      </text>
      <text
        x="115"
        y="275"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        two ways to send it
      </text>

      {/* ============ ROUTE A — the mandate, drawn as the counterfactual ============ */}
      <rect
        x="232"
        y="110"
        width="160"
        height="80"
        rx="6"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="312"
        y="142"
        fill="var(--dg-quiet)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Attach it to a gate
      </text>
      <text
        x="312"
        y="160"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        policy · delivery review
      </text>
      <text
        x="312"
        y="173"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        the instinct at scale
      </text>

      <rect
        x="496"
        y="110"
        width="180"
        height="80"
        rx="6"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="586"
        y="142"
        fill="var(--dg-quiet)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Compliance theatre
      </text>
      <text
        x="586"
        y="160"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        signed off, not used
      </text>
      <text
        x="586"
        y="173"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        and resented quietly
      </text>

      {/* ============ ROUTE B — the argument ============ */}
      <rect
        x="232"
        y="300"
        width="160"
        height="80"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="312"
        y="332"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Argue it in public
      </text>
      <text
        x="312"
        y="350"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        framework, not a gate
      </text>
      <text
        x="312"
        y="363"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        15+ articles · keynote
      </text>

      {/* FOCAL: solid ink fill, paper text — adoption I could not compel */}
      <rect
        x="496"
        y="300"
        width="180"
        height="80"
        rx="6"
        fill="var(--dg-ink)"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
      />
      <text
        x="586"
        y="332"
        fill="var(--dg-paper)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Adopted, not issued
      </text>
      <text
        x="586"
        y="350"
        fill="var(--dg-paper)"
        opacity="0.78"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        no gate · no mandate
      </text>
      <text
        x="586"
        y="363"
        fill="var(--dg-paper)"
        opacity="0.58"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        3× adoption
      </text>

      <rect
        x="710"
        y="300"
        width="150"
        height="80"
        rx="6"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="785"
        y="326"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Business proof
      </text>
      <text
        x="785"
        y="342"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        100+ leads
      </text>
      <text
        x="785"
        y="355"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        +50% brand recognition
      </text>
      <text
        x="785"
        y="368"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        10K+ subscribers
      </text>

      {/* ============ LEGEND — two rows ============ */}
      <line
        x1="40"
        y1="444"
        x2="860"
        y2="444"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="40"
        y="474"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        LEGEND
      </text>

      <rect
        x="110"
        y="464"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="132"
        y="474"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Act inside my authority
      </text>

      <rect
        x="290"
        y="464"
        width="12"
        height="12"
        rx="2"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="312"
        y="474"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        The route not taken
      </text>

      <rect
        x="440"
        y="464"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-ink)"
      />
      <text
        x="462"
        y="474"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Focal — adoption by consent
      </text>

      <rect
        x="640"
        y="464"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="662"
        y="474"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        What it produced
      </text>

      <line
        x1="110"
        y1="492"
        x2="132"
        y2="492"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#ng-arrow-focal)"
      />
      <text
        x="142"
        y="496"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Crossed by consent
      </text>

      <line
        x1="280"
        y1="492"
        x2="302"
        y2="492"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#ng-arrow)"
      />
      <text
        x="312"
        y="496"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Sequence, and proof returning
      </text>

      <line
        x1="500"
        y1="492"
        x2="522"
        y2="492"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        markerEnd="url(#ng-arrow-quiet)"
      />
      <text
        x="532"
        y="496"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Push with nothing behind it
      </text>

      <rect
        x="700"
        y="486"
        width="12"
        height="12"
        fill="var(--dg-ink)"
        opacity="0.08"
      />
      <line
        x1="700"
        y1="486"
        x2="700"
        y2="498"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <line
        x1="712"
        y1="486"
        x2="712"
        y2="498"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="722"
        y="496"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Limit of authority
      </text>
    </svg>
  );
}
