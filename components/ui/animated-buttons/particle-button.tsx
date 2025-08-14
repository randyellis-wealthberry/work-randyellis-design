"use client";

import React, { useState, useRef, MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

interface ParticleButtonProps {
  children: React.ReactNode;
  className?: string;
  particleCount?: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
  tabIndex?: number;
  particleColors?: string[];
}

export function ParticleButton({
  children,
  className,
  particleCount = 15,
  particleColors = ["#fbbf24", "#f59e0b", "#f97316", "#fb923c"],
  onClick,
  disabled,
  type = "button",
  "aria-label": ariaLabel,
  tabIndex,
}: ParticleButtonProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const createParticles = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      size: Math.random() * 8 + 4,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    // Clean up particles after animation
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id)),
      );
    }, 800);
  };

  const handleMouseEnter = (e: MouseEvent<HTMLButtonElement>) => {
    setIsHovered(true);
    createParticles(e);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // Create burst effect on click
    const burstCount = 30;
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const burstParticles = Array.from({ length: burstCount }, (_, i) => ({
      id: Date.now() + i + 1000,
      x,
      y,
      size: Math.random() * 10 + 2,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
    }));

    setParticles((prev) => [...prev, ...burstParticles]);

    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !burstParticles.some((bp) => bp.id === p.id)),
      );
    }, 1000);

    onClick?.(e);
  };

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        "relative px-8 py-3",
        "font-semibold text-white",
        "bg-gradient-to-r from-amber-500 to-orange-600",
        "rounded-xl overflow-visible",
        "transition-all duration-300",
        "hover:shadow-xl hover:shadow-orange-500/30",
        "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2",
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseMove={createParticles}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          opacity: isHovered ? 0.5 : 0,
        }}
        transition={{ duration: 0.4 }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(251, 146, 60, 0.4) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5" />
        {children}
      </span>

      {/* Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="particle absolute pointer-events-none"
            initial={{
              x: particle.x,
              y: particle.y,
              scale: 0,
              opacity: 1,
            }}
            animate={{
              x: particle.x + (Math.random() - 0.5) * 60,
              y: particle.y - Math.random() * 50 - 20,
              scale: 1,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: "50%",
              boxShadow: `0 0 ${particle.size}px ${particle.color}`,
            }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
}
