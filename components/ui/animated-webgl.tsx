"use client";

import { cn } from "@/lib/utils";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { AnimatedAsset } from "./animated-asset";
import { UnicornWebGL } from "./unicorn-webgl";

type WebGLSceneProps = {
  type: "organic" | "neural" | "geometric" | "unicorn";
  color?: string;
  speed?: number;
  intensity?: number;
};

type AnimatedWebGLProps = {
  sceneType: "organic" | "neural" | "geometric" | "unicorn";
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
  expandedClassName?: string;
  transition?: {
    type?: string;
    bounce?: number;
    duration?: number;
  };
  hoverScale?: number;
  showCloseButton?: boolean;
  disableZoom?: boolean;
  color?: string;
  speed?: number;
  intensity?: number;
};

// Organic growth scene for GrowIt project
function OrganicScene({
  color = "#22c55e",
  speed = 1,
  intensity = 1,
}: Partial<WebGLSceneProps>) {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Group>(null);
  const leavesRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!meshRef.current) return;

    const animate = () => {
      if (meshRef.current) {
        meshRef.current.rotation.x += 0.008 * speed;
        meshRef.current.rotation.y += 0.012 * speed;
      }
      if (particlesRef.current) {
        particlesRef.current.rotation.z += 0.003 * speed;
      }
      if (leavesRef.current) {
        leavesRef.current.rotation.y += 0.006 * speed;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, [speed]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[8, 8, 8]} intensity={intensity * 0.8} />
      <pointLight
        position={[-4, -4, 4]}
        intensity={intensity * 0.3}
        color="#90ee90"
      />

      {/* Main organic vine-like structure - centered */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <torusKnotGeometry args={[1.2, 0.25, 120, 20]} />
        <meshStandardMaterial
          color={color}
          wireframe={false}
          transparent
          opacity={0.85}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Growth particles - seeds/pollen */}
      <group ref={particlesRef}>
        {Array.from({ length: 25 }).map((_, i) => {
          const angle = (i / 25) * Math.PI * 2;
          const radius = 2.5 + Math.sin(i * 0.8) * 0.5;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                Math.sin(i * 0.4) * 1.5,
                Math.sin(angle) * radius,
              ]}
            >
              <sphereGeometry args={[0.04 + Math.sin(i) * 0.02]} />
              <meshStandardMaterial
                color={i % 3 === 0 ? "#90ee90" : color}
                transparent
                opacity={0.8}
              />
            </mesh>
          );
        })}
      </group>

      {/* Leaf-like elements */}
      <group ref={leavesRef}>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 1.8;
          return (
            <mesh
              key={`leaf-${i}`}
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle) * 0.3,
                Math.sin(angle) * radius,
              ]}
              rotation={[angle, 0, Math.PI / 4]}
            >
              <planeGeometry args={[0.3, 0.6]} />
              <meshStandardMaterial
                color="#32cd32"
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

// Neural network scene for AI projects
function NeuralScene({
  color = "#3b82f6",
  speed = 1,
  intensity = 1,
}: Partial<WebGLSceneProps>) {
  const nodesRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!nodesRef.current) return;

    const animate = () => {
      if (nodesRef.current) {
        nodesRef.current.rotation.y += 0.005 * speed;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, [speed]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={intensity} />

      {/* Neural network nodes */}
      <group ref={nodesRef}>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const radius = 2;
          return (
            <group key={i}>
              {/* Node */}
              <mesh
                position={[
                  Math.cos(angle) * radius,
                  Math.sin(angle) * radius,
                  0,
                ]}
              >
                <sphereGeometry args={[0.1]} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={0.2}
                />
              </mesh>

              {/* Connection lines (simplified as thin cylinders) */}
              {i < 11 && (
                <mesh
                  position={[
                    Math.cos(angle) * radius * 0.5 +
                      Math.cos(((i + 1) / 12) * Math.PI * 2) * radius * 0.5,
                    Math.sin(angle) * radius * 0.5 +
                      Math.sin(((i + 1) / 12) * Math.PI * 2) * radius * 0.5,
                    0,
                  ]}
                  rotation={[0, 0, angle + Math.PI / 12]}
                >
                  <cylinderGeometry args={[0.01, 0.01, radius * 0.8]} />
                  <meshStandardMaterial
                    color={color}
                    transparent
                    opacity={0.6}
                  />
                </mesh>
              )}
            </group>
          );
        })}
      </group>
    </>
  );
}

// Geometric scene for general projects
function GeometricScene({
  color = "#8b5cf6",
  speed = 1,
  intensity = 1,
}: Partial<WebGLSceneProps>) {
  const geometryRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!geometryRef.current) return;

    const animate = () => {
      if (geometryRef.current) {
        geometryRef.current.rotation.x += 0.008 * speed;
        geometryRef.current.rotation.y += 0.012 * speed;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, [speed]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={intensity} />

      {/* Main geometric shape */}
      <mesh ref={geometryRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          color={color}
          wireframe={true}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Orbiting smaller shapes */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((Date.now() * 0.001 + i * 2) * speed) * 3,
            Math.sin((Date.now() * 0.001 + i * 2) * speed) * 3,
            0,
          ]}
        >
          <octahedronGeometry args={[0.3]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </>
  );
}

