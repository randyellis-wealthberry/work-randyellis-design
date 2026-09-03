/**
 * "RANDY'S / SKILLS" as 5-row block letterforms — the wordmark shared by the
 * skills page hero and the install terminal's banner.
 *
 * Rows are generated from the fixed-width glyph map below rather than typed
 * by hand, so the columns cannot drift out of alignment. Each glyph is 5
 * columns wide (the apostrophe is 1) joined with a single space column;
 * "RANDY'S" is the widest line at 37 columns. At the terminal's `text-xs`
 * that measures ~292px (7.89px/char measured for U+2588 in this mono stack),
 * inside the 317px mobile budget — a 375px viewport less the terminal's
 * padding. The hero renders the same rows larger, where width is not the
 * constraint.
 *
 * Trailing spaces are trimmed per row; leading spaces are significant.
 */
const GLYPHS: Record<string, string[]> = {
  R: ["████ ", "█   █", "████ ", "█  █ ", "█   █"],
  A: [" ███ ", "█   █", "█████", "█   █", "█   █"],
  N: ["█   █", "██  █", "█ █ █", "█  ██", "█   █"],
  D: ["████ ", "█   █", "█   █", "█   █", "████ "],
  Y: ["█   █", "█   █", " ███ ", "  █  ", "  █  "],
  "'": ["█", "█", " ", " ", " "],
  S: [" ████", "█    ", "█████", "    █", " ████"],
  K: ["█   █", "█  █ ", "███  ", "█  █ ", "█   █"],
  I: ["███", " █ ", " █ ", " █ ", "███"],
  L: ["█    ", "█    ", "█    ", "█    ", "█████"],
};

function rowsFor(word: string): string[] {
  const rows = ["", "", "", "", ""];
  for (const ch of word) {
    const glyph = GLYPHS[ch];
    if (!glyph) throw new Error(`No pixel glyph for "${ch}"`);
    for (let i = 0; i < 5; i++) rows[i] += glyph[i] + " ";
  }
  return rows.map((row) => row.trimEnd());
}

const RANDYS = rowsFor("RANDY'S");
const SKILLS = rowsFor("SKILLS");

export const WORD_ART: string[] = [...RANDYS, "", ...SKILLS];
