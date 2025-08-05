import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

// Mock Intersection Observer
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock dynamic import
const mockDynamicImport = jest.fn();
jest.mock('next/dynamic', () => {
  return (importFunc: any, options?: any) => {
    const MockComponent = (props: any) => (
      <div data-testid="lazy-component" {...props}>
        Lazy Loaded Component
      </div>
    );
    MockComponent.displayName = 'MockLazyComponent';
    return MockComponent;
  };
});

// Test component that uses lazy loading
import React, { useState, useEffect, useRef } from 'react';

function MockLazyContainer() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          setIsLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div data-testid="lazy-container" ref={containerRef}>
      {isLoaded && (
        <div data-testid="lazy-content">
          Lazy loaded content is now visible
        </div>
      )}
      {isVisible && (
        <div data-testid="visibility-indicator">
          Component is in viewport
        </div>
      )}
    </div>
  );
}

describe('Lazy Loading Performance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize Intersection Observer', () => {
    render(<MockLazyContainer />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.1 }
    );
  });

  it('should observe element when component mounts', () => {
    const mockObserve = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: mockObserve,
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    });

    render(<MockLazyContainer />);

    expect(mockObserve).toHaveBeenCalled();
  });

  it('should load content when element becomes visible', async () => {
    let intersectionCallback: (entries: any[]) => void;
    const mockObserve = jest.fn();
    const mockDisconnect = jest.fn();

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: mockObserve,
        unobserve: jest.fn(),
        disconnect: mockDisconnect,
      };
    });

    render(<MockLazyContainer />);

    // Initially, lazy content should not be visible
    expect(screen.queryByTestId('lazy-content')).not.toBeInTheDocument();

    // Simulate element coming into viewport
    act(() => {
      intersectionCallback([{ isIntersecting: true }]);
    });

    await waitFor(() => {
      expect(screen.getByTestId('lazy-content')).toBeInTheDocument();
      expect(screen.getByTestId('visibility-indicator')).toBeInTheDocument();
    });

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should not load content when element is not visible', () => {
    let intersectionCallback: (entries: any[]) => void;

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
    });

    render(<MockLazyContainer />);

    // Simulate element NOT in viewport
    act(() => {
      intersectionCallback([{ isIntersecting: false }]);
    });

    expect(screen.queryByTestId('lazy-content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('visibility-indicator')).not.toBeInTheDocument();
  });

  it('should clean up observer on unmount', () => {
    const mockDisconnect = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: mockDisconnect,
    });

    const { unmount } = render(<MockLazyContainer />);

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('should handle threshold configuration correctly', () => {
    function CustomLazyContainer({ threshold = 0.5 }) {
      const containerRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        const observer = new IntersectionObserver(
          () => {},
          { threshold }
        );

        if (containerRef.current) {
          observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
      }, [threshold]);

      return <div ref={containerRef} data-testid="custom-container" />;
    }

    render(<CustomLazyContainer threshold={0.75} />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.75 }
    );
  });

  it('should handle root margin configuration', () => {
    function RootMarginContainer() {
      const containerRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        const observer = new IntersectionObserver(
          () => {},
          { 
            threshold: 0.1,
            rootMargin: '50px 0px'
          }
        );

        if (containerRef.current) {
          observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
      }, []);

      return <div ref={containerRef} data-testid="root-margin-container" />;
    }

    render(<RootMarginContainer />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { 
        threshold: 0.1,
        rootMargin: '50px 0px'
      }
    );
  });

  it('should handle multiple intersection entries', async () => {
    let intersectionCallback: (entries: any[]) => void;
    const mockDisconnect = jest.fn();

    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback;
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: mockDisconnect,
      };
    });

    render(<MockLazyContainer />);

    // Simulate multiple entries (though our component uses first entry)
    act(() => {
      intersectionCallback([
        { isIntersecting: true },
        { isIntersecting: false }
      ]);
    });

    await waitFor(() => {
      expect(screen.getByTestId('lazy-content')).toBeInTheDocument();
    });
  });

  it('should work without Intersection Observer support', () => {
    // Create a component that checks for IntersectionObserver support
    function SafeLazyContainer() {
      const [isLoaded, setIsLoaded] = useState(false);
      const containerRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        // Check if IntersectionObserver is supported
        if (typeof IntersectionObserver === 'undefined') {
          // Fallback: load immediately
          setIsLoaded(true);
          return;
        }

        const observer = new IntersectionObserver(
          (entries) => {
            const [entry] = entries;
            if (entry.isIntersecting) {
              setIsLoaded(true);
              observer.disconnect();
            }
          },
          { threshold: 0.1 }
        );

        if (containerRef.current) {
          observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
      }, []);

      return (
        <div data-testid="safe-lazy-container" ref={containerRef}>
          {isLoaded && (
            <div data-testid="fallback-content">
              Content loaded (fallback or intersection)
            </div>
          )}
        </div>
      );
    }

    // Temporarily remove Intersection Observer support
    const originalIntersectionObserver = window.IntersectionObserver;
    // @ts-ignore
    delete window.IntersectionObserver;

    expect(() => {
      render(<SafeLazyContainer />);
    }).not.toThrow();

    // Content should load immediately as fallback
    expect(screen.getByTestId('fallback-content')).toBeInTheDocument();

    // Restore Intersection Observer
    window.IntersectionObserver = originalIntersectionObserver;
  });
});