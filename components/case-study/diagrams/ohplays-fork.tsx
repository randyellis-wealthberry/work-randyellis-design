"use client";

/**
 * Oh!Plays — the argument, settled by a session.
 *
 * The decision this illustrates is "testing both editing models instead of
 * arguing about them". Gesture editing versus a conventional timeline was a
 * matter of taste until both were actually built and put in front of the same
 * students, so the figure is a fork with a gate in the middle of it: one
 * unsettled question splits into two builds, both builds pass through one
 * session, and only then does one branch carry forward while the other is set
 * aside.
 *
 * The session is the focal element, not the winning branch. Inverting the
 * winner would only restate that gestures won; inverting the session says the
 * thing the decision actually turns on — that the question was closed by
 * watching students, under the conditions they really use a phone in, rather
 * than by whoever argued hardest.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark. Nothing
 * here is a fixed hex.
 */
export function OhPlaysForkDiagram() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 960 448"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="ohplays-fork-title ohplays-fork-desc"
    >
      <title id="ohplays-fork-title">
        One question, two builds, one session
      </title>
      <desc id="ohplays-fork-desc">
        A decision fork read left to right. An unsettled question — gesture
        editing or a conventional timeline — splits into two branches, and both
        were actually built as prototypes. Both branches then pass through a
        single filled block in the middle: one testing session with the same
        fifteen student athletes, on iOS and Android, in school hallways and
        libraries between class periods. Out of that session the timeline branch
        is set aside, drawn as a dashed outline, while the gesture branch is
        adopted along with sports presets and is not argued again.
      </desc>
      <defs>
        <marker
          id="op-arrow"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--dg-prose)" />
        </marker>
        <marker
          id="op-arrow-focal"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--dg-ink)" />
        </marker>
      </defs>

      <rect width="100%" height="100%" fill="var(--dg-paper)" />

      {/* ============ STAGE HEADER ============ */}
      <text
        x="132"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        01 · THE ARGUMENT
      </text>
      <text
        x="360"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        02 · BUILD BOTH
      </text>
      <text
        x="564"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        03 · SESSION
      </text>
      <text
        x="820"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        04 · THE VERDICT
      </text>
      <line
        x1="48"
        y1="64"
        x2="912"
        y2="64"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />

      {/* ============ ARROWS (drawn before boxes so boxes occlude ends) ============ */}
      {/* Fork, upper branch — the conventional answer */}
      <path
        d="M 224,218 H 244 Q 252,218 252,210 V 156 Q 252,148 260,148"
        fill="none"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#op-arrow)"
      />
      {/* Fork, lower branch — the counter-argument */}
      <path
        d="M 224,218 H 244 Q 252,218 252,226 V 280 Q 252,288 260,288"
        fill="none"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#op-arrow)"
      />
      {/* Both builds enter the one session */}
      <line
        x1="456"
        y1="148"
        x2="496"
        y2="148"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#op-arrow)"
      />
      <line
        x1="456"
        y1="288"
        x2="496"
        y2="288"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#op-arrow)"
      />
      {/* The branch the session closed */}
      <line
        x1="632"
        y1="148"
        x2="718"
        y2="148"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#op-arrow)"
      />
      {/* FOCAL exit: the branch the students picked */}
      <line
        x1="632"
        y1="288"
        x2="718"
        y2="288"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#op-arrow-focal)"
      />

      {/* Exit labels — 7px clear of their own stroke, centred in the open corridor */}
      <rect
        x="633"
        y="129"
        width="84"
        height="14"
        rx="2"
        fill="var(--dg-paper)"
      />
      <text
        x="675"
        y="141"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        SET ASIDE
      </text>
      <rect
        x="633"
        y="269"
        width="84"
        height="14"
        rx="2"
        fill="var(--dg-paper)"
      />
      <text
        x="675"
        y="281"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        WON CLEARLY
      </text>

      {/* ============ 01 — THE OPEN QUESTION ============ */}
      <rect
        x="48"
        y="180"
        width="168"
        height="76"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="132"
        y="206"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Gesture or Timeline?
      </text>
      <text
        x="132"
        y="224"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        a hypothesis, not a fact
      </text>
      <text
        x="132"
        y="238"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        whoever argues hardest
      </text>

      {/* ============ 02 — BOTH PROTOTYPES ACTUALLY BUILT ============ */}
      <rect
        x="272"
        y="110"
        width="176"
        height="76"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="360"
        y="143"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Timeline Editing
      </text>
      <text
        x="360"
        y="161"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        what every editor offers
      </text>

      <rect
        x="272"
        y="250"
        width="176"
        height="76"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="360"
        y="283"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Gesture Editing
      </text>
      <text
        x="360"
        y="301"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        the counter-argument
      </text>

      {/* ============ 03 — FOCAL: the one session both builds pass through ============ */}
      <rect
        x="504"
        y="130"
        width="120"
        height="176"
        rx="6"
        fill="var(--dg-ink)"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
      />
      <text
        x="564"
        y="180"
        fill="var(--dg-paper)"
        opacity="0.6"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        BOTH BUILDS
      </text>
      <text
        x="564"
        y="202"
        fill="var(--dg-paper)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Same Session
      </text>
      <text
        x="564"
        y="220"
        fill="var(--dg-paper)"
        opacity="0.78"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        15 students
      </text>
      <text
        x="564"
        y="234"
        fill="var(--dg-paper)"
        opacity="0.78"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        iOS + Android
      </text>
      <text
        x="564"
        y="248"
        fill="var(--dg-paper)"
        opacity="0.78"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        hallway · library
      </text>
      <text
        x="564"
        y="262"
        fill="var(--dg-paper)"
        opacity="0.78"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        between periods
      </text>

      {/* ============ 04 — THE VERDICT ============ */}
      {/* Set aside: built and tested, then not carried forward */}
      <rect
        x="728"
        y="110"
        width="184"
        height="76"
        rx="6"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="820"
        y="143"
        fill="var(--dg-quiet)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Timeline Editing
      </text>
      <text
        x="820"
        y="161"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        built · tested · dropped
      </text>

      {/* Adopted */}
      <rect
        x="728"
        y="250"
        width="184"
        height="76"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="820"
        y="277"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Gestures + Presets
      </text>
      <text
        x="820"
        y="295"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        speed over control
      </text>
      <text
        x="820"
        y="309"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        committed, not re-argued
      </text>

      {/* ============ LEGEND (horizontal bottom strip) ============ */}
      <line
        x1="48"
        y1="386"
        x2="912"
        y2="386"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="48"
        y="416"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        LEGEND
      </text>

      <rect
        x="112"
        y="406"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="130"
        y="416"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Step, built and tested
      </text>

      <rect
        x="256"
        y="406"
        width="20"
        height="12"
        rx="2"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="284"
        y="416"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Set aside after testing
      </text>

      <rect
        x="412"
        y="406"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-ink)"
      />
      <text
        x="430"
        y="416"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Focal — what settled it
      </text>

      <line
        x1="556"
        y1="412"
        x2="578"
        y2="412"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#op-arrow)"
      />
      <text
        x="588"
        y="416"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Prototype path
      </text>

      <line
        x1="679"
        y1="412"
        x2="701"
        y2="412"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#op-arrow-focal)"
      />
      <text
        x="711"
        y="416"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Adopted, argument closed
      </text>
    </svg>
  );
}
