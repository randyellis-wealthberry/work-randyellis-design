"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Routes that need more than the site's 768px reading measure, with the width
 * they need. Header, content, and footer widen together — widening only the
 * page would leave the nav hanging off the content's left edge.
 */
const WIDE_ROUTES: Record<string, string> = {
  "/services": "max-w-[1100px]",
};

/**
 * Every case study runs the same ledger template: a multi-column table and a
 * full-measure media band, neither of which fits the 768px reading measure.
 * The projects index itself stays narrow — it is a list, not a ledger.
 */
const WIDE_PREFIXES = ["/projects/"];

export function RouteContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // usePathname returns null outside a router context; fall back to the
  // site's default measure rather than throwing.
  const route = pathname ?? "";
  const width =
    WIDE_ROUTES[route] ??
    (WIDE_PREFIXES.some((prefix) => route.startsWith(prefix))
      ? "max-w-[1100px]"
      : "max-w-screen-md");

  return (
    <div
      className={cn(
        "relative mx-auto w-full flex-1 px-4 pt-8 sm:px-6 sm:pt-6 lg:px-8",
        width,
      )}
    >
      {children}
    </div>
  );
}
