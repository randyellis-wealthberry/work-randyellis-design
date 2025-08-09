import { render, screen } from "@testing-library/react";
import { ScrambleSectionTitle } from "../scramble-section-title";

describe("ScrambleSectionTitle", () => {
  describe("Type Safety Tests", () => {
    it("should render with string children", () => {
      render(
        <ScrambleSectionTitle className="test-class">
          Test Title
        </ScrambleSectionTitle>,
      );

      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("should render with template literal string", () => {
      const condition = true;
      const title = `${condition ? "Prefix " : ""}Main Title`;

      render(
        <ScrambleSectionTitle className="test-class">
          {title}
        </ScrambleSectionTitle>,
      );

      expect(screen.getByText("Prefix Main Title")).toBeInTheDocument();
    });

    it("should handle empty string conditions properly", () => {
      const condition = false;
      const title = `${condition ? "Prefix " : ""}Main Title`;

      render(
        <ScrambleSectionTitle className="test-class">
          {title}
        </ScrambleSectionTitle>,
      );

      expect(screen.getByText("Main Title")).toBeInTheDocument();
    });

    it("should render with emoji and special characters", () => {
      const title = "🧠 AI-Powered Performance Metrics";

      render(
        <ScrambleSectionTitle className="test-class">
          {title}
        </ScrambleSectionTitle>,
      );

      expect(
        screen.getByText("🧠 AI-Powered Performance Metrics"),
      ).toBeInTheDocument();
    });
  });

  describe("Component Props Tests", () => {
    it("should apply custom className", () => {
      render(
        <ScrambleSectionTitle className="custom-class">
          Test Title
        </ScrambleSectionTitle>,
      );

      const element = screen.getByText("Test Title");
      expect(element).toHaveClass("custom-class");
    });

    it("should default to h3 element", () => {
      render(<ScrambleSectionTitle>Test Title</ScrambleSectionTitle>);

      const element = screen.getByText("Test Title");
      expect(element.tagName).toBe("H3");
      expect(element).toHaveTextContent("Test Title");
    });

    it("should render as different heading levels", () => {
      render(<ScrambleSectionTitle as="h1">H1 Title</ScrambleSectionTitle>);

      const element = screen.getByText("H1 Title");
      expect(element.tagName).toBe("H1");
      expect(element).toHaveTextContent("H1 Title");
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string", () => {
      render(<ScrambleSectionTitle>{""}</ScrambleSectionTitle>);

      // Component should still render even with empty content - it will be an h3 with button role
      const element = document.querySelector("h3");
      expect(element).toBeInTheDocument();
    });

    it("should handle long strings", () => {
      const longTitle =
        "This is a very long title that might be used in some cases to test how the component handles extended content";

      render(<ScrambleSectionTitle>{longTitle}</ScrambleSectionTitle>);

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });
  });

  describe("TypeScript Error Prevention Tests", () => {
    // These tests verify that the patterns that would cause TypeScript errors
    // are properly handled when using template literals

    it("should handle conditional prefix pattern with template literal", () => {
      const personalityMode = true;
      const title = `${personalityMode ? "🧠 AI-Powered " : ""}Performance Metrics`;

      render(
        <ScrambleSectionTitle className="text-lg font-medium">
          {title}
        </ScrambleSectionTitle>,
      );

      expect(
        screen.getByText("🧠 AI-Powered Performance Metrics"),
      ).toBeInTheDocument();
    });

    it("should handle conditional prefix pattern without prefix", () => {
      const personalityMode = false;
      const title = `${personalityMode ? "🧠 AI-Powered " : ""}Performance Metrics`;

      render(
        <ScrambleSectionTitle className="text-lg font-medium">
          {title}
        </ScrambleSectionTitle>,
      );

      expect(screen.getByText("Performance Metrics")).toBeInTheDocument();
    });

    // This test documents the problematic pattern that would cause TypeScript errors
    // Note: This pattern should NOT be used - it's here for documentation
    it("should document the problematic JSX pattern (DO NOT USE)", () => {
      // This is the pattern that causes TypeScript errors:
      // {condition ? "prefix" : ""} Main Text
      //
      // It creates multiple children: ["prefix", " Main Text"] or ["", " Main Text"]
      // which violates the ScrambleSectionTitle's children: string type

      // Instead, always use template literals:
      const correctPattern = `${"prefix"} Main Text`;

      render(<ScrambleSectionTitle>{correctPattern}</ScrambleSectionTitle>);

      expect(screen.getByText("prefix Main Text")).toBeInTheDocument();
    });
  });
});
