import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'next-themes';
import { Header } from '@/app/header';
import { jest } from '@jest/globals';

// Mock next/link for navigation testing
jest.mock('next/link', () => {
  return function MockLink({ children, href, onClick, ...props }: any) {
    return (
      <a href={href} onClick={onClick} {...props}>
        {children}
      </a>
    );
  };
});

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}));

// Mock components
jest.mock('@/components/ui/text-effect', () => {
  return function MockTextEffect({ children, ...props }: any) {
    return <p {...props}>{children}</p>;
  };
});

jest.mock('@/components/ui/utility-bar', () => {
  return function MockUtilityBar() {
    return <div data-testid="utility-bar" />;
  };
});

// Viewport size constants
const VIEWPORTS = {
  MOBILE_SMALL: { width: 375, height: 667 },   // iPhone SE
  MOBILE_LARGE: { width: 414, height: 896 },   // iPhone 11
  TABLET: { width: 768, height: 1024 },        // iPad
  DESKTOP_SMALL: { width: 1024, height: 768 }, // Small desktop
  DESKSKTOP_LARGE: { width: 1440, height: 900 }, // Large desktop
};

// Helper to set viewport size
const setViewport = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });

  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

// Helper function to render component with theme provider
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light">
      {component}
    </ThemeProvider>
  );
};

