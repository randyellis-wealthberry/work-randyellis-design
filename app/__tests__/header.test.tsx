import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "next-themes";
import { Header } from "../header";
import { jest } from "@jest/globals";

// Mock next/link
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: jest.fn(),
  }),
}));

// Mock TextEffect component
jest.mock("@/components/ui/text-effect", () => {
  return function MockTextEffect({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) {
    return <p {...props}>{children}</p>;
  };
});

// Mock MobileMenu component
jest.mock("@/components/ui/mobile-menu", () => {
  return function MockMobileMenu({
    isOpen,
    onOpenChange,
  }: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
  }) {
    return (
      <div data-testid="mobile-menu">
        <button
          data-testid="menu-toggle"
          onClick={() => onOpenChange(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? "×" : "☰"}
        </button>
        {isOpen && (
          <div data-testid="mobile-menu-panel">
            <button onClick={() => onOpenChange(false)}>Close</button>
            {/* Using spans instead of anchors to avoid Next.js lint errors in tests */}
            <span role="link" onClick={() => onOpenChange(false)}>
              Home
            </span>
            <span role="link" onClick={() => onOpenChange(false)}>
              About
            </span>
            <span role="link" onClick={() => onOpenChange(false)}>
              Projects
            </span>
          </div>
        )}
      </div>
    );
  };
});

// Mock UtilityBar component
jest.mock("@/components/ui/utility-bar", () => {
  return function MockUtilityBar() {
    return <div data-testid="utility-bar" />;
  };
});

// Helper function to render component with theme provider
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light">
      {component}
    </ThemeProvider>,
  );
};

