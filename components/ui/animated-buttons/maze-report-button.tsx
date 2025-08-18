"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MazeReportButtonProps {
  href?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function MazeReportButton({
  href = "https://app.maze.co/report/Addvance-v1-WIP/bxqeilh40ohf5/intro",
  className,
  onClick,
}: MazeReportButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Maze-inspired aurora colors
  const gradientColors = ["#7C3AED", "#4F46E5", "#06B6D4", "#8B5CF6"];
  const gradientString = `linear-gradient(135deg, ${gradientColors.join(", ")})`;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.open(href, "_blank", "noopener,noreferrer");
    onClick?.(e);
  };

  return (
    <motion.button
      className={cn(
        "relative inline-flex items-center justify-center",
        "min-w-[240px] px-6 py-3",
        "font-semibold text-white",
        "overflow-hidden rounded-xl",
        "transition-all duration-500",
        "hover:shadow-2xl hover:shadow-purple-500/50",
        "focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:outline-none",
        "transform-gpu will-change-transform",
        "group",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      style={{
        backgroundImage: gradientString,
        backgroundSize: "400% 400%",
        animation: isHovered
          ? "gradient 3s ease infinite"
          : "gradient 6s ease infinite",
      }}
      aria-label="View Addvanced usability testing report on Maze"
    >
      {/* Animated aurora background layer */}
      <motion.div
        className="absolute inset-0 opacity-0"
        animate={{
          opacity: isHovered ? 0.8 : 0,
          backgroundPosition: isHovered ? "100% 100%" : "0% 0%",
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear",
        }}
        style={{
          backgroundImage: `linear-gradient(225deg, ${gradientColors.reverse().join(", ")})`,
          backgroundSize: "400% 400%",
          filter: "blur(15px)",
        }}
      />

      {/* Aurora effect overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `radial-gradient(ellipse at ${isHovered ? "50% 50%" : "20% 50%"}, rgba(124, 58, 237, 0.4), transparent 60%)`,
        }}
      />

      {/* Northern lights wave effect */}
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(139, 92, 246, 0.2) 50%, transparent 60%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0"
        initial={{ x: "-100%" }}
        animate={{
          x: isHovered ? "100%" : "-100%",
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
        }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          transform: "skewX(-15deg)",
        }}
      />

      {/* Glow pulse effect */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(124, 58, 237, 0.5) 0%, transparent 70%)",
          filter: "blur(40px)",
          transform: "scale(1.3)",
        }}
      />

      {/* Particle effects on hover */}
      <AnimatedParticles isHovered={isHovered} />

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-3">
        <BarChart3 className="h-5 w-5 transition-transform group-hover:rotate-12" />
        <span>View Usability Report</span>
        <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
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
      `}</style>
    </motion.button>
  );
}

// Animated particles component for extra visual flair
function AnimatedParticles({ isHovered }: { isHovered: boolean }) {
  if (!isHovered) return null;

  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white"
          initial={{
            x: Math.random() * 100,
            y: 100,
            opacity: 0,
          }}
          animate={{
            y: -20,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeOut",
          }}
          style={{
            left: `${20 + i * 15}%`,
          }}
        />
      ))}
    </>
  );
}
