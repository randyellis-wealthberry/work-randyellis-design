/**
 * WebGL Testing Utilities
 * Comprehensive testing utilities for 3D WebGL performance validation
 */

import { JSDOM } from "jsdom";

// Mock WebGL context for testing
export const createMockWebGLContext = () => {
  // Avoid infinite recursion by returning a simple mock object
  return {
    createShader: jest.fn(() => ({})),
    shaderSource: jest.fn(),
    compileShader: jest.fn(),
    getShaderParameter: jest.fn(() => true),
    createProgram: jest.fn(() => ({})),
    attachShader: jest.fn(),
    linkProgram: jest.fn(),
    getProgramParameter: jest.fn(() => true),
    useProgram: jest.fn(),
    createBuffer: jest.fn(() => ({})),
    bindBuffer: jest.fn(),
    bufferData: jest.fn(),
    enableVertexAttribArray: jest.fn(),
    vertexAttribPointer: jest.fn(),
    drawArrays: jest.fn(),
    clearColor: jest.fn(),
    clear: jest.fn(),
    viewport: jest.fn(),
    getParameter: jest.fn(() => "WebGL Test Context"),
    getExtension: jest.fn(() => null),
    canvas: {
      width: 800,
      height: 600,
      getContext: jest.fn(() => createMockWebGLContext()),
    },
  };
};

// Performance monitoring utilities
export class WebGLPerformanceMonitor {
  private frameCount = 0;
  private startTime = 0;
  private lastFrameTime = 0;
  private fps = 0;
  private memoryUsage: number[] = [];

  start() {
    this.frameCount = 0;
    this.startTime = performance.now();
    this.lastFrameTime = this.startTime;
  }

  recordFrame() {
    this.frameCount++;
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;

    // Prevent negative or zero delta time
    if (deltaTime > 0) {
      this.fps = 1000 / deltaTime;
    } else {
      this.fps = 60; // Default to 60 FPS if timing is invalid
    }

    this.lastFrameTime = currentTime;

    // Record memory usage if available
    if ((performance as any).memory) {
      this.memoryUsage.push((performance as any).memory.usedJSHeapSize);
    }
  }

  getAverageFPS(): number {
    if (this.frameCount === 0) return 0;
    const totalTime = performance.now() - this.startTime;
    return (this.frameCount * 1000) / totalTime;
  }

  getCurrentFPS(): number {
    return this.fps;
  }

  getMemoryStats() {
    if (this.memoryUsage.length === 0) return null;

    const sorted = [...this.memoryUsage].sort((a, b) => a - b);
    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg:
        this.memoryUsage.reduce((a, b) => a + b, 0) / this.memoryUsage.length,
      median: sorted[Math.floor(sorted.length / 2)],
    };
  }

  reset() {
    this.frameCount = 0;
    this.startTime = 0;
    this.lastFrameTime = 0;
    this.fps = 0;
    this.memoryUsage = [];
  }
}

// WebGL capability detection
export const detectWebGLCapabilities = (gl: WebGLRenderingContext | null) => {
  if (!gl) return null;

  return {
    vendor: gl.getParameter(gl.VENDOR),
    renderer: gl.getParameter(gl.RENDERER),
    version: gl.getParameter(gl.VERSION),
    shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
    maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
    maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
    maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS),
    maxVertexTextureImageUnits: gl.getParameter(
      gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS,
    ),
    maxTextureImageUnits: gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS),
    maxFragmentUniformVectors: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
    maxVertexUniformVectors: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
    extensions: {
      angleInstancedArrays: !!gl.getExtension("ANGLE_instanced_arrays"),
      oesVertexArrayObject: !!gl.getExtension("OES_vertex_array_object"),
      webglDepthTexture: !!gl.getExtension("WEBGL_depth_texture"),
      oesTextureFloat: !!gl.getExtension("OES_texture_float"),
      webglLoseContext: !!gl.getExtension("WEBGL_lose_context"),
    },
  };
};

// WebGL memory leak detection
export const detectMemoryLeaks = async (
  renderFunction: () => void,
  iterations = 100,
  threshold = 50 * 1024 * 1024, // 50MB
): Promise<{
  leaked: boolean;
  initialMemory: number;
  finalMemory: number;
  difference: number;
}> => {
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }

  const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

  // Run render function multiple times
  for (let i = 0; i < iterations; i++) {
    renderFunction();

    // Force garbage collection every 10 iterations
    if (i % 10 === 0 && global.gc) {
      global.gc();
    }
  }

  // Force final garbage collection
  if (global.gc) {
    global.gc();
  }

  await new Promise((resolve) => setTimeout(resolve, 100));

  const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
  const difference = finalMemory - initialMemory;

  return {
    leaked: difference > threshold,
    initialMemory,
    finalMemory,
    difference,
  };
};

// WebGL stress testing
export const stressTestWebGL = async (
  scene: any,
  duration = 5000,
  targetFPS = 60,
): Promise<{
  averageFPS: number;
  minFPS: number;
  maxFPS: number;
  frameDrops: number;
  memoryStats: any;
}> => {
  const monitor = new WebGLPerformanceMonitor();
  monitor.start();

  const fpsHistory: number[] = [];
  let frameDrops = 0;

  const endTime = Date.now() + duration;

  while (Date.now() < endTime) {
    // Render frame
    if (scene && scene.render) {
      scene.render();
    }

    monitor.recordFrame();
    const currentFPS = monitor.getCurrentFPS();
    fpsHistory.push(currentFPS);

    if (currentFPS < targetFPS * 0.9) {
      frameDrops++;
    }

    // Wait for next frame
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  return {
    averageFPS: monitor.getAverageFPS(),
    minFPS: Math.min(...fpsHistory),
    maxFPS: Math.max(...fpsHistory),
    frameDrops,
    memoryStats: monitor.getMemoryStats(),
  };
};

// Device simulation for cross-device testing
export const simulateDevice = (
  type: "mobile" | "tablet" | "desktop" | "low-end",
) => {
  const deviceProfiles = {
    "low-end": {
      viewport: { width: 375, height: 667 },
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1",
      deviceScaleFactor: 2,
      hardwareConcurrency: 2,
      memory: 1024,
      webglRenderer: "Apple A10 GPU",
    },
    mobile: {
      viewport: { width: 375, height: 812 },
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
      deviceScaleFactor: 3,
      hardwareConcurrency: 6,
      memory: 4096,
      webglRenderer: "Apple A15 GPU",
    },
    tablet: {
      viewport: { width: 768, height: 1024 },
      userAgent:
        "Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
      deviceScaleFactor: 2,
      hardwareConcurrency: 8,
      memory: 8192,
      webglRenderer: "Apple A15X GPU",
    },
    desktop: {
      viewport: { width: 1920, height: 1080 },
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      deviceScaleFactor: 1,
      hardwareConcurrency: 12,
      memory: 16384,
      webglRenderer: "AMD Radeon Pro 5500 XT",
    },
  };

  return deviceProfiles[type];
};
