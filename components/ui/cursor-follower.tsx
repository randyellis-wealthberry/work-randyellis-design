"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

interface CursorFollowerProps {
  intensity?: number;
  springConfig?: {
    stiffness: number;
    damping: number;
    mass: number;
  };
}

export function CursorFollower({
  springConfig = { stiffness: 150, damping: 25, mass: 0.5 },
}: CursorFollowerProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorVariant, setCursorVariant] = useState<
    "default" | "hover" | "click"
  >("default");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    // Only show on desktop with mouse
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Handle interactive elements
    const handleInteractiveHover = (variant: "hover" | "default") => {
      setCursorVariant(variant);
    };

    const handleMouseDown = () => setCursorVariant("click");
    const handleMouseUp = () => setCursorVariant("hover");

    // Add event listeners
    document.addEventListener("mousemove", updateMousePosition);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, [role="button"], input, textarea, select, [tabindex]:not([tabindex="-1"])',
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => handleInteractiveHover("hover"));
      el.addEventListener("mouseleave", () =>
        handleInteractiveHover("default"),
      );
    });

    return () => {
      document.removeEventListener("mousemove", updateMousePosition);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", () =>
          handleInteractiveHover("hover"),
        );
        el.removeEventListener("mouseleave", () =>
          handleInteractiveHover("default"),
        );
      });
    };
  }, [mouseX, mouseY]);

  if (!mounted || !isVisible) return null;

  const variants = {
    default: {
      scale: 1,
      opacity: 0.6,
      mixBlendMode: "difference" as const,
    },
    hover: {
      scale: 1.5,
      opacity: 0.8,
      mixBlendMode: "difference" as const,
    },
    click: {
      scale: 0.8,
      opacity: 1,
      mixBlendMode: "difference" as const,
    },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 w-6 h-6 bg-white rounded-full pointer-events-none z-50 hidden lg:block"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      variants={variants}
      animate={cursorVariant}
      transition={{
        type: "spring" as const,
        stiffness: 400,
        damping: 30,
        mass: 0.5,
      }}
    />
  );
}
