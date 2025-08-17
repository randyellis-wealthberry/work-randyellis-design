"use client";

import { OrganicScene } from "./organic-scene";
import { NeuralScene } from "./neural-scene";
import { GeometricScene } from "./geometric-scene";

export type SceneType = "organic" | "neural" | "geometric" | "unicorn";

export type SceneProps = {
  color?: string;
  speed?: number;
  intensity?: number;
};

type WebGLSceneFactoryProps = {
  type: SceneType;
  color?: string;
  speed?: number;
  intensity?: number;
};

export function WebGLSceneFactory({ 
  type, 
  color, 
  speed = 1, 
  intensity = 1 
}: WebGLSceneFactoryProps) {
  const sceneProps = { color, speed, intensity };

  switch (type) {
    case "organic":
      return <OrganicScene {...sceneProps} />;
    case "neural":
      return <NeuralScene {...sceneProps} />;
    case "geometric":
      return <GeometricScene {...sceneProps} />;
    case "unicorn":
      // Unicorn Studio scenes are handled separately, not through Three.js
      return null;
    default:
      return <GeometricScene {...sceneProps} />;
  }
}