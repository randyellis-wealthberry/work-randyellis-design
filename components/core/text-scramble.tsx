"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface TextScrambleProps {
  children: string;
  className?: string;
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
  as: Component = "span",
  trigger = false,
  onHoverStart,
  onScrambleComplete,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(children);
  const [isScrambling, setIsScrambling] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);
  const iterationRef = useRef(0);

  const scramble = useCallback(() => {
    if (isScrambling) return;

    setIsScrambling(true);
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
        setIsScrambling(false);
        onScrambleComplete?.();
        return;
      }

      iterationRef.current += 1 / 3;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [children, isScrambling, onScrambleComplete]);

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
    <Component
      className={cn("inline-block cursor-pointer", className)}
      onMouseEnter={handleMouseEnter}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onHoverStart?.();
        }
      }}
    >
      {displayText}
    </Component>
  );
}
