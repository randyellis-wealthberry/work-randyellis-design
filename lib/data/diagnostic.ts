/**
 * The AI Product Ship Readiness Diagnostic: the questions, the scoring, and
 * the verdicts, in one place.
 *
 * This is the step the funnel was missing. Before it, the only thing a
 * founder could do on the site was book a call, and the only things past the
 * call were a $4,000 sprint and an $8,000-a-month retainer. The diagnostic is
 * a structured way to experience the thinking before asking for anyone's
 * calendar: four dimensions, three questions each, a score, and a verdict
 * written the way it would be said in the room.
 *
 * Everything here is pure data and pure functions so the page can render it
 * and the tests can score it without a browser. Copy lives here, not in the
 * component, for the same reason the retainer ledger does: two surfaces
 * quoting the same verdict must not drift.
 */

export type DimensionId = "surface" | "system" | "feasibility" | "boardroom";

/** Each answer carries its own weight; the option order is not the score. */
export interface DiagnosticOption {
  readonly label: string;
  readonly score: 0 | 1 | 2 | 3;
}

export interface DiagnosticQuestion {
  readonly id: string;
  readonly prompt: string;
  readonly options: ReadonlyArray<DiagnosticOption>;
}

/**
 * Three bands per dimension and for the whole. Named for what happens to the
 * feature, not for how the founder should feel about it.
 */
export type Band = "ships" | "shaky" | "stalls";

export interface Dimension {
  readonly id: DimensionId;
  readonly name: string;
  /** What the dimension reveals, stated as the question it answers. */
  readonly reveals: string;
  readonly questions: ReadonlyArray<DiagnosticQuestion>;
  /** The verdict for each band, in the first person. */
  readonly verdicts: Readonly<Record<Band, string>>;
  /** What the two-week sprint does when this is the weakest dimension. */
  readonly sprint: string;
}

export const QUESTIONS_PER_DIMENSION = 3;
export const MAX_QUESTION_SCORE = 3;
export const MAX_DIMENSION_SCORE = QUESTIONS_PER_DIMENSION * MAX_QUESTION_SCORE;

