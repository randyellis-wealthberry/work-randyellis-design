"use client";

import React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeWithAnimation } from "@/lib/hooks/use-theme-with-animation";
import type { AnimationStart, AnimationVariant } from "./theme-animations";

interface ThemeToggleProps {
  variant?: AnimationVariant;
  start?: AnimationStart;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export function ThemeToggle({
  variant = "circle-blur",
  start = "top-left",
  className,
  size = "icon",
}: ThemeToggleProps) {
  const { toggleTheme } = useThemeWithAnimation({ variant, start });
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size={size} className={className} disabled>
        <SunIcon className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size={size}
      className={className}
      aria-label="Toggle theme"
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
