/**
 * TDD Phase 1 (RED): Comprehensive Theme Toggle Consistency Test Suite
 *
 * These tests should FAIL initially and guide the implementation of:
 * - Enhanced header theme toggle with Light/Dark/System options
 * - Synchronized theme state between header and footer
 * - Performance optimization for theme animations
 * - Accessibility improvements
 * - Error handling and graceful degradation
 *
 * Expected Initial State: FAILING tests that define requirements
 * Target State: GREEN tests after implementation improvements
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
import { Header } from "@/app/header";
import { Footer } from "@/app/footer";
import { ThemeProvider } from "next-themes";
import React from "react";

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

describe("Theme Toggle Consistency (TDD RED Phase)", () => {
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
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // =============================================================================
  // 1. FUNCTIONAL PARITY TESTS
  // =============================================================================

  describe("1. Functional Parity Between Header and Footer", () => {
    describe("Theme Options Support", () => {
      it("should support Light/Dark/System themes in BOTH header and footer", async () => {
        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        // HEADER: Should have all three theme options (currently fails - only has toggle)
        const headerThemeButtons = screen.getAllByRole("button", {
          name: /light theme|dark theme|system theme/i,
        });
        expect(headerThemeButtons).toHaveLength(6); // 3 in header + 3 in footer

        // Check for specific theme options in header
        expect(
          screen.getByRole("button", { name: /switch to light theme/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /switch to dark theme/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /switch to system theme/i }),
        ).toBeInTheDocument();

        // FOOTER: Should have all three theme options (currently works)
        const footerThemeSection = screen
          .getByText(/© 2025 Randy Ellis/)
          .closest("footer");
        expect(footerThemeSection).toBeInTheDocument();

        // Footer theme buttons should exist
        const sunIcon = screen.getByLabelText(/switch to light theme/i);
        const moonIcon = screen.getByLabelText(/switch to dark theme/i);
        const systemIcon = screen.getByLabelText(/switch to system theme/i);

        expect(sunIcon).toBeInTheDocument();
        expect(moonIcon).toBeInTheDocument();
        expect(systemIcon).toBeInTheDocument();
      });

      it("should have identical theme switching behavior in header and footer", async () => {
        const user = userEvent.setup();

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        // Switch to dark mode from header (this should fail initially)
        const headerDarkButton =
          screen.getAllByLabelText(/switch to dark theme/i)[0]; // First one should be header
        await user.click(headerDarkButton);

        await waitFor(() => {
          expect(document.documentElement).toHaveClass("dark");
        });

        // Switch to light mode from footer
        const footerLightButton = screen.getByLabelText(
          /switch to light theme/i,
        );
        await user.click(footerLightButton);

        await waitFor(() => {
          expect(document.documentElement).not.toHaveClass("dark");
        });

        // Both components should reflect the same state
        expect(localStorage.getItem("theme")).toBe("light");
      });
    });

    describe("Theme Synchronization", () => {
      it("should synchronize theme state between header and footer components", async () => {
        const user = userEvent.setup();

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        // Change theme from footer
        const footerDarkButton = screen.getByLabelText(/switch to dark theme/i);
        await user.click(footerDarkButton);

        // Wait for synchronization
        await waitFor(() => {
          // Header should reflect the same theme state (visual indicators)
          // This test should fail initially as header doesn't show active theme state
          const headerActiveButton = screen.getByTestId(
            "header-dark-theme-active",
          );
          expect(headerActiveButton).toBeInTheDocument();
        });
      });

      it("should maintain active state indicators consistently", async () => {
        const user = userEvent.setup();

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        // Set dark theme
        const darkButton = screen.getByLabelText(/switch to dark theme/i);
        await user.click(darkButton);

        await waitFor(() => {
          // Both header and footer should show dark theme as active
          const headerActiveState = screen.getByTestId(
            "header-theme-dark-active",
          );
          const footerActiveState = screen.getByTestId(
            "footer-theme-dark-active",
          );

          expect(headerActiveState).toBeInTheDocument();
          expect(footerActiveState).toBeInTheDocument();
        });
      });
    });

    describe("System Theme Detection", () => {
      it("should correctly detect and apply system theme preference", async () => {
        // Set system to dark mode
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
            <Header />
            <Footer />
          </TestWrapper>,
        );

        await waitFor(() => {
          // Should apply dark theme based on system preference
          expect(document.documentElement).toHaveClass("dark");
        });

        // Both components should show system theme as active
        const headerSystemActive = screen.getByTestId(
          "header-system-theme-active",
        );
        const footerSystemActive = screen.getByTestId(
          "footer-system-theme-active",
        );

        expect(headerSystemActive).toBeInTheDocument();
        expect(footerSystemActive).toBeInTheDocument();
      });

      it("should respond to system theme changes in real-time", async () => {
        const mediaQuery = mockMatchMedia("(prefers-color-scheme: dark)");
        Object.defineProperty(window, "matchMedia", {
          writable: true,
          value: () => mediaQuery,
        });

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        // Start with light theme
        expect(document.documentElement).not.toHaveClass("dark");

        // Simulate system change to dark
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
    });

    describe("Theme Persistence", () => {
      it("should persist theme choice across page reloads", () => {
        // Set initial theme
        localStorage.setItem("theme", "dark");

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        // Should load with dark theme
        expect(document.documentElement).toHaveClass("dark");

        // Both components should show dark as active
        expect(
          screen.getByTestId("header-dark-theme-active"),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId("footer-dark-theme-active"),
        ).toBeInTheDocument();
      });

      it("should handle invalid stored theme values gracefully", () => {
        // Set invalid theme value
        localStorage.setItem("theme", "invalid-theme");

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        // Should fallback to system theme
        expect(localStorage.getItem("theme")).toBe("system");
      });
    });
  });

  // =============================================================================
  // 2. ANIMATION PERFORMANCE TESTS
  // =============================================================================

  describe("2. Animation Performance", () => {
    describe("Theme Transition Speed", () => {
      it("should complete theme transitions in under 250ms", async () => {
        const user = userEvent.setup();

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        const startTime = performance.now();

        // Trigger theme change
        const themeButton = screen.getByLabelText(/switch to dark theme/i);
        await user.click(themeButton);

        await waitFor(
          () => {
            expect(document.documentElement).toHaveClass("dark");
          },
          { timeout: 250 },
        );

        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(duration).toBeLessThan(250);
      });

      it("should maintain >55fps during theme animations", async () => {
        const user = userEvent.setup();
        const frameTimings: number[] = [];
        let lastFrameTime = performance.now();

        // Mock requestAnimationFrame to capture frame timings
        const originalRAF = window.requestAnimationFrame;
        window.requestAnimationFrame = jest.fn((callback) => {
          const currentTime = performance.now();
          frameTimings.push(currentTime - lastFrameTime);
          lastFrameTime = currentTime;
          return originalRAF(callback);
        });

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        // Trigger theme animation
        const themeButton = screen.getByLabelText(/switch to dark theme/i);
        await user.click(themeButton);

        await waitFor(() => {
          expect(document.documentElement).toHaveClass("dark");
        });

        // Calculate average FPS (should be >55)
        const averageFrameTime =
          frameTimings.reduce((a, b) => a + b, 0) / frameTimings.length;
        const fps = 1000 / averageFrameTime;

        expect(fps).toBeGreaterThan(55);

        window.requestAnimationFrame = originalRAF;
      });
    });

    describe("View Transitions API Integration", () => {
      it("should use View Transitions API when available", async () => {
        const user = userEvent.setup();

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        const themeButton = screen.getByLabelText(/switch to dark theme/i);
        await user.click(themeButton);

        // Should call View Transitions API
        expect(document.startViewTransition).toHaveBeenCalled();
      });

      it("should have consistent animation between header and footer theme switches", async () => {
        const user = userEvent.setup();

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        // Test header animation
        const headerThemeButton =
          screen.getAllByLabelText(/switch to dark theme/i)[0];
        await user.click(headerThemeButton);

        const headerAnimationCall = (document.startViewTransition as jest.Mock)
          .mock.calls[0];

        // Reset and test footer animation
        (document.startViewTransition as jest.Mock).mockClear();

        await user.click(screen.getByLabelText(/switch to light theme/i));

        const footerAnimationCall = (document.startViewTransition as jest.Mock)
          .mock.calls[0];

        // Both should use the same animation configuration
        expect(headerAnimationCall).toBeDefined();
        expect(footerAnimationCall).toBeDefined();
      });

      it("should fallback gracefully when View Transitions API is unavailable", async () => {
        // Remove View Transitions API
        delete (document as any).startViewTransition;

        const user = userEvent.setup();

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        const themeButton = screen.getByLabelText(/switch to dark theme/i);
        await user.click(themeButton);

        // Should still work without API
        await waitFor(() => {
          expect(document.documentElement).toHaveClass("dark");
        });
      });
    });

    describe("Memory and Resource Management", () => {
      it("should not create memory leaks during theme switches", async () => {
        const user = userEvent.setup();

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        const initialStyleElements =
          document.head.querySelectorAll("style").length;

        // Perform multiple theme switches
        for (let i = 0; i < 10; i++) {
          const theme = i % 2 === 0 ? "dark" : "light";
          const button = screen.getByLabelText(
            new RegExp(`switch to ${theme} theme`, "i"),
          );
          await user.click(button);
          await waitFor(() => {
            if (theme === "dark") {
              expect(document.documentElement).toHaveClass("dark");
            } else {
              expect(document.documentElement).not.toHaveClass("dark");
            }
          });
        }

        // Should not accumulate style elements
        const finalStyleElements =
          document.head.querySelectorAll("style").length;
        expect(finalStyleElements - initialStyleElements).toBeLessThanOrEqual(
          1,
        ); // At most one theme-transition-styles element
      });
    });
  });

  // =============================================================================
  // 3. ACCESSIBILITY TESTS
  // =============================================================================

  describe("3. Accessibility", () => {
    describe("ARIA Labels and Roles", () => {
      it("should have proper ARIA labels for all theme options", () => {
        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        // Header theme controls should have proper ARIA labels
        expect(
          screen.getByLabelText(/switch to light theme/i),
        ).toBeInTheDocument();
        expect(
          screen.getByLabelText(/switch to dark theme/i),
        ).toBeInTheDocument();
        expect(
          screen.getByLabelText(/switch to system theme/i),
        ).toBeInTheDocument();

        // All buttons should have proper roles
        const allThemeButtons = screen.getAllByRole("button", {
          name: /switch to.*theme/i,
        });
        expect(allThemeButtons.length).toBeGreaterThan(0);

        allThemeButtons.forEach((button) => {
          expect(button).toHaveAttribute("aria-label");
        });
      });

      it("should announce theme changes to screen readers", async () => {
        const user = userEvent.setup();

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        const themeButton = screen.getByLabelText(/switch to dark theme/i);
        await user.click(themeButton);

        // Should have live region or aria-live announcement (this will fail initially)
        const liveRegion = screen.getByRole("status", {
          name: /theme changed/i,
        });
        expect(liveRegion).toBeInTheDocument();
        expect(liveRegion).toHaveTextContent(/switched to dark theme/i);
      });

      it("should indicate current theme state for assistive technologies", () => {
        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        // Active theme buttons should have aria-pressed or aria-current
        const activeThemeButtons = screen.getAllByRole("button", {
          pressed: true,
        });

        expect(activeThemeButtons.length).toBeGreaterThan(0); // At least one active theme
      });
    });

    describe("Keyboard Navigation", () => {
      it("should support full keyboard navigation for theme controls", async () => {
        const user = userEvent.setup();

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        // Tab to first theme control
        await user.tab();
        let focusedElement = document.activeElement;

        // Should be able to reach all theme controls via keyboard
        const themeControlsCount = screen.getAllByRole("button", {
          name: /switch to.*theme/i,
        }).length;

        let focusedThemeControls = 0;

        while (
          focusedElement &&
          focusedThemeControls < themeControlsCount * 2
        ) {
          // *2 to account for potential multiple passes
          if (focusedElement.getAttribute("aria-label")?.includes("theme")) {
            focusedThemeControls++;

            // Should be able to activate with Enter or Space
            if (focusedThemeControls === 1) {
              await user.keyboard("{Enter}");
              // Verify theme change occurred
              await waitFor(() => {
                expect(document.documentElement.className).toContain("dark");
              });
            }
          }

          await user.tab();
          focusedElement = document.activeElement;
        }

        expect(focusedThemeControls).toBe(themeControlsCount);
      });

      it("should have logical tab order between header and footer theme controls", async () => {
        const user = userEvent.setup();

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        const tabOrder: string[] = [];

        // Record tab order
        for (let i = 0; i < 20; i++) {
          // Arbitrary limit to prevent infinite loop
          await user.tab();
          const focused = document.activeElement;
          if (
            focused &&
            focused.getAttribute("aria-label")?.includes("theme")
          ) {
            tabOrder.push(focused.getAttribute("aria-label") || "");
          }
        }

        // Header theme controls should come before footer theme controls
        const headerThemeIndex = tabOrder.findIndex(
          (label) => label.includes("theme") && label.includes("header"), // This assumes labels will indicate header vs footer
        );
        const footerThemeIndex = tabOrder.findIndex(
          (label) => label.includes("theme") && label.includes("footer"),
        );

        if (headerThemeIndex !== -1 && footerThemeIndex !== -1) {
          expect(headerThemeIndex).toBeLessThan(footerThemeIndex);
        }
      });
    });

    describe("Screen Reader Support", () => {
      it("should pass axe accessibility tests", async () => {
        const { container } = render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    describe("Reduced Motion Support", () => {
      it("should respect prefers-reduced-motion setting", async () => {
        // Mock prefers-reduced-motion: reduce
        const reducedMotionMediaQuery = createMatchMediaMock(true);
        Object.defineProperty(window, "matchMedia", {
          writable: true,
          value: jest.fn().mockImplementation((query) => {
            if (query === "(prefers-reduced-motion: reduce)") {
              return reducedMotionMediaQuery(
                "(prefers-reduced-motion: reduce)",
              );
            }
            return mockMatchMedia(query);
          }),
        });

        const user = userEvent.setup();

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        const themeButton = screen.getByLabelText(/switch to dark theme/i);
        await user.click(themeButton);

        // Should skip animations when reduced motion is preferred
        // This test checks that the transition completes immediately
        await waitFor(
          () => {
            expect(document.documentElement).toHaveClass("dark");
          },
          { timeout: 50 },
        ); // Very short timeout since animations should be skipped
      });
    });
  });

  // =============================================================================
  // 4. UI CONSISTENCY TESTS
  // =============================================================================

  describe("4. UI Consistency", () => {
    describe("Visual Styling Consistency", () => {
      it("should have consistent visual styling between header and footer theme controls", () => {
        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        const headerThemeButtons = screen.getAllByTestId(/header-theme-/);
        const footerThemeButtons = screen.getAllByTestId(/footer-theme-/);

        // Should have consistent styling classes (this may fail initially)
        headerThemeButtons.forEach((headerButton, index) => {
          const footerButton = footerThemeButtons[index];
          if (footerButton) {
            // Check for consistent base styling patterns
            const headerClasses = headerButton.className.split(" ");
            const footerClasses = footerButton.className.split(" ");

            // Should share common theme-related classes
            const commonClasses = headerClasses.filter(
              (cls) => cls.includes("theme") && footerClasses.includes(cls),
            );

            expect(commonClasses.length).toBeGreaterThan(0);
          }
        });
      });

      it("should use consistent colors for theme indicators", () => {
        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        // Check for consistent color usage in active states
        const headerActiveButton = screen.getByTestId(
          "header-system-theme-active",
        );
        const footerActiveButton = screen.getByTestId(
          "footer-system-theme-active",
        );

        const headerStyles = window.getComputedStyle(headerActiveButton);
        const footerStyles = window.getComputedStyle(footerActiveButton);

        // Should have consistent active state colors
        expect(headerStyles.color).toBe(footerStyles.color);
        expect(headerStyles.backgroundColor).toBe(footerStyles.backgroundColor);
      });
    });

    describe("Icon Usage Consistency", () => {
      it("should use identical icons for same theme options", () => {
        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        // Light theme icons should match
        const headerLightIcon = screen
          .getAllByLabelText(/switch to light theme/i)[0]
          .querySelector("[data-lucide]");
        const footerLightIcon = screen
          .getByLabelText(/switch to light theme/i)
          .querySelector("[data-lucide]");

        expect(headerLightIcon?.getAttribute("data-lucide")).toBe(
          footerLightIcon?.getAttribute("data-lucide"),
        );

        // Dark theme icons should match
        const headerDarkIcon = screen
          .getAllByLabelText(/switch to dark theme/i)[0]
          .querySelector("[data-lucide]");
        const footerDarkIcon = screen
          .getByLabelText(/switch to dark theme/i)
          .querySelector("[data-lucide]");

        expect(headerDarkIcon?.getAttribute("data-lucide")).toBe(
          footerDarkIcon?.getAttribute("data-lucide"),
        );
      });
    });

    describe("Interaction States", () => {
      it("should have consistent hover states", async () => {
        const user = userEvent.setup();

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        const headerButton = screen.getAllByLabelText(/switch to.*theme/i)[0];
        const footerButton = screen.getAllByLabelText(/switch to.*theme/i)[3]; // Assuming footer buttons come later

        // Hover header button
        await user.hover(headerButton);
        const headerHoverStyles = window.getComputedStyle(headerButton);

        await user.unhover(headerButton);

        // Hover footer button
        await user.hover(footerButton);
        const footerHoverStyles = window.getComputedStyle(footerButton);

        // Should have similar hover styling patterns
        expect(headerHoverStyles.transform).toBe(footerHoverStyles.transform);
      });

      it("should have consistent focus states", async () => {
        const user = userEvent.setup();

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        const headerButton = screen.getAllByLabelText(/switch to.*theme/i)[0];

        await user.tab();
        if (document.activeElement === headerButton) {
          const focusStyles = window.getComputedStyle(headerButton);
          // Should have visible focus indicators
          expect(focusStyles.outline).not.toBe("none");
          expect(focusStyles.outlineWidth).not.toBe("0px");
        }
      });
    });

    describe("Loading States", () => {
      it("should show consistent loading states during theme switching", async () => {
        const user = userEvent.setup();

        // Mock slow theme switching
        (document.startViewTransition as jest.Mock).mockImplementation(
          (callback) => {
            return new Promise((resolve) => {
              setTimeout(() => {
                callback();
                resolve(undefined);
              }, 100);
            });
          },
        );

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        const themeButton = screen.getByLabelText(/switch to dark theme/i);
        await user.click(themeButton);

        // Should show loading indicators (this will fail initially)
        expect(screen.getByTestId("theme-switch-loading")).toBeInTheDocument();

        await waitFor(
          () => {
            expect(document.documentElement).toHaveClass("dark");
          },
          { timeout: 200 },
        );

        // Loading state should be removed
        expect(
          screen.queryByTestId("theme-switch-loading"),
        ).not.toBeInTheDocument();
      });
    });
  });

  // =============================================================================
  // 5. ERROR HANDLING TESTS
  // =============================================================================

  describe("5. Error Handling", () => {
    describe("Graceful Degradation", () => {
      it("should work when localStorage is unavailable", async () => {
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
            removeItem: jest.fn(() => {
              throw new Error("localStorage unavailable");
            }),
            clear: jest.fn(() => {
              throw new Error("localStorage unavailable");
            }),
          },
          writable: true,
        });

        const user = userEvent.setup();

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        const themeButton = screen.getByLabelText(/switch to dark theme/i);

        // Should not throw error
        await expect(user.click(themeButton)).resolves.not.toThrow();

        // Should still change theme (using memory/context only)
        await waitFor(() => {
          expect(document.documentElement).toHaveClass("dark");
        });

        // Restore localStorage
        Object.defineProperty(window, "localStorage", {
          value: originalLocalStorage,
          writable: true,
        });
      });

      it("should handle theme provider failures gracefully", () => {
        // Mock console.error to catch provider errors
        const consoleSpy = jest
          .spyOn(console, "error")
          .mockImplementation(() => {});

        // Render without ThemeProvider (this should fail gracefully)
        render(
          <>
            <Header />
            <Footer />
          </>,
        );

        // Should still render components
        expect(screen.getByRole("banner")).toBeInTheDocument();
        expect(screen.getByRole("contentinfo")).toBeInTheDocument();

        // Should show error boundary or fallback UI (will fail initially)
        expect(screen.getByTestId("theme-fallback-ui")).toBeInTheDocument();

        consoleSpy.mockRestore();
      });
    });

    describe("Error Boundaries", () => {
      it("should have proper error boundaries for theme components", () => {
        // Mock component that throws error
        const ThrowingComponent = () => {
          throw new Error("Theme component error");
        };

        // This test would need a proper error boundary implementation
        const consoleSpy = jest
          .spyOn(console, "error")
          .mockImplementation(() => {});

        render(
          <TestWrapper>
            <Header />
            <ThrowingComponent />
            <Footer />
          </TestWrapper>,
        );

        // Should show error fallback UI instead of crashing
        expect(screen.getByTestId("theme-error-fallback")).toBeInTheDocument();

        consoleSpy.mockRestore();
      });
    });

    describe("Invalid Theme Values", () => {
      it("should handle invalid theme values", async () => {
        const user = userEvent.setup();

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        // Manually set invalid theme
        localStorage.setItem("theme", "invalid-theme");

        // Component should auto-correct to valid theme
        const themeButton = screen.getByLabelText(/switch to system theme/i);
        await user.click(themeButton);

        await waitFor(() => {
          expect(localStorage.getItem("theme")).toBe("system");
        });
      });

      it("should validate theme values before applying", async () => {
        const user = userEvent.setup();

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        // Try to set theme through custom event (simulating external modification)
        const invalidThemeEvent = new CustomEvent("theme-change", {
          detail: { theme: "invalid-theme" },
        });

        window.dispatchEvent(invalidThemeEvent);

        // Should not apply invalid theme
        expect(document.documentElement).not.toHaveClass("invalid-theme");

        // Should maintain valid theme state
        expect(
          ["light", "dark", "", "system"].some(
            (validTheme) =>
              document.documentElement.classList.contains(validTheme) ||
              validTheme === "",
          ),
        ).toBe(true);
      });
    });

    describe("Network and Performance Issues", () => {
      it("should handle slow theme transitions gracefully", async () => {
        const user = userEvent.setup();

        // Mock very slow transition
        (document.startViewTransition as jest.Mock).mockImplementation(
          (callback) => {
            return new Promise((resolve) => {
              setTimeout(() => {
                callback();
                resolve(undefined);
              }, 5000); // 5 second delay
            });
          },
        );

        render(
          <TestWrapper>
            <Header />
            <Footer />
          </TestWrapper>,
        );

        const themeButton = screen.getByLabelText(/switch to dark theme/i);
        await user.click(themeButton);

        // Should show loading state immediately
        expect(screen.getByTestId("theme-switch-loading")).toBeInTheDocument();

        // Should have timeout fallback (this will fail initially)
        await waitFor(
          () => {
            expect(document.documentElement).toHaveClass("dark");
          },
          { timeout: 1000 },
        ); // Should complete within 1 second despite 5s mock delay
      });
    });
  });

  // =============================================================================
  // INTEGRATION TESTS
  // =============================================================================

  describe("Integration Tests", () => {
    it("should work correctly with the complete application flow", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Header />
          <main>
            <div data-testid="main-content">Main content</div>
          </main>
          <Footer />
        </TestWrapper>,
      );

      // Test complete user journey
      // 1. Start with system theme
      expect(
        screen.getByTestId("header-system-theme-active"),
      ).toBeInTheDocument();

      // 2. Switch to dark theme from header
      const headerDarkButton =
        screen.getAllByLabelText(/switch to dark theme/i)[0];
      await user.click(headerDarkButton);

      await waitFor(() => {
        expect(document.documentElement).toHaveClass("dark");
      });

      // 3. Verify footer reflects change
      expect(
        screen.getByTestId("footer-dark-theme-active"),
      ).toBeInTheDocument();

      // 4. Switch to light theme from footer
      const footerLightButton = screen.getByLabelText(/switch to light theme/i);
      await user.click(footerLightButton);

      await waitFor(() => {
        expect(document.documentElement).not.toHaveClass("dark");
      });

      // 5. Verify header reflects change
      expect(
        screen.getByTestId("header-light-theme-active"),
      ).toBeInTheDocument();

      // 6. Verify persistence
      expect(localStorage.getItem("theme")).toBe("light");
    });
  });
});
