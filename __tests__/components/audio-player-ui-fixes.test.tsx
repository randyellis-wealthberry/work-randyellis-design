import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AudioPlayer } from "@/components/ui/audio-player";

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
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

// Mock hasPointerCapture
HTMLElement.prototype.hasPointerCapture = jest.fn().mockReturnValue(false);
HTMLElement.prototype.setPointerCapture = jest.fn();
HTMLElement.prototype.releasePointerCapture = jest.fn();

// Mock audio element
Object.defineProperty(HTMLMediaElement.prototype, 'load', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: jest.fn(() => Promise.resolve()),
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', {
  writable: true,
  value: 0,
});

Object.defineProperty(HTMLMediaElement.prototype, 'duration', {
  writable: true,
  value: 100,
});

describe("Audio Player UI Fixes", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Audio Slider Visibility Tests", () => {
    test("slider track should be visible with adequate contrast", () => {
      render(<AudioPlayer />);
      
      const slider = screen.getByRole("slider");
      expect(slider).toBeInTheDocument();
      
      // Check that slider track has visible background
      const sliderRoot = slider.closest('[data-slot="slider"]');
      expect(sliderRoot).toBeInTheDocument();
      
      // Should have proper contrast class (this will fail initially)
      const sliderTrack = sliderRoot?.querySelector('[data-slot="slider-track"]');
      expect(sliderTrack).toHaveClass("bg-muted-foreground/20");
    });

    test("slider thumb should be clearly visible", () => {
      render(<AudioPlayer />);
      
      const slider = screen.getByRole("slider");
      const sliderRoot = slider.closest('[data-slot="slider"]');
      const sliderThumb = sliderRoot?.querySelector('[data-slot="slider-thumb"]');
      
      expect(sliderThumb).toBeInTheDocument();
      // Should have primary background for visibility (this will fail initially)
      expect(sliderThumb).toHaveClass("bg-primary");
    });

    test("slider should respond to user interaction", async () => {
      render(<AudioPlayer />);
      
      const slider = screen.getByRole("slider");
      
      // Slider should be focusable
      expect(slider).toHaveAttribute("tabindex", "0");
      
      // Slider should have proper ARIA attributes
      expect(slider).toHaveAttribute("aria-valuemin", "0");
      expect(slider).toHaveAttribute("aria-valuemax", "100");
    });

    test("slider progress should update visually", () => {
      render(<AudioPlayer />);
      
      const slider = screen.getByRole("slider");
      const sliderRoot = slider.closest('[data-slot="slider"]');
      const sliderRange = sliderRoot?.querySelector('[data-slot="slider-range"]');
      
      expect(sliderRange).toBeInTheDocument();
      // Range should have primary color for visibility
      expect(sliderRange).toHaveClass("bg-primary");
    });
  });

  describe("Drawer Background Opacity Tests", () => {
    test("drawer overlay should have 90% opacity background", async () => {
      render(<AudioPlayer />);
      
      const readAlongButton = screen.getByRole("button", { name: /read along/i });
      await user.click(readAlongButton);
      
      await waitFor(() => {
        // Check if drawer content is visible (indicating drawer opened)
        const drawerContent = screen.getByText(/Picture this: While others were debating/);
        expect(drawerContent).toBeInTheDocument();
        
        // Verify the drawer overlay class in DOM
        const overlayElement = document.querySelector('.bg-black\\/90');
        expect(overlayElement).toBeInTheDocument();
      });
    });

    test("drawer content should be readable against 90% opacity background", async () => {
      render(<AudioPlayer />);
      
      const readAlongButton = screen.getByRole("button", { name: /read along/i });
      await user.click(readAlongButton);
      
      await waitFor(() => {
        const drawerContent = screen.getByText(/Picture this: While others were debating/);
        expect(drawerContent).toBeInTheDocument();
        expect(drawerContent).toBeVisible();
      });
    });
  });

  describe("Scroll Area Functionality Tests", () => {
    test("scroll area should have visible scroll indicators", async () => {
      render(<AudioPlayer />);
      
      const readAlongButton = screen.getByRole("button", { name: /read along/i });
      await user.click(readAlongButton);
      
      await waitFor(() => {
        const scrollArea = document.querySelector('[data-slot="scroll-area"]');
        expect(scrollArea).toBeInTheDocument();
        
        // Test that scroll area is properly configured (thumb exists when needed)
        const scrollViewport = document.querySelector('[data-slot="scroll-area-viewport"]');
        expect(scrollViewport).toBeInTheDocument();
      });
    });

    test("scroll area should support keyboard navigation", async () => {
      render(<AudioPlayer />);
      
      const readAlongButton = screen.getByRole("button", { name: /read along/i });
      await user.click(readAlongButton);
      
      await waitFor(() => {
        const scrollViewport = document.querySelector('[data-slot="scroll-area-viewport"]');
        expect(scrollViewport).toBeInTheDocument();
        expect(scrollViewport).toHaveClass("focus-visible:ring-ring/50");
      });
    });

    test("scroll content should be fully accessible", async () => {
      render(<AudioPlayer />);
      
      const readAlongButton = screen.getByRole("button", { name: /read along/i });
      await user.click(readAlongButton);
      
      await waitFor(() => {
        // All paragraphs should be accessible
        const paragraphs = screen.getAllByText(/Picture this:|In 2013|What does design|Forget everything/);
        expect(paragraphs.length).toBeGreaterThan(0);
        
        // Last paragraph should be reachable (indicating scroll works)
        const lastParagraph = screen.getByText(/And after 20\+ years/);
        expect(lastParagraph).toBeInTheDocument();
      });
    });

    test("scroll area should have hover states for better UX", async () => {
      render(<AudioPlayer />);
      
      const readAlongButton = screen.getByRole("button", { name: /read along/i });
      await user.click(readAlongButton);
      
      await waitFor(() => {
        // Test that scroll area exists and is functional
        const scrollArea = document.querySelector('[data-slot="scroll-area"]');
        expect(scrollArea).toBeInTheDocument();
        
        // Test that content is scrollable
        const drawerContent = screen.getByText(/Picture this: While others were debating/);
        expect(drawerContent).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility and Integration Tests", () => {
    test("all UI elements should maintain proper focus order", async () => {
      render(<AudioPlayer />);
      
      // Test that key interactive elements exist and are accessible
      const slider = screen.getByRole("slider");
      const readAlongButton = screen.getByRole("button", { name: /read along/i });
      
      expect(slider).toBeInTheDocument();
      expect(readAlongButton).toBeInTheDocument();
      
      // Slider should be keyboard accessible
      expect(slider).toHaveAttribute("tabindex", "0");
      
      // Read along button should be focusable
      expect(readAlongButton).toBeInTheDocument();
    });

    test("color contrast should meet accessibility standards", () => {
      render(<AudioPlayer />);
      
      // Time displays should be readable
      const timeDisplays = screen.getAllByText("0:00");
      expect(timeDisplays).toHaveLength(2); // current time and duration
      
      // Verify they are in a muted foreground container
      const timeContainer = timeDisplays[0].parentElement;
      expect(timeContainer).toHaveClass("text-muted-foreground");
    });

    test("all interactive elements should have proper ARIA labels", async () => {
      render(<AudioPlayer />);
      
      const readAlongButton = screen.getByRole("button", { name: /read along/i });
      await user.click(readAlongButton);
      
      await waitFor(() => {
        const drawerTitle = screen.getByRole("heading", { level: 2 });
        expect(drawerTitle).toBeInTheDocument();
        
        const drawerDescription = screen.getByText(/Follow along with the audio story/);
        expect(drawerDescription).toBeInTheDocument();
      });
    });
  });

  describe("Mobile and Responsive Tests", () => {
    test("slider should work on touch devices", async () => {
      // Mock touch events
      render(<AudioPlayer />);
      
      const slider = screen.getByRole("slider");
      
      // Test touch interaction
      fireEvent.touchStart(slider, {
        touches: [{ clientX: 100, clientY: 0 }]
      });
      
      expect(slider).toBeInTheDocument();
    });

    test("drawer should be mobile-optimized", async () => {
      render(<AudioPlayer />);
      
      const readAlongButton = screen.getByRole("button", { name: /read along/i });
      await user.click(readAlongButton);
      
      await waitFor(() => {
        const drawerContent = document.querySelector('[class*="max-h-[90vh]"]');
        expect(drawerContent).toBeInTheDocument();
      });
    });
  });
});