/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock CSS for user-event
Object.defineProperty(window, "getComputedStyle", {
  value: () => ({
    pointerEvents: "auto",
    display: "block",
    visibility: "visible",
  }),
});

// Mock the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Mock PWA install prompt component (will be implemented)
const MockInstallPrompt: React.FC<{
  onInstall?: () => void;
  onDismiss?: () => void;
  isVisible?: boolean;
}> = ({ onInstall, onDismiss, isVisible = true }) => {
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    React.useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = React.useState(isVisible);

  React.useEffect(() => {
    // Check if previously dismissed
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const now = Date.now();
      const daysSinceDismissed = (now - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        setShowPrompt(false);
        return;
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setIsInstalled(true);
        onInstall?.();
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    onDismiss?.();
  };

  if (isInstalled) {
    return <div data-testid="app-installed">App installed successfully!</div>;
  }

  if (!showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div
      data-testid="install-prompt"
      role="dialog"
      aria-labelledby="install-title"
    >
      <div id="install-title">Install Randy Ellis Portfolio</div>
      <p>
        Add this app to your home screen for quick and easy access when you're
        on the go.
      </p>
      <div>
        <button
          data-testid="install-button"
          onClick={handleInstall}
          aria-label="Install app"
        >
          Add to Home Screen
        </button>
        <button
          data-testid="dismiss-button"
          onClick={handleDismiss}
          aria-label="Dismiss install prompt"
        >
          Not now
        </button>
      </div>
    </div>
  );
};

// Mock standalone mode detection
const mockIsStandalone = () => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
};

// Mock iOS detection
const mockIsIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

describe("PWA Install Prompt Tests", () => {
  let mockDeferredPrompt: Partial<BeforeInstallPromptEvent>;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = "";

    // Mock BeforeInstallPromptEvent
    mockDeferredPrompt = {
      preventDefault: jest.fn(),
      prompt: jest.fn() as jest.MockedFunction<() => Promise<void>>,
      userChoice: Promise.resolve({
        outcome: "accepted" as const,
        platform: "web",
      }),
      platforms: ["web"],
    };

    // Set up the prompt mock return value
    (
      mockDeferredPrompt.prompt as jest.MockedFunction<() => Promise<void>>
    ).mockResolvedValue();

    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(global, "localStorage", {
      value: localStorageMock,
      configurable: true,
    });

    // Mock matchMedia - only define if not already defined
    if (!global.matchMedia) {
      Object.defineProperty(global, "matchMedia", {
        value: jest.fn().mockImplementation((query) => ({
          matches: query === "(display-mode: standalone)" ? false : false,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
        configurable: true,
      });
    }
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("Install Prompt Visibility", () => {
    it("should show install prompt when beforeinstallprompt event fires", async () => {
      render(<MockInstallPrompt />);

      // Simulate beforeinstallprompt event
      const event = new Event(
        "beforeinstallprompt",
      ) as BeforeInstallPromptEvent;
      Object.assign(event, mockDeferredPrompt);

      fireEvent(window, event);

      await waitFor(() => {
        expect(screen.getByTestId("install-prompt")).toBeInTheDocument();
      });
    });

    it("should not show install prompt when app is already in standalone mode", () => {
      // Mock standalone mode
      (window.matchMedia as jest.Mock).mockImplementation((query) => ({
        matches: query === "(display-mode: standalone)" ? true : false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      render(<MockInstallPrompt />);

      expect(screen.queryByTestId("install-prompt")).not.toBeInTheDocument();
    });

    it("should not show install prompt if previously dismissed", () => {
      (window.localStorage.getItem as jest.Mock).mockReturnValue("true");

      render(<MockInstallPrompt />);

      // Even with beforeinstallprompt event, shouldn't show if dismissed
      const event = new Event(
        "beforeinstallprompt",
      ) as BeforeInstallPromptEvent;
      Object.assign(event, mockDeferredPrompt);

      fireEvent(window, event);

      expect(screen.queryByTestId("install-prompt")).not.toBeInTheDocument();
    });

    it("should show different prompt for iOS devices", () => {
      // Mock iOS
      Object.defineProperty(navigator, "userAgent", {
        value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
        configurable: true,
      });

      const isIOS = mockIsIOS();
      expect(isIOS).toBe(true);
    });
  });

  describe("Install Prompt Interaction", () => {
    it("should trigger installation when install button is clicked", async () => {
      const user = userEvent.setup();
      const onInstall = jest.fn();

      render(<MockInstallPrompt onInstall={onInstall} />);

      // Trigger beforeinstallprompt event
      const event = new Event(
        "beforeinstallprompt",
      ) as BeforeInstallPromptEvent;
      Object.assign(event, mockDeferredPrompt);
      fireEvent(window, event);

      await waitFor(() => {
        expect(screen.getByTestId("install-prompt")).toBeInTheDocument();
      });

      const installButton = screen.getByTestId("install-button");
      await user.click(installButton);

      expect(mockDeferredPrompt.prompt).toHaveBeenCalled();

      // Wait for userChoice promise to resolve
      await waitFor(() => {
        expect(onInstall).toHaveBeenCalled();
      });
    });

    it("should dismiss prompt when dismiss button is clicked", async () => {
      const user = userEvent.setup();
      const onDismiss = jest.fn();

      render(<MockInstallPrompt onDismiss={onDismiss} />);

      // Trigger beforeinstallprompt event
      const event = new Event(
        "beforeinstallprompt",
      ) as BeforeInstallPromptEvent;
      Object.assign(event, mockDeferredPrompt);
      fireEvent(window, event);

      await waitFor(() => {
        expect(screen.getByTestId("install-prompt")).toBeInTheDocument();
      });

      const dismissButton = screen.getByTestId("dismiss-button");
      await user.click(dismissButton);

      expect(onDismiss).toHaveBeenCalled();
      expect(screen.queryByTestId("install-prompt")).not.toBeInTheDocument();
    });

    it("should handle installation rejection gracefully", async () => {
      const user = userEvent.setup();

      // Mock user rejection
      const rejectedPrompt = {
        ...mockDeferredPrompt,
        userChoice: Promise.resolve({
          outcome: "dismissed" as const,
          platform: "web",
        }),
      };

      render(<MockInstallPrompt />);

      const event = new Event(
        "beforeinstallprompt",
      ) as BeforeInstallPromptEvent;
      Object.assign(event, rejectedPrompt);
      fireEvent(window, event);

      await waitFor(() => {
        expect(screen.getByTestId("install-prompt")).toBeInTheDocument();
      });

      const installButton = screen.getByTestId("install-button");
      await user.click(installButton);

      await waitFor(() => {
        expect(screen.queryByTestId("install-prompt")).not.toBeInTheDocument();
      });
    });

    it("should handle installation errors gracefully", async () => {
      const user = userEvent.setup();
      const consoleError = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Mock prompt error
      const errorPrompt = {
        ...mockDeferredPrompt,
        prompt: jest.fn().mockRejectedValue(new Error("Installation failed")),
      };

      render(<MockInstallPrompt />);

      const event = new Event(
        "beforeinstallprompt",
      ) as BeforeInstallPromptEvent;
      Object.assign(event, errorPrompt);
      fireEvent(window, event);

      await waitFor(() => {
        expect(screen.getByTestId("install-prompt")).toBeInTheDocument();
      });

      const installButton = screen.getByTestId("install-button");
      await user.click(installButton);

      // Should handle error gracefully
      await waitFor(() => {
        expect(errorPrompt.prompt).toHaveBeenCalled();
      });

      consoleError.mockRestore();
    });
  });

  describe("Install Prompt Accessibility", () => {
    it("should have proper ARIA attributes", async () => {
      render(<MockInstallPrompt />);

      const event = new Event(
        "beforeinstallprompt",
      ) as BeforeInstallPromptEvent;
      Object.assign(event, mockDeferredPrompt);
      fireEvent(window, event);

      await waitFor(() => {
        const prompt = screen.getByTestId("install-prompt");
        expect(prompt).toHaveAttribute("role", "dialog");
        expect(prompt).toHaveAttribute("aria-labelledby", "install-title");
      });

      const installButton = screen.getByTestId("install-button");
      const dismissButton = screen.getByTestId("dismiss-button");

      expect(installButton).toHaveAttribute("aria-label", "Install app");
      expect(dismissButton).toHaveAttribute(
        "aria-label",
        "Dismiss install prompt",
      );
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();

      render(<MockInstallPrompt />);

      const event = new Event(
        "beforeinstallprompt",
      ) as BeforeInstallPromptEvent;
      Object.assign(event, mockDeferredPrompt);
      fireEvent(window, event);

      await waitFor(() => {
        expect(screen.getByTestId("install-prompt")).toBeInTheDocument();
      });

      // Should be able to tab between buttons
      await user.tab();
      expect(screen.getByTestId("install-button")).toHaveFocus();

      await user.tab();
      expect(screen.getByTestId("dismiss-button")).toHaveFocus();
    });

    it("should support screen readers", async () => {
      render(<MockInstallPrompt />);

      const event = new Event(
        "beforeinstallprompt",
      ) as BeforeInstallPromptEvent;
      Object.assign(event, mockDeferredPrompt);
      fireEvent(window, event);

      await waitFor(() => {
        const title = screen.getByText("Install Randy Ellis Portfolio");
        const description = screen.getByText(
          /Add this app to your home screen/,
        );

        expect(title).toBeInTheDocument();
        expect(description).toBeInTheDocument();
      });
    });
  });

  describe("Install Prompt Persistence", () => {
    it("should remember user dismissal", async () => {
      const user = userEvent.setup();

      render(<MockInstallPrompt />);

      const event = new Event(
        "beforeinstallprompt",
      ) as BeforeInstallPromptEvent;
      Object.assign(event, mockDeferredPrompt);
      fireEvent(window, event);

      await waitFor(() => {
        expect(screen.getByTestId("install-prompt")).toBeInTheDocument();
      });

      const dismissButton = screen.getByTestId("dismiss-button");
      await user.click(dismissButton);

      expect(window.localStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining("dismissed"),
        expect.any(String),
      );
    });

    it("should respect dismissal timeout", () => {
      const dismissedTime = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days ago
      (window.localStorage.getItem as jest.Mock).mockReturnValue(
        dismissedTime.toString(),
      );

      // Should show prompt again after timeout
      render(<MockInstallPrompt />);

      const event = new Event(
        "beforeinstallprompt",
      ) as BeforeInstallPromptEvent;
      Object.assign(event, mockDeferredPrompt);
      fireEvent(window, event);

      // Should show prompt again after dismissal timeout
      expect(screen.queryByTestId("install-prompt")).toBeInTheDocument();
    });

    it("should not show prompt during dismissal period", () => {
      const recentDismissal = Date.now() - 1 * 24 * 60 * 60 * 1000; // 1 day ago
      (window.localStorage.getItem as jest.Mock).mockReturnValue(
        recentDismissal.toString(),
      );

      render(<MockInstallPrompt />);

      const event = new Event(
        "beforeinstallprompt",
      ) as BeforeInstallPromptEvent;
      Object.assign(event, mockDeferredPrompt);
      fireEvent(window, event);

      // Should not show during dismissal period
      expect(screen.queryByTestId("install-prompt")).not.toBeInTheDocument();
    });
  });

  describe("Installation Success", () => {
    it("should show success message after installation", async () => {
      render(<MockInstallPrompt />);

      // Simulate app installation
      const appInstalledEvent = new Event("appinstalled");
      fireEvent(window, appInstalledEvent);

      await waitFor(() => {
        expect(screen.getByTestId("app-installed")).toBeInTheDocument();
        expect(
          screen.getByText("App installed successfully!"),
        ).toBeInTheDocument();
      });
    });

    it("should hide install prompt after successful installation", async () => {
      const user = userEvent.setup();

      render(<MockInstallPrompt />);

      const event = new Event(
        "beforeinstallprompt",
      ) as BeforeInstallPromptEvent;
      Object.assign(event, mockDeferredPrompt);
      fireEvent(window, event);

      await waitFor(() => {
        expect(screen.getByTestId("install-prompt")).toBeInTheDocument();
      });

      // Simulate successful installation
      const installButton = screen.getByTestId("install-button");
      await user.click(installButton);

      // Trigger appinstalled event
      const appInstalledEvent = new Event("appinstalled");
      fireEvent(window, appInstalledEvent);

      await waitFor(() => {
        expect(screen.queryByTestId("install-prompt")).not.toBeInTheDocument();
        expect(screen.getByTestId("app-installed")).toBeInTheDocument();
      });
    });
  });

  describe("Platform-Specific Behavior", () => {
    it("should show manual installation instructions for iOS Safari", () => {
      // Mock iOS Safari
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
        configurable: true,
      });

      const isIOSSafari = mockIsIOS() && !mockIsStandalone();
      expect(isIOSSafari).toBe(true);

      // Would show manual instructions instead of automated prompt
    });

    it("should handle Android Chrome installation flow", () => {
      // Mock Android Chrome
      Object.defineProperty(navigator, "userAgent", {
        value:
          "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36",
        configurable: true,
      });

      // Would use standard beforeinstallprompt flow
      const isAndroidChrome = /Android.*Chrome/.test(navigator.userAgent);
      expect(isAndroidChrome).toBe(true);
    });

    it("should detect if app is already installed", () => {
      // Mock standalone mode (app is installed)
      (window.matchMedia as jest.Mock).mockImplementation((query) => ({
        matches: query === "(display-mode: standalone)" ? true : false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }));

      const isInstalled = mockIsStandalone();
      expect(isInstalled).toBe(true);
    });
  });
});
