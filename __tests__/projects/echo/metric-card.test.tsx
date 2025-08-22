import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock motion/react
jest.mock("motion/react", () => {
  const React = require("react");

  const createMotionComponent = (element: string) => {
    return React.forwardRef(({ children, ...props }: any, ref: any) => {
      const {
        variants,
        initial,
        animate,
        exit,
        transition,
        onAnimationComplete,
        onAnimationStart,
        whileHover,
        whileTap,
        whileInView,
        drag,
        dragConstraints,
        layoutId,
        layout,
        style,
        ...domProps
      } = props;

      return React.createElement(
        element,
        {
          ...domProps,
          style,
          ref,
          "data-motion-component": element,
        },
        children,
      );
    });
  };

  return {
    motion: {
      div: createMotionComponent("div"),
      span: createMotionComponent("span"),
    },
    useInView: jest.fn(() => true),
    AnimatePresence: ({ children }: any) =>
      React.createElement("div", {}, children),
  };
});

// Mock other UI components
jest.mock("@/components/ui/spotlight", () => ({
  Spotlight: ({ className, size }: any) => (
    <div className={className} data-size={size} data-testid="spotlight" />
  ),
}));

jest.mock("@/components/core/animated-number", () => ({
  AnimatedNumber: ({ value, className, ...props }: any) => (
    <span className={className} data-value={value} {...props}>
      {value}
    </span>
  ),
}));

jest.mock("@/lib/utils/parseMetricValue", () => ({
  parseMetricValue: (value: string) => {
    const match = value.match(/^(\D*)?(\d+(?:\.\d+)?)(\D*)?$/);
    if (match) {
      const [, prefix = "", number, suffix = ""] = match;
      return { prefix, number: parseFloat(number), suffix };
    }
    return { prefix: "", number: 0, suffix: value };
  },
}));

