import {
  DIMENSIONS,
  MAX_DIMENSION_SCORE,
  QUESTIONS_PER_DIMENSION,
  bandFor,
  isDiagnosticComplete,
  isDimensionComplete,
  scoreDiagnostic,
  scoreDimension,
  type Answers,
} from "@/lib/data/diagnostic";

/** Answer every question with the option whose score matches `score`. */
function answersScoring(score: 0 | 1 | 2 | 3): Answers {
  const answers: Record<string, number> = {};
  for (const dimension of DIMENSIONS) {
    for (const question of dimension.questions) {
      const index = question.options.findIndex((o) => o.score === score);
      if (index === -1) throw new Error(`${question.id} has no ${score}`);
      answers[question.id] = index;
    }
  }
  return answers;
}

describe("diagnostic content", () => {
  it("has four dimensions of three questions with four options each", () => {
    expect(DIMENSIONS).toHaveLength(4);
    for (const dimension of DIMENSIONS) {
      expect(dimension.questions).toHaveLength(QUESTIONS_PER_DIMENSION);
      for (const question of dimension.questions) {
        expect(question.options).toHaveLength(4);
      }
    }
  });

  it("gives every question a best (3) and a worst (0) answer", () => {
    for (const dimension of DIMENSIONS) {
      for (const question of dimension.questions) {
        const scores = question.options.map((o) => o.score);
        expect(scores).toContain(0);
        expect(scores).toContain(3);
      }
    }
  });

  it("uses unique ids for every question and dimension", () => {
    const ids = DIMENSIONS.flatMap((d) => d.questions.map((q) => q.id));
    expect(new Set(ids).size).toBe(ids.length);
    const dims = DIMENSIONS.map((d) => d.id);
    expect(new Set(dims).size).toBe(dims.length);
  });

  it("writes a verdict and a sprint for every band of every dimension", () => {
    for (const dimension of DIMENSIONS) {
      expect(dimension.verdicts.ships.length).toBeGreaterThan(20);
      expect(dimension.verdicts.shaky.length).toBeGreaterThan(20);
      expect(dimension.verdicts.stalls.length).toBeGreaterThan(20);
      expect(dimension.sprint.length).toBeGreaterThan(20);
    }
  });
});

describe("bandFor", () => {
  it("bands a nine-point dimension at 7 and 4", () => {
    expect(bandFor(9, 9)).toBe("ships");
    expect(bandFor(7, 9)).toBe("ships");
    expect(bandFor(6, 9)).toBe("shaky");
    expect(bandFor(4, 9)).toBe("shaky");
    expect(bandFor(3, 9)).toBe("stalls");
    expect(bandFor(0, 9)).toBe("stalls");
  });

  it("bands the 36-point whole at the same shares", () => {
    expect(bandFor(28, 36)).toBe("ships");
    expect(bandFor(27, 36)).toBe("shaky");
    expect(bandFor(16, 36)).toBe("shaky");
    expect(bandFor(15, 36)).toBe("stalls");
  });

  it("never divides by zero", () => {
    expect(bandFor(0, 0)).toBe("stalls");
  });
});

describe("completion", () => {
  it("is incomplete with no answers and complete with all", () => {
    expect(isDiagnosticComplete({})).toBe(false);
    expect(isDiagnosticComplete(answersScoring(2))).toBe(true);
  });

  it("rejects an out-of-range or non-integer choice", () => {
    const [dimension] = DIMENSIONS;
    const good = answersScoring(1);
    expect(isDimensionComplete(dimension, good)).toBe(true);
    const [first] = dimension.questions;
    expect(isDimensionComplete(dimension, { ...good, [first.id]: 4 })).toBe(
      false,
    );
    expect(isDimensionComplete(dimension, { ...good, [first.id]: -1 })).toBe(
      false,
    );
    expect(isDimensionComplete(dimension, { ...good, [first.id]: 1.5 })).toBe(
      false,
    );
  });
});

describe("scoring", () => {
  it("scores the best answers to the maximum and bands them as ships", () => {
    const result = scoreDiagnostic(answersScoring(3));
    expect(result.total).toBe(36);
    expect(result.max).toBe(36);
    expect(result.band).toBe("ships");
    for (const dimension of result.dimensions) {
      expect(dimension.score).toBe(MAX_DIMENSION_SCORE);
      expect(dimension.band).toBe("ships");
    }
  });

  it("scores the worst answers to zero and bands them as stalls", () => {
    const result = scoreDiagnostic(answersScoring(0));
    expect(result.total).toBe(0);
    expect(result.band).toBe("stalls");
  });

  it("treats missing or invalid answers as zero rather than throwing", () => {
    const [dimension] = DIMENSIONS;
    expect(scoreDimension(dimension, {}).score).toBe(0);
    expect(
      scoreDimension(dimension, { [dimension.questions[0].id]: 99 }).score,
    ).toBe(0);
  });

  it("picks the lowest-scoring dimension as the place to start", () => {
    const answers = { ...answersScoring(3) } as Record<string, number>;
    const target = DIMENSIONS[2];
    for (const question of target.questions) {
      answers[question.id] = question.options.findIndex((o) => o.score === 0);
    }
    const result = scoreDiagnostic(answers);
    expect(result.weakest.id).toBe(target.id);
    expect(result.weakest.verdict).toBe(target.verdicts.stalls);
    expect(result.weakest.sprint).toBe(target.sprint);
  });

  it("carries the verdict that matches each dimension's band", () => {
    const result = scoreDiagnostic(answersScoring(2));
    result.dimensions.forEach((dimension, index) => {
      expect(dimension.band).toBe("shaky");
      expect(dimension.verdict).toBe(DIMENSIONS[index].verdicts.shaky);
    });
  });
});
