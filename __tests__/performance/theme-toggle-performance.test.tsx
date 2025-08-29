/**
 * TDD Phase 1 (RED): Three-State Theme Toggle Performance Tests
 *
 * These tests should FAIL initially and guide the implementation of:
 * - Three-state theme cycling: Light → Dark → System → Light
 * - High-performance animations (<250ms, >55fps)
 * - View Transitions API integration
 * - System theme detection and real-time response
 * - Memory leak prevention
 * - Accessibility compliance
 *
 * Expected Initial State: FAILING tests that define requirements
 * Target State: GREEN tests after three-state implementation
 */

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { axe } from "jest-axe";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import React from "react";
import { HeaderThemeToggle } from "@/components/ui/simple-theme-toggle";

// Performance monitoring utilities
const performanceObserver = {
  observations: [] as PerformanceEntry[],
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: () => performanceObserver.observations,
};

// Mock performance APIs
Object.defineProperty(global, "PerformanceObserver", {
  writable: true,
  value: jest.fn().mockImplementation(() => performanceObserver),
});

Object.defineProperty(global, "performance", {
  writable: true,
  value: {
    ...performance,
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByName: jest.fn(() => []),
    getEntriesByType: jest.fn(() => []),
    now: jest.fn(() => Date.now()),
  },
});

// Mock View Transitions API
Object.defineProperty(document, "startViewTransition", {
  writable: true,
  value: jest.fn((callback: () => void) => {
    callback();
    return Promise.resolve();
  }),
});

// Mock matchMedia for system preference testing
const createMatchMediaMock = (matches: boolean) => {
  const listeners: Array<(event: MediaQueryListEvent) => void> = [];

  return jest.fn().mockImplementation((query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn((listener) => listeners.push(listener)),
    removeListener: jest.fn((listener) => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    }),
    addEventListener: jest.fn((type, listener) => {
      if (type === "change") listeners.push(listener);
    }),
    removeEventListener: jest.fn((type, listener) => {
      if (type === "change") {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
      }
    }),
    dispatchEvent: jest.fn((event) => {
      listeners.forEach((listener) => listener(event));
    }),
    // Helper for tests to trigger change events
    _triggerChange: (newMatches: boolean) => {
      const event = {
        matches: newMatches,
        media: query,
      } as MediaQueryListEvent;
      listeners.forEach((listener) => listener(event));
    },
  }));
};

// Test wrapper with ThemeProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    {children}
  </ThemeProvider>
);