export const DIMENSIONS: ReadonlyArray<Dimension> = [
  {
    id: "surface",
    name: "AI surface UX",
    reveals:
      "Whether the AI features hold up when a real user, not a demo driver, touches them.",
    questions: [
      {
        id: "surface-wrong",
        prompt:
          "When the model's answer is wrong or empty, what does the user see?",
        options: [
          {
            label:
              "The same layout, with the wrong answer presented as confidently as a right one",
            score: 0,
          },
          { label: "A generic error message", score: 1 },
          {
            label:
              "A designed state that says what happened and offers a next step",
            score: 2,
          },
          {
            label:
              "A designed state, plus a way to correct or retry that feeds back into the product",
            score: 3,
          },
        ],
      },
      {
        id: "surface-latency",
        prompt: "What does the user see while the model is working?",
        options: [
          { label: "Nothing until the full response arrives", score: 0 },
          { label: "A spinner", score: 1 },
          { label: "Streaming output", score: 2 },
          {
            label: "Streaming output, visible stages, and a way to stop",
            score: 3,
          },
        ],
      },
      {
        id: "surface-observed",
        prompt:
          "Who has watched a first-time user try the AI feature without help?",
        options: [
          { label: "Nobody outside the team", score: 0 },
          { label: "A few friendly users, in a demo we drove", score: 1 },
          { label: "Five or more real users, in moderated sessions", score: 2 },
          {
            label: "Real users, regularly, with findings changing the roadmap",
            score: 3,
          },
        ],
      },
    ],
    verdicts: {
      ships:
        "The surface is designed for the model being wrong, slow, or absent, and real people have been watched using it. This is the part most AI products skip, and you have not.",
      shaky:
        "The happy path is designed and the unhappy paths are not. The feature will demo well and then quietly lose the users who hit an empty or wrong answer first.",
      stalls:
        "Right now the interface treats the model as if it were always right and always fast. Neither is true, and the first real user finds that out before you do.",
    },
    sprint:
      "Two weeks designing and shipping the states the model actually produces: wrong, empty, slow, and unavailable. Watched with five real users before it ships.",
  },
  {
    id: "system",
    name: "Design system governance",
    reveals: "Whether there is one system, or four wearing one name.",
    questions: [
      {
        id: "system-buttons",
        prompt: "How many button components exist in the codebase right now?",
        options: [
          { label: "One, and it is documented", score: 3 },
          { label: "One, undocumented", score: 2 },
          {
            label: "Two or three, depending on who built the screen",
            score: 1,
          },
          { label: "I would have to check", score: 0 },
        ],
      },
      {
        id: "system-tokens",
        prompt:
          "When a designer changes a colour or spacing token, how does it reach production?",
        options: [
          {
            label:
              "Automatically. Tokens are the source and the code consumes them",
            score: 3,
          },
          {
            label: "A ticket, then an engineer updates the values by hand",
            score: 2,
          },
          {
            label:
              "It usually does not. Figma and the code drifted apart a while ago",
            score: 1,
          },
          { label: "We do not use tokens yet", score: 0 },
        ],
      },
      {
        id: "system-owner",
        prompt: "Who says no to a new component?",
        options: [
          { label: "Nobody. Whoever needs it builds it", score: 0 },
          { label: "A senior engineer, informally", score: 1 },
          {
            label:
              "There is a process, but it is slow enough that people route around it",
            score: 2,
          },
          {
            label: "A named owner, with a written contribution rule",
            score: 3,
          },
        ],
      },
    ],
    verdicts: {
      ships:
        "One system, owned, with tokens flowing into code. Every new screen gets cheaper to build instead of more expensive. Protect the owner.",
      shaky:
        "The system exists but nobody is accountable for it, so it is fragmenting at the speed of your hiring. Each new engineer adds a variant.",
      stalls:
        "There is no system, there are screens. Every AI feature you add is being built on a different foundation from the last one, and the front-end debt is compounding monthly.",
    },
    sprint:
      "Two weeks auditing every component in production, collapsing the duplicates, wiring tokens to code, and writing the one-page contribution rule with a named owner.",
  },
  {
    id: "feasibility",
    name: "Roadmap technical feasibility",
    reveals: "Whether the specs survive contact with the codebase.",
    questions: [
      {
        id: "feasibility-cut",
        prompt:
          "When was a designed feature last cut or rebuilt during implementation because it could not be built as drawn?",
        options: [
          { label: "This sprint", score: 0 },
          { label: "In the last quarter", score: 1 },
          {
            label: "Rarely. Engineering reviews designs before they are final",
            score: 2,
          },
          {
            label:
              "It does not happen. Design and engineering prototype together",
            score: 3,
          },
        ],
      },
      {
        id: "feasibility-lead",
        prompt: "How far ahead of engineering does design work?",
        options: [
          {
            label: "Months. There is a backlog of designs nobody has scoped",
            score: 0,
          },
          {
            label:
              "Behind. Engineering builds first and design tidies up after",
            score: 1,
          },
          { label: "A sprint or two, with a handoff meeting", score: 2 },
          { label: "Same sprint. Designers ship in the codebase", score: 3 },
        ],
      },
      {
        id: "feasibility-fallback",
        prompt:
          "Do your AI features have a defined behaviour when the model is unavailable or over budget?",
        options: [
          { label: "No", score: 0 },
          { label: "Designed, not built", score: 1 },
          { label: "Built, but nobody designed it", score: 2 },
          { label: "Yes, designed and built", score: 3 },
        ],
      },
    ],
    verdicts: {
      ships:
        "Design and engineering are working in the same material. What gets drawn gets built, and the model's failure modes are part of the spec rather than a surprise.",
      shaky:
        "Designs are reviewed late enough that the expensive changes happen in code. The roadmap is honest but the estimates under it are not.",
      stalls:
        "The roadmap is a list of designs that have not been priced. Features get cut mid-build, engineering stops trusting the specs, and the AI features have no plan for the day the API is down.",
    },
    sprint:
      "Two weeks pricing the next quarter of the roadmap against the actual codebase, prototyping the two riskiest AI features in code, and defining every fallback before it is needed.",
  },
  {
    id: "boardroom",
    name: "Boardroom metric translation",
    reveals:
      "Whether design can state what it has done in the numbers the board reads.",
    questions: [
      {
        id: "boardroom-metric",
        prompt: "Which metric does design report on?",
        options: [
          { label: "None. Design is reviewed on taste", score: 0 },
          { label: "Usability scores or NPS", score: 1 },
          {
            label: "A product metric, such as activation or retention",
            score: 2,
          },
          {
            label: "A product metric tied to a revenue or cost line",
            score: 3,
          },
        ],
      },
      {
        id: "boardroom-worth",
        prompt:
          "If the board asked what the last design initiative was worth, what would you say?",
        options: [
          { label: "I would describe the work", score: 0 },
          {
            label: "I would point to a metric that moved, without a clear link",
            score: 1,
          },
          { label: "A metric, with a before and an after", score: 2 },
          {
            label: "A before, an after, and the dollar figure it implies",
            score: 3,
          },
        ],
      },
      {
        id: "boardroom-success",
        prompt: "How is the AI feature's success defined?",
        options: [
          { label: "It shipped", score: 0 },
          { label: "Usage: how many people tried it", score: 1 },
          {
            label: "Task completion or accuracy, as experienced by users",
            score: 2,
          },
          { label: "A business outcome, with a target and an owner", score: 3 },
        ],
      },
    ],
    verdicts: {
      ships:
        "Design has a number, the number has a dollar sign near it, and the AI feature has an owner and a target. That is a design function the board funds without being asked twice.",
      shaky:
        "Design measures something, but not the thing the board is paying for. The link between the work and the revenue is asserted, not shown.",
      stalls:
        "Design has no number, so it has no budget defence. When the AI feature is judged, it will be judged on whether it shipped, which is the one thing that tells you nothing.",
    },
    sprint:
      "Two weeks instrumenting the AI feature against one business outcome, building the before-and-after for the last design initiative, and writing the page that goes to the board.",
  },
];

