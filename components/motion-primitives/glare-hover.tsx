"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useSpring } from "motion/react";
import { ReactNode, useRef, useState } from "react";

interface GlareHoverProps {
  children: ReactNode;
  className?: string;
  glareColor?: string;
  glareOpacity?: number;
  glareSize?: number;
  disabled?: boolean;
  borderRadius?: string;
  intensity?: "subtle" | "medium" | "strong";
}

export function GlareHover({
  children,
  className,
  glareColor = "rgba(255, 255, 255, 0.8)",
  glareOpacity = 0.6,
  glareSize = 300,
  disabled = false,
  borderRadius = "inherit",
  intensity = "subtle",
}: GlareHoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Motion values for smooth animation
  const glareX = useMotionValue(0);
  const glareY = useMotionValue(0);

  // Spring animations for smooth movement
  const springConfig = {
    stiffness:
      intensity === "subtle" ? 150 : intensity === "medium" ? 200 : 300,
    damping: intensity === "subtle" ? 25 : intensity === "medium" ? 20 : 15,
    mass: 0.1,
  };

  // Spring animations for the glare effect
  useSpring(glareX, springConfig);
  useSpring(glareY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
    glareX.set(x - glareSize / 2);
    glareY.set(y - glareSize / 2);
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    setIsHovered(false);
  };

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (disabled || prefersReducedMotion) {
    return <div className={cn("relative", className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ borderRadius }}
    >
      {children}

      {/* Glare effect */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius,
          background: `radial-gradient(${glareSize}px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glareColor} 0%, transparent 50%)`,
        }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered ? glareOpacity : 0,
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
      />

      {/* Subtle shine overlay for enhanced effect */}
      {intensity !== "subtle" && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius,
            background: `linear-gradient(135deg, transparent 40%, rgba(255, 255, 255, 0.1) 50%, transparent 60%)`,
            transform: `translateX(${(mousePosition.x / 200) * 10}px) translateY(${(mousePosition.y / 200) * 5}px)`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovered ? 0.3 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
        />
      )}
    </motion.div>
  );
}

// Preset configurations for common use cases
export const GlarePresets = {
  card: {
    glareColor: "rgba(255, 255, 255, 0.6)",
    glareOpacity: 0.4,
    glareSize: 200,
    intensity: "subtle" as const,
  },
  button: {
    glareColor: "rgba(255, 255, 255, 0.8)",
    glareOpacity: 0.6,
    glareSize: 150,
    intensity: "medium" as const,
  },
  hero: {
    glareColor: "rgba(255, 255, 255, 0.9)",
    glareOpacity: 0.8,
    glareSize: 400,
    intensity: "strong" as const,
  },
} as const;
