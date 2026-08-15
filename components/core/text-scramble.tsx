"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TextScrambleProps {
  children: string;
  className?: string;
  id?: string;
  as?: "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  speed?: number;
  trigger?: boolean;
  onHoverStart?: () => void;
  onScrambleComplete?: () => void;
}

const CHARACTERS = "!<>-_\\/[]{}—=+*^?#________";

export function TextScramble({
  children,
  className,
  id,
  as: Component = "span",
  trigger = false,
  onHoverStart,
  onScrambleComplete,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(children);
  // Use ref instead of state to avoid circular dependencies
  const isScrambling = useRef(false);
  const animationRef = useRef<number | undefined>(undefined);
  const iterationRef = useRef(0);

  const scramble = useCallback(() => {
    if (isScrambling.current) return;

    isScrambling.current = true;
    iterationRef.current = 0;

    const animate = () => {
      const iteration = iterationRef.current;

      setDisplayText(
        children
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return children[index];
            }
            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
          })
          .join(""),
      );

      if (iteration >= children.length) {
        isScrambling.current = false;
        onScrambleComplete?.();
        return;
      }

      iterationRef.current += 1 / 3;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [children, onScrambleComplete]);

  useEffect(() => {
    if (trigger) {
      scramble();
    }
  }, [trigger, scramble]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    onHoverStart?.();
  };

  return (
    // No role="button"/tabIndex here on purpose. This component is usually
    // rendered `as` a heading (see ScrambleSectionTitle), and role="button"
    // overrode those heading semantics site-wide — screen readers got a page of
    // buttons instead of a document outline. The scramble is a decorative hover
    // effect that performs no action, so it should not be in the tab order or
    // announced as interactive.
    <Component
      id={id}
      className={cn("inline-block", className)}
      onMouseEnter={handleMouseEnter}
    >
      {displayText}
    </Component>
  );
}
