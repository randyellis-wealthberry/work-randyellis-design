"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "muted" | "accent";
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  disabled?: boolean;
}

export function HamburgerButton({
  isOpen,
  onClick,
  className,
  size = "md",
  variant = "default",
  "aria-label": ariaLabel,
  "aria-expanded": ariaExpanded,
  disabled = false,
  ...props
}: HamburgerButtonProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-11 h-11",
    lg: "w-14 h-14"
  };

  const lineSizes = {
    sm: {
      height: 2,
      width: 20,
      spacing: 4
    },
    md: {
      height: 2.5,
      width: 24,
      spacing: 5
    },
    lg: {
      height: 3,
      width: 28,
      spacing: 6
    }
  };

  const currentSize = lineSizes[size];

  const variantClasses = {
    default: "text-foreground hover:bg-accent/80 hover:text-accent-foreground",
    muted: "text-muted-foreground hover:bg-muted hover:text-foreground",
    accent: "text-accent-foreground hover:bg-accent/90 hover:text-accent-foreground"
  };

  // Animation variants for the lines
  const topLineVariants = {
    closed: {
      y: 0,
      rotate: 0,
      opacity: 1
    },
    open: {
      y: currentSize.spacing + currentSize.height / 2,
      rotate: 45,
      opacity: 1
    }
  };

  const middleLineVariants = {
    closed: {
      opacity: 1,
      x: 0
    },
    open: {
      opacity: 0,
      x: 20
    }
  };

  const bottomLineVariants = {
    closed: {
      y: currentSize.spacing * 2 + currentSize.height,
      rotate: 0,
      opacity: 1
    },
    open: {
      y: -currentSize.spacing - currentSize.height / 2,
      rotate: -45,
      opacity: 1
    }
  };

  const buttonVariants = {
    closed: {
      scale: 1,
      rotate: 0
    },
    open: {
      scale: 1,
      rotate: 0
    },
    hover: {
      scale: 1.05
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <motion.button
      className={cn(
        "relative inline-flex items-center justify-center rounded-md",
        "p-2 transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        "touch-manipulation", // Improves touch responsiveness
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      variants={buttonVariants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || (isOpen ? "Close menu" : "Open menu")}
      aria-expanded={ariaExpanded ?? isOpen}
      aria-controls="navigation-menu"
      type="button"
      {...props}
    >
      <motion.svg
        width={currentSize.width}
        height={currentSize.width}
        viewBox={`0 0 ${currentSize.width} ${currentSize.width}`}
        className="overflow-visible"
        aria-hidden="true"
        focusable="false"
      >
        <motion.line
          x1="0"
          y1={currentSize.height / 2}
          x2={currentSize.width}
          y2={currentSize.height / 2}
          strokeLinecap="round"
          strokeWidth={currentSize.height}
          variants={topLineVariants}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1] // Custom cubic-bezier for smooth animation
          }}
          className={cn(
            "stroke-current",
            "origin-center"
          )}
        />

        <motion.line
          x1="0"
          y1={currentSize.height / 2 + currentSize.spacing + currentSize.height}
          x2={currentSize.width}
          y2={currentSize.height / 2 + currentSize.spacing + currentSize.height}
          strokeLinecap="round"
          strokeWidth={currentSize.height}
          variants={middleLineVariants}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
          className={cn(
            "stroke-current",
            "origin-center"
          )}
        />

        <motion.line
          x1="0"
          y1={currentSize.height / 2 + (currentSize.spacing + currentSize.height) * 2}
          x2={currentSize.width}
          y2={currentSize.height / 2 + (currentSize.spacing + currentSize.height) * 2}
          strokeLinecap="round"
          strokeWidth={currentSize.height}
          variants={bottomLineVariants}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
          className={cn(
            "stroke-current",
            "origin-center"
          )}
        />
      </motion.svg>

      {/* Optional: Add a subtle backdrop blur effect when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute inset-0 rounded-md bg-ring/10 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Export a memoized version for performance
export const MemoizedHamburgerButton = React.memo(HamburgerButton);