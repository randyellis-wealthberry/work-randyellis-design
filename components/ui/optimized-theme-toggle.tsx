"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { MoonIcon, SunIcon, MonitorIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { performanceMonitor } from "@/lib/utils/performance-monitor";

interface OptimizedThemeToggleProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "ghost" | "outline" | "default";
  showIcons?: boolean;
  testId?: string;
  enablePerformanceTracking?: boolean;
  enableAccessibilityAnnouncements?: boolean;
}

// Theme announcement utility for screen readers
const announceThemeChange = (theme: string) => {
  if (typeof window === "undefined") return;

  // Find or create live region for announcements
  let liveRegion = document.getElementById("theme-announcements");
  if (!liveRegion) {
    liveRegion = document.createElement("div");
    liveRegion.id = "theme-announcements";
    liveRegion.setAttribute("role", "status");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.style.position = "absolute";
    liveRegion.style.left = "-10000px";
    liveRegion.style.width = "1px";
    liveRegion.style.height = "1px";
    liveRegion.style.overflow = "hidden";
    document.body.appendChild(liveRegion);
  }

  // Clear previous announcement and add new one
  liveRegion.textContent = "";
  setTimeout(() => {
    if (liveRegion) {
      liveRegion.textContent = `Switched to ${theme} theme`;
    }
  }, 100);
};

export function OptimizedThemeToggle({
  className,
  size = "default",
  variant = "ghost",
  showIcons = true,
  testId = "theme-toggle",
  enablePerformanceTracking = true,
  enableAccessibilityAnnouncements = true,
}: OptimizedThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const performanceSessionRef = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for reduced motion preference
  const prefersReducedMotion = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const toggleTheme = useCallback(() => {
    // Start performance tracking
    if (enablePerformanceTracking) {
      performanceSessionRef.current = `theme-toggle-${Date.now()}`;
      performanceMonitor.startTracking(performanceSessionRef.current);
    }

    // Three-state cycling: system → light → dark → system
    const themeOrder = ["system", "light", "dark"] as const;
    const currentIndex = themeOrder.indexOf(
      theme as "system" | "light" | "dark",
    );
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    const nextTheme = themeOrder[nextIndex];

    const applyTheme = () => {
      setTheme(nextTheme);

      // Announce theme change for accessibility
      if (enableAccessibilityAnnouncements) {
        announceThemeChange(nextTheme);
      }

      // End performance tracking
      if (enablePerformanceTracking && performanceSessionRef.current) {
        setTimeout(() => {
          if (performanceSessionRef.current) {
            const metrics = performanceMonitor.endTracking(
              performanceSessionRef.current,
            );

            // Log performance metrics in development
            if (process.env.NODE_ENV === "development") {
              console.log(`Theme toggle performance:`, {
                duration: metrics.duration,
                fps: metrics.fps,
                memoryUsed: metrics.memoryUsed,
              });
            }

            performanceSessionRef.current = null;
          }
        }, 100);
      }
    };

    // Use View Transitions API for smooth animations if available and not reduced motion
    if (
      typeof document !== "undefined" &&
      document.startViewTransition &&
      !prefersReducedMotion()
    ) {
      try {
        document.startViewTransition(applyTheme);
      } catch {
        // Fallback if View Transitions API fails
        applyTheme();
      }
    } else {
      applyTheme();
    }
  }, [
    theme,
    setTheme,
    enablePerformanceTracking,
    enableAccessibilityAnnouncements,
    prefersReducedMotion,
  ]);

  if (!mounted) {
    const sizeClasses = {
      sm: "min-h-[44px] min-w-[44px] h-8 w-8 sm:h-8 sm:w-8",
      default: "min-h-[44px] min-w-[44px] h-9 w-9 sm:h-9 sm:w-9",
      lg: "min-h-[44px] min-w-[44px] h-10 w-10 sm:h-10 sm:w-10",
    };

    return (
      <Button
        variant={variant}
        size="icon"
        className={cn(sizeClasses[size], "animate-pulse", className)}
        disabled
        aria-label="Theme toggle loading"
      >
        <div className="bg-muted h-4 w-4 rounded" />
      </Button>
    );
  }

  const iconSizes = {
    sm: "h-3 w-3",
    default: "h-[1.2rem] w-[1.2rem]",
    lg: "h-5 w-5",
  };

  const iconSize = iconSizes[size];

  // Determine animation duration based on motion preference
  const animationDuration = prefersReducedMotion()
    ? "duration-0"
    : "duration-300";

  return (
    <Button
      onClick={toggleTheme}
      variant={variant}
      size="icon"
      className={cn(
        "transition-all",
        animationDuration,
        size === "sm" && "h-8 min-h-[44px] w-8 min-w-[44px] sm:h-8 sm:w-8",
        size === "default" && "h-9 min-h-[44px] w-9 min-w-[44px] sm:h-9 sm:w-9",
        size === "lg" && "h-10 min-h-[44px] w-10 min-w-[44px] sm:h-10 sm:w-10",
        className,
      )}
      aria-label={
        theme === "system"
          ? "Switch to light theme"
          : theme === "light"
            ? "Switch to dark theme"
            : "Switch to system theme"
      }
      aria-pressed={false} // Theme toggles don't use pressed state
      data-testid={testId}
    >
      {showIcons && (
        <>
          {/* Sun Icon - visible when theme is light */}
          <SunIcon
            data-testid="sun-icon"
            className={cn(
              iconSize,
              "scale-0 rotate-90 transition-all",
              animationDuration,
              theme === "light" && "scale-100 rotate-0",
            )}
          />
          {/* Moon Icon - visible when theme is dark */}
          <MoonIcon
            data-testid="moon-icon"
            className={cn(
              iconSize,
              "absolute scale-0 rotate-90 transition-all",
              animationDuration,
              theme === "dark" && "scale-100 rotate-0",
            )}
          />
          {/* Monitor Icon - visible when theme is system */}
          <MonitorIcon
            data-testid="monitor-icon"
            className={cn(
              iconSize,
              "absolute scale-0 rotate-90 transition-all",
              animationDuration,
              theme === "system" && "scale-100 rotate-0",
            )}
          />
        </>
      )}
    </Button>
  );
}

// Specific variants for different use cases
export function EnhancedHeaderThemeToggle() {
  return (
    <OptimizedThemeToggle
      size="default"
      variant="ghost"
      testId="header-theme-toggle"
      enablePerformanceTracking={true}
      enableAccessibilityAnnouncements={true}
    />
  );
}

export function EnhancedFooterThemeToggle() {
  return (
    <OptimizedThemeToggle
      size="sm"
      variant="ghost"
      className="rounded text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      testId="footer-theme-toggle"
      enablePerformanceTracking={true}
      enableAccessibilityAnnouncements={true}
    />
  );
}
