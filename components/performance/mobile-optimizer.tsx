"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Extended Navigator interface for browser APIs
interface ExtendedNavigator extends Navigator {
  deviceMemory?: number;
  connection?: {
    effectiveType?: string;
    downlink?: number;
    addEventListener?: (event: string, handler: () => void) => void;
    removeEventListener?: (event: string, handler: () => void) => void;
  };
  getBattery?: () => Promise<{
    level: number;
    charging: boolean;
  }>;
}

// Extended Performance interface
interface ExtendedPerformance extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

interface MobileOptimizerConfig {
  // Device detection
  isMobile: boolean;
  isLowEndDevice: boolean;
  connectionSpeed: "fast" | "slow" | "offline";

  // Performance settings
  reducedAnimations: boolean;
  limitedParticles: boolean;
  optimizedImages: boolean;

  // Battery optimization
  respectsBatteryLevel: boolean;
  isLowBattery: boolean;
}

interface MobileOptimizerContextType {
  config: MobileOptimizerConfig;
  updateConfig: (updates: Partial<MobileOptimizerConfig>) => void;
}

const MobileOptimizerContext = createContext<
  MobileOptimizerContextType | undefined
>(undefined);

export function MobileOptimizerProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<MobileOptimizerConfig>({
    isMobile: false,
    isLowEndDevice: false,
    connectionSpeed: "fast",
    reducedAnimations: false,
    limitedParticles: false,
    optimizedImages: true,
    respectsBatteryLevel: false,
    isLowBattery: false,
  });

  useEffect(() => {
    const detectDeviceCapabilities = () => {
      // Device detection
      const isMobile =
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ) || window.innerWidth < 768;

      // Performance detection
      const memory = (navigator as ExtendedNavigator).deviceMemory || 4; // Default to 4GB if not available
      const cores = navigator.hardwareConcurrency || 4;
      const isLowEndDevice = memory < 4 || cores < 4;

      // Connection detection
      const connection = (navigator as ExtendedNavigator).connection;
      let connectionSpeed: "fast" | "slow" | "offline" = "fast";

      if (connection) {
        if (
          connection.effectiveType === "2g" ||
          connection.effectiveType === "slow-2g"
        ) {
          connectionSpeed = "slow";
        } else if (
          connection.effectiveType === "3g" &&
          connection.downlink &&
          connection.downlink < 1.5
        ) {
          connectionSpeed = "slow";
        }
      }

      // Battery API detection
      const battery = (navigator as ExtendedNavigator).getBattery?.();
      let respectsBatteryLevel = false;
      let isLowBattery = false;

      if (battery) {
        battery.then((batteryInfo) => {
          respectsBatteryLevel = true;
          isLowBattery = batteryInfo.level < 0.2 || !batteryInfo.charging;
        });
      }

      // Motion preferences
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      setConfig({
        isMobile,
        isLowEndDevice,
        connectionSpeed,
        reducedAnimations: prefersReducedMotion || isLowEndDevice || isMobile,
        limitedParticles: isLowEndDevice || isMobile,
        optimizedImages: connectionSpeed === "slow" || isMobile,
        respectsBatteryLevel,
        isLowBattery,
      });
    };

    detectDeviceCapabilities();

    // Listen for network changes
    const connection = (navigator as ExtendedNavigator).connection;
    if (connection && connection.addEventListener) {
      connection.addEventListener("change", detectDeviceCapabilities);
    }

    // Listen for orientation changes (mobile optimization)
    window.addEventListener("orientationchange", detectDeviceCapabilities);
    window.addEventListener("resize", detectDeviceCapabilities);

    return () => {
      if (connection && connection.removeEventListener) {
        connection.removeEventListener("change", detectDeviceCapabilities);
      }
      window.removeEventListener("orientationchange", detectDeviceCapabilities);
      window.removeEventListener("resize", detectDeviceCapabilities);
    };
  }, []);

  const updateConfig = (updates: Partial<MobileOptimizerConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  return (
    <MobileOptimizerContext.Provider value={{ config, updateConfig }}>
      {children}
    </MobileOptimizerContext.Provider>
  );
}

