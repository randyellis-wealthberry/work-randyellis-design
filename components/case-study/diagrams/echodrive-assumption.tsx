"use client";

/**
 * EchoDrive — what the design was resting on.
 *
 * The decision this illustrates is "going to the drivers before designing for
 * them". The mechanism is not the interview technique, it is that an entire
 * design programme was standing on one unexamined sentence, and which sentence
 * it is decides everything built on top.
 *
 * So the figure is a foundation: the same stack drawn twice, identical except
 * for the block at the bottom. The observation is the same in both — drivers
 * were not adopting the digital tools — and both explanations account for it.
 * Only one of them had been checked.
 *
 * The upper blocks stay deliberately thin. The case study says the framing
 * leads to designing persuasion rather than designing tools, and that the
 * interviews redirected the driver-side design substantially, but it does not
 * enumerate the features on either side; listing them would be inventing the
 * work rather than drawing the decision.
 *
 * Inversion is spent once, on the foundation that was actually observed.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark.
 */
export function EchoDriveAssumptionDiagram() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 960 560"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="echo-assumption-title echo-assumption-desc"
    >
      <title id="echo-assumption-title">
        The same observation, and the two things it can be resting on
      </title>
      <desc id="echo-assumption-desc">
        One observation stated across the top: drivers were not adopting the
        digital tools. Beneath it, two stacks, identical except for the block at
        the bottom. On the left, dashed and quiet, the foundation reads
        &ldquo;drivers are resistant — a traditional, low-adoption user
        base&rdquo;, marked as assumed and never checked; the block resting on
        it is a design programme aimed at persuasion, convincing the user to
        adopt. On the right, drawn in solid ink, the foundation reads &ldquo;the
        tools were never designed for the conditions&rdquo;, marked as observed
        on site in cabs and dispatch offices; the block resting on it is a
        design programme aimed at the conditions themselves — gloves, bad
        signal, a moving vehicle. Between the two, the method that moved the
        work from one foundation to the other: on-site interviews with drivers
        and dispatchers, run at the start rather than after the design was
        drawn. A closing note observes that both explanations fit the same
        observation, that only one of them had been checked, and that the first
        one quietly blames the user.
      </desc>
      <defs>
        <marker
          id="ea-arrow-focal"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-ink)" />
        </marker>
      </defs>

      <rect width="100%" height="100%" fill="var(--dg-paper)" />

      {/* ============ THE OBSERVATION ============ */}
      <text
        x="40"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        THE OBSERVATION, WHICH NOBODY DISPUTED
      </text>
      <rect
        x="40"
        y="64"
        width="880"
        height="48"
        rx="4"
        fill="var(--dg-wash)"
      />
      <text
        x="480"
        y="94"
        fill="var(--dg-ink)"
        fontSize="14"
        textAnchor="middle"
      >
        Drivers were not adopting the digital tools.
      </text>

      <path
        d="M 260,112 V 156"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <path
        d="M 700,112 V 156"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />

      {/* ============ LEFT — THE FOUNDATION NOBODY CHECKED ============ */}
      <rect
        x="40"
        y="156"
        width="420"
        height="96"
        rx="4"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="56"
        y="178"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        WHAT GETS BUILT ON IT
      </text>
      <text
        x="250"
        y="212"
        fill="var(--dg-quiet)"
        fontSize="14"
        textAnchor="middle"
      >
        Persuasion
      </text>
      <text
        x="250"
        y="234"
        fill="var(--dg-quiet)"
        fontSize="11"
        textAnchor="middle"
      >
        work aimed at convincing the user to adopt
      </text>

      <rect
        x="40"
        y="260"
        width="420"
        height="88"
        rx="4"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1.4"
        strokeDasharray="4,4"
      />
      <text
        x="56"
        y="284"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        THE FOUNDATION · ASSUMED, NEVER CHECKED
      </text>
      <text
        x="250"
        y="312"
        fill="var(--dg-quiet)"
        fontSize="13"
        textAnchor="middle"
      >
        &ldquo;Drivers are resistant.&rdquo;
      </text>
      <text
        x="250"
        y="332"
        fill="var(--dg-quiet)"
        fontSize="11"
        textAnchor="middle"
      >
        a traditional, low-adoption user base
      </text>

      {/* ============ RIGHT — THE FOUNDATION THAT WAS LOOKED AT ============ */}
      <rect
        x="500"
        y="156"
        width="420"
        height="96"
        rx="4"
        fill="none"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
      />
      <text
        x="516"
        y="178"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        WHAT GETS BUILT ON IT
      </text>
      <text
        x="710"
        y="212"
        fill="var(--dg-ink)"
        fontSize="14"
        textAnchor="middle"
      >
        Tools
      </text>
      <text
        x="710"
        y="234"
        fill="var(--dg-prose)"
        fontSize="11"
        textAnchor="middle"
      >
        work aimed at gloves, bad signal, a moving cab
      </text>

      <rect
        x="500"
        y="260"
        width="420"
        height="88"
        rx="4"
        fill="var(--dg-ink)"
      />
      <text
        x="516"
        y="284"
        fill="var(--dg-paper)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
        opacity="0.85"
      >
        THE FOUNDATION · OBSERVED ON SITE
      </text>
      <text
        x="710"
        y="312"
        fill="var(--dg-paper)"
        fontSize="13"
        textAnchor="middle"
      >
        &ldquo;The tools were never designed
      </text>
      <text
        x="710"
        y="332"
        fill="var(--dg-paper)"
        fontSize="13"
        textAnchor="middle"
      >
        for these conditions.&rdquo;
      </text>

      {/* ============ WHAT MOVED IT ============ */}
      <line
        x1="470"
        y1="304"
        x2="492"
        y2="304"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#ea-arrow-focal)"
      />
      <line
        x1="40"
        y1="386"
        x2="920"
        y2="386"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="40"
        y="412"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        WHAT MOVED IT
      </text>
      <text x="200" y="412" fill="var(--dg-ink)" fontSize="11">
        On-site interviews with drivers and dispatchers, run at the start —
        before the design existed to defend.
      </text>

      <text
        x="40"
        y="452"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        WHY IT MATTERED
      </text>
      <text x="200" y="452" fill="var(--dg-prose)" fontSize="11">
        Both explanations fit the observation exactly. Only one of them had been
        looked at, and it was
      </text>
      <text x="200" y="470" fill="var(--dg-prose)" fontSize="11">
        the one that quietly blames the user — which is how a team ends up
        designing persuasion for
      </text>
      <text x="200" y="488" fill="var(--dg-prose)" fontSize="11">
        people who were never the problem.
      </text>

      {/* ============ LEGEND ============ */}
      <line
        x1="40"
        y1="514"
        x2="920"
        y2="514"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <rect
        x="40"
        y="530"
        width="20"
        height="14"
        rx="2"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="70"
        y="541"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Believed
      </text>
      <rect
        x="240"
        y="530"
        width="20"
        height="14"
        rx="2"
        fill="var(--dg-ink)"
      />
      <text
        x="270"
        y="541"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Seen
      </text>
    </svg>
  );
}
