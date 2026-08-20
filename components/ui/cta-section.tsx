"use client";

import { CalButton } from "@/components/booking/cal-embed";
import { BuyMeACoffeeButton } from "@/components/ui/buy-me-a-coffee";
import { trackContactIntent } from "@/lib/analytics";

const BOOKING_URL = "https://cal.com/randyellis/30min";
const EMAIL_URL = "https://zinley.com/card/angela";

// Shared interactive states: hover, focus-visible, active, disabled.
const BASE_BUTTON =
  "inline-flex cursor-pointer items-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-100 focus-visible:outline-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-offset-zinc-900";

const PRIMARY_BUTTON = `${BASE_BUTTON} bg-zinc-900 text-white hover:bg-zinc-700 focus-visible:ring-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-white`;

const SECONDARY_BUTTON = `${BASE_BUTTON} border-2 border-zinc-300 bg-transparent text-zinc-900 hover:border-zinc-400 hover:bg-zinc-200 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:text-white dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-500`;

export function CTASection() {
  return (
    <section className="my-16 rounded-2xl border-2 border-white/10 bg-transparent px-6 py-16 text-center sm:px-12 sm:py-20">
      <h2 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
        Let&apos;s Build Something Amazing
      </h2>
      <p className="mx-auto mb-10 max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-300">
        Interested in collaborating on AI-powered products or discussing design
        leadership? I&apos;m always excited to connect with fellow innovators
        and explore new opportunities.
      </p>

      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        {/* Book a call button - Cal.com popup */}
        <CalButton
          onClick={() => trackContactIntent("booking", BOOKING_URL)}
          className={PRIMARY_BUTTON}
        >
          Book a 30-min call
        </CalButton>

        {/* Email button */}
        <a
          href={EMAIL_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackContactIntent("email", EMAIL_URL)}
          className={SECONDARY_BUTTON}
        >
          Talk to Assistant
        </a>

        {/* Buy Me a Coffee — popup */}
        <BuyMeACoffeeButton />
      </div>
    </section>
  );
}
