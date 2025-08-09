import { render, screen, act } from "@testing-library/react";
import { AnimatedMetricCard } from "../../components/ui/animated-metric-card";

// Mock motion components
jest.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  useInView: jest.fn(() => true), // Always return true for tests
  useSpring: jest.fn(),
  useTransform: jest.fn(),
}));

// Mock the AnimatedNumber component
jest.mock("../../components/core/animated-number", () => {
  return {
    AnimatedNumber: ({
      value,
      className,
    }: {
      value: number;
      className?: string;
    }) => (
      <span className={className} data-testid="animated-number">
        {value}
      </span>
    ),
  };
});

describe("AnimatedMetricCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("component rendering", () => {
    it("should render metric label correctly", () => {
      render(<AnimatedMetricCard label="Test Metric" value="78%" />);
      expect(screen.getByText("Test Metric")).toBeInTheDocument();
    });

    it("should render the card with proper styling", () => {
      render(<AnimatedMetricCard label="Test Metric" value="78%" />);
      // Look for the Card element which contains the proper classes
      const cardElement = document.querySelector('[class*="hover:shadow-lg"]');
      expect(cardElement).toBeInTheDocument();
      expect(cardElement).toHaveClass("transition-all");
    });
  });

  describe("value parsing and animation", () => {
    it("should parse percentage values and display animated number", () => {
      render(<AnimatedMetricCard label="Success Rate" value="78%" />);

      const animatedNumber = screen.getByTestId("animated-number");
      expect(animatedNumber).toBeInTheDocument();
      expect(animatedNumber).toHaveTextContent("78");
    });

    it("should display prefix and suffix correctly", () => {
      render(<AnimatedMetricCard label="Revenue" value="$180K" />);

      // Should show prefix
      expect(screen.getByText("$", { exact: false })).toBeInTheDocument();
      // Should show suffix
      expect(screen.getByText("K", { exact: false })).toBeInTheDocument();
    });

    it("should handle decimal values", () => {
      render(<AnimatedMetricCard label="Rating" value="4.8★" />);

      const animatedNumber = screen.getByTestId("animated-number");
      expect(animatedNumber).toHaveTextContent("4.8");
      expect(screen.getByText("★", { exact: false })).toBeInTheDocument();
    });

    it("should handle complex currency values", () => {
      render(<AnimatedMetricCard label="Revenue" value="$184.4M" />);

      const animatedNumber = screen.getByTestId("animated-number");
      expect(animatedNumber).toHaveTextContent("184.4");
      expect(screen.getByText("$", { exact: false })).toBeInTheDocument();
      // Look for M specifically in the suffix span
      const suffixElement = document.querySelector(".ml-1");
      expect(suffixElement).toHaveTextContent("M");
    });

    it("should handle values with less than symbol", () => {
      render(<AnimatedMetricCard label="Error Rate" value="<10%" />);

      const animatedNumber = screen.getByTestId("animated-number");
      expect(animatedNumber).toHaveTextContent("10");
      expect(screen.getByText("<", { exact: false })).toBeInTheDocument();
      expect(screen.getByText("%", { exact: false })).toBeInTheDocument();
    });
  });

  describe("animation behavior", () => {
    it("should pass correct springOptions to AnimatedNumber", () => {
      const mockSpringOptions = { bounce: 0, duration: 2000 };
      render(
        <AnimatedMetricCard
          label="Test"
          value="100%"
          springOptions={mockSpringOptions}
        />,
      );

      // The component should render without errors
      expect(screen.getByTestId("animated-number")).toBeInTheDocument();
    });

    it("should apply animation delay when provided", () => {
      render(
        <AnimatedMetricCard label="Test" value="100%" animationDelay={500} />,
      );

      // Component should render with delay prop
      expect(screen.getByTestId("animated-number")).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("should handle non-numeric values gracefully", () => {
      render(<AnimatedMetricCard label="Status" value="N/A" />);

      // Should display 0 for non-numeric values
      const animatedNumber = screen.getByTestId("animated-number");
      expect(animatedNumber).toHaveTextContent("0");
      expect(screen.getByText("N/A", { exact: false })).toBeInTheDocument();
    });

    it("should handle empty string values", () => {
      render(<AnimatedMetricCard label="Empty" value="" />);

      const animatedNumber = screen.getByTestId("animated-number");
      expect(animatedNumber).toHaveTextContent("0");
    });

    it("should handle time-based values", () => {
      render(<AnimatedMetricCard label="Duration" value="6 months" />);

      const animatedNumber = screen.getByTestId("animated-number");
      expect(animatedNumber).toHaveTextContent("6");
      expect(screen.getByText("months", { exact: false })).toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have proper semantic structure", () => {
      render(<AnimatedMetricCard label="Accessibility Test" value="100%" />);

      // Should have label text accessible
      expect(screen.getByText("Accessibility Test")).toBeInTheDocument();

      // Should have numeric value accessible
      expect(screen.getByTestId("animated-number")).toBeInTheDocument();
    });

    it("should support custom className", () => {
      render(
        <AnimatedMetricCard
          label="Custom Style"
          value="50%"
          className="custom-metric-card"
        />,
      );

      const card = screen
        .getByText("Custom Style")
        .closest('[class*="custom-metric-card"]');
      expect(card).toBeInTheDocument();
    });
  });
});
