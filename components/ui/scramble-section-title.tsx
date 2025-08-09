"use client";

import { TextScramble } from "@/components/core/text-scramble";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/**
 * Helper function to safely convert ReactNode children to string
 * This prevents the TypeScript error when JSX expressions create string arrays
 */
function normalizeChildren(children: ReactNode): string {
  if (typeof children === "string") {
    return children;
  }

  if (Array.isArray(children)) {
    // If children is an array (e.g., from JSX expressions like {condition ? "text" : ""} More Text)
    // join them into a single string
    return children.join("");
  }

  if (children == null) {
    return "";
  }

  // For other types (numbers, etc.), convert to string
  return String(children);
}

interface ScrambleSectionTitleProps {
  /**
   * The text content to display. While the component accepts ReactNode for flexibility,
   * it will be converted to a string for the scramble effect.
   *
   * RECOMMENDED USAGE:
   * ✅ Use template literals: {`${condition ? "prefix " : ""}Main Text`}
   * ❌ Avoid JSX expressions: {condition ? "prefix " : ""} Main Text
   *
   * @example
   * ```tsx
   * // Correct usage with template literal
   * <ScrambleSectionTitle>
   *   {`${isActive ? "🧠 AI-Powered " : ""}Dashboard`}
   * </ScrambleSectionTitle>
   *
   * // Also acceptable (static string)
   * <ScrambleSectionTitle>
   *   My Section Title
   * </ScrambleSectionTitle>
   * ```
   */
  children: ReactNode;
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

  // Normalize children to string to prevent TypeScript errors
  const textContent = normalizeChildren(children);

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
      {textContent}
    </TextScramble>
  );
}
