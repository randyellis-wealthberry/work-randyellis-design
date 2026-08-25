"use client";

/**
 * Oh!Plays — what a lab holds still.
 *
 * The decision this illustrates is "testing in schools instead of a lab". The
 * mechanism is not the location, it is which variables each setting controls:
 * a lab earns its repeatability by holding constant exactly the conditions a
 * student edits under. So the figure is a control table — one row per variable,
 * one column per setting, and a mark saying whether that setting pins the
 * variable or lets it vary.
 *
 * The four variables are the four the case study names as having surfaced in
 * the real setting: noise, lighting, one-handed use and time pressure. Nothing
 * is added to round the table out, and no interface change is attributed to any
 * row — the case study says these constraints shaped the interface more than
 * the seated sessions did, but never says which change came from which
 * constraint, and a table with a consequences column would invent that.
 *
 * The lab column is not drawn as a failure. What it buys is stated plainly,
 * because it is real and it is what the decision gave up.
 *
 * Inversion is spent once, on the field column header, because choosing the
 * uncontrolled setting IS the decision.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark.
 */
export function OhPlaysFieldConditionsDiagram() {
  const rows = [
    {
      label: "Sound",
      lab: "silent, by design",
      field: "a hallway between periods",
    },
    {
      label: "Light",
      lab: "even and controlled",
      field: "whatever the locker room has",
    },
    {
      label: "Hands",
      lab: "two, seated at a desk",
      field: "one, standing, bag on shoulder",
    },
    {
      label: "Time",
      lab: "as long as the session runs",
      field: "until the next bell",
    },
  ];

  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 960 520"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="ohplays-field-title ohplays-field-desc"
    >
      <title id="ohplays-field-title">
        Which conditions each setting holds constant
      </title>
      <desc id="ohplays-field-desc">
        A control table with one row per variable and one column per test
        setting. The variables are sound, light, hands and time — the four the
        case study names as having surfaced once testing moved out of a
        facility. The lab column, quiet because it was not chosen, pins every
        one of them: silence by design, even lighting, two hands at a desk, and
        a session that runs as long as it needs to. The field column, drawn
        inverted because it is what shipped, pins none of them: a hallway
        between periods, whatever light the locker room has, one hand with a bag
        on the shoulder, and time that ends at the next bell. Beneath the table,
        what the lab genuinely buys is stated rather than dismissed — control,
        repeatability, and sessions that are far easier to schedule — against
        the point of the decision: a setting that holds those four variables
        still is a setting that cannot show you what they do.
      </desc>

      <rect width="100%" height="100%" fill="var(--dg-paper)" />

      {/* ============ HEADERS ============ */}
      <text
        x="40"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        THE SAME TASK, TWO PLACES TO WATCH SOMEONE DO IT
      </text>
      <line
        x1="40"
        y1="64"
        x2="920"
        y2="64"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />

      <text
        x="40"
        y="102"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        VARIABLE
      </text>
      <text
        x="300"
        y="102"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        IN A LAB · HELD CONSTANT
      </text>
      <rect
        x="620"
        y="88"
        width="300"
        height="20"
        rx="3"
        fill="var(--dg-ink)"
      />
      <text
        x="632"
        y="102"
        fill="var(--dg-paper)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        IN A SCHOOL · LEFT ALONE
      </text>
      <line
        x1="40"
        y1="116"
        x2="920"
        y2="116"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />

      {/* ============ ROWS ============ */}
      {rows.map((row, index) => {
        const y = 140 + index * 62;

        return (
          <g key={row.label}>
            <text x="40" y={y + 18} fill="var(--dg-ink)" fontSize="13">
              {row.label}
            </text>

            {/* Lab: pinned — a flat line under a closed mark */}
            <rect
              x="300"
              y={y}
              width="20"
              height="20"
              rx="3"
              fill="none"
              stroke="var(--dg-quiet)"
              strokeWidth="1"
            />
            <line
              x1="305"
              y1={y + 10}
              x2="315"
              y2={y + 10}
              stroke="var(--dg-quiet)"
              strokeWidth="1.4"
            />
            <text x="332" y={y + 14} fill="var(--dg-quiet)" fontSize="11">
              {row.lab}
            </text>

            {/* Field: free — the same mark, unpinned and varying */}
            <rect
              x="620"
              y={y}
              width="20"
              height="20"
              rx="3"
              fill="var(--dg-ink)"
            />
            <path
              d={`M 624,${y + 14} L 628,${y + 6} L 632,${y + 15} L 636,${y + 8}`}
              fill="none"
              stroke="var(--dg-paper)"
              strokeWidth="1.4"
            />
            <text x="652" y={y + 14} fill="var(--dg-ink)" fontSize="11">
              {row.field}
            </text>

            <line
              x1="40"
              y1={y + 40}
              x2="920"
              y2={y + 40}
              stroke="var(--dg-hairline)"
              strokeWidth="0.8"
            />
          </g>
        );
      })}

      {/* ============ WHAT EACH SIDE COSTS ============ */}
      <text
        x="300"
        y="418"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        WHAT THE LAB BUYS
      </text>
      <text x="300" y="440" fill="var(--dg-quiet)" fontSize="11">
        Control, repeatability, and a session you can
      </text>
      <text x="300" y="458" fill="var(--dg-quiet)" fontSize="11">
        actually schedule. All of it real, all of it given up.
      </text>

      <text
        x="620"
        y="418"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        WHY IT WAS GIVEN UP
      </text>
      <text x="620" y="440" fill="var(--dg-ink)" fontSize="11">
        A setting that holds these four still is a
      </text>
      <text x="620" y="458" fill="var(--dg-ink)" fontSize="11">
        setting that cannot show you what they do.
      </text>

      {/* ============ LEGEND ============ */}
      <line
        x1="40"
        y1="482"
        x2="920"
        y2="482"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <rect
        x="40"
        y="498"
        width="16"
        height="16"
        rx="3"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
      />
      <line
        x1="44"
        y1="506"
        x2="52"
        y2="506"
        stroke="var(--dg-quiet)"
        strokeWidth="1.4"
      />
      <text
        x="66"
        y="511"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Pinned by the setting
      </text>
      <rect
        x="300"
        y="498"
        width="16"
        height="16"
        rx="3"
        fill="var(--dg-ink)"
      />
      <path
        d="M 303,510 L 306,503 L 309,511 L 313,504"
        fill="none"
        stroke="var(--dg-paper)"
        strokeWidth="1.4"
      />
      <text
        x="326"
        y="511"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Left to vary — which is what there was to learn
      </text>
    </svg>
  );
}