describe("Header Component", () => {
  beforeEach(() => {
    // Reset viewport to desktop
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1200,
    });
  });

  describe("Responsive Layout", () => {
    it("should show desktop navigation on large screens", () => {
      // Mock desktop viewport
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1200,
      });

      renderWithTheme(<Header />);

      // Check desktop navigation is visible
      const desktopNav = screen.getByRole("navigation");
      expect(desktopNav).toBeInTheDocument();
      expect(desktopNav).toHaveClass("hidden", "lg:flex");

      // Check mobile menu is not visible
      const mobileMenu = screen.queryByTestId("mobile-menu");
      expect(mobileMenu).not.toBeInTheDocument();
    });

    it("should show mobile menu button on small screens", () => {
      // Mock mobile viewport
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });

      renderWithTheme(<Header />);

      // Check mobile menu button is visible
      const mobileMenuToggle = screen.getByTestId("menu-toggle");
      expect(mobileMenuToggle).toBeInTheDocument();
      expect(mobileMenuToggle).toHaveAttribute("aria-label", "Open menu");
      expect(mobileMenuToggle).toHaveAttribute("aria-expanded", "false");

      // Check desktop navigation is hidden
      const desktopNav = screen.queryByRole("navigation");
      expect(desktopNav).not.toBeInTheDocument();
    });

    it("should show mobile menu button on tablet screens", () => {
      // Mock tablet viewport
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 768,
      });

      renderWithTheme(<Header />);

      // Check mobile menu button is visible
      const mobileMenuToggle = screen.getByTestId("menu-toggle");
      expect(mobileMenuToggle).toBeInTheDocument();

      // Check desktop navigation is hidden
      const desktopNav = screen.queryByRole("navigation");
      expect(desktopNav).not.toBeInTheDocument();
    });
  });

  describe("Desktop Navigation", () => {
    beforeEach(() => {
      // Mock desktop viewport
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1200,
      });
    });

    it("should render all desktop navigation links", () => {
      renderWithTheme(<Header />);

      const homeLink = screen.getByRole("link", { name: /home/i });
      const aboutLink = screen.getByRole("link", { name: /about/i });
      const projectsLink = screen.getByRole("link", { name: /projects/i });

      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute(
        "href",
        "https://work.randyellis.design",
      );

      expect(aboutLink).toBeInTheDocument();
      expect(aboutLink).toHaveAttribute("href", "/about");

      expect(projectsLink).toBeInTheDocument();
      expect(projectsLink).toHaveAttribute("href", "/projects");
    });

    it("should apply correct styling classes to desktop navigation", () => {
      renderWithTheme(<Header />);

      const desktopNav = screen.getByRole("navigation");
      expect(desktopNav).toHaveClass(
        "hidden",
        "lg:flex",
        "lg:flex-row",
        "lg:items-center",
        "lg:gap-8",
        "xl:gap-16",
      );
    });

    it("should have proper hover states on desktop links", () => {
      renderWithTheme(<Header />);

      const homeLink = screen.getByRole("link", { name: /home/i });
      expect(homeLink).toHaveClass(
        "hover:bg-zinc-100",
        "hover:text-zinc-900",
        "dark:hover:bg-zinc-800",
        "dark:hover:text-zinc-100",
      );
    });
  });

  describe("Mobile Integration", () => {
    beforeEach(() => {
      // Mock mobile viewport
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });
    });

    it("should integrate mobile menu state correctly", async () => {
      const user = userEvent.setup();
      renderWithTheme(<Header />);

      const menuToggle = screen.getByTestId("menu-toggle");
      expect(menuToggle).toHaveAttribute("aria-expanded", "false");

      // Open menu
      await user.click(menuToggle);
      expect(menuToggle).toHaveAttribute("aria-expanded", "true");

      // Close menu via close button
      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);
      expect(menuToggle).toHaveAttribute("aria-expanded", "false");
    });

    it("should close mobile menu when navigation link is clicked", async () => {
      const user = userEvent.setup();
      renderWithTheme(<Header />);

      // Open menu
      const menuToggle = screen.getByTestId("menu-toggle");
      await user.click(menuToggle);
      expect(menuToggle).toHaveAttribute("aria-expanded", "true");

      // Click navigation link
      const homeLink = screen.getByRole("link", { name: /home/i });
      await user.click(homeLink);

      // Menu should close
      await waitFor(() => {
        expect(menuToggle).toHaveAttribute("aria-expanded", "false");
      });
    });
  });

  describe("Header Content", () => {
    it("should render site title correctly", () => {
      renderWithTheme(<Header />);

      const siteTitle = screen.getByRole("link", { name: /randy ellis/i });
      expect(siteTitle).toBeInTheDocument();
      expect(siteTitle).toHaveAttribute(
        "href",
        "https://work.randyellis.design",
      );
      expect(siteTitle).toHaveClass("font-medium", "whitespace-nowrap");
    });

    it("should render subtitle correctly", () => {
      renderWithTheme(<Header />);

      const subtitle = screen.getByText(
        "Generative AI & Product Design Engineer",
      );
      expect(subtitle).toBeInTheDocument();
      expect(subtitle).toHaveClass("whitespace-nowrap");
    });

    it("should apply correct responsive classes to header", () => {
      renderWithTheme(<Header />);

      const header = screen.getByRole("banner");
      expect(header).toHaveClass(
        "mb-6",
        "flex",
        "flex-col",
        "gap-4",
        "sm:mb-8",
        "sm:flex-row",
        "sm:items-center",
        "sm:justify-between",
        "sm:gap-6",
        "lg:mb-12",
      );
    });

    it("should apply correct responsive classes to header content area", () => {
      renderWithTheme(<Header />);

      const headerContent = screen
        .getByRole("banner")
        .querySelector(".flex.items-center.justify-between");
      expect(headerContent).toHaveClass("pt-8", "sm:pt-24");
    });
  });

  describe("Accessibility", () => {
    it("should have proper landmark roles", () => {
      renderWithTheme(<Header />);

      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();

      const desktopNav = screen.queryByRole("navigation");
      if (desktopNav) {
        expect(desktopNav).toBeInTheDocument();
      }
    });

    it("should have proper ARIA attributes on mobile menu button", () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });

      renderWithTheme(<Header />);

      const menuToggle = screen.getByTestId("menu-toggle");
      expect(menuToggle).toHaveAttribute("aria-label");
      expect(menuToggle).toHaveAttribute("aria-expanded");
    });

    it("should maintain minimum touch target sizes", () => {
      renderWithTheme(<Header />);

      // Check desktop navigation links
      const desktopLinks = screen.queryAllByRole("link");
      desktopLinks.forEach((link) => {
        if (link.closest(".lg:flex")) {
          expect(link).toHaveClass("min-h-[44px]");
        }
      });
    });
  });

  describe("Theme Integration", () => {
    it("should apply dark mode classes correctly", () => {
      renderWithTheme(<Header />);

      const siteTitle = screen.getByRole("link", { name: /randy ellis/i });
      expect(siteTitle).toHaveClass("text-black", "dark:text-white");

      const subtitle = screen.getByText(
        "Generative AI & Product Design Engineer",
      );
      expect(subtitle).toHaveClass("text-zinc-600", "dark:text-zinc-500");
    });
  });

  describe("Breakpoint Transitions", () => {
    it("should handle viewport changes correctly", async () => {
      const { rerender } = renderWithTheme(<Header />);

      // Start with desktop
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1200,
      });

      expect(screen.getByRole("navigation")).toBeInTheDocument();
      expect(screen.queryByTestId("mobile-menu")).not.toBeInTheDocument();

      // Change to mobile
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });

      rerender(
        <ThemeProvider attribute="class" defaultTheme="light">
          <Header />
        </ThemeProvider>,
      );

      expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
      expect(screen.getByTestId("mobile-menu")).toBeInTheDocument();
    });
  });
});
