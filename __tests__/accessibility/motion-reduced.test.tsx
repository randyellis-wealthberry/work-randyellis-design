import { render, screen, act, waitFor } from "@testing-library/react";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

// Mock component to test the hook
function TestComponent() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div data-testid="test-component">
      <span data-testid="motion-preference">
        {prefersReducedMotion ? "reduced" : "full"}
      </span>
      <div
        data-testid="animated-element"
        style={{
          transition: prefersReducedMotion ? "none" : "transform 0.3s ease",
          transform: prefersReducedMotion ? "none" : "translateX(100px)",
        }}
      >
        Animated content
      </div>
    </div>
  );
}

// Mock matchMedia
const createMockMatchMedia = (matches: boolean) => {
  return jest.fn().mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
};

describe("Reduced Motion Hook", () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    jest.clearAllMocks();
  });

  it("should detect when user prefers reduced motion", () => {
    // Mock matchMedia to return true for reduced motion
    window.matchMedia = createMockMatchMedia(true);

    render(<TestComponent />);

    const motionPreference = screen.getByTestId("motion-preference");
    expect(motionPreference).toHaveTextContent("reduced");

    // Verify matchMedia was called with correct query
    expect(window.matchMedia).toHaveBeenCalledWith(
      "(prefers-reduced-motion: reduce)",
    );
  });

  it("should detect when user allows full motion", () => {
    // Mock matchMedia to return false for reduced motion
    window.matchMedia = createMockMatchMedia(false);

    render(<TestComponent />);

    const motionPreference = screen.getByTestId("motion-preference");
    expect(motionPreference).toHaveTextContent("full");
  });

  it("should apply appropriate styles based on motion preference", async () => {
    // Test with reduced motion first
    window.matchMedia = createMockMatchMedia(true);
    render(<TestComponent />);

    await waitFor(() => {
      const animatedElement = screen.getByTestId("animated-element");
      expect(animatedElement.style.transition).toBe("none");
      expect(animatedElement.style.transform).toBe("none");
    });
  });

  it("should apply full motion styles when not reduced", async () => {
    // Test with full motion
    window.matchMedia = createMockMatchMedia(false);
    render(<TestComponent />);

    await waitFor(() => {
      const animatedElement = screen.getByTestId("animated-element");
      expect(animatedElement.style.transition).toBe("transform 0.3s ease");
      expect(animatedElement.style.transform).toBe("translateX(100px)");
    });
  });

  it("should handle SSR safely", () => {
    // Test that the hook returns false (no reduced motion) as default
    // We simulate the hook's behavior during SSR by testing with no matchMedia
    const originalMatchMedia = window.matchMedia;

    // Remove matchMedia to simulate SSR-like environment
    // @ts-ignore
    delete window.matchMedia;

    // The component should render without throwing
    expect(() => {
      render(<TestComponent />);
    }).not.toThrow();

    // Restore matchMedia
    window.matchMedia = originalMatchMedia || createMockMatchMedia(false);

    // Should default to no reduced motion (false) when matchMedia is unavailable
    const motionPreference = screen.getByTestId("motion-preference");
    expect(motionPreference).toHaveTextContent("full");
  });

  it("should listen for media query changes", async () => {
    let mediaQueryCallback: ((event: MediaQueryListEvent) => void) | null =
      null;
    const addEventListener = jest.fn((event, callback) => {
      if (event === "change") {
        mediaQueryCallback = callback;
      }
    });

    const mockMatchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener,
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    window.matchMedia = mockMatchMedia;

    const { rerender } = render(<TestComponent />);

    // Initial state should be full motion
    expect(screen.getByTestId("motion-preference")).toHaveTextContent("full");

    // Simulate media query change to reduced motion
    if (mediaQueryCallback && typeof mediaQueryCallback === "function") {
      act(() => {
        mediaQueryCallback!({ matches: true } as MediaQueryListEvent);
      });
    }

    await waitFor(() => {
      expect(screen.getByTestId("motion-preference")).toHaveTextContent(
        "reduced",
      );
    });

    // Verify event listener was added
    expect(addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("should clean up event listeners on unmount", () => {
    const removeEventListener = jest.fn();
    const addEventListener = jest.fn();

    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      media: "(prefers-reduced-motion: reduce)",
      addEventListener,
      removeEventListener,
    }));

    const { unmount } = render(<TestComponent />);

    // Verify event listener was added
    expect(addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );

    // Unmount component
    unmount();

    // Verify event listener was removed
    expect(removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("should handle legacy browser addListener fallback", () => {
    const addListener = jest.fn();
    const removeListener = jest.fn();

    // Mock old browser without addEventListener
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      media: "(prefers-reduced-motion: reduce)",
      addListener,
      removeListener,
      // No addEventListener to trigger fallback
    }));

    const { unmount } = render(<TestComponent />);

    // Should use legacy addListener
    expect(addListener).toHaveBeenCalledWith(expect.any(Function));

    unmount();

    // Should use legacy removeListener
    expect(removeListener).toHaveBeenCalledWith(expect.any(Function));
  });
});
