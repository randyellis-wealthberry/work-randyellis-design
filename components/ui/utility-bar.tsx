"use client";

import HeaderThemeToggle from "@/components/ui/header-theme-toggle";

export default function UtilityBar() {
  return (
    <div
      className="flex h-10 items-center justify-center border-b border-zinc-100/50 px-4 sm:h-8 sm:justify-end sm:px-0 dark:border-zinc-800/50"
      role="complementary"
      aria-label="Utility controls"
      data-testid="utility-bar"
    >
      <div className="mx-2 max-w-none sm:mx-4">
        <HeaderThemeToggle />
      </div>
    </div>
  );
}
