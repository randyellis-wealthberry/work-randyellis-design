# Animation Testing Framework

This directory contains robust testing utilities for React components that use animations, `requestAnimationFrame`, and complex timing scenarios.

## Overview

The animation testing framework provides deterministic control over animations in test environments, addressing common issues with:

- **requestAnimationFrame** mocking and execution
- **React act()** integration for state updates
- **Timer and animation frame coordination**
- **Cleanup and memory leak prevention**
- **Performance testing for animations**

## Key Features

### ✅ Deterministic Animation Control

- Controlled execution of animation frames
- No infinite loops or test timeouts
- Predictable timing for assertions

### ✅ React Integration

- Proper `act()` wrapping for state updates
- Support for useEffect hooks
- Compatible with React Testing Library

### ✅ Performance Testing

- Animation performance measurement
- Frame rate validation
- Memory usage monitoring

### ✅ Cleanup Management

- Automatic cleanup of animation frames
- Memory leak prevention
- Component lifecycle testing

## Core Utilities

### `setupAnimationFrameMocks()`

Creates enhanced requestAnimationFrame mocks with deterministic control:

```typescript
const animationMocks = setupAnimationFrameMocks();

// Check active animations
console.log(animationMocks.getCallbackCount()); // Number of pending frames

// Manual execution control
expect(animationMocks.mockRequestAnimationFrame).toHaveBeenCalled();
```

### `runSingleAnimationFrame()`

Executes one animation frame with proper React integration:

```typescript
// Trigger animation
fireEvent.click(animateButton);

// Execute a single frame
await runSingleAnimationFrame();

// Assert animation state
expect(elementPosition).toHaveChanged();
```

### `runAnimationFrames(count, frameTime?)`

Runs multiple animation frames with controlled timing:

```typescript
// Run 10 frames at 60fps (16ms each)
await runAnimationFrames(10, 16);

// Run 5 frames with default timing
await runAnimationFrames(5);
```

### `advanceTimersWithAct(time)`

Advances timers while properly handling React state updates:

```typescript
// Fast-forward 1 second with proper state handling
await advanceTimersWithAct(1000);

// Check that timeout-based cleanup occurred
expect(particles).toHaveLength(0);
```

### `AnimationTimeline`

Test animations at specific points in time:

```typescript
const timeline = new AnimationTimeline();

timeline.addCheckpoint(0, () => {
  expect(opacity).toBe(0);
});

timeline.addCheckpoint(500, () => {
  expect(opacity).toBe(0.5);
});

timeline.addCheckpoint(1000, () => {
  expect(opacity).toBe(1);
});

await timeline.execute();
```

### `createAnimationLifecycleTest()`

Monitor animation cleanup and lifecycle:

```typescript
const lifecycle = createAnimationLifecycleTest();

render(<AnimatedComponent />);
lifecycle.assertAnimationsStarted();

unmount();
lifecycle.assertCleanup(); // Ensures no memory leaks
```

## Usage Examples

### Basic Animation Component Test

```typescript
import {
  setupAnimationFrameMocks,
  runSingleAnimationFrame,
  advanceTimersWithAct,
  act
} from '../utils/animation-test-utils';

describe('FadeIn Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    setupAnimationFrameMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should fade in over time', async () => {
    render(<FadeIn duration={1000} />);

    // Initial state
    const element = screen.getByTestId('fade-element');
    expect(element).toHaveStyle('opacity: 0');

    // Halfway through animation
    await advanceTimersWithAct(500);
    await runSingleAnimationFrame();

    // Should be partially faded in
    expect(element).toHaveStyle('opacity: 0.5');

    // Complete animation
    await advanceTimersWithAct(500);
    await runSingleAnimationFrame();

    expect(element).toHaveStyle('opacity: 1');
  });
});
```

### Complex Animation Sequence Test