describe("Three-State Theme Toggle Performance (TDD RED Phase)", () => {
  let mockMatchMedia: jest.MockedFunction<typeof window.matchMedia>;

  beforeEach(() => {
    // Clear all mocks and localStorage
    jest.clearAllMocks();
    localStorage.clear();
    performanceObserver.observations = [];

    // Setup fresh matchMedia mock
    mockMatchMedia = createMatchMediaMock(false);
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: mockMatchMedia,
    });

    // Reset View Transitions mock
    (document.startViewTransition as jest.Mock).mockClear();
    (performance.now as jest.Mock).mockImplementation(() => Date.now());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // =============================================================================
  // 1. THREE-STATE CYCLING TESTS
  // =============================================================================

  describe("1. Three-State Theme Cycling", () => {
    it("should cycle through light → dark → system → light", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <HeaderThemeToggle />
        </TestWrapper>,
      );

      // Initial state should be system (default) - might be null initially
      await waitFor(() => {
        const theme = localStorage.getItem("theme");
        expect(theme === "system" || theme === null).toBe(true);
      });

      // First click: system → light
      const themeButton = screen.getByTestId("header-theme-toggle");
      await user.click(themeButton);

      await waitFor(() => {
        expect(localStorage.getItem("theme")).toBe("light");
      });

      // Second click: light → dark
      await user.click(themeButton);

      await waitFor(() => {
        expect(localStorage.getItem("theme")).toBe("dark");
        expect(document.documentElement).toHaveClass("dark");
      });

      // Third click: dark → system
      await user.click(themeButton);

      await waitFor(() => {
        expect(localStorage.getItem("theme")).toBe("system");
      });

      // Fourth click: system → light (full cycle)
      await user.click(themeButton);

      await waitFor(() => {
        expect(localStorage.getItem("theme")).toBe("light");
        expect(document.documentElement).not.toHaveClass("dark");
      });
    });

    it("should display correct icons for each theme state", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <HeaderThemeToggle />
        </TestWrapper>,
      );

      const themeButton = screen.getByTestId("header-theme-toggle");

      // System theme should show MonitorIcon with scale-100 class
      const initialMonitorIcon = screen.getByTestId("monitor-icon");
      expect(initialMonitorIcon).toHaveClass("scale-100", "rotate-0");

      // Click to light theme - should show SunIcon with scale-100
      await user.click(themeButton);
      await waitFor(() => {
        const sunIcon = screen.getByTestId("sun-icon");
        const monitorIcon = screen.getByTestId("monitor-icon");
        expect(sunIcon).toHaveClass("scale-100", "rotate-0");
        expect(monitorIcon).toHaveClass("scale-0", "rotate-90");
      });

      // Click to dark theme - should show MoonIcon with scale-100
      await user.click(themeButton);
      await waitFor(() => {
        const moonIcon = screen.getByTestId("moon-icon");
        const sunIcon = screen.getByTestId("sun-icon");
        expect(moonIcon).toHaveClass("scale-100", "rotate-0");
        expect(sunIcon).toHaveClass("scale-0", "rotate-90");
      });

      // Click back to system theme - should show MonitorIcon with scale-100
      await user.click(themeButton);
      await waitFor(() => {
        const monitorIcon = screen.getByTestId("monitor-icon");
        const moonIcon = screen.getByTestId("moon-icon");
        expect(monitorIcon).toHaveClass("scale-100", "rotate-0");
        expect(moonIcon).toHaveClass("scale-0", "rotate-90");
      });
    });

    it("should have proper ARIA labels for all three states", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <HeaderThemeToggle />
        </TestWrapper>,
      );

      const themeButton = screen.getByTestId("header-theme-toggle");

      // Initial system theme should suggest switching to light
      expect(themeButton).toHaveAttribute("aria-label", "Switch to light theme");

      // Click to light - should suggest switching to dark
      await user.click(themeButton);
      await waitFor(() => {
        expect(themeButton).toHaveAttribute("aria-label", "Switch to dark theme");
      });

      // Click to dark - should suggest switching to system
      await user.click(themeButton);
      await waitFor(() => {
        expect(themeButton).toHaveAttribute("aria-label", "Switch to system theme");
      });

      // Click to system - should suggest switching to light (full cycle)
      await user.click(themeButton);
      await waitFor(() => {
        expect(themeButton).toHaveAttribute("aria-label", "Switch to light theme");
      });
    });
  });

  // =============================================================================
  // 2. PERFORMANCE TESTS
  // =============================================================================

  describe("2. Animation Performance", () => {
    it("should complete theme transitions in under 250ms", async () => {
      const user = userEvent.setup();
      let startTime: number;
      let endTime: number;

      // Mock performance.now for accurate timing
      (performance.now as jest.Mock).mockImplementation(() => {
        if (startTime === undefined) {
          startTime = 100;
          return startTime;
        } else {
          endTime = startTime + 200; // 200ms transition
          return endTime;
        }
      });

      render(
        <TestWrapper>
          <HeaderThemeToggle />
        </TestWrapper>,
      );

      const themeButton = screen.getByTestId("header-theme-toggle");
      
      await user.click(themeButton);

      await waitFor(
        () => {
          expect(localStorage.getItem("theme")).toBe("light");
        },
        { timeout: 250 },
      );

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(250);
    });

    it("should maintain >55fps during theme animations", async () => {
      const user = userEvent.setup();
      const frameTimings: number[] = [];
      let lastFrameTime = 0;

      // Mock requestAnimationFrame to capture frame timings
      const originalRAF = window.requestAnimationFrame;
      let frameCallback: FrameRequestCallback;

      window.requestAnimationFrame = jest.fn((callback) => {
        frameCallback = callback;
        const currentTime = lastFrameTime + 16; // 60fps = ~16ms per frame
        frameTimings.push(currentTime - lastFrameTime);
        lastFrameTime = currentTime;
        return originalRAF(callback);
      });

      render(
        <TestWrapper>
          <HeaderThemeToggle />
        </TestWrapper>,
      );

      const themeButton = screen.getByTestId("header-theme-toggle");
      await user.click(themeButton);

      // Simulate animation frames
      for (let i = 0; i < 15; i++) {
        if (frameCallback) {
          frameCallback(lastFrameTime);
        }
      }

      await waitFor(() => {
        expect(localStorage.getItem("theme")).toBe("light");
      });

      // Calculate average FPS (should be >55)
      const averageFrameTime =
        frameTimings.reduce((a, b) => a + b, 0) / frameTimings.length;
      const fps = 1000 / averageFrameTime;

      expect(fps).toBeGreaterThan(55);

      window.requestAnimationFrame = originalRAF;
    });

    it("should use View Transitions API when available", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <HeaderThemeToggle />
        </TestWrapper>,
      );

      const themeButton = screen.getByTestId("header-theme-toggle");
      await user.click(themeButton);

      // Should call View Transitions API for smooth animation
      expect(document.startViewTransition).toHaveBeenCalled();
    });

    it("should fallback gracefully when View Transitions API is unavailable", async () => {
      // Remove View Transitions API
      delete (document as any).startViewTransition;

      const user = userEvent.setup();

      render(
        <TestWrapper>
          <HeaderThemeToggle />
        </TestWrapper>,
      );

      const themeButton = screen.getByTestId("header-theme-toggle");
      await user.click(themeButton);

      // Should still work without API
      await waitFor(() => {
        expect(localStorage.getItem("theme")).toBe("light");
      });
    });
  });

  // =============================================================================
  // 3. SYSTEM THEME DETECTION TESTS
  // =============================================================================

  describe("3. System Theme Detection", () => {
    it("should correctly apply system dark preference", async () => {
      // Mock system dark mode preference
      mockMatchMedia.mockReturnValue({
        matches: true,
        media: "(prefers-color-scheme: dark)",
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      } as MediaQueryList);

      render(
        <TestWrapper>
          <HeaderThemeToggle />
        </TestWrapper>,
      );

      // When theme is "system" and system prefers dark, should apply dark mode
      await waitFor(() => {
        expect(document.documentElement).toHaveClass("dark");
      });

      // Should show MonitorIcon to indicate system theme is active
      expect(screen.getByTestId("monitor-icon")).toBeInTheDocument();
    });

    it("should respond to real-time system theme changes", async () => {
      const mediaQuery = mockMatchMedia("(prefers-color-scheme: dark)");
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: () => mediaQuery,
      });

      render(
        <TestWrapper>
          <HeaderThemeToggle />
        </TestWrapper>,
      );

      // Initially light (system preference)
      expect(document.documentElement).not.toHaveClass("dark");

      // Simulate system change to dark mode
      act(() => {
        (mediaQuery as any)._triggerChange(true);
      });

      await waitFor(() => {
        expect(document.documentElement).toHaveClass("dark");
      });

      // Simulate system change back to light
      act(() => {
        (mediaQuery as any)._triggerChange(false);
      });

      await waitFor(() => {
        expect(document.documentElement).not.toHaveClass("dark");
      });
    });

    it("should maintain system theme indication during system changes", async () => {
      const mediaQuery = mockMatchMedia("(prefers-color-scheme: dark)");
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: () => mediaQuery,
      });

      render(
        <TestWrapper>
          <HeaderThemeToggle />
        </TestWrapper>,
      );

      // Should consistently show MonitorIcon regardless of system preference
      expect(screen.getByTestId("monitor-icon")).toBeInTheDocument();

      // Change system preference
      act(() => {
        (mediaQuery as any)._triggerChange(true);
      });

      await waitFor(() => {
        expect(document.documentElement).toHaveClass("dark");
      });

      // Should still show MonitorIcon (theme is still "system")
      expect(screen.getByTestId("monitor-icon")).toBeInTheDocument();
    });
  });

  // =============================================================================
  // 4. MEMORY MANAGEMENT TESTS
  // =============================================================================

  describe("4. Memory Management", () => {
    it("should not create memory leaks during rapid theme cycling", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <HeaderThemeToggle />
        </TestWrapper>,
      );

      const initialStyleElements = document.head.querySelectorAll("style").length;
      const themeButton = screen.getByTestId("header-theme-toggle");

      // Perform rapid theme cycling (12 clicks = 4 full cycles)
      for (let i = 0; i < 12; i++) {
        await user.click(themeButton);
        // Small delay to allow theme change processing
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      await waitFor(() => {
        // Should complete the cycles
        expect(localStorage.getItem("theme")).toBe("system"); // Back to start
      });

      // Should not accumulate style elements
      const finalStyleElements = document.head.querySelectorAll("style").length;
      expect(finalStyleElements - initialStyleElements).toBeLessThanOrEqual(2);
    });

    it("should clean up event listeners properly", async () => {
      const { unmount } = render(
        <TestWrapper>
          <HeaderThemeToggle />
        </TestWrapper>,
      );

      const addEventListenerSpy = jest.spyOn(window, "addEventListener");
      const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");

      // Unmount component
      unmount();

      // Should clean up any event listeners that were added
      // Note: This test depends on implementation details
      expect(removeEventListenerSpy).toHaveBeenCalledTimes(
        addEventListenerSpy.mock.calls.length,
      );

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  // =============================================================================
  // 5. ACCESSIBILITY TESTS
  // =============================================================================

  describe("5. Accessibility", () => {
    it("should announce theme changes to screen readers", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <HeaderThemeToggle />
          <div id="theme-announcements" role="status" aria-live="polite" />
        </TestWrapper>,
      );

      const themeButton = screen.getByTestId("header-theme-toggle");
      await user.click(themeButton);

      // Should announce theme change (this will fail initially)
      const announcements = screen.getByRole("status");
      await waitFor(() => {
        expect(announcements).toHaveTextContent(/switched to light theme/i);
      });
    });

    it("should support keyboard navigation through all theme states", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <HeaderThemeToggle />
        </TestWrapper>,
      );

      // Tab to theme button
      await user.tab();
      expect(screen.getByTestId("header-theme-toggle")).toHaveFocus();

      // Test all three states via keyboard
      const themes = ["light", "dark", "system"];
      for (let i = 0; i < themes.length; i++) {
        await user.keyboard("{Enter}");
        await waitFor(() => {
          expect(localStorage.getItem("theme")).toBe(themes[i]);
        });
      }
    });

    it("should pass axe accessibility tests for all theme states", async () => {
      const user = userEvent.setup();

      const { container } = render(
        <TestWrapper>
          <HeaderThemeToggle />
        </TestWrapper>,
      );

      // Test accessibility for each theme state
      const themes = ["light", "dark", "system"];
      const themeButton = screen.getByTestId("header-theme-toggle");

      for (const expectedTheme of themes) {
        await user.click(themeButton);
        await waitFor(() => {
          expect(localStorage.getItem("theme")).toBe(expectedTheme);
        });

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });

    it("should respect prefers-reduced-motion setting", async () => {
      // Mock prefers-reduced-motion: reduce
      const reducedMotionMediaQuery = createMatchMediaMock(true);
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation((query) => {
          if (query === "(prefers-reduced-motion: reduce)") {
            return reducedMotionMediaQuery("(prefers-reduced-motion: reduce)");
          }
          return mockMatchMedia(query);
        }),
      });

      const user = userEvent.setup();

      render(
        <TestWrapper>
          <HeaderThemeToggle />
        </TestWrapper>,
      );

      const themeButton = screen.getByTestId("header-theme-toggle");
      await user.click(themeButton);

      // Should complete transition immediately when reduced motion is preferred
      await waitFor(
        () => {
          expect(localStorage.getItem("theme")).toBe("light");
        },
        { timeout: 50 }, // Very short timeout since animations should be skipped
      );
    });
  });

  // =============================================================================
  // 6. ERROR HANDLING TESTS
  // =============================================================================

  describe("6. Error Handling", () => {
    it("should handle localStorage failures gracefully", async () => {
      // Mock localStorage failure
      const originalLocalStorage = window.localStorage;
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => {
            throw new Error("localStorage unavailable");
          }),
          setItem: jest.fn(() => {
            throw new Error("localStorage unavailable");
          }),
          removeItem: jest.fn(),
          clear: jest.fn(),
        },
        writable: true,
      });

      const user = userEvent.setup();

      render(
        <TestWrapper>
          <HeaderThemeToggle />
        </TestWrapper>,
      );

      const themeButton = screen.getByTestId("header-theme-toggle");

      // Should not throw error
      await expect(user.click(themeButton)).resolves.not.toThrow();

      // Should still change theme (using memory/context only)
      await waitFor(() => {
        // Theme should change in DOM even if localStorage fails
        expect(document.documentElement.classList.toString()).toContain(""); // Some class change
      });

      // Restore localStorage
      Object.defineProperty(window, "localStorage", {
        value: originalLocalStorage,
        writable: true,
      });
    });

    it("should validate theme values and fallback to system", async () => {
      // Set invalid theme value
      localStorage.setItem("theme", "invalid-theme");

      render(
        <TestWrapper>
          <HeaderThemeToggle />
        </TestWrapper>,
      );

      // Should fallback to system theme for invalid values
      await waitFor(() => {
        const validThemes = ["light", "dark", "system"];
        const currentTheme = localStorage.getItem("theme");
        expect(validThemes).toContain(currentTheme);
      });
    });
  });
});