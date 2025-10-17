import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { MobileMenu } from "../mobile-menu";
import { jest } from "@jest/globals";

// Mock next/link
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    onClick,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    onClick?: (event: React.MouseEvent) => void;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} onClick={onClick} {...props}>
        {children}
      </a>
    );
  };
});

// Mock next-themes
const mockSetTheme = jest.fn();
jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: mockSetTheme,
  }),
}));

// Helper function to render component with theme provider
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light">
      {component}
    </ThemeProvider>,
  );
};

describe("MobileMenu", () => {
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    mockOnOpenChange.mockClear();
    mockSetTheme.mockClear();
    // Reset body overflow
    document.body.style.overflow = "";
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  describe("Responsive Behavior", () => {
    it("should render hamburger menu button on mobile screens", () => {
      // Mock mobile viewport
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });

      renderWithTheme(
        <MobileMenu isOpen={false} onOpenChange={mockOnOpenChange} />,
      );

      const menuButton = screen.getByRole("button", { name: /open menu/i });
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toHaveClass("lg:hidden");
    });

    it("should render hamburger menu button on tablet screens", () => {
      // Mock tablet viewport
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 768,
      });

      renderWithTheme(
        <MobileMenu isOpen={false} onOpenChange={mockOnOpenChange} />,
      );

      const menuButton = screen.getByRole("button", { name: /open menu/i });
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toHaveClass("lg:hidden");
    });

    it("should not render hamburger menu button on desktop screens", () => {
      // Mock desktop viewport
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1200,
      });

      renderWithTheme(
        <MobileMenu isOpen={false} onOpenChange={mockOnOpenChange} />,
      );

      const menuButton = screen.queryByRole("button", { name: /open menu/i });
      expect(menuButton).not.toBeInTheDocument();
    });
  });

  describe("Menu Open/Close Functionality", () => {
    it("should open menu when hamburger button is clicked", async () => {
      const user = userEvent.setup();

      renderWithTheme(
        <MobileMenu isOpen={false} onOpenChange={mockOnOpenChange} />,
      );

      const menuButton = screen.getByRole("button", { name: /open menu/i });
      await user.click(menuButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(true);
    });

    it("should show menu overlay and panel when isOpen is true", () => {
      renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      // Check for dialog
      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("aria-modal", "true");

      // Check for menu title
      const menuTitle = screen.getByRole("heading", { name: /menu/i });
      expect(menuTitle).toBeInTheDocument();

      // Check for close button
      const closeButton = screen.getByRole("button", { name: /close menu/i });
      expect(closeButton).toBeInTheDocument();

      // Check for navigation links
      expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /projects/i }),
      ).toBeInTheDocument();
    });

    it("should close menu when close button is clicked", async () => {
      const user = userEvent.setup();

      renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      const closeButton = screen.getByRole("button", { name: /close menu/i });
      await user.click(closeButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("should close menu when backdrop is clicked", async () => {
      const user = userEvent.setup();

      renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      const backdrop =
        screen.getByTestId("backdrop") ||
        document.querySelector('[aria-hidden="true"]');

      if (backdrop) {
        await user.click(backdrop);
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      }
    });

    it("should close menu when escape key is pressed", async () => {
      renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      fireEvent.keyDown(document, { key: "Escape" });
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("should not close menu when other keys are pressed", async () => {
      renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      fireEvent.keyDown(document, { key: "Enter" });
      expect(mockOnOpenChange).not.toHaveBeenCalled();
    });
  });

  describe("Navigation Functionality", () => {
    it("should close menu when navigation link is clicked", async () => {
      const user = userEvent.setup();

      renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      const homeLink = screen.getByRole("link", { name: /home/i });
      await user.click(homeLink);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("should render all navigation links with correct attributes", () => {
      renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      const homeLink = screen.getByRole("link", { name: /home/i });
      const aboutLink = screen.getByRole("link", { name: /about/i });
      const projectsLink = screen.getByRole("link", { name: /projects/i });

      expect(homeLink).toHaveAttribute(
        "href",
        "https://work.randyellis.design",
      );
      expect(aboutLink).toHaveAttribute("href", "/about");
      expect(projectsLink).toHaveAttribute("href", "/projects");

      // Check for minimum touch target size (44px)
      expect(homeLink).toHaveClass("min-h-[44px]");
      expect(aboutLink).toHaveClass("min-h-[44px]");
      expect(projectsLink).toHaveClass("min-h-[44px]");
    });

    it("should show arrow indicators on link hover", () => {
      renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      const homeLink = screen.getByRole("link", { name: /home/i });
      const arrow = homeLink.querySelector("span");

      expect(arrow).toBeInTheDocument();
      expect(arrow).toHaveClass("opacity-0");
      expect(arrow).toHaveClass("group-hover:opacity-100");
    });
  });

  describe("Theme Toggle Functionality", () => {
    it("should render theme toggle button", () => {
      renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      const themeButton = screen.getByRole("button", {
        name: /switch to dark theme/i,
      });
      expect(themeButton).toBeInTheDocument();
    });

    it("should toggle theme when button is clicked", async () => {
      const user = userEvent.setup();

      renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      const themeButton = screen.getByRole("button", {
        name: /switch to dark theme/i,
      });
      await user.click(themeButton);

      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });

    it("should show correct theme state", () => {
      // Mock dark theme
      jest.doMock("next-themes", () => ({
        useTheme: () => ({
          theme: "dark",
          setTheme: mockSetTheme,
        }),
      }));

      renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      const themeButton = screen.getByRole("button", {
        name: /switch to light theme/i,
      });
      expect(themeButton).toBeInTheDocument();
    });
  });

  describe("Accessibility Features", () => {
    it("should have proper ARIA attributes", () => {
      renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAttribute("aria-modal", "true");
      expect(dialog).toHaveAttribute("aria-labelledby", "mobile-menu-title");

      const menuTitle = screen.getByRole("heading", { name: /menu/i });
      expect(menuTitle).toHaveAttribute("id", "mobile-menu-title");

      const navigation = screen.getByRole("navigation");
      expect(navigation).toHaveAttribute("aria-label", "main navigation");

      const menuButton = screen.getByRole("button", { name: /open menu/i });
      expect(menuButton).toHaveAttribute("aria-expanded", "true");
    });

    it("should manage focus when menu opens", () => {
      renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      const closeButton = screen.getByRole("button", { name: /close menu/i });
      expect(closeButton).toHaveFocus();
    });

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup();

      renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      // Tab through menu items
      await user.tab();
      expect(screen.getByRole("link", { name: /home/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("link", { name: /about/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("link", { name: /projects/i })).toHaveFocus();
    });

    it("should have proper button labels", () => {
      renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      const openButton = screen.getByRole("button", { name: /open menu/i });
      const closeButton = screen.getByRole("button", { name: /close menu/i });
      const themeButton = screen.getByRole("button", {
        name: /switch to dark theme/i,
      });

      expect(openButton).toHaveAttribute("aria-label", "Open menu");
      expect(closeButton).toHaveAttribute("aria-label", "Close menu");
      expect(themeButton).toHaveAttribute("aria-label", "Switch to dark theme");
    });
  });

  describe("Body Scroll Lock", () => {
    it("should lock body scroll when menu opens", () => {
      renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      expect(document.body.style.overflow).toBe("hidden");
    });

    it("should unlock body scroll when menu closes", () => {
      const { rerender } = renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      expect(document.body.style.overflow).toBe("hidden");

      rerender(
        <ThemeProvider attribute="class" defaultTheme="light">
          <MobileMenu isOpen={false} onOpenChange={mockOnOpenChange} />
        </ThemeProvider>,
      );

      expect(document.body.style.overflow).toBe("unset");
    });

    it("should clean up body overflow on unmount", () => {
      const { unmount } = renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      expect(document.body.style.overflow).toBe("hidden");

      unmount();

      expect(document.body.style.overflow).toBe("unset");
    });
  });

  describe("Visual Consistency", () => {
    it("should apply correct CSS classes for styling", () => {
      renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveClass("fixed", "inset-0", "z-50", "lg:hidden");

      const menuPanel = document.querySelector("#mobile-menu");
      expect(menuPanel).toHaveClass(
        "fixed",
        "right-0",
        "top-0",
        "h-full",
        "w-full",
        "max-w-sm",
        "bg-white",
        "dark:bg-zinc-950",
        "shadow-2xl",
        "transition-transform",
        "duration-300",
        "ease-in-out",
      );
    });

    it("should show footer info", () => {
      renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      expect(screen.getByText(/© 2024 Randy Ellis/)).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid open/close clicks", async () => {
      const user = userEvent.setup();

      renderWithTheme(
        <MobileMenu isOpen={false} onOpenChange={mockOnOpenChange} />,
      );

      const menuButton = screen.getByRole("button", { name: /open menu/i });

      // Rapid clicks
      await user.click(menuButton);
      await user.click(menuButton);
      await user.click(menuButton);

      expect(mockOnOpenChange).toHaveBeenCalledTimes(3);
      expect(mockOnOpenChange).toHaveBeenLastCalledWith(true);
    });

    it("should handle multiple escape key presses", () => {
      renderWithTheme(
        <MobileMenu isOpen={true} onOpenChange={mockOnOpenChange} />,
      );

      fireEvent.keyDown(document, { key: "Escape" });
      fireEvent.keyDown(document, { key: "Escape" });
      fireEvent.keyDown(document, { key: "Escape" });

      expect(mockOnOpenChange).toHaveBeenCalledTimes(3);
      expect(mockOnOpenChange).toHaveBeenLastCalledWith(false);
    });

    it("should not render menu content when closed", () => {
      renderWithTheme(
        <MobileMenu isOpen={false} onOpenChange={mockOnOpenChange} />,
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /close menu/i }),
      ).not.toBeInTheDocument();
    });
  });
});
