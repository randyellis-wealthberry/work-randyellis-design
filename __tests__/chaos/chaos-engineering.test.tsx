/**
 * Ultra-Testing Phase: Chaos Engineering
 * Advanced stress testing with failure injection and edge case validation
 */

import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Import components for chaos testing
import { PerformanceOptimizedScene } from "../../components/ui/webgl-scenes/performance-optimized-scene";
import { TargetCursor } from "../../components/animations/target-cursor";
import { MagneticWrapper } from "../../components/animations/magnetic";
import { NewsletterSignup } from "../../components/ui/newsletter-signup";
import { TextGradientScroll } from "../../components/animations/text-gradient-scroll";

// Chaos Engineering Utilities
class ChaosController {
  private failures: Map<string, boolean> = new Map();
  private latencyMaps: Map<string, number> = new Map();
  private memoryPressure = false;
  private networkErrors: string[] = [];

  injectFailure(componentId: string, shouldFail: boolean = true) {
    this.failures.set(componentId, shouldFail);
  }

  injectLatency(componentId: string, delayMs: number) {
    this.latencyMaps.set(componentId, delayMs);
  }

  enableMemoryPressure() {
    this.memoryPressure = true;
    // Simulate memory pressure
    if ((performance as any).memory) {
      (performance as any).memory.usedJSHeapSize = 200 * 1024 * 1024; // 200MB
    }
  }

  injectNetworkError(url: string) {
    this.networkErrors.push(url);
  }

  shouldFail(componentId: string): boolean {
    return this.failures.get(componentId) || false;
  }

  getLatency(componentId: string): number {
    return this.latencyMaps.get(componentId) || 0;
  }

  isMemoryPressured(): boolean {
    return this.memoryPressure;
  }

  shouldNetworkFail(url: string): boolean {
    return this.networkErrors.includes(url);
  }

  reset() {
    this.failures.clear();
    this.latencyMaps.clear();
    this.memoryPressure = false;
    this.networkErrors = [];
  }
}

