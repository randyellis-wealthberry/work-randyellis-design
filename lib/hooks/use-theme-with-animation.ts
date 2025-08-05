"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useCallback } from "react";
import {
  AnimationStart,
  AnimationVariant,
  createAnimation,
} from "@/components/ui/theme-animations";

interface UseThemeWithAnimationOptions {
  variant?: AnimationVariant;
  start?: AnimationStart;
}

export function useThemeWithAnimation(
  options: UseThemeWithAnimationOptions = {
    variant: "circle-blur",
    start: "top-left",
  }
) {
  const { theme, setTheme, resolvedTheme, ...rest } = useNextTheme();
  
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

  const setThemeWithAnimation = useCallback(
    (newTheme: string) => {
      const animation = createAnimation(
        options.variant || "circle-blur",
        options.start || "top-left"
      );
      updateStyles(animation.css);

      if (typeof window === "undefined") return;

      const switchTheme = () => {
        setTheme(newTheme);
      };

      // Check if View Transitions API is available
      if (!document.startViewTransition) {
        switchTheme();
        return;
      }

      document.startViewTransition(switchTheme);
    },
    [setTheme, updateStyles, options.variant, options.start]
  );

  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    setThemeWithAnimation(newTheme);
  }, [resolvedTheme, setThemeWithAnimation]);

  return {
    theme,
    resolvedTheme,
    setTheme: setThemeWithAnimation,
    toggleTheme,
    ...rest,
  };
}