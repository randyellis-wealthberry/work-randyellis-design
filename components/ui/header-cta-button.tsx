"use client";

import { AntiMetalLink } from "@/components/ui/anti-metal-button";
import { trackContactIntent } from "@/lib/analytics";
import { DIAGNOSTIC_PATH } from "@/lib/constants";

interface HeaderCtaButtonProps {
  className?: string;
}

/**
 * The header's one call to action: "Hire AI Randy", leading to the
 * ship-readiness diagnostic.
 *
 * It used to open the Cal.com booking modal, which made the header the third
 * place on the site asking for a call and the zeroth place offering anything
 * before one. The diagnostic is the step a buyer can take alone, so the header
 * points there and the diagnostic's own close asks for the call.
 */
export function HeaderCtaButton({ className }: HeaderCtaButtonProps) {
  return (
    <AntiMetalLink
      href={DIAGNOSTIC_PATH}
      label="Hire AI Randy"
      className={className}
      data-testid="header-cta-button"
      onClick={() =>
        trackContactIntent("diagnostic", DIAGNOSTIC_PATH, "header_cta")
      }
    />
  );
}

export default HeaderCtaButton;
