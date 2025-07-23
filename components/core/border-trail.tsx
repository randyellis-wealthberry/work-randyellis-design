"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { CSSProperties } from "react";

interface BorderTrailProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  style?: CSSProperties;
}

export function BorderTrail({
  className,
  duration = 4,
  delay = 0,
  style,
}: BorderTrailProps) {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden">
      <motion.div
        className={cn("absolute inset-0 rounded-[inherit]", className)}
        style={{
          background: `conic-gradient(from 0deg, transparent 270deg, rgba(255,255,255,0.8) 360deg)`,
          ...style,
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className="absolute inset-[2px] rounded-[inherit] bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}
