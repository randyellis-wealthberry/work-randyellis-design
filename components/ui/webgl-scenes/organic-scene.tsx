"use client";

import { useRef, useEffect } from "react";
import {
  SphereGeometry,
  BufferGeometry,
  BufferAttribute,
  PlaneGeometry,
  Mesh,
  Group,
  MeshPhongMaterial,
  MeshBasicMaterial,
  PointsMaterial,
  DoubleSide
} from "three";

type OrganicSceneProps = {
  color?: string;
  speed?: number;
  intensity?: number;
};

export function OrganicScene({
  color = "#22c55e",
  speed = 1,
  intensity = 1,
}: OrganicSceneProps) {
  const meshRef = useRef<Mesh>(null);
  const particlesRef = useRef<Group>(null);
  const leavesRef = useRef<Group>(null);

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
        leavesRef.current.rotation.y += 0.005 * speed;
      }
      requestAnimationFrame(animate);
    };

    animate();
  }, [speed]);

  // Create organic geometry
  const createOrganicGeometry = () => {
    const geometry = new SphereGeometry(1.5, 32, 32);
    const vertices = geometry.attributes.position.array;

    // Add organic deformation
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      const z = vertices[i + 2];

      // Create organic bumps and waves
      const noise = Math.sin(x * 3) * Math.cos(y * 2) * Math.sin(z * 4) * 0.3;
      const distance = Math.sqrt(x * x + y * y + z * z);
      const factor = 1 + noise * intensity * 0.5;

      vertices[i] = x * factor;
      vertices[i + 1] = y * factor;
      vertices[i + 2] = z * factor;
    }

    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
  };

  // Create particle system for organic feel
  const createParticles = () => {
    const particleCount = 100 * intensity;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));

    return geometry;
  };

  return (
    <>
      {/* Main organic mesh */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <primitive object={createOrganicGeometry()} />
        <meshPhongMaterial
          color={color}
          transparent
          opacity={0.8}
          shininess={100}
        />
      </mesh>

      {/* Particle system */}
      <group ref={particlesRef}>
        <points>
          <primitive object={createParticles()} />
          <pointsMaterial
            size={0.05}
            color={color}
            transparent
            opacity={0.6}
          />
        </points>
      </group>

      {/* Floating leaves effect */}
      <group ref={leavesRef}>
        {Array.from({ length: Math.floor(20 * intensity) }).map((_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 8,
              (Math.random() - 0.5) * 8,
            ]}
            rotation={[
              Math.random() * Math.PI,
              Math.random() * Math.PI,
              Math.random() * Math.PI,
            ]}
          >
            <primitive object={new PlaneGeometry(0.2, 0.1)} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.4}
              side={DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        color={color}
      />
      <pointLight
        position={[-10, -10, -5]}
        intensity={0.5}
        color={color}
      />
    </>
  );
}