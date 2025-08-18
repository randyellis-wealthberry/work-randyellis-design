"use client";

import { lazy, Suspense } from "react";

// Dynamic imports for 3D scenes
const OrganicScene = lazy(() =>
  import("./organic-scene").then((m) => ({ default: m.OrganicScene })),
);
const NeuralScene = lazy(() =>
  import("./neural-scene").then((m) => ({ default: m.NeuralScene })),
);
const GeometricScene = lazy(() =>
  import("./geometric-scene").then((m) => ({ default: m.GeometricScene })),
);

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

// Loading fallback for 3D scenes
const SceneLoader = () => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
  </div>
);

export function WebGLSceneFactory({
  type,
  color,
  speed = 1,
  intensity = 1,
}: WebGLSceneFactoryProps) {
  const sceneProps = { color, speed, intensity };

  const renderScene = () => {
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
  };

  if (type === "unicorn") {
    return null;
  }

  return <Suspense fallback={<SceneLoader />}>{renderScene()}</Suspense>;
}

WebGLSceneFactory.displayName = "WebGLSceneFactory";
SceneLoader.displayName = "SceneLoader";
