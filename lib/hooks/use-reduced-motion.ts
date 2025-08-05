import { useEffect, useState } from "react";

/**
 * Custom hook to detect user's motion preferences
 * Respects prefers-reduced-motion media query
 * Updates dynamically if user changes system settings
 *
 * @returns boolean - true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if window and matchMedia are available (SSR safety)
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}

/**
 * Motion configuration hook for Framer Motion
 * Returns safe motion values based on user preferences
 *
 * @returns object with motion configuration values
 */
export function useMotionConfig() {
  const prefersReducedMotion = useReducedMotion();

  return {
    duration: prefersReducedMotion ? 0.01 : 0.3,
    ease: prefersReducedMotion ? "linear" : "easeInOut",
    stagger: prefersReducedMotion ? 0 : 0.1,
    scale: prefersReducedMotion ? 1 : undefined,
    y: prefersReducedMotion ? 0 : undefined,
    opacity: 1, // Always animate opacity as it's safe
    transition: {
      duration: prefersReducedMotion ? 0.01 : 0.3,
      ease: prefersReducedMotion ? "linear" : "easeInOut",
    },
  };
}
