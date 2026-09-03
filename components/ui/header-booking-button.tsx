"use client";

import { AntiMetalButton } from "@/components/ui/anti-metal-button";
import {
  CAL_CONFIG,
  CAL_LINK,
  CAL_NAMESPACE,
  useCalEmbed,
} from "@/components/booking/cal-embed";
import { trackContactIntent } from "@/lib/analytics";
import { BOOKING_URL } from "@/lib/constants";

interface HeaderBookingButtonProps {
  className?: string;
}

/**
 * Header "Book a call" CTA. Wraps the AntiMetalButton with the same Cal.com
 * embed trigger the homepage hero uses, so a click opens the booking modal
 * in place instead of leaving the site.
 */
export function HeaderBookingButton({ className }: HeaderBookingButtonProps) {
  useCalEmbed();

  return (
    <AntiMetalButton
      type="button"
      label="Book a call"
      aria-label="Book a 30-minute call"
      className={className}
      data-testid="header-booking-button"
      data-cal-namespace={CAL_NAMESPACE}
      data-cal-link={CAL_LINK}
      data-cal-config={CAL_CONFIG}
      onClick={() => trackContactIntent("booking", BOOKING_URL, "header_cta")}
    />
  );
}

export default HeaderBookingButton;