/** Overall verdicts, keyed by the same bands the dimensions use. */
export const OVERALL_VERDICTS: Readonly<
  Record<Band, { title: string; body: string }>
> = {
  ships: {
    title: "This ships.",
    body: "The foundations are in place. What a fractional design leader adds here is speed and range, not rescue. Take the weakest dimension below and close it.",
  },
  shaky: {
    title: "This ships, with scars.",
    body: "It will launch. It will also spend the first quarter after launch paying for the decisions below. The weakest dimension is where the cost concentrates, and it is where I would start.",
  },
  stalls: {
    title: "This does not survive contact with real users.",
    body: "The demo will keep working and the product will not. Nothing here is unusual, and nothing here is cheap to fix after launch. Start with the weakest dimension.",
  },
};

/** A dimension at or above this share of its maximum ships. */
const SHIPS_THRESHOLD = 7 / 9;
/** Below this share, it stalls. Between the two, it is shaky. */
const STALLS_THRESHOLD = 4 / 9;

/**
 * Bands a score against its maximum. Stated as ratios so a dimension (out of
 * 9) and the whole (out of 36) fall into the same bands at the same points.
 */
export function bandFor(score: number, max: number): Band {
  if (max <= 0) return "stalls";
  const share = score / max;
  if (share >= SHIPS_THRESHOLD) return "ships";
  if (share >= STALLS_THRESHOLD) return "shaky";
  return "stalls";
}

export const BAND_LABELS: Readonly<Record<Band, string>> = {
  ships: "Ships",
  shaky: "Shaky",
  stalls: "Stalls",
};

/** Question id to the index of the chosen option. */
export type Answers = Readonly<Record<string, number>>;

export interface DimensionResult {
  readonly id: DimensionId;
  readonly name: string;
  readonly score: number;
  readonly max: number;
  readonly band: Band;
  readonly verdict: string;
  readonly sprint: string;
}

export interface DiagnosticResult {
  readonly dimensions: ReadonlyArray<DimensionResult>;
  readonly total: number;
  readonly max: number;
  readonly band: Band;
  /** The lowest-scoring dimension; the first one on a tie. */
  readonly weakest: DimensionResult;
}

/** True once every question in the dimension has a valid answer. */
export function isDimensionComplete(
  dimension: Dimension,
  answers: Answers,
): boolean {
  return dimension.questions.every((question) => {
    const choice = answers[question.id];
    return (
      typeof choice === "number" &&
      Number.isInteger(choice) &&
      choice >= 0 &&
      choice < question.options.length
    );
  });
}

export function isDiagnosticComplete(answers: Answers): boolean {
  return DIMENSIONS.every((dimension) =>
    isDimensionComplete(dimension, answers),
  );
}

/** Unanswered or out-of-range choices score zero rather than throwing. */
export function scoreDimension(
  dimension: Dimension,
  answers: Answers,
): DimensionResult {
  const score = dimension.questions.reduce((sum, question) => {
    const option = question.options[answers[question.id] ?? -1];
    return sum + (option?.score ?? 0);
  }, 0);
  const max = dimension.questions.length * MAX_QUESTION_SCORE;
  const band = bandFor(score, max);

  return {
    id: dimension.id,
    name: dimension.name,
    score,
    max,
    band,
    verdict: dimension.verdicts[band],
    sprint: dimension.sprint,
  };
}

export function scoreDiagnostic(answers: Answers): DiagnosticResult {
  const dimensions = DIMENSIONS.map((dimension) =>
    scoreDimension(dimension, answers),
  );
  const total = dimensions.reduce((sum, d) => sum + d.score, 0);
  const max = dimensions.reduce((sum, d) => sum + d.max, 0);
  const weakest = dimensions.reduce((lowest, d) =>
    d.score < lowest.score ? d : lowest,
  );

  return { dimensions, total, max, band: bandFor(total, max), weakest };
}
