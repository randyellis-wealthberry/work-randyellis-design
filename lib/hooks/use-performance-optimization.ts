import { useState, useEffect, useCallback, useMemo } from "react";

// Performance optimization hook for managing animation states
export function usePerformanceOptimization() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [connectionType, setConnectionType] = useState<"slow" | "fast">("fast");

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange, { passive: true });
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Detect low power mode and connection speed
  useEffect(() => {
    // Check battery API for low power mode
    if ("getBattery" in navigator) {
      // Battery API types
      interface BatteryManager extends EventTarget {
        level: number;
        charging: boolean;
        addEventListener(type: string, listener: EventListener): void;
      }

      interface NavigatorBattery extends Navigator {
        getBattery(): Promise<BatteryManager>;
      }

      const nav = navigator as NavigatorBattery;
      nav
        .getBattery()
        .then((battery: BatteryManager) => {
          const updatePowerMode = () => {
            setIsLowPowerMode(battery.level < 0.2 || !battery.charging);
          };

          updatePowerMode();
          battery.addEventListener("levelchange", updatePowerMode);
          battery.addEventListener("chargingchange", updatePowerMode);
        })
        .catch(() => {
          // Battery API not supported
        });
    }

    // Check network connection
    if ("connection" in navigator) {
      // Network Information API types
      interface NetworkInformation extends EventTarget {
        effectiveType: string;
        addEventListener(type: string, listener: EventListener): void;
      }

      interface NavigatorConnection extends Navigator {
        connection: NetworkInformation;
      }

      const nav = navigator as NavigatorConnection;
      const connection = nav.connection;
      const updateConnectionType = () => {
        const slowTypes = ["slow-2g", "2g", "3g"];
        setConnectionType(
          slowTypes.includes(connection.effectiveType) ? "slow" : "fast",
        );
      };

      updateConnectionType();
      connection.addEventListener("change", updateConnectionType);
    }
  }, []);

  // Memoized optimization settings
  const optimizationSettings = useMemo(
    () => ({
      shouldReduceMotion:
        prefersReducedMotion || isLowPowerMode || connectionType === "slow",
      animationDuration: prefersReducedMotion ? 0 : isLowPowerMode ? 0.1 : 0.3,
      particleCount: connectionType === "slow" ? 5 : isLowPowerMode ? 10 : 20,
      staggerDelay: prefersReducedMotion ? 0 : isLowPowerMode ? 0.05 : 0.1,
    }),
    [prefersReducedMotion, isLowPowerMode, connectionType],
  );

  // Throttled callback creator
  const createThrottledCallback = useCallback(
    (callback: () => void, delay = 100) => {
      let timeoutId: NodeJS.Timeout;
      return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(callback, delay);
      };
    },
    [],
  );

  return {
    optimizationSettings,
    createThrottledCallback,
    prefersReducedMotion,
    isLowPowerMode,
    connectionType,
  };
}
