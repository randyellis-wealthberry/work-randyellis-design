import { render, screen } from "@testing-library/react";
import { ScrambleSectionTitle } from "../scramble-section-title";

/**
 * Tests for ScrambleSectionTitle usage patterns that were causing TypeScript errors
 * This test suite focuses on preventing the specific string[] vs string issue
 */
describe("ScrambleSectionTitle Usage Patterns", () => {
  describe("Template Literal Patterns (CORRECT)", () => {
    it("should handle conditional prefix with template literal", () => {
      // This is the CORRECT pattern that should be used
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

    it("should handle conditional prefix without prefix", () => {
      const personalityMode = false;
      const title = `${personalityMode ? "🧠 AI-Powered " : ""}Performance Metrics`;

      render(
        <ScrambleSectionTitle className="text-lg font-medium">
          {title}
        </ScrambleSectionTitle>,
      );

      expect(screen.getByText("Performance Metrics")).toBeInTheDocument();
    });

    it("should handle complex conditional patterns", () => {
      const mode = "ai";
      const feature = "Advanced";
      const title = `${mode === "ai" ? "🤖 " : ""}${feature} Features`;

      render(<ScrambleSectionTitle>{title}</ScrambleSectionTitle>);

      expect(screen.getByText("🤖 Advanced Features")).toBeInTheDocument();
    });
  });

  describe("TypeScript Error Prevention", () => {
    // These tests document and prevent the patterns that cause TypeScript errors

    it("should show why adjacent JSX expressions create string arrays", () => {
      // This test shows the problematic pattern that creates string[] instead of string
      // DO NOT USE THIS PATTERN in actual code:
      // <ScrambleSectionTitle>
      //   {condition ? "prefix" : ""} Suffix
      // </ScrambleSectionTitle>

      // The above creates children as: ["prefix", " Suffix"] or ["", " Suffix"]
      // which violates the children: string type

      // Instead, always use template literals:
      const condition = true;
      const correctTitle = `${condition ? "prefix" : ""} Suffix`;

      render(<ScrambleSectionTitle>{correctTitle}</ScrambleSectionTitle>);

      expect(screen.getByText("prefix Suffix")).toBeInTheDocument();
    });

    it("should handle multiple conditional segments correctly", () => {
      const isAI = true;
      const isPremium = false;
      const title = `${isAI ? "🧠 AI " : ""}${isPremium ? "Premium " : ""}Dashboard`;

      render(<ScrambleSectionTitle>{title}</ScrambleSectionTitle>);

      expect(screen.getByText("🧠 AI Dashboard")).toBeInTheDocument();
    });
  });

  describe("Real-world Echo Project Patterns", () => {
    it("should replicate the exact Echo Performance Metrics pattern", () => {
      // This replicates the exact pattern from echo-client.tsx line 1086
      const personalityMode = true;

      render(
        <ScrambleSectionTitle className="text-lg font-medium">
          {`${personalityMode ? "🧠 AI-Powered " : ""}Performance Metrics`}
        </ScrambleSectionTitle>,
      );

      expect(
        screen.getByText("🧠 AI-Powered Performance Metrics"),
      ).toBeInTheDocument();
    });

    it("should handle all static titles from Echo component", () => {
      const staticTitles = [
        "AI-Powered Features",
        "The Innovation Journey",
        "AI Development Insights",
        "User Experience Impact",
        "Technical Resources & Documentation",
        "Technologies & Architecture",
        "Design Leadership Reflection",
      ];

      staticTitles.forEach((title) => {
        render(
          <ScrambleSectionTitle className="text-lg font-medium">
            {title}
          </ScrambleSectionTitle>,
        );

        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases and Robustness", () => {
    it("should handle empty conditional segments", () => {
      const showPrefix = false;
      const showSuffix = false;
      const title = `${showPrefix ? "Prefix " : ""}Main${showSuffix ? " Suffix" : ""}`;

      render(<ScrambleSectionTitle>{title}</ScrambleSectionTitle>);

      expect(screen.getByText("Main")).toBeInTheDocument();
    });

    it("should handle whitespace in conditionals correctly", () => {
      const mode = "test";
      const title = `${mode ? `${mode} ` : ""}Content`;

      render(<ScrambleSectionTitle>{title}</ScrambleSectionTitle>);

      expect(screen.getByText("test Content")).toBeInTheDocument();
    });
  });
});
