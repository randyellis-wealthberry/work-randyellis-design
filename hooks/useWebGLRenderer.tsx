"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

export type WebGLCapabilities = {
  hasWebGL: boolean;
  hasWebGL2: boolean;
  maxTextureSize: number;
  isLowPerformance: boolean;
};

export function useWebGLRenderer() {
  const [capabilities, setCapabilities] = useState<WebGLCapabilities | null>(
    null,
  );
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const performanceRef = useRef({ frameCount: 0, lastTime: Date.now() });

  // Detect WebGL capabilities
  useEffect(() => {
    const detectCapabilities = (): WebGLCapabilities => {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      const gl2 = canvas.getContext("webgl2");

      if (!gl || !(gl instanceof WebGLRenderingContext)) {
        return {
          hasWebGL: false,
          hasWebGL2: false,
          maxTextureSize: 0,
          isLowPerformance: true,
        };
      }

      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      const renderer = gl.getParameter(gl.RENDERER);
      const isLowPerformance =
        /software|mesa|swiftshader/i.test(renderer as string) ||
        maxTextureSize < 4096 ||
        navigator.hardwareConcurrency < 4;

      return {
        hasWebGL: true,
        hasWebGL2: !!gl2,
        maxTextureSize,
        isLowPerformance,
      };
    };

    setCapabilities(detectCapabilities());
  }, []);

  // Enhanced intersection observer with performance optimizations
  useEffect(() => {
    if (!containerRef.current) return;

    // Use a more aggressive threshold and rootMargin for better performance
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        setIsInView(isIntersecting);

        // Performance optimization: reduce quality when scrolling quickly
        if (isIntersecting) {
          const scrollSpeed = Math.abs(
            entry.boundingClientRect.top - window.innerHeight / 2,
          );
          if (
            scrollSpeed > 200 &&
            capabilities &&
            !capabilities.isLowPerformance
          ) {
            // User is scrolling fast, temporarily reduce quality
            console.debug(
              "Fast scroll detected, temporarily reducing WebGL quality",
            );
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Start loading before element comes into view
      },
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [capabilities]);

  // Performance monitoring
  const onFrame = useCallback(() => {
    const now = Date.now();
    const perf = performanceRef.current;

    perf.frameCount++;

    // Check FPS every second
    if (now - perf.lastTime > 1000) {
      const fps = perf.frameCount;
      perf.frameCount = 0;
      perf.lastTime = now;

      // If FPS is too low, we might want to reduce quality
      if (fps < 30 && capabilities && !capabilities.isLowPerformance) {
        console.warn("Low FPS detected:", fps);
      }
    }
  }, [capabilities]);

  const handleError = useCallback((error: any) => {
    console.error("WebGL Error:", error);
    setHasError(true);
  }, []);

  // Memoized performance decisions
  const performanceSettings = useMemo(() => {
    const shouldRenderWebGL = capabilities?.hasWebGL && !hasError && isInView;
    const shouldUseLowQuality = capabilities?.isLowPerformance || hasError;

    // Connection-aware quality adjustment
    const connection = (navigator as any).connection;
    const isSlowConnection =
      connection &&
      (connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g" ||
        connection.saveData);

    return {
      shouldRenderWebGL,
      shouldUseLowQuality: shouldUseLowQuality || isSlowConnection,
      dpr:
        shouldUseLowQuality || isSlowConnection
          ? 1
          : Math.min(2, window?.devicePixelRatio || 1),
      antialias: !shouldUseLowQuality && !isSlowConnection,
    };
  }, [capabilities, hasError, isInView]);

  return {
    containerRef,
    capabilities,
    hasError,
    isInView,
    shouldRenderWebGL: performanceSettings.shouldRenderWebGL,
    shouldUseLowQuality: performanceSettings.shouldUseLowQuality,
    dpr: performanceSettings.dpr,
    antialias: performanceSettings.antialias,
    onFrame,
    handleError,
    setHasError,
  };
}
