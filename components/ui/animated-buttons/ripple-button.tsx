"use client";

import React, { useState, MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface RippleButtonProps {
  children: React.ReactNode;
  className?: string;
  showSuccess?: boolean;
  rippleColor?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
  tabIndex?: number;
}

export function RippleButton({
  children,
  className,
  showSuccess = false,
  rippleColor = "rgba(255, 255, 255, 0.5)",
  onClick,
  disabled,
  type = "button",
  "aria-label": ariaLabel,
  tabIndex,
}: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isClicked, setIsClicked] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

  const createRipple = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);
    setIsClicked(true);

    // Show success feedback if enabled
    if (showSuccess) {
      setTimeout(() => {
        setShowCheckmark(true);
        setTimeout(() => {
          setShowCheckmark(false);
        }, 1000);
      }, 300);
    }

    // Clean up ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      setIsClicked(false);
    }, 600);

    onClick?.(e);
  };

  return (
    <motion.button
      className={cn(
        "relative px-8 py-3",
        "font-semibold",
        "bg-gradient-to-r from-teal-500 to-cyan-600 text-white",
        "overflow-hidden rounded-xl",
        "transition-all duration-200",
        "hover:shadow-lg hover:shadow-cyan-500/25",
        "focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:outline-none",
        "transform-gpu",
        className,
      )}
      onClick={createRipple}
      whileHover={{
        scale: 1.02,
        y: -2,
      }}
      whileTap={{ scale: 0.98 }}
      animate={{
        backgroundColor: isClicked
          ? "rgba(20, 184, 166, 1)"
          : "rgba(6, 182, 212, 1)",
      }}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
    >
      {/* Background flash effect */}
      <AnimatePresence>
        {isClicked && (
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Border pulse effect */}
      <AnimatePresence>
        {isClicked && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-white"
            initial={{ opacity: 0, scale: 1 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [1, 1.05, 1.1],
            }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* Ripples */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="ripple-effect pointer-events-none absolute"
            initial={{
              width: 0,
              height: 0,
              x: ripple.x,
              y: ripple.y,
              opacity: 1,
            }}
            animate={{
              width: 500,
              height: 500,
              x: ripple.x - 250,
              y: ripple.y - 250,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            style={{
              backgroundColor: rippleColor,
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
              left: 0,
              top: 0,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Success checkmark */}
      <AnimatePresence>
        {showCheckmark && (
          <motion.div
            data-testid="success-icon"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [0, 1.2, 1],
              rotate: [0, 0, 360],
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.4,
              type: "spring",
              stiffness: 200,
            }}
          >
            <Check className="h-6 w-6 text-white" strokeWidth={3} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button content */}
      <motion.span
        className="relative z-10 flex items-center justify-center gap-2"
        animate={{
          opacity: showCheckmark ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>

      {/* Hover shadow animation */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(6, 182, 212, 0)",
            "0 0 20px 10px rgba(6, 182, 212, 0.2)",
            "0 0 0 0 rgba(6, 182, 212, 0)",
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.button>
  );
}
