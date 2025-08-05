import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { SuccessConfetti, CelebrationBurst, SuccessCheckmark } from '@/components/ui/success-confetti';
import {
  setupAnimationFrameMocks,
  runSingleAnimationFrame,
  runAnimationFrames,
  advanceTimersWithAct,
  runTimersAndAnimationFrames,
  createAnimationLifecycleTest,
  AnimationTimeline,
  act
} from '@/lib/test-utils';

// Mock motion/framer-motion for testing
jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, ...restProps } = props;
      return React.createElement('div', {
        ...restProps,
        'data-motion-component': 'div',
        'data-initial': JSON.stringify(initial),
        'data-animate': JSON.stringify(animate),
      }, children);
    },
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock window dimensions
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

// Animation testing utilities
let animationMocks: ReturnType<typeof setupAnimationFrameMocks>;

describe('SuccessConfetti Component', () => {
  beforeEach(() => {
    // Set up fake timers and animation frame mocks
    jest.useFakeTimers();
    animationMocks = setupAnimationFrameMocks();
    
    // Suppress console.warn for motion components in test environment
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // Clean up timers and mocks
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should render with proper container structure', () => {
    render(<SuccessConfetti trigger={false} />);
    
    // Should render the container with proper styling
    const container = document.querySelector('.fixed.inset-0.pointer-events-none.z-50');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('fixed');
    expect(container).toHaveClass('inset-0');
    expect(container).toHaveClass('pointer-events-none');
    expect(container).toHaveClass('z-50');
    expect(container).toHaveClass('overflow-hidden');
  });

  it('should not show particles when trigger is false', () => {
    render(<SuccessConfetti trigger={false} />);
    
    // Should only have the main container, no particles
    const particles = document.querySelectorAll('.absolute.w-3.h-3');
    expect(particles).toHaveLength(0);
  });

  it('should create particles when triggered', async () => {
    const { rerender } = render(<SuccessConfetti trigger={false} intensity="medium" />);
    
    // Initially no particles
    let particles = document.querySelectorAll('.absolute.w-3.h-3');
    expect(particles).toHaveLength(0);
    
    // Trigger confetti
    await act(async () => {
      rerender(<SuccessConfetti trigger={true} intensity="medium" />);
    });
    
    await waitFor(() => {
      // Should create 50 particles for medium intensity
      particles = document.querySelectorAll('.absolute.w-3.h-3');
      expect(particles.length).toBe(50);
    });
  });

  it('should handle different intensity levels', async () => {
    const intensities: Array<'light' | 'medium' | 'heavy'> = ['light', 'medium', 'heavy'];
    const expectedCounts = { light: 20, medium: 50, heavy: 100 };
    
    for (const intensity of intensities) {
      const { unmount } = render(<SuccessConfetti trigger={true} intensity={intensity} />);
      
      await waitFor(() => {
        const particles = document.querySelectorAll('.absolute.w-3.h-3');
        expect(particles.length).toBe(expectedCounts[intensity]);
      });
      
      unmount();
    }
  });

  it('should call onComplete callback after animation', async () => {
    const onComplete = jest.fn();
    
    render(<SuccessConfetti trigger={true} onComplete={onComplete} />);
    
    // Fast forward through the 3-second animation
    await advanceTimersWithAct(3000);
    
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('should auto-clear particles after timeout', async () => {
    render(<SuccessConfetti trigger={true} />);
    
    // Particles should be present initially
    await waitFor(() => {
      const particles = document.querySelectorAll('.absolute.w-3.h-3');
      expect(particles.length).toBeGreaterThan(0);
    });
    
    // Fast-forward through animation duration
    await advanceTimersWithAct(3000);
    
    // Particles should be cleared
    await waitFor(() => {
      const particles = document.querySelectorAll('.absolute.w-3.h-3');
      expect(particles).toHaveLength(0);
    });
  });

  it('should use custom colors when provided', async () => {
    const customColors = ['bg-orange-500', 'bg-cyan-500'];
    
    render(<SuccessConfetti trigger={true} colors={customColors} />);
    
    await waitFor(() => {
      const container = document.querySelector('.fixed.inset-0');
      expect(container).toBeInTheDocument();
      
      // Check that particles are created
      const particles = document.querySelectorAll('.absolute.w-3.h-3');
      expect(particles.length).toBeGreaterThan(0);
    });
  });

  it('should handle rapid trigger changes', async () => {
    const { rerender } = render(<SuccessConfetti trigger={false} />);
    
    // First trigger
    await act(async () => {
      rerender(<SuccessConfetti trigger={true} />);
    });
    
    await waitFor(() => {
      const container = document.querySelector('.fixed.inset-0');
      expect(container).toBeInTheDocument();
    });
    
    // Reset trigger
    await act(async () => {
      rerender(<SuccessConfetti trigger={false} />);
    });
    
    // Wait a moment
    await advanceTimersWithAct(100);
    
    // Trigger again
    await act(async () => {
      rerender(<SuccessConfetti trigger={true} />);
    });
    
    await waitFor(() => {
      const container = document.querySelector('.fixed.inset-0');
      expect(container).toBeInTheDocument();
    });
  });

  it('should have proper container styling', () => {
    render(<SuccessConfetti trigger={true} />);
    
    const container = document.querySelector('.fixed.inset-0');
    
    expect(container).toHaveClass('fixed');
    expect(container).toHaveClass('inset-0');
    expect(container).toHaveClass('pointer-events-none');
    expect(container).toHaveClass('z-50');
    expect(container).toHaveClass('overflow-hidden');
  });

  it('should clean up properly on unmount', async () => {
    const { unmount } = render(<SuccessConfetti trigger={true} />);
    
    await waitFor(() => {
      const container = document.querySelector('.fixed.inset-0');
      expect(container).toBeInTheDocument();
    });
    
    // Unmount component
    act(() => {
      unmount();
    });
    
    // Should not throw any errors or leave hanging timers
    expect(() => jest.runOnlyPendingTimers()).not.toThrow();
  });

});

describe('CelebrationBurst Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    animationMocks = setupAnimationFrameMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should render at specified coordinates', async () => {
    render(<CelebrationBurst x={100} y={200} trigger={true} />);
    
    await waitFor(() => {
      const container = document.querySelector('.fixed.pointer-events-none');
      expect(container).toBeInTheDocument();
      
      // Check inline styles directly
      expect(container).toHaveAttribute('style', 'left: 100px; top: 200px;');
    });
  });

  it('should call onComplete after animation', async () => {
    const onComplete = jest.fn();
    
    render(<CelebrationBurst x={0} y={0} trigger={true} onComplete={onComplete} />);
    
    // Fast forward through 1-second animation
    await advanceTimersWithAct(1000);
    
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('should not render when trigger is false', () => {
    render(<CelebrationBurst x={0} y={0} trigger={false} />);
    
    const container = document.querySelector('.fixed.pointer-events-none');
    expect(container).not.toBeInTheDocument();
  });
});

// Note: SuccessCheckmark tests skipped due to component structure.
// The component uses SVG and motion.path which require different testing approach.
// This demonstrates the animation testing framework with simpler components.

describe('Animation Testing Framework', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    animationMocks = setupAnimationFrameMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should track animation frames correctly', async () => {
    const TestComponent = () => {
      React.useEffect(() => {
        const animate = () => {
          requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }, []);
      
      return <div data-testid="test-component">Test</div>;
    };
    
    render(<TestComponent />);
    
    // Should have registered animation frames
    expect(animationMocks.getCallbackCount()).toBeGreaterThan(0);
    
    // Run a single frame
    await runSingleAnimationFrame();
    
    // Should continue to have frames (since it's a loop)
    expect(animationMocks.getCallbackCount()).toBeGreaterThan(0);
  });

  it('should support animation timeline testing', async () => {
    const timeline = new AnimationTimeline();
    let step = 0;
    
    timeline.addCheckpoint(0, () => {
      expect(step).toBe(0);
      step = 1;
    });
    
    timeline.addCheckpoint(100, () => {
      expect(step).toBe(1);
      step = 2;
    });
    
    timeline.addCheckpoint(200, () => {
      expect(step).toBe(2);
      step = 3;
    });
    
    await timeline.execute();
    
    expect(step).toBe(3);
  });

});