"use client";

import { ArrowUpRight } from "lucide-react";
import { CalButton } from "@/components/booking/cal-embed";
import { BuyMeACoffeeButton } from "@/components/ui/buy-me-a-coffee";
import { SECTION } from "@/components/case-study/section-chrome";
import { trackContactIntent } from "@/lib/analytics";
import { ASSISTANT_URL, BOOKING_URL } from "@/lib/constants";
import {
  PRIMARY_BUTTON,
  SECONDARY_BUTTON_OUTBOUND,
} from "@/components/ui/button-styles";

/**
 * The shared close, rendered at the foot of `/about`, `/projects`, and every
 * blog post.
 *
 * It opens the way every other section on those pages opens — the `SECTION`
 * rule at full contrast, type set on the page ground — rather than as a
 * bordered card floating in the middle of an editorial column. One primary
 * (the call), one secondary (the assistant), and the coffee link demoted to the
 * quiet voice underneath, where it can stay reachable without reading as an
 * advert.
 */
export function CTASection() {
  return (
    <section className={SECTION} aria-labelledby="cta-heading">
      <h2
        id="cta-heading"
        className="max-w-[24ch] text-2xl leading-tight font-semibold tracking-[-0.03em] text-zinc-900 sm:text-3xl dark:text-white"
      >
        Let&apos;s Build Something Amazing
      </h2>
      <p className="mt-4 max-w-[62ch] text-base text-zinc-600 dark:text-zinc-300">
        Interested in collaborating on AI-powered products or discussing design
        leadership? I&apos;m always excited to connect with fellow innovators
        and explore new opportunities.
      </p>

      {/* Order is the hierarchy: the call is the primary because it is first. */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <CalButton
          onClick={() =>
            trackContactIntent("booking", BOOKING_URL, "shared_cta_section")
          }
          className={PRIMARY_BUTTON}
        >
          Book a 30-min call
        </CalButton>

        <a
          href={ASSISTANT_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackContactIntent(
              "virtual_assistant_open",
              ASSISTANT_URL,
              "shared_cta_section",
            )
          }
          className={SECONDARY_BUTTON_OUTBOUND}
        >
          Talk to Assistant
          <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>

      {/* Third in line, so not in the row: a quiet text link at a 44px target. */}
      <div className="mt-10">
        <BuyMeACoffeeButton />
      </div>
    </section>
  );
}
