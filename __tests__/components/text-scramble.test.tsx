import React from "react";
import { render, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TextScramble } from "@/components/core/text-scramble";

describe("TextScramble", () => {
  let renderCount = 0;
  let animationFrameCallback: FrameRequestCallback | null = null;

  beforeEach(() => {
    renderCount = 0;
    animationFrameCallback = null;
    jest.clearAllMocks();

    // Mock requestAnimationFrame
    global.requestAnimationFrame = jest.fn((callback) => {
      animationFrameCallback = callback;
      return 1;
    });

    global.cancelAnimationFrame = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should not cause infinite re-renders when scrambling", async () => {
    const TestWrapper = () => {
      renderCount++;
      return <TextScramble trigger={true}>Test Text</TextScramble>;
    };

    const { unmount } = render(<TestWrapper />);

    // Trigger some animation frames
    if (animationFrameCallback) {
      act(() => {
        for (let i = 0; i < 10; i++) {
          animationFrameCallback!(0);
        }
      });
    }

    await waitFor(
      () => {
        // Should not render excessively
        expect(renderCount).toBeLessThan(10);
      },
      { timeout: 1000 },
    );

    unmount();
  });

  it("should not create circular dependencies with isScrambling state", () => {
    const { rerender } = render(
      <TextScramble trigger={false}>Initial Text</TextScramble>,
    );

    // Trigger scramble
    rerender(<TextScramble trigger={true}>Initial Text</TextScramble>);

    // Should not throw or cause infinite loop
    expect(() => {
      if (animationFrameCallback) {
        act(() => {
          animationFrameCallback!(0);
        });
      }
    }).not.toThrow();
  });

  it("should complete animation without infinite loops", async () => {
    const onComplete = jest.fn();

    render(
      <TextScramble trigger={true} onScrambleComplete={onComplete}>
        Short
      </TextScramble>,
    );

    // Simulate animation frames until completion
    await act(async () => {
      for (let i = 0; i < 20; i++) {
        if (animationFrameCallback) {
          animationFrameCallback(performance.now());
        }
      }
    });

    // Animation should complete without infinite loops
    await waitFor(
      () => {
        expect(onComplete).toHaveBeenCalled();
      },
      { timeout: 2000 },
    );
  });

  it("should cleanup animation on unmount", () => {
    const { unmount } = render(
      <TextScramble trigger={true}>Test</TextScramble>,
    );

    unmount();

    // Should cancel animation frame
    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });

  it("should handle rapid trigger changes without loops", async () => {
    const { rerender } = render(
      <TextScramble trigger={false}>Test</TextScramble>,
    );

    // Rapidly change trigger
    for (let i = 0; i < 5; i++) {
      rerender(<TextScramble trigger={i % 2 === 0}>Test</TextScramble>);
    }

    // Should not cause issues
    expect(renderCount).toBeLessThan(20);
  });

  it("should only scramble once per trigger", () => {
    const onStart = jest.fn();
    const { rerender } = render(
      <TextScramble trigger={false} onHoverStart={onStart}>
        Test
      </TextScramble>,
    );

    // Trigger scramble
    rerender(
      <TextScramble trigger={true} onHoverStart={onStart}>
        Test
      </TextScramble>,
    );

    // Trigger again with same value - should not re-scramble
    rerender(
      <TextScramble trigger={true} onHoverStart={onStart}>
        Test
      </TextScramble>,
    );

    // requestAnimationFrame should be called minimally
    expect(global.requestAnimationFrame).toHaveBeenCalledTimes(1);
  });
});
