"use client";

import { useRef, useEffect } from "react";
import { Group } from "three";

type NeuralSceneProps = {
  color?: string;
  speed?: number;
  intensity?: number;
};

export function NeuralScene({
  color = "#3b82f6",
  speed = 1,
  intensity = 1,
}: NeuralSceneProps) {
  const nodesRef = useRef<Group>(null);
  const connectionsRef = useRef<Group>(null);

  useEffect(() => {
    if (!nodesRef.current) return;

    const animate = () => {
      if (nodesRef.current) {
        nodesRef.current.rotation.y += 0.005 * speed;
      }
      if (connectionsRef.current) {
        connectionsRef.current.rotation.y += 0.003 * speed;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }, [speed]);

  // Generate neural network nodes positions
  const generateNodePositions = () => {
    const positions: [number, number, number][] = [];
    const layers = 3;
    const nodesPerLayer = Math.floor(8 * intensity);

    for (let layer = 0; layer < layers; layer++) {
      for (let node = 0; node < nodesPerLayer; node++) {
        const angle = (node / nodesPerLayer) * Math.PI * 2;
        const radius = 1.5 + layer * 0.8;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (layer - 1) * 1.2;
        positions.push([x, y, z]);
      }
    }
    return positions;
  };

  const nodePositions = generateNodePositions();

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={intensity} />
      <pointLight position={[-5, -5, -5]} intensity={intensity * 0.5} color={color} />

      {/* Neural network nodes */}
      <group ref={nodesRef}>
        {nodePositions.map((position, i) => (
          <mesh key={`node-${i}`} position={position}>
            <sphereGeometry args={[0.08 + Math.random() * 0.04]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.2 + Math.random() * 0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Connection lines */}
      <group ref={connectionsRef}>
        {nodePositions.map((position, i) => {
          // Connect to nearby nodes
          const connections = nodePositions
            .slice(i + 1)
            .filter((_, idx) => idx < 3 && Math.random() > 0.3)
            .slice(0, 2);

          return connections.map((targetPos, connIdx) => {
            const midPoint = [
              (position[0] + targetPos[0]) / 2,
              (position[1] + targetPos[1]) / 2,
              (position[2] + targetPos[2]) / 2,
            ] as [number, number, number];

            const distance = Math.sqrt(
              Math.pow(targetPos[0] - position[0], 2) +
              Math.pow(targetPos[1] - position[1], 2) +
              Math.pow(targetPos[2] - position[2], 2)
            );

            const angle = Math.atan2(
              targetPos[1] - position[1],
              targetPos[0] - position[0]
            );

            return (
              <mesh
                key={`connection-${i}-${connIdx}`}
                position={midPoint}
                rotation={[0, 0, angle]}
              >
                <cylinderGeometry args={[0.008, 0.008, distance]} />
                <meshStandardMaterial
                  color={color}
                  transparent
                  opacity={0.4 + Math.random() * 0.3}
                  emissive={color}
                  emissiveIntensity={0.1}
                />
              </mesh>
            );
          });
        })}
      </group>

      {/* Pulsing energy particles */}
      <group>
        {Array.from({ length: Math.floor(30 * intensity) }).map((_, i) => (
          <mesh
            key={`particle-${i}`}
            position={[
              (Math.random() - 0.5) * 6,
              (Math.random() - 0.5) * 6,
              (Math.random() - 0.5) * 4,
            ]}
          >
            <sphereGeometry args={[0.02]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.6 + Math.random() * 0.4}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}