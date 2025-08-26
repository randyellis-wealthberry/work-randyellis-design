"use client";

import {
  useRef,
  useEffect,
  useState,
  useMemo,
  Suspense,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Mesh, Group, WebGLRenderer } from "three";
import { Stats, OrbitControls } from "@react-three/drei";

// Performance monitoring utilities
interface PerformanceMetrics {
  fps: number;
  memory: number;
  drawCalls: number;
  triangles: number;
}

interface SceneConfig {
  complexity: "low" | "medium" | "high";
  maxTriangles: number;
  maxDrawCalls: number;
  adaptiveQuality: boolean;
  memoryBudget: number; // MB
}

// Adaptive quality manager
class AdaptiveQualityManager {
  private targetFPS = 60;
  private currentComplexity: "low" | "medium" | "high" = "high";
  private frameHistory: number[] = [];
  private memoryHistory: number[] = [];

  updateMetrics(fps: number, memory: number) {
    this.frameHistory.push(fps);
    this.memoryHistory.push(memory);

    // Keep only last 60 frames
    if (this.frameHistory.length > 60) {
      this.frameHistory.shift();
      this.memoryHistory.shift();
    }

    this.adaptQuality();
  }

  private adaptQuality() {
    if (this.frameHistory.length < 10) return;

    const avgFPS =
      this.frameHistory.reduce((a, b) => a + b, 0) / this.frameHistory.length;
    const avgMemory =
      this.memoryHistory.reduce((a, b) => a + b, 0) / this.memoryHistory.length;

    // Reduce quality if FPS is too low or memory too high
    if (avgFPS < this.targetFPS * 0.8 || avgMemory > 100 * 1024 * 1024) {
      if (this.currentComplexity === "high") this.currentComplexity = "medium";
      else if (this.currentComplexity === "medium")
        this.currentComplexity = "low";
    }
    // Increase quality if performance allows
    else if (avgFPS > this.targetFPS * 0.95 && avgMemory < 50 * 1024 * 1024) {
      if (this.currentComplexity === "low") this.currentComplexity = "medium";
      else if (this.currentComplexity === "medium")
        this.currentComplexity = "high";
    }
  }

  getComplexity() {
    return this.currentComplexity;
  }

  reset() {
    this.frameHistory = [];
    this.memoryHistory = [];
    this.currentComplexity = "high";
  }
}

