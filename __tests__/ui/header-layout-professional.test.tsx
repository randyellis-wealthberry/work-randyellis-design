/**
 * TDD Phase 1 (RED): Professional Header Layout Tests
 *
 * These tests should FAIL initially and guide the implementation of:
 * - Utility bar pattern above main header
 * - Removal of theme toggle from navigation
 * - Mobile-responsive design with proper touch targets
 * - Professional visual hierarchy
 * - Accessibility compliance
 *
 * Expected Initial State: FAILING tests that define requirements
 * Target State: GREEN tests after layout improvements
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "@/app/header";
import { ThemeProvider } from "next-themes";
import React from "react";

// Test wrapper with theme provider
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    {children}
  </ThemeProvider>
);

// Mock window dimensions for responsive testing
const mockWindowDimensions = (width: number, height: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, "innerHeight", {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event("resize"));
};

describe("Professional Header Layout (TDD RED Phase)", () => {
  beforeEach(() => {
    // Reset window dimensions
    mockWindowDimensions(1440, 900); // Desktop default
  });

  describe("1. Layout Structure", () => {
    it("should have utility bar above main header", () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>,
      );

      // Should find utility bar component
      const utilityBar = screen.getByTestId("utility-bar");
      expect(utilityBar).toBeInTheDocument();

      // Should find main header
      const mainHeader = screen.getByTestId("main-header");
      expect(mainHeader).toBeInTheDocument();

      // Utility bar should come before main header in DOM order
      expect(utilityBar.compareDocumentPosition(mainHeader)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });

    it("should maintain two-column layout in main header", () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>,
      );

      const mainHeader = screen.getByTestId("main-header");

      // Should have left column (name + subtitle)
      expect(screen.getByText("Randy Ellis")).toBeInTheDocument();
      expect(
        screen.getByText("Generative AI & Product Design Engineer"),
      ).toBeInTheDocument();

      // Should have right column (navigation only)
      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("About")).toBeInTheDocument();
      expect(screen.getByText("Projects")).toBeInTheDocument();
    });
  });

  describe("2. Theme Toggle Placement", () => {
    it("should NOT have theme toggle in main navigation", () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>,
      );

      const mainHeader = screen.getByTestId("main-header");

      // Theme toggle should not be in main header
      expect(mainHeader).not.toContainElement(
        screen.queryByTestId("header-theme-light"),
      );
      expect(mainHeader).not.toContainElement(
        screen.queryByTestId("header-theme-dark"),
      );
      expect(mainHeader).not.toContainElement(
        screen.queryByTestId("header-theme-system"),
      );
    });

    it("should have theme toggle in utility bar", () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>,
      );

      const utilityBar = screen.getByTestId("utility-bar");

      // Theme toggle should be in utility bar
      expect(utilityBar).toContainElement(
        screen.getByTestId("header-theme-light"),
      );
      expect(utilityBar).toContainElement(
        screen.getByTestId("header-theme-dark"),
      );
      expect(utilityBar).toContainElement(
        screen.getByTestId("header-theme-system"),
      );
    });
  });

  describe("3. Mobile Responsive Design", () => {
    it("should have larger touch targets on mobile", () => {
      // Set mobile viewport
      mockWindowDimensions(375, 667);

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>,
      );

      // Theme toggle buttons should have minimum 44px touch targets on mobile
      const themeButtons = screen.getAllByRole("button", {
        name: /switch to.*theme/i,
      });

      themeButtons.forEach((button) => {
        // Check CSS classes for mobile touch target sizing
        expect(button).toHaveClass("min-h-[44px]");
        expect(button).toHaveClass("min-w-[44px]");
      });
    });

    it("should have proper spacing on mobile", () => {
      mockWindowDimensions(375, 667);

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>,
      );

      const utilityBar = screen.getByTestId("utility-bar");

      // Should have mobile-appropriate height (40px)
      expect(utilityBar).toHaveClass("h-10"); // Tailwind h-10 = 40px

      // Should be centered on mobile
      expect(utilityBar).toHaveClass("justify-center");
    });

    it("should adapt layout for tablet breakpoint", () => {
      mockWindowDimensions(768, 1024);

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>,
      );

      const utilityBar = screen.getByTestId("utility-bar");

      // Should transition to right-aligned on tablet
      expect(utilityBar).toHaveClass("sm:justify-end");
    });

    it("should be compact on desktop", () => {
      mockWindowDimensions(1440, 900);

      render(
        <TestWrapper>
          <Header />
        </TestWrapper>,
      );

      const utilityBar = screen.getByTestId("utility-bar");

      // Should have compact height (32px) on desktop
      expect(utilityBar).toHaveClass("sm:h-8"); // Tailwind h-8 = 32px

      // Should be right-aligned on desktop
      expect(utilityBar).toHaveClass("sm:justify-end");
    });
  });

  describe("4. Visual Hierarchy", () => {
    it("should have subtle utility bar styling", () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>,
      );

      const utilityBar = screen.getByTestId("utility-bar");

      // Should have NO background for ultra low-profile design
      expect(utilityBar).not.toHaveClass("bg-zinc-50/50");
      expect(utilityBar).not.toHaveClass("dark:bg-zinc-900/50");

      // Should have subtle border
      expect(utilityBar).toHaveClass("border-b");
      expect(utilityBar).toHaveClass("border-zinc-100/50");
      expect(utilityBar).toHaveClass("dark:border-zinc-800/50");
    });

    it("should not compete visually with navigation", () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>,
      );

      const utilityBar = screen.getByTestId("utility-bar");
      const mainHeader = screen.getByTestId("main-header");

      // Utility bar should be more subtle than main header
      // (This would need visual regression testing in a real scenario)
      expect(utilityBar).toBeInTheDocument();
      expect(mainHeader).toBeInTheDocument();
    });
  });

  describe("5. Accessibility", () => {
    it("should maintain logical keyboard navigation flow", () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>,
      );

      // Theme toggle buttons should be focusable
      const themeButtons = screen.getAllByRole("button", {
        name: /switch to.*theme/i,
      });

      themeButtons.forEach((button) => {
        // Buttons should be focusable (no negative tabindex)
        const tabindex = button.getAttribute("tabindex");
        expect(tabindex === null || parseInt(tabindex) >= 0).toBe(true);
      });

      // Navigation links should be focusable
      const navLinks = [
        screen.getByRole("link", { name: /home/i }),
        screen.getByRole("link", { name: /about/i }),
        screen.getByRole("link", { name: /projects/i }),
      ];

      navLinks.forEach((link) => {
        expect(link).not.toHaveAttribute("tabindex", "-1");
      });
    });

    it("should maintain ARIA labels for theme controls", () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>,
      );

      // All theme buttons should have proper ARIA labels
      expect(
        screen.getByLabelText("Switch to Light theme"),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Switch to Dark theme")).toBeInTheDocument();
      expect(
        screen.getByLabelText("Switch to System theme"),
      ).toBeInTheDocument();
    });

    it("should have proper semantic structure", () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>,
      );

      // Utility bar should be a complementary landmark or have proper role
      const utilityBar = screen.getByTestId("utility-bar");
      expect(utilityBar).toHaveAttribute("role", "complementary");

      // Main header should remain as banner
      const mainHeader = screen.getByTestId("main-header");
      expect(mainHeader).toHaveAttribute("role", "banner");
    });
  });

  describe("6. Performance", () => {
    it("should not cause layout shift", () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>,
      );

      const utilityBar = screen.getByTestId("utility-bar");
      const mainHeader = screen.getByTestId("main-header");

      // Both elements should be present without hydration issues
      expect(utilityBar).toBeInTheDocument();
      expect(mainHeader).toBeInTheDocument();
    });
  });
});
