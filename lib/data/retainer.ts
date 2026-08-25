/**
 * The retainer's argument, in one place.
 *
 * Both the homepage and /services state what the engagement replaces. They were
 * going to say it twice in two files, which is how two surfaces end up making
 * slightly different promises about the same product.
 *
 * Left is the state a founder arrives in; right is what the retainer puts in
 * its place. The pairing is the argument — neither column reads as a claim on
 * its own, which is why they share a row.
 */
export const RETAINER_LEDGER: ReadonlyArray<{
  without: string;
  with: string;
}> = [
  {
    without: "Design decisions made by whoever has time that week",
    with: "One accountable owner for every design decision",
  },
  {
    without: "Four design systems wearing one name",
    with: "One system — versioned, documented, enforced",
  },
  {
    without: "AI features that demo well and ship badly",
    with: "AI surfaces designed to survive real users",
  },
  {
    without: "Design reviewed at the end, when changing it is expensive",
    with: "Design in the room where the roadmap gets set",
  },
  {
    without: "A CDO search that runs a quarter, then costs equity",
    with: "Start this month — fixed hours, no equity",
  },
];

/**
 * The proof exhibits. Every row carries the same fields so the band is
 * scannable by structure before any of it is read: the quantity, then the
 * context that makes it mean something. The period is shared by all four and is
 * stated once beneath the band.
 */
export const PROOF_EXHIBITS: ReadonlyArray<{
  value: string;
  context: string;
}> = [
  { value: "2.5M+", context: "Users reached by shipped product" },
  { value: "$50M", context: "Product value delivered" },
  { value: "800+", context: "Designers mentored" },
  { value: "4", context: "Design awards won" },
];
