"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Fires the purchase-complete event once per page view. Rendered by the
 * server success page, which cannot call the analytics client itself.
 */
export function SuccessTracker({
  modules,
  sessionId,
}: {
  modules: string[];
  sessionId: string;
}) {
  useEffect(() => {
    trackEvent(
      "skill_purchase_complete",
      "skill",
      modules.join(","),
      undefined,
      {
        module_count: modules.length,
        session: sessionId,
      },
    );
  }, [modules, sessionId]);
  return null;
}
