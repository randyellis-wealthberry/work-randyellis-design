"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, Variants } from "motion/react";
import { cn } from "@/lib/utils";

interface CursorProps {
  children: React.ReactNode;
  className?: string;
  attachToParent?: boolean;
  variants?: Variants;
  transition?: object;
  springConfig?: {
    bounce?: number;
    stiffness?: number;
    damping?: number;
  };
  onMouseMove?: (e: React.MouseEvent) => void;
  onPositionChange?: (x: number, y: number) => void;
}

export function Cursor({
  children,
  className,
  attachToParent = false,
  variants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
  },
  transition = {
    type: "spring",
    stiffness: 260,
    damping: 20,
  },
  springConfig,
  onMouseMove,
  onPositionChange,
}: CursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!attachToParent) return;

    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPosition({ x, y });
      onPositionChange?.(e.clientX, e.clientY);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseenter", handleMouseEnter);
    parent.addEventListener("mouseleave", handleMouseLeave);

    // Set parent position to relative if not already positioned
    const parentStyle = window.getComputedStyle(parent);
    if (parentStyle.position === "static") {
      (parent as HTMLElement).style.position = "relative";
    }

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [attachToParent, onPositionChange]);

  const handleParentMouseMove = (e: React.MouseEvent) => {
    if (attachToParent && containerRef.current?.parentElement) {
      const rect = containerRef.current.parentElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPosition({ x, y });
    }
    onMouseMove?.(e);
    onPositionChange?.(e.clientX, e.clientY);
  };

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none", className)}
      onMouseMove={handleParentMouseMove}
    >
      <AnimatePresence>
        {isVisible && attachToParent && (
          <motion.div
            className="absolute pointer-events-none z-50"
            style={{
              left: position.x,
              top: position.y,
              transform: "translate(-50%, -50%)",
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants}
            transition={
              springConfig ? { ...transition, ...springConfig } : transition
            }
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
      {!attachToParent && children}
    </div>
  );
}
