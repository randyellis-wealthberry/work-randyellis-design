import React from "react";
import { render, screen } from "@testing-library/react";
import { TextGradientScroll } from "@/components/ui/text-gradient-scroll";

// Mock framer-motion is already set up in __mocks__/motion/react.js

describe("TextGradientScroll", () => {
  const defaultProps = {
    text: "Hello world test",
  };

  describe("Basic Rendering", () => {
    it("renders with default props", () => {
      render(<TextGradientScroll {...defaultProps} />);
      
      // Should render the component container
      const container = document.querySelector("p");
      expect(container).toBeInTheDocument();
      expect(container).toHaveClass("relative", "flex", "m-0", "flex-wrap");
    });

    it("applies custom className", () => {
      const customClass = "custom-test-class";
      render(<TextGradientScroll {...defaultProps} className={customClass} />);
      
      const container = document.querySelector("p");
      expect(container).toHaveClass(customClass);
    });

    it("splits text into words by default", () => {
      render(<TextGradientScroll text="one two three" />);
      
      // Should render word containers
      const container = document.querySelector("p");
      expect(container).toBeInTheDocument();
      
      // Should have word spans for each word
      const wordSpans = container?.querySelectorAll(".relative.me-2.mt-2");
      expect(wordSpans?.length).toBe(3); // "one", "two", "three"
    });
  });

  describe("Type Variations", () => {
    it("renders word-level animation when type is 'word'", () => {
      render(<TextGradientScroll text="hello world" type="word" />);
      
      // Should render words in spans (each word appears twice - hidden and visible)
      const helloElements = screen.getAllByText("hello");
      expect(helloElements.length).toBeGreaterThanOrEqual(1);
      
      const worldElements = screen.getAllByText("world");
      expect(worldElements.length).toBeGreaterThanOrEqual(1);
    });

    it("renders letter-level animation when type is 'letter'", () => {
      render(<TextGradientScroll text="hi test" type="letter" />);
      
      // Should render individual letters (not full words)
      const container = document.querySelector("p");
      expect(container).toBeInTheDocument();
      
      // Should have word containers for letter-based splitting
      const wordSpans = container?.querySelectorAll(".relative.me-2.mt-2");
      expect(wordSpans?.length).toBe(2); // "hi", "test"
    });
  });

  describe("Text Opacity Variations", () => {
    it("applies soft opacity class by default", () => {
      render(<TextGradientScroll text="test text" />);
      
      // Should have opacity-10 class for soft opacity in hidden spans
      const hiddenSpans = document.querySelectorAll(".opacity-10");
      expect(hiddenSpans.length).toBeGreaterThan(0);
    });

    it("applies none opacity when textOpacity is 'none'", () => {
      render(<TextGradientScroll text="test text" textOpacity="none" />);
      
      // Should have opacity-0 class for none opacity
      const hiddenSpans = document.querySelectorAll(".opacity-0");
      expect(hiddenSpans.length).toBeGreaterThan(0);
    });

    it("applies medium opacity when textOpacity is 'medium'", () => {
      render(<TextGradientScroll text="test text" textOpacity="medium" />);
      
      // Should have opacity-30 class for medium opacity  
      const hiddenSpans = document.querySelectorAll(".opacity-30");
      expect(hiddenSpans.length).toBeGreaterThan(0);
    });
  });

  describe("Animation Structure", () => {
    it("creates motion spans with proper data attributes", () => {
      render(<TextGradientScroll text="animated text" />);
      
      // Motion components should have data attributes from our mock
      const motionSpans = document.querySelectorAll('[data-motion-component="span"]');
      expect(motionSpans.length).toBeGreaterThan(0);
    });

    it("applies proper container classes", () => {
      render(<TextGradientScroll text="container test" />);
      
      const container = document.querySelector("p");
      expect(container).toHaveClass("relative", "flex", "m-0", "flex-wrap");
    });
  });

  describe("Accessibility", () => {
    it("maintains semantic structure", () => {
      render(<TextGradientScroll text="accessible content" />);
      
      // Should render as a paragraph element
      const paragraph = document.querySelector("p");
      expect(paragraph).toBeInTheDocument();
      expect(paragraph?.tagName).toBe("P");
    });

    it("preserves text content for screen readers", () => {
      render(<TextGradientScroll text="screen reader content" />);
      
      // Text should be available in the DOM structure
      const container = document.querySelector("p");
      expect(container).toBeInTheDocument();
      
      // Individual letters should be present in spans
      const letterSpans = container?.querySelectorAll("span");
      expect(letterSpans?.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty text gracefully", () => {
      render(<TextGradientScroll text="" />);
      
      // Should render without crashing
      const container = document.querySelector("p");
      expect(container).toBeInTheDocument();
    });

    it("handles single word text", () => {
      render(<TextGradientScroll text="single" />);
      
      const container = document.querySelector("p");
      expect(container).toBeInTheDocument();
      
      // Should have one word span
      const wordSpans = container?.querySelectorAll(".relative.me-2.mt-2");
      expect(wordSpans?.length).toBe(1);
    });

    it("handles text with multiple spaces", () => {
      render(<TextGradientScroll text="multiple    spaces   here" />);
      
      const container = document.querySelector("p");
      expect(container).toBeInTheDocument();
      
      // Should handle multiple spaces by creating empty word spans
      const wordSpans = container?.querySelectorAll(".relative.me-2.mt-2");
      expect(wordSpans?.length).toBeGreaterThan(3); // Will include empty spans for spaces
    });
  });

  describe("Performance", () => {
    it("renders large text efficiently", () => {
      const largeText = Array.from({ length: 50 }, (_, i) => `word${i}`).join(" ");
      
      const startTime = performance.now();
      render(<TextGradientScroll text={largeText} />);
      const renderTime = performance.now() - startTime;
      
      // Should render within reasonable time (less than 3000ms for large text)
      expect(renderTime).toBeLessThan(3000);
      
      // Should render container with all word spans
      const container = document.querySelector("p");
      expect(container).toBeInTheDocument();
      
      const wordSpans = container?.querySelectorAll(".relative.me-2.mt-2");
      expect(wordSpans?.length).toBe(50);
    });
  });
});