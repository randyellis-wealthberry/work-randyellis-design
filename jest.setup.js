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

// Mock Next.js server environment for CSP tests
if (typeof global.Request === "undefined") {
  global.Request = class MockRequest {
    constructor(input, init) {
      this.url = typeof input === "string" ? input : input.url;
      this.method = init?.method || "GET";
      this.headers = new Map(Object.entries(init?.headers || {}));
      this.body = init?.body;
    }
  };
}

if (typeof global.Response === "undefined") {
  global.Response = class MockResponse {
    constructor(body, init) {
      this.body = body;
      this.status = init?.status || 200;
      this.headers = new Map(Object.entries(init?.headers || {}));
      this.ok = (init?.status || 200) >= 200 && (init?.status || 200) < 300;
      this.statusText = init?.statusText || "OK";
      this.clone = jest.fn().mockReturnValue(this);
      this.text = jest.fn().mockResolvedValue(body || "");
      this.json = jest
        .fn()
        .mockResolvedValue(
          typeof body === "string" ? JSON.parse(body || "{}") : body,
        );
    }
  };
}

// Mock Web Crypto API for nonce generation
if (typeof global.crypto === "undefined") {
  global.crypto = {
    getRandomValues: (array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    },
    randomUUID: () => {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          const r = (Math.random() * 16) | 0;
          const v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        },
      );
    },
  };
}

// Mock CSP utils to return proper base64 nonces
jest.mock("@/lib/security/csp-utils", () => {
  const actual = jest.requireActual("@/lib/security/csp-utils");
  return {
    ...actual,
    generateCSPNonce: jest.fn(() => {
      // Generate a valid base64 string for tests
      const array = new Uint8Array(16);
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return Buffer.from(array).toString("base64");
    }),
  };
});

// Mock motion-primitives disclosure specifically
jest.mock("@/components/motion-primitives/disclosure", () => {
  const React = require("react");

  return {
    Disclosure: ({ children, open, onOpenChange }) => {
      return React.createElement(
        "div",
        { "data-testid": "disclosure" },
        children,
      );
    },
    DisclosureTrigger: ({ children }) => {
      return React.createElement(
        "div",
        { "data-testid": "disclosure-trigger" },
        children,
      );
    },
    DisclosureContent: ({ children }) => {
      return React.createElement(
        "div",
        { "data-testid": "disclosure-content" },
        children,
      );
    },
  };
});

// Mock Buffer for Node.js compatibility
if (typeof global.Buffer === "undefined") {
  global.Buffer = require("buffer").Buffer;
}

// Mock performance API
if (typeof global.performance === "undefined") {
  global.performance = {
    now: () => Date.now(),
  };
}

// Mock feature flags
jest.mock("@/hooks/use-feature-flag", () => ({
  useFeatureFlag: jest.fn((flag) => {
    // Default feature flags for tests
    const defaultFlags = {
      newsletterEnabled: true,
      performanceOptimizationsEnabled: true,
      pwafeaturesEnabled: true,
      securityHeadersEnabled: true,
      analyticsEnabled: false, // Disable analytics in tests
    };
    return defaultFlags[flag] || false;
  }),
  useFeatureFlags: jest.fn(() => ({
    newsletterEnabled: true,
    performanceOptimizationsEnabled: true,
    pwafeaturesEnabled: true,
    securityHeadersEnabled: true,
    analyticsEnabled: false,
  })),
}));

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
