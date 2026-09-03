"use client";

import { SECONDARY_BUTTON } from "@/components/ui/button-styles";
import { trackEvent } from "@/lib/analytics";
import {
  formatSkillPrice,
  isPurchasable,
  type SkillBundle,
  type SkillModule,
} from "@/lib/data/skill-catalog";
import { cn } from "@/lib/utils";

/**
 * A plain form post to the checkout route, so buying works with scripts
 * blocked and the redirect to Stripe is a 303 the browser follows on its own.
 * The click handler only records intent; it never gates the submit.
 *
 * Secondary styling on purpose: the page has one primary, the booking at the
 * close, and six buy buttons styled as primaries would make the page shout
 * six times. An unpriced module renders its state in words rather than as a
 * disabled control, per the Placeholder Marking Rule.
 */
export function BuyButton({
  entry,
  className,
}: {
  entry: SkillModule | SkillBundle;
  className?: string;
}) {
  const price = formatSkillPrice(entry.price);

  if (!isPurchasable(entry)) {
    return (
      <p
        data-placeholder="true"
        className={cn(
          "inline-flex min-h-[44px] items-center text-base text-zinc-500 tabular-nums dark:text-zinc-400",
          className,
        )}
      >
        {price ?? "Price"}
        <span className="ml-2 align-[0.1em] text-xs">to confirm</span>
      </p>
    );
  }

  return (
    <form
      method="post"
      action="/api/skill/checkout"
      className={cn("inline-flex", className)}
      onSubmit={() =>
        trackEvent("skill_checkout_start", "skill", entry.id, undefined, {
          sku: entry.id,
          amount_cents: entry.price.amount ?? 0,
        })
      }
    >
      <input type="hidden" name="sku" value={entry.id} />
      <button type="submit" className={cn(SECONDARY_BUTTON, "tabular-nums")}>
        Buy
        <span className="ml-2 text-zinc-500 dark:text-zinc-400">{price}</span>
      </button>
    </form>
  );
}
