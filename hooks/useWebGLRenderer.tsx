"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type WebGLCapabilities = {
  hasWebGL: boolean;
  hasWebGL2: boolean;
  maxTextureSize: number;
  isLowPerformance: boolean;
};

export function useWebGLRenderer() {
  const [capabilities, setCapabilities] = useState<WebGLCapabilities | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const performanceRef = useRef({ frameCount: 0, lastTime: Date.now() });

  // Detect WebGL capabilities
  useEffect(() => {
    const detectCapabilities = (): WebGLCapabilities => {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
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

  // Intersection observer for performance optimization
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

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

  const shouldRenderWebGL = capabilities?.hasWebGL && !hasError && isInView;
  const shouldUseLowQuality = capabilities?.isLowPerformance || hasError;

  return {
    containerRef,
    capabilities,
    hasError,
    isInView,
    shouldRenderWebGL,
    shouldUseLowQuality,
    onFrame,
    handleError,
    setHasError,
  };
}