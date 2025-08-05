"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { initializePerformanceMonitoring } from "@/lib/performance-monitor";

interface PerformanceContextType {
  metrics: {
    lcp?: number;
    fid?: number;
    cls?: number;
    fcp?: number;
    ttfb?: number;
  };
  isMonitoring: boolean;
}

const PerformanceContext = createContext<PerformanceContextType>({
  metrics: {},
  isMonitoring: false,
});

export const usePerformance = () => useContext(PerformanceContext);

interface PerformanceProviderProps {
  children: React.ReactNode;
}

export function PerformanceProvider({ children }: PerformanceProviderProps) {
  const [metrics, setMetrics] = useState<PerformanceContextType["metrics"]>({});
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMonitoring(true);

      try {
        // Initialize performance monitoring
        const monitor = initializePerformanceMonitoring();

        if (!monitor) {
          console.warn("Performance monitoring could not be initialized");
          setIsMonitoring(false);
          return;
        }

        // Update metrics periodically
        const updateMetrics = () => {
          try {
            const currentMetrics = monitor.getMetrics();
            setMetrics({
              lcp: currentMetrics.lcp,
              fid: currentMetrics.fid,
              cls: currentMetrics.cls,
              fcp: currentMetrics.fcp,
              ttfb: currentMetrics.ttfb,
            });
          } catch (error) {
            console.warn("Failed to get metrics:", error);
          }
        };

        // Initial update
        updateMetrics();

        // Update every 5 seconds
        const interval = setInterval(updateMetrics, 5000);

        // Web Vitals reporting with Next.js integration
        if ("PerformanceObserver" in window) {
          // Report to Next.js Analytics
          // const reportWebVital = (metric: unknown) => {
          //   // Send to Vercel Analytics if available
          //   if (window.va) {
          //     window.va("track", "Web Vital", {
          //       name: metric.name,
          //       value: metric.value,
          //       rating: metric.rating,
          //       delta: metric.delta,
          //       id: metric.id,
          //     });
          //   }

          //   // Update local state
          //   updateMetrics();
          // };

          // Import and use Next.js web vitals reporting
          import("next/navigation").then(() => {
            // This would be used in _app.tsx but we'll handle it here for App Router
          });
        }

        return () => {
          clearInterval(interval);
          if (monitor) {
            monitor.destroy();
          }
        };
      } catch (error) {
        console.warn("Performance monitoring initialization failed:", error);
        setIsMonitoring(false);
      }
    }
  }, []);

  return (
    <PerformanceContext.Provider value={{ metrics, isMonitoring }}>
      {children}
    </PerformanceContext.Provider>
  );
}

// Performance Budget Component
export function PerformanceBudget() {
  const { metrics } = usePerformance();

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const budgets = {
    lcp: { budget: 2500, label: "LCP" },
    fid: { budget: 100, label: "FID" },
    cls: { budget: 0.1, label: "CLS" },
    fcp: { budget: 1800, label: "FCP" },
    ttfb: { budget: 800, label: "TTFB" },
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 shadow-lg text-xs font-mono">
      <div className="font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
        Performance Budget
      </div>
      {Object.entries(budgets).map(([key, { budget, label }]) => {
        const value = metrics[key as keyof typeof metrics];
        const isOverBudget = value !== undefined && value > budget;
        const percentage =
          value !== undefined ? Math.min((value / budget) * 100, 100) : 0;

        return (
          <div key={key} className="flex items-center gap-2 mb-1">
            <div className="w-8 text-zinc-600 dark:text-zinc-400">{label}</div>
            <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-full h-2 relative overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isOverBudget
                    ? "bg-red-500"
                    : percentage > 80
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div
              className={`w-12 text-right ${
                isOverBudget
                  ? "text-red-500"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              {value !== undefined ? Math.round(value) : "-"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