// Optimized geometric scene component
function OptimizedGeometricScene({ config }: { config: SceneConfig }) {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const qualityManager = useMemo(() => new AdaptiveQualityManager(), []);

  const { gl } = useThree();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    drawCalls: 0,
    triangles: 0,
  });

  // Memoized geometry based on complexity
  const geometry = useMemo(() => {
    const complexity = config.adaptiveQuality
      ? qualityManager.getComplexity()
      : "high";

    switch (complexity) {
      case "low":
        return { subdivisions: 0, particleCount: 10, shapeCount: 3 };
      case "medium":
        return { subdivisions: 1, particleCount: 20, shapeCount: 6 };
      case "high":
        return { subdivisions: 2, particleCount: 30, shapeCount: 12 };
    }
  }, [qualityManager, config.adaptiveQuality]);

  useFrame((state, delta) => {
    if (!meshRef.current || !groupRef.current) return;

    // Update animations
    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.rotation.y += delta * 0.3;
    groupRef.current.rotation.z += delta * 0.2;

    // Collect performance metrics
    const fps = 1 / delta;
    const memory = (performance as any).memory?.usedJSHeapSize || 0;
    const info = gl.info;

    const currentMetrics = {
      fps: Math.round(fps),
      memory,
      drawCalls: info.render.calls,
      triangles: info.render.triangles,
    };

    setMetrics(currentMetrics);

    // Update adaptive quality
    if (config.adaptiveQuality) {
      qualityManager.updateMetrics(fps, memory);
    }

    // Reset renderer stats
    info.reset();
  });

  return (
    <>
      {/* Optimized lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />

      {/* Main geometry with LOD */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, geometry.subdivisions]} />
        <meshStandardMaterial
          color="#8b5cf6"
          wireframe
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Orbiting shapes - reduced count for performance */}
      <group ref={groupRef}>
        {Array.from({ length: geometry.shapeCount }).map((_, i) => {
          const angle = (i / geometry.shapeCount) * Math.PI * 2;
          const radius = 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
            >
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial color="#8b5cf6" />
            </mesh>
          );
        })}
      </group>

      {/* Reduced particle system */}
      <group>
        {Array.from({ length: geometry.particleCount }).map((_, i) => {
          const angle = (i / geometry.particleCount) * Math.PI * 2;
          const radius = 3;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                Math.sin(i) * 0.5,
              ]}
            >
              <sphereGeometry args={[0.03]} />
              <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

// Scene wrapper component with performance monitoring
export interface PerformanceOptimizedSceneRef {
  getMetrics: () => PerformanceMetrics;
  resetQuality: () => void;
}

export const PerformanceOptimizedScene = forwardRef<
  PerformanceOptimizedSceneRef,
  {
    config?: Partial<SceneConfig>;
    onMetrics?: (metrics: PerformanceMetrics) => void;
  }
>(({ config = {}, onMetrics }, ref) => {
  const [currentMetrics, setCurrentMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    drawCalls: 0,
    triangles: 0,
  });

  const qualityManagerRef = useRef<AdaptiveQualityManager>();

  const defaultConfig: SceneConfig = {
    complexity: "high",
    maxTriangles: 50000,
    maxDrawCalls: 100,
    adaptiveQuality: true,
    memoryBudget: 100,
    ...config,
  };

  useImperativeHandle(ref, () => ({
    getMetrics: () => currentMetrics,
    resetQuality: () => {
      qualityManagerRef.current?.reset();
    },
  }));

  useEffect(() => {
    if (onMetrics) {
      onMetrics(currentMetrics);
    }
  }, [currentMetrics, onMetrics]);

  return (
    <div
      data-testid="scene-container"
      style={{ width: "100%", height: "400px" }}
    >
      <Canvas
        data-testid="three-canvas"
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{
          antialias: false, // Disabled for performance
          powerPreference: "high-performance",
          alpha: true,
          preserveDrawingBuffer: false,
        }}
        dpr={Math.min(window.devicePixelRatio, 2)} // Cap pixel ratio for performance
        performance={{
          min: 0.5, // Allow lower performance on weak devices
          max: 1.0,
          debounce: 200,
        }}
      >
        <Suspense fallback={null}>
          <OptimizedGeometricScene config={defaultConfig} />
          <OrbitControls enablePan={false} enableZoom={false} />
          {process.env.NODE_ENV === "development" && <Stats />}
        </Suspense>
      </Canvas>
    </div>
  );
});

PerformanceOptimizedScene.displayName = "PerformanceOptimizedScene";

// Memory-conscious loading wrapper
export function MemoryOptimizedWrapper({
  children,
  memoryBudget = 100 * 1024 * 1024, // 100MB default
}: {
  children: React.ReactNode;
  memoryBudget?: number;
}) {
  const [canRender, setCanRender] = useState(true);

  useEffect(() => {
    const checkMemory = () => {
      if ((performance as any).memory) {
        const used = (performance as any).memory.usedJSHeapSize;
        if (used > memoryBudget) {
          setCanRender(false);
        }
      }
    };

    checkMemory();
    const interval = setInterval(checkMemory, 1000);
    return () => clearInterval(interval);
  }, [memoryBudget]);

  if (!canRender) {
    return (
      <div data-testid="fallback-content" className="p-8 text-center">
        <p>3D content disabled to preserve memory</p>
      </div>
    );
  }

  return <>{children}</>;
}
