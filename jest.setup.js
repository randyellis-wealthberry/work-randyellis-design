import "@testing-library/jest-dom";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = jest
  .fn()
  .mockImplementation((callback, options) => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    root: null,
    rootMargin: "",
    thresholds: [],
  }));

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn().mockImplementation((cb) => {
  return setTimeout(cb, 0);
});

global.cancelAnimationFrame = jest.fn().mockImplementation((id) => {
  clearTimeout(id);
});

// Ensure timer functions are available globally - force override for Jest environment
global.setInterval = jest.fn((callback, delay) => {
  return setTimeout(callback, delay);
});

global.clearInterval = jest.fn((intervalId) => {
  clearTimeout(intervalId);
});

// Also ensure they're available on the window object in jsdom
if (typeof window !== "undefined") {
  window.setInterval = global.setInterval;
  window.clearInterval = global.clearInterval;
}

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock getComputedStyle for motion preferences
Object.defineProperty(window, "getComputedStyle", {
  value: jest.fn(() => ({
    getPropertyValue: jest.fn(() => "no-preference"),
  })),
  writable: true,
});

// Mock performance.now for motion library
Object.defineProperty(window, "performance", {
  value: {
    now: jest.fn(() => Date.now()),
  },
  writable: true,
});

// Manual mock for motion/react
jest.mock("motion/react", () => {
  const React = require("react");

  const mockSpring = {
    set: jest.fn(),
    get: jest.fn(() => 0),
  };

  const mockUseSpring = jest.fn(() => mockSpring);
  const mockUseTransform = jest.fn((spring, transform) => {
    const value = typeof spring === "number" ? spring : 0;
    return transform(value);
  });

  const mockMotion = {
    span: React.forwardRef(({ children, ...props }, ref) =>
      React.createElement("span", { ...props, ref }, children),
    ),
    div: React.forwardRef(({ children, ...props }, ref) =>
      React.createElement("div", { ...props, ref }, children),
    ),
  };

  return {
    motion: mockMotion,
    useSpring: mockUseSpring,
    useTransform: mockUseTransform,
    useMotionValue: jest.fn(() => mockSpring),
    AnimatePresence: ({ children }) => children,
  };
});
