"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  delightLevel?: "subtle" | "moderate" | "playful";
  children: React.ReactNode;
}

export function EnhancedButton({
  variant = "primary",
  size = "md",
  delightLevel = "moderate",
  className,
  children,
  onClick,
  disabled,
  ...props
}: EnhancedButtonProps) {
  // Remove conflicting props for motion.button
  const {
    onDrag,
    onDragEnd,
    onDragStart,
    onAnimationStart,
    onAnimationEnd,
    onAnimationIteration,
    ...motionProps
  } = props;
  // Explicitly prevent unused variable warnings by referencing them
  void onDrag;
  void onDragEnd;
  void onDragStart;
  void onAnimationStart;
  void onAnimationEnd;
  void onAnimationIteration;

  const baseClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white border-blue-600",
    secondary:
      "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-100 dark:border-zinc-700",
    ghost:
      "bg-transparent hover:bg-zinc-100 text-zinc-700 border-transparent dark:hover:bg-zinc-800 dark:text-zinc-300",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const delightVariants = {
    subtle: {
      hover: { scale: 1.02, transition: { duration: 0.2 } },
      tap: { scale: 0.98, transition: { duration: 0.1 } },
    },
    moderate: {
      hover: {
        scale: 1.05,
        y: -2,
        transition: { duration: 0.2, ease: "easeOut" as const },
      },
      tap: { scale: 0.95, y: 0, transition: { duration: 0.1 } },
    },
    playful: {
      hover: {
        scale: 1.1,
        y: -4,
        rotate: [0, -1, 1, 0],
        transition: {
          duration: 0.3,
          ease: "easeOut" as const,
          rotate: { duration: 0.6, ease: "easeInOut" as const },
        },
      },
      tap: {
        scale: 0.9,
        y: 0,
        rotate: 0,
        transition: { duration: 0.1 },
      },
    },
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (onClick) {
      onClick(e);
    }
  };

  const glowEffect =
    delightLevel === "playful"
      ? "shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-shadow duration-300"
      : "";

  return (
    <motion.button
      className={cn(
        "relative inline-flex items-center justify-center rounded-lg border font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none overflow-hidden",
        baseClasses[variant],
        sizeClasses[size],
        glowEffect,
        className,
      )}
      variants={delightVariants[delightLevel]}
      whileHover="hover"
      whileTap="tap"
      onClick={handleClick}
      disabled={disabled}
      {...motionProps}
    >
      {/* Shimmer effect for primary buttons */}
      {variant === "primary" && delightLevel !== "subtle" && (
        <motion.div
          className="absolute inset-0 -top-2 -left-2 bg-gradient-to-r from-transparent via-white/20 to-transparent w-4 h-full transform -skew-x-12"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      )}

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// cn utility is imported from @/lib/utils
