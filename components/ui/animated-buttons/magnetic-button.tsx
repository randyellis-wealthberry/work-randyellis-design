"use client";

import React, { useRef, useState, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  magnetStrength?: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
  tabIndex?: number;
}

export function MagneticButton({
  children,
  className,
  magnetStrength = 0.3,
  onClick,
  disabled,
  type = "button",
  "aria-label": ariaLabel,
  tabIndex,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (e.clientX - centerX) * magnetStrength;
    const distanceY = (e.clientY - centerY) * magnetStrength;

    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        "group relative inline-flex items-center justify-center",
        "px-8 py-3 font-semibold text-white",
        "bg-gradient-to-r from-blue-600 to-purple-600",
        "rounded-xl overflow-hidden",
        "transition-all duration-300",
        "hover:shadow-lg hover:shadow-purple-500/25",
        "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
        "transform-gpu will-change-transform",
        "group-hover",
        className,
      )}
      style={{
        x: xSpring,
        y: ySpring,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100"
        animate={{
          opacity: isHovered ? 0.3 : 0,
        }}
        transition={{ duration: 0.5 }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(147, 51, 234, 0.4) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2">{children}</span>

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 -z-5"
        initial={{ x: "-100%" }}
        animate={{
          x: isHovered ? "100%" : "-100%",
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
        }}
      />
    </motion.button>
  );
}