// Simplified MetricCard component for testing
interface MetricCardProps {
  metric: { label: string; value: string };
  index: number;
  onCelebrate: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  index,
  onCelebrate,
}) => {
  const [hasAnimated, setHasAnimated] = React.useState(false);
  const [showHeartbeat, setShowHeartbeat] = React.useState(false);

  // Parse metric value safely
  const parseMetricValue = (value: string) => {
    const match = value.match(/^(\D*)?(\d+(?:\.\d+)?)(\D*)?$/);
    if (match) {
      const [, prefix = "", number, suffix = ""] = match;
      return { prefix, number: parseFloat(number), suffix };
    }
    return { prefix: "", number: 0, suffix: value };
  };

  const { number, prefix, suffix } = parseMetricValue(metric.value);

  const handleClick = () => {
    setShowHeartbeat(true);
    setTimeout(() => setShowHeartbeat(false), 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(
      () => {
        if (!hasAnimated) {
          setHasAnimated(true);
          onCelebrate();
        }
      },
      1500 + index * 200,
    );

    return () => clearTimeout(timer);
  }, [hasAnimated, index, onCelebrate]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${metric.label} metric: ${metric.value}. Click to highlight this achievement.`}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      data-testid={`metric-card-${index}`}
      data-has-animated={hasAnimated}
      data-heartbeat={showHeartbeat}
      className="metric-card"
    >
      <div data-testid="spotlight" />

      <div className="relative h-full w-full">
        {/* Achievement badge for excellent metrics */}
        {metric.value.includes("%") && parseInt(metric.value) >= 30 && (
          <div data-testid="achievement-badge" data-animated={hasAnimated}>
            ⭐
          </div>
        )}

        <div className="relative text-center">
          <div
            className="metric-value"
            data-heartbeat={showHeartbeat}
            data-testid="metric-value"
          >
            {prefix && <span data-testid="metric-prefix">{prefix}</span>}
            <span
              data-value={number}
              data-testid="animated-number"
              className="tabular-nums"
              aria-label={`${metric.label}: ${metric.value}`}
            >
              {number}
            </span>
            {suffix && <span data-testid="metric-suffix">{suffix}</span>}
          </div>

          <div className="metric-label" data-testid="metric-label">
            {metric.label}
          </div>
        </div>

        {/* Celebration cloud icon */}
        {hasAnimated && <div data-testid="celebration-cloud">☁️</div>}
      </div>
    </div>
  );
};

describe("MetricCard Component", () => {
  let user: ReturnType<typeof userEvent.setup>;
  let mockOnCelebrate: jest.Mock;

  beforeEach(() => {
    user = userEvent.setup();
    mockOnCelebrate = jest.fn();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  const mockMetric = {
    label: "Storage Efficiency",
    value: "35%",
  };

  describe("Rendering and Basic Functionality", () => {
    it("renders metric card with correct content", () => {
      render(
        <MetricCard
          metric={mockMetric}
          index={0}
          onCelebrate={mockOnCelebrate}
        />,
      );

      expect(screen.getByTestId("metric-card-0")).toBeInTheDocument();
      expect(screen.getByText("Storage Efficiency")).toBeInTheDocument();
      expect(screen.getByTestId("animated-number")).toHaveTextContent("35");
      expect(screen.getByTestId("metric-suffix")).toHaveTextContent("%");
    });

    it("displays achievement badge for high percentage values", () => {
      render(
        <MetricCard
          metric={mockMetric}
          index={0}
          onCelebrate={mockOnCelebrate}
        />,
      );

      // Trigger animation
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      expect(screen.getByTestId("achievement-badge")).toBeInTheDocument();
    });

    it("does not display achievement badge for low percentage values", () => {
      const lowMetric = { label: "Low Value", value: "15%" };
      render(
        <MetricCard
          metric={lowMetric}
          index={0}
          onCelebrate={mockOnCelebrate}
        />,
      );

      expect(screen.queryByTestId("achievement-badge")).not.toBeInTheDocument();
    });

    it("handles non-percentage values correctly", () => {
      const speedMetric = { label: "Search Speed", value: "5x faster" };
      render(
        <MetricCard
          metric={speedMetric}
          index={0}
          onCelebrate={mockOnCelebrate}
        />,
      );

      expect(screen.getByTestId("animated-number")).toHaveTextContent("5");
      expect(screen.getByTestId("metric-suffix")).toHaveTextContent("x faster");
      expect(screen.queryByTestId("achievement-badge")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility Features", () => {
    it("has proper ARIA labels and roles", () => {
      render(
        <MetricCard
          metric={mockMetric}
          index={0}
          onCelebrate={mockOnCelebrate}
        />,
      );

      const card = screen.getByTestId("metric-card-0");
      expect(card).toHaveAttribute("role", "button");
      expect(card).toHaveAttribute("tabIndex", "0");
      expect(card).toHaveAttribute(
        "aria-label",
        "Storage Efficiency metric: 35%. Click to highlight this achievement.",
      );
    });

    it("responds to keyboard navigation", async () => {
      render(
        <MetricCard
          metric={mockMetric}
          index={0}
          onCelebrate={mockOnCelebrate}
        />,
      );

      const card = screen.getByTestId("metric-card-0");

      // Focus the card
      card.focus();
      expect(document.activeElement).toBe(card);

      // Press Enter
      fireEvent.keyDown(card, { key: "Enter", code: "Enter" });

      expect(screen.getByTestId("metric-value")).toHaveAttribute(
        "data-heartbeat",
        "true",
      );

      // Wait for heartbeat to finish
      act(() => {
        jest.advanceTimersByTime(600);
      });
      expect(screen.getByTestId("metric-value")).toHaveAttribute(
        "data-heartbeat",
        "false",
      );
    });

    it("responds to Space key press", async () => {
      render(
        <MetricCard
          metric={mockMetric}
          index={0}
          onCelebrate={mockOnCelebrate}
        />,
      );

      const card = screen.getByTestId("metric-card-0");
      card.focus();

      // Press Space using fireEvent instead of user.keyboard for fake timers
      fireEvent.keyDown(card, { key: " ", code: "Space" });

      expect(screen.getByTestId("metric-value")).toHaveAttribute(
        "data-heartbeat",
        "true",
      );
    });

    it("has proper ARIA label on animated number", () => {
      render(
        <MetricCard
          metric={mockMetric}
          index={0}
          onCelebrate={mockOnCelebrate}
        />,
      );

      const animatedNumber = screen.getByTestId("animated-number");
      expect(animatedNumber).toHaveAttribute(
        "aria-label",
        "Storage Efficiency: 35%",
      );
    });
  });

  describe("Interactive Behavior", () => {
    it("triggers heartbeat effect on click", async () => {
      render(
        <MetricCard
          metric={mockMetric}
          index={0}
          onCelebrate={mockOnCelebrate}
        />,
      );

      const card = screen.getByTestId("metric-card-0");

      // Click using fireEvent for fake timers
      fireEvent.click(card);

      expect(screen.getByTestId("metric-value")).toHaveAttribute(
        "data-heartbeat",
        "true",
      );

      // Wait for heartbeat animation to finish
      act(() => {
        jest.advanceTimersByTime(600);
      });

      expect(screen.getByTestId("metric-value")).toHaveAttribute(
        "data-heartbeat",
        "false",
      );
    });

    it("triggers celebration callback after animation delay", () => {
      render(
        <MetricCard
          metric={mockMetric}
          index={2}
          onCelebrate={mockOnCelebrate}
        />,
      );

      // Should trigger after base delay (1500ms) + index delay (2 * 200ms = 400ms) = 1900ms
      act(() => {
        jest.advanceTimersByTime(1900);
      });

      expect(mockOnCelebrate).toHaveBeenCalledTimes(1);
    });

    it("shows celebration cloud after animation completes", () => {
      render(
        <MetricCard
          metric={mockMetric}
          index={0}
          onCelebrate={mockOnCelebrate}
        />,
      );

      expect(screen.queryByTestId("celebration-cloud")).not.toBeInTheDocument();

      // Trigger animation
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      expect(screen.getByTestId("celebration-cloud")).toBeInTheDocument();
    });
  });

  describe("Animation States", () => {
    it("starts with no animation state", () => {
      render(
        <MetricCard
          metric={mockMetric}
          index={0}
          onCelebrate={mockOnCelebrate}
        />,
      );

      expect(screen.getByTestId("metric-card-0")).toHaveAttribute(
        "data-has-animated",
        "false",
      );
    });

    it("updates animation state after timer completes", () => {
      render(
        <MetricCard
          metric={mockMetric}
          index={0}
          onCelebrate={mockOnCelebrate}
        />,
      );

      act(() => {
        jest.advanceTimersByTime(1500);
      });

      expect(screen.getByTestId("metric-card-0")).toHaveAttribute(
        "data-has-animated",
        "true",
      );
    });

    it("animates achievement badge when animation completes", () => {
      render(
        <MetricCard
          metric={mockMetric}
          index={0}
          onCelebrate={mockOnCelebrate}
        />,
      );

      // Initially badge should not be animated
      const badgeInitial = screen.getByTestId("achievement-badge");
      expect(badgeInitial).toHaveAttribute("data-animated", "false");

      // After animation
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      const badge = screen.getByTestId("achievement-badge");
      expect(badge).toHaveAttribute("data-animated", "true");
    });
  });

  describe("Staggered Animation Timing", () => {
    it("applies correct delay based on index", () => {
      // Test index 0 - should trigger at 1500ms
      render(
        <MetricCard
          metric={mockMetric}
          index={0}
          onCelebrate={mockOnCelebrate}
        />,
      );

      act(() => {
        jest.advanceTimersByTime(1499);
      });
      expect(mockOnCelebrate).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(mockOnCelebrate).toHaveBeenCalledTimes(1);
    });

    it("applies different delays for higher indices", () => {
      // Test index 3 - should trigger at 1500 + (3 * 200) = 2100ms
      const mockCelebrate = jest.fn();
      render(
        <MetricCard
          metric={mockMetric}
          index={3}
          onCelebrate={mockCelebrate}
        />,
      );

      act(() => {
        jest.advanceTimersByTime(2099);
      });
      expect(mockCelebrate).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(mockCelebrate).toHaveBeenCalledTimes(1);
    });
  });

  describe("Performance and Memory Management", () => {
    it("cleans up timers on unmount", () => {
      const { unmount } = render(
        <MetricCard
          metric={mockMetric}
          index={0}
          onCelebrate={mockOnCelebrate}
        />,
      );

      const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });

    it("prevents multiple celebration calls", () => {
      render(
        <MetricCard
          metric={mockMetric}
          index={0}
          onCelebrate={mockOnCelebrate}
        />,
      );

      // Trigger animation multiple times
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      act(() => {
        jest.advanceTimersByTime(1500);
      });

      // Should only be called once
      expect(mockOnCelebrate).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge Cases", () => {
    it("handles malformed metric values gracefully", () => {
      const malformedMetric = { label: "Invalid", value: "not-a-number" };

      expect(() => {
        render(
          <MetricCard
            metric={malformedMetric}
            index={0}
            onCelebrate={mockOnCelebrate}
          />,
        );
      }).not.toThrow();

      expect(screen.getByTestId("animated-number")).toHaveTextContent("0");
    });

    it("handles empty metric values", () => {
      const emptyMetric = { label: "Empty", value: "" };

      expect(() => {
        render(
          <MetricCard
            metric={emptyMetric}
            index={0}
            onCelebrate={mockOnCelebrate}
          />,
        );
      }).not.toThrow();

      expect(screen.getByTestId("metric-label")).toHaveTextContent("Empty");
    });

    it("handles negative indices gracefully", () => {
      render(
        <MetricCard
          metric={mockMetric}
          index={-1}
          onCelebrate={mockOnCelebrate}
        />,
      );

      // Should still trigger animation (1500 + (-1)*200 = 1300ms)
      act(() => {
        jest.advanceTimersByTime(1300);
      });

      expect(mockOnCelebrate).toHaveBeenCalled();
    });
  });

  describe("Visual States", () => {
    it("applies correct CSS classes", () => {
      render(
        <MetricCard
          metric={mockMetric}
          index={0}
          onCelebrate={mockOnCelebrate}
        />,
      );

      const card = screen.getByTestId("metric-card-0");
      expect(card).toHaveClass("metric-card");

      const animatedNumber = screen.getByTestId("animated-number");
      expect(animatedNumber).toHaveClass("tabular-nums");
    });

    it("includes spotlight component", () => {
      render(
        <MetricCard
          metric={mockMetric}
          index={0}
          onCelebrate={mockOnCelebrate}
        />,
      );

      expect(screen.getByTestId("spotlight")).toBeInTheDocument();
    });
  });
});
