import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { EnhancedMetricsGrid } from "@/components/ui/enhanced-metrics-grid";
import { validateMaximumColumns } from "../grid-layout-constraints.test";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  useInView: () => [null, true],
  useSpring: () => ({ value: 0 }),
}));

const mockMetrics = [
  { label: "User Satisfaction", value: "98%" },
  { label: "Performance Score", value: "95%" },
  { label: "Completion Rate", value: "92%" },
  { label: "Error Reduction", value: "80%" },
  { label: "Load Time", value: "1.2s" },
  { label: "Mobile Score", value: "96%" },
];

describe("EnhancedMetricsGrid Grid Constraints", () => {
  it("should enforce maximum 2 columns constraint", () => {
    const { container } = render(<EnhancedMetricsGrid metrics={mockMetrics} />);

    const gridElement = container.querySelector(".grid");
    expect(gridElement).toBeInTheDocument();

    if (gridElement) {
      // This test will initially fail, demonstrating the problem
      expect(() => validateMaximumColumns(gridElement, 2)).not.toThrow();
    }
  });

  it("should use optimal responsive grid pattern", () => {
    const { container } = render(<EnhancedMetricsGrid metrics={mockMetrics} />);

    const gridElement = container.querySelector(".grid");

    if (gridElement) {
      // Should follow pattern: grid-cols-1 md:grid-cols-2 lg:grid-cols-2
      expect(gridElement).toHaveClass("grid-cols-1");
      expect(gridElement).toHaveClass("md:grid-cols-2");
      expect(gridElement).toHaveClass("lg:grid-cols-2");

      // Should NOT have more than 2 columns
      expect(gridElement).not.toHaveClass("lg:grid-cols-3");
      expect(gridElement).not.toHaveClass("lg:grid-cols-4");
      expect(gridElement).not.toHaveClass("xl:grid-cols-5");
      expect(gridElement).not.toHaveClass("xl:grid-cols-6");
    }
  });

  it("should provide adequate spacing for readability", () => {
    const { container } = render(<EnhancedMetricsGrid metrics={mockMetrics} />);

    const gridElement = container.querySelector(".grid");

    if (gridElement) {
      // Should have proper gap spacing (updated to gap-6 for better readability)
      expect(gridElement).toHaveClass("gap-6");
    }
  });

  it("should maintain card readability with wider layout", () => {
    const { container } = render(<EnhancedMetricsGrid metrics={mockMetrics} />);

    // With max 2 columns, cards should have more width for content
    const metricCards = container.querySelectorAll(
      '[class*="metric"], .h-full',
    );

    // Cards should be present and have proper height classes
    expect(metricCards.length).toBeGreaterThan(0);
  });

  it("should handle large datasets with proper layout", () => {
    const largeMetrics = Array.from({ length: 12 }, (_, i) => ({
      label: `Metric ${i + 1}`,
      value: `${90 + i}%`,
    }));

    const { container } = render(
      <EnhancedMetricsGrid metrics={largeMetrics} />,
    );

    const gridElement = container.querySelector(".grid");

    if (gridElement) {
      validateMaximumColumns(gridElement, 2);

      // Should still maintain 2-column maximum even with many items
      expect(gridElement).not.toHaveClass("lg:grid-cols-3");
      expect(gridElement).not.toHaveClass("lg:grid-cols-4");
      expect(gridElement).not.toHaveClass("xl:grid-cols-6");
    }
  });
});
