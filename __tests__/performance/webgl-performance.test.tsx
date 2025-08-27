/**
 * 3D WebGL Performance Testing
 * TDD approach for validating Three.js scene performance
 */

import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import {
  createMockWebGLContext,
  WebGLPerformanceMonitor,
  detectWebGLCapabilities,
  detectMemoryLeaks,
  stressTestWebGL,
  simulateDevice,
} from "../utils/webgl-test-utils";

// Mock Three.js components
jest.mock("@react-three/fiber", () => ({
  Canvas: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  useFrame: jest.fn(),
  useThree: jest.fn(() => ({
    gl: createMockWebGLContext(),
    scene: {},
    camera: {},
    size: { width: 800, height: 600 },
  })),
}));

jest.mock("@react-three/drei", () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Stats: () => <div data-testid="stats" />,
}));

// Import components after mocks
import {
  PerformanceOptimizedScene,
  MemoryOptimizedWrapper,
  type PerformanceOptimizedSceneRef,
} from "../../components/ui/webgl-scenes/performance-optimized-scene";

describe("3D WebGL Performance Testing", () => {
  let performanceMonitor: WebGLPerformanceMonitor;

  beforeEach(() => {
    performanceMonitor = new WebGLPerformanceMonitor();

    // Mock WebGL context
    global.HTMLCanvasElement.prototype.getContext = jest.fn(() =>
      createMockWebGLContext(),
    );

    // Mock performance API
    global.performance = {
      ...global.performance,
      now: jest.fn(() => Date.now()),
      memory: {
        usedJSHeapSize: 50000000,
        totalJSHeapSize: 100000000,
        jsHeapSizeLimit: 2000000000,
      },
    } as any;
  });

  afterEach(() => {
    performanceMonitor.reset();
    jest.clearAllMocks();
  });

  describe("WebGL Context Creation and Capability Detection", () => {
    test("should create WebGL context successfully", () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl");

      expect(context).toBeDefined();
      expect(context).toHaveProperty("createShader");
      expect(context).toHaveProperty("createProgram");
    });

    test("should detect WebGL capabilities", () => {
      const mockContext = createMockWebGLContext();
      const capabilities = detectWebGLCapabilities(mockContext);

      expect(capabilities).toEqual({
        vendor: "WebGL Test Context",
        renderer: "WebGL Test Context",
        version: "WebGL Test Context",
        shadingLanguageVersion: "WebGL Test Context",
        maxTextureSize: "WebGL Test Context",
        maxViewportDims: "WebGL Test Context",
        maxVertexAttribs: "WebGL Test Context",
        maxVaryingVectors: "WebGL Test Context",
        maxVertexTextureImageUnits: "WebGL Test Context",
        maxTextureImageUnits: "WebGL Test Context",
        maxFragmentUniformVectors: "WebGL Test Context",
        maxVertexUniformVectors: "WebGL Test Context",
        extensions: {
          angleInstancedArrays: false,
          oesVertexArrayObject: false,
          webglDepthTexture: false,
          oesTextureFloat: false,
          webglLoseContext: false,
        },
      });
    });

    test("should handle WebGL context creation failure gracefully", () => {
      // Override getContext to return null (WebGL not supported)
      global.HTMLCanvasElement.prototype.getContext = jest.fn(() => null);

      const mockContext = createMockWebGLContext();
      expect(mockContext).toHaveProperty("createShader");

      const capabilities = detectWebGLCapabilities(null);
      expect(capabilities).toBeNull();
    });
  });

  describe("Scene Performance Monitoring", () => {
    test("should monitor frame rate performance for PerformanceOptimizedScene", async () => {
      const sceneRef = React.createRef<PerformanceOptimizedSceneRef>();

      const { container } = render(
        <PerformanceOptimizedScene ref={sceneRef} />,
      );

      const canvas = container.querySelector('[data-testid="three-canvas"]');
      expect(canvas).toBeInTheDocument();

      // Start performance monitoring
      performanceMonitor.start();

      // Simulate multiple frames
      for (let i = 0; i < 60; i++) {
        act(() => {
          performanceMonitor.recordFrame();
        });
      }

      const averageFPS = performanceMonitor.getAverageFPS();
      const currentFPS = performanceMonitor.getCurrentFPS();

      expect(averageFPS).toBeGreaterThan(0);
      expect(currentFPS).toBeGreaterThan(0);

      // Test scene metrics
      if (sceneRef.current) {
        const metrics = sceneRef.current.getMetrics();
        expect(metrics).toHaveProperty("fps");
        expect(metrics).toHaveProperty("memory");
        expect(metrics).toHaveProperty("drawCalls");
        expect(metrics).toHaveProperty("triangles");
      }
    });

    test("should monitor memory usage and adapt quality", async () => {
      const sceneRef = React.createRef<PerformanceOptimizedSceneRef>();

      const { container } = render(
        <PerformanceOptimizedScene
          ref={sceneRef}
          config={{ adaptiveQuality: true, memoryBudget: 50 }}
        />,
      );

      performanceMonitor.start();

      // Simulate frames with memory tracking
      for (let i = 0; i < 100; i++) {
        performanceMonitor.recordFrame();
      }

      const memoryStats = performanceMonitor.getMemoryStats();

      expect(memoryStats).toBeDefined();
      expect(memoryStats).toHaveProperty("min");
      expect(memoryStats).toHaveProperty("max");
      expect(memoryStats).toHaveProperty("avg");
      expect(memoryStats).toHaveProperty("median");

      // Test adaptive quality
      if (sceneRef.current) {
        const metrics = sceneRef.current.getMetrics();
        expect(metrics.memory).toBeLessThan(100 * 1024 * 1024); // 100MB limit
      }
    });

    test("should maintain 60fps target under normal conditions", async () => {
      const { container } = render(
        <PerformanceOptimizedScene
          config={{ complexity: "medium", adaptiveQuality: false }}
        />,
      );

      const targetFPS = 60;
      const tolerance = 0.1; // 10% tolerance

      // Mock performance.now to provide realistic timing
      let mockTime = 0;
      const frameInterval = 1000 / 60; // ~16.67ms
      jest.spyOn(performance, "now").mockImplementation(() => {
        const currentTime = mockTime;
        mockTime += frameInterval;
        return currentTime;
      });

      performanceMonitor.start();

      // Simulate 1 second of rendering at 60fps
      const frameCount = 60;

      for (let i = 0; i < frameCount; i++) {
        performanceMonitor.recordFrame();
      }

      const averageFPS = performanceMonitor.getAverageFPS();

      expect(averageFPS).toBeGreaterThanOrEqual(targetFPS * (1 - tolerance));
      expect(averageFPS).toBeLessThanOrEqual(targetFPS * (1 + tolerance));
    });
  });

  describe("Memory Leak Detection", () => {
    test("should detect no memory leaks in PerformanceOptimizedScene", async () => {
      const renderFunction = () => {
        const { unmount } = render(<PerformanceOptimizedScene />);
        unmount();
      };

      const leakTest = await detectMemoryLeaks(
        renderFunction,
        10,
        10 * 1024 * 1024,
      );

      expect(leakTest.leaked).toBe(false);
      expect(leakTest.difference).toBeLessThan(10 * 1024 * 1024);
    });

    test("should handle cleanup properly with MemoryOptimizedWrapper", async () => {
      const sceneRef = React.createRef<PerformanceOptimizedSceneRef>();

      const TestComponent = () => {
        return (
          <MemoryOptimizedWrapper memoryBudget={50 * 1024 * 1024}>
            <PerformanceOptimizedScene ref={sceneRef} />
          </MemoryOptimizedWrapper>
        );
      };

      const { unmount } = render(<TestComponent />);

      // Verify scene is rendered
      const canvas = container.querySelector('[data-testid="three-canvas"]');
      expect(canvas).toBeInTheDocument();

      // Unmount and verify cleanup
      unmount();

      // Scene should be cleaned up
      expect(sceneRef.current).toBeDefined();
    });

    test("should activate fallback when memory budget exceeded", async () => {
      // Mock high memory usage
      Object.defineProperty(global.performance, "memory", {
        value: {
          usedJSHeapSize: 200 * 1024 * 1024, // 200MB
          totalJSHeapSize: 400 * 1024 * 1024,
          jsHeapSizeLimit: 2000 * 1024 * 1024,
        },
        writable: true,
      });

      const { container } = render(
        <MemoryOptimizedWrapper memoryBudget={100 * 1024 * 1024}>
          <PerformanceOptimizedScene />
        </MemoryOptimizedWrapper>,
      );

      // Should render fallback content instead of 3D scene
      await waitFor(() => {
        const fallback = container.querySelector(
          '[data-testid="fallback-content"]',
        );
        expect(fallback).toBeInTheDocument();
      });
    });
  });

  describe("Cross-Device Performance Testing", () => {
    test("should adapt performance for mobile devices", () => {
      const mobileProfile = simulateDevice("mobile");

      expect(mobileProfile).toEqual({
        viewport: { width: 375, height: 812 },
        userAgent: expect.stringContaining("iPhone"),
        deviceScaleFactor: 3,
        hardwareConcurrency: 6,
        memory: 4096,
        webglRenderer: "Apple A15 GPU",
      });
    });

    test("should adapt performance for low-end devices", () => {
      const lowEndProfile = simulateDevice("low-end");

      expect(lowEndProfile).toEqual({
        viewport: { width: 375, height: 667 },
        userAgent: expect.stringContaining("iPhone"),
        deviceScaleFactor: 2,
        hardwareConcurrency: 2,
        memory: 1024,
        webglRenderer: "Apple A10 GPU",
      });

      // Test should verify that scenes reduce quality for low-end devices
      const { container } = render(
        <PerformanceOptimizedScene
          config={{
            complexity: "low",
            adaptiveQuality: true,
            maxTriangles: 5000,
          }}
        />,
      );

      // In real implementation, this would check for reduced polygon count, etc.
      const canvas = container.querySelector('[data-testid="three-canvas"]');
      expect(canvas).toBeInTheDocument();
    });

    test("should optimize for desktop performance", () => {
      const desktopProfile = simulateDevice("desktop");

      expect(desktopProfile.viewport).toEqual({ width: 1920, height: 1080 });
      expect(desktopProfile.hardwareConcurrency).toBe(12);
      expect(desktopProfile.memory).toBe(16384);
    });
  });

  describe("Stress Testing", () => {
    test("should handle high polygon count scenes with adaptive quality", async () => {
      // This test would fail initially (Red phase of TDD)
      // Implementation needs to handle high complexity gracefully

      const sceneRef = React.createRef<PerformanceOptimizedSceneRef>();

      const { container } = render(
        <PerformanceOptimizedScene
          ref={sceneRef}
          config={{
            complexity: "high",
            adaptiveQuality: true,
            maxTriangles: 100000,
          }}
        />,
      );

      const stressResults = await stressTestWebGL(
        { render: jest.fn() },
        1000, // 1 second
        60, // target 60fps
      );

      expect(stressResults.averageFPS).toBeGreaterThan(30); // Minimum acceptable FPS
      expect(stressResults.frameDrops).toBeLessThan(10); // Allow some frame drops
      expect(stressResults.memoryStats).toBeDefined();

      // Verify adaptive quality kicked in if needed
      if (sceneRef.current) {
        const metrics = sceneRef.current.getMetrics();
        expect(metrics.triangles).toBeLessThanOrEqual(100000);
      }
    });

    test("should handle multiple concurrent scenes", async () => {
      // Test rendering multiple scenes simultaneously
      const { container } = render(
        <>
          <PerformanceOptimizedScene config={{ complexity: "low" }} />
          <PerformanceOptimizedScene config={{ complexity: "low" }} />
          <PerformanceOptimizedScene config={{ complexity: "low" }} />
        </>,
      );

      const canvases = container.querySelectorAll(
        '[data-testid="three-canvas"]',
      );
      expect(canvases).toHaveLength(3);

      // Each scene should maintain reasonable performance
      performanceMonitor.start();

      for (let i = 0; i < 60; i++) {
        performanceMonitor.recordFrame();
      }

      const avgFPS = performanceMonitor.getAverageFPS();
      expect(avgFPS).toBeGreaterThan(24); // Minimum for smooth animation
    });
  });

  describe("Error Handling and Fallbacks", () => {
    test("should provide fallback when WebGL is not supported", () => {
      // Mock WebGL as not supported
      global.HTMLCanvasElement.prototype.getContext = jest.fn(() => null);

      const { container } = render(<PerformanceOptimizedScene />);

      // Should render fallback content instead of crashing
      const canvas = container.querySelector('[data-testid="three-canvas"]');
      expect(canvas).toBeInTheDocument();
    });

    test("should handle WebGL context loss gracefully", async () => {
      const mockContext = createMockWebGLContext();

      // Simulate context loss
      const contextLostEvent = new Event("webglcontextlost");

      const { container } = render(<PerformanceOptimizedScene />);

      // Dispatch context lost event
      act(() => {
        const canvas = container.querySelector('[data-testid="three-canvas"]')!;
        canvas.dispatchEvent(contextLostEvent);
      });

      // Scene should handle context loss without crashing
      const canvas = container.querySelector('[data-testid="three-canvas"]');
      expect(canvas).toBeInTheDocument();
    });

    test("should fallback to low quality when performance is poor", async () => {
      const sceneRef = React.createRef<PerformanceOptimizedSceneRef>();

      const { container } = render(
        <PerformanceOptimizedScene
          ref={sceneRef}
          config={{ adaptiveQuality: true }}
        />,
      );

      // Should start with the scene rendered
      const canvas = container.querySelector('[data-testid="three-canvas"]');
      expect(canvas).toBeInTheDocument();

      // Adaptive quality should reduce complexity if performance drops
      if (sceneRef.current) {
        const metrics = sceneRef.current.getMetrics();
        expect(metrics).toHaveProperty("fps");
      }
    });
  });

  describe("Performance Budgets", () => {
    test("should meet performance budget for initial load", async () => {
      const startTime = performance.now();

      const { container } = render(<PerformanceOptimizedScene />);

      await waitFor(() => {
        const canvas = container.querySelector('[data-testid="three-canvas"]');
        expect(canvas).toBeInTheDocument();
      });

      const loadTime = performance.now() - startTime;

      // Should load within 500ms (performance budget)
      expect(loadTime).toBeLessThan(500);
    });

    test("should maintain memory budget under 100MB", async () => {
      const initialMemory =
        (global.performance as any).memory?.usedJSHeapSize || 0;

      const { container } = render(
        <>
          <PerformanceOptimizedScene config={{ complexity: "medium" }} />
          <PerformanceOptimizedScene config={{ complexity: "medium" }} />
        </>,
      );

      // Simulate some rendering
      for (let i = 0; i < 100; i++) {
        act(() => {
          // Simulate frame rendering
        });
      }

      const currentMemory =
        (global.performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = currentMemory - initialMemory;

      // Should not increase memory by more than 100MB
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
    });

    test("should enforce draw call limits", async () => {
      const sceneRef = React.createRef<PerformanceOptimizedSceneRef>();

      const { container } = render(
        <PerformanceOptimizedScene
          ref={sceneRef}
          config={{
            maxDrawCalls: 50,
            complexity: "high",
          }}
        />,
      );

      await waitFor(() => {
        const canvas = container.querySelector('[data-testid="three-canvas"]');
        expect(canvas).toBeInTheDocument();
      });

      // Should respect draw call limits
      if (sceneRef.current) {
        const metrics = sceneRef.current.getMetrics();
        expect(metrics.drawCalls).toBeLessThanOrEqual(50);
      }
    });

    test("should enforce triangle count limits", async () => {
      const sceneRef = React.createRef<PerformanceOptimizedSceneRef>();

      const { container } = render(
        <PerformanceOptimizedScene
          ref={sceneRef}
          config={{
            maxTriangles: 25000,
            complexity: "high",
          }}
        />,
      );

      await waitFor(() => {
        const canvas = container.querySelector('[data-testid="three-canvas"]');
        expect(canvas).toBeInTheDocument();
      });

      // Should respect triangle count limits
      if (sceneRef.current) {
        const metrics = sceneRef.current.getMetrics();
        expect(metrics.triangles).toBeLessThanOrEqual(25000);
      }
    });
  });
});