describe('Responsive Navigation Integration Tests', () => {
  let user: any;

  beforeEach(() => {
    user = userEvent.setup();
    // Reset to desktop size by default
    setViewport(VIEWPORTS.DESKPTOP_LARGE.width, VIEWPORTS.DESKPTOP_LARGE.height);
  });

  describe('Mobile Breakpoint Testing (< 640px)', () => {
    it('should show hamburger menu on small mobile screens', () => {
      setViewport(VIEWPORTS.MOBILE_SMALL.width, VIEWPORTS.MOBILE_SMALL.height);

      renderWithTheme(<Header />);

      // Mobile menu button should be visible
      expect(screen.getByTestId('menu-toggle')).toBeInTheDocument();
      expect(screen.getByTestId('menu-toggle')).toHaveAttribute('aria-label', 'Open menu');

      // Desktop navigation should be hidden
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('should show hamburger menu on large mobile screens', () => {
      setViewport(VIEWPORTS.MOBILE_LARGE.width, VIEWPORTS.MOBILE_LARGE.height);

      renderWithTheme(<Header />);

      // Mobile menu button should be visible
      expect(screen.getByTestId('menu-toggle')).toBeInTheDocument();

      // Desktop navigation should be hidden
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('should handle complete mobile menu workflow', async () => {
      setViewport(VIEWPORTS.MOBILE_SMALL.width, VIEWPORTS.MOBILE_SMALL.height);

      renderWithTheme(<Header />);

      // 1. Verify initial state
      const menuToggle = screen.getByTestId('menu-toggle');
      expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByTestId('mobile-menu-panel')).not.toBeInTheDocument();

      // 2. Open menu
      await user.click(menuToggle);
      expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByTestId('mobile-menu-panel')).toBeInTheDocument();

      // Verify all menu items are present
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();

      // 3. Close menu via close button
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);
      expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByTestId('mobile-menu-panel')).not.toBeInTheDocument();

      // 4. Open menu again and close via navigation link
      await user.click(menuToggle);
      expect(screen.getByTestId('mobile-menu-panel')).toBeInTheDocument();

      const homeLink = screen.getByRole('link', { name: /home/i });
      await user.click(homeLink);

      expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByTestId('mobile-menu-panel')).not.toBeInTheDocument();
    });

    it('should handle escape key to close mobile menu', async () => {
      setViewport(VIEWPORTS.MOBILE_SMALL.width, VIEWPORTS.MOBILE_SMALL.height);

      renderWithTheme(<Header />);

      // Open menu
      const menuToggle = screen.getByTestId('menu-toggle');
      await user.click(menuToggle);
      expect(screen.getByTestId('mobile-menu-panel')).toBeInTheDocument();

      // Press escape key
      fireEvent.keyDown(document, { key: 'Escape' });

      expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByTestId('mobile-menu-panel')).not.toBeInTheDocument();
    });
  });

  describe('Tablet Breakpoint Testing (640px - 1024px)', () => {
    it('should show hamburger menu on tablet screens', () => {
      setViewport(VIEWPORTS.TABLET.width, VIEWPORTS.TABLET.height);

      renderWithTheme(<Header />);

      // Mobile menu button should be visible
      expect(screen.getByTestId('menu-toggle')).toBeInTheDocument();

      // Desktop navigation should still be hidden (only shows on lg: 1024px+)
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('should handle tablet menu interactions correctly', async () => {
      setViewport(VIEWPORTS.TABLET.width, VIEWPORTS.TABLET.height);

      renderWithTheme(<Header />);

      const menuToggle = screen.getByTestId('menu-toggle');

      // Test open/close workflow
      await user.click(menuToggle);
      expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByTestId('mobile-menu-panel')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /close/i }));
      expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
    });

    it('should handle edge case at exactly 1023px', () => {
      setViewport(1023, 768);

      renderWithTheme(<Header />);

      // Should still show mobile menu (lg: breakpoint starts at 1024px)
      expect(screen.getByTestId('menu-toggle')).toBeInTheDocument();
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });
  });

  describe('Desktop Breakpoint Testing (> 1024px)', () => {
    it('should show desktop navigation on small desktop screens', () => {
      setViewport(VIEWPORTS.DESKTOP_SMALL.width, VIEWPORTS.DESKTOP_SMALL.height);

      renderWithTheme(<Header />);

      // Desktop navigation should be visible
      expect(screen.getByRole('navigation')).toBeInTheDocument();

      // Mobile menu should be hidden
      expect(screen.queryByTestId('menu-toggle')).not.toBeInTheDocument();
    });

    it('should show desktop navigation on large desktop screens', () => {
      setViewport(VIEWPORTS.DESKPTOP_LARGE.width, VIEWPORTS.DESKPTOP_LARGE.height);

      renderWithTheme(<Header />);

      // Desktop navigation should be visible
      expect(screen.getByRole('navigation')).toBeInTheDocument();

      // Mobile menu should be hidden
      expect(screen.queryByTestId('menu-toggle')).not.toBeInTheDocument();
    });

    it('should render all desktop navigation links correctly', () => {
      setViewport(VIEWPORTS.DESKPTOP_LARGE.width, VIEWPORTS.DESKPTOP_LARGE.height);

      renderWithTheme(<Header />);

      const navigation = screen.getByRole('navigation');

      // Check all navigation links are present
      expect(navigation).toContainElement(screen.getByRole('link', { name: /home/i }));
      expect(navigation).toContainElement(screen.getByRole('link', { name: /about/i }));
      expect(navigation).toContainElement(screen.getByRole('link', { name: /projects/i }));

      // Verify correct hrefs
      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', 'https://work.randyellis.design');
      expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about');
      expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute('href', '/projects');
    });

    it('should handle edge case at exactly 1024px', () => {
      setViewport(1024, 768);

      renderWithTheme(<Header />);

      // Should show desktop navigation (lg: breakpoint starts at 1024px)
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.queryByTestId('menu-toggle')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Transition Testing', () => {
    it('should handle mobile to desktop transition', async () => {
      // Start with mobile
      setViewport(VIEWPORTS.MOBILE_SMALL.width, VIEWPORTS.MOBILE_SMALL.height);

      const { rerender } = renderWithTheme(<Header />);

      // Verify mobile state
      expect(screen.getByTestId('menu-toggle')).toBeInTheDocument();
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();

      // Transition to desktop
      setViewport(VIEWPORTS.DESKPTOP_LARGE.width, VIEWPORTS.DESKPTOP_LARGE.height);

      rerender(
        <ThemeProvider attribute="class" defaultTheme="light">
          <Header />
        </ThemeProvider>
      );

      // Verify desktop state
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.queryByTestId('menu-toggle')).not.toBeInTheDocument();
    });

    it('should handle desktop to mobile transition', async () => {
      // Start with desktop
      setViewport(VIEWPORTS.DESKPTOP_LARGE.width, VIEWPORTS.DESKPTOP_LARGE.height);

      const { rerender } = renderWithTheme(<Header />);

      // Verify desktop state
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.queryByTestId('menu-toggle')).not.toBeInTheDocument();

      // Transition to mobile
      setViewport(VIEWPORTS.MOBILE_SMALL.width, VIEWPORTS.MOBILE_SMALL.height);

      rerender(
        <ThemeProvider attribute="class" defaultTheme="light">
          <Header />
        </ThemeProvider>
      );

      // Verify mobile state
      expect(screen.getByTestId('menu-toggle')).toBeInTheDocument();
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('should handle tablet to desktop transition', async () => {
      // Start with tablet
      setViewport(VIEWPORTS.TABLET.width, VIEWPORTS.TABLET.height);

      const { rerender } = renderWithTheme(<Header />);

      // Verify tablet state (shows mobile menu)
      expect(screen.getByTestId('menu-toggle')).toBeInTheDocument();
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();

      // Transition to desktop
      setViewport(VIEWPORTS.DESKTOP_SMALL.width, VIEWPORTS.DESKTOP_SMALL.height);

      rerender(
        <ThemeProvider attribute="class" defaultTheme="light">
          <Header />
        </ThemeProvider>
      );

      // Verify desktop state
      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.queryByTestId('menu-toggle')).not.toBeInTheDocument();
    });
  });

  describe('Performance and Accessibility Across Breakpoints', () => {
    it('should maintain accessibility attributes across all breakpoints', () => {
      const viewports = [
        VIEWPORTS.MOBILE_SMALL,
        VIEWPORTS.MOBILE_LARGE,
        VIEWPORTS.TABLET,
        VIEWPORTS.DESKTOP_SMALL,
        VIEWPORTS.DESKPTOP_LARGE,
      ];

      viewports.forEach(viewport => {
        // Clean up previous render
        document.body.innerHTML = '';

        setViewport(viewport.width, viewport.height);

        const { unmount } = renderWithTheme(<Header />);

        // Check header accessibility
        const header = screen.getByRole('banner');
        expect(header).toBeInTheDocument();

        // Check that appropriate navigation is present
        if (viewport.width < 1024) {
          // Mobile/tablet - should have mobile menu
          const menuToggle = screen.getByTestId('menu-toggle');
          expect(menuToggle).toHaveAttribute('aria-label');
          expect(menuToggle).toHaveAttribute('aria-expanded');
        } else {
          // Desktop - should have desktop navigation
          const navigation = screen.getByRole('navigation');
          expect(navigation).toBeInTheDocument();

          // Check all links have proper attributes
          const links = navigation.querySelectorAll('a');
          links.forEach(link => {
            expect(link).toHaveAttribute('href');
          });
        }

        unmount();
      });
    });

    it('should handle theme consistency across breakpoints', () => {
      const viewports = [VIEWPORTS.MOBILE_SMALL, VIEWPORTS.DESKPTOP_LARGE];

      viewports.forEach(viewport => {
        document.body.innerHTML = '';

        setViewport(viewport.width, viewport.height);

        const { unmount } = renderWithTheme(<Header />);

        // Check theme classes are applied
        const siteTitle = screen.getByRole('link', { name: /randy ellis/i });
        expect(siteTitle).toHaveClass('text-black', 'dark:text-white');

        unmount();
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle very small viewports', () => {
      setViewport(320, 480); // Very small mobile

      renderWithTheme(<Header />);

      expect(screen.getByTestId('menu-toggle')).toBeInTheDocument();
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('should handle very large viewports', () => {
      setViewport(2560, 1440); // 4K display

      renderWithTheme(<Header />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.queryByTestId('menu-toggle')).not.toBeInTheDocument();
    });

    it('should handle unusual aspect ratios', () => {
      setViewport(768, 1024); // Portrait tablet

      renderWithTheme(<Header />);

      expect(screen.getByTestId('menu-toggle')).toBeInTheDocument();
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('should handle rapid viewport changes', async () => {
      const { rerender } = renderWithTheme(<Header />);

      // Rapid viewport changes
      const viewports = [320, 500, 768, 1024, 1200, 500, 1024];

      for (const width of viewports) {
        setViewport(width, 768);

        rerender(
          <ThemeProvider attribute="class" defaultTheme="light">
            <Header />
          </ThemeProvider>
        );

        // Should not throw errors and should render appropriate navigation
        if (width < 1024) {
          expect(screen.getByTestId('menu-toggle')).toBeInTheDocument();
        } else {
          expect(screen.getByRole('navigation')).toBeInTheDocument();
        }
      }
    });
  });
});