"use client";

import React, { useEffect, useState } from "react";
import { MoonIcon, SunIcon, MonitorIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SimpleThemeToggleProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "ghost" | "outline" | "default";
  showIcons?: boolean;
  testId?: string;
}

export function SimpleThemeToggle({
  className,
  size = "default",
  variant = "ghost",
  showIcons = true,
  testId = "theme-toggle",
}: SimpleThemeToggleProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const toggleTheme = () => {
    // Three-state cycling: system → light → dark → system
    const themeOrder = ["system", "light", "dark"] as const;
    const currentIndex = themeOrder.indexOf(
      theme as "system" | "light" | "dark",
    );
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    const nextTheme = themeOrder[nextIndex];

    // Use View Transitions API for smooth animations if available
    if (typeof document !== "undefined" && document.startViewTransition) {
      document.startViewTransition(() => {
        setTheme(nextTheme);
      });
    } else {
      setTheme(nextTheme);
    }
  };

  const iconSizes = {
    sm: "h-3 w-3",
    default: "h-[1.2rem] w-[1.2rem]",
    lg: "h-5 w-5",
  };

  const iconSize = iconSizes[size];

  return (
    <Button
      onClick={toggleTheme}
      variant={variant}
      size="icon"
      className={cn(
        "transition-all duration-200",
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
      data-testid={testId}
    >
      {showIcons && (
        <>
          {/* Sun Icon - visible when theme is light */}
          <SunIcon
            data-testid="sun-icon"
            className={cn(
              iconSize,
              "scale-0 rotate-90 transition-all duration-300",
              theme === "light" && "scale-100 rotate-0",
            )}
          />
          {/* Moon Icon - visible when theme is dark */}
          <MoonIcon
            data-testid="moon-icon"
            className={cn(
              iconSize,
              "absolute scale-0 rotate-90 transition-all duration-300",
              theme === "dark" && "scale-100 rotate-0",
            )}
          />
          {/* Monitor Icon - visible when theme is system */}
          <MonitorIcon
            data-testid="monitor-icon"
            className={cn(
              iconSize,
              "absolute scale-0 rotate-90 transition-all duration-300",
              theme === "system" && "scale-100 rotate-0",
            )}
          />
        </>
      )}
    </Button>
  );
}

// Specific variants for different use cases
export function HeaderThemeToggle() {
  return (
    <SimpleThemeToggle
      size="default"
      variant="ghost"
      testId="header-theme-toggle"
    />
  );
}

export function FooterThemeToggle() {
  return (
    <SimpleThemeToggle
      size="sm"
      variant="ghost"
      className="rounded text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
      testId="footer-theme-toggle"
    />
  );
}
