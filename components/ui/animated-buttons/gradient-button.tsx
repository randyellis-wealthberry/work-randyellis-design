"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientButtonProps {
  children: React.ReactNode;
  className?: string;
  gradientColors?: string[];
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  "aria-label"?: string;
  tabIndex?: number;
}

export function GradientButton({
  children,
  className,
  gradientColors = ["#ec4899", "#8b5cf6", "#3b82f6", "#10b981"],
  onClick,
  disabled,
  "aria-label": ariaLabel,
  tabIndex,
}: GradientButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const gradientString = `linear-gradient(135deg, ${gradientColors.join(", ")})`;

  return (
    <motion.div
      role="button"
      className={cn(
        "relative px-8 py-3",
        "font-semibold text-white",
        "rounded-xl overflow-hidden",
        "transition-all duration-500",
        "hover:shadow-2xl hover:shadow-purple-500/40",
        "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
        "hover:animate-gradient",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      onMouseEnter={disabled ? undefined : () => setIsHovered(true)}
      onMouseLeave={disabled ? undefined : () => setIsHovered(false)}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      style={{
        backgroundImage: gradientString,
        backgroundSize: "400% 400%",
      }}
      onClick={disabled ? undefined : onClick}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-0"
        animate={{
          opacity: isHovered ? 1 : 0,
          backgroundPosition: isHovered ? "100% 100%" : "0% 0%",
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
        style={{
          backgroundImage: gradientString,
          backgroundSize: "400% 400%",
          filter: "blur(10px)",
        }}
      />

      {/* Aurora effect overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `radial-gradient(circle at ${isHovered ? "50%" : "0%"} 50%, rgba(139, 92, 246, 0.3), transparent 50%)`,
        }}
      />

      {/* Wave animation */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background:
            "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Glow pulse effect */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
          filter: "blur(30px)",
          transform: "scale(1.2)",
        }}
      />

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .hover\\:animate-gradient:hover {
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </motion.div>
  );
}
