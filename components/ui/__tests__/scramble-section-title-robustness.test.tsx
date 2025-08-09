import { render, screen } from "@testing-library/react";
import { ScrambleSectionTitle } from "../scramble-section-title";
import React from "react";

/**
 * Tests for the enhanced ScrambleSectionTitle with ReactNode support
 * These tests verify the robustness improvements that prevent TypeScript errors
 */
describe("ScrambleSectionTitle Robustness", () => {
  describe("String Array Handling (Previously Caused TypeScript Errors)", () => {
    it("should handle string arrays gracefully", () => {
      // This simulates the JSX pattern that previously caused TypeScript errors:
      // {condition ? "prefix" : ""} Main Text
      // React converts this to children: ["prefix", " Main Text"]

      const childrenArray = ["🧠 AI-Powered", " Performance Metrics"];

      render(<ScrambleSectionTitle>{childrenArray}</ScrambleSectionTitle>);

      expect(
        screen.getByText("🧠 AI-Powered Performance Metrics"),
      ).toBeInTheDocument();
    });

    it("should handle empty string in array", () => {
      const childrenArray = ["", "Main Title"];

      render(<ScrambleSectionTitle>{childrenArray}</ScrambleSectionTitle>);

      expect(screen.getByText("Main Title")).toBeInTheDocument();
    });

    it("should handle multiple segments in array", () => {
      const childrenArray = ["🧠 ", "AI-Powered", " ", "Features"];

      render(<ScrambleSectionTitle>{childrenArray}</ScrambleSectionTitle>);

      expect(screen.getByText("🧠 AI-Powered Features")).toBeInTheDocument();
    });
  });

  describe("ReactNode Support", () => {
    it("should handle null children", () => {
      render(<ScrambleSectionTitle>{null}</ScrambleSectionTitle>);

      // Should render without crashing, with empty text
      const element = document.querySelector("h3");
      expect(element).toBeInTheDocument();
      expect(element?.textContent).toBe("");
    });

    it("should handle undefined children", () => {
      render(<ScrambleSectionTitle>{undefined}</ScrambleSectionTitle>);

      const element = document.querySelector("h3");
      expect(element).toBeInTheDocument();
      expect(element?.textContent).toBe("");
    });

    it("should handle number children", () => {
      render(<ScrambleSectionTitle>{42}</ScrambleSectionTitle>);

      expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("should handle boolean children", () => {
      render(<ScrambleSectionTitle>{true}</ScrambleSectionTitle>);

      expect(screen.getByText("true")).toBeInTheDocument();
    });
  });

  describe("Edge Cases from Real Usage", () => {
    it("should handle the exact problematic JSX pattern", () => {
      // This simulates what happens when someone writes:
      // <ScrambleSectionTitle>{condition ? "prefix" : ""} Main Text</ScrambleSectionTitle>
      // React creates children as an array

      const condition = true;
      const problematicChildren = [
        condition ? "🧠 AI-Powered" : "",
        " Performance Metrics",
      ];

      render(
        <ScrambleSectionTitle className="text-lg font-medium">
          {problematicChildren}
        </ScrambleSectionTitle>,
      );

      expect(
        screen.getByText("🧠 AI-Powered Performance Metrics"),
      ).toBeInTheDocument();
    });

    it("should handle complex nested conditional logic", () => {
      const isAI = true;
      const isPremium = true;
      const isActive = false;

      const complexChildren = [
        isAI ? "🧠 " : "",
        isPremium ? "Premium " : "",
        isActive ? "Active " : "",
        "Dashboard",
      ];

      render(<ScrambleSectionTitle>{complexChildren}</ScrambleSectionTitle>);

      expect(screen.getByText("🧠 Premium Dashboard")).toBeInTheDocument();
    });

    it("should preserve whitespace correctly in arrays", () => {
      const parts = ["Section", " ", "Title", " ", "Text"];

      render(<ScrambleSectionTitle>{parts}</ScrambleSectionTitle>);

      expect(screen.getByText("Section Title Text")).toBeInTheDocument();
    });
  });

  describe("Backwards Compatibility", () => {
    it("should still work with simple string children", () => {
      render(<ScrambleSectionTitle>Simple Title</ScrambleSectionTitle>);

      expect(screen.getByText("Simple Title")).toBeInTheDocument();
    });

    it("should still work with template literals", () => {
      const prefix = "Dynamic";
      const suffix = "Title";

      render(
        <ScrambleSectionTitle>{`${prefix} ${suffix}`}</ScrambleSectionTitle>,
      );

      expect(screen.getByText("Dynamic Title")).toBeInTheDocument();
    });

    it("should maintain all original props functionality", () => {
      render(
        <ScrambleSectionTitle className="custom-class" as="h1">
          Test Title
        </ScrambleSectionTitle>,
      );

      const element = screen.getByText("Test Title");
      expect(element.tagName).toBe("H1");
      expect(element).toHaveClass("custom-class");
    });
  });

  describe("Performance and Memory", () => {
    it("should handle large arrays efficiently", () => {
      const largeArray = new Array(5).fill(0).map((_, i) => `Part${i}`);

      render(<ScrambleSectionTitle>{largeArray}</ScrambleSectionTitle>);

      const expectedText = largeArray.join("");
      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });

    it("should handle empty arrays", () => {
      render(<ScrambleSectionTitle>{[]}</ScrambleSectionTitle>);

      const element = document.querySelector("h3");
      expect(element).toBeInTheDocument();
      expect(element?.textContent).toBe("");
    });
  });
});
