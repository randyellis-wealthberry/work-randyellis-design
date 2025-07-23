"use client";

import { TextScramble } from "@/components/core/text-scramble";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ScrambleSectionTitleProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  speed?: number;
}

export function ScrambleSectionTitle({
  children,
  className,
  as = "h3",
}: ScrambleSectionTitleProps) {
  const [isTrigger, setIsTrigger] = useState(false);

  return (
    <TextScramble
      className={cn(
        "transition-colors duration-200 hover:text-zinc-600 dark:hover:text-zinc-300",
        className,
      )}
      as={as}
      trigger={isTrigger}
      onHoverStart={() => setIsTrigger(true)}
      onScrambleComplete={() => setIsTrigger(false)}
    >
      {children}
    </TextScramble>
  );
}