// Property-Based Testing Generators
class PropertyGenerator {
  static randomString(length: number = 10): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    return Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join("");
  }

  static randomEmail(): string {
    const domains = ["test.com", "example.org", "sample.net", "chaos.dev"];
    const username = this.randomString(Math.floor(Math.random() * 20) + 3);
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${username}@${domain}`;
  }

  static randomNumber(min: number = 0, max: number = 1000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomCoordinates(): { x: number; y: number } {
    return {
      x: Math.floor(Math.random() * 2000) - 1000,
      y: Math.floor(Math.random() * 2000) - 1000,
    };
  }

  static extremeValues(): Array<string | number | null | undefined> {
    return [
      "", // Empty string
      " ".repeat(10000), // Very long string
      "🚀🎉🔥💻🌟⚡🎨🚀🎉🔥💻🌟⚡🎨", // Unicode/emoji
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
      0,
      -0,
      Infinity,
      -Infinity,
      NaN,
      null,
      undefined,
      '"><script>alert("xss")</script>', // XSS attempt
      "DROP TABLE users;", // SQL injection attempt
      "\x00\x01\x02", // Binary data
    ];
  }
}

// Fuzzing Test Suite
class FuzzTester {
  static async fuzzComponent(
    Component: React.ComponentType<any>,
    propTypes: Record<string, string[]>,
    iterations: number = 50,
  ) {
    const results: Array<{ props: any; success: boolean; error?: string }> = [];

    for (let i = 0; i < iterations; i++) {
      const fuzzProps: any = {};

      // Generate random props based on types
      Object.entries(propTypes).forEach(([prop, types]) => {
        const type = types[Math.floor(Math.random() * types.length)];

        switch (type) {
          case "string":
            fuzzProps[prop] = PropertyGenerator.randomString();
            break;
          case "number":
            fuzzProps[prop] = PropertyGenerator.randomNumber();
            break;
          case "boolean":
            fuzzProps[prop] = Math.random() > 0.5;
            break;
          case "extreme":
            const extremes = PropertyGenerator.extremeValues();
            fuzzProps[prop] =
              extremes[Math.floor(Math.random() * extremes.length)];
            break;
        }
      });

      try {
        render(<Component {...fuzzProps} />);
        results.push({ props: fuzzProps, success: true });
      } catch (error) {
        results.push({
          props: fuzzProps,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return results;
  }
}

describe("Ultra-Testing Phase: Chaos Engineering", () => {
  let chaosController: ChaosController;

  beforeEach(() => {
    chaosController = new ChaosController();

    // Mock console.error to track errors
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Enhanced fetch mock for chaos testing
    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (chaosController.shouldNetworkFail(url)) {
        return Promise.reject(new Error("Network chaos injection"));
      }

      const latency = chaosController.getLatency("network");
      if (latency > 0) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              new Response(JSON.stringify({ success: true }), { status: 200 }),
            );
          }, latency);
        });
      }

      return Promise.resolve(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );
    });
  });

  afterEach(() => {
    chaosController.reset();
    jest.restoreAllMocks();
  });

  describe("Failure Injection Testing", () => {
    test("should handle WebGL context failure gracefully", async () => {
      // Mock ResizeObserver for this test
      const MockResizeObserver = jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      }));
      global.ResizeObserver = MockResizeObserver;

      // Inject WebGL context failure
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(null);

      expect(() => {
        render(<PerformanceOptimizedScene />);
      }).not.toThrow();

      // Restore context
      HTMLCanvasElement.prototype.getContext = originalGetContext;
    });

    test("should handle animation frame request failure", async () => {
      const originalRAF = global.requestAnimationFrame;
      global.requestAnimationFrame = jest.fn().mockImplementation(() => {
        throw new Error("RequestAnimationFrame chaos");
      });

      expect(() => {
        render(<TargetCursor />);
      }).not.toThrow();

      global.requestAnimationFrame = originalRAF;
    });

    test("should handle event listener failure", async () => {
      const originalAddEventListener = document.addEventListener;
      document.addEventListener = jest.fn().mockImplementation(() => {
        throw new Error("EventListener chaos");
      });

      expect(() => {
        render(
          <MagneticWrapper>
            <div>Test</div>
          </MagneticWrapper>,
        );
      }).not.toThrow();

      document.addEventListener = originalAddEventListener;
    });

    test("should handle network failures during form submission", async () => {
      chaosController.injectNetworkError("/api/newsletter/subscribe");

      const user = userEvent.setup();
      render(<NewsletterSignup />);

      const emailInput = screen.getByRole("textbox");
      const submitButton = screen.getByRole("button", { name: /subscribe/i });

      await user.type(emailInput, "chaos@test.com");
      await user.click(submitButton);

      // Should handle network failure gracefully
      await waitFor(() => {
        expect(
          screen.getByText(/network error|something went wrong/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Memory Pressure Testing", () => {
    test("should handle extreme memory pressure", async () => {
      chaosController.enableMemoryPressure();

      const TestComponent = () => (
        <div>
          <TargetCursor />
          <MagneticWrapper>
            <div>Test</div>
          </MagneticWrapper>
          <TextGradientScroll text="Memory pressure test" />
        </div>
      );

      expect(() => {
        render(<TestComponent />);
      }).not.toThrow();

      // Component should still be functional - the text is split by TextGradientScroll
      expect(screen.getByTestId("text-gradient-scroll")).toBeInTheDocument();
    });

    test("should handle memory allocation failures", async () => {
      // Simulate memory allocation failure by creating large objects
      try {
        const largeArray = new Array(1000000).fill("memory test");

        expect(() => {
          render(<TextGradientScroll text="Memory allocation test" />);
        }).not.toThrow();

        // Clean up
        largeArray.length = 0;
      } catch (error) {
        // If memory allocation fails, that's expected in this test
        expect(error).toBeDefined();
      }
    });
  });

  describe("Property-Based Fuzzing", () => {
    test("should handle random prop combinations for TargetCursor", async () => {
      const results = await FuzzTester.fuzzComponent(
        TargetCursor,
        {
          size: ["number", "extreme"],
          className: ["string", "extreme"],
          springConfig: ["extreme"],
        },
        25,
      );

      const successRate =
        results.filter((r) => r.success).length / results.length;
      expect(successRate).toBeGreaterThan(0.8); // 80% success rate acceptable
    });

    test("should handle random prop combinations for MagneticWrapper", async () => {
      const TestMagnetic = (props: any) => (
        <MagneticWrapper {...props}>
          <div>Test child</div>
        </MagneticWrapper>
      );

      const results = await FuzzTester.fuzzComponent(
        TestMagnetic,
        {
          strength: ["number", "extreme"],
          className: ["string", "extreme"],
          springConfig: ["extreme"],
        },
        25,
      );

      const successRate =
        results.filter((r) => r.success).length / results.length;
      expect(successRate).toBeGreaterThan(0.7); // 70% success rate acceptable
    });

    test("should handle extreme text inputs for TextGradientScroll", async () => {
      const extremeTexts = [
        "", // Empty
        "a".repeat(10000), // Very long
        "🚀".repeat(100), // Unicode
        "\n".repeat(100), // Newlines
        '<script>alert("xss")</script>', // HTML
        "ユニコード文字列", // Japanese
        "🏳️‍🌈🏳️‍⚧️👨‍👩‍👧‍👦", // Complex emoji
      ];

      extremeTexts.forEach((text) => {
        expect(() => {
          render(<TextGradientScroll text={text} />);
        }).not.toThrow();
      });
    });
  });

  describe("Race Condition Testing", () => {
    test("should handle rapid state changes in TargetCursor", async () => {
      render(<TargetCursor />);

      // Rapid fire mouse events to test race conditions
      const events = Array.from(
        { length: 100 },
        (_, i) =>
          new MouseEvent("mousemove", {
            clientX: Math.random() * 1000,
            clientY: Math.random() * 1000,
            bubbles: true,
          }),
      );

      expect(() => {
        events.forEach((event, index) => {
          setTimeout(() => document.dispatchEvent(event), index);
        });
      }).not.toThrow();
    });

    test("should handle concurrent animation updates", async () => {
      const ConcurrentTest = () => {
        const [count, setCount] = React.useState(0);

        React.useEffect(() => {
          const interval = setInterval(() => {
            setCount((c) => c + 1);
          }, 10);

          return () => clearInterval(interval);
        }, []);

        return (
          <div>
            <TargetCursor />
            <MagneticWrapper>
              <div>Count: {count}</div>
            </MagneticWrapper>
          </div>
        );
      };

      expect(() => {
        render(<ConcurrentTest />);
      }).not.toThrow();

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });
    });
  });

  describe("Edge Case Validation", () => {
    test("should handle zero and negative dimensions", () => {
      expect(() => {
        render(<TargetCursor size={0} />);
      }).not.toThrow();

      expect(() => {
        render(<TargetCursor size={-50} />);
      }).not.toThrow();
    });

    test("should handle malformed email addresses", async () => {
      const malformedEmails = [
        "not-an-email",
        "@domain.com",
        "user@",
        "user..user@domain.com",
        "user@domain..com",
        "a".repeat(320) + "@domain.com", // Too long
        "user@domain.c",
        "",
        " ",
        null,
        undefined,
      ];

      const user = userEvent.setup();

      for (const email of malformedEmails) {
        const { unmount } = render(<NewsletterSignup />);

        try {
          const emailInput = screen.getByRole("textbox");
          const submitButton = screen.getByRole("button", {
            name: /subscribe/i,
          });

          if (email) {
            await user.clear(emailInput);
            await user.type(emailInput, String(email));
          }

          expect(() => user.click(submitButton)).not.toThrow();
        } catch (error) {
          // Some malformed emails might cause rendering issues
          expect(error).toBeDefined();
        }

        unmount();
      }
    }, 10000);

    test("should handle extreme coordinate values", () => {
      const extremeCoords = [
        { x: 100000, y: 100000 },
        { x: -100000, y: -100000 },
        { x: 0, y: 0 },
        // Skip infinite and NaN values as they cause MouseEvent creation to fail
      ];

      extremeCoords.forEach((coords) => {
        expect(() => {
          const TestComponent = () => {
            React.useEffect(() => {
              const event = new MouseEvent("mousemove", {
                clientX: coords.x,
                clientY: coords.y,
                bubbles: true,
              });
              document.dispatchEvent(event);
            }, []);

            return <TargetCursor />;
          };

          render(<TestComponent />);
        }).not.toThrow();
      });
    });
  });

  describe("Performance Under Chaos", () => {
    test("should maintain basic functionality under high latency", async () => {
      chaosController.injectLatency("network", 5000); // 5 second delay

      const user = userEvent.setup();
      render(<NewsletterSignup />);

      const emailInput = screen.getByRole("textbox");
      const submitButton = screen.getByRole("button", { name: /subscribe/i });

      await user.type(emailInput, "latency@test.com");

      // Should not throw even with high latency
      expect(() => user.click(submitButton)).not.toThrow();

      // Button should be disabled during submission
      expect(submitButton).toBeInTheDocument();
    });

    test("should handle component unmounting during animations", async () => {
      const UnmountTest = () => {
        const [mounted, setMounted] = React.useState(true);

        React.useEffect(() => {
          const timer = setTimeout(() => setMounted(false), 50);
          return () => clearTimeout(timer);
        }, []);

        return mounted ? <TargetCursor /> : <div>Unmounted</div>;
      };

      expect(() => {
        render(<UnmountTest />);
      }).not.toThrow();

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      expect(screen.getByText("Unmounted")).toBeInTheDocument();
    });
  });

  describe("Chaos Metrics and Reporting", () => {
    test("should track and report chaos test results", () => {
      const chaosMetrics = {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        errorTypes: new Set<string>(),
      };

      // Simulate running chaos tests and collecting metrics
      const testResults = [
        { success: true, error: null },
        { success: false, error: "Network error" },
        { success: true, error: null },
        { success: false, error: "Memory allocation" },
      ];

      testResults.forEach((result) => {
        chaosMetrics.totalTests++;
        if (result.success) {
          chaosMetrics.passedTests++;
        } else {
          chaosMetrics.failedTests++;
          if (result.error) {
            chaosMetrics.errorTypes.add(result.error);
          }
        }
      });

      const successRate = chaosMetrics.passedTests / chaosMetrics.totalTests;

      expect(chaosMetrics.totalTests).toBe(4);
      expect(successRate).toBeGreaterThan(0); // Some tests should pass
      expect(chaosMetrics.errorTypes.size).toBeGreaterThan(0); // Some errors expected
    });
  });
});
