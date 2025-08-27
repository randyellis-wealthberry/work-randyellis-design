import { useEffect, useRef, useState, useCallback } from "react";

export interface AnimationPerformanceMetrics {
  fps: number;
  frameDrops: number;
  memoryUsage: number;
  isAccelerated: boolean;
  averageFrameTime: number;
  maxFrameTime: number;
}

export function useAnimationPerformance() {
  const [metrics, setMetrics] = useState<AnimationPerformanceMetrics>({
    fps: 0,
    frameDrops: 0,
    memoryUsage: 0,
    isAccelerated: false,
    averageFrameTime: 0,
    maxFrameTime: 0,
  });

  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef<number>(0);
  const animationIdRef = useRef<number | null>(null);
  const isMonitoringRef = useRef<boolean>(false);

  const measureFrame = useCallback(() => {
    const currentTime = performance.now();

    if (lastFrameTimeRef.current > 0) {
      const frameTime = currentTime - lastFrameTimeRef.current;
      frameTimesRef.current.push(frameTime);

      // Keep only last 60 frames for rolling average
      if (frameTimesRef.current.length > 60) {
        frameTimesRef.current.shift();
      }
    }

    lastFrameTimeRef.current = currentTime;

    if (isMonitoringRef.current) {
      animationIdRef.current = requestAnimationFrame(measureFrame);
    }
  }, []);

  const startMonitoring = useCallback(() => {
    if (isMonitoringRef.current) return;

    isMonitoringRef.current = true;
    frameTimesRef.current = [];
    lastFrameTimeRef.current = performance.now();
    animationIdRef.current = requestAnimationFrame(measureFrame);
  }, [measureFrame]);

  const stopMonitoring = useCallback(() => {
    isMonitoringRef.current = false;
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }

    // Calculate metrics
    if (frameTimesRef.current.length > 1) {
      const frameTimes = frameTimesRef.current.slice(1); // Remove first frame
      const averageFrameTime =
        frameTimes.reduce((sum, time) => sum + time, 0) / frameTimes.length;
      const fps = 1000 / averageFrameTime;
      const maxFrameTime = Math.max(...frameTimes);

      // Count frames that took longer than 16.67ms (60fps threshold + 20% tolerance)
      const frameDrops = frameTimes.filter((time) => time > 20).length;

      // Check if hardware acceleration is likely being used
      // (This is a heuristic based on consistent frame times)
      const frameTimeStdDev = Math.sqrt(
        frameTimes.reduce(
          (sum, time) => sum + Math.pow(time - averageFrameTime, 2),
          0,
        ) / frameTimes.length,
      );
      const isAccelerated = frameTimeStdDev < 5 && averageFrameTime < 18;

      // Get memory usage if available
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;

      setMetrics({
        fps: Math.round(fps * 10) / 10,
        frameDrops,
        memoryUsage: Math.round((memoryUsage / 1024 / 1024) * 10) / 10, // MB
        isAccelerated,
        averageFrameTime: Math.round(averageFrameTime * 10) / 10,
        maxFrameTime: Math.round(maxFrameTime * 10) / 10,
      });
    }
  }, []);

  const resetMetrics = useCallback(() => {
    frameTimesRef.current = [];
    setMetrics({
      fps: 0,
      frameDrops: 0,
      memoryUsage: 0,
      isAccelerated: false,
      averageFrameTime: 0,
      maxFrameTime: 0,
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return {
    metrics,
    startMonitoring,
    stopMonitoring,
    resetMetrics,
    isMonitoring: isMonitoringRef.current,
  };
}

// Hook for testing performance of specific elements
export function useElementPerformance(
  elementRef: React.RefObject<HTMLElement>,
) {
  const [isAccelerated, setIsAccelerated] = useState(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const computedStyle = window.getComputedStyle(element);

    // Check for hardware acceleration hints
    const hasWillChange =
      computedStyle.willChange.includes("transform") ||
      computedStyle.willChange.includes("opacity");
    const hasTransform3d =
      computedStyle.transform.includes("translateZ") ||
      computedStyle.transform.includes("translate3d");
    const hasBackfaceVisibility = computedStyle.backfaceVisibility === "hidden";

    setIsAccelerated(
      hasWillChange && (hasTransform3d || hasBackfaceVisibility),
    );
  }, [elementRef]);

  return { isAccelerated };
}