export function useMobileOptimizer() {
  const context = useContext(MobileOptimizerContext);
  if (context === undefined) {
    throw new Error(
      "useMobileOptimizer must be used within a MobileOptimizerProvider",
    );
  }
  return context;
}

// Performance optimization hook for animations
export function useOptimizedAnimation() {
  const { config } = useMobileOptimizer();

  // Helper functions with proper typing
  const getVariant = (desktop: unknown, mobile: unknown): unknown => {
    return config.reducedAnimations ? mobile : desktop;
  };

  const getAnimationProps = (
    props: Record<string, unknown>,
  ): Record<string, unknown> => {
    if (config.reducedAnimations) {
      return {
        ...props,
        transition: { ...(props.transition as object), duration: 0.2 },
        animate: props.initial, // Skip animations on low-end devices
      };
    }
    return props;
  };

  return {
    // Reduced animation variants for mobile
    getVariant,

    // Conditional animation props
    getAnimationProps,

    // Particle count optimization
    getParticleCount: (baseCount: number) => {
      if (config.limitedParticles) {
        return Math.min(baseCount / 2, 5); // Limit to max 5 particles on mobile
      }
      return baseCount;
    },

    // Stagger delay optimization
    getStaggerDelay: (baseDelay: number) => {
      return config.reducedAnimations ? baseDelay / 2 : baseDelay;
    },
  };
}

// Image optimization hook
export function useOptimizedImages() {
  const { config } = useMobileOptimizer();

  return {
    getImageProps: (src: string, alt: string) => ({
      src,
      alt,
      loading: "lazy" as const,
      quality: config.optimizedImages ? 75 : 90,
      sizes: config.isMobile ? "100vw" : "(max-width: 768px) 100vw, 1200px",
      placeholder: "blur" as const,
    }),

    shouldPreload: (priority: "high" | "medium" | "low") => {
      if (config.connectionSpeed === "slow") {
        return priority === "high";
      }
      return priority !== "low";
    },
  };
}

// Performance monitoring component
export function PerformanceMonitor({ children }: { children: ReactNode }) {
  const { config, updateConfig } = useMobileOptimizer();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;

        // Auto-adjust performance settings based on FPS
        if (fps < 30 && !config.reducedAnimations) {
          updateConfig({
            reducedAnimations: true,
            limitedParticles: true,
          });
          console.warn(`Low FPS detected (${fps}). Enabling performance mode.`);
        }
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);

    // Memory monitoring (if available)
    const memoryInfo = (performance as ExtendedPerformance).memory;
    if (memoryInfo) {
      const checkMemory = () => {
        const memoryUsageMB = memoryInfo.usedJSHeapSize / 1048576;

        if (memoryUsageMB > 50 && !config.reducedAnimations) {
          updateConfig({
            reducedAnimations: true,
            limitedParticles: true,
          });
          console.warn(
            `High memory usage detected (${memoryUsageMB.toFixed(1)}MB). Enabling performance mode.`,
          );
        }
      };

      const memoryInterval = setInterval(checkMemory, 5000);
      return () => clearInterval(memoryInterval);
    }
  }, [config, updateConfig]);

  return <>{children}</>;
}

// Battery-aware component wrapper
export function BatteryOptimized({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { config } = useMobileOptimizer();

  if (config.isLowBattery && fallback) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Network-aware component wrapper
export function NetworkOptimized({
  children,
  slowNetworkFallback,
}: {
  children: ReactNode;
  slowNetworkFallback?: ReactNode;
}) {
  const { config } = useMobileOptimizer();

  if (config.connectionSpeed === "slow" && slowNetworkFallback) {
    return <>{slowNetworkFallback}</>;
  }

  return <>{children}</>;
}

// Device-specific performance wrapper
export function DeviceOptimized({
  desktop,
  mobile,
  lowEnd,
}: {
  desktop: ReactNode;
  mobile?: ReactNode;
  lowEnd?: ReactNode;
}) {
  const { config } = useMobileOptimizer();

  if (config.isLowEndDevice && lowEnd) {
    return <>{lowEnd}</>;
  }

  if (config.isMobile && mobile) {
    return <>{mobile}</>;
  }

  return <>{desktop}</>;
}
