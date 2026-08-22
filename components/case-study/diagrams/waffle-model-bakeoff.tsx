"use client";

/**
 * Waffle — the same twenty job descriptions, run twice.
 *
 * The decision this illustrates is "Claude over GPT-4 for scorecard
 * generation". The evidence is a bake-off, so the figure is a tally rather than
 * a flow: twenty cells, one per job description, and what it took to get a
 * usable rubric out of each.
 *
 * The two rows are deliberately encoded differently, because the case study
 * records different things about them. Claude's result is per-description —
 * first pass, ninety per cent of the time — so its row is twenty marks and
 * eighteen of them are filled. GPT-4's is recorded for the set: three rounds of
 * refinement to get bias out. Drawing GPT-4 as twenty cells with invented
 * per-description counts would fabricate a resolution the test never had, so
 * its row is the three rounds themselves, spanning the whole set, and the
 * figure says so in its own type.
 *
 * The price sits under both, unhidden: Claude costs about fifteen per cent more
 * per scorecard. The counterweight is not a benchmark but a production fact —
 * three months, no complaints about a biased question.
 *
 * Inversion is spent once, on the eighteen first-pass cells, because "usable
 * without a second prompt" is the entire claim.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark.
 */
export function WaffleModelBakeoffDiagram() {
  const cells = Array.from({ length: 20 }, (_, index) => index);

  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 960 520"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="waffle-bakeoff-title waffle-bakeoff-desc"
    >
      <title id="waffle-bakeoff-title">
        Twenty job descriptions, two models, what each pass cost
      </title>
      <desc id="waffle-bakeoff-desc">
        A tally of one head-to-head test: the same twenty job descriptions and
        the same prompts, run through both models. The upper row is GPT-4, drawn
        quiet because it was not chosen. It is faster to generate, and it is
        shown as three rounds of refinement running the width of the set,
        because that is how the result was recorded — for the set, not per
        description — with the note that the first two rounds were spent
        removing biased language around age, gender and cultural assumptions.
        The lower row is Claude, what shipped. It is twenty cells, one per job
        description: eighteen filled solid, meaning the rubric met the
        bias-reducing standard on the first pass, and two outlined, meaning it
        needed another round. That is the ninety per cent the case study
        reports. Below both, the exchange is stated plainly — Claude costs
        roughly fifteen per cent more per scorecard, against three months in
        production with no customer complaint about a biased question.
      </desc>
      <defs>
        <marker
          id="wb-arrow-quiet"
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

      {/* ============ HEADER ============ */}
      <text
        x="40"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        TWENTY JOB DESCRIPTIONS · IDENTICAL PROMPTS · BOTH MODELS
      </text>
      <line
        x1="40"
        y1="64"
        x2="920"
        y2="64"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />

      {/* ============ GPT-4: THREE ROUNDS ACROSS THE SET ============ */}
      <text x="40" y="118" fill="var(--dg-quiet)" fontSize="13">
        GPT-4
      </text>
      <text
        x="40"
        y="136"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        FASTER TO GENERATE
      </text>

      <rect
        x="200"
        y="98"
        width="196"
        height="46"
        rx="4"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="298"
        y="120"
        fill="var(--dg-quiet)"
        fontSize="12"
        textAnchor="middle"
      >
        Round 1
      </text>
      <text
        x="298"
        y="136"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        biased language present
      </text>

      <line
        x1="396"
        y1="121"
        x2="416"
        y2="121"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        markerEnd="url(#wb-arrow-quiet)"
      />

      <rect
        x="424"
        y="98"
        width="196"
        height="46"
        rx="4"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="522"
        y="120"
        fill="var(--dg-quiet)"
        fontSize="12"
        textAnchor="middle"
      >
        Round 2
      </text>
      <text
        x="522"
        y="136"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        age · gender · culture
      </text>

      <line
        x1="620"
        y1="121"
        x2="640"
        y2="121"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        markerEnd="url(#wb-arrow-quiet)"
      />

      <rect
        x="648"
        y="98"
        width="196"
        height="46"
        rx="4"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="746"
        y="120"
        fill="var(--dg-quiet)"
        fontSize="12"
        textAnchor="middle"
      >
        Round 3
      </text>
      <text
        x="746"
        y="136"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        usable
      </text>

      <text
        x="200"
        y="172"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        RECORDED FOR THE SET, NOT PER DESCRIPTION — SO THIS ROW IS ROUNDS, NOT
        CELLS
      </text>

      {/* ============ CLAUDE: TWENTY CELLS ============ */}
      <line
        x1="40"
        y1="212"
        x2="920"
        y2="212"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text x="40" y="262" fill="var(--dg-ink)" fontSize="13">
        Claude
      </text>
      <text
        x="40"
        y="280"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        WHAT SHIPPED
      </text>

      {cells.map((index) => {
        const firstPass = index < 18;
        const x = 200 + index * 36;

        return firstPass ? (
          <rect
            key={index}
            x={x}
            y="240"
            width="28"
            height="44"
            rx="3"
            fill="var(--dg-ink)"
          />
        ) : (
          <rect
            key={index}
            x={x}
            y="240"
            width="28"
            height="44"
            rx="3"
            fill="none"
            stroke="var(--dg-edge)"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
        );
      })}

      <line
        x1="200"
        y1="298"
        x2="912"
        y2="298"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="200"
        y="316"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        18 OF 20 CLEAN ON THE FIRST PASS
      </text>
      <text
        x="912"
        y="316"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="end"
      >
        2 NEEDED ANOTHER
      </text>

      {/* ============ WHAT IT COSTS, AND WHAT IT BOUGHT ============ */}
      <line
        x1="40"
        y1="358"
        x2="920"
        y2="358"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="40"
        y="384"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        THE PRICE
      </text>
      <text x="200" y="384" fill="var(--dg-prose)" fontSize="11">
        About fifteen per cent more per scorecard, on every scorecard.
      </text>
      <text
        x="40"
        y="414"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        WHAT IT BOUGHT
      </text>
      <text x="200" y="414" fill="var(--dg-ink)" fontSize="11">
        Three months in production with no complaint about a biased question.
      </text>
      <text x="200" y="436" fill="var(--dg-quiet)" fontSize="11">
        Not a benchmark. The thing the benchmark was standing in for.
      </text>

      {/* ============ LEGEND ============ */}
      <line
        x1="40"
        y1="464"
        x2="920"
        y2="464"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="40"
        y="492"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        LEGEND
      </text>
      <rect
        x="140"
        y="482"
        width="20"
        height="12"
        rx="2"
        fill="var(--dg-ink)"
      />
      <text
        x="170"
        y="492"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        One description, usable first pass
      </text>
      <rect
        x="440"
        y="482"
        width="20"
        height="12"
        rx="2"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
        strokeDasharray="3,3"
      />
      <text
        x="470"
        y="492"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Needed another round
      </text>
      <rect
        x="700"
        y="482"
        width="20"
        height="12"
        rx="2"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="730"
        y="492"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        The model not chosen
      </text>
    </svg>
  );
}
