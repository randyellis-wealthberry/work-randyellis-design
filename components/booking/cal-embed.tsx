"use client";

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

interface CalButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function CalButton({ children, className, onClick }: CalButtonProps) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  return (
    <button
      data-cal-namespace="30min"
      data-cal-link="randyellis/30min"
      data-cal-config='{"layout":"month_view"}'
      className={className}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
