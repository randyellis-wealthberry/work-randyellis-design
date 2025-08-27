"use client";

import { AnimatedBackground } from "@/components/ui/animated-background";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useState, useCallback } from "react";
import {
  AnimationStart,
  AnimationVariant,
  createAnimation,
} from "@/components/ui/theme-animations";

const THEMES_OPTIONS = [
  {
    label: "Light",
    id: "light",
    icon: <SunIcon className="h-4 w-4" />,
  },
  {
    label: "Dark",
    id: "dark",
    icon: <MoonIcon className="h-4 w-4" />,
  },
  {
    label: "System",
    id: "system",
    icon: <MonitorIcon className="h-4 w-4" />,
  },
];

export default function HeaderThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // Animation configuration matching footer
  const animationVariant: AnimationVariant = "circle-blur";
  const animationStart: AnimationStart = "top-left";
  const styleId = "theme-transition-styles";

  const updateStyles = useCallback((css: string) => {
    if (typeof window === "undefined") return;

    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = css;
  }, []);

  const handleThemeChange = useCallback(
    (newTheme: string) => {
      const animation = createAnimation(animationVariant, animationStart);
      updateStyles(animation.css);

      if (typeof window === "undefined") return;

      const switchTheme = () => {
        setTheme(newTheme);
      };

      if (!document.startViewTransition) {
        switchTheme();
        return;
      }

      document.startViewTransition(switchTheme);
    },
    [setTheme, updateStyles],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <AnimatedBackground
      className="pointer-events-none gap-3 rounded-lg"
      defaultValue={theme}
      transition={{
        type: "spring",
        bounce: 0,
        duration: 0.2,
      }}
      enableHover={false}
      onValueChange={(id) => {
        handleThemeChange(id as string);
      }}
    >
      {THEMES_OPTIONS.map((themeOption) => {
        return (
          <button
            key={themeOption.id}
            className="inline-flex h-8 min-h-[44px] w-8 min-w-[44px] items-center justify-center text-zinc-500 transition-colors duration-100 focus-visible:outline-2 data-[checked=true]:text-zinc-950 sm:h-6 sm:min-h-0 sm:w-6 sm:min-w-0 dark:text-zinc-400 dark:data-[checked=true]:text-zinc-50"
            type="button"
            aria-label={`Switch to ${themeOption.label} theme`}
            data-id={themeOption.id}
            data-testid={`header-theme-${themeOption.id}`}
          >
            {React.cloneElement(themeOption.icon, {
              className: "h-4 w-4 sm:h-3 sm:w-3",
            })}
          </button>
        );
      })}
    </AnimatedBackground>
  );
}
