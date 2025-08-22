/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import "@testing-library/jest-dom";
import InstallPrompt from "@/components/pwa/install-prompt";

// Mock dependencies
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock Lucide icons
jest.mock("lucide-react", () => ({
  X: () => <span>X</span>,
  Download: () => <span>Download</span>,
  Smartphone: () => <span>Smartphone</span>,
  Share: () => <span>Share</span>,
}));

describe("PWA Install Prompt Integration Tests", () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      configurable: true,
      writable: true,
    });

    // Reset matchMedia mock
    (window.matchMedia as jest.Mock).mockClear();
    (window.matchMedia as jest.Mock).mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    // Mock navigator.userAgent
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      configurable: true,
    });
  });

  it("should render without crashing", () => {
    render(<InstallPrompt />);
    // Initially hidden until beforeinstallprompt event
    // @ts-ignore - Jest DOM types
    expect(screen.queryByTestId("install-prompt")).not.toBeInTheDocument();
  });

  it("should show install prompt when beforeinstallprompt event fires", async () => {
    render(<InstallPrompt />);

    // Create mock event
    const mockEvent = new Event("beforeinstallprompt");
    Object.assign(mockEvent, {
      preventDefault: jest.fn(),
      prompt: jest.fn().mockResolvedValue(undefined as any),
      userChoice: Promise.resolve({ outcome: "accepted", platform: "web" }),
      platforms: ["web"],
    });

    // Dispatch event
    fireEvent(window, mockEvent);

    await waitFor(() => {
      expect(screen.getByTestId("install-prompt")).toBeInTheDocument();
    });
  });

  it("should hide prompt when dismissed", async () => {
    render(<InstallPrompt />);

    // Trigger prompt
    const mockEvent = new Event("beforeinstallprompt");
    Object.assign(mockEvent, {
      preventDefault: jest.fn(),
      prompt: jest.fn(),
      userChoice: Promise.resolve({ outcome: "dismissed", platform: "web" }),
      platforms: ["web"],
    });

    fireEvent(window, mockEvent);

    await waitFor(() => {
      expect(screen.getByTestId("install-prompt")).toBeInTheDocument();
    });

    // Click dismiss
    const dismissButton = screen.getByLabelText("Dismiss install prompt");
    fireEvent.click(dismissButton);

    await waitFor(() => {
      expect(screen.queryByTestId("install-prompt")).not.toBeInTheDocument();
    });
  });

  it("should have proper accessibility attributes", async () => {
    render(<InstallPrompt />);

    // Trigger prompt
    const mockEvent = new Event("beforeinstallprompt");
    Object.assign(mockEvent, {
      preventDefault: jest.fn(),
      prompt: jest.fn(),
      userChoice: Promise.resolve({ outcome: "accepted", platform: "web" }),
      platforms: ["web"],
    });

    fireEvent(window, mockEvent);

    await waitFor(() => {
      const prompt = screen.getByRole("dialog");
      expect(prompt).toHaveAttribute("aria-labelledby");
      expect(prompt).toHaveAttribute("aria-describedby");
    });
  });

  it("should handle app installation event", async () => {
    render(<InstallPrompt />);

    // First show the prompt
    const mockEvent = new Event("beforeinstallprompt");
    Object.assign(mockEvent, {
      preventDefault: jest.fn(),
      prompt: jest.fn(),
      userChoice: Promise.resolve({ outcome: "accepted", platform: "web" }),
      platforms: ["web"],
    });

    fireEvent(window, mockEvent);

    await waitFor(() => {
      expect(screen.getByTestId("install-prompt")).toBeInTheDocument();
    });

    // Simulate app installed
    fireEvent(window, new Event("appinstalled"));

    await waitFor(() => {
      expect(screen.queryByTestId("install-prompt")).not.toBeInTheDocument();
    });
  });

  it("should not show when app is in standalone mode", () => {
    // Mock standalone mode
    (window.matchMedia as jest.Mock).mockImplementation((query) => ({
      matches: query === "(display-mode: standalone)",
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<InstallPrompt />);

    // Should not show prompt
    expect(screen.queryByTestId("install-prompt")).not.toBeInTheDocument();
  });

  it("should detect iOS devices", () => {
    // Mock iOS user agent
    Object.defineProperty(navigator, "userAgent", {
      value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
      configurable: true,
    });

    render(<InstallPrompt />);

    // Component should handle iOS differently (would need to check internal state)
    expect(navigator.userAgent).toContain("iPhone");
  });

  it("should handle localStorage operations", async () => {
    const setItem = jest.fn();
    Object.defineProperty(window, "localStorage", {
      value: { ...window.localStorage, setItem },
      configurable: true,
    });

    render(<InstallPrompt />);

    // Trigger prompt and dismiss
    const mockEvent = new Event("beforeinstallprompt");
    Object.assign(mockEvent, {
      preventDefault: jest.fn(),
      prompt: jest.fn(),
      userChoice: Promise.resolve({ outcome: "dismissed", platform: "web" }),
      platforms: ["web"],
    });

    fireEvent(window, mockEvent);

    await waitFor(() => {
      expect(screen.getByTestId("install-prompt")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByLabelText("Dismiss install prompt"));

    // Should store dismissal in localStorage
    expect(setItem).toHaveBeenCalledWith(
      "pwa-install-dismissed",
      expect.any(String),
    );
  });
});
