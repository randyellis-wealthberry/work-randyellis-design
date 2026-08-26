/**
 * One quiet cue for the card easter egg, parked in the top-right corner.
 *
 * The periphery is rod-dominated: it reads motion and luminance change, not
 * hue or detail. So the cue is not a brighter dot — it is a small one that
 * moves. A 7px core breathes between 45% and full opacity while a ring expands
 * out of it and fades, once every 2.6s. That is ~0.4Hz, an order of magnitude
 * under the 3Hz flash threshold in WCAG 2.3.1, and slow enough to register as
 * a pulse rather than a strobe when it sits well off the visual axis.
 *
 * Placement dodges the two controls that already own this corner: the fixed
 * mobile menu trigger (top-4 right-4, 44px, z-50) and the utility bar's theme
 * toggle. Below `lg` the dot drops beneath both; at `lg` the trigger is gone
 * and the dot takes the corner itself. z-40 keeps it under the mobile menu's
 * backdrop, so an open menu covers it rather than competing with it.
 */
export function PeripheralDot() {
  return (
    <a
      href="https://card.randyellis.design/"
      title="Card"
      aria-label="Randy Ellis card"
      className="group fixed top-[68px] right-5 z-40 flex h-9 w-9 items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none lg:top-6 lg:right-6 dark:focus-visible:ring-offset-zinc-950"
      data-testid="peripheral-dot"
    >
      <span
        aria-hidden="true"
        className="peripheral-dot-ping absolute h-[7px] w-[7px] rounded-full bg-red-500"
      />
      <span
        aria-hidden="true"
        className="peripheral-dot-core h-[7px] w-[7px] rounded-full bg-red-500 transition-transform duration-200 group-hover:scale-150"
      />
    </a>
  );
}
