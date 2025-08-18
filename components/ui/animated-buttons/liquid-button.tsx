"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LiquidButtonProps {
  children: React.ReactNode;
  className?: string;
  liquidColor?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
  tabIndex?: number;
}

export function LiquidButton({
  children,
  className,
  liquidColor = "#3b82f6",
  onClick,
  disabled,
  type = "button",
  "aria-label": ariaLabel,
  tabIndex,
}: LiquidButtonProps) {
  const id = useId();
  const filterId = `liquid-${id}`;

  return (
    <div className="relative inline-block">
      {/* SVG Filter for liquid effect */}
      <svg className="absolute h-0 w-0">
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="3"
              result="turbulence"
              seed="1"
            >
              <animate
                attributeName="baseFrequency"
                dur="3s"
                values="0.02;0.03;0.02"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="10"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>
      </svg>

      <motion.button
        className={cn(
          "relative px-8 py-3",
          "font-semibold text-white",
          "overflow-hidden rounded-xl",
          "transition-all duration-600",
          "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none",
          className,
        )}
        style={{
          filter: `url(#${filterId})`,
          background: `linear-gradient(135deg, ${liquidColor}, ${adjustColor(liquidColor, -20)})`,
        }}
        whileHover={{
          scale: 1.05,
          filter: `url(#${filterId}) brightness(1.1)`,
        }}
        whileTap={{ scale: 0.98 }}
        type={type}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
      >
        {/* Liquid blob background */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0.6 }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            background: `radial-gradient(circle at 30% 30%, ${adjustColor(liquidColor, 30)}, transparent 70%)`,
            filter: "blur(20px)",
          }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            transform: "skewX(-20deg)",
          }}
        />

        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </motion.button>
    </div>
  );
}

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  const hex = color.replace("#", "");
  const num = parseInt(hex, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}