```typescript
it('should handle complex animation sequence', async () => {
  const timeline = new AnimationTimeline();

  render(<ComplexAnimation />);

  timeline.addCheckpoint(0, () => {
    expect(screen.getByTestId('stage1')).toBeVisible();
  });

  timeline.addCheckpoint(300, () => {
    expect(screen.getByTestId('stage2')).toBeVisible();
  });

  timeline.addCheckpoint(600, () => {
    expect(screen.getByTestId('stage3')).toBeVisible();
  });

  await timeline.execute();
});
```

### Performance Testing

```typescript
it('should complete animation within performance budget', async () => {
  render(<HeavyAnimation />);

  const performance = await measureAnimationPerformance(60); // 60 frames

  expect(performance.averageFrameTime).toBeLessThan(16); // 60fps
  expect(performance.framesExecuted).toBeGreaterThan(50);
});
```

## Motion/Framer Motion Integration

For components using motion/framer-motion, the framework provides mocking utilities:

```typescript
// Mock motion components for testing
jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }) => {
      const { initial, animate, exit, transition, ...restProps } = props;
      return React.createElement(
        "div",
        {
          ...restProps,
          "data-motion-component": "div",
          "data-initial": JSON.stringify(initial),
          "data-animate": JSON.stringify(animate),
        },
        children,
      );
    },
  },
  AnimatePresence: ({ children }) => children,
}));
```

## Best Practices

### 1. Always Use Fake Timers

```typescript
beforeEach(() => {
  jest.useFakeTimers();
  setupAnimationFrameMocks();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
```

### 2. Wrap State Updates in act()

```typescript
// Good
await act(async () => {
  fireEvent.click(triggerButton);
});

// Bad
fireEvent.click(triggerButton);
```

### 3. Test Animation Cleanup

```typescript
it('should clean up on unmount', async () => {
  const { unmount } = render(<AnimatedComponent />);

  // Start animation
  fireEvent.click(startButton);

  // Unmount during animation
  unmount();

  // Should not throw or leave hanging timers
  expect(() => jest.runOnlyPendingTimers()).not.toThrow();
});
```

### 4. Use Specific Selectors

```typescript
// Good - specific DOM queries
const particles = document.querySelectorAll(".particle");

// Bad - relies on accessibility roles that may not exist
const particles = screen.getAllByRole("presentation");
```

## Common Issues and Solutions

### Issue: "act() warnings"

**Solution**: Always wrap state updates that occur in timers or animation frames:

```typescript
// Use advanceTimersWithAct instead of jest.advanceTimersByTime
await advanceTimersWithAct(1000);
```

### Issue: "Infinite animation loops in tests"

**Solution**: Use controlled execution with `runSingleAnimationFrame()` instead of letting animations run freely:

```typescript
// Good
await runSingleAnimationFrame();

// Bad - can cause infinite loops
jest.advanceTimersByTime(1000);
```

### Issue: "Tests are flaky or timeout"

**Solution**: Use deterministic timing and proper cleanup:

```typescript
beforeEach(() => {
  jest.useFakeTimers();
  setupAnimationFrameMocks();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  jest.restoreAllMocks();
});
```

## Integration with Existing Tests

This framework is designed to work alongside existing test utilities:

- **React Testing Library**: Full compatibility with render, screen, fireEvent, waitFor
- **Jest**: Built on top of Jest's mocking and timing utilities
- **@testing-library/jest-dom**: All matchers work as expected

## File Structure

```
__tests__/
├── utils/
│   ├── animation-test-utils.ts    # Core animation testing utilities
│   └── README.md                  # This documentation
└── components/
    └── ui/
        └── delight/
            └── confetti.test.tsx  # Example implementation
```

## Performance Considerations

- Tests are fast and deterministic (no real timeouts)
- Memory usage is controlled through proper cleanup
- Animation frames are executed synchronously in tests
- No browser repainting or actual DOM animations

This framework enables reliable, fast, and maintainable tests for complex animation components while following React testing best practices.
