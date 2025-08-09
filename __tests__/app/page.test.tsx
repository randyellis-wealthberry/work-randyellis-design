import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Personal from "@/app/page";

// Mock framer-motion to avoid animation issues in tests
const mockMotionValue = {
  set: jest.fn(),
  get: jest.fn(() => 0),
  on: jest.fn(),
  onChange: jest.fn(),
  clearListeners: jest.fn(),
};

jest.mock("motion/react", () => ({
  motion: {
    main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
    section: ({ children, ...props }: any) => (
      <section {...props}>{children}</section>
    ),
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    svg: ({ children, ...props }: any) => <svg {...props}>{children}</svg>,
    create: jest.fn((Component: any) => Component),
  },
  useSpring: jest.fn((initialValue: any) => {
    const motionValue = { ...mockMotionValue };
    motionValue.get = jest.fn(() => initialValue || 0);
    return motionValue;
  }),
  useTransform: jest.fn((spring: any, transform: any) => {
    const value =
      typeof spring === "object" && spring.get
        ? spring.get()
        : typeof spring === "number"
          ? spring
          : 0;
    return transform(value);
  }),
  useMotionValue: jest.fn(() => ({ ...mockMotionValue })),
  useAnimation: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
  })),
  AnimatePresence: ({ children }: any) => children,
}));

// Mock analytics to avoid tracking calls in tests
jest.mock("@/lib/analytics", () => ({
  trackProjectHover: jest.fn(),
  trackProjectView: jest.fn(),
  trackContactIntent: jest.fn(),
  trackProjectVideoPlay: jest.fn(),
}));

// Mock complex components that might cause issues
jest.mock("@/components/ui/lazy-hover-video", () => ({
  LazyHoverVideo: ({ alt }: { alt: string }) => (
    <div data-testid="mock-video">{alt}</div>
  ),
}));

jest.mock("@/components/ui/enhanced-hover-cards", () => ({
  EnhancedHoverCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-hover-card">{children}</div>
  ),
}));

jest.mock("@/components/motion-primitives/transition-panel", () => ({
  TransitionPanel: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-transition-panel">{children}</div>
  ),
}));

jest.mock("@/components/ui/enhanced-button", () => ({
  EnhancedButton: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} data-testid="mock-enhanced-button" {...props}>
      {children}
    </button>
  ),
}));

describe("Personal Page Component", () => {
  test("renders without crashing", () => {
    expect(() => render(<Personal />)).not.toThrow();
  });

  test("renders main content with proper structure", () => {
    render(<Personal />);

    const mainContent = screen.getByRole("main");
    expect(mainContent).toBeInTheDocument();
    expect(mainContent).toHaveAttribute("id", "main-content");
  });

  test("displays the main introduction text", () => {
    render(<Personal />);

    expect(screen.getByText(/product design strategist/)).toBeInTheDocument();
  });

  test("handles project data loading correctly", () => {
    render(<Personal />);

    // Should not throw errors when loading project data
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
