/**
 * Animation Testing Utilities
 *
 * Provides robust utilities for testing components with animations,
 * requestAnimationFrame, and complex timing scenarios.
 */

import { act } from "@testing-library/react";
import React from "react";

// Track animation frame callbacks for proper cleanup and control
interface AnimationFrameTracker {
  callbacks: Map<number, FrameRequestCallback>;
  nextId: number;
  isRunning: boolean;
}

let animationTracker: AnimationFrameTracker = {
  callbacks: new Map(),
  nextId: 1,
  isRunning: false,
};

/**
 * Enhanced requestAnimationFrame mock that provides deterministic control
 * over animation frames for testing purposes.
 */
export function setupAnimationFrameMocks() {
  // Reset tracker
  animationTracker = {
    callbacks: new Map(),
    nextId: 1,
    isRunning: false,
  };

  const mockRequestAnimationFrame = jest.fn(
    (callback: FrameRequestCallback): number => {
      const id = animationTracker.nextId++;
      animationTracker.callbacks.set(id, callback);
      return id;
    },
  );

  const mockCancelAnimationFrame = jest.fn((id: number): void => {
    animationTracker.callbacks.delete(id);
  });

  // Override global methods
  global.requestAnimationFrame = mockRequestAnimationFrame;
  global.cancelAnimationFrame = mockCancelAnimationFrame;

  return {
    mockRequestAnimationFrame,
    mockCancelAnimationFrame,
    getCallbackCount: () => animationTracker.callbacks.size,
    getAllCallbacks: () => Array.from(animationTracker.callbacks.values()),
    getCallbackIds: () => Array.from(animationTracker.callbacks.keys()),
  };
}

/**
 * Executes a single animation frame in a controlled manner.
 * Wraps the execution in act() to ensure React state updates are processed.
 */
export async function runSingleAnimationFrame(): Promise<void> {
  const callbacks = Array.from(animationTracker.callbacks.values());
  animationTracker.callbacks.clear();

  if (callbacks.length > 0) {
    await act(async () => {
      // Execute all pending callbacks with a mock timestamp
      const timestamp = Date.now();
      for (const callback of callbacks) {
        try {
          callback(timestamp);
        } catch (error) {
          console.error("Animation frame callback error:", error);
        }
      }
    });
  }
}

/**
 * Runs multiple animation frames with proper timing control.
 * Useful for testing animation sequences.
 */
export async function runAnimationFrames(
  count: number,
  frameTime: number = 16,
): Promise<void> {
  for (let i = 0; i < count; i++) {
    await runSingleAnimationFrame();

    // Advance timers to simulate frame timing
    await act(async () => {
      jest.advanceTimersByTime(frameTime);
    });
  }
}

/**
 * Runs animation frames until no more are scheduled.
 * Includes safety limit to prevent infinite loops.
 */
export async function runAnimationFramesToCompletion(
  maxFrames: number = 100,
): Promise<number> {
  let frameCount = 0;

  while (animationTracker.callbacks.size > 0 && frameCount < maxFrames) {
    await runSingleAnimationFrame();
    frameCount++;

    // Small time advance to prevent infinite tight loops
    await act(async () => {
      jest.advanceTimersByTime(16);
    });
  }

  if (frameCount >= maxFrames) {
    console.warn(`Animation frames hit safety limit of ${maxFrames} frames`);
  }

  return frameCount;
}

/**
 * Clears all pending animation frames.
 * Useful for cleanup or stopping runaway animations in tests.
 */
export function clearAnimationFrames(): void {
  animationTracker.callbacks.clear();
}

/**
 * Utility for testing animation lifecycle with proper cleanup.
 * Returns a function to check if animations were properly cleaned up.
 */
export function createAnimationLifecycleTest() {
  const initialCallbackCount = animationTracker.callbacks.size;

  return {
    getActiveAnimations: () => animationTracker.callbacks.size,
    getNewAnimations: () =>
      animationTracker.callbacks.size - initialCallbackCount,
    assertCleanup: () => {
      expect(animationTracker.callbacks.size).toBe(0);
    },
    assertAnimationsStarted: () => {
      expect(animationTracker.callbacks.size).toBeGreaterThan(
        initialCallbackCount,
      );
    },
  };
}

/**
 * Mock for motion/framer-motion components during testing.
 * Provides simple div replacements that maintain data attributes.
 */
export function createMotionMocks() {
  const mockMotionDiv = ({
    children,
    ...props
  }: React.ComponentProps<"div"> & { children?: React.ReactNode }) => {
    // Filter out motion-specific props but keep data-testid and other test attributes
    const filteredProps = Object.keys(props).reduce(
      (acc: Record<string, unknown>, key) => {
        if (
          key.startsWith("data-") ||
          key === "className" ||
          key === "style" ||
          key === "id" ||
          key === "role" ||
          key === "aria-"
        ) {
          acc[key] = (props as Record<string, unknown>)[key];
        }
        return acc;
      },
      {},
    );

    return React.createElement("div", filteredProps, children);
  };

  return {
    motion: {
      div: mockMotionDiv,
      span: mockMotionDiv,
      button: mockMotionDiv,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  };
}

/**
 * Utility for testing setTimeout/setInterval in animations with proper act() wrapping.
 */
export async function advanceTimersWithAct(time: number): Promise<void> {
  await act(async () => {
    jest.advanceTimersByTime(time);
  });
}

/**
 * Utility for testing components that use both RAF and timers.
 */
export async function runTimersAndAnimationFrames(
  timerMs: number,
  frameCount: number = 1,
): Promise<void> {
  // Advance timers first
  await advanceTimersWithAct(timerMs);

  // Then run animation frames
  await runAnimationFrames(frameCount);
}

/**
 * Helper to wait for async animation effects to settle.
 */
export async function waitForAnimationEffects(): Promise<void> {
  await act(async () => {
    // Allow useEffect hooks to run
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}

/**
 * Performance testing utility for animation components.
 * Measures how long it takes to run a certain number of animation frames.
 */
export async function measureAnimationPerformance(frameCount: number): Promise<{
  totalTime: number;
  averageFrameTime: number;
  framesExecuted: number;
}> {
  const startTime = Date.now();
  const framesExecuted = await runAnimationFramesToCompletion(frameCount);
  const totalTime = Date.now() - startTime;

  return {
    totalTime,
    averageFrameTime: totalTime / framesExecuted,
    framesExecuted,
  };
}

/**
 * Utility to test animation states at specific points in time.
 */
export class AnimationTimeline {
  private checkpoints: Array<{
    time: number;
    check: () => void | Promise<void>;
  }> = [];

  addCheckpoint(time: number, check: () => void | Promise<void>) {
    this.checkpoints.push({ time, check });
    // Sort by time to ensure correct execution order
    this.checkpoints.sort((a, b) => a.time - b.time);
  }

  async execute() {
    let currentTime = 0;

    for (const checkpoint of this.checkpoints) {
      // Advance to checkpoint time
      if (checkpoint.time > currentTime) {
        const timeToAdvance = checkpoint.time - currentTime;
        await runTimersAndAnimationFrames(
          timeToAdvance,
          Math.ceil(timeToAdvance / 16),
        );
        currentTime = checkpoint.time;
      }

      // Execute the checkpoint
      await checkpoint.check();
    }
  }
}

// Re-export commonly used testing utilities
export { act } from "@testing-library/react";
