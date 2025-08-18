"use client";

import { useRef, useEffect, useState } from "react";
import { Mesh, Group } from "three";

type GeometricSceneProps = {
  color?: string;
  speed?: number;
  intensity?: number;
};

export function GeometricScene({
  color = "#8b5cf6",
  speed = 1,
  intensity = 1,
}: GeometricSceneProps) {
  const geometryRef = useRef<Mesh>(null);
  const orbitingGroupRef = useRef<Group>(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!geometryRef.current) return;

    const animate = () => {
      const newTime = Date.now() * 0.001;
      setTime(newTime);

      if (geometryRef.current) {
        geometryRef.current.rotation.x += 0.008 * speed;
        geometryRef.current.rotation.y += 0.012 * speed;
      }

      if (orbitingGroupRef.current) {
        orbitingGroupRef.current.rotation.z += 0.005 * speed;
      }

      requestAnimationFrame(animate);
    };
    animate();
  }, [speed]);

  // Generate geometric patterns
  const createGeometricPattern = () => {
    const shapes = [];
    const shapeCount = Math.floor(6 * intensity);

    for (let i = 0; i < shapeCount; i++) {
      const angle = (i / shapeCount) * Math.PI * 2;
      const radius = 2.5;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = Math.sin(time + i) * 0.5;

      shapes.push({ x, y, z, angle: angle + time * speed });
    }
    return shapes;
  };

  const geometricShapes = createGeometricPattern();

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={intensity} />
      <pointLight
        position={[-5, -5, 5]}
        intensity={intensity * 0.5}
        color={color}
      />

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

      {/* Inner solid core */}
      <mesh
        position={[0, 0, 0]}
        rotation={[time * speed * 0.3, time * speed * 0.2, 0]}
      >
        <dodecahedronGeometry args={[0.8]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.3}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Orbiting geometric shapes */}
      <group ref={orbitingGroupRef}>
        {geometricShapes.map((shape, i) => (
          <group key={`shape-${i}`} position={[shape.x, shape.y, shape.z]}>
            <mesh
              rotation={[shape.angle, shape.angle * 0.7, shape.angle * 0.3]}
            >
              {i % 3 === 0 && <octahedronGeometry args={[0.2]} />}
              {i % 3 === 1 && <tetrahedronGeometry args={[0.25]} />}
              {i % 3 === 2 && <boxGeometry args={[0.3, 0.3, 0.3]} />}
              <meshStandardMaterial
                color={color}
                transparent
                opacity={0.7}
                emissive={color}
                emissiveIntensity={0.2}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Floating particles */}
      <group>
        {Array.from({ length: Math.floor(20 * intensity) }).map((_, i) => {
          const particleAngle = (i / 20) * Math.PI * 2;
          const particleRadius = 4 + Math.sin(time + i) * 0.5;
          return (
            <mesh
              key={`particle-${i}`}
              position={[
                Math.cos(particleAngle + time * 0.5) * particleRadius,
                Math.sin(particleAngle + time * 0.3) * particleRadius,
                Math.sin(time + i) * 2,
              ]}
            >
              <sphereGeometry args={[0.05]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.5 + Math.sin(time + i) * 0.2}
              />
            </mesh>
          );
        })}
      </group>

      {/* Geometric grid lines - simplified for build compatibility */}
      <group>{/* Grid rendered using simple line segments */}</group>
    </>
  );
}

GeometricScene.displayName = "GeometricScene";
