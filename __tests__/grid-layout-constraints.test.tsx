import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

/**
 * Grid Layout Constraints Test Suite
 * Ensures no component uses more than 2 columns on any breakpoint
 * Following TDD approach for grid optimization project
 */

// Test utilities for grid class validation
const getGridColumnClasses = (element: Element) => {
  const classList = Array.from(element.classList);
  return classList.filter((cls) => cls.includes("grid-cols-"));
};

const validateMaximumColumns = (element: Element, maxColumns: number = 2) => {
  const gridClasses = getGridColumnClasses(element);

  gridClasses.forEach((cls) => {
    // Extract number from grid-cols-X format
    const match = cls.match(/grid-cols-(\d+)/);
    if (match) {
      const columns = parseInt(match[1], 10);
      expect(columns).toBeLessThanOrEqual(maxColumns);
    }
  });
};

const validateResponsiveGridPattern = (element: Element) => {
  const classList = Array.from(element.classList);

  // Check for proper responsive pattern: grid-cols-1 md:grid-cols-2 lg:grid-cols-2
  const hasBasicGrid = classList.some((cls) => cls === "grid-cols-1");
  const hasMediumGrid = classList.some((cls) => cls === "md:grid-cols-2");
  const hasLargeGrid = classList.some((cls) => cls === "lg:grid-cols-2");

  // If element uses grid columns, it should follow our responsive pattern
  if (classList.some((cls) => cls.includes("grid-cols-"))) {
    expect(hasBasicGrid || hasMediumGrid || hasLargeGrid).toBe(true);
  }
};

describe("Grid Layout Constraints", () => {
  describe("Maximum Column Validation", () => {
    it("should enforce maximum 2 columns constraint", () => {
      // Test component that violates constraint
      const TestComponent = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          <div>Item 1</div>
          <div>Item 2</div>
        </div>
      );

      const { container } = render(<TestComponent />);
      const gridElement = container.querySelector(".grid");

      if (gridElement) {
        validateMaximumColumns(gridElement, 2);
      }
    });

    it("should reject grids with more than 2 columns", () => {
      // This test demonstrates components that violate our constraint
      const ViolatingComponent = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          <div>Item 1</div>
          <div>Item 2</div>
          <div>Item 3</div>
          <div>Item 4</div>
        </div>
      );

      const { container } = render(<ViolatingComponent />);
      const gridElement = container.querySelector(".grid");

      if (gridElement) {
        // Check that this violating component has problematic classes
        expect(gridElement).toHaveClass("lg:grid-cols-4");
        expect(gridElement).toHaveClass("xl:grid-cols-6");

        // Validate it fails our constraint
        const gridClasses = Array.from(gridElement.classList).filter((cls) =>
          cls.includes("grid-cols-"),
        );

        const hasViolation = gridClasses.some((cls) => {
          const match = cls.match(/grid-cols-(\d+)/);
          return match && parseInt(match[1], 10) > 2;
        });

        expect(hasViolation).toBe(true);
      }
    });

    it("should validate responsive grid patterns", () => {
      const ResponsiveComponent = () => (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
          <div>Item 1</div>
          <div>Item 2</div>
        </div>
      );

      const { container } = render(<ResponsiveComponent />);
      const gridElement = container.querySelector(".grid");

      if (gridElement) {
        validateResponsiveGridPattern(gridElement);
      }
    });
  });

  describe("Touch Target Size Validation", () => {
    it("should ensure minimum touch target size of 44px", () => {
      const TouchableComponent = () => (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <button className="min-h-[44px] min-w-[44px] p-4">Button 1</button>
          <button className="min-h-[44px] min-w-[44px] p-4">Button 2</button>
        </div>
      );

      const { container } = render(<TouchableComponent />);
      const buttons = container.querySelectorAll("button");

      buttons.forEach((button) => {
        expect(button).toHaveClass("min-h-[44px]");
        expect(button).toHaveClass("min-w-[44px]");
      });
    });
  });

  describe("Accessibility Compliance", () => {
    it("should maintain proper spacing for readability", () => {
      const ReadableComponent = () => (
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <div className="space-y-2 p-4">
            <h3>Title</h3>
            <p>Content that should be easily readable</p>
          </div>
          <div className="space-y-2 p-4">
            <h3>Title 2</h3>
            <p>More content with proper spacing</p>
          </div>
        </div>
      );

      const { container } = render(<ReadableComponent />);
      const gridElement = container.querySelector(".grid");

      expect(gridElement).toHaveClass("gap-6");
      expect(gridElement).toHaveClass("p-6");
    });
  });

  describe("Breakpoint Consistency", () => {
    it("should use consistent breakpoint patterns", () => {
      const ConsistentComponent = () => (
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div>Item 1</div>
          <div>Item 2</div>
        </div>
      );

      const { container } = render(<ConsistentComponent />);
      const gridElement = container.querySelector(".grid");

      if (gridElement) {
        // Should have mobile-first approach
        expect(gridElement).toHaveClass("grid-cols-1");
        expect(gridElement).toHaveClass("md:grid-cols-2");
      }
    });
  });
});

// Utility function to test existing components
export const testGridConstraints = (componentElement: Element) => {
  const gridElements = componentElement.querySelectorAll(
    '.grid, [class*="grid-cols-"]',
  );

  gridElements.forEach((element) => {
    validateMaximumColumns(element, 2);
    validateResponsiveGridPattern(element);
  });
};

// Export test utilities for reuse in component-specific tests
export { validateMaximumColumns, validateResponsiveGridPattern };
