// Optimized exports for better tree shaking
export { WebGLSceneFactory } from "./scene-factory";
export type { SceneType, SceneProps } from "./scene-factory";

// Dynamic exports for lazy loading
export const OrganicScene = () => import("./organic-scene").then(m => m.OrganicScene);
export const NeuralScene = () => import("./neural-scene").then(m => m.NeuralScene);
export const GeometricScene = () => import("./geometric-scene").then(m => m.GeometricScene);