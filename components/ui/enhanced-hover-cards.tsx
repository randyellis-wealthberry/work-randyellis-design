"use client";

import { motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface EnhancedHoverCardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  hoverEffect?: "lift" | "glow" | "tilt" | "scale";
  delightLevel?: "subtle" | "moderate" | "playful";
  onClick?: () => void;
}

export function EnhancedHoverCard({
  children,
  className = "",
  href,
  hoverEffect = "lift",
  delightLevel = "moderate",
  onClick,
}: EnhancedHoverCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverEffect === "tilt") {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePosition({ x, y });
    }
  };

  const variants = {
    subtle: {
      lift: {
        rest: { y: 0, scale: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
        hover: { y: -2, scale: 1.01, boxShadow: "0 8px 25px rgba(0,0,0,0.15)" },
      },
      glow: {
        rest: { scale: 1, boxShadow: "0 0 0 rgba(59,130,246,0)" },
        hover: { scale: 1.01, boxShadow: "0 0 20px rgba(59,130,246,0.3)" },
      },
      tilt: {
        rest: { rotateX: 0, rotateY: 0, scale: 1 },
        hover: {
          rotateX: mousePosition.y * 5,
          rotateY: mousePosition.x * 5,
          scale: 1.02,
        },
      },
      scale: {
        rest: { scale: 1 },
        hover: { scale: 1.03 },
      },
    },
    moderate: {
      lift: {
        rest: { y: 0, scale: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
        hover: { y: -4, scale: 1.02, boxShadow: "0 12px 30px rgba(0,0,0,0.2)" },
      },
      glow: {
        rest: { scale: 1, boxShadow: "0 0 0 rgba(59,130,246,0)" },
        hover: { scale: 1.02, boxShadow: "0 0 30px rgba(59,130,246,0.4)" },
      },
      tilt: {
        rest: { rotateX: 0, rotateY: 0, scale: 1 },
        hover: {
          rotateX: mousePosition.y * 8,
          rotateY: mousePosition.x * 8,
          scale: 1.03,
        },
      },
      scale: {
        rest: { scale: 1 },
        hover: { scale: 1.05 },
      },
    },
    playful: {
      lift: {
        rest: {
          y: 0,
          scale: 1,
          rotate: 0,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
        hover: {
          y: -6,
          scale: 1.03,
          rotate: [0, -1, 1, 0],
          boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
        },
      },
      glow: {
        rest: { scale: 1, boxShadow: "0 0 0 rgba(59,130,246,0)" },
        hover: {
          scale: 1.03,
          boxShadow: "0 0 40px rgba(59,130,246,0.5)",
        },
      },
      tilt: {
        rest: { rotateX: 0, rotateY: 0, scale: 1 },
        hover: {
          rotateX: mousePosition.y * 12,
          rotateY: mousePosition.x * 12,
          scale: 1.04,
        },
      },
      scale: {
        rest: { scale: 1, rotate: 0 },
        hover: {
          scale: 1.08,
          rotate: [0, -2, 2, 0],
          transition: { rotate: { duration: 0.6 } },
        },
      },
    },
  };

  const motionProps = {
    variants: variants[delightLevel][hoverEffect],
    initial: "rest",
    whileHover: "hover",
    onHoverStart: () => setIsHovered(true),
    onHoverEnd: () => setIsHovered(false),
    onMouseMove: handleMouseMove,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
      duration: 0.3,
    },
  };

  const cardContent = (
    <motion.div
      className={cn(
        "relative rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 p-6 cursor-pointer overflow-hidden",
        hoverEffect === "tilt" && "transform-gpu perspective-1000",
        className,
      )}
      {...motionProps}
      onClick={onClick}
    >
      {/* Shimmer effect overlay for playful interactions */}
      {delightLevel === "playful" && isHovered && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      )}

      {children}
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}

// Project card with enhanced hover effects
export function ProjectHoverCard({
  project,
  className = "",
}: {
  project: {
    name: string;
    description: string;
    thumbnail?: string;
    slug: string;
    metrics?: Array<{ value: string; label: string }>;
  };
  className?: string;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <EnhancedHoverCard
      href={`/projects/${project.slug}`}
      hoverEffect="lift"
      delightLevel="moderate"
      className={className}
    >
      <div className="space-y-4">
        {/* Project Thumbnail */}
        {project.thumbnail && (
          <div className="aspect-video rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={project.thumbnail}
                alt={project.name}
                width={400}
                height={225}
                className="w-full h-full object-cover"
                onLoad={() => setImageLoaded(true)}
              />
            </motion.div>

            {!imageLoaded && (
              <div className="w-full h-full animate-pulse bg-zinc-200 dark:bg-zinc-700" />
            )}
          </div>
        )}

        {/* Project Info */}
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
            {project.name}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
            {project.description}
          </p>

          {/* Metrics */}
          {project.metrics && (
            <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
              {project.metrics.slice(0, 2).map((metric, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    {metric.value}
                  </span>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </EnhancedHoverCard>
  );
}
