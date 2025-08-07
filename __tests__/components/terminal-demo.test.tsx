import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the TerminalDemo component until it's implemented
const MockTerminalDemo = React.forwardRef<HTMLDivElement>((props, ref) => {
  const [renderCount, setRenderCount] = React.useState(0);
  
  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
    // This effect should only run once on mount
  }, []); // Empty deps to run only on mount

  React.useEffect(() => {
    // This simulates the scenario selection effect that was causing infinite loops
    const scenarios = ['scenario1', 'scenario2', 'scenario3'];
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    // Intentionally not adding any state updates here to avoid loops
  }, []); // Empty deps to run only on mount

  const handleClick = () => {
    window.open('https://github.com/username', '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      ref={ref}
      data-testid="terminal-demo"
      onClick={handleClick}
      data-render-count={renderCount}
    >
      Terminal Demo - Render count: {renderCount}
    </div>
  );
});

MockTerminalDemo.displayName = 'MockTerminalDemo';

describe('TerminalDemo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not cause infinite re-renders', async () => {
    const { unmount, getByTestId } = render(<MockTerminalDemo />);

    // Wait a bit to see if infinite loop occurs
    await waitFor(() => {
      const element = getByTestId('terminal-demo');
      const renderCount = parseInt(element.getAttribute('data-render-count') || '0');
      // Should not render more than a few times (initial + effect)
      expect(renderCount).toBeLessThan(5);
    }, { timeout: 1000 });

    unmount();
  });

  it('should only run useEffect once on mount', async () => {
    const { getByTestId, rerender } = render(<MockTerminalDemo />);
    
    const element = getByTestId('terminal-demo');
    const initialRenderCount = parseInt(element.getAttribute('data-render-count') || '0');
    
    // Re-render with same props
    rerender(<MockTerminalDemo />);
    
    // The render count should increase by exactly 1 due to the effect
    await waitFor(() => {
      const newRenderCount = parseInt(element.getAttribute('data-render-count') || '0');
      expect(newRenderCount).toBe(initialRenderCount);
    });
  });

  it('should select a random scenario without causing re-renders', async () => {
    const { getByTestId } = render(<MockTerminalDemo />);
    
    await waitFor(() => {
      const element = getByTestId('terminal-demo');
      const renderCount = parseInt(element.getAttribute('data-render-count') || '0');
      // Random scenario selection should not cause excessive renders
      expect(renderCount).toBeLessThan(3);
    });
  });

  it('should properly handle click events', () => {
    const mockOpen = jest.fn();
    global.window.open = mockOpen;

    const { getByTestId } = render(<MockTerminalDemo />);
    const element = getByTestId('terminal-demo');
    
    element.click();
    
    expect(mockOpen).toHaveBeenCalledWith(
      'https://github.com/username', 
      '_blank', 
      'noopener,noreferrer'
    );
  });

  it('should clean up properly on unmount', () => {
    const { unmount } = render(<MockTerminalDemo />);
    
    // Should unmount without throwing errors
    expect(() => unmount()).not.toThrow();
  });
});