function WebGLScene({ type, color, speed, intensity }: WebGLSceneProps) {
  switch (type) {
    case "organic":
      return <OrganicScene color={color} speed={speed} intensity={intensity} />;
    case "neural":
      return <NeuralScene color={color} speed={speed} intensity={intensity} />;
    case "geometric":
      return (
        <GeometricScene color={color} speed={speed} intensity={intensity} />
      );
    case "unicorn":
      // Unicorn Studio scenes are handled separately, not through Three.js
      return null;
    default:
      return (
        <GeometricScene color={color} speed={speed} intensity={intensity} />
      );
  }
}

export const AnimatedWebGL = ({
  sceneType,
  fallbackSrc,
  className,
  containerClassName,
  expandedClassName,
  transition = {
    type: "spring",
    bounce: 0,
    duration: 0.3,
  },
  hoverScale = 1.02,
  showCloseButton = true,
  disableZoom = false,
  color,
  speed = 1,
  intensity = 1,
}: AnimatedWebGLProps) => {
  const [webglSupported, setWebglSupported] = useState(true);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure we're on the client side
    if (typeof window === "undefined") return;

    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
          /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent,
          ),
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Check WebGL support with error handling
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebglSupported(false);
      }
    } catch (error) {
      console.warn("WebGL support check failed:", error);
      setWebglSupported(false);
    }

    // Intersection Observer for performance optimization
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "50px" },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Handle Unicorn Studio scenes
  if (sceneType === "unicorn") {
    if (disableZoom) {
      return (
        <div ref={containerRef}>
          <UnicornWebGL
            className={cn("aspect-video w-full h-full", className)}
            onError={() => setHasError(true)}
          />
        </div>
      );
    }
    return (
      <div ref={containerRef}>
        <AnimatedAsset
          className={className}
          containerClassName={containerClassName}
          expandedClassName={expandedClassName}
          transition={transition}
          hoverScale={hoverScale}
          showCloseButton={showCloseButton}
          expandedChildren={
            <div className="aspect-video h-[50vh] w-full rounded-xl md:h-[70vh] overflow-hidden">
              <UnicornWebGL
                className="w-full h-full"
                onError={() => setHasError(true)}
              />
            </div>
          }
        >
          <UnicornWebGL
            className={cn("aspect-video w-full h-full", className)}
            onError={() => setHasError(true)}
          />
        </AnimatedAsset>
      </div>
    );
  }

  // Fallback to video/image if WebGL not supported, on mobile, or has error
  if ((!webglSupported || hasError || isMobile) && fallbackSrc) {
    if (disableZoom) {
      return (
        <div ref={containerRef}>
          <video
            src={fallbackSrc}
            autoPlay
            loop
            muted
            playsInline
            className={cn("aspect-video w-full h-full object-cover", className)}
          />
        </div>
      );
    }

    return (
      <div ref={containerRef}>
        <AnimatedAsset
          className={className}
          containerClassName={containerClassName}
          expandedClassName={expandedClassName}
          transition={transition}
          hoverScale={hoverScale}
          showCloseButton={showCloseButton}
        >
          <video
            src={fallbackSrc}
            autoPlay
            loop
            muted
            playsInline
            className="aspect-video w-full h-full object-cover"
          />
        </AnimatedAsset>
      </div>
    );
  }

  const webglContent = (
    <div className={cn("aspect-video w-full h-full", className)}>
      {isInView && (
        <Canvas
          camera={{ position: [0, 0, 8], fov: 45 }}
          style={{ width: "100%", height: "100%" }}
          dpr={
            typeof window !== "undefined"
              ? Math.min(window.devicePixelRatio, 2)
              : 1
          } // Limit DPR for performance
          performance={{ min: 0.5 }} // Adaptive performance
          onError={() => setHasError(true)}
          gl={{
            antialias: false, // Disable for better performance
            alpha: true,
            powerPreference: "low-power",
          }}
        >
          <Suspense fallback={null}>
            <WebGLScene
              type={sceneType}
              color={color}
              speed={speed}
              intensity={intensity}
            />
          </Suspense>
        </Canvas>
      )}
    </div>
  );

  if (disableZoom) {
    return <div ref={containerRef}>{webglContent}</div>;
  }

  return (
    <div ref={containerRef}>
      <AnimatedAsset
        className="overflow-hidden"
        containerClassName={containerClassName}
        expandedClassName={expandedClassName}
        transition={transition}
        hoverScale={hoverScale}
        showCloseButton={showCloseButton}
        expandedChildren={
          <div className="aspect-video h-[50vh] w-full rounded-xl md:h-[70vh] overflow-hidden">
            <Canvas
              camera={{ position: [0, 0, 8], fov: 45 }}
              style={{ width: "100%", height: "100%" }}
              dpr={
                typeof window !== "undefined"
                  ? Math.min(window.devicePixelRatio, 2)
                  : 1
              }
              performance={{ min: 0.5 }}
              onError={() => setHasError(true)}
              gl={{
                antialias: true, // Enable for expanded view
                alpha: true,
                powerPreference: "default",
              }}
            >
              <Suspense fallback={null}>
                <WebGLScene
                  type={sceneType}
                  color={color}
                  speed={speed * 0.8} // Slower in expanded view
                  intensity={intensity * 1.2} // Higher intensity for expanded
                />
              </Suspense>
            </Canvas>
          </div>
        }
      >
        {webglContent}
      </AnimatedAsset>
    </div>
  );
};
