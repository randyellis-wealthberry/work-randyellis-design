import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import {
  BAND_LABELS,
  DIMENSIONS,
  OVERALL_VERDICTS,
  type Answers,
  type DiagnosticResult,
} from "@/lib/data/diagnostic";

const PAGE = { width: 612, height: 792, margin: 56 } as const;
const INK = rgb(0.09, 0.09, 0.11);
const MUTED = rgb(0.45, 0.45, 0.5);

/** Standard Helvetica is WinAnsi only; swap what it cannot encode. */
function safe(text: string): string {
  return text.replace(/[→←]/g, "-").replace(/[^\x00-\xff]/g, "?");
}

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const lines: string[] = [];
  for (const paragraph of safe(text).split("\n")) {
    let line = "";
    for (const word of paragraph.split(" ")) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) > width && line) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    lines.push(line);
  }
  return lines;
}

/**
 * One-page-or-more PDF of a completed diagnostic: who, the verdict, the
 * per-dimension scores, and every prompt with the answer chosen. Written for
 * Randy to read before the call, so the answers are the point.
 */
export async function buildDiagnosticPdf({
  email,
  firstName,
  answers,
  result,
}: {
  email: string;
  firstName?: string;
  answers: Answers;
  result: DiagnosticResult;
}): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const textWidth = PAGE.width - PAGE.margin * 2;

  let page = doc.addPage([PAGE.width, PAGE.height]);
  let y = PAGE.height - PAGE.margin;

  const line = (
    text: string,
    opts: {
      size?: number;
      font?: PDFFont;
      color?: typeof INK;
      gap?: number;
    } = {},
  ) => {
    const { size = 10.5, font = regular, color = INK, gap = 4 } = opts;
    for (const l of wrap(text, font, size, textWidth)) {
      if (y < PAGE.margin + size) {
        page = doc.addPage([PAGE.width, PAGE.height]);
        y = PAGE.height - PAGE.margin;
      }
      page.drawText(l, { x: PAGE.margin, y: y - size, size, font, color });
      y -= size * 1.35;
    }
    y -= gap;
  };

  line("Hire AI Randy: ship-readiness diagnostic", {
    size: 18,
    font: bold,
    gap: 2,
  });
  line(
    `${firstName ? `${firstName} · ` : ""}${email} · ${new Date().toISOString().slice(0, 10)}`,
    { color: MUTED, gap: 18 },
  );

  line(OVERALL_VERDICTS[result.band].title, { size: 14, font: bold, gap: 2 });
  line(`${result.total} / ${result.max} · ${BAND_LABELS[result.band]}`, {
    color: MUTED,
    gap: 6,
  });
  line(OVERALL_VERDICTS[result.band].body, { gap: 18 });

  line("Scores by dimension", { size: 12, font: bold, gap: 6 });
  for (const d of result.dimensions) {
    line(`${d.name}: ${d.score} / ${d.max} · ${BAND_LABELS[d.band]}`, {
      font: bold,
      gap: 1,
    });
    line(d.verdict, { gap: 8 });
  }

  y -= 8;
  line(`Where the sprint starts: ${result.weakest.name}`, {
    size: 12,
    font: bold,
    gap: 2,
  });
  line(result.weakest.sprint, { gap: 18 });

  // ---- Read on the founder: what the answers say about how they work ----
  const picks = DIMENSIONS.flatMap((d) =>
    d.questions.map((q) => ({
      dimension: d.name,
      prompt: q.prompt,
      option: q.options[answers[q.id] ?? -1],
    })),
  ).filter((p) => p.option);
  const redFlags = picks.filter((p) => p.option!.score === 0);
  const strengths = picks.filter((p) => p.option!.score === 3);
  const ranked = [...result.dimensions].sort((a, b) => a.score - b.score);

  line("Read on this founder", { size: 12, font: bold, gap: 6 });
  line(
    `Profile: ${BAND_LABELS[result.band].toLowerCase()} overall, ` +
      `${redFlags.length} red-flag answer${redFlags.length === 1 ? "" : "s"}, ` +
      `${strengths.length} strength${strengths.length === 1 ? "" : "s"}. ` +
      `Strongest in ${ranked[ranked.length - 1]!.name}, weakest in ${ranked[0]!.name}.`,
    { gap: 8 },
  );
  if (redFlags.length) {
    line("Red flags (scored 0). Lead the call with these:", {
      font: bold,
      gap: 3,
    });
    for (const f of redFlags)
      line(`- ${f.prompt} They said: "${f.option!.label}"`, { gap: 3 });
    y -= 5;
  }
  if (strengths.length) {
    line("Strengths (scored 3). Credit these early, then build on them:", {
      font: bold,
      gap: 3,
    });
    for (const s of strengths)
      line(`- ${s.prompt} They said: "${s.option!.label}"`, { gap: 3 });
    y -= 5;
  }
  y -= 8;

  // ---- Proposed strategy: sprints in the order the scores dictate ----
  line("Proposed strategy", { size: 12, font: bold, gap: 6 });
  line(
    `Sequence the engagement weakest-first. Each sprint below is two weeks; ` +
      `dimensions already shipping get a review, not a sprint.`,
    { gap: 8 },
  );
  let sprintNo = 1;
  for (const d of ranked) {
    if (d.band === "ships") {
      line(`Review only: ${d.name} (${d.score}/${d.max}). ${d.verdict}`, {
        color: MUTED,
        gap: 6,
      });
      continue;
    }
    line(
      `Sprint ${sprintNo}: ${d.name} (${d.score}/${d.max}, ${BAND_LABELS[d.band]})`,
      {
        font: bold,
        gap: 1,
      },
    );
    line(d.sprint, { gap: 8 });
    sprintNo += 1;
  }
  const sprints = sprintNo - 1;
  line(
    sprints === 0
      ? "Pitch: a fractional engagement for range and speed, not rescue."
      : `Pitch: ${sprints} sprint${sprints === 1 ? "" : "s"}, about ${sprints * 2} weeks, starting with ${ranked[0]!.name}.`,
    { font: bold, gap: 18 },
  );

  line("Answers", { size: 12, font: bold, gap: 6 });
  let n = 1;
  for (const dimension of DIMENSIONS) {
    line(dimension.name, { font: bold, color: MUTED, gap: 4 });
    for (const question of dimension.questions) {
      const chosen = question.options[answers[question.id] ?? -1];
      line(`${n}. ${question.prompt}`, { font: bold, gap: 1 });
      line(
        chosen ? `${chosen.label} (${chosen.score}/3)` : "No answer recorded",
        { gap: 8 },
      );
      n += 1;
    }
  }

  return Buffer.from(await doc.save());
}
