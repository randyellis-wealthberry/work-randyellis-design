"use client";

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

/** Cal.com namespace + attributes shared by every booking trigger on the site. */
export const CAL_NAMESPACE = "30min";
export const CAL_LINK = "randyellis/30min";
export const CAL_CONFIG = '{"layout":"month_view"}';

/**
 * Initialises the Cal.com embed for the shared namespace. Any element carrying
 * `data-cal-namespace` / `data-cal-link` opens the booking modal on click once
 * this has run. Safe to call from several components; the embed is idempotent.
 */
export function useCalEmbed() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);
}

interface CalButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function CalButton({ children, className, onClick }: CalButtonProps) {
  useCalEmbed();

  return (
    <button
      data-cal-namespace={CAL_NAMESPACE}
      data-cal-link={CAL_LINK}
      data-cal-config={CAL_CONFIG}
      className={className}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
